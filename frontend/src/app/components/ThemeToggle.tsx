'use client';

import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const cycleTheme = () => {
        // Cycle through: system -> light -> dark -> system
        if (theme === 'system') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('system');
        }
    };

    const getIcon = () => {
        if (theme === 'system') {
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8" />
                    <path d="M12 17v4" />
                </svg>
            );
        }
        if (resolvedTheme === 'dark') {
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            );
        }
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
        );
    };

    const getLabel = () => {
        if (theme === 'system') return 'System';
        if (theme === 'light') return 'Light';
        return 'Dark';
    };

    return (
        <button
            onClick={cycleTheme}
            className="theme-toggle"
            title={`Current: ${getLabel()}. Click to change.`}
        >
            {getIcon()}
        </button>
    );
}
