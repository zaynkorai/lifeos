import { tasksRepository } from './tasks.repository.js';
import { CreateTaskInput, UpdateTaskInput, Task, ListTasksQuery, CompleteTaskInput } from './tasks.schema.js';
import { getSupabaseAdmin } from '../../shared/db/supabase.js';

export class TasksService {
    /**
     * Get all tasks for a user
     */
    async getTasks(userId: string, query: ListTasksQuery): Promise<{ tasks: Task[]; total: number }> {
        return tasksRepository.findAll(userId, query);
    }

    /**
     * Get a single task
     */
    async getTask(userId: string, taskId: string): Promise<Task | null> {
        return tasksRepository.findById(userId, taskId);
    }

    /**
     * Create a new task
     */
    async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
        const task = await tasksRepository.create(userId, input);

        // Emit event
        await this.emitEvent(userId, 'task.created', task.id, 'create', {
            title: task.title,
            priority: task.priority,
            due_date: task.due_date,
        });

        return task;
    }

    /**
     * Update a task
     */
    async updateTask(userId: string, taskId: string, input: UpdateTaskInput): Promise<Task | null> {
        const previousTask = await tasksRepository.findById(userId, taskId);
        if (!previousTask) {
            return null;
        }

        const task = await tasksRepository.update(userId, taskId, input);

        if (task) {
            // Emit event
            await this.emitEvent(userId, 'task.updated', task.id, 'update', input, {
                status: previousTask.status,
                priority: previousTask.priority,
            });
        }

        return task;
    }

    /**
     * Complete a task
     */
    async completeTask(userId: string, taskId: string, input: CompleteTaskInput): Promise<Task | null> {
        const task = await tasksRepository.update(userId, taskId, {
            status: 'completed',
            actual_minutes: input.actual_minutes,
        });

        if (task) {
            await this.emitEvent(userId, 'task.completed', task.id, 'update', {
                actual_minutes: input.actual_minutes,
            });
        }

        return task;
    }

    /**
     * Delete a task (soft delete)
     */
    async deleteTask(userId: string, taskId: string): Promise<boolean> {
        const deleted = await tasksRepository.delete(userId, taskId);

        if (deleted) {
            await this.emitEvent(userId, 'task.deleted', taskId, 'delete', {});
        }

        return deleted;
    }

    /**
     * Get tasks ready for AI planning
     */
    async getTasksForPlanning(userId: string, targetDate: string): Promise<Task[]> {
        return tasksRepository.findForPlanning(userId, targetDate);
    }

    /**
     * Apply AI-scheduled times to tasks
     */
    async applyScheduledTimes(
        userId: string,
        schedules: Array<{ taskId: string; startTime: string; endTime: string; rationale: string }>
    ): Promise<void> {
        await tasksRepository.updateScheduledTimes(userId, schedules);

        // Emit events for each scheduled task
        for (const schedule of schedules) {
            await this.emitEvent(userId, 'task.scheduled', schedule.taskId, 'update', {
                scheduled_start: schedule.startTime,
                scheduled_end: schedule.endTime,
                scheduled_by: 'ai',
                rationale: schedule.rationale,
            });
        }
    }

    /**
     * Emit an event to the event store
     */
    private async emitEvent(
        userId: string,
        eventType: string,
        entityId: string,
        action: string,
        payload: Record<string, unknown>,
        previousState?: Record<string, unknown>
    ): Promise<void> {
        const supabase = getSupabaseAdmin();

        await supabase.from('events').insert({
            user_id: userId,
            event_type: eventType,
            entity_type: 'task',
            entity_id: entityId,
            action,
            payload,
            previous_state: previousState || null,
            source: 'api',
        });
    }
}

// Singleton instance
export const tasksService = new TasksService();
