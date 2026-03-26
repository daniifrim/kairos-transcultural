# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Database**: Supabase (PostgreSQL) with custom TypeScript types
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State Management**: TanStack React Query for client state
- **Authentication**: Supabase Auth (Google OAuth + email/password)
- **External Integrations**: Tally webhook, OpenRouter AI (fuzzy name matching)

## Development Commands
```bash
yarn dev          # Start dev server (port 3000)
yarn build        # Production build (standalone output for Docker)
yarn start        # Start production server
yarn lint         # Run ESLint
```

## Architecture

### Overall Pattern
Server-client hybrid using Next.js App Router with role-based access control.

### Key Structural Patterns

**Dual Supabase Client Pattern** (src/lib/supabase/):
- `serverClient.ts` - Service role key, used in Server Components and API routes
- `clientClient.ts` - Anon key, used in client components via `createClientComponent()`

**Server Actions** (src/lib/actions.ts):
- All database mutations go through Server Actions
- Automatic revalidation of React Query cache
- Used by admin dashboard for participant/cohort management

**Authentication Flow**:
1. OAuth → creates `admins` record with `approved=false`
2. Approved admins → `/admin` dashboard
3. Unapproved admins → `/pending-approval`
4. No admin record → redirect to `/login`

### Data Flow
- **Homepage**: Real-time cohort stats (revalidated every 60s)
- **Admin Dashboard**: Client components with React Query + Server Actions
- **Tally Webhook** (src/app/api/webhooks/tally/):
  1. Receives form submission
  2. OpenRouter AI fuzzy-matches name against existing participants
  3. Creates new participant or updates existing one
  4. Handles Romanian name variations

### Important Conventions
- Server Components default, Client Components marked with `'use client'`
- UI components in src/components/ui/ are Radix primitives with Tailwind
- Public landing pages in src/components/landing/
- Admin dashboard in src/components/admin/

### Database Schema
- **cohorts** - Mission cohorts with capacity limits
- **participants** - Applications with status tracking and Tally form data
- **admins** - Admin users with approval workflow

## Deployment
- Standalone output configured (next.config.ts)
- Docker-ready deployment via Dokploy

## See Also
- Global rules: ~/.claude/CLAUDE.md
- Global skills: ~/.claude/skills/
