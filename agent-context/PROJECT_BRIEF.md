# Nogoolin — Project Brief

> Fast-load summary. Authoritative source: `docs/01-vision.md`, `docs/02-requirements.md`.

**What:** Premium religious/spiritual product **catalog platform** for the
Mongolian market — public web catalog, admin panel, mobile app, REST API.
Products (statues, incense, ritual items) are currently sold only in scattered
physical stores in Ulaanbaatar with zero digital presence; Nogoolin is the
first-mover digital catalog. Dual purpose: real business product + portfolio
project (production-quality engineering by a solo developer, Tengis).

**Target users:** Mongolian adults (primarily women 25–60) browsing/researching
religious products. Guest browsing needs no account. Admin = business owner.

**Core features (MVP = Phases 1–3):**
- Product catalog: browse, category filter, detail pages with usage instructions
- Multi-script search — Cyrillic Mongolian / Latin transliteration / English all
  return the same results (`name` + `name_en` + `search_tags` text[])
- 360° 3D product viewer (Three.js; GLB via Meshy AI + Draco compression)
- Signature 3D intro (Green Tara / Ногоон Дарь Эх) with skip/fallback/reduced-motion
- Admin panel: product/category CRUD, image + GLB upload, inquiry inbox
- Product inquiry form (guest, no registration, rate-limited 3/IP/hour)

**Deliberately inactive (designed-in, toggle-gated):** cart, checkout, orders,
delivery — full schema + API exist from day one behind `delivery_enabled = false`.
Activation must never require refactoring.

**Explicit non-goals:** marketplace, real-time chat, payments (MVP), microservices,
i18n (MN-first), reviews/UGC.

**Stack one-liner:** Fastify+TS API (port 3001, Controller→Service→Repository,
Railway/Docker) · Next.js+Tailwind web + /admin (Vercel) · React Native+Expo
mobile (dev client, EAS) · Supabase Postgres/Auth/Storage (Singapore) · Zod
shared schemas · pnpm monorepo · Cloudflare WAF in front.

**Timeline:** 16-week MVP, documentation-first. **Current phase: Phase 1 —
Foundation (Week 1: repo & infrastructure)**. Phase 0 (all 10 spec docs)
completed 2026-07-05. See `PROGRESS.md` for live status.
