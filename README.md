# Nogoolin

Premium religious product catalog platform for the Mongolian market —
public web catalog, admin panel, mobile app, and REST API.

> 📚 **Documentation-first project.** All specifications live in [`docs/`](./docs/)
> and are authoritative. Start with [`docs/01-vision.md`](./docs/01-vision.md)
> and [`docs/10-roadmap.md`](./docs/10-roadmap.md). AI-agent guidance is in
> [`CLAUDE.md`](./CLAUDE.md).

## Stack

| Layer | Technology |
|---|---|
| Web | Next.js + TypeScript + Tailwind CSS (Vercel) |
| Mobile | React Native + Expo (prebuild/CNG + dev client, EAS Build) |
| API | Fastify + TypeScript, port 3001 (Railway, Docker) |
| Data | Supabase PostgreSQL + Auth + Storage |
| Validation | Zod (shared via `packages/validation-schemas`) |

## Monorepo Layout

```
apps/web/                    Next.js web app + /admin panel
apps/mobile/                 React Native + Expo app
backend/api/                 Fastify REST API (Controller → Service → Repository)
packages/shared-types/       Shared TypeScript types
packages/validation-schemas/ Shared Zod schemas
database/migrations/         Versioned SQL migrations
docs/                        Authoritative Phase 0 specifications
```

## Getting Started

```bash
# Prerequisites: Node 20+, pnpm 9+, Docker (for local Supabase)
pnpm install

# Copy env template and fill in values (see below / docs/09-deployment.md)
cp .env.example .env
```

## Local Database — Supabase CLI (offline, no cloud project)

Local development runs the full Supabase stack (Postgres + Auth + Storage +
Studio) in Docker via the Supabase CLI (installed as a dev dependency).
**No cloud Supabase project is used until Phase 6** — RLS policies and auth
are fully testable offline.

```bash
# Start the local stack (Docker must be running).
# First run downloads images and applies everything in supabase/migrations/.
pnpm exec supabase start

# It prints local credentials — copy these into .env:
#   API URL  → SUPABASE_URL          (http://127.0.0.1:54321)
#   anon key → SUPABASE_ANON_KEY
#   service_role key → SUPABASE_SERVICE_ROLE_KEY (server-only, never commit)
# Studio (DB browser): http://127.0.0.1:54323

# Stop the stack (add --no-backup to discard local data)
pnpm exec supabase stop

# Re-apply migrations from scratch (wipes local data)
pnpm exec supabase db reset

# New migration (append-only — never edit an applied migration)
pnpm exec supabase migration new <name>
```

Then run the API against it:

```bash
pnpm dev:api   # Fastify on http://localhost:3001 (GET /api/v1/health)
```

> Local keys printed by `supabase start` are well-known development-only
> values — still keep them in `.env` (gitignored), never in code.

## Status

⚠️ Project is in Phase 1 (Foundation) — DB schema + API scaffold exist; web
and mobile apps are not initialized yet. See
[`docs/10-roadmap.md`](./docs/10-roadmap.md) and
[`agent-context/PROGRESS.md`](./agent-context/PROGRESS.md) for live status.

## Conventions

- Commits: `feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`
- Branches: `main` (production) / `develop` (integration) / `feature/xxx`
- No secrets in code — env vars only (`docs/08-security.md` §11)
