# Traceability v2

**Doc ID:** REQ-02 · **Хувилбар:** v2.0 draft · **Огноо:** 2026-10-18 · **Owner:** Тэнгис

Энэ хүснэгт [SRS v2](srs-v2.md)-ийн leaf шаардлага бүрийг эх, архитектур/ADR, код, тесттэй холбоно. Энэ нь G4-ийн суурь ([зорилго](../project/project-goals.md#g4--чанар-ба-traceability)).

Баганын утга:
- **Code:** 2026-10-18-нд уншсан файл.
- **Test:** одоо байгаа тестийн файл, эсвэл `planned`.
- **Verif. status:** тест ажиллуулсан нотолгоо биш. Тест энэ ажлаар ажиллуулаагүй.

Хуучин хувилбар: [traceability v1.0](traceability-matrix-v1.0.md), [M2](traceability-matrix.md).

| ID | Priority | Source | Arch/ADR | Code | Test | Verif. status |
|---|---|---|---|---|---|---|
| FR-AUTH-110 | Must | P0 FR-AUTH-001 | ADR-005 | apps/web/src/app/login/page.tsx | planned | not run |
| FR-AUTH-120 | Must | P0 FR-AUTH-002 | ADR-005 | apps/web/src/components/auth/oauth-buttons.tsx | planned | not run |
| FR-AUTH-130 | Could | P0 FR-AUTH-003 | ADR-005 | apps/web/src/components/auth/oauth-buttons.tsx | planned | not run |
| FR-AUTH-140 | Must | P0 FR-AUTH-004 | 08-security §5.6 | apps/web/src/app/auth/callback/route.ts | planned | not run |
| FR-AUTH-150 | Must | code | ADR-005 | apps/web/src/app/signup/page.tsx | planned | not run |
| FR-AUTH-160 | Could | P0 FR-AUTH-007 | ADR-005 | — | planned | not run |
| FR-AUTH-210 | Must | P0 FR-AUTH-005 | ADR-007 | backend/api/src/hooks/auth.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-AUTH-220 | Must | P0 FR-AUTH-006 | ADR-005 | supabase/config.toml | planned | not run |
| FR-AUTH-230 | Must | P0 FR-AUTH-011 | — | apps/web/src/components/auth/signout-button.tsx | planned | not run |
| FR-AUTH-310 | Must | P0 FR-AUTH-008 | ADR-002 | supabase/migrations/20260716154417_init_schema.sql | planned | not run |
| FR-AUTH-320 | Must | P0 FR-AUTH-009 | 08-security §5.5 | backend/api/src/hooks/auth.ts | backend/api/tests/api.integration.test.ts | written, skipped without DB |
| FR-AUTH-330 | Must | code | — | apps/web/src/app/admin/layout.tsx | planned | not run |
| FR-AUTH-340 | Must | P0 FR-AUTH-010 | 08-security §6 | supabase/migrations/20260716154420_rls_policies.sql | planned | not run |
| FR-USER-110 | Must | P0 FR-USER-001 | 04-er §3.1 | supabase/migrations/20260716154417_init_schema.sql | planned | not run |
| FR-USER-120 | Should | P0 FR-USER-002 | — | apps/web/src/components/public/profile-form.tsx | planned | not run |
| FR-USER-130 | Must | P0 FR-USER-005 | 08-security §6.4 | supabase/migrations/20260716154420_rls_policies.sql | planned | not run |
| FR-USER-140 | Should | roadmap Phase 4 | — | apps/web/src/app/profile/page.tsx | planned | not run |
| FR-USER-210 | Could | P0 FR-USER-003 | — | — | planned | not run |
| FR-USER-220 | Could | P0 FR-USER-004 | — | supabase/migrations/20260716154420_rls_policies.sql | planned | not run |
| FR-USER-221 | Could | plan F-02 | — | — | planned | not run |
| FR-INQ-110 | Must | P0 FR-INQ-001/003; v1.0 FR-01; M2 FR-01 | ADR-007 | backend/api/src/controllers/inquiry.controller.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-INQ-120 | Must | P0 FR-INQ-002 | — | packages/validation-schemas/src/inquiry.schema.ts | planned (inspection) | not run |
| FR-INQ-130 | Must | v1.0 FR-02 | — | backend/api/src/hooks/auth.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-INQ-140 | Must | v1.0 FR-03 | — | apps/web/src/lib/inquiry-form-schema.ts | backend/api/tests/inquiry-cart.integration.test.ts (API); web planned | partial |
| FR-INQ-150 | Must | v1.0 FR-04 | — | apps/web/src/components/public/inquiry-form.tsx | planned | not run |
| FR-INQ-160 | Must | P0 FR-INQ-007; v1.0 FR-05 | 08-security §4.3 | backend/api/src/controllers/inquiry.controller.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-INQ-170 | Must | code | — | apps/web/src/components/public/inquiry-form.tsx | planned | not run |
| FR-INQ-180 | Could | code | — | apps/web/src/app/products/[slug]/inquiry/page.tsx | planned | not run |
| FR-INQ-210 | Must | v1.0 FR-06 | — | apps/web/src/components/public/inquiry-history.tsx | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-INQ-310 | Must | P0 FR-INQ-004; v1.0 FR-07 | — | backend/api/src/controllers/admin/inquiry.controller.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-INQ-320 | Should | P0 FR-INQ-006; v1.0 FR-08 | — | backend/api/src/repositories/supabase/inquiry.repository.ts | backend/api/tests/inquiry-cart.integration.test.ts (date filter planned) | partial |
| FR-INQ-330 | Must | P0 FR-INQ-005; v1.0 FR-09 | — | backend/api/src/services/inquiry.service.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-INQ-340 | Could | project-goals G2 | — | — | planned | not run |
| FR-WISH-110 | Must | v1.0 FR-10; M2 FR-02 | — | apps/web/src/app/wishlist/page.tsx | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-WISH-120 | Must | v1.0 FR-11 | — | backend/api/src/controllers/cart.controller.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-WISH-130 | Must | v1.0 FR-12 | — | backend/api/src/repositories/supabase/cart.repository.ts | backend/api/tests/inquiry-cart.integration.test.ts | written, skipped without DB |
| FR-WISH-140 | Must | v1.0 FR-13 | — | apps/web/src/components/public/wishlist-grid.tsx | backend/api/tests/inquiry-cart.integration.test.ts (A/B planned) | partial |
| FR-WISH-150 | Must | v1.0 FR-14 | — | backend/api/src/controllers/cart.controller.ts | backend/api/tests/inquiry-cart.integration.test.ts (A/B planned) | partial |
| FR-AUD-110 | Must | P0 FR-AUD-001 | — | backend/api/src/services/product.service.ts | planned | not run |
| FR-AUD-120 | Must | P0 FR-AUD-002 | 04-er §3.11 | supabase/migrations/20260716154417_init_schema.sql | planned (inspection) | not run |
| FR-AUD-130 | Must | P0 FR-AUD-003 | 08-security §6.12 | supabase/migrations/20260716154420_rls_policies.sql | planned | not run |
| FR-AUD-140 | Should | P0 FR-AUD-004 | — | — | planned | not run |
| FR-AUD-150 | Must | P0 FR-AUD-005 | ADR-002 | — | planned | not run |
| FR-AUD-160 | Should | code (UC-ADM-011) | — | backend/api/src/hooks/auth.ts | planned | not run |
| NFR-SEC-110 | Must | P0 NFR-SEC-001 | 09-deployment | backend/api/src/plugins/helmet.ts | planned | not run |
| NFR-SEC-120 | Should | P0 NFR-SEC-012 | 08-security §3 | — | planned | not run |
| NFR-SEC-130 | Must | P0 NFR-SEC-006 | 08-security §4.2 | backend/api/src/plugins/cors.ts | planned | not run |
| NFR-SEC-140 | Must | P0 NFR-SEC-007 | 08-security §4.1 | backend/api/src/plugins/helmet.ts | planned | not run |
| NFR-SEC-210 | Must | P0 NFR-SEC-003 | 08-security §7 | backend/api/src/hooks/validate.ts | backend/api/tests/api.integration.test.ts | written, skipped without DB |
| NFR-SEC-220 | Must | P0 NFR-SEC-004 | ADR-007 | backend/api/src/repositories/supabase/ | planned (inspection) | not run |
| NFR-SEC-230 | Must | P0 NFR-SEC-011 | — | backend/api/src/services/media.service.ts | backend/api/tests/api.integration.test.ts | written, skipped without DB |
| NFR-SEC-240 | Must | plan F-05 | — | apps/web/src/app/products/[slug]/page.tsx | planned | not run |
| NFR-SEC-251 | Must | P0 NFR-SEC-002 | 08-security §4.3 | backend/api/src/plugins/rate-limit.ts | planned | not run |
| NFR-SEC-252 | Must | P0 NFR-SEC-002 | ADR-005 | supabase/config.toml | planned | not run |
| NFR-SEC-310 | Must | P0 NFR-SEC-009 | 08-security §5.5 | backend/api/src/app.ts | backend/api/tests/api.integration.test.ts | written, skipped without DB |
| NFR-SEC-320 | Must | P0 NFR-SEC-010; v1.0 NFR-01; M2 NFR-01 | 08-security §9 | backend/api/src/repositories/supabase/cart.repository.ts | backend/api/tests/inquiry-cart.integration.test.ts (A/B matrix planned) | partial |
| NFR-SEC-330 | Must | P0 NFR-SEC-013 | ADR-005 | supabase/config.toml | planned (inspection) | not run |
| NFR-SEC-340 | Must | P0 NFR-SEC-008 | 08-security §6 | supabase/migrations/20260716154420_rls_policies.sql | planned | not run |
| NFR-SEC-350 | Must | review (new) | 08-security §6.4 | supabase/migrations/20260716154420_rls_policies.sql | planned | not run |
| NFR-SEC-410 | Must | P0 NFR-SEC-005 | 08-security §11 | backend/api/src/config/env.ts | planned (secret scan) | not run |
| NFR-SEC-420 | Must | v1.0 §6 | ADR-005 | backend/api/src/lib/supabase.ts | planned (inspection) | not run |
| NFR-SEC-500 | Should | v1.0 §6 | — | backend/api/src/app.ts | planned (inspection) | not run |
| NFR-REL-110 | Should | P0 NFR-REL-001 | 09-deployment | — | planned | not run |
| NFR-REL-120 | Should | P0 NFR-REL-002 | 09-deployment | backend/api/src/controllers/health.controller.ts | planned | not run |
| NFR-REL-130 | Should | P0 NFR-REL-006 | 09-deployment | — | planned | not run |
| NFR-REL-210 | Must | P0 NFR-REL-003 | 06-api-spec Error | backend/api/src/app.ts | backend/api/tests/api.integration.test.ts | written, skipped without DB |
| NFR-REL-220 | Must | P0 NFR-REL-004 | — | apps/web/src/app/products/[slug]/not-found.tsx | planned | not run |
| NFR-REL-230 | Won't | P0 NFR-REL-005 | — | — | planned | not run |
| NFR-REL-240 | Should | v1.0 NFR-05 | — | — | planned | not run |
| FR-CAT-110 | Must | FR-CAT-001 | ADR-007 | `backend/api/src/services/category.service.ts` | `backend/api/tests/api.integration.test.ts` | test exists (skips without local DB) |
| FR-CAT-120 | Must | FR-CAT-002 | ADR-007 | `backend/api/src/controllers/admin/category.controller.ts` | `api.integration.test.ts` | test exists |
| FR-CAT-130 | Must | FR-CAT-003 | ADR-005 | `backend/api/src/repositories/supabase/category.repository.ts` | planned | planned |
| FR-CAT-131 | Should | FR-CAT-003 | — | — | planned | planned |
| FR-CAT-140 | Should | FR-CAT-004 | — | `category.service.ts` | `api.integration.test.ts` | test exists |
| FR-CAT-150 | Must | FR-CAT-005 | — | `backend/api/src/lib/slug.ts`, `packages/validation-schemas/src/common.ts` | `api.integration.test.ts` | test exists |
| FR-CAT-160 | Should | FR-CAT-006 | — | `category.repository.ts` | planned | planned |
| FR-CAT-210 | Must | FR-CAT-007 | — | `backend/api/src/controllers/category.controller.ts` | `api.integration.test.ts` | test exists |
| FR-CAT-220 | Should | code | — | `category.controller.ts` | `api.integration.test.ts` (200 only) | partial |
| FR-PROD-110 | Must | FR-PROD-001 | — | `packages/validation-schemas/src/product.schema.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-120 | Must | FR-PROD-008 | ADR-005 | `supabase/migrations/20260716154417_init_schema.sql` | planned | inspection pending |
| FR-PROD-130 | Must | FR-PROD-003 | — | `common.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-140 | Must | FR-PROD-005 | — | `apps/web/src/app/products/[slug]/page.tsx` | planned | planned |
| FR-PROD-150 | Must | FR-PROD-007 | — | `backend/api/src/services/product.service.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-160 | Must | FR-PROD-009 | — | `product.repository.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-170 | Must | FR-PROD-010 | — | `apps/web/src/components/public/product-tabs.tsx` | planned | planned |
| FR-PROD-180 | Must | FR-PUB-013 | — | `supabase/migrations/20260719103322_product_search_vector.sql` | `api.integration.test.ts` | test exists |
| FR-PROD-210 | Must | FR-PROD-001 | ADR-007 | `product.service.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-220 | Must | FR-PROD-002 | — | `backend/api/src/controllers/admin/product.controller.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-230 | Must | FR-PROD-004 | — | `product.service.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-240 | Must | FR-PROD-006 | — | `product.repository.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-250 | Should | FR-PROD-011 | — | `product.service.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-260 | Should | FR-PROD-011 | — | `product.service.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-310 | Must | FR-PROD-004 | ADR-005 | `product.repository.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-320 | Must | FR-PROD-012 | — | `product.schema.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-330 | Must | FR-PROD-013 | — | `product.schema.ts` | `api.integration.test.ts` | test exists |
| FR-PROD-340 | Should | code | — | `product.schema.ts` | planned | planned |
| FR-MEDIA-110 | Must | FR-MEDIA-001 | ADR-005 | `backend/api/src/services/media.service.ts` | `api.integration.test.ts` | test exists |
| FR-MEDIA-120 | Must | FR-MEDIA-002/003 | — | `media.service.ts`, `backend/api/src/controllers/admin/media.controller.ts` | `api.integration.test.ts` | test exists |
| FR-MEDIA-121 | Must | FR-MEDIA-003 | — | `apps/web/src/components/admin/product-form.tsx` | planned | planned |
| FR-MEDIA-130 | Must | FR-MEDIA-004 | — | `packages/validation-schemas/src/media.schema.ts` | planned | inspection pending |
| FR-MEDIA-140 | Must | FR-MEDIA-005 | — | `media.controller.ts` | `api.integration.test.ts` | test exists |
| FR-MEDIA-150 | Must | FR-MEDIA-006 | — | `media.controller.ts` | `api.integration.test.ts` | test exists |
| FR-MEDIA-160 | Must | FR-MEDIA-009 | — | `media.service.ts` | planned | inspection pending |
| FR-MEDIA-210 | Won't | FR-MEDIA-007 | D-07 | — | — | deferred |
| FR-MEDIA-220 | Won't | FR-MEDIA-008/011 | D-07 | — | — | deferred |
| FR-MEDIA-230 | Won't | FR-MEDIA-011 | ADR-001, D-07 | — | — | deferred |
| FR-PUB-110 | Must | FR-PUB-001 | ADR-006 | `apps/web/src/app/products/(list)/page.tsx` | planned | planned |
| FR-PUB-120 | Must | FR-PUB-002/008 | — | `apps/web/src/components/public/category-chips.tsx` | planned | planned |
| FR-PUB-130 | Must | FR-PUB-005 | — | `category-chips.tsx` | planned | planned |
| FR-PUB-140 | Must | FR-PUB-014 | — | `product.service.ts` | `api.integration.test.ts` | test exists |
| FR-PUB-150 | Must | WF-LIST-06 | — | `(list)/page.tsx` | planned | planned |
| FR-PUB-160 | Should | WF-LIST-07 | — | `(list)/page.tsx` | planned | planned |
| FR-PUB-170 | Should | code | — | `apps/web/src/components/public/pagination.tsx` | planned | planned |
| FR-PUB-210 | Must | FR-PUB-003/007 | ADR-006 | `apps/web/src/app/products/[slug]/page.tsx` | planned | planned |
| FR-PUB-220 | Must | FR-PUB-004 | — | `product-gallery.tsx`, `product-tabs.tsx` | planned | planned |
| FR-PUB-230 | Must | UC-G-004 | — | `apps/web/src/app/products/[slug]/not-found.tsx` | planned | planned |
| FR-PUB-240 | Won't | FR-PUB-004/011 | D-07 | — | — | deferred |
| FR-PUB-310 | Must | FR-PUB-006 | D-08 | `apps/web/src/app/page.tsx` (placeholder) | planned | planned |
| FR-PUB-320 | Should | WF-HOME-01 | D-01, D-08 | — | planned | planned |
| FR-PUB-410 | Must | FR-PUB-009 | ADR-002 | `backend/api/src/controllers/settings.controller.ts` | planned | planned |
| FR-PUB-420 | Must | FR-PUB-010, FR-SET-005 | ADR-002 | (no order UI) | planned (inspection) | inspection pending |
| FR-PUB-500 | Won't | FR-PUB-012 | — | — | — | deferred |
| FR-ADM-110 | Must | FR-ADM-002 | — | `apps/web/src/app/admin/layout.tsx` | planned | planned |
| FR-ADM-120 | Must | FR-ADM-001 | — | `admin/layout.tsx`, `backend/api/src/hooks/auth.ts` | `api.integration.test.ts` (API 403) | partial |
| FR-ADM-200 | Should | FR-ADM-003 | — | `apps/web/src/app/admin/page.tsx` (placeholder) | planned | planned |
| FR-ADM-310 | Must | FR-ADM-004 | — | `apps/web/src/components/admin/product-table.tsx` | planned | planned |
| FR-ADM-320 | Must | FR-ADM-004 | — | `product-form.tsx` | planned | planned |
| FR-ADM-330 | Must | FR-ADM-004, FR-PROD-002, FR-PUB-015 | — | — (missing) | planned | planned |
| FR-ADM-340 | Must | FR-ADM-004 | — | `product-table.tsx` | planned | planned |
| FR-ADM-400 | Must | FR-ADM-005 | — | `apps/web/src/components/admin/category-table.tsx` | planned | planned |
| FR-ADM-500 | Won't | FR-ADM-007 | ADR-002 | — | — | deferred |
| FR-ADM-710 | Must | FR-ADM-008, guide F-02 | — | `product-table.tsx`, `category-table.tsx` | planned (inspection) | partial |
| FR-ADM-720 | Must | guide §5 | — | `apps/web/src/components/admin/ui.tsx` | planned | planned |
| FR-ADM-730 | Should | FR-ADM-008 | — | `ui.tsx` | planned (inspection) | inspection pending |
| FR-SET-110 | Must | FR-SET-001 | ADR-002, ADR-011 | `supabase/migrations/20260716154417_init_schema.sql` | planned (inspection) | inspection pending |
| FR-SET-120 | Must | FR-SET-002 | ADR-002 | `supabase/migrations/20260716154422_seed_system_settings.sql` | planned | planned |
| FR-SET-130 | Must | FR-SET-003 | ADR-005 | `supabase/migrations/20260716154420_rls_policies.sql` | planned | planned |
| FR-SET-140 | Won't | FR-SET-006 | — | — | — | deferred |
| FR-SET-210 | Must | FR-SET-004, FR-ORD-008 | ADR-002 | (no order route) | planned | partial |
| FR-SET-220 | Must | RLS review | ADR-002, ADR-005 | `rls_policies.sql`, `20260719104500_table_grants.sql` | planned | unknown |
| FR-ORD-110 | Won't | FR-ORD-001 | ADR-002 | — | — | deferred |
| FR-ORD-120 | Won't | FR-ORD-002 | ADR-002 | `init_schema.sql` | — | deferred |
| FR-ORD-130 | Won't | FR-ORD-003 | ADR-002 | `init_schema.sql` | — | deferred |
| FR-ORD-140 | Won't | FR-ORD-004 | ADR-002 | `init_schema.sql` | — | deferred |
| FR-ORD-210 | Won't | FR-ORD-005 | ADR-002 | `rls_policies.sql` | — | deferred |
| FR-ORD-220 | Won't | FR-ORD-006 | ADR-002 | `init_schema.sql` | — | deferred |
| FR-ORD-300 | Won't | FR-ORD-007 | ADR-002 | `rls_policies.sql` | — | deferred |
| NFR-SEO-110 | Must | NFR-SEO-001 | ADR-006 | `apps/web/src/app/products/[slug]/page.tsx` | planned | planned |
| NFR-SEO-120 | Must | NFR-SEO-002 | ADR-006 | `[slug]/page.tsx` | planned | planned |
| NFR-SEO-130 | Must | NFR-SEO-003 | ADR-006 | `[slug]/page.tsx` | planned | planned |
| NFR-SEO-140 | Must | NFR-SEO-004 | ADR-006 | `(list)/page.tsx`, `[slug]/page.tsx` | planned | partial |
| NFR-SEO-210 | Must | NFR-SEO-005 | ADR-006 | `apps/web/src/app/sitemap.ts` | planned | planned |
| NFR-SEO-220 | Must | NFR-SEO-006 | — | `apps/web/src/app/robots.ts` | planned (inspection) | inspection pending |
| NFR-SEO-310 | Must | NFR-SEO-007 | ADR-006 | server components | planned | planned |
| NFR-SEO-320 | Must | NFR-SEO-008 | — | `slug.ts` | planned (inspection) | inspection pending |
| NFR-SEO-330 | Must | NFR-SEO-009 | — | `product-gallery.tsx`, `product-card.tsx` | planned | partial |
| NFR-SEO-340 | Should | code, F-05 | — | `[slug]/page.tsx:83–86` | planned | partial |
| NFR-SEO-400 | Must | 01-vision §8, G3 | — | — | planned (perf protocol) | unknown |
| FR-INTRO-110 | Must | FR-3D-001/008 | D-08, ADR-006 | `apps/web/src/components/intro/hero-intro.tsx` | planned | not executed |
| FR-INTRO-120 | Must | FR-3D-002 | D-04, D-08 | `intro-scene.tsx`, `intro-config.ts` | planned | not executed |
| FR-INTRO-130 | Must | FR-3D-003 | D-08 | `intro-config.ts` `ARC` | planned | not executed |
| FR-INTRO-140 | Must | FR-3D-003, D-08 | D-08 | — (prototype C `intro.js`) | planned | not implemented |
| FR-INTRO-150 | Must | FR-3D-003, D-08 | D-08 | — (prototype C) | planned | not implemented |
| FR-INTRO-160 | Must | FR-3D-004 | D-08 | `hero-intro.tsx` | planned | not executed |
| FR-INTRO-170 | Must | WF-HERO-05 | D-08 | `hero-intro.tsx` `goTo('morph')` | planned | not executed |
| FR-INTRO-210 | Must | FR-3D-005, M2 NFR-02 | — | `hero-intro.tsx` | planned | not executed |
| FR-INTRO-220 | Must | F-06, NFR-ACC-002 | — | — | planned | not implemented |
| FR-INTRO-230 | Must | FR-3D-007, NFR-ACC-004, v1.0 NFR-02, M2 NFR-02 | — | `hero-intro.tsx:72` | planned | not executed |
| FR-INTRO-240 | Must | F-06 | — | — | planned | not implemented |
| FR-INTRO-250 | Should | F-06, WCAG 4.1.3 | — | — | planned | not implemented |
| FR-INTRO-260 | Must | WF-INTRO-09, v1.0 FR-15 | — | `hero-intro.tsx:118` | planned | not executed |
| FR-INTRO-310 | Must | v1.0 FR-15, M2 NFR-02 | ADR-001 | `intro-config.ts:13`, `deity.tsx` | planned | not executed |
| FR-INTRO-320 | Must | FR-3D-006, v1.0 FR-15 | — | `hero-intro.tsx:26`, `static-hero.tsx` | planned | not executed |
| FR-INTRO-330 | Must | v1.0 FR-15 gap | — | — | planned | not implemented |
| FR-INTRO-340 | Must | NFR-PERF-005 | — | `intro-config.ts` `LOADING_MS` | planned | not executed |
| FR-INTRO-350 | Could | FR-3D-006 | — | — | planned | not implemented |
| FR-MOB-110 | Won't | FR-MOB-002 | ADR-004 | `apps/mobile/app/products/index.tsx` | planned | not executed |
| FR-MOB-120 | Won't | FR-MOB-003 | ADR-004 | `apps/mobile/app/products/[slug].tsx` | planned | not executed |
| FR-MOB-130 | Won't | FR-MOB-003/010 | D-07 | — | planned | deferred |
| FR-MOB-310 | Won't | FR-3D-010 | ADR-004, D-08 | — | planned | not implemented |
| FR-MOB-320 | Won't | FR-3D-011 | — | — | planned | not implemented |
| FR-MOB-400 | Won't | FR-MOB-004 | — | — | planned | not implemented |
| FR-MOB-510 | Won't | FR-MOB-005 | ADR-007 | `apps/mobile/lib/api.ts` | planned | not executed |
| FR-MOB-520 | Won't | FR-MOB-006, NFR-REL-005 | — | `apps/mobile/app/products/index.tsx` | planned | not executed |
| FR-MOB-530 | Won't | FR-MOB-007 | — | — | planned | not implemented |
| NFR-PERF-110 | Must | F-08 | — | — | planned | not executed |
| NFR-PERF-120 | Must | F-08 | — | — | planned | not executed |
| NFR-PERF-130 | Must | F-08 | — | — | planned | not executed |
| NFR-PERF-210 | Must | NFR-PERF-001/003, G3 | ADR-006 | — | planned | not measured |
| NFR-PERF-220 | Must | NFR-PERF-002, v1.0 NFR-04, G3 | ADR-006 | — | planned | not measured |
| NFR-PERF-230 | Must | F-09, G3 | — | — | planned | not measured |
| NFR-PERF-240 | Should | F-09 | — | — | planned | not measured |
| NFR-PERF-310 | Must | FR-3D-009, NFR-PERF-005 | ADR-001 | `intro-config.ts` | planned | not executed |
| NFR-PERF-320 | Must | F-09 | — | `hero-intro.tsx:21` | planned | not executed |
| NFR-PERF-330 | Must | F-09 | D-08 | `apps/web/src/app/layout.tsx` | planned | not implemented |
| NFR-PERF-340 | Could | guide §4 | — | — | planned | not measured |
| NFR-PERF-410 | Must | NFR-PERF-007, F-07 | — | `products/(list)/page.tsx:89`, `product-gallery.tsx:29` | planned | not executed |
| NFR-PERF-420 | Must | NFR-PERF-007 | — | `product-card.tsx` | planned | not executed |
| NFR-PERF-430 | Must | F-09 | — | `components/public/*` | planned | not executed |
| NFR-PERF-440 | Should | NFR-PERF-006 | — | `next.config.ts` | planned | not executed |
| NFR-PERF-450 | Must | NFR-SCA-004 | ADR-005 | `next.config.ts` | planned | not executed |
| NFR-PERF-510 | Should | NFR-PERF-004 | ADR-003 | `backend/api/src/controllers` | planned | not measured |
| NFR-PERF-520 | Should | NFR-PERF-008 | — | — | planned | not implemented |
| NFR-PERF-610 | Must | NFR-SCA-001 | ADR-007 | `backend/api/src` | planned (inspection) | not executed |
| NFR-USE-110 | Must | NFR-ACC-001 | — | `apps/web/src` | planned | not checked |
| NFR-USE-120 | Must | NFR-ACC-002 | — | `apps/web/src` | planned | not checked |
| NFR-USE-130 | Must | NFR-ACC-003 | D-08 | `globals.css` | planned | not checked |
| NFR-USE-140 | Must | F-09, guide L7 | — | — | planned | not implemented |
| NFR-USE-150 | Must | NFR-ACC-005 | — | `components/public/*` | planned | not checked |
| NFR-USE-160 | Must | G3 | — | — | planned | not measured |
| NFR-USE-170 | Must | NFR-ACC-004 | — | `globals.css:67` | planned | not executed |
| NFR-USE-180 | Should | guide §3 | — | — | planned | not checked |
| NFR-USE-210 | Must | D-05 | — | `layout.tsx:13` | planned (inspection) | not executed |
| NFR-USE-220 | Must | guide §2 | — | `apps/web/src` | planned | not checked |
| NFR-USE-230 | Should | WCAG 2.5.5 | — | — | planned | not checked |
| NFR-USE-310 | Should | G1 | — | — | planned (usability protocol) | not measured |
| NFR-USE-320 | Should | G2 | — | — | planned (usability protocol) | not measured |
| NFR-MAINT-110 | Must | NFR-MAIN-001 | ADR-003, ADR-007 | `backend/api/src` | planned (inspection) | not executed |
| NFR-MAINT-120 | Must | NFR-MAIN-002 | ADR-008 | `*/package.json` `lint` | CI `pnpm lint` | not executed this review |
| NFR-MAINT-130 | Must | NFR-MAIN-003 | ADR-008 | `packages/validation-schemas` | planned (inspection) | not executed |
| NFR-MAINT-140 | Must | NFR-SCA-002 | ADR-005 | `supabase/migrations/20260716154417_init_schema.sql` | planned (inspection) | not executed |
| NFR-MAINT-150 | Must | NFR-SCA-003 | ADR-002 | `backend/api/src/services/settings.service.ts` | planned | not executed |
| NFR-MAINT-210 | Should | NFR-MAIN-004 | — | git history | planned | failing (known) |
| NFR-MAINT-220 | Must | NFR-MAIN-007 | ADR-011 | `supabase/migrations/` | planned | not executed |
| NFR-MAINT-230 | Must | NFR-MAIN-008 | — | `.env.example` | planned | not checked |
| NFR-MAINT-310 | Must | NFR-MAIN-005 | ADR-010 | `.github/workflows/*.yml` | planned (inspection) | not executed |
| NFR-MAINT-320 | Must | v1.0 NFR-03, M2 NFR-03 | ADR-011 | `.github/workflows/api-deploy.yml` | `backend/api/tests/*.integration.test.ts` (self-skip) | gap |
| NFR-MAINT-330 | Must | v1.0 NFR-03 | — | `.github/workflows/web-deploy.yml` | planned | not implemented |
| NFR-MAINT-410 | Should | D-08, F-10 | D-08 | `apps/web/src/app/globals.css` | planned | not implemented |
| NFR-MAINT-420 | Should | F-10 | — | `globals.css` | planned | not implemented |
| NFR-MAINT-430 | Should | F-10 | D-08 | — | planned | not implemented |
| NFR-MAINT-440 | Should | F-12 | — | `apps/web/src/components/public` | planned | not implemented |
| NFR-MAINT-450 | Must | G4 | — | `docs/requirements/traceability-v2.md` | planned (analysis) | not executed |
| NFR-MAINT-610 | Won't | FR-MOB-008 | — | `apps/mobile/lib/auth-store.ts` | planned (inspection) | not executed |
| NFR-MAINT-620 | Won't | FR-MOB-009 | — | `apps/mobile/lib/api.ts` | planned (inspection) | not executed |
| NFR-COMP-100 | Must | NFR-COM-001 | — | — | planned | not checked |
| NFR-COMP-200 | Must | NFR-COM-002 | D-08 | — | planned | not checked (production) |
| NFR-COMP-310 | Won't | NFR-COM-003, FR-MOB-001 | ADR-004 | `apps/mobile/package.json` | planned | not checked |
| NFR-COMP-320 | Won't | NFR-COM-004, FR-MOB-001 | ADR-004 | `apps/mobile/package.json` | planned | not checked |
| NFR-COMP-410 | Must | NFR-COM-005 | ADR-003 | `backend/api/src` | planned | not checked |
| NFR-COMP-420 | Must | NFR-COM-006 | — | `backend/api/src` | planned | not checked |
| NFR-COMP-500 | Must | FR-3D-006 | — | `hero-intro.tsx:26` | planned | not executed |
| NFR-PORT-110 | Must | NFR-MAIN-006 | ADR-009 | `backend/api/Dockerfile` | CI `docker-build` | not executed this review |
| NFR-PORT-120 | Should | ADR-011 | ADR-011 | — | planned | not checked |
| NFR-PORT-130 | Must | NFR-MAIN-008 | — | `next.config.ts` | planned (inspection) | not checked |
| NFR-PORT-140 | Must | 01-vision §8, G1 | ADR-006 | `.github/workflows/web-deploy.yml` | planned | not executed |
| NFR-PORT-150 | Won't | ADR-010 | ADR-010 | `.github/workflows/mobile-build.yml` | planned (inspection) | not executed |
