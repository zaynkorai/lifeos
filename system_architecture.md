# LifeOS System Architecture: Connected Pillars

> **Full-Scale Event-Driven Architecture for "Contextual Magic"**

---

## 🎯 The Problem We're Solving

**Disconnected Apps:**
> "Your habits don't know about your tasks, and your tasks don't know about your money."

**Connected Pillars Goal:**
> Scan post-workout meal → Updates Health → Notices $20 spent → Asks how you feel about fitness progress

---

## 🏗️ Target Architecture (At Scale)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                        │
│   │ React Native│  │  Next.js    │  │   Webhooks  │                        │
│   │   Mobile    │  │    Web      │  │(Plaid, etc.)│                        │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                        │
└──────────┼────────────────┼────────────────┼────────────────────────────────┘
           │                │                │
           └────────────────┴────────────────┘
                            │
                     ┌──────▼──────┐
                     │   API GW    │ (Fastify / Kong)
                     └──────┬──────┘
                            │
┌───────────────────────────┼─────────────────────────────────────────────────┐
│                      NATS MESSAGE BUS                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │   subjects: pillar.*, event.*, command.*, query.*                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└───────────────────────────┬─────────────────────────────────────────────────┘
                            │
        ┌──────────┬────────┴────────┬──────────┬──────────┐
        ▼          ▼                 ▼          ▼          ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│   TASKS    │ │   FOCUS    │ │  CALENDAR  │ │  HABITS    │ │  FINANCE   │
│  Service   │ │  Service   │ │  Service   │ │  Service   │ │  Service   │
│  [Phase 1] │ │  [Phase 1] │ │  [Phase 1] │ │  [Phase 2] │ │  [Phase 2] │
└─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
      │              │              │              │              │
      └──────────────┴──────────────┴──────────────┴──────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CORTEX (AI Brain)                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │   Event      │  │ Correlation  │  │   Insight    │                      │
│  │  Processor   │  │   Engine     │  │  Generator   │                      │
│  │  [Phase 1]   │  │  [Phase 2]   │  │  [Phase 2]   │                      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                      │
│         │                 │                 │                               │
│         └─────────────────┴─────────────────┘                               │
│                           │                                                  │
│                    ┌──────▼──────┐                                          │
│                    │   OpenAI    │                                          │
│                    │   GPT-4     │                                          │
│                    └─────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   PostgreSQL     │  │   TimescaleDB    │  │   Vector DB      │          │
│  │   (Core Data)    │  │   (Time-Series)  │  │   (Embeddings)   │          │
│  │   [Phase 1]      │  │   [Phase 2]      │  │   [Phase 2]      │          │
│  │                  │  │                  │  │                  │          │
│  │ - users          │  │ - health_metrics │  │ - journal_embeds │          │
│  │ - tasks          │  │ - habit_logs     │  │ - pattern_embeds │          │
│  │ - events         │  │ - focus_sessions │  │                  │          │
│  │ - calendars      │  │ - transactions   │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                                │
│  │      Redis       │  │       R2         │                                │
│  │   (Cache/Queue)  │  │   (File Storage) │                                │
│  │   [Phase 1]      │  │   [Phase 1]      │                                │
│  └──────────────────┘  └──────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INTEGRATIONS                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Google    │  │   Plaid     │  │  HealthKit  │  │   Google    │        │
│  │  Calendar   │  │  (Finance)  │  │  (Apple)    │  │    Fit      │        │
│  │  [Phase 1]  │  │  [Phase 2]  │  │  [Phase 2]  │  │  [Phase 2]  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Technology Stack (Full Scale)

| Layer | Technology | Purpose | Phase |
|-------|------------|---------|-------|
| **API Gateway** | Fastify + Kong | Rate limiting, auth, routing | Phase 1 (Fastify only) |
| **Message Bus** | NATS JetStream | Event streaming, pub/sub | Phase 1 |
| **Primary DB** | PostgreSQL (Supabase) | Core relational data | Phase 1 |
| **Time-Series DB** | TimescaleDB | Health metrics, habit logs | Phase 2 |
| **Vector DB** | Weaviate / Pinecone | Journal embeddings, pattern matching | Phase 2 |
| **Cache** | Redis | Session, rate limiting, queue | Phase 1 |
| **File Storage** | Cloudflare R2 | Receipts, exports, backups | Phase 1 |
| **AI** | OpenAI GPT-4 | Insights, correlations, drafts | Phase 1 (basic), Phase 2 (full) |

---

## 📡 NATS Event Architecture

### Subject Hierarchy

```
lifeos.
├── events.                          # All domain events
│   ├── tasks.created
│   ├── tasks.completed
│   ├── focus.started
│   ├── focus.ended
│   ├── habits.checked
│   ├── finance.transaction
│   ├── health.logged
│   └── journal.created
├── commands.                        # Imperative actions
│   ├── tasks.create
│   ├── focus.start
│   └── insights.generate
├── queries.                         # Request/reply
│   ├── tasks.list
│   ├── calendar.today
│   └── insights.recent
└── system.                          # Infrastructure
    ├── health
    └── metrics
```

### Event Schema (CloudEvents Standard)

```typescript
interface LifeOSEvent {
  // CloudEvents standard fields
  id: string;                    // UUID
  source: string;                // "lifeos/tasks-service"
  type: string;                  // "tasks.completed"
  specversion: "1.0";
  time: string;                  // ISO 8601
  
  // LifeOS extensions
  subject: string;               // User ID
  datacontenttype: "application/json";
  data: {
    entityId: string;            // Task/Habit/Session ID
    entityType: string;          // "task", "habit", "focus_session"
    action: string;              // "created", "completed", "deleted"
    payload: Record<string, any>;
    metadata: {
      clientVersion: string;
      platform: "ios" | "android" | "web";
    }
  }
}
```

---

## 🗄️ Database Schema (Full Scale)

### PostgreSQL (Core Data)

```sql
-- ==================== PHASE 1 ====================

-- Users (Supabase Auth handles this)

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Central Event Store (Append-Only)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  source_service TEXT NOT NULL,
  entity_id UUID,
  entity_type TEXT,
  payload JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_events_user_type ON events(user_id, event_type, created_at DESC);
CREATE INDEX idx_events_unprocessed ON events(processed, created_at) WHERE processed = FALSE;

-- Calendar Events
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'google',
  external_id TEXT,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, external_id)
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone TEXT DEFAULT 'UTC',
  theme TEXT DEFAULT 'system',
  pomodoro_duration INTEGER DEFAULT 25,
  ai_features_enabled BOOLEAN DEFAULT FALSE,
  correlation_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PHASE 2 ====================

-- Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT DEFAULT 'daily',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Correlations
CREATE TABLE correlations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_event_ids UUID[] NOT NULL,
  insight_type TEXT NOT NULL,
  insight_text TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  shown_to_user BOOLEAN DEFAULT FALSE,
  user_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### TimescaleDB (Phase 2 - Time-Series)

```sql
-- Focus Sessions (Time-Series)
CREATE TABLE focus_sessions (
  time TIMESTAMPTZ NOT NULL,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  task_id UUID,
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  abandoned BOOLEAN DEFAULT FALSE
);

SELECT create_hypertable('focus_sessions', 'time');
CREATE INDEX idx_focus_user ON focus_sessions(user_id, time DESC);

-- Health Metrics (Time-Series)
CREATE TABLE health_metrics (
  time TIMESTAMPTZ NOT NULL,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL,  -- 'sleep_hours', 'steps', 'exercise_minutes'
  value FLOAT NOT NULL,
  source TEXT DEFAULT 'manual'
);

SELECT create_hypertable('health_metrics', 'time');

-- Habit Logs (Time-Series)
CREATE TABLE habit_logs (
  time TIMESTAMPTZ NOT NULL,
  user_id UUID NOT NULL,
  habit_id UUID NOT NULL,
  completed BOOLEAN NOT NULL
);

SELECT create_hypertable('habit_logs', 'time');
```

### Vector DB Schema (Phase 2 - Embeddings)

```typescript
// Weaviate Schema
{
  class: "JournalEntry",
  properties: [
    { name: "userId", dataType: ["string"] },
    { name: "entryId", dataType: ["string"] },
    { name: "content", dataType: ["text"] },
    { name: "sentiment", dataType: ["number"] },
    { name: "createdAt", dataType: ["date"] }
  ],
  vectorizer: "text2vec-openai"
}

{
  class: "UserPattern",
  properties: [
    { name: "userId", dataType: ["string"] },
    { name: "patternType", dataType: ["string"] },
    { name: "description", dataType: ["text"] },
    { name: "confidence", dataType: ["number"] }
  ]
}
```

---

## 🧠 Cortex (AI Brain) Architecture

### Event Processor (Phase 1 - Basic)

```typescript
// NATS subscriber for all events
nats.subscribe('lifeos.events.>', async (msg) => {
  const event = JSON.parse(msg.data);
  
  // Store in PostgreSQL
  await db.events.insert(event);
  
  // Phase 1: Basic processing
  await processBasicCorrelations(event);
});

async function processBasicCorrelations(event: LifeOSEvent) {
  // Simple rules-based correlations
  if (event.type === 'focus.ended' && !event.data.payload.completed) {
    // User abandoned focus session
    await checkBurnoutPattern(event.subject);
  }
  
  if (event.type === 'tasks.completed') {
    // Check for streak
    await updateProductivityStreak(event.subject);
  }
}
```

### Correlation Engine (Phase 2 - AI-Powered)

```typescript
class CorrelationEngine {
  async processUserEvents(userId: string) {
    // 1. Get recent events from PostgreSQL
    const events = await db.events.findRecent(userId, { hours: 24 });
    
    // 2. Get time-series data from TimescaleDB
    const focusData = await timescale.focusSessions.aggregate(userId, '7d');
    const healthData = await timescale.healthMetrics.recent(userId, '7d');
    
    // 3. Get similar patterns from Vector DB
    const similarPatterns = await weaviate.query('UserPattern', {
      nearText: { concepts: [this.buildContext(events)] },
      where: { path: ['userId'], operator: 'Equal', valueString: userId }
    });
    
    // 4. Build context for OpenAI
    const context = {
      recentEvents: events,
      focusStats: focusData,
      healthStats: healthData,
      historicalPatterns: similarPatterns
    };
    
    // 5. Generate insights
    const insight = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: CORRELATION_PROMPT },
        { role: 'user', content: JSON.stringify(context) }
      ],
      response_format: { type: 'json_object' }
    });
    
    // 6. Store and optionally notify
    if (insight.confidence > 0.7) {
      await this.storeAndNotify(userId, insight);
    }
  }
}
```

---

## 📱 Phase 1 Implementation Subset

### Services to Build

| Service | Features | NATS Subjects |
|---------|----------|---------------|
| **API Gateway** | Auth, routing, rate limiting | N/A |
| **Tasks Service** | CRUD, priorities, due dates | `lifeos.events.tasks.*` |
| **Focus Service** | Pomodoro timer, sessions | `lifeos.events.focus.*` |
| **Calendar Service** | Google sync, daily view | `lifeos.events.calendar.*` |
| **Event Processor** | Basic logging, simple rules | Subscribes to `lifeos.events.>` |

### Phase 1 Infrastructure

```yaml
# docker-compose.yml (Phase 1)
services:
  api:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=${SUPABASE_URL}
      - NATS_URL=nats://nats:4222
      - REDIS_URL=redis://redis:6379
  
  nats:
    image: nats:latest
    ports:
      - "4222:4222"
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

---

## 🚀 Phase Rollout

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1** | 6 weeks | Tasks + Focus + Calendar + Basic NATS events |
| **Phase 2A** | 4 weeks | Habits + Habit gamification |
| **Phase 2B** | 4 weeks | Finance (manual) + TimescaleDB migration |
| **Phase 2C** | 4 weeks | Health (manual) + Vector DB for journals |
| **Phase 3** | 6 weeks | Full Cortex AI + External integrations (Plaid, HealthKit) |

---

> **Architecture Principle:** Build for scale, deploy incrementally. NATS in Phase 1 means we're ready for Phase 2 without rewriting.
