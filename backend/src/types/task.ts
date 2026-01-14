import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    status: z.enum(['todo', 'in_progress', 'done']),
    priority: z.enum(['low', 'medium', 'high']),
    createdAt: z.date(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = TaskSchema.pick({ title: true, priority: true });
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
