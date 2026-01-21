'use client';

import { useEffect } from 'react';
import { useTasksStore, Task } from '@/stores/tasks.store';
import { format, parseISO, isToday } from 'date-fns';
import {
    CheckCircle2,
    Circle,
    Sparkles,
    Clock,
    AlertTriangle,
    Plus,
    Loader2,
    Calendar,
    Trash2
} from 'lucide-react';

// Priority labels
const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
    0: { label: 'None', color: 'var(--color-text-tertiary)' },
    1: { label: 'Low', color: 'var(--color-success)' },
    2: { label: 'Medium', color: 'var(--color-warning)' },
    3: { label: 'High', color: 'var(--color-error)' },
};

interface TaskItemProps {
    task: Task;
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
    const priority = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS[0];

    return (
        <div className="task-item">
            <button
                className="task-checkbox"
                onClick={() => onComplete(task.id)}
                aria-label="Complete task"
            >
                <Circle size={20} />
            </button>

            <div className="task-content">
                <span className="task-title">{task.title}</span>

                <div className="task-meta">
                    {task.scheduled_start && (
                        <span className="task-scheduled">
                            <Clock size={12} />
                            {format(parseISO(task.scheduled_start), 'HH:mm')}
                            {task.scheduled_end && ` - ${format(parseISO(task.scheduled_end), 'HH:mm')}`}
                        </span>
                    )}

                    {task.ai_context && (
                        <span className="task-ai-context" title={task.ai_context}>
                            <Sparkles size={12} />
                            AI Scheduled
                        </span>
                    )}

                    {task.due_date && (
                        <span className={`task-due ${isToday(parseISO(task.due_date)) ? 'due-today' : ''}`}>
                            <Calendar size={12} />
                            {format(parseISO(task.due_date), 'MMM d')}
                        </span>
                    )}
                </div>
            </div>

            <span
                className="task-priority"
                style={{ color: priority.color }}
            >
                {priority.label}
            </span>

            <button
                className="task-delete"
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

interface TaskInputProps {
    onSubmit: (title: string) => void;
    isCreating: boolean;
}

function TaskInput({ onSubmit, isCreating }: TaskInputProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('task') as HTMLInputElement;
        const value = input.value.trim();

        if (value) {
            onSubmit(value);
            input.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-input-form">
            <div className="task-input-wrapper">
                <Plus size={18} className="input-icon" />
                <input
                    type="text"
                    name="task"
                    placeholder="Add a new task..."
                    className="task-input"
                    disabled={isCreating}
                    autoComplete="off"
                />
                {isCreating && <Loader2 size={18} className="input-loader spin" />}
            </div>
        </form>
    );
}

interface PlanDayButtonProps {
    onClick: () => void;
    isLoading: boolean;
    disabled: boolean;
}

function PlanDayButton({ onClick, isLoading, disabled }: PlanDayButtonProps) {
    return (
        <button
            className="plan-day-button"
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 size={18} className="spin" />
                    Planning...
                </>
            ) : (
                <>
                    <Sparkles size={18} />
                    Plan My Day
                </>
            )}
        </button>
    );
}

export function TasksList() {
    const {
        tasks,
        isLoading,
        isCreating,
        isPlanningDay,
        error,
        plannedSchedule,
        fetchTasks,
        createTask,
        completeTask,
        deleteTask,
        planDay,
        clearError,
    } = useTasksStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Sort tasks: scheduled first, then by priority
    const sortedTasks = [...tasks].sort((a, b) => {
        // Scheduled tasks first
        if (a.scheduled_start && !b.scheduled_start) return -1;
        if (!a.scheduled_start && b.scheduled_start) return 1;

        // Then by scheduled time
        if (a.scheduled_start && b.scheduled_start) {
            return new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime();
        }

        // Then by priority (high first)
        return b.priority - a.priority;
    });

    const scheduledTasks = sortedTasks.filter(t => t.scheduled_start);
    const unscheduledTasks = sortedTasks.filter(t => !t.scheduled_start);

    const handleCreateTask = async (title: string) => {
        await createTask(title, 2); // Default medium priority
    };

    return (
        <div className="tasks-container">
            {/* Header */}
            <div className="tasks-header">
                <div className="tasks-header-left">
                    <h2>Today&apos;s Tasks</h2>
                    <span className="task-count">{tasks.length} tasks</span>
                </div>

                <PlanDayButton
                    onClick={planDay}
                    isLoading={isPlanningDay}
                    disabled={tasks.length === 0}
                />
            </div>

            {/* Error Banner */}
            {error && (
                <div className="error-banner">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                    <button onClick={clearError}>×</button>
                </div>
            )}

            {/* AI Insights */}
            {plannedSchedule?.insights && plannedSchedule.insights.length > 0 && (
                <div className="ai-insights">
                    <Sparkles size={16} />
                    <div className="insights-list">
                        {plannedSchedule.insights.map((insight, i) => (
                            <p key={i}>{insight}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Task Input */}
            <TaskInput onSubmit={handleCreateTask} isCreating={isCreating} />

            {/* Loading State */}
            {isLoading ? (
                <div className="loading-state">
                    <Loader2 size={24} className="spin" />
                    <span>Loading tasks...</span>
                </div>
            ) : tasks.length === 0 ? (
                <div className="empty-state">
                    <CheckCircle2 size={48} />
                    <h3>No tasks yet</h3>
                    <p>Add a task above or let AI plan your day</p>
                </div>
            ) : (
                <>
                    {/* Scheduled Tasks */}
                    {scheduledTasks.length > 0 && (
                        <div className="task-section">
                            <h3 className="section-title">
                                <Clock size={16} />
                                Scheduled
                            </h3>
                            <div className="task-list">
                                {scheduledTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onComplete={completeTask}
                                        onDelete={deleteTask}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unscheduled Tasks */}
                    {unscheduledTasks.length > 0 && (
                        <div className="task-section">
                            <h3 className="section-title">
                                <Circle size={16} />
                                Unscheduled
                            </h3>
                            <div className="task-list">
                                {unscheduledTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onComplete={completeTask}
                                        onDelete={deleteTask}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
