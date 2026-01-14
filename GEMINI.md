# GEMINI Context & Usage Guide

This document provides context for the **LifeOs** (personal productivity Platform) project. It outlines the architecture, tech stack, and current implementation details to assist the Gemini agent in future tasks. This file serves as a persistent memory and context holder for Gemini.

## 1. Project Overview & Vision

### The $1B Thesis
> *"Single Source of Truth for a Human Being"* — not another tool, but **The Operating System for Life**.

**Goal:** To build the "Central Intelligence Hub" that becomes the most valuable real estate on a person's phone — replacing 10+ fragmented $5/month subscriptions with one unified life management platform.

**Core Value:** We aren't selling a "Tool." We are selling **Reduced Cognitive Load** through proactive AI agency and contextual intelligence.

### The 6 Pillars — "The Perfect 6"

| # | Pillar | Description |
|---|--------|-------------|
| 1 | **Focus/Deep Work** | Pomodoro timer + distraction blocking |
| 2 | **Agentic Tasks** | AI-powered task management (drafts emails, schedules meetings) |
| 3 | **Habit Gamification** | Lightweight streaks, progress bars, milestone badges (no XP/leaderboards — research-backed) |
| 4 | **Personal Finance** | Envelope budgeting (manual V1, bank API V2) |
| 5 | **Wellness/Mindfulness** | Journal + mood tracker with AI insights |
| 6 | **Calendar/Meetings** | Calendar + meeting booking links |

### The 4 Pillars of the Ecosystem (Architectural Foundations)

| Pillar | Description |
|--------|-------------|
| **Unified Data Lake** | Sleep, fitness, calendar, tasks, finances — all life data interconnected |
| **Proactive Agency** | AI doesn't just remind — it *drafts, schedules, adjusts, executes* |
| **Human-in-the-Loop Privacy** | Verified security, explicit permissions, trust by design |
| **Contextual Magic** | Cross-domain intelligence (poor sleep → lighter task list) |

### The Neural Engine
All 6 pillars share a unified AI Data Layer — enabling **Contextual Magic**:

**Key Examples:**
- Workout completed → "Drink Water" auto-marked in Habits → "Protein Shake" added to Budget
- Poor sleep (5 hrs) → Task module prioritizes only 3 "Must Do" items → Calendar reschedules deep-work
- Low focus score (3x Pomodoro abandoned) → Cross-ref sleep/calendar → Generate "Why today is hard" insight
- Journal sentiment low 3 days → Correlate with habits/sleep → Surface burnout alert with recovery plan
- **AI Schedules Your Day (opt-in):** User wakes up to fully planned day based on tasks, energy, and calendar

### 3-Phase Platform Strategy
| Phase | Focus | Outcome |
|-------|-------|---------|
| **Phase 1** | Build Core (Task/Focus/Calendar) | Product-Market Fit |
| **Phase 2** | Add 5 Mini-modules | Full Ecosystem Lock-in |
| **Phase 3** | Open API for "Life Tiles" | **Billion Dollar Platform** |

### Target Market
- **Primary:** High-Performance Professionals (Executives, High-Value Freelancers)
- **Secondary:** Gen Z trying to be productive
- **Monetization:** Tiered Subscription ($5/mo Core, $20/mo AI+, $50/mo Executive)
- **Value Prop:** "I've organized your day for you."

### Strategic Moat
- **Anti-App-Fatigue:** One subscription replaces 10 fragmented apps
- **Agentic Differentiation:** Doesn't just organize — *does the work*
- **Niche Expansion:** "Productivity for [X Profession]" vertical scaling (Solar Engineers, Amazon Sellers, etc.) 


## 2. Tech Stack

### Frontend (`/frontend`)
*   **Framework**: Next.js 15+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + Shadcn/UI (Theme: "Premium AI" - Glassmorphism, Glows, Monochromatic Accents)
*   **State Management**: Zustand (with LocalStorage persistence)
*   **Forms**: React Hook Form + Zod
*   **Realtime**: Supabase Realtime (for instant balance updates)
*   **A11y**: ARIA-compliant modular notifications (Toasts, Banners, Inline)

### Backend (`/backend`)
*   **Framework**: Fastify (with Dependency Injection Singleton pattern)
*   **Language**: TypeScript
*   **AI Engine**: OpenAI (gpt-5.1) with Structured Outputs
*   **PDF Parsing**: `pdf-parse` with Magic Byte validation
*   **Logging**: Pino (Structured logging for cost observability)
*   **Billing**: LemonSqueezy (Webhooks + API)
*   **Email**: Resend SDK (Transactional notifications)

### Infrastructure & Services
*   **Database**: Supabase (PostgreSQL with RLS and Unique Constraints)
*   **Storage**: Cloudflare R2 (S3-compatible)
*   **Auth**: Supabase Auth (JWT)

### Current Project Status
- **Backend**: Fastify on port 8001
- **Frontend**: Next.js 15 on port 3001
- **Storage**: In-memory (Transitioning to Supabase/PostgreSQL planned)

## Core Features
- [x] Command Center Dashboard
- [x] Task Management (Priority Queue)
- [x] Habit Matrix (30-day tracking)
- [x] Theme Toggling (Mission Control Aesthetics)

## Tech Stack
- **Languages**: TypeScript (Full-stack)
- **Backend**: Fastify, Zod, Pino
- **Frontend**: Next.js (App Router), Zustand, Vanilla CSS
- **Mobile**: React Native (Expo SDK 52)





### High-Level Data Lifecycle
1.  **Sync**: Frontend -> Optimistic UI -> Backend API -> Database (Supabase).
2.  **Habit Matrix**: Daily Toggles -> Fastify Service -> Aggregated "Streak" Calculation.
3.  **AI Agent**: Chat Interface -> OpenAI (Structured Output) -> Task Creation/Scheduling.

### Transactional Communication Layer
-   **Triggers**: Weekly Summary, System Alerts (Budget/Habit misses), Security Login.
-   **Stack**: Resend SDK + React Email templates.
-   **Compliance**: Strict separation of "Transactional" vs. "Marketing" tags.

### Growth Engine
-   **Mechanism**: "Invite a Crew Member" (Unlock premium themes/widgets).
-   **Tech**: Database triggers track referral code usage.
-   **Safety**: IP rate limiting to prevent abuse.

## 4. Key Implementation Details

### UI & Notification Logic
- **Success messages**: Must be **Toasts** (top-right, non-blocking, auto-dismiss 4s).
- **Error messages (Page)**: Must be **Banners** at top of page (persistent, manual close).
- **Error messages (Form)**: Must be **In-line** directly below input (persistent, red text + icon).
- **Warning messages**: Must be **Banners** at top of section/card (persistent).

### API Endpoints

#### Admin (Scoped under /api/admin)
- `GET /api/admin/stats`: Fetch dashboard summary (DB-aggregated).
- `GET /api/admin/users`: List users with mandatory pagination (max 100) and audit logging.
- `GET /api/admin/transactions`: List ledger history with audit logging.

#### Profile
- `GET /api/profile`: Retrieve the authenticated user's profile.
- `PATCH /api/profile`: Update user target role, market, and preferences.
- `PATCH /api/profile/referral`: Manually apply a referral code (for direct OAuth signups).

#### Billing
- `POST /api/billing/webhook`: Ingress for LemonSqueezy events (Idempotent).
- `GET /api/billing/plans`: Fetch active pricing plans (Synced from LemonSqueezy).
- `POST /api/billing/checkout`: Generate a hosted checkout URL.
- `GET /api/billing/history`: Fetch transaction ledger for the user.

## 5. Staff Engineering Principles (Strict Adherence Required)

1.  **Move Failure "Left"**: Validate binary integrity and content length at the moment of upload.
3.  **Database-Bound Idempotency**: Rely on DB Constraints (`UNIQUE`), not code-level `if/else`, to prevent race conditions.
4.  **Fail-Closed PII Access**: Audit logging for sensitive data access must be successfully completed *before* the data is returned to the admin.
5.  **Self-Healing APIs**: Endpoints should be "Creation-Aware."
6.  **Singleton Resource Management**: Instantiate services once in `server.ts` and inject them. Never use `new Service()` inside routes.
7.  **Trust, but Verify**: Always `.parse()` AI JSON responses with Zod before saving to the database.
8.  **Financial Safety**: Never trust client-side math. Always use server-side Ledger logic with Pessimistic Locking.
9.  **Branding Consistency**: All external communications (Emails) must follow the high-contrast, bold Lifeos brand identity.
10. **Immutable Compliance**: All administrative actions must be logged to a table where `UPDATE` and `DELETE` permissions are revoked.
11. **Persistent Errors**: Never auto-dismiss an error or warning. Require manual action or resolution to maintain trust.
12. **Type Safety vs. Runtime Safety**: TypeScript types are erased at runtime. Always use a mapper function to convert raw database values.
13. **Unified Data Access**: Use the `withDb` helper pattern for all repositories. This ensures consistent error handling, logging, and snake_case to camelCase mapping across the entire persistence layer.

## 6. Setup & Commands

**Backend**:
*   `pnpm build`: Verify DI and ESM extensions.

**Frontend**:
*   `pnpm build`: Verify type safety across the pipeline.


## 7. Development Guidelines for AI Agents

*   **Integrity & Recursive Audits:** Every refactor or "cleanup" is a high-risk operation. You must perform a **Recursive Audit** after every change to ensure implicit logic (e.g., R2 signature parameters, database constraints) has not been accidentally regressed.
*   **Communication & Approval:** **DO NOT RUSH.** You must wait for explicit user approval before implementing large changes, especially those that shift the product model. Always share your plan first and wait for confirmation.
*   **Conventions:** Follow the existing Controller-Service-Repository pattern.
*   **Linting:** Strictly adhere to the configured ESLint rules (unused imports, variables, etc.). 
*   **Validation:** Always update Zod schemas in both Backend and Frontend and mobile when modifying data models.
*   **Safety:** Do not commit secrets. Use environment variables.
*   **Output:** When generating code, prefer small, atomic file edits.
*   **Immutable Config:** Use `as const` for configuration objects (like themes) to infer literal types and prevent accidental mutation.
*   **Ingress Resilience:** Webhook handlers must be tested against malformed JSON and invalid signatures. Fail gracefully (400/200 OK with error log) rather than crashing.
*   **Mocking Strategy:** Mock network boundaries (fetch, axios) but use real standard libraries (crypto, path) for logic verification. Do not mock internal logic unless absolutely necessary.
*   **Testing Gaps:** A PR is rejected if it lacks "Unhappy Path" tests (DB failures, missing keys, null returns).
*   **Final Verification:** After finishing any task, you must review the entire implementation as a **Tech Lead** and then as **"QA/TEST Lead**". This means verifying both the **Architectural Integrity** (security, scalability, idempotency) and **Code Correctness** (types, imports, syntax). A mandatory `pnpm build` check must be executed for both Backend and Frontend to ensure zero regressions.

---
*Document last updated: January 15, 2026*