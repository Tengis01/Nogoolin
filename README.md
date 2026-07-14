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
# Prerequisites: Node 20+, pnpm 9+
pnpm install

# Copy env template and fill in values (see docs/09-deployment.md)
cp .env.example .env
```

> ⚠️ Project is in Phase 1 (Foundation) — apps are skeletons; no features
> implemented yet. See [`docs/10-roadmap.md`](./docs/10-roadmap.md) for status.

## Conventions

- Commits: `feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`
- Branches: `main` (production) / `develop` (integration) / `feature/xxx`
- No secrets in code — env vars only (`docs/08-security.md` §11)
