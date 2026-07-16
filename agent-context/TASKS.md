# Tasks — Active Queue

> Kanban for what's happening in this repo right now. After EVERY task, append
> an entry to the Log below (what was done, what's next). Newest log entries
> at top.

## In Progress

*(empty)*

## Backlog (Phase 2 order)

- [ ] Runtime smoke test (Phase 1 closeout): start Docker →
      `pnpm exec supabase start` → RLS check query (docs/09 §4.5) → sign up
      on web → bootstrap first admin via SQL (docs/09 §9) → /admin loads →
      `GET /api/v1/admin/ping` 200/403/401 matrix
- [ ] Merge feature branches → `main`; create `develop` branch
      (waiting for owner go-ahead — "wait user to tell" 2026-07-16)
- [ ] GitHub Projects Kanban board
- [ ] Storage buckets `product-images` / `model-assets` + storage RLS policies
- [ ] Category CRUD (admin) — single-row rule (WF-HOME-01)
- [ ] Product CRUD + image upload + usage instructions
- [ ] Product listing + detail pages (public), multi-script search
- [ ] Mobile: listing + detail core screens
- [ ] Real eslint config (lint currently aliases `tsc --noEmit`)
- [ ] Mobile: encrypted session storage (docs/08 §5.2) + native Google Sign-In

## Done

- [x] 2026-07-17 — Phase 1 complete: auth (email + OAuth scaffold), JWT/RBAC,
      /admin scaffold, Expo app init, .env.example final
- [x] 2026-07-16 — Local Supabase stack + 3 migrations (schema/RLS/seed) +
      Fastify layered scaffold + shared Zod schemas + lockfile
- [x] 2026-07-16 — agent-context/ working-memory layer + CLAUDE.md standing instruction
- [x] 2026-07-16 — Dockerfile (multi-stage, non-root) + docker-compose + 3 CI skeletons
- [x] 2026-07-15 — CLAUDE.md + monorepo skeleton (workspaces, tsconfig base, env template)

---

## Log (append after every task, newest first)

### 2026-07-17 — Auth + admin + mobile init (`feature/auth-admin-scaffold`) — PHASE 1 COMPLETE
- **Done:** config.toml auth finalized (site_url localhost:3000, redirect
  allowlist incl. nogoolin:// deep link, sessions timebox 168h = 7d,
  [auth.external.google/facebook] via env() — placeholders OK);
  API: requireAuth/requireAdmin hooks per docs/08 §5.4 + user/audit-log
  repositories + `/api/v1/admin/ping` smoke route; web: Next.js 15 app
  (@supabase/ssr cookies + middleware refresh, login/signup/reset/update
  password, /auth/callback PKCE exchange, OAuth buttons with not-configured
  state, protected /admin layout + dashboard, v4 tokens in globals.css);
  mobile: Expo SDK 52 dev-client/CNG app (expo-router, Zustand auth store,
  login/signup screens, eas.json with development profile); .env.example
  finalized; README OAuth redirect-URL guide + mobile build commands.
  Verified: all 4 packages type-check; `next build` passes (admin/callback
  dynamic, rest static); `expo prebuild -p android` generates native project.
  NOT verified at runtime (Docker still down). NOT pushed.
- **Next:** Phase 2 — runtime smoke test first, then storage buckets +
  category/product CRUD.

### 2026-07-16 — Local DB schema + backend structure (`feature/db-schema-local`)
- **Done:** Supabase CLI added as root dev dep (`pnpm exec supabase ...`);
  `supabase init` (config.toml: project_id nogoolin, jwt_expiry 900);
  3 migrations in `supabase/migrations/` — init_schema (6 enums, 11 tables,
  9 indexes, updated_at triggers), rls_policies (is_admin(), auth trigger,
  22 policies, RLS on all 11 tables), seed_system_settings
  (delivery_enabled=false); `packages/validation-schemas` implemented (9 src
  files: entity + input schemas per docs/08 §7.2); `backend/api` layered
  scaffold (env config, supabase client factory, helmet/cors/rate-limit
  plugins, validateBody hook, DB-agnostic repository interfaces + supabase
  settings impl, settings service, health + /settings/public controllers);
  README local-dev docs; .env.example local values; migrations location
  moved database/→supabase/ (ADR-011, CLAUDE.md + workflows updated).
  Both packages type-check clean. NOT pushed (owner: wait for go-ahead).
- **Next:** start Docker → `supabase start` → verify migrations + RLS live.

### 2026-07-16 — Created agent-context/ layer
- **Done:** 9 files (PROJECT_BRIEF, DECISIONS, DB_SCHEMA, design, MEMORY,
  PROGRESS, TASKS, ERRORS, diagrams/×3) condensed from docs/; CLAUDE.md updated
  with session-start + task-end standing instructions. Branch `feature/agent-context`.
- **Next:** merge the three feature branches to `main`, create `develop`, then
  start Phase 1 Week 2 (Fastify init + Supabase).

### 2026-07-16 — Docker + CI/CD scaffolding (`feature/docker-cicd`)
- **Done:** `backend/api/Dockerfile` (builder + lean prod stage, pnpm deploy,
  non-root), `.dockerignore`, `docker-compose.yml` (hot-reload, env from .env,
  no local Postgres — cloud Supabase), 3 GitHub Actions skeletons with path
  filters + lint/typecheck gates. Mobile builds = manual workflow_dispatch (ADR-010).
- **Next:** agent-context/ layer (done — see above).

### 2026-07-15 — Monorepo scaffold (`feature/monorepo-setup`)
- **Done:** CLAUDE.md; folder structure; root package.json + pnpm-workspace.yaml;
  tsconfig.base.json; .gitignore; .env.example (placeholders only); README;
  stub package.jsons for 5 workspaces; layered src/ dirs in backend/api.
- **Next:** Docker + CI/CD scaffolding (done — see above).
