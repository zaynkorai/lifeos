import OpenAI from 'openai';
import { config } from '../../config.js';
import { Task } from '../tasks/tasks.schema.js';
import { PlanDayResponse, PlanDayResponseSchema, TaskBreakdownResponse, TaskBreakdownResponseSchema } from './ai.schema.js';

interface CalendarEvent {
    title: string;
    start_time: string;
    end_time: string;
    is_all_day: boolean;
}

interface UserPreferences {
    timezone: string;
    peakHoursStart?: string;
    peakHoursEnd?: string;
    maxFocusHours?: number;
}

export class AIService {
    private _openai: OpenAI | null = null;

    private get openai(): OpenAI {
        if (!this._openai) {
            if (!config.openai.apiKey) {
                throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.');
            }
            this._openai = new OpenAI({
                apiKey: config.openai.apiKey,
            });
        }
        return this._openai;
    }

    /**
     * Generate an optimized daily schedule using AI
     */
    async planDay(
        _userId: string,
        tasks: Task[],
        calendarEvents: CalendarEvent[],
        preferences: UserPreferences,
        targetDate: string
    ): Promise<PlanDayResponse> {
        const systemPrompt = this.buildPlanDaySystemPrompt(preferences);
        const userPrompt = this.buildPlanDayUserPrompt(tasks, calendarEvents, preferences.timezone, targetDate);

        const response = await this.openai.chat.completions.create({
            model: config.openai.model,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 2000,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('Empty response from AI');
        }

        const parsed = JSON.parse(content);
        const validated = PlanDayResponseSchema.parse(parsed);

        return validated;
    }

    /**
     * Break down a complex task into subtasks
     */
    async breakdownTask(task: Task): Promise<TaskBreakdownResponse> {
        const systemPrompt = `You are a productivity expert that breaks down complex tasks into actionable subtasks.

## Rules
1. Each subtask should be completable in 15-60 minutes
2. Subtasks should be specific and actionable
3. Order subtasks logically (dependencies first)
4. Total time should be realistic for the parent task
5. Include a brief reasoning for your breakdown

## Output Format
Return JSON:
{
  "subtasks": [{ "title": "string", "estimatedMinutes": number, "order": number }],
  "totalEstimatedMinutes": number,
  "reasoning": "string"
}`;

        const userPrompt = JSON.stringify({
            task: {
                title: task.title,
                description: task.description,
                estimatedMinutes: task.estimated_minutes,
                priority: task.priority,
                dueDate: task.due_date,
            },
        });

        const response = await this.openai.chat.completions.create({
            model: config.openai.model,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.4,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('Empty response from AI');
        }

        const parsed = JSON.parse(content);
        const validated = TaskBreakdownResponseSchema.parse(parsed);

        return validated;
    }

    private buildPlanDaySystemPrompt(preferences: UserPreferences): string {
        const peakStart = preferences.peakHoursStart || '09:00';
        const peakEnd = preferences.peakHoursEnd || '12:00';
        const maxHours = preferences.maxFocusHours || 6;

        return `You are an expert productivity assistant that creates optimal daily schedules.

## Your Mission
Create a realistic, productive daily schedule that maximizes focus while respecting constraints.

## Scheduling Rules
1. NEVER double-book time slots - check existing calendar events carefully
2. Leave 15-minute buffers between meetings/events
3. Schedule HIGH PRIORITY (3) tasks during peak hours (${peakStart}-${peakEnd})
4. Schedule MEDIUM PRIORITY (2) tasks in the early afternoon
5. Schedule LOW PRIORITY (1) tasks in late afternoon or gaps
6. Maximum ${maxHours} hours of scheduled focus work per day
7. Minimum 30-minute blocks for tasks (no fragmented scheduling)
8. Respect task due dates - urgent tasks must be scheduled
9. If a task cannot fit today, add to unscheduledTasks with reason

## Special Considerations
- If estimated_minutes is not provided, estimate based on task title/description
- Account for mental fatigue - don't schedule demanding tasks back-to-back
- Leave lunch break (12:00-13:00) free unless explicitly requested
- Start scheduling from current time, not past hours

## Output Format
Return a JSON object:
{
  "scheduledTasks": [
    {
      "taskId": "uuid",
      "startTime": "ISO8601 datetime",
      "endTime": "ISO8601 datetime",
      "rationale": "Brief explanation why this time slot"
    }
  ],
  "unscheduledTasks": [
    {
      "taskId": "uuid",
      "reason": "Why this task couldn't be scheduled today"
    }
  ],
  "insights": ["Optional productivity insights based on the schedule"],
  "warnings": ["Optional warnings about conflicts or concerns"]
}`;
    }

    private buildPlanDayUserPrompt(
        tasks: Task[],
        events: CalendarEvent[],
        timezone: string,
        targetDate: string
    ): string {
        const now = new Date();

        return JSON.stringify({
            timezone,
            targetDate,
            currentTime: now.toISOString(),

            tasks: tasks.map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
                priority: t.priority,
                estimatedMinutes: t.estimated_minutes || null,
                dueDate: t.due_date,
                labels: t.labels,
                currentScheduledStart: t.scheduled_start,
            })),

            blockedTime: events.map(e => ({
                title: e.title,
                start: e.start_time,
                end: e.end_time,
                isAllDay: e.is_all_day,
            })),
        });
    }
}

// Singleton instance
export const aiService = new AIService();
