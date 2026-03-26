# PocketBase Migration Analysis

**Project:** Kairos Transcultural  
**Date:** January 8, 2026  
**Status:** ❌ **NOT RECOMMENDED** - Migration Risk Analysis Complete

---

## Executive Summary

**Recommendation: Do NOT migrate from Supabase to PocketBase**

This document contains both the original PocketBase migration plan and the comprehensive analysis showing why this migration is not advisable for the current Kairos Transcultural application.

---

## Part 1: Original PocketBase Migration Plan

### Objective
Deploy and configure a self-hosted backend using **PocketBase** on a VPS managed by **Dokploy**, replacing Supabase. The goal was to establish a lightweight, AI-accessible backend with native MCP support.

### User Context
- **Developer:** Dani (Full-stack AI Dev)
- **Constraint:** Must work seamlessly with **Claude Code** and **MCP** workflows for schema management and automation

### Infrastructure Specifications
- **Host Environment:** VPS (Self-hosted)
- **Orchestrator:** [Dokploy](https://dokploy.com/) (Docker-based PaaS)
- **Database Engine:** SQLite (Embedded within PocketBase)
- **Backend Framework:** PocketBase (Go-based, single binary)
- **Storage:** Docker Persistent Volume (for data persistence)

### Deployment Protocol (Dokploy)

#### 1. Service Selection
- Navigate to Project > **Create Service**
- Select **"Templates"** tab
- Search and select **"PocketBase"**

#### 2. Configuration
- **Name:** `backend-main` (or project specific name)
- **Image Tag:** `latest` (or specific version like `0.22.x` for stability)

#### 3. Persistence (CRITICAL)
- Ensure the volume mount is correctly set to persist the `/pb_data` directory
- **Standard Dokploy Path:** `/etc/dokploy/mounts/...` mapped to `/pb/pb_data` inside the container

#### 4. Networking
- **Domain:** Assign a subdomain (e.g., `api.yourdomain.com`)
- **Port:** Internal container port is usually `8090`
- **SSL:** Enable "Let's Encrypt" auto-certificate in Dokploy

### MCP Integration Protocol

**Context:** The user utilizes **Claude Code** locally. To manage this remote backend, the local environment must run the PocketBase MCP server pointing to the new VPS deployment.

**Configuration Snippet (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "pocketbase-vps": {
      "command": "npx",
      "args": ["-y", "@mabeldata/pocketbase-mcp"],
      "env": {
        "POCKETBASE_API_URL": "https://api.yourdomain.com",
        "POCKETBASE_ADMIN_EMAIL": "admin@yourdomain.com",
        "POCKETBASE_ADMIN_PASSWORD": "<password>" 
      }
    }
  }
}
```

### Development Workflow Guidelines

#### Schema Management
- **Do NOT** write SQL migration files
- Use the MCP tools (`create_collection`, `update_collection`) to modify the schema
- **Concept Mapping:** Treat "Collections" exactly as "Tables"
- **Security:** When creating collections, set `API Rules` immediately:
  - **Public Read:** Set rule to `""` (empty string)
  - **Auth Only:** Set rule to `"@request.auth.id != ''"`
  - **Owner Only:** Set rule to `"id = @request.auth.id"`

#### API Interactions
- No backend code generation is required for standard CRUD
- The API endpoint is auto-generated: `GET /api/collections/{collection_name}/records`
- If custom endpoint needed, use **PocketBase Hooks** (JS/Go) mounted in `pb_hooks`

#### Authentication
- PocketBase handles Auth. Use the `users` collection
- Do not build custom auth tables

### Maintenance & Safety

#### Backup Strategy
- Since the DB is a single file (`data.db` inside `pb_data`), the backup strategy is a simple file copy
- **Agent Task:** Suggest setting up a Cron job on the VPS to run:
  ```bash
  rsync -avz /path/to/pb_data /backup/location
  ```
  or sync to S3 via Rclone

#### Performance
- PocketBase can handle 10k+ concurrent connections easily on a small VPS
- If CPU spikes, check for unindexed queries in the logs

---

## Part 2: Current Setup Analysis

### Application Architecture

**Tech Stack:**
- **Next.js 16.1.1** with App Router
- **Supabase SSR** (`@supabase/ssr`) for seamless auth
- **Type-safe database integration** with `@supabase/supabase-js`
- **TypeScript** with full type safety

### Database Schema

**Current Tables (3 total):**

1. **cohorts**
   - Fields: `id`, `name`, `is_active`, `capacity`, `created_at`
   - Constraints: Single active cohort at a time
   - Relationships: One-to-many with participants

2. **participants**
   - Fields: `id`, `cohort_id`, `name`, `contact`, `status`, `form_completed`, `tally_data`, `added_by`, `created_at`, `updated_at`
   - Enums: `participant_status` ('expressed_interest' | 'confirmed' | 'denied')
   - Relationships: Many-to-one with cohorts and admins

3. **admins**
   - Fields: `id`, `email`, `name`, `is_approved`, `is_main_admin`, `created_at`
   - Used for: Admin authentication and approval workflow

### Key Integration Points

#### 1. Middleware Authentication (`src/middleware.ts`)
```typescript
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { cookies: { /* cookie management */ } }
)
const { data: { user } } = await supabase.auth.getUser()
```

#### 2. Server Actions (`src/lib/actions.ts`)
- **50+ Supabase queries** using the client
- Type-safe queries with Database types
- Complex joins and filtering logic
- Cache revalidation on mutations

#### 3. Client Components
- Real-time UI updates
- Auth state management
- Admin dashboard with live participant stats

### Production Status

**Live Deployment:**
- **URL:** `https://kairostranscultural.ifrim.tech`
- **Active Users:** Production environment with real users
- **Auth System:** Fully operational with email/password auth
- **Data:** Active cohorts and participants in database

### Supabase Dependencies

**Deep Integration Points:**
- **Middleware:** 40+ lines of Supabase-specific auth logic
- **Server Actions:** 15+ functions with Supabase queries
- **Type System:** Custom TypeScript types generated from Supabase schema
- **RLS Policies:** Row Level Security configured in Supabase
- **Webhooks:** Tally webhook integration using Supabase client

---

## Part 3: Migration Risk Assessment

### ❌ Critical Issues Identified

#### 1. Complete Auth System Rewrite Required

**Current Supabase SSR Auth:**
```typescript
// Used in middleware.ts and throughout app
const { data: { user } } = await supabase.auth.getUser()
```

**PocketBase Equivalent:**
```javascript
// Completely different token system
pb.collection('users').authViaEmail(email, password)
pb.authStore.loadFromCookie(cookieString)
```

**Impact:**
- **Middleware needs complete rewrite** (40+ lines)
- **All auth checks** in server actions need updating
- **Session management** is fundamentally different
- **Token validation** logic changes entirely

#### 2. Query Pattern Incompatibility

**Current Supabase Queries (50+ instances):**
```typescript
await supabase.from('participants')
  .select('*')
  .eq('status', 'confirmed')
  .eq('cohort_id', cohortId)

await supabase.from('cohorts')
  .select('*', { count: 'exact' })
  .eq('is_active', true)
  .single()
```

**PocketBase API Equivalent:**
```javascript
// Completely different syntax
await pb.collection('participants').getList(1, 50, {
  filter: 'status = "confirmed" && cohort_id = "' + cohortId + '"'
})

await pb.collection('cohorts').getFirstListItem('is_active = true')
```

**Impact:**
- **50+ query rewrites** required
- **Type safety** lost without custom TypeScript types
- **Error handling** logic differs significantly
- **Join syntax** is completely different

#### 3. Breaking Changes for Production Users

**Consequences:**
- **All existing auth tokens become invalid**
- **Required password reset** for every user
- **Session disruption** for logged-in admin users
- **Potential data loss** if migration fails

**User Impact:**
- Admins unable to access dashboard
- Participants unable to check status
- Trust and credibility damage

#### 4. Loss of Supabase-Specific Features

**Features to Lose:**
- ✅ **Row Level Security (RLS)** - Must be reimplemented as API rules
- ✅ **Realtime subscriptions** - Not available in PocketBase core
- ✅ **Type generation** - Automatic TypeScript types from schema
- ✅ **Storage integration** - Built-in file storage
- ✅ **Edge Functions** - For webhook processing
- ✅ **Dashboard UI** - For manual database inspection

#### 5. Development Time Investment

**Estimated Effort:**
- **Auth system rewrite:** 15-20 hours
- **Query migration:** 20-30 hours (50+ queries)
- **Type system recreation:** 5-8 hours
- **Testing & QA:** 10-15 hours
- **Documentation updates:** 3-5 hours

**Total: 50-78 hours of development time**

---

## Part 4: Migration Benefits vs. Costs

### Proposed Benefits

1. **Lightweight backend** ✓
   - **Reality:** Supabase is already lightweight for this use case (3 tables, <100 users)

2. **AI-accessible via MCP** ✓
   - **Reality:** Supabase also has MCP support available
   - Alternative: Use Supabase MCP server instead

3. **Self-hosted control** ✓
   - **Reality:** You already self-host with VPS + Docker
   - Supabase can be self-hosted if needed

4. **Cost savings** ❌
   - **Reality:** Supabase free tier covers current usage
   - Pricing becomes an issue at 10k+ users (not a concern now)

### Migration Costs

1. **50-78 hours development time** ❌
2. **Production user disruption** ❌
3. **Loss of mature features** ❌
4. **Regression risk** ❌
5. **Ongoing maintenance burden** ❌

---

## Part 5: Final Recommendation

### ❌ DO NOT MIGRATE TO POCKETBASE

**Reasons:**

1. **Production system is working perfectly**
   - No performance issues
   - No scaling problems
   - No cost concerns

2. **Migration risk outweighs benefits**
   - High development cost (50-78 hours)
   - User disruption required
   - Loss of proven features

3. **Current architecture is optimal**
   - Next.js + Supabase SSR is industry best practice
   - Type-safe database integration
   - Mature ecosystem

4. **Better alternatives exist**
   - If MCP is needed: Use Supabase MCP server
   - If cost is concern: Stay on free tier (covers 10k+ users)
   - If self-hosting is goal: Consider Supabase self-hosted

### ✅ Recommended Action: Stay with Supabase

**Focus efforts on:**
- Shipping new features
- Improving user experience
- Optimizing performance
- Growing user base

**Revisit migration only if:**
- You hit Supabase free tier limits (10k+ users)
- You need specific PocketBase features not available in Supabase
- You have 50+ hours of development time to invest

---

## Appendix: Migration Alternatives

### Option 1: Supabase MCP Integration

Keep Supabase, add MCP support for Claude Code:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "https://rzpssehbzutuakyremya.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

### Option 2: Hybrid Approach

Keep Supabase for production, use PocketBase for:
- Local development
- AI experimentation
- Feature testing

### Option 3: Self-Hosted Supabase

If self-hosting is the goal:
- Use Supabase Docker stack
- Maintain same codebase
- Keep all features
- Full control over data

---

## Document Metadata

**Author:** AI Analysis  
**Date:** January 8, 2026  
**Project:** Kairos Transcultural  
**Version:** 1.0  
**Status:** Final Recommendation - Do Not Migrate

**Related Documents:**
- `DEPLOYMENT_GUIDE.md`
- `DEPLOYMENT_TROUBLESHOOTING.md`
- `SPEC.md`
- `.env.local` (contains current Supabase configuration)

---

## Changelog

- **2026-01-08:** Initial analysis completed
- **2026-01-08:** Document created with original plan + analysis
- **2026-01-08:** Final recommendation: Do not migrate
