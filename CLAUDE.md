# CLAUDE.md

Guidance for Claude Code (and other AI agents) working in this repository.

## Project Overview

**Nogoolin** is a premium religious product catalog platform for the Mongolian
market: a public web catalog, an admin panel, a mobile app, and a REST API.
Customers browse, search (multi-script: Cyrillic Mongolian / Latin
transliteration / English), view products in 360° 3D, and submit inquiries.
A full order/delivery system is designed into the schema and API from day one
but stays **inactive** behind an admin-controlled `delivery_enabled` toggle
(default `false`) until business operations are ready — activating it must
never require refactoring.

Solo-developer project (Tengis), 16-week MVP, documentation-first. MVP =
Phases 1–3 of `docs/10-roadmap.md`; Phase 0 (documentation) is complete.

## Authoritative Specifications

The `docs/` folder is the **authoritative Phase 0 specification**. Read the
relevant doc before implementing anything. On conflict, precedence is:

```
07-uiux-wireframes  >  02-requirements  >  prototypes (e.g. nogoolin-prototype-a-v4.html)
```

| Doc | Content |
|---|---|
| `docs/01-vision.md` | Vision, MVP scope, non-goals, constraints |
| `docs/02-requirements.md` | FR-/NFR- requirements (MoSCoW priorities) |
| `docs/03-use-cases.md` | Use cases |
| `docs/04-er-diagram.md` | Database schema — 11 entities, indexes, RLS notes |
| `docs/05-sequence-diagrams.md` | Key flows |
| `docs/06-api-spec.yaml` | OpenAPI spec (23 paths / 28 operations) |
| `docs/07-uiux-wireframes.md` | UI/UX wireframes (highest precedence) |
| `docs/08-security.md` | 4-layer security design, RLS policies, secrets rules |
| `docs/09-deployment.md` | Supabase/Railway/Vercel/Cloudflare + CI/CD |
| `docs/10-roadmap.md` | Phase plan, finalized decisions, working rules |

`*_mn.md` files are Mongolian translations of the same documents.

## Finalized Tech Stack (do not relitigate)

Some older doc passages mention **Flutter** or **Express.js** — those are
**outdated**. The finalized stack is:

- **Backend:** Fastify + TypeScript, port **3001**, REST at `/api/v1/`
- **Web:** Next.js (latest stable) + TypeScript + Tailwind CSS; 3D via
  Three.js + React Three Fiber; deployed to Vercel
- **Mobile:** React Native + Expo — **prebuild/CNG + dev client, NOT Expo Go**
  (Rive and native Google Sign-In need native modules); EAS Build/Submit/Update;
  Zustand for state; `fetch` + `supabase-js` (no extra HTTP client)
- **Database/Auth/Storage:** Supabase PostgreSQL (Singapore), Supabase Auth
  (JWT, 15-min access tokens, refresh rotation), Supabase Storage
  (`product-images`, `model-assets` buckets)
- **Validation:** Zod everywhere, shared via `packages/validation-schemas`
- **Package manager:** pnpm workspaces (Node 20+)
- **API deployment:** Docker multi-stage on `node:20-alpine`, non-root user,
  Railway
- **Security:** 4 layers — Cloudflare WAF → Fastify plugins
  (`@fastify/helmet`, `@fastify/cors`, `@fastify/rate-limit`) → JWT/RBAC → RLS

## Monorepo Layout

```
nogoolin/
├── apps/
│   ├── web/            → Next.js web app + /admin panel (Vercel)
│   └── mobile/         → React Native + Expo app (EAS Build)
├── backend/
│   └── api/            → Fastify + TypeScript REST API (Railway, Docker)
├── packages/
│   ├── shared-types/   → shared TypeScript types
│   └── validation-schemas/ → shared Zod schemas (web + api + mobile)
├── database/
│   └── migrations/     → versioned SQL migrations (append-only; never edit
│                         an applied migration — add a new numbered file)
└── docs/               → authoritative Phase 0 specifications
```

> Note: `docs/09-deployment.md` §1.3 shows an older sketch (`apps/api`,
> `supabase/migrations`). The layout above (`backend/api`,
> `database/migrations`) is the finalized one, per `docs/10-roadmap.md`
> Phase 1 and the project owner's instruction.

## Layered Architecture Rule (backend)

Strict 3-layer architecture in `backend/api` (NFR-MAIN-001):

```
Controller (Fastify route handlers) → Service → Repository
```

- **Business logic must NOT appear in route handlers.**
- **Database queries must NOT appear in services** — only repositories touch
  the database (this isolation enables a future off-Supabase migration).
- API is stateless (NFR-SCA-001); one backend serves web, admin, and mobile.
- Validate every request body with Zod before processing (NFR-SEC-003).
- No raw SQL string interpolation, ever (NFR-SEC-004).

## Git Conventions

- **Conventional commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
  `chore:` (NFR-MAIN-004)
- **Branches:** `main` (production; push deploys), `develop` (integration),
  `feature/xxx` (feature work). No staging environment — merge to `main` is
  the deploy trigger; validate locally first.

## Security & Secrets (per docs/08-security.md §11)

- **No secrets in the codebase** — not in code, test fixtures, seed scripts,
  or docs (NFR-SEC-005). Use environment variables only.
- `.env.example` lists every required variable with placeholder values and
  must be updated in the same PR as any new config (Definition of Done).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (API/Railway): never in Next.js
  client bundles (`NEXT_PUBLIC_*`), never in mobile builds.
- `.gitignore` must cover `.env`, `.env.local`, `.env.*.local`.
- If a secret is ever committed: rotate it immediately.
- RLS enabled on all tables; `audit_logs` is append-only.

## Key Working Rules (docs/10-roadmap.md §10)

1. No microservices; layered monolith only. Do not over-engineer.
2. Keep delivery disabled until business operations are ready — gate order
   routes on `delivery_enabled` at the API level (FR-SET-004).
3. 3D intro must always have a skip button (visible within 1 s), static
   fallback, and `prefers-reduced-motion` support.
4. Security from the beginning, not bolted on.
5. Design lock (v4 palette): dark intro `#245842→#1B4634`, saffron `#F2C94C`,
   ivory `#F5F2E6`; white catalog with ink `#17352A`, action `#0BB555`,
   saffron-deep `#A9861B`; **no red until Phase 3**.
