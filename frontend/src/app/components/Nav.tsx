'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
    return (
        <nav className="nav">
            <div className="nav-logo">LifeOS</div>
            <ul className="nav-center">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#solutions">Solutions</Link></li>
                <li><Link href="#research">Research</Link></li>
                <li><Link href="#enterprise">Enterprise</Link></li>
                <li><Link href="#resources">Resources</Link></li>
            </ul>
            <div className="nav-right">
                <ThemeToggle />
                <Link href="/dashboard" className="btn btn-primary">Get Started</Link>
                <Link href="#" className="btn btn-ghost">Log In</Link>
            </div>
        </nav>
    );
}
