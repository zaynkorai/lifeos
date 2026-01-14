'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';

// Types
type Task = {
    id: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
};

type Habit = {
    id: string;
    name: string;
    color: string;
    createdAt: string;
};

type HabitLog = {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
};

type HabitMatrixItem = {
    habit: Habit;
    logs: HabitLog[];
};

// Helper: Get last N days as YYYY-MM-DD
function getLast30Days(): string[] {
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [habits, setHabits] = useState<HabitMatrixItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [newHabit, setNewHabit] = useState('');

    const last30Days = getLast30Days();
    const today = new Date().toISOString().split('T')[0];

    // Fetch Tasks
    useEffect(() => {
        fetch('http://localhost:8001/api/tasks')
            .then(res => res.json())
            .then(data => {
                setTasks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch tasks:', err);
                setLoading(false);
            });
    }, []);

    // Fetch Habits Matrix
    useEffect(() => {
        fetch('http://localhost:8001/api/habits/matrix')
            .then(res => res.json())
            .then(data => setHabits(data))
            .catch(err => console.error('Failed to fetch habits:', err));
    }, []);

    // Create Task
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const res = await fetch('http://localhost:8001/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTask, priority: 'medium' }),
            });
            const createdTask = await res.json();
            setTasks(prev => [createdTask, ...prev]);
            setNewTask('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    // Complete Task
    const handleComplete = async (id: string) => {
        try {
            await fetch(`http://localhost:8001/api/tasks/${id}/complete`, {
                method: 'PATCH',
            });
            setTasks(prev => prev.map(t =>
                t.id === id ? { ...t, status: 'done' } : t
            ));
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    // Create Habit
    const handleCreateHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabit.trim()) return;

        try {
            const res = await fetch('http://localhost:8001/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newHabit }),
            });
            const createdHabit = await res.json();
            setHabits(prev => [...prev, { habit: createdHabit, logs: [] }]);
            setNewHabit('');
        } catch (error) {
            console.error('Error creating habit:', error);
        }
    };

    // Toggle Habit Log
    const handleToggleHabit = async (habitId: string, date: string) => {
        try {
            const res = await fetch(`http://localhost:8001/api/habits/${habitId}/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date }),
            });
            const updatedLog = await res.json();

            setHabits(prev => prev.map(item => {
                if (item.habit.id !== habitId) return item;

                const existingLogIndex = item.logs.findIndex(l => l.date === date);
                if (existingLogIndex !== -1) {
                    const newLogs = [...item.logs];
                    newLogs[existingLogIndex] = updatedLog;
                    return { ...item, logs: newLogs };
                } else {
                    return { ...item, logs: [...item.logs, updatedLog] };
                }
            }));
        } catch (error) {
            console.error('Error toggling habit:', error);
        }
    };

    // Check if a habit was completed on a specific date
    const isHabitComplete = (logs: HabitLog[], date: string) => {
        return logs.some(log => log.date === date && log.completed);
    };

    const activeTasks = tasks.filter(t => t.status !== 'done');
    const doneTasks = tasks.filter(t => t.status === 'done');

    return (
        <div className="dashboard-container">
            {/* Top Bar: Mission Control Stats */}
            <header className="dashboard-header">
                <Link href="/" className="nav-logo" style={{ marginRight: 'auto' }}>LifeOS</Link>
                <div className="stat-ticker">
                    <span className="stat-label">FOCUS_LEVEL</span>
                    <span className="stat-value text-green">OPTIMAL</span>
                </div>
                <div className="stat-ticker">
                    <span className="stat-label">TASKS_PENDING</span>
                    <span className="stat-value">{activeTasks.length}</span>
                </div>
                <div className="stat-ticker">
                    <span className="stat-label">HABITS_TRACKED</span>
                    <span className="stat-value">{habits.length}</span>
                </div>
                <div className="stat-ticker">
                    <span className="stat-label">SYSTEM_STATUS</span>
                    <span className="stat-value text-blue">ONLINE</span>
                </div>
                <ThemeToggle />
            </header>

            <main className="dashboard-grid">
                {/* Left Col: Focus Queue */}
                <div className="dashboard-card focus-queue">
                    <div className="card-header">
                        <h3>Priority Queue</h3>
                        <span className="badge">{activeTasks.length} OPEN</span>
                    </div>

                    <div className="task-input-wrapper">
                        <span className="prompt-char">&gt;</span>
                        <form onSubmit={handleCreateTask} style={{ width: '100%' }}>
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Initialize new objective..."
                                className="quick-capture-input"
                                autoFocus
                            />
                        </form>
                    </div>

                    <div className="task-list">
                        {loading ? (
                            <div className="loading-state">Syncing Protocol...</div>
                        ) : activeTasks.length === 0 ? (
                            <div className="empty-state">No active directives. System idle.</div>
                        ) : (
                            activeTasks.map(task => (
                                <div key={task.id} className="task-item">
                                    <button
                                        className="task-checkbox"
                                        onClick={() => handleComplete(task.id)}
                                    />
                                    <span className="task-title">{task.title}</span>
                                    <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Col: Sidebar */}
                <div className="dashboard-sidebar">
                    {/* Recent Completions */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>Recent Completions</h3>
                        </div>
                        <div className="log-list">
                            {doneTasks.slice(0, 5).map(task => (
                                <div key={task.id} className="log-item">
                                    <span className="log-icon">✓</span>
                                    <span className="log-text">{task.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Habit Matrix Section */}
            <section className="dashboard-card habit-matrix-section">
                <div className="card-header">
                    <h3>Habit Matrix</h3>
                    <span className="badge">{habits.length} TRACKED</span>
                </div>

                {/* Add Habit Input */}
                <div className="task-input-wrapper">
                    <span className="prompt-char">+</span>
                    <form onSubmit={handleCreateHabit} style={{ width: '100%' }}>
                        <input
                            type="text"
                            value={newHabit}
                            onChange={(e) => setNewHabit(e.target.value)}
                            placeholder="Track new habit..."
                            className="quick-capture-input"
                        />
                    </form>
                </div>

                {/* Matrix Grid */}
                <div className="habit-matrix">
                    {habits.length === 0 ? (
                        <div className="empty-state">No habits tracked. Add one above.</div>
                    ) : (
                        habits.map(({ habit, logs }) => (
                            <div key={habit.id} className="habit-row">
                                <span className="habit-name">{habit.name}</span>
                                <div className="habit-grid">
                                    {last30Days.map(date => (
                                        <button
                                            key={date}
                                            className={`habit-cell ${isHabitComplete(logs, date) ? 'completed' : ''} ${date === today ? 'today' : ''}`}
                                            onClick={() => handleToggleHabit(habit.id, date)}
                                            title={date}
                                            style={{ '--habit-color': habit.color } as React.CSSProperties}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
