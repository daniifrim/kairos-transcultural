# Deployment Troubleshooting Guide

## Overview

This document documents all issues encountered during the initial deployment of the Kairos Transcultural application to Dokploy, along with their root causes and solutions. This guide serves as a reference for future deployments and troubleshooting.

---

## Issue 1: Environment Files Not Found During Docker Build

### Error Message
```
#11 [builder 5/8] COPY .env.production .env.production
#11 ERROR: failed to calculate checksum of ref: "/.env.production": not found

#11 [builder 6/8] COPY .env.local .env.local 2>/dev/null || true
#11 ERROR: failed to calculate checksum of ref: "/||": not found
```

### Root Cause
1. The Dockerfile was trying to copy `.env.production` and `.env.local` files that didn't exist in the cloned repository
2. The `.gitignore` file was configured to ignore ALL `.env*` files (`.env*` pattern), preventing these files from being committed to the repository
3. Next.js requires environment variables at **build time** for client-side variables (prefixed with `NEXT_PUBLIC_`)

### Solution
**Fixed in commits:** 
- `03608ab` - Initial environment configuration
- Later commits refined the approach

**Changes made:**
1. **Updated `.gitignore`** to only ignore specific environment files:
   ```gitignore
   # Before
   .env*

   # After
   .env.local
   .env.example
   ```
   This allows `.env.production` to be committed to the repository.

2. **Simplified Dockerfile** to copy all files at once:
   ```dockerfile
   # Before
   COPY .env.production .env.production
   COPY .env.local .env.local 2>/dev/null || true
   COPY . .

   # After
   COPY . .
   ```
   This avoids trying to copy non-existent files individually.

3. **Created `.env.production`** with production environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://rzpssehbzutuakyremya.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   NEXT_PUBLIC_SITE_URL=https://kairostranscultural.ifrim.tech
   SUPABASE_SERVICE_ROLE_KEY=placeholder-service-role-key
   ```

### Prevention
- **Always run `npm run build` locally before pushing** to catch build-time errors
- **Review `.gitignore` carefully** to ensure necessary files aren't being excluded
- **Document which environment files should be committed** vs which should be local-only

---

## Issue 2: TypeScript Compilation Errors in Supabase Queries

### Error Message
```
./src/app/admin/page.tsx:38:25
Type error: Property 'is_approved' does not exist on type 'never'.

./src/app/signup/page.tsx:47:8
Type error: No overload matches this call.
```

### Root Cause
1. TypeScript couldn't properly infer types from Supabase queries
2. The `Database` type was defined but TypeScript struggled with complex generic type inference
3. Server-side Supabase client had different type inference behavior than client-side
4. Multiple files had similar issues with `.insert()`, `.update()`, and `.delete()` operations

### Files Affected
- `src/app/admin/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/components/admin/AddParticipantDialog.tsx`
- `src/components/admin/CohortSelector.tsx` (multiple operations)
- `src/app/api/webhooks/tally/route.ts`

### Solution
**Fixed in commit:** `eee07ca`

**Changes made:**
1. **Added explicit type imports** where needed:
   ```typescript
   import { Database } from '@/types/database'
   ```

2. **Used type assertions for problematic operations**:
   ```typescript
   // Client-side (works with generic type parameter)
   await supabase
     .from('admins')
     .insert<Database['public']['Tables']['admins']['Insert']>({
       // ...
     })

   // Server-side (requires 'as any' due to type inference issues)
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   await (supabase.from('admins') as any)
     .insert({
       // ...
     })
   ```

3. **Fixed webhook route** - Changed `added_by: null` to `added_by: 'tally-webhook'` to satisfy type requirements

### Prevention
- **Run TypeScript build locally** before every deployment:
  ```bash
  npm run build
  ```
- **Fix ALL TypeScript errors** before pushing to production
- **Be consistent with type assertions** across the codebase
- **Use ESLint comments** sparingly and document why they're needed

---

## Issue 3: Missing Standalone Output Directory

### Error Message
```
#14 [runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#14 ERROR: failed to calculate checksum: "/app/.next/standalone": not found
```

### Root Cause
1. The Dockerfile uses a multi-stage build that expects Next.js to generate a `standalone` output
2. The `next.config.ts` was missing the `output: 'standalone'` configuration
3. Without this configuration, Next.js doesn't generate the self-contained build needed for Docker

### Solution
**Fixed in commit:** `4e43745`

**Changes made:**
1. **Added standalone output to Next.js config**:
   ```typescript
   // next.config.ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: 'standalone',
   };

   export default nextConfig;
   ```

### Prevention
- **Understand Next.js deployment modes**:
  - Default mode: Requires Node.js server with all dependencies
  - Standalone mode: Self-contained build with minimal dependencies (required for Docker)
- **Always verify standalone output is generated**:
  ```bash
  npm run build
  ls -la .next/standalone  # Should exist
  ```

---

## Issue 4: 404 Error on Deployed Application

### Symptom
- Application deployed successfully
- Docker container running without errors
- Accessing the domain showed a 404 error
- Direct access to server IP:port showed Dokploy login (port conflict)

### Root Cause
1. **Domain was not configured in Dokploy UI**
2. Dokploy uses Traefik for routing, but the domain wasn't set up
3. Manual Nginx configuration was created but not integrated with Dokploy

### Solution
**Fixed by:** Configuring domain in Dokploy UI

**Steps taken:**
1. Opened Dokploy dashboard
2. Navigated to application settings
3. Added domain `kairostranscultural.ifrim.tech` in Dokploy
4. Dokploy automatically configured Traefik routing
5. Application became accessible immediately

### Prevention
- **Always configure domains in Dokploy UI** when creating applications
- **Don't rely solely on manual Nginx configuration** when using Dokploy
- **Test deployment immediately** after configuring domain
- **Architecture should be:**
  ```
  User → Nginx (SSL) → Traefik (Dokploy routing) → Application Container
  ```

---

## Lessons Learned

### 1. Local Testing is Critical
**Always run the full build process locally before deploying:**
```bash
npm run build
```
This catches:
- TypeScript errors
- Missing configuration
- Build-time environment variable issues
- Missing output directories

### 2. Understand Your Deployment Platform
**Dokploy-specific requirements:**
- Domains must be configured in the UI
- Traefik handles routing automatically
- Container port must match application configuration
- Environment variables can be set in UI (for runtime) or files (for build-time)

### 3. Environment Variables Strategy
**Build-time vs Runtime:**
- **Build-time** (NEXT_PUBLIC_*): Must be in `.env.production` and committed to repo
- **Runtime** (server-side): Can be set in Dokploy UI environment variables
- **Local development**: Use `.env.local` (gitignored)

**Recommended structure:**
```env
# .env.production (committed)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://...

# .env.local (gitignored, local only)
OPENROUTER_API_KEY=sk-or-...
```

### 4. TypeScript Configuration
**Supabase + Next.js + TypeScript challenges:**
- Type inference doesn't always work perfectly
- Server-side and client-side clients behave differently
- Use type assertions when necessary, but document why
- Run TypeScript compiler as part of CI/CD

### 5. Docker Multi-Stage Builds
**Next.js standalone mode is essential:**
- Reduces image size significantly
- Includes only necessary dependencies
- Required for production Docker deployments
- Must be configured in `next.config.ts`

---

## Pre-Deployment Checklist

Use this checklist before deploying to production:

### Code Quality
- [ ] Run `npm run build` locally - no errors
- [ ] Run `npm run lint` - no errors
- [ ] All TypeScript errors resolved
- [ ] No `console.log` statements with sensitive data
- [ ] Environment variables are properly set

### Configuration
- [ ] `next.config.ts` has `output: 'standalone'`
- [ ] `.env.production` exists with all build-time variables
- [ ] `.gitignore` doesn't exclude necessary files
- [ ] Dockerfile is correct for the target platform

### Dokploy Setup
- [ ] Application created in Dokploy
- [ ] GitHub repository connected
- [ ] Branch selected (usually `main`)
- [ ] Domain configured in Dokploy UI
- [ ] Container port matches application
- [ ] Build type set to `Dockerfile`

### Testing
- [ ] Test build locally: `npm run build`
- [ ] Verify standalone output exists: `ls .next/standalone`
- [ ] Check for TypeScript errors
- [ ] Test environment variable loading

### Post-Deployment
- [ ] Check Dokploy logs for errors
- [ ] Test domain accessibility
- [ ] Verify SSL certificate is valid
- [ ] Test key application features
- [ ] Check browser console for errors

---

## Common Commands

### Local Testing
```bash
# Build and check for errors
npm run build

# Check standalone output
ls -la .next/standalone

# Run locally
npm run dev
```

### Deployment
```bash
# Commit and push
git add .
git commit -m "feat: Description"
git push

# Dokploy will auto-deploy
```

### Troubleshooting
```bash
# Check container logs (via SSH)
docker service logs kairos-transcultural -f

# Check Nginx status
systemctl status nginx

# Test domain
curl -I https://kairostranscultural.ifrim.tech
```

---

## Quick Reference

### Environment Files
- `.env.production` - Build-time variables, committed to repo
- `.env.local` - Local development, gitignored
- `.env.example` - Template, gitignored

### Docker Build Stages
1. **Builder** - Installs dependencies, builds application
2. **Runner** - Minimal production image with only necessary files

### Key Files
- `next.config.ts` - Next.js configuration (must have `output: 'standalone'`)
- `Dockerfile` - Multi-stage build configuration
- `.gitignore` - Ensure production files aren't ignored
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions

---

## Related Documentation

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Dokploy Documentation](https://dokploy.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

**Last Updated:** January 7, 2026  
**Document Version:** 1.0  
**Deployment Environment:** Dokploy on Hetzner (88.198.218.71)
