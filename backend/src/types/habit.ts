import { z } from 'zod';

export const HabitSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    color: z.string().default('#22c55e'), // Green by default
    createdAt: z.date(),
});

export type Habit = z.infer<typeof HabitSchema>;

export const HabitLogSchema = z.object({
    id: z.string().uuid(),
    habitId: z.string().uuid(),
    date: z.string(), // YYYY-MM-DD format
    completed: z.boolean(),
});

export type HabitLog = z.infer<typeof HabitLogSchema>;

export const CreateHabitSchema = HabitSchema.pick({ name: true, color: true });
export type CreateHabitInput = z.infer<typeof CreateHabitSchema>;
