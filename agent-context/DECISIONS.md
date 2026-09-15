# Decisions Log (ADR-style)

> Append-only, **newest at top**. One line of rationale each — full reasoning
> lives in `docs/phase-0/10-roadmap.md` §2 and the doc changelogs. Do not relitigate.

## Finalized

| # | Date | Decision | Rationale |
|---|---|---|---|
| ADR-011 | 2026-07-16 | Local-first DB: Supabase CLI local stack (`supabase start`) until Phase 6; migrations live in `supabase/migrations/` (CLI format), superseding the `database/migrations/` plan (ADR-009 partially amended) | RLS + auth testable fully offline; no cloud project/credentials before Phase 6 (owner instruction); CLI requires its own directory layout |
| ADR-010 | 2026-07-16 | Mobile EAS builds trigger manually (`workflow_dispatch`), not on every push | Each EAS build spends paid quota; lint/typecheck still runs on PRs (deviation from docs/phase-0/09 §8.5, owner-approved) |
| ADR-009 | 2026-07-15 | Monorepo layout: `backend/api` + `database/migrations` (not `apps/api` + `supabase/migrations` as sketched in docs/phase-0/09 §1.3) | Finalized per docs/phase-0/10 Phase 1 + project owner instruction; CLAUDE.md records the doc drift |
| ADR-008 | 2026-07 (Phase 0) | pnpm workspaces, Node 20+ | Fast, disk-efficient workspace resolution across web/api/mobile/packages |
| ADR-007 | 2026-07 (Phase 0) | **Layered Monolith** over microservices | Solo developer — microservices are unjustified infrastructure overhead (explicit non-goal, 01-vision §7); repository layer still isolates DB for future migration |
| ADR-006 | 2026-07 (Phase 0) | **Next.js** over Vite/SPA for web | SSR/SSG is a hard SEO requirement (NFR-SEO-007); Vercel-native deploy; App Router serves catalog + /admin from one app |
| ADR-005 | 2026-07 (Phase 0) | **Supabase** over Firebase/self-hosted Postgres | Relational SQL + RLS as security layer 4 + Auth + Storage in one free tier (Singapore region, closest to Mongolia); repository layer keeps an off-Supabase exit path open |
| ADR-004 | 2026-07 (v1.4.0) | **React Native + Expo** over Flutter | Unified TypeScript across the full stack; official Rive RN Nitro runtime removed Flutter's main advantage. Prebuild/CNG + dev client (NOT Expo Go — Rive & native Google Sign-In need native modules) |
| ADR-003 | 2026-06 (v1.3.0) | **Fastify** over Express.js | Native TypeScript, better performance, first-class plugin architecture (@fastify/helmet, cors, rate-limit) |
| ADR-002 | 2026-06 | Delivery system built into schema + API from day one, gated by `delivery_enabled=false` | Activating delivery must never require refactoring (NFR-SCA-003); only the toggle flips |
| ADR-001 | 2026-06 | 3D models generated via **Meshy AI** (not Blender-first) | ~20 min/product from white-background photos; gltf-pipeline Draco compression to ≤5MB; Blender only as fallback for poor outputs |

## Deferred (do NOT implement by assumption — expose as constants/config)

| # | Decision | Status | Resolves in |
|---|---|---|---|
| D-07 | **360° per-product 3D viewer deferred — post-MVP** (owner decision 2026-07-20). Rationale: requires a separate 3D asset per product — disproportionate effort for a solo-dev catalog MVP. Product detail pages use the standard photo gallery only (already implemented in feature/public-catalog). State audit at deferral: admin ProductForm/UI and API have NO GLB upload surface (the 06-spec `/admin/products/{id}/model` endpoint was never built; no feature/product-360-viewer branch ever existed — nothing to revert). The `model_3d_url` column DOES exist (migration 0001 per docs/04; append-only, so it stays as a DORMANT column like the order tables) and is accepted by `productPatchSchema`/PATCH; nothing ever sets it, so the public card's conditional "360°" badge never renders. Does NOT affect the 3D INTRO (separate feature, in progress). | Deferred post-MVP | Post-launch |
| D-01 | Final category count (6 / 8 / 10) | Open — layout ready for any count via single-row rule (WF-HOME-01) | Phase 2 (content entry) |
| D-02 | Ceremonial deep-red accent | Deferred — **no red in v4 palette** | Phase 3 |
| D-03 | Product photography standard | Direction set: own high-quality photos on white; lighting/angle/ratio guide TBD | Phase 2 |
| D-04 | Hero composition after real GLB lands (OFF fraction, scale) | 0.18 tuned on placeholder — re-tune on GLB (WF-HERO-08) | Phase 3 |
| D-05 | i18n (MN/EN dual frontend) | MN-only for now; structure kept i18n-ready | Phase 2 |
| D-06 | Sticky-nav behavior on catalog pages | Plain sticky for now (WF-LIST-01) | Phase 2 |
