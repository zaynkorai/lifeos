import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../../config.js';

// Supabase client for server-side operations (with service role)
let supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseAdmin) {
        if (!config.supabase.url || !config.supabase.serviceKey) {
            throw new Error('Supabase configuration is missing');
        }

        supabaseAdmin = createClient(
            config.supabase.url,
            config.supabase.serviceKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }

    return supabaseAdmin;
}

// Supabase client for user-scoped operations (with user JWT)
export function getSupabaseClient(accessToken: string): SupabaseClient {
    if (!config.supabase.url || !config.supabase.anonKey) {
        throw new Error('Supabase configuration is missing');
    }

    return createClient(
        config.supabase.url,
        config.supabase.anonKey,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

// Database row types (for reference)
export interface ProfileRow {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    timezone: string;
    preferences: Record<string, unknown>;
    onboarding_completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface TaskRow {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    due_date: string | null;
    scheduled_start: string | null;
    scheduled_end: string | null;
    estimated_minutes: number | null;
    actual_minutes: number | null;
    priority: number;
    labels: string[];
    project_id: string | null;
    ai_suggested_time: string | null;
    ai_breakdown: Record<string, unknown> | null;
    ai_context: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CalendarEventRow {
    id: string;
    user_id: string;
    provider: 'google' | 'outlook' | 'apple' | 'manual';
    external_id: string | null;
    title: string;
    description: string | null;
    location: string | null;
    start_time: string;
    end_time: string;
    is_all_day: boolean;
    recurrence_rule: string | null;
    recurrence_id: string | null;
    attendees: Record<string, unknown>[];
    conference_url: string | null;
    etag: string | null;
    synced_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface SubscriptionRow {
    id: string;
    user_id: string;
    stripe_customer_id: string;
    stripe_subscription_id: string;
    stripe_price_id: string;
    status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
    tier: 'starter' | 'pro' | 'team' | 'enterprise';
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at: string | null;
    canceled_at: string | null;
    ai_requests_this_period: number;
    ai_requests_limit: number | null;
    created_at: string;
    updated_at: string;
}

export interface EventRow {
    id: string;
    user_id: string | null;
    event_type: string;
    entity_type: string;
    entity_id: string;
    action: string;
    payload: Record<string, unknown>;
    previous_state: Record<string, unknown> | null;
    source: 'api' | 'webhook' | 'cron' | 'ai';
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}
