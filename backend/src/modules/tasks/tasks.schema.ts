import { z } from 'zod';

// Task status enum
export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// Priority levels: 0 = none, 1 = low, 2 = medium, 3 = high
export const TaskPrioritySchema = z.number().int().min(0).max(3);

// Create task input
export const CreateTaskSchema = z.object({
    title: z.string().min(1).max(500),
    description: z.string().max(5000).nullable().optional(),
    due_date: z.string().datetime().nullable().optional(),
    scheduled_start: z.string().datetime().nullable().optional(),
    scheduled_end: z.string().datetime().nullable().optional(),
    estimated_minutes: z.number().int().positive().nullable().optional(),
    priority: TaskPrioritySchema.default(0),
    labels: z.array(z.string()).default([]),
    project_id: z.string().uuid().nullable().optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

// Update task input
export const UpdateTaskSchema = z.object({
    title: z.string().min(1).max(500).optional(),
    description: z.string().max(5000).nullable().optional(),
    status: TaskStatusSchema.optional(),
    due_date: z.string().datetime().nullable().optional(),
    scheduled_start: z.string().datetime().nullable().optional(),
    scheduled_end: z.string().datetime().nullable().optional(),
    estimated_minutes: z.number().int().positive().nullable().optional(),
    actual_minutes: z.number().int().positive().nullable().optional(),
    priority: TaskPrioritySchema.optional(),
    labels: z.array(z.string()).optional(),
    project_id: z.string().uuid().nullable().optional(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

// Complete task input
export const CompleteTaskSchema = z.object({
    actual_minutes: z.number().int().positive().nullable().optional(),
});
export type CompleteTaskInput = z.infer<typeof CompleteTaskSchema>;

// Task response (what we return to clients)
export const TaskSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    status: TaskStatusSchema,
    due_date: z.string().datetime().nullable(),
    scheduled_start: z.string().datetime().nullable(),
    scheduled_end: z.string().datetime().nullable(),
    estimated_minutes: z.number().nullable(),
    actual_minutes: z.number().nullable(),
    priority: z.number(),
    labels: z.array(z.string()),
    project_id: z.string().uuid().nullable(),
    ai_suggested_time: z.string().datetime().nullable(),
    ai_context: z.string().nullable(),
    completed_at: z.string().datetime().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});
export type Task = z.infer<typeof TaskSchema>;

// Query params for listing tasks
export const ListTasksQuerySchema = z.object({
    status: TaskStatusSchema.optional(),
    priority: TaskPrioritySchema.optional(),
    due_before: z.string().datetime().optional(),
    due_after: z.string().datetime().optional(),
    scheduled_date: z.string().optional(), // YYYY-MM-DD
    labels: z.string().optional(), // comma-separated
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
    sort_by: z.enum(['created_at', 'due_date', 'priority', 'scheduled_start']).default('created_at'),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
});
export type ListTasksQuery = z.infer<typeof ListTasksQuerySchema>;

// ID param
export const TaskIdParamSchema = z.object({
    id: z.string().uuid(),
});
