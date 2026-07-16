# Progress — Actual Repo State

> Mirrors `docs/10-roadmap.md` checklists but reflects what is REALLY done in
> this repo. Update when tasks complete. Last verified: **2026-07-16**.

## Phase 0 — Documentation & Planning ✅ COMPLETE (2026-07-05)

All 10 spec docs (EN + MN) exist in `docs/`. Conflict precedence
07 > 02 > prototypes. Finalized decisions in `DECISIONS.md`.

## Phase 1 — Foundation 🔄 IN PROGRESS (Week 1)

### Week 1 — Repo & Infrastructure
- [x] Monorepo skeleton (`apps/web`, `apps/mobile`, `backend/api`, `packages/*`,
      `database/migrations`) — folder structure + stub package.jsons only
- [x] Root `package.json` + `pnpm-workspace.yaml` + `tsconfig.base.json`
- [x] `.gitignore` / `.env.example` (placeholders) / README stub / CLAUDE.md
- [~] Branch strategy: `main` + `feature/xxx` in use; **`develop` branch not
      created yet**; feature branches not yet merged to `main`
- [ ] GitHub Projects Kanban board (not verifiable from repo — assumed not done)
- [x] Docker multi-stage build (`backend/api/Dockerfile`, non-root, pnpm deploy)
- [x] `docker-compose.yml` for local dev (api service, hot-reload, cloud Supabase)
- [x] GitHub Actions skeletons (`web-deploy.yml`, `api-deploy.yml`,
      `mobile-build.yml`) — structure only; deploy details are Phase 6 TODOs

### Week 2 — Backend & Database
- [ ] Fastify + TS base structure (port 3001, Controller→Service→Repository) —
      only empty layer folders exist in `backend/api/src/`
- [ ] Supabase project (Singapore) — not created
- [ ] DB schema migrations (11 entities per `DB_SCHEMA.md`) — `database/migrations/` empty
- [ ] RLS policies per docs/08 §6
- [ ] `packages/validation-schemas` Zod schemas — stub package only

### Week 3 — Auth & Admin Scaffold
- [ ] Supabase Auth (email + Google OAuth; Facebook = S-priority)
- [ ] JWT + RBAC (admin/customer)
- [ ] Next.js `/admin` protected route scaffold — web app not initialized
- [ ] Expo app init (dev client) — mobile app not initialized
- [ ] `.env.example` complete + secrets rules enforced — initial version exists;
      grows with each new config

### Known gaps blocking CI
- No `pnpm-lock.yaml` (no install run yet)
- Workspace packages lack `lint`/`type-check`/`test`/`dev`/`build` scripts —
  CI workflows will fail until apps are initialized

## Phase 2 — Product System ⬜ NOT STARTED
## Phase 3 — Premium Experience ⬜ NOT STARTED (highest-risk phase)
## Phase 4 — Soft Order / Inquiry ⬜ NOT STARTED
## Phase 5 — Delivery-Ready Structure ⬜ NOT STARTED
## Phase 6 — Launch Preparation ⬜ NOT STARTED
