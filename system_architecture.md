# LifeOS System Architecture

> **Vision:** The Operating System for Human Life  
> **Principle:** Excellence at scale. Build for billions, ship in weeks.

---

## 🎯 Architecture Philosophy

> "Design for scale. Implement in phases. Never compromise on foundations."

### Guiding Principles

1. **Event-Driven Core** — All state changes emit events. Enables audit, analytics, AI training.
2. **Modular Monolith → Microservices** — Start co-located, extract when scale demands.
3. **Offline-First Capable** — Architecture supports true offline when needed.
4. **Multi-Tenant from Day 1** — Every table, every query, every cache key includes user context.
5. **AI-Native** — Not bolted on. AI is a first-class citizen in every data flow.

### Phase Implementation

| Phase | Timeline | Focus | Stack Additions |
|-------|----------|-------|-----------------|
| **Phase 1** | Week 1-8 | Core product, first revenue | Fastify, Supabase, OpenAI, Stripe |
| **Phase 2** | Month 3-6 | Scale, mobile, performance | Redis, BullMQ, React Native |
| **Phase 3** | Month 6-12 | Enterprise, multi-region | NATS, Temporal, TimescaleDB |
| **Phase 4** | Year 2+ | Platform, ecosystem | pgvector, LangGraph, API Platform |

---

## 🏗️ Target Architecture (Full Vision)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENTS                                          │
│                                                                                     │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                 │
│   │    Next.js      │    │  React Native   │    │    Desktop      │                 │
│   │   (Vercel)      │    │    (Expo)       │    │   (Electron)    │                 │
│   │                 │    │                 │    │                 │                 │
│   │ • Zustand       │    │ • Zustand       │    │ • Zustand       │                 │
│   │ • React Query   │    │ • SQLite cache  │    │ • SQLite cache  │                 │
│   │ • Optimistic UI │    │ • Offline queue │    │ • Offline queue │                 │
│   └────────┬────────┘    └────────┬────────┘    └────────┬────────┘                 │
│            │                      │                      │                          │
└────────────┼──────────────────────┼──────────────────────┼──────────────────────────┘
             └──────────────────────┴──────────────────────┘
                                    │
                              ┌─────┴─────┐
                              │  CDN/Edge │  Cloudflare (Static + Edge Functions)
                              └─────┬─────┘
                                    │
┌───────────────────────────────────┴─────────────────────────────────────────────────┐
│                              API GATEWAY                                            │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                         Kong / AWS API Gateway                              │   │
│   │   • Rate Limiting (per user, per tier)                                      │   │
│   │   • JWT Validation                                                          │   │
│   │   • Request/Response Logging                                                │   │
│   │   • Geographic Routing (Phase 3)                                            │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴─────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                         │
│                                                                                     │
│   PHASE 1: Monolith                    PHASE 3+: Microservices                      │
│   ┌─────────────────────────┐          ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│   │     FASTIFY MONOLITH    │    →→    │  Tasks  │ │Calendar │ │   AI    │          │
│   │  ┌───────┐ ┌───────┐    │          │ Service │ │ Service │ │ Service │          │
│   │  │ Tasks │ │  Cal  │    │          └────┬────┘ └────┬────┘ └────┬────┘          │
│   │  └───────┘ └───────┘    │               │          │          │                │
│   │  ┌───────┐ ┌───────┐    │               └──────────┴──────────┘                │
│   │  │  AI   │ │Billing│    │                         │                            │
│   │  └───────┘ └───────┘    │          ┌──────────────┴──────────────┐              │
│   └────────────┬────────────┘          │      NATS JetStream         │              │
│                │                       │   (Event Bus + Streaming)   │              │
└────────────────┼───────────────────────┴─────────────────────────────┴──────────────┘
                 │
┌────────────────┴────────────────────────────────────────────────────────────────────┐
│                              AI ORCHESTRATION LAYER                                 │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                              CORTEX (AI Brain)                              │   │
│   │                                                                             │   │
│   │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │   │
│   │   │   OpenAI    │    │  LangGraph  │    │  Temporal   │                     │   │
│   │   │   GPT-4o    │    │ (LLM Orch)  │    │ (Workflows) │                     │   │
│   │   │  [Phase 1]  │    │  [Phase 4]  │    │  [Phase 3]  │                     │   │
│   │   └─────────────┘    └─────────────┘    └─────────────┘                     │   │
│   │                                                                             │   │
│   │   Capabilities:                                                             │   │
│   │   • Plan My Day (Phase 1)                                                   │   │
│   │   • Task Breakdown (Phase 2)                                                │   │
│   │   • Email Drafts (Phase 2)                                                  │   │
│   │   • Cross-Pillar Intelligence (Phase 3)                                     │   │
│   │   • Proactive Agent Actions (Phase 4)                                       │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴─────────────────────────────────────────────────┐
│                                 DATA LAYER                                          │
│                                                                                     │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                  │
│   │   PostgreSQL     │  │   TimescaleDB    │  │    pgvector      │                  │
│   │   (Primary)      │  │   (Time-Series)  │  │   (Embeddings)   │                  │
│   │   [Phase 1]      │  │   [Phase 3]      │  │   [Phase 4]      │                  │
│   │                  │  │                  │  │                  │                  │
│   │ • users          │  │ • focus_sessions │  │ • task_embeddings│                  │
│   │ • tasks          │  │ • habit_logs     │  │ • journal_embeds │                  │
│   │ • calendar_events│  │ • usage_metrics  │  │ • pattern_vectors│                  │
│   │ • subscriptions  │  │ • billing_events │  │                  │                  │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘                  │
│                                                                                     │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                  │
│   │      Redis       │  │       R2         │  │   Event Store    │                  │
│   │   (Cache/Queue)  │  │   (File Storage) │  │   (Audit Log)    │                  │
│   │   [Phase 2]      │  │   [Phase 1]      │  │   [Phase 1]      │                  │
│   │                  │  │                  │  │                  │                  │
│   │ • AI responses   │  │ • User uploads   │  │ • All mutations  │                  │
│   │ • Session cache  │  │ • Exports        │  │ • Append-only    │                  │
│   │ • Rate limiting  │  │ • Backups        │  │ • Immutable      │                  │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴─────────────────────────────────────────────────┐
│                            EXTERNAL INTEGRATIONS                                    │
│                                                                                     │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│   │   Google    │  │   Stripe    │  │   Resend    │  │   Slack     │                │
│   │  Calendar   │  │  Payments   │  │   Email     │  │ Integration │                │
│   │  [Phase 1]  │  │  [Phase 1]  │  │  [Phase 1]  │  │  [Phase 3]  │                │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                                     │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│   │    Plaid    │  │  HealthKit  │  │  Google Fit │  │   Zapier    │                │
│   │  (Finance)  │  │  (Apple)    │  │  (Android)  │  │  (Platform) │                │
│   │  [Phase 4]  │  │  [Phase 4]  │  │  [Phase 4]  │  │  [Phase 4]  │                │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Technology Stack

### Phase 1: Foundation (Week 1-8)

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 (App Router) | Web application |
| **State** | Zustand + React Query | Client state + server cache |
| **Backend** | Fastify (TypeScript) | API server |
| **Database** | Supabase PostgreSQL | Primary data store |
| **Auth** | Supabase Auth | JWT + OAuth (Google, Apple) |
| **Realtime** | Supabase Realtime | Live updates |
| **AI** | OpenAI GPT-4o | Structured outputs |
| **Payments** | Stripe | Subscriptions + webhooks |
| **Email** | Resend | Transactional email |
| **File Storage** | Cloudflare R2 | S3-compatible storage |
| **Hosting** | Vercel + Railway | Frontend + Backend |

### Phase 2: Scale (Month 3-6)

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Mobile** | React Native (Expo) | iOS + Android |
| **Cache** | Redis (Upstash) | AI response cache, sessions |
| **Queue** | BullMQ | Background jobs |
| **Local DB** | SQLite (op-sqlite) | Mobile offline cache |

### Phase 3: Enterprise (Month 6-12)

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Event Bus** | NATS JetStream | Service communication |
| **Workflows** | Temporal.io | Long-running operations |
| **Time-Series** | TimescaleDB | Analytics, usage metrics |
| **API Gateway** | Kong | Rate limiting, routing |
| **Multi-Region** | Fly.io / Railway | Geographic distribution |

### Phase 4: Platform (Year 2+)

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Embeddings** | pgvector | Semantic search, RAG |
| **LLM Orchestration** | LangGraph | Complex AI workflows |
| **SSO** | WorkOS / Auth0 | Enterprise auth |
| **Compliance** | Vanta | SOC 2, GDPR automation |

---

## 🗄️ Database Architecture

### Schema Design Principles

1. **UUID Primary Keys** — Globally unique, sharding-ready
2. **Soft Deletes** — `deleted_at TIMESTAMPTZ` on all tables
3. **Audit Trail** — `created_at`, `updated_at` on all tables
4. **User Scoping** — `user_id` foreign key on all user data
5. **Timezone Aware** — All timestamps as `TIMESTAMPTZ`
6. **Event Sourced** — Append-only event log for all mutations

### Core Schema (Phase 1)

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Full-text search

-- Profiles (extends Supabase Auth)
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

-- Tasks
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
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  -- AI-generated
  ai_suggested_time TIMESTAMPTZ,
  ai_breakdown JSONB,  -- Subtask suggestions
  ai_context TEXT,     -- Why AI scheduled this way
  
  -- Tracking
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_due ON tasks(user_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_scheduled ON tasks(user_id, scheduled_start) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_search ON tasks USING gin(title gin_trgm_ops);

-- Calendar Events (synced from external calendars)
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
  recurrence_rule TEXT,  -- RRULE format
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

-- OAuth Tokens (encrypted)
CREATE TABLE oauth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  
  -- Encrypted tokens (use Supabase Vault or app-level encryption)
  access_token_encrypted BYTEA NOT NULL,
  refresh_token_encrypted BYTEA NOT NULL,
  
  expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- Subscriptions (Stripe-synced)
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

-- Event Store (Append-Only Audit Log)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Event metadata
  event_type TEXT NOT NULL,       -- 'task.created', 'task.completed', etc.
  entity_type TEXT NOT NULL,      -- 'task', 'calendar_event', etc.
  entity_id UUID NOT NULL,
  
  -- Event data
  action TEXT NOT NULL,           -- 'create', 'update', 'delete'
  payload JSONB NOT NULL,         -- The change
  previous_state JSONB,           -- For updates
  
  -- Context
  source TEXT DEFAULT 'api',      -- 'api', 'webhook', 'cron', 'ai'
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Append-only: remove UPDATE and DELETE permissions
REVOKE UPDATE, DELETE ON events FROM authenticated;
REVOKE UPDATE, DELETE ON events FROM service_role;

CREATE INDEX idx_events_user_type ON events(user_id, event_type, created_at DESC);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id, created_at DESC);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all user tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tasks: users can only access their own
CREATE POLICY "Users can CRUD own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);

-- Calendar: users can only access their own
CREATE POLICY "Users can CRUD own calendar"
  ON calendar_events FOR ALL
  USING (auth.uid() = user_id);

-- OAuth: users can only access their own tokens
CREATE POLICY "Users can CRUD own oauth tokens"
  ON oauth_tokens FOR ALL
  USING (auth.uid() = user_id);

-- Subscriptions: users can view own, only service can modify
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Events: users can view own events
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert events"
  ON events FOR INSERT
  WITH CHECK (true);  -- Service role inserts all events
```

---

## 🤖 AI Architecture

### AI Service Design

```typescript
// backend/src/modules/ai/ai.service.ts

import OpenAI from 'openai';
import { z } from 'zod';
import { Redis } from 'ioredis';

// Response schemas for structured outputs
export const PlanDayResponseSchema = z.object({
  scheduledTasks: z.array(z.object({
    taskId: z.string().uuid(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    rationale: z.string(),
  })),
  unscheduledTasks: z.array(z.object({
    taskId: z.string().uuid(),
    reason: z.string(),
  })),
  insights: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});

export class AIService {
  private openai: OpenAI;
  private redis: Redis | null;
  
  constructor(openai: OpenAI, redis?: Redis) {
    this.openai = openai;
    this.redis = redis ?? null;
  }

  async planDay(
    userId: string,
    tasks: Task[],
    calendarEvents: CalendarEvent[],
    preferences: UserPreferences
  ): Promise<z.infer<typeof PlanDayResponseSchema>> {
    // Check cache first (Phase 2)
    const cacheKey = this.buildCacheKey(userId, tasks, calendarEvents);
    if (this.redis) {
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    // Build prompt
    const systemPrompt = this.buildPlanDaySystemPrompt(preferences);
    const userPrompt = this.buildPlanDayUserPrompt(tasks, calendarEvents, preferences.timezone);

    // Call OpenAI with structured output
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,  // Lower for more consistent scheduling
      max_tokens: 2000,
    });

    // Parse and validate response
    const parsed = JSON.parse(response.choices[0].message.content!);
    const validated = PlanDayResponseSchema.parse(parsed);

    // Cache result (Phase 2) - 5 minute TTL
    if (this.redis) {
      await this.redis.setex(cacheKey, 300, JSON.stringify(validated));
    }

    // Log for analytics
    await this.logAIRequest(userId, 'plan_day', {
      taskCount: tasks.length,
      eventCount: calendarEvents.length,
      scheduledCount: validated.scheduledTasks.length,
      tokens: response.usage?.total_tokens,
    });

    return validated;
  }

  private buildPlanDaySystemPrompt(preferences: UserPreferences): string {
    return `You are an expert productivity assistant that schedules tasks intelligently.

## Your Mission
Create an optimal daily schedule that maximizes productivity while respecting constraints.

## Rules
1. NEVER double-book time slots
2. Leave 15-minute buffers between meetings
3. Schedule high-priority tasks during peak hours (${preferences.peakHoursStart || '09:00'}-${preferences.peakHoursEnd || '12:00'})
4. Maximum ${preferences.maxFocusHours || 6} hours of scheduled work per day
5. Respect existing calendar events as immutable
6. If a task cannot be scheduled today, explain why in unscheduledTasks

## Output Format
Return a JSON object matching this schema:
{
  "scheduledTasks": [{ "taskId": "uuid", "startTime": "ISO8601", "endTime": "ISO8601", "rationale": "why this time" }],
  "unscheduledTasks": [{ "taskId": "uuid", "reason": "why not today" }],
  "insights": ["optional productivity insights"],
  "warnings": ["optional warnings about the schedule"]
}`;
  }

  private buildPlanDayUserPrompt(
    tasks: Task[],
    events: CalendarEvent[],
    timezone: string
  ): string {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    return JSON.stringify({
      timezone,
      today,
      currentTime: now.toISOString(),
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        estimatedMinutes: t.estimated_minutes || 30,
        dueDate: t.due_date,
        labels: t.labels,
      })),
      blockedTime: events.map(e => ({
        title: e.title,
        start: e.start_time,
        end: e.end_time,
        isAllDay: e.is_all_day,
      })),
    });
  }

  private buildCacheKey(
    userId: string,
    tasks: Task[],
    events: CalendarEvent[]
  ): string {
    const taskHash = this.hashArray(tasks.map(t => `${t.id}:${t.updated_at}`));
    const eventHash = this.hashArray(events.map(e => `${e.id}:${e.updated_at}`));
    return `ai:plan_day:${userId}:${taskHash}:${eventHash}`;
  }

  private hashArray(arr: string[]): string {
    return require('crypto')
      .createHash('md5')
      .update(arr.sort().join(','))
      .digest('hex')
      .slice(0, 8);
  }

  private async logAIRequest(
    userId: string,
    action: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    // Insert into events table for analytics
    // This feeds into usage tracking and AI cost monitoring
  }
}
```

### AI Cost Control

| Control | Implementation | Impact |
|---------|----------------|--------|
| **Rate Limiting** | 10 AI calls/hour for Pro, 3 for Free | Prevents abuse |
| **Response Caching** | Redis with 5-min TTL | 40% cost reduction |
| **Token Budgets** | Max 2000 tokens per request | Predictable costs |
| **Model Selection** | GPT-4o-mini for simple tasks | 10x cheaper |
| **Batch Processing** | Daily digest in single call | Reduces call count |

---

## 🔄 Event Architecture

### Event Types

```typescript
// shared/src/events/event.types.ts

interface BaseEvent {
  id: string;
  timestamp: string;
  userId: string;
  source: 'api' | 'webhook' | 'cron' | 'ai';
}

// Task Events
interface TaskCreatedEvent extends BaseEvent {
  type: 'task.created';
  data: {
    taskId: string;
    title: string;
    priority: number;
    dueDate?: string;
  };
}

interface TaskCompletedEvent extends BaseEvent {
  type: 'task.completed';
  data: {
    taskId: string;
    actualMinutes?: number;
    completedViaAI: boolean;
  };
}

interface TaskScheduledEvent extends BaseEvent {
  type: 'task.scheduled';
  data: {
    taskId: string;
    scheduledStart: string;
    scheduledEnd: string;
    scheduledBy: 'user' | 'ai';
    rationale?: string;
  };
}

// Calendar Events
interface CalendarSyncedEvent extends BaseEvent {
  type: 'calendar.synced';
  data: {
    provider: 'google' | 'outlook' | 'apple';
    eventsAdded: number;
    eventsUpdated: number;
    eventsDeleted: number;
  };
}

// AI Events
interface AIPlanGeneratedEvent extends BaseEvent {
  type: 'ai.plan_generated';
  data: {
    tasksScheduled: number;
    tasksUnscheduled: number;
    tokensUsed: number;
    latencyMs: number;
  };
}

// Billing Events
interface SubscriptionChangedEvent extends BaseEvent {
  type: 'subscription.changed';
  data: {
    previousTier?: string;
    newTier: string;
    mrr: number;
  };
}

export type LifeOSEvent =
  | TaskCreatedEvent
  | TaskCompletedEvent
  | TaskScheduledEvent
  | CalendarSyncedEvent
  | AIPlanGeneratedEvent
  | SubscriptionChangedEvent;
```

### Event Emission Pattern

```typescript
// backend/src/shared/events/event-emitter.ts

import { LifeOSEvent } from '@lifeos/shared';
import { supabase } from '../db';

export class EventEmitter {
  async emit(event: Omit<LifeOSEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    // 1. Persist to event store (always succeeds first)
    await supabase.from('events').insert({
      id: fullEvent.id,
      user_id: fullEvent.userId,
      event_type: fullEvent.type,
      entity_type: fullEvent.type.split('.')[0],
      entity_id: (fullEvent.data as any).taskId || (fullEvent.data as any).id,
      action: fullEvent.type.split('.')[1],
      payload: fullEvent.data,
      source: fullEvent.source,
      created_at: fullEvent.timestamp,
    });

    // 2. Publish to NATS (Phase 3) for real-time subscribers
    // await this.nats.publish(`lifeos.events.${fullEvent.type}`, fullEvent);

    // 3. Trigger Supabase Realtime for connected clients
    // (Automatic via Supabase)
  }
}
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                        │
│                                                                 │
│   1. User signs in via Supabase Auth (email/OAuth)              │
│                         │                                       │
│                         ▼                                       │
│   2. Supabase returns JWT with user claims                      │
│      {                                                          │
│        "sub": "user-uuid",                                      │
│        "email": "user@example.com",                             │
│        "role": "authenticated",                                 │
│        "app_metadata": { "tier": "pro" }                        │
│      }                                                          │
│                         │                                       │
│                         ▼                                       │
│   3. Client stores JWT, sends in Authorization header           │
│      Authorization: Bearer <jwt>                                │
│                         │                                       │
│                         ▼                                       │
│   4. Backend validates JWT on every request                     │
│      - Signature validation (Supabase public key)               │
│      - Expiry check                                             │
│      - Extract user_id for RLS                                  │
│                         │                                       │
│                         ▼                                       │
│   5. Supabase RLS enforces data isolation                       │
│      SELECT * FROM tasks WHERE user_id = auth.uid()             │
└─────────────────────────────────────────────────────────────────┘
```

### Security Checklist

| Category | Implementation | Phase |
|----------|----------------|-------|
| **Auth** | Supabase Auth (JWT) | 1 |
| **Authorization** | Row Level Security | 1 |
| **API Security** | Rate limiting, CORS | 1 |
| **Data Encryption** | TLS in transit, encrypted at rest | 1 |
| **Token Security** | Vault/KMS for OAuth tokens | 2 |
| **Audit Logging** | Append-only event store | 1 |
| **GDPR** | Data export, deletion API | 2 |
| **SOC 2** | Formal controls, Vanta | 3 |
| **Penetration Testing** | Annual third-party audit | 3 |

---

## 📱 Client Architecture

### State Management Pattern

```typescript
// frontend/src/stores/tasks.store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Task, PlanDayResponse } from '@lifeos/shared';
import { api } from '../lib/api';

interface TasksState {
  // Data
  tasks: Task[];
  plannedSchedule: PlanDayResponse | null;
  
  // Loading states
  isLoading: boolean;
  isPlanningDay: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  planDay: () => Promise<PlanDayResponse>;
  
  // Optimistic updates
  _optimisticCreate: (task: Task) => void;
  _optimisticUpdate: (id: string, updates: Partial<Task>) => void;
  _optimisticDelete: (id: string) => void;
  _rollback: (previousState: Task[]) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    immer((set, get) => ({
      tasks: [],
      plannedSchedule: null,
      isLoading: false,
      isPlanningDay: false,
      error: null,

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await api.get<Task[]>('/api/v1/tasks');
          set({ tasks, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      createTask: async (input) => {
        const previousState = get().tasks;
        const tempId = `temp-${Date.now()}`;
        const optimisticTask: Task = {
          id: tempId,
          ...input,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Optimistic update
        get()._optimisticCreate(optimisticTask);

        try {
          const created = await api.post<Task>('/api/v1/tasks', input);
          // Replace temp with real
          set((state) => {
            const idx = state.tasks.findIndex(t => t.id === tempId);
            if (idx !== -1) state.tasks[idx] = created;
          });
          return created;
        } catch (err) {
          get()._rollback(previousState);
          throw err;
        }
      },

      completeTask: async (id) => {
        const previousState = get().tasks;
        
        // Optimistic
        get()._optimisticUpdate(id, {
          status: 'completed',
          completed_at: new Date().toISOString(),
        });

        try {
          await api.patch(`/api/v1/tasks/${id}`, { status: 'completed' });
        } catch (err) {
          get()._rollback(previousState);
          throw err;
        }
      },

      planDay: async () => {
        set({ isPlanningDay: true, error: null });
        try {
          const plan = await api.post<PlanDayResponse>('/api/v1/ai/plan-day');
          
          // Apply scheduled times to tasks
          set((state) => {
            for (const scheduled of plan.scheduledTasks) {
              const task = state.tasks.find(t => t.id === scheduled.taskId);
              if (task) {
                task.scheduled_start = scheduled.startTime;
                task.scheduled_end = scheduled.endTime;
                task.ai_context = scheduled.rationale;
              }
            }
            state.plannedSchedule = plan;
            state.isPlanningDay = false;
          });
          
          return plan;
        } catch (err) {
          set({ error: err.message, isPlanningDay: false });
          throw err;
        }
      },

      // Internal helpers
      _optimisticCreate: (task) => set((s) => { s.tasks.push(task); }),
      _optimisticUpdate: (id, updates) => set((s) => {
        const task = s.tasks.find(t => t.id === id);
        if (task) Object.assign(task, updates, { updated_at: new Date().toISOString() });
      }),
      _optimisticDelete: (id) => set((s) => {
        s.tasks = s.tasks.filter(t => t.id !== id);
      }),
      _rollback: (previous) => set({ tasks: previous }),
    })),
    {
      name: 'lifeos-tasks',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),  // Only persist tasks
    }
  )
);
```

---

## 🚀 Deployment Architecture

### Phase 1 Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT                               │
│                                                                 │
│   ┌─────────────┐                    ┌─────────────┐            │
│   │   Vercel    │                    │  Railway    │            │
│   │  (Frontend) │                    │  (Backend)  │            │
│   │             │                    │             │            │
│   │ • Next.js   │◄──── HTTPS ───────►│ • Fastify   │            │
│   │ • Edge SSR  │                    │ • Auto-scale│            │
│   │ • CDN       │                    │ • Logs      │            │
│   └─────────────┘                    └──────┬──────┘            │
│                                             │                   │
│                                             ▼                   │
│                                      ┌─────────────┐            │
│                                      │  Supabase   │            │
│                                      │             │            │
│                                      │ • PostgreSQL│            │
│                                      │ • Auth      │            │
│                                      │ • Realtime  │            │
│                                      │ • Storage   │            │
│                                      └─────────────┘            │
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │  Cloudflare │  │   Stripe    │  │   Resend    │             │
│   │     (R2)    │  │ (Payments)  │  │  (Email)    │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 3: Multi-Region

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MULTI-REGION                                    │
│                                                                         │
│   ┌─────────────┐              ┌─────────────┐                          │
│   │  US-EAST    │              │  EU-WEST    │                          │
│   │             │              │             │                          │
│   │ • API       │◄── Sync ────►│ • API       │                          │
│   │ • PostgreSQL│              │ • PostgreSQL│                          │
│   │ • Redis     │              │ • Redis     │                          │
│   └──────┬──────┘              └──────┬──────┘                          │
│          │                            │                                 │
│          └────────────┬───────────────┘                                 │
│                       │                                                 │
│               ┌───────┴───────┐                                         │
│               │  Cloudflare   │                                         │
│               │  (GeoDNS)     │                                         │
│               └───────────────┘                                         │
│                       │                                                 │
│                    Users                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
lifeos/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.controller.ts
│   │   │   │   ├── tasks.service.ts
│   │   │   │   ├── tasks.repository.ts
│   │   │   │   └── tasks.schema.ts
│   │   │   ├── calendar/
│   │   │   │   ├── calendar.controller.ts
│   │   │   │   ├── calendar.service.ts
│   │   │   │   ├── google-calendar.client.ts
│   │   │   │   └── calendar.schema.ts
│   │   │   ├── ai/
│   │   │   │   ├── ai.controller.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── prompts/
│   │   │   │   │   ├── plan-day.prompt.ts
│   │   │   │   │   └── task-breakdown.prompt.ts
│   │   │   │   └── ai.schema.ts
│   │   │   ├── billing/
│   │   │   │   ├── billing.controller.ts
│   │   │   │   ├── billing.service.ts
│   │   │   │   ├── stripe.client.ts
│   │   │   │   └── billing.schema.ts
│   │   │   └── auth/
│   │   │       ├── auth.middleware.ts
│   │   │       └── auth.guards.ts
│   │   ├── shared/
│   │   │   ├── db/
│   │   │   │   ├── supabase.ts
│   │   │   │   └── with-db.ts
│   │   │   ├── events/
│   │   │   │   ├── event-emitter.ts
│   │   │   │   └── event-handlers.ts
│   │   │   ├── middleware/
│   │   │   │   ├── error-handler.ts
│   │   │   │   ├── rate-limiter.ts
│   │   │   │   └── request-logger.ts
│   │   │   └── utils/
│   │   │       ├── crypto.ts
│   │   │       └── dates.ts
│   │   ├── server.ts
│   │   └── config.ts
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── tasks/
│   │   │   │   ├── calendar/
│   │   │   │   └── settings/
│   │   │   └── api/                # Route handlers (if needed)
│   │   ├── components/
│   │   │   ├── ui/                 # Shadcn components
│   │   │   ├── tasks/
│   │   │   ├── calendar/
│   │   │   └── ai/
│   │   ├── stores/
│   │   │   ├── tasks.store.ts
│   │   │   ├── calendar.store.ts
│   │   │   └── user.store.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── supabase.ts
│   │   │   └── utils.ts
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                          # React Native (Phase 2)
│   └── ...
│
├── shared/                          # Shared types and schemas
│   ├── src/
│   │   ├── types/
│   │   │   ├── task.ts
│   │   │   ├── calendar.ts
│   │   │   └── user.ts
│   │   ├── schemas/
│   │   │   ├── task.schema.ts
│   │   │   └── calendar.schema.ts
│   │   └── events/
│   │       └── event.types.ts
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml
│       ├── deploy-frontend.yml
│       └── test.yml
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── package.json                     # Workspace root
├── pnpm-workspace.yaml
└── turbo.json
```

---

## ⚠️ Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| **Concurrent Users** | > 1,000 | Add Redis for session caching |
| **Tasks per User** | > 10,000 | Implement cursor-based pagination |
| **API Latency p99** | > 500ms | Add read replicas, query optimization |
| **Calendar Sync Time** | > 10s | Move to background jobs (BullMQ) |
| **AI Cost per Month** | > $5,000 | Enable response caching, cheaper models |
| **Database Size** | > 100GB | Consider sharding strategy |
| **Error Rate** | > 0.1% | Add circuit breakers, retry logic |

---

## 🧬 Unicorn DNA: Built-In from Day 1

| Decision | Why It Matters at Scale |
|----------|------------------------|
| UUID primary keys | Database sharding ready |
| Soft deletes everywhere | GDPR compliance, data recovery |
| Append-only event log | Audit trail, AI training data, analytics |
| Modular monolith structure | Extract to microservices without rewrite |
| API versioning (`/api/v1/`) | Non-breaking changes for enterprise |
| Multi-tenant RLS | Team features without schema changes |
| Timezone-aware timestamps | Global users, no timezone bugs |

---

*Excellence at scale. Built for billions.*  
*Last updated: January 20, 2026*
