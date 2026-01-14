# LifeOS Phase 1: Implementation Plan

> **Goal:** Prove the "Plan My Day" core loop works before expanding to 6 pillars.

---

## 📋 Phase 1 Scope (MVP)

### What's IN Scope

| Pillar | Core Features |
|--------|---------------|
| **Task Management** | Create/edit/delete tasks, due dates, priorities, daily view |
| **Focus/Deep Work** | Pomodoro timer, focus sessions, distraction-free mode |
| **Calendar** | Google Calendar sync, daily/weekly view, time blocking |

### What's OUT of Scope (Phase 2+)

- ❌ Habit Gamification (streaks, progress bars) → Phase 2
- ❌ Personal Finance (envelope budgeting) → Phase 2
- ❌ Wellness/Journal (mood tracker, AI insights) → Phase 2
- ❌ AI Email Drafting → Phase 2
- ❌ Social Media Scheduling → Phase 2
- ❌ Apple Health / Plaid integrations → Phase 2

---

## 🎯 Phase 1 Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| **Time to First Task** | < 2 minutes | Ultra-simple onboarding |
| **Daily Active Users (DAU)** | 100+ | Proves daily habit potential |
| **7-Day Retention** | > 40% | Users find value |
| **Task Completion Rate** | > 60% | App is actually useful |
| **NPS Score** | > 30 | Users would recommend |

---

## 🏗️ Technical Architecture

### Frontend (Mobile)

| Component | Technology |
|-----------|------------|
| Framework | React Native (Expo SDK 52) |
| State Management | Zustand |
| Navigation | Expo Router |
| Styling | NativeWind (Tailwind for RN) |
| Calendar | react-native-calendars |
| Timer | Custom Pomodoro component |

### Frontend (Web)

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + Shadcn/UI |
| State | Zustand |
| Forms | React Hook Form + Zod |

### Backend

| Component | Technology |
|-----------|------------|
| Framework | Fastify |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth) |
| Storage | Cloudflare R2 |
| AI | OpenAI GPT-4 (structured outputs) |

---

## 📊 Database Schema (Phase 1)

```sql
-- Users (handled by Supabase Auth)

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority INTEGER DEFAULT 0, -- 0=none, 1=low, 2=medium, 3=high
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete
);

-- Focus Sessions
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  abandoned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Events (synced from Google)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  google_event_id TEXT UNIQUE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone TEXT DEFAULT 'UTC',
  default_pomodoro_duration INTEGER DEFAULT 25,
  theme TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📱 Core User Flows (Phase 1)

### Flow 1: First Launch → First Task (< 2 min)

1. User downloads app → Splash screen
2. "Sign in with Google" (one-tap)
3. Welcome screen: "Let's get your first task done"
4. Simple input: "What's on your mind?" → Creates task
5. Dashboard shows task + "Start Focus" button

### Flow 2: Daily Planning

1. Open app → See "Today" view
2. View calendar events + tasks for today
3. Drag tasks to time slots (optional)
4. Tap task → "Focus on this" → Starts Pomodoro

### Flow 3: Focus Session

1. Select task → Tap "Focus"
2. Pomodoro timer starts (25 min default)
3. Option: Distraction-free mode (locks other apps - mobile only)
4. Timer completes → Celebrate → Task marked as done (optional)
5. "Take a break" or "Another session?" prompt

---

## 🔌 API Endpoints (Phase 1)

### Tasks

```
GET    /api/tasks              - List user's tasks
POST   /api/tasks              - Create task
GET    /api/tasks/:id          - Get task
PATCH  /api/tasks/:id          - Update task
DELETE /api/tasks/:id          - Soft delete task
POST   /api/tasks/:id/complete - Mark task complete
```

### Focus Sessions

```
POST   /api/focus/start        - Start focus session
PATCH  /api/focus/:id/complete - Complete session
PATCH  /api/focus/:id/abandon  - Abandon session
GET    /api/focus/stats        - Get focus stats (today, week, month)
```

### Calendar

```
GET    /api/calendar/connect   - OAuth flow for Google Calendar
GET    /api/calendar/events    - Get synced events
POST   /api/calendar/sync      - Trigger manual sync
```

### User

```
GET    /api/user/profile       - Get user profile
PATCH  /api/user/preferences   - Update preferences
DELETE /api/user               - Delete account (cascade)
```

---

## 🚀 Phase 1 Milestones

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 1 | Foundation | Auth, DB schema, basic API structure |
| 2 | Task CRUD | Full task management (web + mobile) |
| 3 | Focus Timer | Pomodoro timer with sessions tracking |
| 4 | Calendar Sync | Google Calendar integration |
| 5 | Polish | Onboarding, daily view, UX refinements |
| 6 | Beta Launch | Deploy to TestFlight + invite 50 users |

---

## ✅ Verification Plan

### Automated Tests

```bash
# Backend unit tests
cd backend && pnpm test

# Backend build verification
cd backend && pnpm build
```

### Manual Testing

1. **First Launch Flow**
   - Fresh install → Sign in → Create first task → Verify < 2 min

2. **Task CRUD**
   - Create, edit, complete, delete tasks → Verify data persists

3. **Focus Timer**
   - Start 1-min test timer → Complete → Verify session logged

4. **Calendar Sync**
   - Connect Google Calendar → Verify events appear

### User Acceptance (Beta)

- Invite 10 users for 1-week trial
- Survey: "Would you continue using this?"
- Track daily opens and task completion rate

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Calendar OAuth complexity | High | Use Supabase OAuth helpers, fallback to manual entry |
| Pomodoro notifications on mobile | Medium | Request permissions early, graceful degradation |
| Scope creep to 6 pillars | High | Strict feature freeze, "Phase 2" parking lot |
| Low retention after novelty | High | Focus on daily habit formation, streak indicators |

---

## 🎨 Design Principles (Phase 1)

1. **One action per screen** — No cognitive overload
2. **Big, tappable buttons** — Mobile-first
3. **Celebration on completion** — Dopamine for finishing tasks
4. **Dark mode default** — Premium AI aesthetic
5. **< 3 taps to any action** — Speed is king

---

> **Phase 1 Mantra:** "Nail the daily planning loop before adding anything else."
