# Deployment Guide

**Document:** `docs/09-deployment.md`  
**Project:** Nogoolin — Premium Religious Product Catalog Platform  
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Tengis (Solo Developer)  
**Last Updated:** June 2026  
**Depends On:** [`docs/06-api-spec.yaml`](./06-api-spec.yaml), [`docs/08-security.md`](./08-security.md)

---

## Changelog

| Version | Date | Type | Description |
|---|---|---|---|
| 1.0.0 | June 2026 | MAJOR | Initial version. Covers full production deployment across Supabase, Railway, Vercel, and Cloudflare, including CI/CD pipelines, first admin bootstrap, and pre-launch runbook. |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Infrastructure Architecture](#2-infrastructure-architecture)
3. [Prerequisites](#3-prerequisites)
4. [Supabase Setup](#4-supabase-setup)
5. [Railway Setup (API)](#5-railway-setup-api)
6. [Vercel Setup (Web)](#6-vercel-setup-web)
7. [Cloudflare DNS Setup](#7-cloudflare-dns-setup)
8. [CI/CD Pipelines (GitHub Actions)](#8-cicd-pipelines-github-actions)
9. [First Admin Bootstrap](#9-first-admin-bootstrap)
10. [Flutter Build & Distribution](#10-flutter-build--distribution)
11. [Pre-Launch Runbook](#11-pre-launch-runbook)
12. [Post-Launch Monitoring](#12-post-launch-monitoring)

---

## 1. Overview

### 1.1 Purpose

This document is the step-by-step operational reference for deploying
Nogoolin to production. It covers every service in the infrastructure stack,
in the order they must be set up (dependencies flow top-down):

```
1. GitHub (repository + secrets)
    ↓
2. Supabase (database + auth + storage) — all other services depend on this
    ↓
3. Railway (API container) — depends on Supabase credentials
    ↓
4. Vercel (web app) — depends on Railway API URL + Supabase anon key
    ↓
5. Cloudflare (DNS + WAF) — points domains at Vercel and Railway
    ↓
6. GitHub Actions (CI/CD) — deploys to Railway + Vercel automatically
```

### 1.2 Environment Strategy

| Environment | Web | API | Database | Purpose |
|---|---|---|---|---|
| `local` | `localhost:3000` | `localhost:3001` | Local Supabase CLI | Daily development |
| `production` | `nogoolin.mn` | `api.nogoolin.mn` | Supabase cloud (Singapore) | Live platform |

There is **no separate staging environment** for MVP — this is an accepted
solo-developer constraint. The CI/CD pipeline deploys directly to production
on merge to `main`. Feature branches are validated locally before merging.

### 1.3 Monorepo Structure (Reference)

```
nogoolin/
├── apps/
│   ├── web/          → Next.js (deployed to Vercel)
│   ├── api/           → Express.js (deployed to Railway via Docker)
│   └── mobile/       → Flutter (built via GitHub Actions → APK/IPA)
├── packages/
│   ├── shared-types/
│   └── validation-schemas/
├── supabase/
│   ├── migrations/   → versioned SQL migration files
│   └── seed.sql      → initial seed data (delivery_enabled=false, etc.)
├── .github/
│   └── workflows/
│       ├── web-deploy.yml
│       ├── api-deploy.yml
│       └── flutter-build.yml
├── docker-compose.yml  → local development only
└── .env.example
```

---

## 2. Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Users (Mongolian customers, admin)                               │
└───┬───────────────────────────────┬───────────────────────────────┘
    │ Browser / Flutter app          │ Admin browser
    ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Cloudflare (DNS + CDN + WAF + DDoS + SSL termination)            │
│  nogoolin.mn → Vercel                                             │
│  api.nogoolin.mn → Railway                                        │
└───┬───────────────────────────────┬───────────────────────────────┘
    │                                │
    ▼                                ▼
┌──────────────────┐      ┌──────────────────────────────────────┐
│  Vercel           │      │  Railway                              │
│  Next.js web app  │      │  Express.js API (Docker container)   │
│  + admin panel    │◀────▶│  Port 3001                           │
│  (nogoolin.mn)    │      │  (api.nogoolin.mn)                   │
└──────────────────┘      └──────────────┬───────────────────────┘
                                          │
                                          ▼
                           ┌──────────────────────────────────────┐
                           │  Supabase (Singapore region)          │
                           │  ├── PostgreSQL (RLS enabled)         │
                           │  ├── Auth (JWT, Google/FB OAuth)      │
                           │  └── Storage                          │
                           │      ├── product-images bucket        │
                           │      └── model-assets bucket          │
                           └──────────────────────────────────────┘
```

### 2.1 Service Responsibilities

| Service | Hosts | Cost tier (MVP) |
|---|---|---|
| GitHub | Source code, CI/CD secrets, GitHub Actions | Free |
| Supabase | PostgreSQL DB, Auth, Storage, RLS | Free tier (Singapore) |
| Railway | Express.js API Docker container | Starter ($5/mo or usage-based) |
| Vercel | Next.js web + admin panel, Edge functions | Free tier (Hobby) |
| Cloudflare | DNS, CDN, WAF, DDoS, SSL | Free tier |
| Apple Developer | iOS distribution (TestFlight / App Store) | $99/yr (Phase 6, not MVP blocker) |
| Google Play | Android distribution | $25 one-time (Phase 6, not MVP blocker) |

---

## 3. Prerequisites

Before starting deployment, ensure the following accounts and tools are
ready:

### 3.1 Accounts Required

- [ ] **GitHub** account — repository owner (Tengis)
- [ ] **Supabase** account — `app.supabase.com`
- [ ] **Railway** account — `railway.app`
- [ ] **Vercel** account — `vercel.com`
- [ ] **Cloudflare** account — domain `nogoolin.mn` managed here
- [ ] **Google Cloud Console** — OAuth 2.0 credentials for Google Sign-In
- [ ] **Facebook Developers** — App ID for Facebook OAuth (S-priority)
- [ ] **Meshy AI** — account for 3D model generation (admin workflow)

### 3.2 Local Tools Required

```bash
# Node.js 20+ (LTS)
node --version   # v20.x.x

# pnpm (monorepo package manager)
npm install -g pnpm
pnpm --version   # 9.x.x

# Docker Desktop (for local API development)
docker --version

# Supabase CLI (for running migrations)
brew install supabase/tap/supabase   # macOS
supabase --version

# Flutter SDK (for mobile)
flutter --version   # 3.x.x

# Railway CLI (optional, for manual deploys)
npm install -g @railway/cli
```

### 3.3 Domain Setup

Domain `nogoolin.mn` must be registered and nameservers pointed to
Cloudflare **before** proceeding with §7 (Cloudflare DNS Setup).

---

## 4. Supabase Setup

**Ref:** NFR-MAIN-007 (versioned migrations), NFR-SEC-008 (RLS enabled),
`04-er-diagram.md`, `08-security.md` §6

This is the **first service to set up** — Railway, Vercel, and CI/CD all
depend on Supabase credentials.

### 4.1 Create Supabase Project

1. Go to `app.supabase.com` → New Project
2. Settings:
   - **Name:** `nogoolin-production`
   - **Database password:** generate a strong password, save to password
     manager (this is not the same as `SUPABASE_SERVICE_ROLE_KEY`)
   - **Region:** `Southeast Asia (Singapore)` — closest to Mongolia
   - **Plan:** Free tier (sufficient for MVP)
3. Wait for project to provision (~2 minutes)
4. Navigate to **Project Settings → API** and copy:

```bash
# Save these immediately — used in all subsequent steps
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...          # safe to expose to clients
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # NEVER expose — bypasses RLS
```

### 4.2 Initialize Supabase CLI (Local)

```bash
# In the monorepo root
supabase init           # creates supabase/ directory (already in repo)
supabase login          # authenticate CLI with your account

# Link CLI to the production project
supabase link --project-ref xxxxxxxxxxxx  # project ref from dashboard URL
```

### 4.3 Run Database Migrations

Migrations live in `supabase/migrations/` and are numbered sequentially.
The initial migration (`0001_init.sql`) creates all 11 tables with RLS
enabled and all policies from `08-security.md` §6:

```bash
# Push all migrations to the production database
supabase db push

# Verify — should show all migrations as applied
supabase migration list
```

**Migration file naming convention:**

```
supabase/migrations/
├── 0001_init.sql              # all tables, enums, indexes, RLS policies
├── 0002_is_admin_function.sql # is_admin() SECURITY DEFINER function (§6.3)
└── 0003_seed_settings.sql     # system_settings seed row
```

> **Rule (NFR-MAIN-007):** never modify an already-applied migration file.
> All schema changes go in a new numbered migration. This keeps the migration
> history append-only and reproducible.

### 4.4 Seed Data

`supabase/seed.sql` is run once after migrations to insert the initial
`system_settings` row:

```sql
-- supabase/seed.sql
INSERT INTO public.system_settings (key, value, updated_at)
VALUES ('delivery_enabled', 'false'::jsonb, now())
ON CONFLICT (key) DO NOTHING;
```

```bash
# Apply seed to production
supabase db reset --linked   # ⚠️ only on a fresh project — wipes all data first
# OR for an already-populated DB, run seed manually:
supabase db execute --file supabase/seed.sql
```

### 4.5 Verify RLS is Enabled

Run this query in the Supabase SQL editor to confirm all tables have
`rowsecurity = true` (§13.3 of `08-security.md`):

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Expected output — all 11 tables must show `true`:

```
tablename               | rowsecurity
------------------------+-------------
audit_logs              | true
categories              | true
delivery_assignments    | true
inquiries               | true
media_assets            | true
order_items             | true
orders                  | true
product_images          | true
products                | true
system_settings         | true
users                   | true
```

### 4.6 Configure Supabase Auth

#### 4.6.1 General Auth Settings

Navigate to **Authentication → Settings**:

| Setting | Value |
|---|---|
| Site URL | `https://nogoolin.mn` |
| Redirect URLs (allowlist) | `https://nogoolin.mn/auth/callback`, `https://nogoolin.mn/admin/auth/callback` |
| JWT Expiry | `900` (15 minutes — NFR-SEC-013) |
| Refresh Token Rotation | **Enabled** (FR-AUTH-006) |
| Refresh Token Reuse Detection | **Enabled** |
| Email confirmations | Disabled for MVP (no SMTP configured) |

#### 4.6.2 Google OAuth (FR-AUTH-002, M-priority)

1. Go to [Google Cloud Console](https://console.cloud.google.com) →
   APIs & Services → Credentials → Create OAuth 2.0 Client ID
2. Application type: **Web application**
3. Authorized redirect URIs:
   ```
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
4. Copy **Client ID** and **Client Secret**
5. In Supabase → Authentication → Providers → Google:
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

#### 4.6.3 Facebook OAuth (FR-AUTH-003, S-priority)

1. Go to [Facebook Developers](https://developers.facebook.com) →
   Create App → Consumer type
2. Add **Facebook Login** product
3. Valid OAuth Redirect URIs:
   ```
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
4. In Supabase → Authentication → Providers → Facebook:
   - Enable Facebook provider
   - Paste App ID and App Secret

### 4.7 Create Storage Buckets

Navigate to **Storage → New bucket** and create the following:

#### Bucket: `product-images`

| Setting | Value |
|---|---|
| Name | `product-images` |
| Public | Yes (images served publicly via CDN URL) |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |
| Max file size | `5242880` (5MB — FR-MEDIA-002) |

#### Bucket: `model-assets`

| Setting | Value |
|---|---|
| Name | `model-assets` |
| Public | Yes (GLB files served publicly for Three.js/model_viewer_plus) |
| Allowed MIME types | `model/gltf-binary`, `application/octet-stream` |
| Max file size | `10485760` (10MB — FR-MEDIA-008) |

#### Storage RLS Policies

Storage buckets need their own RLS policies (separate from table RLS).
Run in the SQL editor:

```sql
-- product-images: public read, admin write only
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

-- model-assets: public read, admin write only
CREATE POLICY "model_assets_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'model-assets');

CREATE POLICY "model_assets_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'model-assets' AND public.is_admin());

CREATE POLICY "model_assets_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'model-assets' AND public.is_admin());
```

### 4.8 Database Trigger: `on_auth_user_created`

This trigger auto-creates a `public.users` row whenever a new Supabase
Auth user signs up via OAuth (UC-SYS-001, SEQ-001):

```sql
-- supabase/migrations/0001_init.sql (excerpt)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'customer',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

> This trigger runs as `SECURITY DEFINER` (bypasses RLS) because it writes
> to `public.users` during sign-up, before the user has a valid session.
> Per `08-security.md` §6.2, this is one of the two legitimate uses of
> RLS bypass (the other being `service_role` audit log writes).

### 4.9 Supabase Setup Checklist

- [ ] Project created in Singapore region
- [ ] `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` saved
- [ ] All migrations applied (`supabase migration list` shows all green)
- [ ] Seed data applied (`system_settings` row exists with `delivery_enabled = false`)
- [ ] RLS enabled on all 11 tables (§4.5 query confirms all `true`)
- [ ] `is_admin()` function deployed
- [ ] `on_auth_user_created` trigger deployed
- [ ] Auth settings configured (Site URL, redirect URLs, JWT expiry, rotation)
- [ ] Google OAuth configured and tested
- [ ] `product-images` bucket created with MIME allowlist + RLS policies
- [ ] `model-assets` bucket created with MIME allowlist + RLS policies

---

## 5. Railway Setup (API)

**Ref:** NFR-MAIN-006 (Docker multi-stage build), NFR-SEC-005 (secrets as
env vars), master plan §7.4 (Express.js + TypeScript on Railway)

### 5.1 Create Railway Project

1. Go to `railway.app` → New Project → **Deploy from GitHub repo**
2. Select the `nogoolin` monorepo
3. Railway will auto-detect the `Dockerfile` in `apps/api/`
4. **Before** the first deploy, set all environment variables (§5.3) —
   the container will fail to start without them

### 5.2 Dockerfile (Multi-Stage Build)

```dockerfile
# apps/api/Dockerfile

# ── Stage 1: Build ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root package files for monorepo resolution
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies (production + dev for build)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build the API
RUN pnpm --filter @nogoolin/api build

# ── Stage 2: Production ───────────────────────────────────────────
FROM node:20-alpine AS production

# NFR-MAIN-006: run as non-root user
RUN addgroup -S nogoolin && adduser -S nogoolin -G nogoolin

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

USER nogoolin

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
```

> **Why multi-stage?** The builder stage includes TypeScript compiler,
> dev dependencies, and source files. The production stage contains only
> compiled JS + production dependencies — resulting image is ~150MB vs
> ~600MB for a single-stage build, and attack surface is reduced
> (no compiler, no dev tools in production).

### 5.3 Environment Variables

Set these in Railway → Project → Variables **before** the first deploy.
All values come from the services configured in §4 (Supabase) and §7
(Cloudflare domain, once known):

```bash
# ── Server ────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3001

# ── Supabase ──────────────────────────────────────────────────────
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # ⚠️ server-only, never expose

# ── CORS ──────────────────────────────────────────────────────────
# Comma-separated list of allowed origins (08-security.md §4.2)
ALLOWED_ORIGINS=https://nogoolin.mn,https://www.nogoolin.mn

# ── Rate limiting ─────────────────────────────────────────────────
# Inherited by express-rate-limit config; override here if needed
RATE_LIMIT_GENERAL_MAX=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_INQUIRY_MAX=3
```

> **`.env.example` (NFR-MAIN-008)** — the monorepo root `.env.example`
> mirrors this list with empty values. It is kept in sync with every new
> variable added — this is a required step (Definition of Done) for any
> PR that introduces new config.

### 5.4 Railway Service Configuration

In Railway → Service → Settings:

| Setting | Value |
|---|---|
| **Root Directory** | `apps/api` |
| **Build Command** | *(auto-detected from Dockerfile)* |
| **Start Command** | *(from `CMD` in Dockerfile)* |
| **Health Check Path** | `GET /api/v1/health` |
| **Health Check Timeout** | 30s |
| **Restart Policy** | On failure (max 3 restarts) |
| **Private Networking** | Disabled (Vercel calls Railway over public HTTPS) |

### 5.5 Health Check Endpoint

Add a lightweight health check route to the API — Railway uses this to
confirm the container started successfully:

```typescript
// apps/api/src/routes/health.route.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
  });
});

export default router;

// apps/api/src/app.ts
app.use('/api/v1/health', healthRouter);
```

This endpoint has **no auth**, no rate limiting, and returns no sensitive
data — it exists only to confirm the process is alive.

### 5.6 Custom Domain (api.nogoolin.mn)

1. Railway → Service → Settings → Domains → **Add Custom Domain**
2. Enter `api.nogoolin.mn`
3. Railway will display a `CNAME` record to add in Cloudflare (§7.2)
4. After Cloudflare is configured, Railway will auto-provision TLS
   via Let's Encrypt

> **Important:** set Cloudflare proxy mode to **DNS only (grey cloud)**
> for `api.nogoolin.mn` during initial setup to let Railway provision TLS.
> Once TLS is verified, switch to **Proxied (orange cloud)** to enable
> WAF + DDoS protection (§7.3).

### 5.7 Docker Compose (Local Development)

For local development, the API runs via Docker Compose alongside a local
Supabase instance started with `supabase start`:

```yaml
# docker-compose.yml (monorepo root)
version: '3.9'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: builder   # use builder stage locally (includes hot-reload)
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      PORT: 3001
      SUPABASE_URL: http://localhost:54321   # local Supabase CLI
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
      ALLOWED_ORIGINS: http://localhost:3000
    volumes:
      - ./apps/api/src:/app/apps/api/src   # hot-reload
      - ./packages:/app/packages
    command: pnpm --filter @nogoolin/api dev
    depends_on:
      - supabase-db

  # Supabase local stack is started separately via `supabase start`
  # docker-compose.yml only needs the API service for local dev
```

```bash
# Local development workflow
supabase start                    # starts local Supabase (DB + Auth + Storage)
docker-compose up api             # starts API with hot-reload
# OR without Docker:
pnpm --filter @nogoolin/api dev   # runs tsx watch directly
```

### 5.8 Railway Setup Checklist

- [ ] Railway project created, linked to GitHub monorepo
- [ ] Root directory set to `apps/api`
- [ ] All environment variables set (§5.3) — verify no variable is missing
      by checking app startup logs for `undefined` errors
- [ ] `GET /api/v1/health` returns `200 OK` after first deploy
- [ ] Custom domain `api.nogoolin.mn` configured (CNAME added in Cloudflare)
- [ ] TLS certificate provisioned by Railway (green lock in browser)
- [ ] Cloudflare proxy switched to orange cloud after TLS verified (§5.6)
- [ ] Container runs as non-root user (`USER nogoolin` in Dockerfile)

---

## 6. Vercel Setup (Web)

**Ref:** NFR-REL-001, NFR-SEO-007 (SSR/SSG), master plan §7.1 (Next.js)

### 6.1 Create Vercel Project

1. Go to `vercel.com` → Add New Project → **Import Git Repository**
2. Select the `nogoolin` monorepo
3. Configure project settings:

| Setting | Value |
|---|---|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `apps/web` |
| **Build Command** | `cd ../.. && pnpm --filter @nogoolin/web build` |
| **Output Directory** | `.next` *(default)* |
| **Install Command** | `pnpm install --frozen-lockfile` |
| **Node.js Version** | 20.x |

> **Monorepo note:** Vercel needs the build command to run from the
> repository root so `pnpm` can resolve workspace packages
> (`@nogoolin/shared-types`, `@nogoolin/validation-schemas`). The
> `cd ../..` ensures pnpm's workspace resolution works correctly when
> Vercel's root directory is set to `apps/web`.

### 6.2 Environment Variables

Set in Vercel → Project → Settings → Environment Variables.
**Critical:** only variables prefixed `NEXT_PUBLIC_` are exposed to the
browser — `SUPABASE_SERVICE_ROLE_KEY` must **never** appear here
(`08-security.md` §11.2).

```bash
# ── Public (exposed to browser bundle) ────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://api.nogoolin.mn/api/v1
NEXT_PUBLIC_SITE_URL=https://nogoolin.mn

# ── Server-only (Next.js Server Components / Route Handlers) ──────
# Used for SSR data fetching that doesn't need to touch RLS-bypassing keys —
# the anon key is sufficient here since SSR requests still respect RLS
# when forwarding the user's session.
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

Apply these to **Production** environment. For **Preview** deployments
(automatic for PRs), point `NEXT_PUBLIC_API_URL` at a separate Railway
preview environment if budget allows, or reuse production read-only
endpoints — since there's no staging environment (§1.2), preview builds
hitting production read endpoints (`GET /products`, `GET /categories`) is
low-risk.

### 6.3 Build Verification (SSR/SSG, NFR-SEO-007)

After first deploy, verify rendering mode for key routes:

| Route | Expected rendering | How to verify |
|---|---|---|
| `/` (3D opening + home) | SSG (static) | `next build` output shows `○ (Static)` |
| `/products` | SSG with revalidation (ISR) | `● (SSG)` with revalidate time |
| `/products/[slug]` | SSG with `generateStaticParams` + ISR | `● (SSG)` per product |
| `/categories/[slug]` | SSG with ISR | `● (SSG)` |
| `/admin/*` | SSR (dynamic, auth-gated) | `λ (Server)` |

```bash
# Run locally to inspect the build output table
pnpm --filter @nogoolin/web build
```

### 6.4 Custom Domain (nogoolin.mn)

1. Vercel → Project → Settings → Domains → **Add**
2. Enter `nogoolin.mn` and `www.nogoolin.mn`
3. Vercel displays required DNS records (`A` record or `CNAME`)
4. Add these in Cloudflare (§7.2) — same grey-cloud-first approach as
   Railway (§5.6) to allow Vercel's TLS provisioning

### 6.5 robots.txt and sitemap.xml (NFR-SEO-005, NFR-SEO-006)

```typescript
// apps/web/src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://nogoolin.mn/sitemap.xml',
  };
}

// apps/web/src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=50`)
    .then(r => r.json());
  const categories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
    .then(r => r.json());

  return [
    { url: 'https://nogoolin.mn', lastModified: new Date() },
    ...products.data.map((p: any) => ({
      url: `https://nogoolin.mn/products/${p.slug}`,
      lastModified: p.updated_at,
    })),
    ...categories.data.map((c: any) => ({
      url: `https://nogoolin.mn/categories/${c.slug}`,
      lastModified: c.updated_at,
    })),
  ];
}
```

These are auto-served at `/robots.txt` and `/sitemap.xml` by Next.js App
Router — no manual file creation needed.

### 6.6 Vercel Setup Checklist

- [ ] Project imported, root directory set to `apps/web`
- [ ] Build command resolves monorepo workspace packages correctly
- [ ] All `NEXT_PUBLIC_*` env vars set; `SUPABASE_SERVICE_ROLE_KEY` confirmed
      **absent**
- [ ] First deploy succeeds; build output shows expected SSG/SSR mix (§6.3)
- [ ] Custom domain `nogoolin.mn` + `www.nogoolin.mn` added
- [ ] `/robots.txt` disallows `/admin/`
- [ ] `/sitemap.xml` includes all published products and categories

---

## 7. Cloudflare DNS Setup

**Ref:** `08-security.md` §3 (Layer 1 — Cloudflare WAF)

### 7.1 Add Site to Cloudflare

1. Cloudflare Dashboard → Add a Site → enter `nogoolin.mn`
2. Select **Free** plan
3. Cloudflare scans existing DNS records (if any) — review and continue
4. Update nameservers at the domain registrar to Cloudflare's assigned
   nameservers (this step happens outside Cloudflare, at wherever
   `nogoolin.mn` was registered)
5. Wait for nameserver propagation (can take up to 24h, often faster)

### 7.2 DNS Records

| Type | Name | Target | Proxy status (initial) | Proxy status (final) |
|---|---|---|---|---|
| `A` or `CNAME` | `nogoolin.mn` | Vercel-provided value | DNS only (grey) | **Proxied (orange)** |
| `CNAME` | `www` | `cname.vercel-dns.com` | DNS only (grey) | **Proxied (orange)** |
| `CNAME` | `api` | Railway-provided value | DNS only (grey) | **Proxied (orange)** |

> **Two-phase rollout:** start with **DNS only (grey cloud)** so Vercel and
> Railway can issue Let's Encrypt TLS certificates against the real
> origin. Once both show valid HTTPS (green padlock when visiting directly),
> switch to **Proxied (orange cloud)** — this activates Cloudflare's
> WAF, CDN, and DDoS protection (Layer 1, `08-security.md` §3).

### 7.3 SSL/TLS Configuration

Navigate to **SSL/TLS** tab:

| Setting | Value | Why |
|---|---|---|
| SSL/TLS encryption mode | **Full (Strict)** | Validates Vercel/Railway's TLS cert — prevents Cloudflare-to-origin MITM (NFR-SEC-001, `08-security.md` §3.2) |
| Always Use HTTPS | **On** | Redirects all `http://` to `https://` |
| Minimum TLS Version | **1.2** | NFR-SEC-001 |
| Automatic HTTPS Rewrites | **On** | Rewrites mixed-content `http://` links |

### 7.4 WAF Configuration

Navigate to **Security → WAF**:

| Setting | Value |
|---|---|
| Managed Rules → Cloudflare Managed Ruleset | **Enabled** |
| Managed Rules → Cloudflare OWASP Core Ruleset | **Enabled** |
| Bot Fight Mode | **Enabled** (Security → Bots) |

### 7.5 Cache Rules (Page Rules / Cache Rules)

Per `08-security.md` §3.2, `/api/*` and `/admin/*` must bypass Cloudflare's
edge cache (prevents stale or sensitive responses being served from cache):

Navigate to **Caching → Cache Rules → Create Rule**:

```
Rule name: "Bypass cache for API and admin"
When incoming requests match:
  (http.request.uri.path contains "/api/") or
  (http.request.uri.path contains "/admin/")
Then:
  Cache eligibility: Bypass cache
```

### 7.6 Rate Limiting Rule (Edge backstop)

Navigate to **Security → WAF → Rate limiting rules → Create rule**:

```
Rule name: "API edge rate limit backstop"
When incoming requests match:
  (http.request.uri.path contains "/api/v1/")
Then:
  Rate: 300 requests per 1 minute, per IP
  Action: Block for 60 seconds
```

> This is a **coarse backstop** above the precise Express-level limits
> (`08-security.md` §4.3 — 100/15min general, 5/15min auth, 3/hr inquiry).
> 300/min is intentionally loose; its purpose is to stop extreme abuse
> (e.g. a runaway script), not to enforce business rules.

### 7.7 Cloudflare Setup Checklist

- [ ] Site added to Cloudflare, nameservers updated at registrar
- [ ] DNS records for `nogoolin.mn`, `www`, `api` created (grey cloud
      initially)
- [ ] Vercel TLS verified → `nogoolin.mn` and `www` switched to orange cloud
- [ ] Railway TLS verified → `api.nogoolin.mn` switched to orange cloud
- [ ] SSL/TLS mode set to **Full (Strict)**
- [ ] Always Use HTTPS: On
- [ ] Minimum TLS Version: 1.2
- [ ] WAF Managed Ruleset + OWASP Core Ruleset enabled
- [ ] Bot Fight Mode enabled
- [ ] Cache bypass rule active for `/api/*` and `/admin/*`
- [ ] Edge rate limiting rule active (300/min/IP on `/api/v1/*`)

---

## 8. CI/CD Pipelines (GitHub Actions)

**Ref:** NFR-MAIN-005, master plan §6 (Git discipline — conventional commits,
`main`/`develop`/`feature/xxx` branches)

### 8.1 Branching Strategy Recap

| Branch | Purpose | Triggers |
|---|---|---|
| `main` | Production | Push → deploy to Railway + Vercel (production) |
| `develop` | Integration | Push → run tests/lint only, no deploy |
| `feature/xxx` | Feature work | PR → run tests/lint only |

> No staging environment (§1.2) — merging `develop` → `main` is the
> deploy trigger. This is an accepted solo-developer simplification;
> the safety net is local testing + the Pre-Launch Runbook (§11).

### 8.2 Required GitHub Secrets

Set in GitHub → Repository → Settings → Secrets and variables → Actions:

| Secret | Used by | Source |
|---|---|---|
| `RAILWAY_TOKEN` | `api-deploy.yml` | Railway → Account Settings → Tokens |
| `VERCEL_TOKEN` | `web-deploy.yml` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `web-deploy.yml` | Vercel project settings |
| `VERCEL_PROJECT_ID` | `web-deploy.yml` | Vercel project settings |
| `SUPABASE_ACCESS_TOKEN` | `api-deploy.yml` (migration check) | Supabase → Account → Access Tokens |
| `SUPABASE_PROJECT_REF` | `api-deploy.yml` | Supabase project URL |

### 8.3 `web-deploy.yml`

```yaml
# .github/workflows/web-deploy.yml
name: Deploy Web

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'
      - '.github/workflows/web-deploy.yml'
  pull_request:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @nogoolin/web lint
      - run: pnpm --filter @nogoolin/web type-check
      - run: pnpm --filter @nogoolin/web build

  deploy:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: apps/web
```

### 8.4 `api-deploy.yml`

```yaml
# .github/workflows/api-deploy.yml
name: Deploy API

on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'packages/**'
      - 'supabase/migrations/**'
      - '.github/workflows/api-deploy.yml'
  pull_request:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'packages/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @nogoolin/api lint
      - run: pnpm --filter @nogoolin/api type-check
      - run: pnpm --filter @nogoolin/api test
      - run: pnpm --filter @nogoolin/api build

  # NFR-MAIN-007: verify migrations apply cleanly before deploying new code
  # that may depend on schema changes
  migration-check:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - name: Push migrations to production
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}

  deploy:
    needs: migration-check
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: nogoolin-api

      - name: Health check
        run: |
          sleep 30  # wait for container to start
          curl --fail https://api.nogoolin.mn/api/v1/health || exit 1
```

> **Migration-before-deploy ordering:** migrations run **before** the new
> API container is deployed, so the new code (which may query new
> columns/tables) never runs against an old schema. If `migration-check`
> fails, `deploy` does not run — the production API keeps running the
> previous (working) version.

### 8.5 `flutter-build.yml`

```yaml
# .github/workflows/flutter-build.yml
name: Build Mobile

on:
  push:
    branches: [main]
    paths:
      - 'apps/mobile/**'
      - '.github/workflows/flutter-build.yml'
  pull_request:
    branches: [main]
    paths:
      - 'apps/mobile/**'

jobs:
  test-and-analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          channel: stable
      - working-directory: apps/mobile
        run: flutter pub get
      - working-directory: apps/mobile
        run: flutter analyze
      - working-directory: apps/mobile
        run: flutter test

  build-android:
    needs: test-and-analyze
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          channel: stable
      - working-directory: apps/mobile
        run: flutter pub get
      - working-directory: apps/mobile
        run: flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: nogoolin-android-release
          path: apps/mobile/build/app/outputs/flutter-apk/app-release.apk

  # iOS build requires macOS runner + Apple Developer signing —
  # added in Phase 6 once Apple Developer account ($99/yr) is active.
  # Placeholder job left commented for future activation:
  #
  # build-ios:
  #   needs: test-and-analyze
  #   runs-on: macos-latest
  #   steps:
  #     - uses: actions/checkout@v4
  #     - uses: subosito/flutter-action@v2
  #       with:
  #         flutter-version: '3.x'
  #     - working-directory: apps/mobile
  #       run: flutter build ipa --release
```

> **MVP scope (master plan §29):** Android internal testing build is
> required; iOS TestFlight is **optional** and not a launch blocker. The
> `build-android` job produces a downloadable APK artifact on every `main`
> push — sufficient for internal testing (FR-MOB-001, NFR-COM-003).

### 8.6 CI/CD Pipeline Summary

| Workflow | Triggers on | Deploys to | Gated by |
|---|---|---|---|
| `web-deploy.yml` | Push to `main` (web/packages changes) | Vercel production | lint + type-check + build pass |
| `api-deploy.yml` | Push to `main` (api/packages/migrations changes) | Railway production | lint + type-check + tests + build + migration-check pass |
| `flutter-build.yml` | Push to `main` (mobile changes) | GitHub Actions artifact (APK) | analyze + test pass |

### 8.7 CI/CD Setup Checklist

- [ ] All 6 GitHub secrets configured (§8.2)
- [ ] `web-deploy.yml` — test PR triggers lint/build without deploying
- [ ] `web-deploy.yml` — push to `main` deploys to Vercel production
- [ ] `api-deploy.yml` — test PR triggers lint/test/build without deploying
- [ ] `api-deploy.yml` — push to `main` runs migration-check before deploy
- [ ] `api-deploy.yml` — health check step passes after deploy
- [ ] `flutter-build.yml` — Android APK artifact produced on push to `main`

---

## 9. First Admin Bootstrap

**Ref:** `08-security.md` §5.3 — "there is no API endpoint that lets a user
set their own `role` to `admin`"

This is the **one manual, non-automatable step** in the entire deployment
process. It must be done once, after Supabase Auth is configured (§4.6) but
before the admin panel is used for the first time.

### 9.1 Procedure

**Step 1 — Create the account through the normal sign-up flow:**

Tengis signs up via the public web app (`https://nogoolin.mn`) using either:
- Email + password (FR-AUTH-001), or
- Google OAuth (FR-AUTH-002)

This creates a row in `auth.users` and, via the `on_auth_user_created`
trigger (§4.8), a corresponding row in `public.users` with
`role = 'customer'` (the default for all new accounts).

**Step 2 — Promote the account to `admin` via direct SQL:**

In the Supabase dashboard → SQL Editor, run:

```sql
-- Replace with the email used in Step 1
UPDATE public.users
SET role = 'admin', updated_at = now()
WHERE email = 'tengis@example.com';

-- Verify
SELECT id, email, role FROM public.users WHERE email = 'tengis@example.com';
```

> This is a **direct database write using the Supabase dashboard's SQL
> editor**, which runs with elevated (postgres superuser) privileges —
> it bypasses RLS entirely, which is expected and is the **only** way
> `role = 'admin'` is ever set (§5.3 of `08-security.md`).

**Step 3 — Verify admin access:**

1. Sign in at `https://nogoolin.mn/admin/sign-in` using the same account
2. Confirm redirect to `/admin/dashboard` succeeds (UC-ADM-001)
3. Confirm `GET /api/v1/admin/products` (or any admin endpoint) returns
   `200`, not `403`

**Step 4 — Confirm the audit trail going forward:**

From this point on, **every** admin action (product CRUD, delivery toggle,
etc.) writes to `audit_logs` (FR-AUD-001). The Step 2 SQL UPDATE itself is
**not** logged in `audit_logs` — it precedes the existence of an "admin
session" — but it is visible in Supabase's own database activity logs
(Project → Logs → Postgres Logs) for the rare case of needing to audit
*when* the first admin was created.

### 9.2 Adding Additional Admins (Post-Bootstrap)

Once the first admin exists, **all subsequent role changes go through the
application** (FR-USER-004):

```
Existing admin signs in
  → /admin/users
  → selects a customer account
  → changes role to 'admin'
  → PATCH /api/v1/admin/users/{id} { role: 'admin' }
  → requireAdmin() middleware verifies caller is already admin
  → audit_logs entry: USER_ROLE_CHANGE
```

Direct SQL promotion (§9.1) is **only** for the very first admin account,
when no admin exists yet to use the application flow.

### 9.3 First Admin Bootstrap Checklist

- [ ] Tengis's account created via normal sign-up (email or Google)
- [ ] `public.users.role` updated to `'admin'` via Supabase SQL Editor
- [ ] Sign-in to `/admin/sign-in` redirects to `/admin/dashboard`
- [ ] At least one admin-only `GET` endpoint returns `200`
- [ ] Step 2 SQL command and timestamp recorded somewhere outside the
      database (e.g. a private note) for personal audit trail

---

## 10. Flutter Build & Distribution

**Ref:** FR-MOB-001, NFR-COM-003/004, master plan §29 (Phase 6 — "App Store
/ Play Store public submission should not be a launch blocker")

### 10.1 MVP Distribution (Internal Testing)

For MVP, the Android APK produced by `flutter-build.yml` (§8.5) is
distributed **manually**:

1. Download the `nogoolin-android-release` artifact from the GitHub
   Actions run
2. Share the `.apk` file directly (e.g. Google Drive link) with internal
   testers
3. Testers enable "Install from unknown sources" to install

This satisfies the MVP success metric "Mobile app passes internal testing
on both platforms" (`01-vision.md` §8) for Android. iOS internal testing
(TestFlight) requires an active Apple Developer account.

### 10.2 Phase 6: Public Store Submission (Not an MVP Blocker)

When ready for public distribution:

**Android (Google Play, $25 one-time):**
1. Create a Google Play Console account
2. Generate a signed release build with a proper keystore (not the debug
   keystore used in `flutter-build.yml`)
3. Upload to Play Console → Internal Testing track → promote to Production

**iOS (Apple App Store, $99/year):**
1. Enroll in the Apple Developer Program
2. Configure signing certificates + provisioning profiles
3. Uncomment and configure the `build-ios` job in `flutter-build.yml`
   (§8.5) — requires `macos-latest` runner and App Store Connect API key
   as a GitHub secret
4. Submit via TestFlight first, then App Store review

### 10.3 Environment Configuration for Mobile

```dart
// apps/mobile/lib/config/env.dart
class Env {
  static const supabaseUrl = 'https://xxxxxxxxxxxx.supabase.co';
  static const supabaseAnonKey = 'eyJ...'; // anon key only — same as web
  static const apiBaseUrl = 'https://api.nogoolin.mn/api/v1';
}
```

> The Flutter app uses the **same `SUPABASE_ANON_KEY`** as the web app
> (§6.2) — this key is designed to be public and is subject to RLS on every
> request, same as the browser client (`08-security.md` §6.2).

---

## 11. Pre-Launch Runbook

**Ref:** Combines `08-security.md` §13 (Security Checklist) with
deployment-specific verification. Run through **in order** before the first
production launch.

### 11.1 Infrastructure Verification

- [ ] Supabase: all checklist items from §4.9 complete
- [ ] Railway: all checklist items from §5.8 complete
- [ ] Vercel: all checklist items from §6.6 complete
- [ ] Cloudflare: all checklist items from §7.7 complete
- [ ] CI/CD: all checklist items from §8.7 complete
- [ ] First admin bootstrapped (§9.3)

### 11.2 End-to-End Smoke Tests

Run these manually against production **before** announcing the site is live:

| Test | Expected result | Ref |
|---|---|---|
| Visit `https://nogoolin.mn` | 3D opening plays (or fallback), "Get Started" appears | FR-3D-001 to 007 |
| Visit `https://nogoolin.mn/products` | Product grid loads (or empty state if no products yet) | UC-G-002 |
| Visit a product detail page | Images, price, description render; 360° viewer if `model_3d_url` set | UC-G-004, UC-G-005 |
| Submit inquiry form | Success message; row appears in `inquiries` table | UC-G-007 |
| Submit inquiry form 4th time within an hour (same IP) | `429 Too many submissions` | FR-INQ-007 |
| Sign in to `/admin/sign-in` as bootstrapped admin | Redirects to `/admin/dashboard` | UC-ADM-001 |
| Create a product as admin → Publish | Product visible on `/products` | UC-ADM-002, UC-ADM-004 |
| Toggle delivery ON then OFF in `/admin/settings` | `audit_logs` shows two `DELIVERY_TOGGLE` entries | UC-ADM-011, FR-AUD-005 |
| `POST /api/v1/orders` while `delivery_enabled = false` | `403 DELIVERY_DISABLED` | FR-SET-004, UC-SYS-002 |
| Sign out, attempt `GET /api/v1/admin/products` with no token | `401 UNAUTHORIZED` | NFR-SEC-009 |
| Sign in as a `customer`-role account, attempt `GET /api/v1/admin/products` | `403 FORBIDDEN`, `audit_logs` records `UNAUTHORIZED_ACCESS` | FR-AUTH-009, UC-ADM-011 Exception Flow |

### 11.3 Performance Spot-Checks (NFR-PERF)

- [ ] `https://nogoolin.mn/products` Lighthouse Performance score ≥ 80
      (NFR-PERF-001) on a throttled "Mobile" simulation
- [ ] Product detail page Lighthouse score ≥ 85 (NFR-PERF-003)
- [ ] Product detail page Lighthouse **SEO** score ≥ 90 (`01-vision.md` §8)
- [ ] 3D intro "Skip Intro" button visible within 1 second (FR-3D-005)
- [ ] 3D GLB model ≤ 5MB (NFR-PERF-005) — check Network tab

### 11.4 DNS / SSL Final Verification

- [ ] `https://nogoolin.mn` — valid certificate, padlock shown
- [ ] `https://api.nogoolin.mn/api/v1/health` — valid certificate, returns
      `200`
- [ ] `http://nogoolin.mn` redirects to `https://`
- [ ] `https://nogoolin.mn/admin` — `robots.txt` confirms `Disallow: /admin/`

### 11.5 Go-Live

- [ ] All sections 11.1–11.4 checked
- [ ] Announce / share link with first real users
- [ ] Monitor Railway + Vercel logs for the first hour post-launch (§12)

---

## 12. Post-Launch Monitoring

**Ref:** NFR-REL-001, NFR-REL-002 (≥99% uptime targets)

### 12.1 Monitoring Surface (Solo Developer — No SIEM)

Per `08-security.md` §12.1, monitoring relies on the dashboards already
provided by each platform — no additional tooling is introduced for MVP:

| Signal | Where to look | Frequency |
|---|---|---|
| API uptime / errors | Railway → Deployments → Logs | Daily (first week), then weekly |
| Web uptime / build failures | Vercel → Deployments | On every deploy (automatic notification) |
| Database health, slow queries | Supabase → Database → Query Performance | Weekly |
| Storage usage (approaching free tier limits) | Supabase → Storage → Usage | Monthly |
| Security events | `audit_logs` table, filter `action = 'UNAUTHORIZED_ACCESS'` | Weekly |
| WAF/bot activity | Cloudflare → Security → Events | Weekly |
| Rate limit hits | Railway logs, grep for `RATE_LIMIT_EXCEEDED` | As needed if abuse suspected |

### 12.2 Weekly Review Integration

Per `01-vision.md` §6 (Personal Kanban — "Every Sunday, do a 30-minute
review"), add a recurring checklist item:

```
Sunday Weekly Review — Operations Addendum:
[ ] Check Railway API logs for unhandled errors
[ ] Check Supabase storage usage (% of free tier)
[ ] Check audit_logs for UNAUTHORIZED_ACCESS spikes
[ ] Check Cloudflare Security Events for new attack patterns
```

### 12.3 Incident Response (Lightweight)

For a solo-developer MVP, "incident response" means:

1. **API down (Railway):** Railway dashboard shows crash logs → redeploy
   previous working commit via Railway's deployment history (one-click
   rollback) → investigate root cause locally
2. **Web down (Vercel):** Vercel → Deployments → "Promote to Production"
   on the last known-good deployment
3. **Database issue:** Supabase status page (`status.supabase.com`) first
   — if Supabase-side, wait; if query-related, check Query Performance tab
4. **Security incident (e.g. secret leaked):** rotate the affected secret
   immediately in its source dashboard (Supabase / Railway / Vercel),
   redeploy with new value (`08-security.md` §11.2 rule 5)

### 12.4 Scaling Triggers (Future Reference)

These are **not MVP concerns** but are documented so future-Tengis knows
when to revisit `08-security.md` §4.3 (in-memory rate limiting) and
NFR-SCA-001 (horizontal scaling):

| Signal | Action |
|---|---|
| Railway single instance CPU/memory consistently >70% | Consider Railway vertical scaling (more resources per instance) before horizontal |
| Need for >1 API instance | Move rate-limit state from in-memory to Redis (`08-security.md` §4.3 note) |
| Supabase free tier storage/bandwidth approaching limits | Upgrade to Supabase Pro |
| `delivery_enabled = true` activation imminent | Re-run `08-security.md` §13.6 checklist |

---

*Previous document: [`docs/08-security.md`](./08-security.md)*  
*This is the final Phase 0 document. Phase 1 (Foundation) begins with
monorepo scaffolding per `01-vision.md` §6 roadmap.*
