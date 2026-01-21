import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';

// Types
export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    due_date: string | null;
    scheduled_start: string | null;
    scheduled_end: string | null;
    estimated_minutes: number | null;
    priority: number;
    labels: string[];
    ai_context: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ScheduledTask {
    taskId: string;
    startTime: string;
    endTime: string;
    rationale: string;
}

export interface PlanDayResponse {
    scheduledTasks: ScheduledTask[];
    unscheduledTasks: { taskId: string; reason: string }[];
    insights?: string[];
    warnings?: string[];
}

interface TasksState {
    // Data
    tasks: Task[];
    plannedSchedule: PlanDayResponse | null;

    // Loading states
    isLoading: boolean;
    isCreating: boolean;
    isPlanningDay: boolean;

    // Error state
    error: string | null;

    // Actions
    fetchTasks: () => Promise<void>;
    createTask: (title: string, priority?: number) => Promise<Task | null>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    completeTask: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    planDay: () => Promise<PlanDayResponse | null>;
    clearError: () => void;
}

export const useTasksStore = create<TasksState>()(
    persist(
        (set, get) => ({
            tasks: [],
            plannedSchedule: null,
            isLoading: false,
            isCreating: false,
            isPlanningDay: false,
            error: null,

            fetchTasks: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiClient.get<{ data: Task[]; pagination: { total: number } }>(
                        '/api/v1/tasks?status=pending&status=in_progress&limit=100'
                    );
                    set({ tasks: response.data, isLoading: false });
                } catch (err) {
                    set({ error: (err as Error).message, isLoading: false });
                }
            },

            createTask: async (title: string, priority = 1) => {
                set({ isCreating: true, error: null });

                // Optimistic update
                const tempId = `temp-${Date.now()}`;
                const optimisticTask: Task = {
                    id: tempId,
                    user_id: '',
                    title,
                    description: null,
                    status: 'pending',
                    due_date: null,
                    scheduled_start: null,
                    scheduled_end: null,
                    estimated_minutes: null,
                    priority,
                    labels: [],
                    ai_context: null,
                    completed_at: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                set(state => ({ tasks: [optimisticTask, ...state.tasks] }));

                try {
                    const response = await apiClient.post<{ data: Task }>('/api/v1/tasks', { title, priority });

                    // Replace temp with real
                    set(state => ({
                        tasks: state.tasks.map(t => t.id === tempId ? response.data : t),
                        isCreating: false,
                    }));

                    return response.data;
                } catch (err) {
                    // Rollback
                    set(state => ({
                        tasks: state.tasks.filter(t => t.id !== tempId),
                        error: (err as Error).message,
                        isCreating: false,
                    }));
                    return null;
                }
            },

            updateTask: async (id: string, updates: Partial<Task>) => {
                const previousTasks = get().tasks;

                // Optimistic update
                set(state => ({
                    tasks: state.tasks.map(t =>
                        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
                    ),
                }));

                try {
                    await apiClient.patch(`/api/v1/tasks/${id}`, updates);
                } catch (err) {
                    // Rollback
                    set({ tasks: previousTasks, error: (err as Error).message });
                }
            },

            completeTask: async (id: string) => {
                const previousTasks = get().tasks;

                // Optimistic update - remove from list
                set(state => ({
                    tasks: state.tasks.filter(t => t.id !== id),
                }));

                try {
                    await apiClient.post(`/api/v1/tasks/${id}/complete`);
                } catch (err) {
                    // Rollback
                    set({ tasks: previousTasks, error: (err as Error).message });
                }
            },

            deleteTask: async (id: string) => {
                const previousTasks = get().tasks;

                // Optimistic update
                set(state => ({
                    tasks: state.tasks.filter(t => t.id !== id),
                }));

                try {
                    await apiClient.delete(`/api/v1/tasks/${id}`);
                } catch (err) {
                    // Rollback
                    set({ tasks: previousTasks, error: (err as Error).message });
                }
            },

            planDay: async () => {
                set({ isPlanningDay: true, error: null });
                try {
                    const response = await apiClient.post<{ data: PlanDayResponse }>('/api/v1/ai/plan-day');

                    // Update tasks with scheduled times
                    const scheduleMap = new Map(
                        response.data.scheduledTasks.map(s => [s.taskId, s])
                    );

                    set(state => ({
                        tasks: state.tasks.map(t => {
                            const schedule = scheduleMap.get(t.id);
                            if (schedule) {
                                return {
                                    ...t,
                                    scheduled_start: schedule.startTime,
                                    scheduled_end: schedule.endTime,
                                    ai_context: schedule.rationale,
                                };
                            }
                            return t;
                        }),
                        plannedSchedule: response.data,
                        isPlanningDay: false,
                    }));

                    return response.data;
                } catch (err) {
                    set({ error: (err as Error).message, isPlanningDay: false });
                    return null;
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'lifeos-tasks',
            partialize: (state) => ({ tasks: state.tasks }),
        }
    )
);
