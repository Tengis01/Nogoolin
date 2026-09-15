# Nogoolin

Premium religious product catalog platform for the Mongolian market —
public web catalog, admin panel, mobile app, and REST API.

> 📚 **Documentation-first project.** All specifications live in [`docs/`](./docs/)
> and are authoritative. Start with [`docs/phase-0/01-vision.md`](docs/phase-0/01-vision.md)
> and [`docs/phase-0/10-roadmap.md`](docs/phase-0/10-roadmap.md). AI-agent guidance is in
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

# Copy env template and fill in values (see below / docs/phase-0/09-deployment.md)
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

Then run the apps against it:

```bash
pnpm dev:api      # Fastify on http://localhost:3001 (GET /api/v1/health)
pnpm dev:web      # Next.js on http://localhost:3000 (login/signup/admin)
pnpm dev:mobile   # Expo dev-client server (see § Mobile below)
```

## Auth & OAuth Setup (local)

Email/password auth works out of the box against the local stack
(15-min access tokens, 7-day rotating refresh — `supabase/config.toml`).
Password-reset emails land in the local test inbox at
<http://127.0.0.1:54324>.

Google/Facebook OAuth needs app registrations. Until credentials are added
to `.env`, the OAuth buttons render in a disabled "not configured" state.

**Register these redirect URLs on the provider consoles (local dev):**

| Provider | Console setting | Value |
|---|---|---|
| Google ([console.cloud.google.com](https://console.cloud.google.com) → OAuth client, type "Web application") | Authorized redirect URI | `http://127.0.0.1:54321/auth/v1/callback` |
| Google (same client) | Authorized JavaScript origin | `http://localhost:3000` |
| Facebook ([developers.facebook.com](https://developers.facebook.com) → Facebook Login) | Valid OAuth Redirect URI | `http://127.0.0.1:54321/auth/v1/callback` |

Then put the client IDs/secrets in `.env` (`GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`) and
restart `supabase start`. Also mirror the two client IDs (not secrets) into
`apps/web/.env.local` so the login page detects them as configured.

> Phase 6 (cloud): register the additional
> `https://<project-ref>.supabase.co/auth/v1/callback` URL on both consoles —
> the local one stays for development.

## Mobile (Expo dev client — NOT Expo Go)

```bash
cd apps/mobile
pnpm exec expo prebuild --platform android   # generate native project (CNG)
pnpm exec expo run:android                    # build + install dev client (needs Android SDK)
# iOS (macOS only): pnpm exec expo run:ios
# Cloud alternative: eas build --profile development --platform android
pnpm start                                    # then: Metro for the dev client
```

> Local keys printed by `supabase start` are well-known development-only
> values — still keep them in `.env` (gitignored), never in code.

## Status

⚠️ Project is in Phase 1 (Foundation) — DB schema + API scaffold exist; web
and mobile apps are not initialized yet. See
[`docs/phase-0/10-roadmap.md`](docs/phase-0/10-roadmap.md) and
[`agent-context/PROGRESS.md`](./agent-context/PROGRESS.md) for live status.

## Conventions

- Commits: `feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`
- Branches: `main` (production) / `develop` (integration) / `feature/xxx`
- No secrets in code — env vars only (`docs/phase-0/08-security.md` §11)

## Documentation / ICSI405

[Баримтын индекс](docs/README.md) · [M2 багц](docs/ICSI405/sem2/README.md) · [SRS](docs/requirements/srs-template.md) · [SDD](docs/architecture/sdd-template.md).

Өмнөх 01–10 цувралын эхүүд [docs/phase-0](docs/phase-0/README.md)-д, хичээлийн эхүүд [docs/ICSI405](docs/ICSI405/README.md)-д байна.
