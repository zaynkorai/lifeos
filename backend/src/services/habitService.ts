import { CreateHabitInput, Habit, HabitLog } from '../types/habit.js';
import { randomUUID } from 'crypto';

// In-memory stores
const habits: Habit[] = [];
const habitLogs: HabitLog[] = [];

export class HabitService {
    async findAllHabits(): Promise<Habit[]> {
        return habits.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async createHabit(input: CreateHabitInput): Promise<Habit> {
        const newHabit: Habit = {
            id: randomUUID(),
            name: input.name,
            color: input.color || '#22c55e',
            createdAt: new Date(),
        };
        habits.push(newHabit);
        return newHabit;
    }

    async getLogsForHabit(habitId: string, days: number = 30): Promise<HabitLog[]> {
        // Get logs for the last N days
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - days);

        return habitLogs.filter(log => {
            const logDate = new Date(log.date);
            return log.habitId === habitId && logDate >= startDate && logDate <= today;
        });
    }

    async toggleHabitLog(habitId: string, date: string): Promise<HabitLog> {
        const existingLogIndex = habitLogs.findIndex(
            log => log.habitId === habitId && log.date === date
        );

        if (existingLogIndex !== -1) {
            // Toggle existing log
            habitLogs[existingLogIndex].completed = !habitLogs[existingLogIndex].completed;
            return habitLogs[existingLogIndex];
        } else {
            // Create new log (marked as complete)
            const newLog: HabitLog = {
                id: randomUUID(),
                habitId,
                date,
                completed: true,
            };
            habitLogs.push(newLog);
            return newLog;
        }
    }

    async getHabitMatrix(days: number = 30): Promise<{ habit: Habit; logs: HabitLog[] }[]> {
        const result = [];
        for (const habit of habits) {
            const logs = await this.getLogsForHabit(habit.id, days);
            result.push({ habit, logs });
        }
        return result;
    }
}

export const habitService = new HabitService();
