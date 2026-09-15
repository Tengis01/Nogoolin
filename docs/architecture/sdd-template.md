# SDD Template — Nogoolin

**ICSI405 / M2 · Тэнгис · 2026-09-15 · v0.1 / draft**

## 1. Зорилго ба шаардлагын холбоо

Энэ SDD нь [таван шаардлагыг](../requirements/requirements.md) хэрэгжүүлэх бүтэц, технологийг тайлбарлана. M2-д одоогийн кодоос үндсэн бүтэц, design decision, gap-ийг тогтоов; arc42-ийн дэлгэрэнгүй W4, OpenAPI W5, диаграм W8-д төлөвлөгдсөн. SRS нь хэрэглэгчийн авах үр дүн, SDD нь түүнийг хэрэгжүүлэх арга.

## 2. Системийн орчин ба бүрэлдэхүүн

| Бүрэлдэхүүн | Шийдвэр / бодит байршил | Холбогдох шаардлага |
|---|---|---|
| Web + admin | Next.js/TypeScript; `apps/web`; inquiry, wishlist, profile, admin inbox | FR-01/02, NFR-01/02 |
| API | Fastify/TypeScript; `backend/api`; `/api/v1`, local port 3001 | FR-01/02, NFR-01 |
| Өгөгдөл/Auth | Supabase local PostgreSQL/Auth/Storage; `supabase/migrations` | FR-01/02, NFR-01 |
| Shared validation | Zod; `packages/validation-schemas` | FR-01/02 |
| Hero | Three.js/R3F; `apps/web/src/components/intro` | NFR-02 |
| Build/CI | pnpm workspaces, Docker, `.github/workflows/api-deploy.yml` | NFR-03 |

**Шийдвэрийн эх:** [ADR-003/004/005/006/007/008/011](../../agent-context/DECISIONS.md). Mobile нь React Native + Expo prebuild/dev client; энэ M2 багц mobile inquiry/wishlist-ийг дууссан гэж үзэхгүй. Railway/Vercel/cloud Supabase нь Phase 6-ын байршуулалтын зорилт, одоо ажиллаж буй production орчин гэж батлаагүй.

## 3. Backend-ийн дотоод бүтэц

Controller → Service → Repository. Controller нь request/response ба validation hook; service нь бизнесийн дүрэм; repository нь өгөгдөлд хүрэх кодыг хариуцна. Auth hook хэрэглэгчийн session-ийг тогтооно. Бизнесийн логикийг route руу, DB query-г service рүү холихгүй.

**FR-01:** inquiry controller → inquiry service → inquiry repository → `inquiries`. **FR-02:** cart controller → cart service → cart repository → `cart_items`. Shared schema-г web/API нэг эхээс хэрэглэнэ; client validation нь server validation-ийг орлохгүй.

## 4. Өгөгдөл ба эрхийн дизайн

`inquiries.customer_id` нь нэвтэрсэн илгээгчийг заана, guest-д null; шинэ асуулгын төлөв `new`. `cart_items` нь `(user_id, product_id)` unique хостой. Нэмэх үйлдлийг давтахад нэг бичлэг хэвээр; хасах нь давтаж дуудаж болох үйлдэл. Эх: [20260726120000 migration](../../supabase/migrations/20260726120000_inquiry_customer_and_cart.sql), [cart repository](../../backend/api/src/repositories/supabase/cart.repository.ts), [inquiry repository](../../backend/api/src/repositories/supabase/inquiry.repository.ts).

**NFR-01:** customer ID-г request body-оос авахгүй, баталгаажсан session-ээс дамжуулна. Cart read/delete нь `.eq('user_id', userId)`, inquiry mine нь `.eq('customer_id', customerId)`; insert session-ийн ID онооно. RLS нь DB түвшний хамгаалалт, admin scope нь RBAC шалгалттай. Бүх query-д нэг ижил `user_id` шүүлтүүр шаардахгүй: public catalog, guest create, admin ажиллагаа тус тусын эрхийн дүрэмтэй.

## 5. Гадаад интерфэйс ба contract gap

[Phase 0 OpenAPI](../phase-0/06-api-spec.yaml) нь эх contract. Код дахь `/cart` болон `/inquiries/mine`, customer ownership болон admin filter нэмэлтүүдийг W5-д тулган шинэчилнэ. Inquiry нь email field-гүй; UI wireframe-ийн хуучин email мөрийг хэрэгжилттэй ижил гэж үзэхгүй. `INQ-YYYY-NNNN` нь UI-ийн derived display утга бөгөөд дараалсан захиалгын дугаар биш.

## 6. Hero fallback-ийн дизайн

GLB URL тохируулаагүй үед `deity.tsx` геометр орлуулагч сонгоно. `hero-intro.tsx` нь WebGL/reduced-motion-оор static home төлөв сонгож, skip/catalog холбоосыг DOM дээр харуулна. Бодит asset-ийг [ASSET_SPECS](../../agent-context/ASSET_SPECS.md)-ийн дагуу дараа солино. Алдаатай GLB URL-ийн error boundary/recovery-г энэ draft баталгаажаагүй gap гэж тэмдэглэв. Product 360° viewer нь D-07-оор post-MVP; нүүрний intro-оос тусдаа.

## 7. Build, deploy ба verification

API Dockerfile нь multi-stage build, non-root runtime ашигладаг. Одоогийн CI dependency нь `lint-and-test → docker-build → deploy`. [Тестийн эх](../../backend/api/tests/inquiry-cart.integration.test.ts) DB хүрэхгүй үед skip хийдэг; workflow local Supabase бэлтгэхгүй тул NFR-03-ын all-skipped хаалт хангагдаагүй. W9-д CI DB setup, skip-fails-CI нөхцөл, гурван сөрөг шалгалтын log төлөвлөсөн. Production auto-deploy нь энэ хаалтыг тойрохгүй байх тохиргоог Phase 6-д шалгана.

Энэ task-аар код, DB migration, CI-ийн ажиллагааг өөрчлөөгүй; шинэ runtime/build тест ажиллуулаагүй. [PROGRESS](../../agent-context/PROGRESS.md)-ийн өмнөх тестийн тайлан нь түүхэн тэмдэглэл, одоогийн ажиллуулалтын нотолгоо биш.

## 8. Үргэлжлүүлэн бөглөх хэсгүүд

| Хэсэг | Нөхөх агуулга | Status |
|---|---|---|
| Architecture views | arc42 context, building blocks, runtime, deployment; FR/NFR холбоо | planned (W04) |
| API contracts | cart/history schema ба бодит error/status нийцүүлэлт | planned (W05) |
| Diagrams | C4, ER, inquiry/auth sequence source ба review | planned (W08) |
| Design verification | CI negative-case evidence, Docker build evidence, traceability шинэчлэлт | planned (W09) |

**Эх:** [Phase 0 index](../phase-0/README.md), [шийдвэрүүд](../../agent-context/DECISIONS.md), [SRS](../requirements/srs-template.md), [traceability](../requirements/traceability-matrix.md).
