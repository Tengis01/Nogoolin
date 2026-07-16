# Tasks — Active Queue

> Kanban for what's happening in this repo right now. After EVERY task, append
> an entry to the Log below (what was done, what's next). Newest log entries
> at top.

## In Progress

*(empty)*

## Backlog (Phase 1 order)

- [ ] Merge `feature/monorepo-setup`, `feature/docker-cicd`, `feature/agent-context`
      → `main`; create `develop` branch
- [ ] GitHub Projects Kanban board (Backlog → This Week → In Progress → Review → Done)
- [ ] Initialize `backend/api` for real: Fastify + TS boilerplate, scripts
      (`dev`/`build`/`lint`/`type-check`/`test`), generate `pnpm-lock.yaml`
- [ ] Create Supabase project (Singapore); save keys to env (never commit)
- [ ] Migration `0001`: 11 tables + enums + indexes + RLS policies + `is_admin()`
      + `on_auth_user_created` trigger (per `DB_SCHEMA.md` / docs/08 §6)
- [ ] Seed: `system_settings` row `delivery_enabled=false`
- [ ] `packages/validation-schemas`: Zod schemas (inquiry, product, category,
      delivery toggle, inquiry status — docs/08 §7.2 inventory)
- [ ] Supabase Auth config: email + Google OAuth (PKCE), 15-min JWT, rotation
- [ ] Next.js app init (`apps/web`) + `/admin` protected route scaffold
- [ ] Expo app init (`apps/mobile`, dev client)
- [ ] Storage buckets `product-images` / `model-assets` + storage RLS policies

## Done

- [x] 2026-07-16 — agent-context/ working-memory layer + CLAUDE.md standing instruction
- [x] 2026-07-16 — Dockerfile (multi-stage, non-root) + docker-compose + 3 CI skeletons
- [x] 2026-07-15 — CLAUDE.md + monorepo skeleton (workspaces, tsconfig base, env template)

---

## Log (append after every task, newest first)

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
