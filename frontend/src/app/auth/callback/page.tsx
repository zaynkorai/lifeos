'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Handle the OAuth callback
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Auth callback error:', error);
                router.push('/login?error=auth_failed');
                return;
            }

            if (session) {
                // Store token for API calls
                localStorage.setItem('supabase-auth-token', session.access_token);
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <Loader2 size={32} className="spin" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>Signing you in...</p>
            </div>
        </div>
    );
}
