# Development Roadmap

**Document:** `docs/10-roadmap.md`
**Project:** Nogoolin — Premium Religious Product Catalog Platform
**Version:** 1.0.0
**Status:** Active
**Author:** Tengis (Solo Developer)
**Last Updated:** 2026-07-14

---

## Changelog

| Version | Date | Type | Description |
|---|---|---|---|
| 1.0.0 | 2026-07-14 | MAJOR | Initial version. Consolidates roadmap from master plan and Phase 0 outcomes; reflects finalized stack (Fastify, React Native + Expo) |

---

## Table of Contents

1. [Overall Timeline](#1-overall-timeline)
2. [Phase 0 — Documentation & Planning ✅](#2-phase-0--documentation--planning-)
3. [Phase 1 — Foundation 🔜](#3-phase-1--foundation-)
4. [Phase 2 — Product System](#4-phase-2--product-system)
5. [Phase 3 — Premium Experience](#5-phase-3--premium-experience)
6. [Phase 4 — Soft Order / Inquiry System](#6-phase-4--soft-order--inquiry-system)
7. [Phase 5 — Delivery-Ready Structure](#7-phase-5--delivery-ready-structure)
8. [Phase 6 — Launch Preparation](#8-phase-6--launch-preparation)
9. [Post-Launch Roadmap](#9-post-launch-roadmap)
10. [Working Rules](#10-working-rules)

---

## 1. Overall Timeline

| Metric | Value |
|---|---|
| MVP target | 16 weeks total (including Phase 0) |
| Remaining work | ~14 weeks (Phase 1–6) |
| Realistic polished target | 20–24 weeks |
| Methodology | Personal Kanban (WIP max 2), 30-min Sunday weekly review |

```
Phase 0 ✅ → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Launch
 (2w)        (3w)      (3w)      (2.5w)    (2.5w)    (1.5w)    (1.5w)
```

Priorities are tracked as **P0** (must) / **P1** (should) / **P2** (nice-to-have) on the GitHub Projects board.

---

## 2. Phase 0 — Documentation & Planning ✅

**Duration:** 2 weeks | **Status:** COMPLETE (2026-07-05)

### Deliverables

| Document | Version |
|---|---|
| 01-vision | v1.4.0 |
| 02-requirements | v1.4.0 |
| 03-use-cases | v1.0.0 |
| 04-er-diagram (11 entities) | v1.0.0 |
| 05-sequence-diagrams | v1.1.0 |
| 06-api-spec (23 paths / 28 operations / 18 schemas) | v1.0.0 |
| 07-uiux-wireframes (WF-XX-NN requirement IDs) | v1.0.0 |
| 08-security | v1.2.0 |
| 09-deployment | v1.2.0 |

All documents exist in both English and Mongolian. Conflict precedence: `07 doc > 02-requirements > prototypes`.

### Finalized Decisions (do not relitigate)

- **Backend:** Fastify + TypeScript (migrated from Express.js — native TS, performance, plugin architecture)
- **Mobile:** React Native + Expo, prebuild/CNG + dev client, NOT Expo Go (migrated from Flutter — unified TypeScript full-stack; official Rive RN Nitro runtime removed Flutter's main advantage)
- **Web:** Next.js (SSR required for SEO), Three.js + React Three Fiber
- **Database:** Supabase PostgreSQL (Singapore region), Supabase Auth (access token 15 min + refresh 7 d, rotation enabled), Supabase Storage
- **Architecture:** Layered Monolith (Controller → Service → Repository); repository layer isolates DB for future migration
- **Design lock (v4 palette):** dark intro with radial gradient `#245842→#1B4634`, saffron `#F2C94C`, ivory `#F5F2E6`; white catalog with ink `#17352A`, action `#0BB555`, saffron-deep `#A9861B`; **no red until Phase 3**
- **Deferred decisions:** D-01..D-06 (category count 6/8/10, red accent timing, photo standard, GLB composition re-tune, i18n, sticky nav)

---

## 3. Phase 1 — Foundation 🔜

**Duration:** 3 weeks | **Status:** NEXT | **Goal:** Working technical foundation

### Week 1 — Repo & Infrastructure

- [ ] Create monorepo (`apps/web`, `apps/mobile`, `backend/api`, `packages/*`)
- [ ] GitHub repository + branch strategy (`main` / `develop` / `feature/xxx`)
- [ ] GitHub Projects Kanban board (Backlog → This Week → In Progress → Review → Done)
- [ ] Docker multi-stage build (Fastify) + `docker-compose.yml` for local dev
- [ ] GitHub Actions skeleton (`web-deploy.yml`, `api-deploy.yml`, `mobile-build.yml` → EAS Build)

### Week 2 — Backend & Database

- [ ] Fastify + TypeScript base structure (port 3001), layered architecture: Controller → Service → Repository
- [ ] Create Supabase project (Singapore region)
- [ ] Write DB schema migrations (all 11 entities per `04-er-diagram`)
- [ ] RLS policies per `08-security`
- [ ] `packages/validation-schemas` (Zod, shared across web + API + mobile)

### Week 3 — Auth & Admin Scaffold

- [ ] Supabase Auth: email + Google OAuth + Facebook OAuth
- [ ] JWT + RBAC (admin / customer roles)
- [ ] Next.js `/admin` protected route scaffold
- [ ] Expo app init (dev client — Rive & Google Sign-In require native modules)
- [ ] Complete `.env.example`; enforce secrets rules per `08-security` §11.2

### Success Criteria

- [ ] Monorepo, CI/CD, and Supabase schema up and running
- [ ] Authentication working (email + Google OAuth)
- [ ] Admin scaffold functional

---

## 4. Phase 2 — Product System

**Duration:** 3 weeks | **Goal:** Usable product catalog system

### Tasks

- [ ] Category CRUD (admin) — category row rule: single row at any count, never wraps; overflow = horizontal scroll + right fade
- [ ] Product CRUD (create / edit / publish / archive / delete)
- [ ] Product image upload (Supabase Storage)
- [ ] Usage instruction management
- [ ] Product listing page (category filter; multi-script search: Cyrillic / Latin / English)
- [ ] Product detail page (images, price, description, usage instructions)
- [ ] SEO: clean slugs, meta titles/descriptions, Open Graph, sitemap
- [ ] Mobile: listing + detail core screens

### Success Criteria

- [ ] Admin can create, edit, and publish a product in under 5 minutes
- [ ] Product listing loads in under 2 seconds on average Mongolian mobile connection
- [ ] Product detail page passes Lighthouse SEO score ≥ 90

---

## 5. Phase 3 — Premium Experience

**Duration:** 2.5 weeks | **Goal:** Premium web and mobile opening experience
**Risk level: HIGHEST of all phases** (3D math, cross-platform animation parity, documented prototype bugs to avoid)

### Tasks

- [ ] Prepare Green Tara GLB; compress via gltf-pipeline Draco (< 5 MB)
- [ ] Three.js / R3F intro: 5 s single camera arc (az `0.85→0`, r `16→6.2`, y `7.5→2.2`, smootherstep easing)
- [ ] **Rule:** deity never moves; atmosphere breathes; camera moves only purposefully
- [ ] **Rule:** lateral camera translate is PROHIBITED (known v4 bug: causes apparent ~10–20° deity rotation + halo parallax); use `camera.setViewOffset` asymmetric projection instead
- [ ] Deity right-placement: `camera.setViewOffset` (offsetX `−0.18w` desktop / `−0.10w` mobile)
- [ ] Get Started → shrinking hero: one persistent canvas `100vh→35vh` (mobile `42vh`, 1.1 s)
- [ ] Skip button (visible within 1 second), static fallback, reduced-motion support
- [ ] 360° product viewer on detail page (OrbitControls; fallback to image gallery when no GLB)
- [ ] Mobile Rive intro + transition (official Rive RN Nitro runtime)
- [ ] Resolve D-04: GLB composition re-tune

### Success Criteria

- [ ] 3D intro completes without errors; skip button visible within 1 second
- [ ] v4 prototype rotation/parallax bug does NOT reproduce
- [ ] Fallback paths work on all devices; mobile Rive intro plays on Android and iOS

---

## 6. Phase 4 — Soft Order / Inquiry System

**Duration:** 2.5 weeks | **Goal:** Users can express interest before delivery operations exist

> ⚠️ **Rule:** Do NOT build full checkout at this stage — delivery operations are not ready. Build soft order / inquiry instead.

### Tasks

- [ ] Product inquiry form (submittable in under 2 minutes, no full registration required)
- [ ] Admin inquiry inbox + status management
- [ ] Wishlist / cart draft (NOT full checkout)
- [ ] Basic user profile
- [ ] Inquiry history
- [ ] Mobile inquiry form

### Success Criteria

- [ ] Customer can submit a product inquiry in under 2 minutes
- [ ] Admin can view and respond to all inquiries from the dashboard

---

## 7. Phase 5 — Delivery-Ready Structure

**Duration:** 1.5 weeks | **Goal:** System ready to activate delivery later via toggle only

### Tasks

- [ ] `delivery_enabled` toggle (admin panel)
- [ ] Backend enforcement of `delivery_enabled` at all layers
- [ ] Order status foundation + order management scaffold
- [ ] Delivery settings page
- [ ] Delivery staff role (future-ready)

**Architectural principle:** The delivery system is fully built at schema + API level but stays inactive behind the admin toggle — no refactoring needed to activate it.

---

## 8. Phase 6 — Launch Preparation

**Duration:** 1.5 weeks | **Goal:** Web MVP live; mobile build test-ready

### Tasks

- [ ] Performance optimization (image optimization, 3D lazy load, static rendering where possible)
- [ ] SEO final pass (sitemap, robots.txt, structured data)
- [ ] Security review (`08-security` §13 checklist)
- [ ] Cloudflare DNS / WAF setup
- [ ] Vercel web deployment (custom domain)
- [ ] Railway API deployment (Docker, `api.yourdomain.com`)
- [ ] Production environment variables
- [ ] EAS Build: Android internal testing build; iOS TestFlight (optional)
- [ ] Final documentation

> ⚠️ App Store / Play Store **public** submission is NOT a launch blocker.

### Success Criteria

- [ ] Web app deployed to Vercel, accessible via custom domain
- [ ] API deployed to Railway with Docker
- [ ] Mobile app passes internal testing on both platforms

---

## 9. Post-Launch Roadmap

Not part of MVP. Revisit after launch:

- Payment gateway integration
- Order tracking; delivery staff mobile app
- Visual image search (camera → find similar product via pgvector)
- Evaluate VM / self-hosted Supabase migration (repository layer enables this without app rewrites)
- Resolve remaining deferred decisions (D-05 i18n, D-06 sticky nav)
- Expanded catalog, loyalty features

---

## 10. Working Rules

1. Do not start with microservices.
2. Do not over-engineer the backend.
3. One backend serves web, admin, and mobile.
4. Keep delivery disabled until business operations are ready.
5. Build product catalog first; build admin CRUD early.
6. 3D intro must always have skip and fallback.
7. Security is handled from the beginning, not bolted on.
8. Working software over perfect diagrams.
9. Git discipline: `feat:/fix:/docs:/refactor:/test:/chore:` commits; `main` / `develop` / `feature/xxx` branches.
10. Every Sunday: 30-minute review — done / next / blockers.

---

*Previous document: [`docs/09-deployment.md`](./09-deployment.md)*
*This document is a living reference. Update phase statuses as work progresses.*
