'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithGoogle, signInWithMicrosoft, signOut as supabaseSignOut } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithMicrosoft: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                // Store token for API calls
                if (session?.access_token) {
                    localStorage.setItem('supabase-auth-token', session.access_token);
                } else {
                    localStorage.removeItem('supabase-auth-token');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleSignInWithGoogle = useCallback(async () => {
        await signInWithGoogle();
    }, []);

    const handleSignInWithMicrosoft = useCallback(async () => {
        await signInWithMicrosoft();
    }, []);

    const handleSignOut = useCallback(async () => {
        await supabaseSignOut();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isLoading,
                signInWithGoogle: handleSignInWithGoogle,
                signInWithMicrosoft: handleSignInWithMicrosoft,
                signOut: handleSignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
