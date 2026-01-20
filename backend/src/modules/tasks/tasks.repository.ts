import { getSupabaseAdmin, TaskRow } from '../../shared/db/supabase.js';
import { CreateTaskInput, UpdateTaskInput, Task, ListTasksQuery } from './tasks.schema.js';

/**
 * Maps database row to API response
 */
function mapTaskRow(row: TaskRow): Task {
    return {
        id: row.id,
        user_id: row.user_id,
        title: row.title,
        description: row.description,
        status: row.status,
        due_date: row.due_date,
        scheduled_start: row.scheduled_start,
        scheduled_end: row.scheduled_end,
        estimated_minutes: row.estimated_minutes,
        actual_minutes: row.actual_minutes,
        priority: row.priority,
        labels: row.labels,
        project_id: row.project_id,
        ai_suggested_time: row.ai_suggested_time,
        ai_context: row.ai_context,
        completed_at: row.completed_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

export class TasksRepository {
    /**
     * Get all tasks for a user with filtering and pagination
     */
    async findAll(userId: string, query: ListTasksQuery): Promise<{ tasks: Task[]; total: number }> {
        const supabase = getSupabaseAdmin();

        let queryBuilder = supabase
            .from('tasks')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .is('deleted_at', null);

        // Apply filters
        if (query.status) {
            queryBuilder = queryBuilder.eq('status', query.status);
        }

        if (query.priority !== undefined) {
            queryBuilder = queryBuilder.eq('priority', query.priority);
        }

        if (query.due_before) {
            queryBuilder = queryBuilder.lte('due_date', query.due_before);
        }

        if (query.due_after) {
            queryBuilder = queryBuilder.gte('due_date', query.due_after);
        }

        if (query.scheduled_date) {
            const startOfDay = `${query.scheduled_date}T00:00:00.000Z`;
            const endOfDay = `${query.scheduled_date}T23:59:59.999Z`;
            queryBuilder = queryBuilder
                .gte('scheduled_start', startOfDay)
                .lte('scheduled_start', endOfDay);
        }

        if (query.labels) {
            const labelArray = query.labels.split(',').map(l => l.trim());
            queryBuilder = queryBuilder.overlaps('labels', labelArray);
        }

        // Apply sorting
        queryBuilder = queryBuilder.order(query.sort_by, {
            ascending: query.sort_order === 'asc',
        });

        // Apply pagination
        queryBuilder = queryBuilder.range(query.offset, query.offset + query.limit - 1);

        const { data, error, count } = await queryBuilder;

        if (error) {
            throw error;
        }

        return {
            tasks: ((data || []) as TaskRow[]).map(mapTaskRow),
            total: count || 0,
        };
    }

    /**
     * Get a single task by ID
     */
    async findById(userId: string, taskId: string): Promise<Task | null> {
        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .eq('user_id', userId)
            .is('deleted_at', null)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw error;
        }

        return mapTaskRow(data as TaskRow);
    }

    /**
     * Create a new task
     */
    async create(userId: string, input: CreateTaskInput): Promise<Task> {
        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                user_id: userId,
                title: input.title,
                description: input.description ?? null,
                status: 'pending',
                due_date: input.due_date ?? null,
                scheduled_start: input.scheduled_start ?? null,
                scheduled_end: input.scheduled_end ?? null,
                estimated_minutes: input.estimated_minutes ?? null,
                priority: input.priority,
                labels: input.labels,
                project_id: input.project_id ?? null,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapTaskRow(data as TaskRow);
    }

    /**
     * Update a task
     */
    async update(userId: string, taskId: string, input: UpdateTaskInput): Promise<Task | null> {
        const supabase = getSupabaseAdmin();

        // Build update object with only provided fields
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (input.title !== undefined) updateData.title = input.title;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.status !== undefined) updateData.status = input.status;
        if (input.due_date !== undefined) updateData.due_date = input.due_date;
        if (input.scheduled_start !== undefined) updateData.scheduled_start = input.scheduled_start;
        if (input.scheduled_end !== undefined) updateData.scheduled_end = input.scheduled_end;
        if (input.estimated_minutes !== undefined) updateData.estimated_minutes = input.estimated_minutes;
        if (input.actual_minutes !== undefined) updateData.actual_minutes = input.actual_minutes;
        if (input.priority !== undefined) updateData.priority = input.priority;
        if (input.labels !== undefined) updateData.labels = input.labels;
        if (input.project_id !== undefined) updateData.project_id = input.project_id;

        // If status is being set to completed, also set completed_at
        if (input.status === 'completed') {
            updateData.completed_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', taskId)
            .eq('user_id', userId)
            .is('deleted_at', null)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }

        return mapTaskRow(data as TaskRow);
    }

    /**
     * Soft delete a task
     */
    async delete(userId: string, taskId: string): Promise<boolean> {
        const supabase = getSupabaseAdmin();

        const { error, count } = await supabase
            .from('tasks')
            .update({
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', taskId)
            .eq('user_id', userId)
            .is('deleted_at', null);

        if (error) {
            throw error;
        }

        return (count || 0) > 0;
    }

    /**
     * Get tasks for AI planning (pending/in_progress, not scheduled today)
     */
    async findForPlanning(userId: string, _targetDate: string): Promise<Task[]> {
        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .is('deleted_at', null)
            .in('status', ['pending', 'in_progress'])
            .order('priority', { ascending: false })
            .order('due_date', { ascending: true, nullsFirst: false })
            .limit(50);

        if (error) {
            throw error;
        }

        return ((data || []) as TaskRow[]).map(mapTaskRow);
    }

    /**
     * Update tasks with AI-scheduled times
     */
    async updateScheduledTimes(
        userId: string,
        schedules: Array<{ taskId: string; startTime: string; endTime: string; rationale: string }>
    ): Promise<void> {
        const supabase = getSupabaseAdmin();

        // Update each task with its scheduled time
        for (const schedule of schedules) {
            await supabase
                .from('tasks')
                .update({
                    scheduled_start: schedule.startTime,
                    scheduled_end: schedule.endTime,
                    ai_suggested_time: schedule.startTime,
                    ai_context: schedule.rationale,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', schedule.taskId)
                .eq('user_id', userId);
        }
    }
}

// Singleton instance
export const tasksRepository = new TasksRepository();
