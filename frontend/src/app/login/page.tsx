'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';
import { Loader2, AlertCircle } from 'lucide-react';

// Google icon SVG
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

// Microsoft icon SVG
function MicrosoftIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="1" width="10" height="10" fill="#F25022" />
            <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
            <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
            <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
        </svg>
    );
}

export default function LoginPage() {
    const { signInWithGoogle, signInWithMicrosoft } = useAuth();

    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [isLoadingMicrosoft, setIsLoadingMicrosoft] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setError(null);
        setIsLoadingGoogle(true);
        try {
            await signInWithGoogle();
            // Redirect happens automatically via OAuth
        } catch (err) {
            setError((err as Error).message);
            setIsLoadingGoogle(false);
        }
    };

    const handleMicrosoftSignIn = async () => {
        setError(null);
        setIsLoadingMicrosoft(true);
        try {
            await signInWithMicrosoft();
            // Redirect happens automatically via OAuth
        } catch (err) {
            setError((err as Error).message);
            setIsLoadingMicrosoft(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Logo */}
                <Link href="/" className="auth-logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">LifeOS</span>
                </Link>

                {/* Title */}
                <h1 className="auth-title">Welcome to LifeOS</h1>
                <p className="auth-subtitle">
                    Sign in to start organizing your life
                </p>

                {/* Error Message */}
                {error && (
                    <div className="auth-error">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {/* OAuth Buttons */}
                <div className="oauth-buttons">
                    <button
                        className="oauth-button google"
                        onClick={handleGoogleSignIn}
                        disabled={isLoadingGoogle || isLoadingMicrosoft}
                    >
                        {isLoadingGoogle ? (
                            <Loader2 size={20} className="spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        <span>Continue with Google</span>
                    </button>

                    <button
                        className="oauth-button microsoft"
                        onClick={handleMicrosoftSignIn}
                        disabled={isLoadingGoogle || isLoadingMicrosoft}
                    >
                        {isLoadingMicrosoft ? (
                            <Loader2 size={20} className="spin" />
                        ) : (
                            <MicrosoftIcon />
                        )}
                        <span>Continue with Microsoft</span>
                    </button>
                </div>

                {/* Terms */}
                <p className="auth-terms">
                    By continuing, you agree to our{' '}
                    <a href="#">Terms of Service</a> and{' '}
                    <a href="#">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
