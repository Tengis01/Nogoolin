# Decisions Log (ADR-style)

> Append-only, **newest at top**. One line of rationale each — full reasoning
> lives in `docs/phase-0/10-roadmap.md` §2 and the doc changelogs. Do not relitigate.

Decisions record intent, not proof of deployed or implemented behavior. Read
later amendments first: ADR-011 supersedes ADR-009's migration path; D-07
defers the per-product viewer despite the original model-generation plan.
The current architecture record index is [here](../docs/architecture/README.md).

## Finalized

| # | Date | Decision | Rationale |
|---|---|---|---|
| D-09 | 2026-10-27 | **Product media and specification standard.** (a) Photos are tiered by product type. High-detail items (deity statues, incense burners, ornate pieces) get 4–5 shots: front, side, back, one detail close-up and the base underside. Simple or small items get 2 shots: front and side. All shots use one aspect ratio, one camera height and one light setup. Full spec: [ASSET_SPECS.md §3](ASSET_SPECS.md#3-product-photography-standard-d-09). Photos must show the real product: AI may clean the background or balance colour but must not change the object. This resolves D-03. (b) The per-product 360° view is a **photo spin** (24–36 turntable frames), not a 3D GLB. It is enabled per product only for selected high-detail items. It stays post-MVP (PH8), so D-07's deferral stands. ADR-001 (Meshy per-product GLB) no longer applies to products. GLB stays only for the intro deity (D-04). (c) Dimensions, weight and material are stored as **structured product fields** (`height_cm`, `width_cm`, `depth_cm`, `weight_g`, `material`), not written onto images. The detail page shows them as text. An optional dimension-line overlay drawn by the UI from the same fields is allowed. SRS: FR-PROD-190, FR-PUB-250, FR-PUB-260, FR-PUB-240 (amended) | Owner decision 2026-10-27. Gilded and reflective surfaces are the worst case for photogrammetry and AI 3D (the Hunyuan trial failed), while a photo spin is cheap and shows the real object. Structured fields are editable, filterable, SEO-visible (schema.org) and accessible. Text burned into images is none of these and looks cheap |
| D-08 | 2026-10-14 | **Concept C is the main design direction** (thangka frame + click-driven 4-step orbit intro; jade/paper/gold with ceremonial maroon as accent only). Reference: `docs/nogoolin-prototype-c.html`. v4 tokens in `design.md` are superseded but stay in force for production code until migrated; migration = (a) restructure v4 tokens into primitive→semantic→component→brand with 0px screenshot diff, then (b) switch brand mapping to C page by page (PH5, [roadmap v2](../docs/project/roadmap.md)). WF-INTRO-02 / WF-MO-03 are replaced by the C intro (wireframe v2 in PH2). Resolves D-02 (maroon allowed as accent). D-03, D-04, D-07 unchanged | Owner decision after comparing prototypes A/B/C; C rated clearly better than A/B |
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
| D-07 | **360° per-product 3D viewer deferred — post-MVP** (owner decision 2026-07-20). Rationale: requires a separate 3D asset per product — disproportionate effort for a solo-dev catalog MVP. Product detail pages use the standard photo gallery only (already implemented in feature/public-catalog). State audit at deferral: admin ProductForm/UI and API have NO GLB upload surface (the 06-spec `/admin/products/{id}/model` endpoint was never built; no feature/product-360-viewer branch ever existed — nothing to revert). The `model_3d_url` column DOES exist (migration 0001 per docs/04; append-only, so it stays as a DORMANT column like the order tables) and is accepted by `productPatchSchema`/PATCH; nothing ever sets it, so the public card's conditional "360°" badge never renders. Does NOT affect the 3D INTRO (separate feature, in progress). | Deferred post-MVP. **Amended by D-09 (2026-10-27):** the viewer becomes a photo spin for selected products, not a per-product GLB | Post-launch (PH8) |
| D-01 | Final category count (6 / 8 / 10) | Open — layout ready for any count via single-row rule (WF-HOME-01) | Phase 2 (content entry) |
| D-02 | Ceremonial deep-red accent | **Resolved by D-08 (2026-10-14):** maroon allowed as accent only. v4 production code has no red until the C migration | — |
| D-03 | Product photography standard | **Resolved by D-09 (2026-10-27):** tiered shot list. See ASSET_SPECS.md §3. Previous status: "Direction set: own high-quality photos on white; lighting/angle/ratio guide TBD" (resolve in Phase 2) | — |
| D-04 | Hero composition after real GLB lands (OFF fraction, scale) | 0.18 tuned on placeholder — re-tune on GLB (WF-HERO-08) | Phase 3 |
| D-05 | i18n (MN/EN dual frontend) | MN-only for now; structure kept i18n-ready | Phase 2 |
| D-06 | Sticky-nav behavior on catalog pages | Plain sticky for now (WF-LIST-01) | Phase 2 |
