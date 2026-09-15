# Traceability Matrix

**Nogoolin · M2 / US-2.3 · v0.1 · 2026-09-15**

Доорх нь яг 8 баганатай, 5 мөртэй. Last-Reviewed нь баримт/кодыг уншсан огноо; тест ажиллуулсан огноо биш. Owner нь Тэнгис (хөгжүүлэгч, баримт бичигч). Бүх шаардлага draft, stakeholder interview хийгдээгүй.

| ID | Source | Owner | Verification | Dependency | Risk | Status | Last-Reviewed |
|---|---|---|---|---|---|---|---|
| [FR-01](requirements.md#fr-01) | [FR-INQ-001…003](../phase-0/02-requirements.md); [schema](../../packages/validation-schemas/src/inquiry.schema.ts); [controller](../../backend/api/src/controllers/inquiry.controller.ts) | Тэнгис | Test: T-01; [тестийн эх](../../backend/api/tests/inquiry-cart.integration.test.ts) | Бүтээгдэхүүн, local DB, validation, rate limit | Email/message-ийн хуучин баримтын зөрүү; давхардсан илгээлт | Draft; runtime pending | 2026-09-15 |
| [FR-02](requirements.md#fr-02) | [cart controller](../../backend/api/src/controllers/cart.controller.ts); [migration](../../supabase/migrations/20260726120000_inquiry_customer_and_cart.sql) | Тэнгис | Test: T-02; [тестийн эх](../../backend/api/tests/inquiry-cart.integration.test.ts) | Auth, published product, unique pair, NFR-01 | Wishlist-ийг checkout-тай андуурах | Draft; runtime pending | 2026-09-15 |
| [NFR-01](requirements.md#nfr-01) | [W1 persona P1](../ICSI405/sem1/wiki/02_audience_persona.md) → [P-NG-01](../ICSI405/sem2/wiki/persona-and-pivot.md#p-ng-01--session-ба-өгөгдөл-эзэмших-эрхийг-ялгах); [08 §9](../phase-0/08-security.md#9-idor-prevention); [cart repo](../../backend/api/src/repositories/supabase/cart.repository.ts); [inquiry repo](../../backend/api/src/repositories/supabase/inquiry.repository.ts) | Тэнгис | Inspection: I-01; A/B runtime нэмэлт | Session identity, ownership filter, RLS, RBAC | Өөр хүний мэдээлэл алдагдах; W1 холбооны зөвшөөрөл pending | Draft; partial inspection | 2026-09-15 |
| [NFR-02](requirements.md#nfr-02) | [P-NG-02](../ICSI405/sem2/wiki/persona-and-pivot.md#p-ng-02--asset-бэлэн-бус-үед-урсгалыг-шалгах); [wireframes](../phase-0/07-uiux-wireframes.md); [hero](../../apps/web/src/components/intro/hero-intro.tsx) | Тэнгис | Test: T-03; browser evidence pending | Hero, fallback, catalog route | Asset байхгүйгээс хэрэглэгч каталогт хүрэхгүй | Draft; runtime pending | 2026-09-15 |
| [NFR-03](requirements.md#nfr-03) | [W1 P3](../ICSI405/sem1/wiki/02_audience_persona.md) → [P-NG-03](../ICSI405/sem2/wiki/persona-and-pivot.md#p-ng-03--хуучин-заавар-ба-бодит-орчин-зөрөх); [09 deployment](../phase-0/09-deployment.md); [workflow](../../.github/workflows/api-deploy.yml); [skip branch](../../backend/api/tests/inquiry-cart.integration.test.ts) | Тэнгис | Inspection: I-02; CI negative-case logs pending | Local DB in CI, test exit status, Docker build | Бүх тест skip боловч deploy eligible болох | Gap; planned (W09) | 2026-09-15 |

## Эх сурвалжийн үнэн зөв байдал

W1-ийн P1 нь cookie/session асуудал бөгөөд IDOR биш. NFR-01 рүү холбосон нь Week 2-т нэмсэн, тайлбарласан шинэ хэрэглээ. W1 P3-ийн local/pipeline ялгаанаас NFR-03-ийн тестийн орчны эрсдэлийг гаргасан. Багш эдгээр холбоог зөвшөөрсөн гэж үзээгүй; [peer-review draft](../ICSI405/sem2/wiki/peer-review-draft.md)-д шалгуулах асуулт бий. Ярилцлагын source зохиогоогүй.

## Шинэчлэх дүрэм

Шаардлага өөрчлөгдвөл ID-г хадгалж, эх холбоос, verification-ийн pass/fail, dependency, risk, status, огноог хамтад нь шинэчилнэ. Тестийн run URL/log нэмсний дараа л verification status-ийг verified болгоно. Confluence-ийн Requirements хэсэгт энэ файлын GitHub permalink-ийг оруулахад бэлэн; хэрэглэгчийн заавраар нийтлэлт/submission-ийг алгассан, remote commit хийгээгүй.
