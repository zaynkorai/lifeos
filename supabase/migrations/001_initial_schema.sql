-- LifeOS Database Schema
-- Migration: 001_initial_schema
-- Created: 2026-01-20

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- PROFILES (extends Supabase Auth)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TASKS
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- Scheduling
  due_date TIMESTAMPTZ,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  estimated_minutes INTEGER,
  actual_minutes INTEGER,
  
  -- Priority & Organization
  priority INTEGER DEFAULT 0 CHECK (priority BETWEEN 0 AND 3),
  labels TEXT[] DEFAULT '{}',
  project_id UUID,
  
  -- AI-generated
  ai_suggested_time TIMESTAMPTZ,
  ai_breakdown JSONB,
  ai_context TEXT,
  
  -- Tracking
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_due ON tasks(user_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_scheduled ON tasks(user_id, scheduled_start) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_search ON tasks USING gin(title gin_trgm_ops);

-- ============================================
-- CALENDAR EVENTS
-- ============================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- External reference
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple', 'manual')),
  external_id TEXT,
  
  -- Event data
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT FALSE,
  
  -- Recurrence
  recurrence_rule TEXT,
  recurrence_id UUID REFERENCES calendar_events(id),
  
  -- Metadata
  attendees JSONB DEFAULT '[]',
  conference_url TEXT,
  
  -- Sync tracking
  etag TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(user_id, provider, external_id)
);

CREATE INDEX idx_calendar_user_time ON calendar_events(user_id, start_time, end_time) 
  WHERE deleted_at IS NULL;

-- ============================================
-- OAUTH TOKENS (for calendar sync)
-- ============================================
CREATE TABLE oauth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  
  -- Tokens (should be encrypted in production)
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  
  expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- ============================================
-- SUBSCRIPTIONS (Stripe-synced)
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Stripe references
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL CHECK (status IN (
    'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'
  )),
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'pro', 'team', 'enterprise')),
  
  -- Billing period
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  
  -- Usage tracking
  ai_requests_this_period INTEGER DEFAULT 0,
  ai_requests_limit INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- ============================================
-- EVENT STORE (Append-Only Audit Log)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Event metadata
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Event data
  action TEXT NOT NULL,
  payload JSONB NOT NULL,
  previous_state JSONB,
  
  -- Context
  source TEXT DEFAULT 'api',
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user_type ON events(user_id, event_type, created_at DESC);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id, created_at DESC);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to increment AI usage counter
CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE subscriptions
  SET ai_requests_this_period = ai_requests_this_period + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id
    AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset AI usage (called by cron at period start)
CREATE OR REPLACE FUNCTION reset_ai_usage()
RETURNS VOID AS $$
BEGIN
  UPDATE subscriptions
  SET ai_requests_this_period = 0,
      updated_at = NOW()
  WHERE current_period_start <= NOW()
    AND current_period_end > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can CRUD own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);

-- Calendar policies
CREATE POLICY "Users can CRUD own calendar"
  ON calendar_events FOR ALL
  USING (auth.uid() = user_id);

-- OAuth tokens policies
CREATE POLICY "Users can CRUD own oauth tokens"
  ON oauth_tokens FOR ALL
  USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert events
CREATE POLICY "Service can insert events"
  ON events FOR INSERT
  WITH CHECK (true);

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE calendar_events;
