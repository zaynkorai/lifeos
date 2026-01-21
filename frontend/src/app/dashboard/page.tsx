'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import { TasksList } from '@/components/tasks/TasksList';
import { useAuth } from '@/app/providers/AuthProvider';
import {
    LayoutDashboard,
    Calendar,
    Target,
    TrendingUp,
    Settings,
    LogOut,
    Loader2
} from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="auth-container">
                <Loader2 size={32} className="spin" />
            </div>
        );
    }

    // Don't render if not authenticated
    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <Link href="/" className="sidebar-logo">
                        <span className="logo-icon">◈</span>
                        <span className="logo-text">LifeOS</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <Link href="/dashboard" className="nav-item active">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
                        <Calendar size={20} />
                        <span>Calendar</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
                        <Target size={20} />
                        <span>Habits</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
                        <TrendingUp size={20} />
                        <span>Analytics</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </a>
                    <button className="nav-item" onClick={handleSignOut}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                    <ThemeToggle />
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Top Bar */}
                <header className="dashboard-topbar">
                    <div className="topbar-left">
                        <h1>Dashboard</h1>
                        <span className="topbar-date">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="dashboard-content">
                    {/* Tasks Section - Main Focus */}
                    <section className="dashboard-section tasks-section">
                        <TasksList />
                    </section>

                    {/* Quick Stats */}
                    <aside className="dashboard-aside">
                        <div className="stats-card">
                            <h3>Today&apos;s Progress</h3>
                            <div className="progress-ring">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path
                                        className="circle-bg"
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className="circle"
                                        strokeDasharray="0, 100"
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className="percentage">0%</text>
                                </svg>
                            </div>
                            <p className="stats-note">Complete tasks to see progress</p>
                        </div>

                        <div className="stats-card">
                            <h3>Focus Time</h3>
                            <div className="stat-value">0h 0m</div>
                            <p className="stats-note">Start a focus session</p>
                        </div>

                        <div className="stats-card">
                            <h3>Streak</h3>
                            <div className="stat-value">🔥 0 days</div>
                            <p className="stats-note">Complete daily goals</p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
