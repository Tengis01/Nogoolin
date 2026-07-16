# MEMORY — Load This First

> Always-load-first working memory for AI agents. Then read `PROGRESS.md` and
> `TASKS.md`. `docs/` stays authoritative; on conflict:
> 07-uiux-wireframes > 02-requirements > prototypes.

## Where we are

- **Phase 1 — Foundation, Week 1** (repo & infrastructure) of the 16-week MVP.
- Phase 0 (all 10 spec docs) complete 2026-07-05. MVP = Phases 1–3.
- Done so far: monorepo skeleton, CLAUDE.md, Dockerfile + docker-compose,
  GitHub Actions skeletons. Nothing implements features yet.

## Stack (finalized — do not relitigate; Flutter/Express mentions in old docs are outdated)

- **API:** Fastify + TS, port 3001, `/api/v1/`, in `backend/api` —
  strict Controller → Service → Repository (no business logic in routes,
  no DB access in services). Docker on node:20-alpine, non-root → Railway.
- **Web:** Next.js + TS + Tailwind, `/admin` included; Three.js + R3F → Vercel.
- **Mobile:** React Native + Expo, prebuild/CNG + dev client (NOT Expo Go),
  Zustand, fetch + supabase-js → EAS Build (manual trigger).
- **Data:** Supabase Postgres/Auth/Storage. **Local dev = Supabase CLI stack**
  (`pnpm exec supabase start`, offline); cloud project (Singapore) deferred to
  Phase 6 — never create it or add cloud creds early. RLS on ALL tables.
- **Shared:** Zod in `packages/validation-schemas`; types in
  `packages/shared-types`. pnpm workspaces, Node 20+.

## Non-negotiable rules

1. **Secrets:** never in code/fixtures/docs — env vars only. Keep `.env.example`
   in sync in the same PR (Definition of Done). `SUPABASE_SERVICE_ROLE_KEY` is
   server-only, never `NEXT_PUBLIC_*`/mobile. If leaked: rotate immediately.
2. **Delivery toggle principle:** orders/delivery fully built in schema + API but
   inactive behind `system_settings.delivery_enabled=false`. Gate `POST /orders`
   at the SERVICE layer → 403. Activation must never require refactoring.
3. **⚠ Camera bug:** lateral camera translate is PROHIBITED (v4 prototype bug —
   deity appears to rotate ~10–20°). Use `camera.setViewOffset(w,h,-OFF*w*e,0,w,h)`;
   OFF = 0.18 desktop / 0.10 ≤700px. Deity never moves; camera moves only with
   purpose (intro arc + morph, smootherstep).
4. **3D intro:** skip button visible ≤1 s, static WebGL fallback,
   `prefers-reduced-motion` support — always.
5. **Security layers:** Cloudflare WAF → @fastify/helmet+cors+rate-limit →
   JWT (15-min) / RBAC → RLS. Zod-validate every body server-side (shared
   schema; client validation is UX only). No raw SQL interpolation.
6. **Append-only:** migrations in `supabase/migrations/` (Supabase CLI format;
   never edit applied ones) and `audit_logs` (no UPDATE/DELETE for anyone).
   Log all admin mutations.
7. **Design lock v4:** dark intro `#245842→#1B4634` radial (flat fills
   prohibited), saffron `#F2C94C` (deep `#A9861B` on white), ink `#17352A`
   (never #000), action `#0BB555`. **No red until Phase 3.** Category row
   NEVER wraps (horizontal scroll + fade). Details: `design.md`.
8. **Deferred decisions D-01…D-06:** do not implement by assumption — expose as
   constants/config (`DECISIONS.md`).
9. No microservices, no over-engineering. One backend serves web/admin/mobile.

## Git

- Conventional commits: `feat:` `fix:` `docs:` `refactor:` `test:` `chore:`
- Branches: `main` (production, push = deploy) / `develop` (integration) /
  `feature/xxx`. No staging — validate locally before merging to main.

## agent-context/ usage

- Every session: read this file + `PROGRESS.md` + `TASKS.md` first.
- After EVERY task: append to `TASKS.md`; log any error in `ERRORS.md`.
- `DECISIONS.md` / `DB_SCHEMA.md` / `design.md` / `PROJECT_BRIEF.md` /
  `diagrams/`: read when relevant, update only when that domain changes.
