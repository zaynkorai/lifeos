import { z } from 'zod';

// AI Plan Day request
export const PlanDayRequestSchema = z.object({
    target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD, defaults to today
});
export type PlanDayRequest = z.infer<typeof PlanDayRequestSchema>;

// Scheduled task from AI
export const ScheduledTaskSchema = z.object({
    taskId: z.string().uuid(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    rationale: z.string(),
});
export type ScheduledTask = z.infer<typeof ScheduledTaskSchema>;

// Unscheduled task explanation
export const UnscheduledTaskSchema = z.object({
    taskId: z.string().uuid(),
    reason: z.string(),
});
export type UnscheduledTask = z.infer<typeof UnscheduledTaskSchema>;

// AI Plan Day response
export const PlanDayResponseSchema = z.object({
    scheduledTasks: z.array(ScheduledTaskSchema),
    unscheduledTasks: z.array(UnscheduledTaskSchema),
    insights: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
});
export type PlanDayResponse = z.infer<typeof PlanDayResponseSchema>;

// Task breakdown request
export const TaskBreakdownRequestSchema = z.object({
    task_id: z.string().uuid(),
});
export type TaskBreakdownRequest = z.infer<typeof TaskBreakdownRequestSchema>;

// Subtask suggestion
export const SubtaskSchema = z.object({
    title: z.string(),
    estimatedMinutes: z.number().int().positive(),
    order: z.number().int(),
});
export type Subtask = z.infer<typeof SubtaskSchema>;

// Task breakdown response
export const TaskBreakdownResponseSchema = z.object({
    subtasks: z.array(SubtaskSchema),
    totalEstimatedMinutes: z.number(),
    reasoning: z.string(),
});
export type TaskBreakdownResponse = z.infer<typeof TaskBreakdownResponseSchema>;
