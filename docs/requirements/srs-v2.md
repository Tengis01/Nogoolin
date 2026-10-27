# Nogoolin Software Requirements Specification v2

**Doc ID:** REQ-01 · **Төрөл:** Developer · **Стандарт:** ISO/IEC/IEEE 29148 бүтэц, NFR-ийн ангилал нь ISO/IEC 25010 · **Хувилбар:** v2.1 draft · **Огноо:** 2026-10-27 (v2.0: 2026-10-18) · **Owner:** Тэнгис

## Баримтын төлөв

| Талбар | Утга |
|---|---|
| Төлөв | draft. Owner review хийгдээгүй. |
| Орлох хувилбарууд | [SRS v1.0](srs-v1.0.md) (15 FR + 5 NFR), [M2-ын 5 шаардлага](requirements.md), [Phase 0 шаардлага](../phase-0/02-requirements.md) (118 FR + 59 NFR). Хуучин ID бүр [ID mapping](id-mapping.md)-д шинэ ID-тай. |
| Үндсэн уншигч | Хөгжүүлэгч, тестер (Тэнгис) |
| Хоёрдогч уншигч | ICSI438 багш, ирээдүйн хөгжүүлэгч, reviewer |
| Хэрэгжилтийн төлөв | 2026-10-18-нд одоогийн кодыг уншиж тогтоосон. Тест ажиллуулаагүй тул «implemented» нь «код байгаа» гэсэн утгатай, «тест давсан» гэсэн үг биш. |
| Review, interview | Хийгдээгүй. Зохиогоогүй. |
| Зорилгын эх | [Төслийн зорилго](../project/project-goals.md) G1–G6, [Roadmap v2](../project/roadmap.md) PH0–PH8 |

## Өөрчлөлтийн түүх

Өмнөх хувилбарын текстийг устгахгүй. Өөрчлөгдсөн шаардлага бүрт «Өмнөх (vX)» мөрөөр хуучин утгыг хадгална.

| Хувилбар | Огноо | Төрөл | Өөрчлөлт |
|---|---|---|---|
| v2.1 | 2026-10-27 | MINOR | D-09: FR-PROD-190 (хэмжээ, жин, материал), FR-PUB-250 (тэдгээрийг харуулах), FR-PUB-260 (хэмжээний шугамын overlay) нэмсэн. FR-PUB-240, FR-MOB-130-ийг 3D GLB viewer-ээс сонгосон бүтээгдэхүүний photo spin болгосон (өмнөх текст тухайн шаардлагад). §7.2, §7.3-ийн тоог шинэчилсэн. |
| v2.0 | 2026-10-18 | MAJOR | Анхны v2: Phase 0, v1.0, M2-ийн шаардлагыг ISO 29148 бүтцээр нэгтгэж, шинэ ID-тай болгосон ([mapping](id-mapping.md)). |

## Агуулга

1. [Оршил](#1-оршил)
2. [Ерөнхий тодорхойлолт](#2-ерөнхий-тодорхойлолт)
3. [Гадаад интерфэйс](#3-гадаад-интерфэйс)
4. [Функциональ шаардлага](#4-функциональ-шаардлага)
5. [Функциональ бус шаардлага](#5-функциональ-бус-шаардлага)
6. [Verification](#6-verification)
7. [Шаардлагын чанарын шалгалт](#7-шаардлагын-чанарын-шалгалт)
8. [Нээлттэй асуултууд](#8-нээлттэй-асуултууд)

Хавсралтууд:
- [Traceability v2](traceability-v2.md)
- [Хуучин → шинэ ID mapping](id-mapping.md)

## 1. Оршил

### 1.1 Зорилго

Энэ SRS нь Nogoolin системийн бүх функциональ болон функциональ бус шаардлагыг нэг газар, нэг дугаарлалтаар тодорхойлно. Энэ нь хэрэгжүүлэлт, тест, review-ийн гэрээ болно. Энд **шаардлага** гэдэг нь нэг, шалгаж болох өгүүлбэр юм. Баримтын бусад төрөл (архитектур, API spec, тест төлөвлөгөө) нь [Document Register](../README.md)-д бүртгэгдэнэ.

### 1.2 Хамрах хүрээ

| Хүрээ | Энэ release (web launch, 2027-01-29) | Дараа (PH8) |
|---|---|---|
| Нийтийн web каталог (Next.js) | ✅ | |
| Click-intro, C дизайн (D-08) | ✅ | |
| Admin panel (`/admin`) | ✅ | |
| Fastify REST API, Supabase | ✅ | |
| Inquiry, wishlist, profile (web) | ✅ | |
| Mobile app (Expo) | | G6, дараагийн release |
| Захиалга, хүргэлт, төлбөр | | `delivery_enabled=false` |
| Бүтээгдэхүүн бүрийн 360° viewer | | D-07 |
| Зургаар хайх, EN хэл | | PH8, D-05 |

Ирээдүйн шаардлагууд бүртгэлд **үлдэнэ**. Тэдгээрийг `Won't (this release)` гэж тэмдэглэнэ. Ингэснээр архитектур тэдгээрийг хаахгүй, ID нь тогтвортой үлдэнэ.

### 1.3 Дугаарлалт ба тэмдэглэгээ

- **ID:**
  - `FR-<AREA>-<NNN>` болон `NFR-<AREA>-<NNN>`.
  - **Сийрэг, шаталсан.** `-100`, `-200`, … нь ерөнхий чадвар. Задлахдаа `-110`, `-120`, дараа нь `-111`.
  - Шинэ шаардлага нэмэхэд дугаар шилжихгүй. 01, 02 гэсэн дараалсан дугаарлалт ашиглахгүй.
- **Modal үг:** **shall** = заавал. **may** = сонголттой (зөвхөн Could шаардлагад).
- **Priority (MoSCoW):** энэ release-ийн хувьд Must / Should / Could / Won't (this release).
- **Phase:** [Roadmap v2](../project/roadmap.md)-ийн PH3–PH8.
- **Status:** implemented / partial / planned / deferred. Кодоос шалгасан ба нэг файлыг иш татна.
- **Verification:** Test / Inspection / Analysis / Demonstration (§6).
- **States:** хэрэглэгчид харагддаг FR-ийн loading, empty, error, success, disabled/busy төлөвүүд. Тус бүрт текст болон дараагийн алхам заана.

### 1.4 Нэр томьёо

| Нэр | Тайлбар |
|---|---|
| Guest | Нэвтрээгүй зочин |
| Customer | Нэвтэрсэн хэрэглэгч (role `customer`) |
| Admin | Каталог болон inquiry удирдах эрхтэй хэрэглэгч (role `admin`) |
| Inquiry | Бүтээгдэхүүний тухай нэр, утас, зурвастай асуулга. Захиалга биш. |
| Wishlist | Нэвтэрсэн хэрэглэгчийн хадгалсан бүтээгдэхүүн. API-д `/cart` гэж нэрлэгдсэн ч checkout биш. |
| Нийтлэгдсэн (published) | Нийтэд харагдах төлөвтэй бүтээгдэхүүн |
| Intro | Нүүрний click-driven 4 алхамт 3D интро (D-08) |
| GLB | Интрогийн 3D загварын файл (Green Tara) |
| Lab / field metric | Lab: хяналттай орчинд хэмжсэн (Lighthouse). Field: бодит хэрэглэгчээс хэмжсэн. |
| S1–S4 | Алдааны түвшин (S1 = critical). [Quality](../README.md#quality--quality)-д тодорхойлогдоно. |

### 1.5 Эх сурвалж

- [Phase 0 шаардлага](../phase-0/02-requirements.md), [use case](../phase-0/03-use-cases.md), [security](../phase-0/08-security.md), [wireframe](../phase-0/07-uiux-wireframes.md)
- [SRS v1.0](srs-v1.0.md), [M2 шаардлага](requirements.md), [Scope Charter](scope-charter.md)
- [Шийдвэрүүд](../../agent-context/DECISIONS.md) ADR-001…011, D-01…D-08
- 2026-10-18-ны одоогийн код
- Owner-ийн vault `00-Vault/ADVANCED-WEB-GUIDE.md` (repo-оос гадуур): UI төлөв, гүйцэтгэлийн хэмжилт, escaping
- ISO/IEC/IEEE 29148:2018, ISO/IEC 25010:2023 (бүтэц, ангиллын лавлагаа)

## 2. Ерөнхий тодорхойлолт

### 2.1 Бүтээгдэхүүний орчин

Nogoolin нь бодит шашны бүтээгдэхүүний дэлгүүрийн каталог платформ юм:
- **Web:** Next.js 15 + React 19 + Tailwind CSS v4 (`apps/web`);
- **API:** Fastify + TypeScript, layered (`backend/api`, `/api/v1`);
- **Өгөгдөл:** Supabase PostgreSQL, Auth, Storage, RLS (`supabase/migrations`);
- **Mobile:** Expo / React Native (`apps/mobile`, дараагийн release).

Web болон mobile нь нэг REST API ашиглана (ADR-007).

### 2.2 Гол үйлдлүүд

- Зочин интрогоор орж нүүр, жагсаалт, хайлт, дэлгэрэнгүй хуудсаар бараа олно.
- Зочин бүртгүүлэлгүй inquiry илгээнэ.
- Customer нэвтэрч wishlist болон inquiry түүхээ харна.
- Admin бүтээгдэхүүн, ангилал, зураг, inquiry, тохиргоог удирдана.

### 2.3 Хэрэглэгч ба сегмент

[Төслийн зорилго §4](../project/project-goals.md#4-сегмент--зорилго--нотлох-ui)-ийг үз:
- **Guest:** олох, мэдээлэл авах.
- **Inquiry хэрэглэгч:** асуух, баталгаа авах.
- **Admin:** удирдах, хариулах.
- **Хөгжүүлэгч:** шалгах.
- **Delivery staff:** ирээдүйн role, PH8.

Шинэ stakeholder interview хийгдээгүй.

### 2.4 Хязгаарлалт

| Хязгаарлалт | Нөлөө |
|---|---|
| Ганц хөгжүүлэгч, семестрийн ачаалал | Хүрээ хатуу. WIP ≤ 2. |
| Free/starter tier (Supabase, Vercel, Railway) | Хэмжээ, connection-ий хязгаартай. Launch-ийн өмнө тооцно (PH7). |
| `delivery_enabled=false` (ADR-002) | Захиалгын бүтэц schema/API-д байж болно, гэхдээ идэвхгүй. |
| D-07 | Бүтээгдэхүүн бүрийн 3D viewer байхгүй. Зөвхөн зургийн gallery. |
| D-08 | Concept C нь үндсэн дизайн. v4 token-ууд шилжилт дуусах хүртэл production-д хүчинтэй. |
| Монгол хэл (D-05) | UI зөвхөн MN. Бүтэц нь i18n-д бэлэн. |
| Нууц утга | Client bundle болон repo-д орохгүй. |

### 2.5 Таамаг ба хамаарал

| Таамаг | Буруу бол |
|---|---|
| Owner бодит фото (≥ 3 / бүтээгдэхүүн) болон GLB-г 2026-12-15 гэхэд өгнө | G1/G3-ийн огноо хойшилно ([R1](../project/project-goals.md#7-таамаг-ба-эрсдэл)) |
| Admin нь энгийн цахим бичиг үсэгтэй | Админы заавар хэрэгтэй болно |
| Хэрэглэгчид гол төлөв mobile browser-оор орно | Responsive web болон mobile perf нь Must хэвээр |
| Launch-д төлбөр шаардлагагүй | Төлбөрийн шаардлага PH8-аас урагшилна |
| Тест local Supabase-тай ажиллана | DB-гүй үед integration тест pass гэж тооцогдохгүй (NFR-MAINT) |

## 3. Гадаад интерфэйс

### 3.1 Хэрэглэгчийн интерфэйс

| Хуудас | Гол элемент |
|---|---|
| Intro / нүүр | 4 алхамт click-intro, skip, Эхлэх; дараа нь hero, ангилал, онцлох бүтээгдэхүүн |
| Жагсаалт `/products` | Ангиллын шүүлтүүр, олон бичигтэй хайлт, карт |
| Дэлгэрэнгүй `/products/[slug]` | Gallery, үнэ, тайлбар, хэрэглэх заавар, inquiry form, wishlist товч |
| Auth | Нэвтрэх, бүртгүүлэх, нууц үг сэргээх/шинэчлэх |
| Profile, wishlist | Inquiry түүх, хадгалсан бүтээгдэхүүн |
| `/admin` | Бүтээгдэхүүн, ангилал, зураг, inquiry inbox, тохиргоо |

Харагдах байдлын эх: [Prototype C](../nogoolin-prototype-c.html) (D-08). Wireframe v2 нь PH2-т гарна.

### 3.2 Программын интерфэйс (`/api/v1`, 2026-10-18-ны код)

| Method, path | Эрх | Зорилго |
|---|---|---|
| `GET /health` | Нийтийн | Health check |
| `GET /categories`, `GET /categories/:slug` | Нийтийн | Ангилал |
| `GET /products`, `GET /products/:slug` | Нийтийн | Нийтлэгдсэн бүтээгдэхүүн, хайлт, шүүлтүүр |
| `GET /settings/public` | Нийтийн | Нийтийн тохиргоо (жишээ нь `delivery_enabled`) |
| `POST /inquiries` | Guest / customer | Inquiry үүсгэх |
| `GET /inquiries/mine` | Customer | Өөрийн inquiry |
| `GET /cart`, `POST /cart`, `DELETE /cart/:productId` | Customer | Wishlist |
| `GET /admin/ping` | Admin | Эрх шалгах |
| `GET/POST /admin/categories`, `PATCH/DELETE /admin/categories/:id` | Admin | Ангиллын CRUD |
| `GET/POST /admin/products`, `PATCH/DELETE /admin/products/:id` | Admin | Бүтээгдэхүүний CRUD (`?hard=`) |
| `POST /admin/products/:id/images`, `PATCH/DELETE /admin/products/:id/images/:imageId` | Admin | Зураг |
| `GET /admin/inquiries`, `PATCH /admin/inquiries/:id/status` | Admin | Inquiry inbox |

Spec-ийн эх нь [Phase 0 OpenAPI](../phase-0/06-api-spec.yaml). Бодит route-уудтай нийцүүлэх ажил PH2-т (API-02).

### 3.3 Харилцаа ба өгөгдлийн формат

- REST, JSON, огноо ISO 8601 UTC.
- Production орчинд HTTPS.
- Нэвтэрсэн урсгал Bearer access token ашиглана. Хэрэглэгчийн ID-г token-оос авна, body/query-гээс авахгүй.

### 3.4 Техник хангамжийн интерфэйс

Тусгай техник хангамж байхгүй. Mouse, touch, keyboard оролт. Интро нь WebGL ашиглана, WebGL байхгүй үед fallback руу шилжинэ.

## 4. Функциональ шаардлага

Блок бүрийн талбаруудыг §1.3-т тайлбарласан. `-100` түвшний блок нь ерөнхий чадварыг илэрхийлнэ: түүний verification нь хүүхэд шаардлагуудаар хийгдэнэ.

### 4.1 Нэвтрэлт ба эрх (FR-AUTH)

#### FR-AUTH-100 — Хэрэглэгчийг баталгаажуулах
**Statement:** Систем admin болон customer хэрэглэгчийг Supabase Auth-аар баталгаажуулж, доорх аргуудаар нэвтрүүлнэ **shall**.
- **Rationale:** Admin нь каталог болон inbox-ийг (G1, G2), customer нь түүх болон wishlist-ийг (G2) ашиглахын тулд нэвтрэх шаардлагатай.
- **Source:** Phase0 FR-AUTH-001…004, 007; ADR-005
- **Priority · Phase · Status:** Must · PH3 · implemented (children-оос харах)
- **Verification:** children

#### FR-AUTH-110 — Email ба нууц үгээр нэвтрэх
**Statement:** Бүртгэлтэй хэрэглэгч (admin эсвэл customer) зөв email болон нууц үг оруулахад систем session үүсгэж, `next` параметр байвал тэр хаяг руу, байхгүй бол нүүр хуудас руу шилжүүлнэ **shall**.
- **Rationale:** Нэвтрэх үндсэн арга. OAuth тохируулаагүй орчинд ч ажиллана.
- **Source:** Phase0 FR-AUTH-001 (зөвхөн admin гэж бичсэн; одоогийн кодод customer ч мөн ашигладаг); code `apps/web/src/app/login/page.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented (`apps/web/src/app/login/page.tsx`)
- **Verification:** Test — зөв, буруу нууц үгтэй хоёр нэвтрэлт, `next=/wishlist`-тэй нэг нэвтрэлт хийнэ.
- **Acceptance:**
  1. Зөв мэдээлэлтэй үед session cookie үүсч, `next` хаяг нээгдэнэ.
  2. Буруу нууц үг оруулахад session үүсэхгүй, Монгол алдааны мессеж гарна.
- **States:**
  - busy: илгээх товч идэвхгүй, «Нэвтэрч байна…»;
  - error: «Email эсвэл нууц үг буруу», дараагийн алхам нь «Нууц үг сэргээх» холбоос;
  - success: шилжүүлэлт.

#### FR-AUTH-120 — Google OAuth нэвтрэлт
**Statement:** Google provider тохируулагдсан үед систем «Google-ээр нэвтрэх» товчоор PKCE OAuth урсгал эхлүүлж, callback-д session үүсгэнэ **shall**. Тохируулаагүй үед товчийг идэвхгүй харуулж тайлбар бичнэ **shall**.
- **Rationale:** Customer-ийн бүртгэлийн саадыг бууруулна (G2).
- **Source:** Phase0 FR-AUTH-002; code `apps/web/src/components/auth/oauth-buttons.tsx`, `apps/web/src/lib/oauth-providers.ts`, `apps/web/src/app/auth/callback/route.ts`
- **Priority · Phase · Status:** Must · PH3 · partial (код бий; production credential PH7-д тохируулна)
- **Verification:** Demonstration — тохируулсан болон тохируулаагүй орчинд login хуудсыг үзүүлнэ.
- **Acceptance:**
  1. Тохируулсан үед OAuth нэвтрэлт хийгдээд `/auth/callback`-аас session-тэй буцна.
  2. Тохируулаагүй үед товч `disabled` төлөвтэй, тайлбартай байна. Дарахад алдаа гарахгүй.
- **States:**
  - disabled: «Тохируулагдаагүй» тайлбар;
  - error: callback алдаа гарвал login хуудсанд Монгол мессеж харуулна.

#### FR-AUTH-130 — Facebook OAuth нэвтрэлт
**Statement:** Facebook provider тохируулагдсан үед систем FR-AUTH-120-тэй ижил урсгалаар Facebook нэвтрэлтийг санал болгоно **may**.
- **Rationale:** Нэмэлт суваг. Монгол хэрэглэгчид Facebook-ийг өргөн ашигладаг.
- **Source:** Phase0 FR-AUTH-003 (S); code `apps/web/src/components/auth/oauth-buttons.tsx`
- **Priority · Phase · Status:** Could · PH7 · partial (UI бий; credential тохируулаагүй)
- **Verification:** Demonstration — FR-AUTH-120-тэй ижил.
- **Acceptance:** Тохируулсан үед нэвтрэлт session үүсгэнэ. Тохируулаагүй үед товч идэвхгүй байна.
- **States:** disabled / error нь FR-AUTH-120-тэй ижил.

#### FR-AUTH-140 — OAuth-д PKCE хэрэглэх
**Statement:** Систем бүх OAuth нэвтрэлтэд PKCE (code verifier + challenge) урсгалыг хэрэглэнэ **shall**. Implicit flow хэрэглэхгүй.
- **Rationale:** Authorization code-ийг хулгайлах эрсдэлийг бууруулна.
- **Source:** Phase0 FR-AUTH-004; docs/phase-0/08-security.md §5.6; code `apps/web/src/components/auth/oauth-buttons.tsx` (`signInWithOAuth`, `@supabase/ssr`)
- **Priority · Phase · Status:** Must · PH3 · implemented (`apps/web/src/app/auth/callback/route.ts`)
- **Verification:** Inspection — OAuth redirect URL-д `code_challenge` байгаа, callback нь `exchangeCodeForSession` хийдэг эсэхийг шалгана.
- **Acceptance:** Redirect URL-д `code_challenge_method=S256` байна. URL fragment-д access token ирэхгүй.

#### FR-AUTH-150 — Customer бүртгүүлэх ба нууц үг сэргээх
**Statement:** Зочин email болон нууц үгээр customer бүртгэл үүсгэж, нууц үгээ мартсан бол email-ээр сэргээх холбоос авч шинэ нууц үг тохируулна **shall**.
- **Rationale:** Түүх болон wishlist ашиглах customer-т бүртгэл шаардлагатай (G2).
- **Source:** code `apps/web/src/app/signup/page.tsx`, `reset-password/page.tsx`, `update-password/page.tsx`. Phase 0-д тусдаа FR байгаагүй, кодоос сэргээн тодорхойлов.
- **Priority · Phase · Status:** Must · PH3 · implemented (`apps/web/src/app/signup/page.tsx`)
- **Verification:** Test — local Supabase-ийн Inbucket ашиглан signup → баталгаажуулах → reset → update урсгалыг шалгана.
- **Acceptance:**
  1. Signup хийхэд `auth.users` болон `public.users`-д `role=customer` мөр үүснэ.
  2. Reset хүсэлт гаргахад сэргээх email илгээгдэнэ.
  3. Шинэ нууц үгээр нэвтрэлт амжилттай болно.
- **States:**
  - busy: товч идэвхгүй;
  - error: email давхардсан эсвэл нууц үг сул бол талбарын Монгол алдаа;
  - success: «Email-ээ шалгана уу» гэсэн дараагийн алхам.

#### FR-AUTH-160 — Олон provider-ийг нэг бүртгэлд холбох
**Statement:** Нэвтэрсэн хэрэглэгч өөр OAuth provider-ийг өөрийн бүртгэлд холбож, аль ч provider-оор ижил `users.id`-тай нэвтэрнэ **may**.
- **Rationale:** Давхар бүртгэлээс сэргийлнэ. MVP-д зайлшгүй биш.
- **Source:** Phase0 FR-AUTH-007 (S)
- **Priority · Phase · Status:** Could · PH8 · planned (холбох UI/flow байхгүй)
- **Verification:** Test — email-ээр бүртгүүлээд Google холбож, хоёулаагаар нь нэвтрэхэд ижил `users.id` гарахыг шалгана.
- **Acceptance:** Хоёр нэвтрэлтийн `auth.uid()` ижил. `public.users`-д давхар мөр үүсэхгүй.

#### FR-AUTH-200 — Session ба token
**Statement:** Систем амжилттай нэвтрэлт бүрт JWT access token олгож, refresh token-ийг эргүүлж, гарах үед session-ийг хүчингүй болгоно **shall**.
- **Rationale:** Stateless API (ADR-007) нь JWT-д тулгуурладаг.
- **Source:** Phase0 FR-AUTH-005, 006, 011
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-AUTH-210 — JWT access token олгох
**Statement:** Амжилттай нэвтрэлт бүрт систем Supabase-ийн гарын үсэгтэй JWT access token олгоно **shall**. API нь хамгаалагдсан хүсэлт бүрд `Authorization: Bearer`-ийг Supabase Auth-аар шалгана **shall**.
- **Rationale:** API-ийн 3-р давхаргын хамгаалалт (08-security §5.4).
- **Source:** Phase0 FR-AUTH-005; code `backend/api/src/hooks/auth.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/hooks/auth.ts`)
- **Verification:** Test — token-гүй, хүчингүй, хүчинтэй token-оор `/api/v1/cart` дуудна.
- **Acceptance:** Token-гүй болон хүчингүй үед `401 UNAUTHORIZED`. Хүчинтэй үед `200`.

#### FR-AUTH-220 — Refresh token эргүүлэх
**Statement:** Refresh token ашиглагдах бүрт систем шинэ refresh token олгож, хуучныг 10 секундын reuse interval-ээс хойш хүчингүй болгоно **shall**.
- **Rationale:** Хулгайлсан refresh token-ийн ашиглах хугацааг богиносгоно.
- **Source:** Phase0 FR-AUTH-006; NFR-SEC-013 (rotation хэсэг); code `supabase/config.toml:190`
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/config.toml`: `enable_refresh_token_rotation = true`, `refresh_token_reuse_interval = 10`). Cloud тохиргоог PH7-д дахин шалгана.
- **Verification:** Inspection (local + cloud config) ба Test — нэг refresh token-ийг 10 секундээс хойш хоёр дахь удаа ашиглана.
- **Acceptance:** Хоёр дахь ашиглалт алдаа буцааж, session шинэчлэгдэхгүй.

#### FR-AUTH-230 — Гарах
**Statement:** Нэвтэрсэн хэрэглэгч «Гарах» товч дарахад систем session-ийг дуусгаж, cookie-г цэвэрлээд нүүр хуудас эсвэл login руу шилжүүлнэ **shall**.
- **Rationale:** Хуваалцсан төхөөрөмж дээр admin эрхийг хамгаална.
- **Source:** Phase0 FR-AUTH-011 (admin гэж бичсэн; одоо бүх хэрэглэгчид хамаарна); code `apps/web/src/components/auth/signout-button.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented (`apps/web/src/components/auth/signout-button.tsx`)
- **Verification:** Test — гарсны дараа `/profile` нээнэ.
- **Acceptance:** Гарсны дараа `/profile` нь `/login?next=/profile` руу шилжүүлнэ. Хуучин access token-оор `/api/v1/cart` дуудахад token дуусах хүртэл хүчинтэй хэвээр байдгийг баримтжуулна. Энэ нь JWT-ийн хязгаар бөгөөд NFR-SEC-330-аар 15 минутаар хязгаарлагдана.
- **States:** busy: товч идэвхгүй; error: сүлжээний алдаа гарвал мессеж харуулж, дахин оролдох боломж өгнө.

#### FR-AUTH-300 — Эрхийн загвар (RBAC)
**Statement:** Систем `guest`, `customer`, `admin` эрхээр хандалтыг хязгаарлана **shall**.
- **Rationale:** Admin үйлдлийг хамгаалах (G1).
- **Source:** Phase0 FR-AUTH-008…010
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-AUTH-310 — Эрхийн утгууд
**Statement:** Систем `user_role` утгуудыг `customer`, `admin`, `delivery_staff` болгон хадгална **shall**. `guest` нь нэвтрээгүй төлөв бөгөөд DB-д мөргүй. `delivery_staff` нь ORD (PH8) хүртэл нөөцөлсөн бөгөөд ямар ч route эрх өгөхгүй **shall**.
- **Rationale:** Ирээдүйн хүргэлтийг refactor-гүй нэмэх (ADR-002).
- **Source:** Phase0 FR-AUTH-008; code `supabase/migrations/20260716154417_init_schema.sql:9`
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/migrations/20260716154417_init_schema.sql`)
- **Verification:** Inspection — enum болон `requireAdmin`-ийг шалгана. `delivery_staff`-д тусгай scope байхгүй эсэхийг шалгана.
- **Acceptance:** Enum нь яг 3 утгатай. `delivery_staff` эрхтэй хэрэглэгч `/api/v1/admin/*`-д `403` авна.

#### FR-AUTH-320 — Admin API хамгаалалт
**Statement:** `/api/v1/admin/*` route бүрд token-гүй хүсэлтэд `401`, admin биш нэвтэрсэн хэрэглэгчид `403`-ийг handler ажиллахаас өмнө буцаана **shall**.
- **Rationale:** Admin өгөгдлийг хамгаална.
- **Source:** Phase0 FR-AUTH-009; code `backend/api/src/app.ts` (admin scope `requireAuth` + `requireAdmin`)
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/hooks/auth.ts`)
- **Verification:** Test — admin route бүрийг anon, customer, admin-аар дуудна.
- **Acceptance:** anon → `401`, customer → `403`, admin → `2xx`/`4xx` (business). Хариу нь `{error, code}` хэлбэртэй.

#### FR-AUTH-330 — Web admin хэсгийг хамгаалах
**Statement:** `/admin` болон түүний доорх хуудсыг нээхэд session байхгүй бол систем `/login?next=/admin…` руу, `role≠admin` бол admin биш хуудас руу server талд шилжүүлнэ **shall**.
- **Rationale:** UI түвшинд admin гадаргууг ил гаргахгүй (API хамгаалалтыг орлохгүй).
- **Source:** code `apps/web/src/app/admin/layout.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented (`apps/web/src/app/admin/layout.tsx`)
- **Verification:** Test — anon болон customer-ээр `/admin/products` нээнэ.
- **Acceptance:** Хоёр нөхцөлд admin контент render хийгдэхгүй, redirect хийгдэнэ.

#### FR-AUTH-340 — Шинэ auth хэрэглэгчийн профайл мөр
**Statement:** `auth.users`-д шинэ хэрэглэгч (email эсвэл OAuth) үүсэхэд DB trigger нь `public.users`-д ижил `id`, `email`, `full_name`, `role=customer` мөрийг автоматаар үүсгэнэ **shall**.
- **Rationale:** API нь эрхийг `public.users`-ээс уншдаг.
- **Source:** Phase0 FR-AUTH-010; code `supabase/migrations/20260716154420_rls_policies.sql:30-53` (`handle_new_user`)
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/migrations/20260716154420_rls_policies.sql`)
- **Verification:** Test — signup хийсний дараа `public.users`-ээс тухайн мөрийг уншина.
- **Acceptance:** Яг нэг мөр үүсэх ба `role=customer` байна.

### 4.2 Хэрэглэгч ба профайл (FR-USER)

#### FR-USER-100 — Өөрийн профайл
**Statement:** Систем хэрэглэгч бүрийн профайлыг хадгалж, эзэнд нь өөрийнхийг нь л харах, засах боломж олгоно **shall**.
- **Rationale:** Inquiry-ийн нэрийг урьдчилан бөглөх болон түүх харахад ашиглана (G2).
- **Source:** Phase0 FR-USER-001, 002, 005
- **Priority · Phase · Status:** Must · PH4 · implemented
- **Verification:** children

#### FR-USER-110 — Профайлын өгөгдөл
**Statement:** Систем хэрэглэгч бүрт `id`, `email`, `full_name`, `role`, `created_at`, `updated_at` талбарыг хадгалж, засвар бүрт `updated_at`-ийг автоматаар шинэчилнэ **shall**.
- **Rationale:** ER загвар (04 §3.1).
- **Source:** Phase0 FR-USER-001; code `supabase/migrations/20260716154417_init_schema.sql:29-40`
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/migrations/20260716154417_init_schema.sql`)
- **Verification:** Inspection — schema болон `users_set_updated_at` trigger-ийг шалгана.
- **Acceptance:** 6 багана бүгд `not null` (`full_name`-аас бусад). Update хийсний дараа `updated_at` өөрчлөгдсөн байна.

#### FR-USER-120 — Нэрээ засах
**Statement:** Нэвтэрсэн хэрэглэгч `/profile` хуудсанд `full_name`-ээ 1–100 тэмдэгтээр засаж хадгалахад систем шинэ нэрийг хадгалж, гарчигт шууд харуулна **shall**.
- **Rationale:** Inquiry-ийн урьдчилан бөглөлтөд зөв нэр ашиглагдана.
- **Source:** Phase0 FR-USER-002 (S); code `apps/web/src/components/public/profile-form.tsx`
- **Priority · Phase · Status:** Should · PH4 · implemented (`apps/web/src/components/public/profile-form.tsx`). 100 тэмдэгтийн дээд хязгаарыг кодоос шалгаагүй, REVIEW-г үз.
- **Verification:** Test — хоосон нэр, зөв нэр, хугацаа дууссан session гэсэн гурван нөхцөлөөр шалгана.
- **Acceptance:**
  1. Зөв нэр хадгалагдаж, хуудсыг дахин ачаалахад хэвээр байна.
  2. Хоосон нэрийг хадгалахгүй, талбарын алдаа гарна.
  3. Session дууссан үед «Дахин нэвтэрнэ үү» мессеж гарна.
- **States:**
  - busy: «Хадгалж байна…», товч идэвхгүй;
  - error: «Хадгалж чадсангүй. Дахин оролдоно уу.» / «Сүлжээний алдаа…»;
  - success: «Хадгалагдлаа»;
  - disabled: утга өөрчлөгдөөгүй үед хадгалах товч идэвхгүй.

#### FR-USER-130 — Зөвхөн өөрийн профайлд хандах
**Statement:** Customer зөвхөн өөрийн `public.users` мөрийг уншина **shall**. Өөр хэрэглэгчийн мөр хариунд орохгүй **shall**. Admin бүх мөрийг уншиж болно.
- **Rationale:** Хувийн мэдээллийн нууцлал.
- **Source:** Phase0 FR-USER-005; code `supabase/migrations/20260716154420_rls_policies.sql:56-66` (`users_select_own_or_admin`)
- **Priority · Phase · Status:** Must · PH3 · implemented (RLS). Бичих эрхийн асуудлыг NFR-SEC-350-аас үз.
- **Verification:** Test — A хэрэглэгчийн session-ээр `from('users').select()` дуудна.
- **Acceptance:** Хариунд зөвхөн A-ийн мөр байна.

#### FR-USER-140 — «Миний булан» хуудас
**Statement:** `/profile` хуудас нь нэвтэрсэн хэрэглэгчийн нэр, email, inquiry түүх (FR-INQ-210), хадгалсан бүтээгдэхүүний товч жагсаалт (FR-WISH-140), гарах товчийг нэг дор харуулна **shall**. Admin бол «Админ хэсэг» холбоос нэмж харуулна **shall**. Нэвтрээгүй бол `/login?next=/profile` руу шилжүүлнэ **shall**.
- **Rationale:** G2-ийн хэрэглэгчийн дараагийн алхмыг нэг газар төвлөрүүлнэ.
- **Source:** Phase0 roadmap Phase 4 «Basic user profile»; code `apps/web/src/app/profile/page.tsx`
- **Priority · Phase · Status:** Should · PH4 · implemented (`apps/web/src/app/profile/page.tsx`)
- **Verification:** Test — anon, customer, admin гурван нөхцөлөөр шалгана.
- **Acceptance:** anon үед redirect хийгдэнэ. customer үед гурван хэсэг харагдаж admin холбоос байхгүй. admin үед admin холбоос харагдана. Хуудас `noindex` байна.
- **States:** Хэсэг бүрийн loading/empty/error нь FR-INQ-210, FR-WISH-140-ийг дагана.

#### FR-USER-200 — Хэрэглэгчийн удирдлага (admin)
**Statement:** Admin бүртгэлтэй хэрэглэгчдийг харж, эрхийг нь өөрчилнө **may**.
- **Rationale:** Нэг admin-тай MVP-д зайлшгүй биш. Хоёр дахь admin нэмэх үед хэрэгтэй.
- **Source:** Phase0 FR-USER-003, 004
- **Priority · Phase · Status:** Could · PH8 · planned
- **Verification:** children

#### FR-USER-210 — Хэрэглэгчдийн жагсаалт
**Statement:** Admin `/admin/users` хуудсанд бүх хэрэглэгчийн email, нэр, эрх, бүртгүүлсэн огноог newest-first, хуудаслалттай (20 мөр) харна **may**.
- **Rationale:** Хэрэглэгчийн дэмжлэг.
- **Source:** Phase0 FR-USER-003 (S)
- **Priority · Phase · Status:** Could · PH8 · planned (API/UI байхгүй)
- **Verification:** Test — 25 хэрэглэгчтэй fixture дээр шалгана.
- **Acceptance:** 1-р хуудсанд 20 мөр newest-first байна. customer-д `403` буцна.
- **States:** loading, empty («Хэрэглэгч алга»), error (дахин ачаалах товч).

#### FR-USER-220 — Эрх өөрчлөх
**Statement:** Admin хэрэглэгчийн эрхийг `customer` ↔ `admin` болгон өөрчлөхөд систем шинэ эрхийг хадгалж audit log-д бүртгэнэ **may**. Admin өөрийнхөө эрхийг бууруулахыг хориглоно **shall**.
- **Rationale:** Сүүлчийн admin-ийг алдахаас сэргийлнэ.
- **Source:** Phase0 FR-USER-004 (S); code `supabase/migrations/20260716154420_rls_policies.sql:72` (RLS policy бий, API/UI байхгүй)
- **Priority · Phase · Status:** Could · PH8 · planned
- **Verification:** Test — admin→customer өөрчлөх, өөрийгөө бууруулах гэсэн хоёр нөхцөл.
- **Acceptance:**
  1. Өөр хэрэглэгчийн эрх өөрчлөгдөж audit мөр нэмэгдэнэ.
  2. Өөрийгөө бууруулах оролдлого `409` буцааж, эрх өөрчлөгдөхгүй.

#### FR-USER-221 — Эрх өөрчлөхийн баталгаажуулалт
**Statement:** Эрх өөрчлөхөөс өмнө систем баталгаажуулах dialog-оор дараахыг харуулна **shall**: юу өөрчлөгдөх (action), хэрэглэгч ямар эрх авах/алдах (impact), admin эрх олгох эрсдэл (risk), буцааж болох эсэх (reversibility). Admin баталсны дараа л хадгална.
- **Rationale:** Буцаахад хүнд, аюулгүй байдалд нөлөөтэй үйлдэл (ADVANCED-WEB-GUIDE §2, F-02).
- **Source:** plan F-02
- **Priority · Phase · Status:** Could · PH8 · planned
- **Verification:** Demonstration
- **Acceptance:** Dialog 4 мэдээллийг бүгдийг агуулна. «Болих» дарахад өөрчлөлт хийгдэхгүй, focus trigger товч руу буцна.

### 4.3 Ангиллын удирдлага (FR-CAT)

#### FR-CAT-100 — Ангиллыг удирдах
**Statement:** Admin бүтээгдэхүүний ангиллыг үүсгэх, засах, идэвхгүй болгох, устгах, эрэмбэлэх боломжтой байна **shall**.
- **Rationale:** G1 — каталогийг ангиллаар зохион байгуулна (D-01: тоо нь нээлттэй).
- **Source:** Phase0 FR-CAT-001…006; code `backend/api/src/controllers/admin/category.controller.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-CAT-110 — Ангилал үүсгэх
**Statement:** Admin `name` (заавал), сонголтот `slug`, `description`, `sort_order`-той `POST /api/v1/admin/categories` илгээхэд систем ангиллыг хадгалж `201` болон шинэ ангиллыг буцаана **shall**.
- **Rationale:** G1.
- **Source:** Phase0 FR-CAT-001; `packages/validation-schemas/src/category.schema.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/services/category.service.ts`)
- **Verification:** Test — `backend/api/tests/api.integration.test.ts` «POST /admin/categories → 201»
- **Acceptance:** 1) Хүчинтэй body → `201`, нэг мөр нэмэгдэнэ. 2) Буруу body → `400`, мөр нэмэгдэхгүй. 3) Token-гүй → `401`, customer token → `403`.

#### FR-CAT-120 — Ангилал засах
**Statement:** Admin байгаа ангиллын аль ч талбарыг `PATCH /api/v1/admin/categories/{id}`-аар өөрчлөхөд систем шинэчилсэн ангиллыг `200`-тай буцаана **shall**. Мэдэгдэхгүй `id`-д `404`-ийг буцаана **shall**.
- **Rationale:** G1.
- **Source:** Phase0 FR-CAT-002
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/controllers/admin/category.controller.ts`)
- **Verification:** Test — `api.integration.test.ts` «PATCH /admin/categories/{id} → 200; unknown id → 404»
- **Acceptance:** 1) Өөрчилсөн талбар дараагийн GET-д харагдана. 2) Мэдэгдэхгүй id → `404`.

#### FR-CAT-130 — Ангилал идэвхгүй болгох
**Statement:** Admin ангиллын `is_active`-ийг `false` болгоход систем тухайн ангиллыг нийтийн ангиллын жагсаалт, ангиллын chip, sitemap-ээс хасна **shall**.
- **Rationale:** Устгалгүйгээр түр нуух.
- **Source:** Phase0 FR-CAT-003; `backend/api/src/repositories/supabase/category.repository.ts` (`eq('is_active', true)`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — идэвхгүй ангилал `GET /categories`-д байхгүй, `GET /categories/{slug}` → `404` (тест одоогоор зөвхөн идэвхтэй тохиолдлыг шалгадаг; идэвхгүй тохиолдол planned)
- **Acceptance:** 1) `is_active=false` ангилал `GET /api/v1/categories`-ийн хариунд байхгүй. 2) `/sitemap.xml`-д түүний URL байхгүй.

#### FR-CAT-131 — Идэвхгүй ангиллын бүтээгдэхүүн
**Statement:** Идэвхгүй ангилалд хамаарах `published` бүтээгдэхүүнийг систем нийтийн жагсаалт, хайлт, sitemap-д харуулахгүй байна **shall**. Шууд slug URL-аар хандахад `404`-ийг буцаана **shall**.
- **Rationale:** FR-CAT-130-ийн «нийтийн сайтад харагдахгүй» гэсэн утгыг бүрэн болгоно (Complete).
- **Source:** Phase0 FR-CAT-003-ийн тайлбар; одоогийн код нь бүтээгдэхүүнийг ангиллын `is_active`-аар шүүдэггүй (`backend/api/src/repositories/supabase/product.repository.ts`)
- **Priority · Phase · Status:** Should · PH3 · planned
- **Verification:** Test — идэвхгүй ангиллын published бүтээгдэхүүнийг жагсаалт, хайлт, slug, sitemap-аар шалгах
- **Acceptance:** 4 замын аль нь ч уг бүтээгдэхүүнийг харуулахгүй бол pass. (Owner батлах — OPEN.)

#### FR-CAT-140 — Хоосон ангилал устгах
**Statement:** Admin бүтээгдэхүүнгүй ангиллыг устгахад систем `204`-ийг буцааж мөрийг устгана **shall**. Бүтээгдэхүүнтэй ангилалд `409 CATEGORY_NOT_EMPTY`-г буцааж юуг ч устгахгүй **shall**.
- **Rationale:** Бүтээгдэхүүн өнчирөхөөс сэргийлнэ.
- **Source:** Phase0 FR-CAT-004; `category.service.ts` (`countProducts`)
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Test — `api.integration.test.ts` «DELETE category with products → 409», «DELETE empty category → 204»
- **Acceptance:** 1) 0 бүтээгдэхүүнтэй → `204`. 2) ≥1 бүтээгдэхүүнтэй → `409`, мөр хэвээр.

#### FR-CAT-150 — Ангиллын slug
**Statement:** Систем ангиллын slug-ийг `^[a-z0-9]+(?:-[a-z0-9]+)*$` хэлбэртэй, давтагдашгүй байлгана **shall**. Slug өгөөгүй бол нэрээс (кирилл → латин) үүсгэж, давхцвал тоон дагавар (`-2`, `-3`) нэмнэ **shall**.
- **Rationale:** URL-д аюулгүй, хүн уншихуйц холбоос (NFR-SEO-320).
- **Source:** Phase0 FR-CAT-005; `packages/validation-schemas/src/common.ts` (`slugSchema`); `backend/api/src/lib/slug.ts`; DB `unique`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — `api.integration.test.ts` «Cyrillic slug auto-generated», «duplicate category name → numeric slug suffix»
- **Acceptance:** 1) Кирилл нэр → латин slug. 2) Ижил нэртэй хоёр дахь ангилал → `-2` дагавартай. 3) Буруу хэлбэрийн slug → `400`.

#### FR-CAT-160 — Ангиллын эрэмбэ
**Statement:** Систем ангиллыг нийтийн болон admin жагсаалтад `sort_order`-ийн өсөх дарааллаар буцаана **shall**.
- **Rationale:** Owner ангиллын дарааллыг тогтооно.
- **Source:** Phase0 FR-CAT-006; `category.repository.ts`
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Test — өөр `sort_order`-той 3 ангилал үүсгээд дарааллыг шалгах (planned)
- **Acceptance:** Хариуны дараалал `sort_order`-ийн өсөх дараалалтай таарна.

#### FR-CAT-200 — Ангиллыг нийтэд унших
**Statement:** Систем идэвхтэй ангиллыг нэвтрээгүй хэрэглэгчид ч уншуулна **shall**.
- **Source:** Phase0 FR-CAT-007
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-CAT-210 — Идэвхтэй ангиллын жагсаалт
**Statement:** Ямар ч хэрэглэгч (нэвтрээгүй ч) `GET /api/v1/categories` хүсэхэд систем зөвхөн `is_active=true` ангиллыг `200`-тай буцаана **shall**.
- **Rationale:** Phase 0-ийн «authenticated guest or customer» гэсэн бичлэг нь олон утгатай. Код нь нэвтрэлт шаарддаггүй.
- **Source:** Phase0 FR-CAT-007; `backend/api/src/controllers/category.controller.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — `api.integration.test.ts` «GET /categories → 200 with data array»
- **Acceptance:** Token-гүй хүсэлт → `200`, `data` массивт идэвхгүй ангилал байхгүй.

#### FR-CAT-220 — Ангиллыг slug-аар унших
**Statement:** `GET /api/v1/categories/{slug}` хүсэхэд систем идэвхтэй ангилалд `200`, идэвхгүй эсвэл мэдэгдэхгүй slug-д `404`-ийг буцаана **shall**.
- **Source:** code `category.controller.ts`; Phase 0-д тусгай ID байгаагүй
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Test — `api.integration.test.ts` «GET /categories/{slug} → 200 for active category»; 404 тохиолдол planned
- **Acceptance:** Идэвхтэй → `200`. Идэвхгүй эсвэл мэдэгдэхгүй → `404`.

### 4.4 Бүтээгдэхүүн (FR-PROD)

#### FR-PROD-100 — Бүтээгдэхүүний өгөгдлийн загвар
**Statement:** Систем бүтээгдэхүүн бүрийг каталог, хайлт, SEO-д хэрэгтэй талбаруудтай, тогтмол хязгаартай хадгална **shall**.
- **Source:** Phase0 FR-PROD-001, 003, 005, 007…010, FR-PUB-013; `packages/validation-schemas/src/product.schema.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-PROD-110 — Бүтээгдэхүүний талбар ба хязгаар
**Statement:** Систем бүтээгдэхүүнийг дараах талбартай хүлээн авна **shall**:
- `name` (1–200 тэмдэгт, заавал);
- `category_id` (UUID, заавал);
- `price` (эерэг тоо, MNT, заавал);
- `name_en` (≤200);
- `slug`;
- `short_description` (≤500);
- `full_description` (≤10000);
- `usage_instruction` (≤10000);
- `status`, `stock_status`, `is_featured`;
- `search_tags` (≤30 хоосон биш мөр).

Хязгаараас хэтэрсэн хүсэлтэд систем `400`-ийг буцаана **shall**.
- **Rationale:** G1 — бүтээгдэхүүн бүр үнэ, тайлбар, зааварт байх (project-goals G1 M).
- **Source:** Phase0 FR-PROD-001; `product.schema.ts` (`productInputSchema`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — `api.integration.test.ts` «POST /admin/products: 401 anon / 403 customer / 400 invalid»
- **Acceptance:** 1) Заавал талбаргүй эсвэл `price ≤ 0` → `400`. 2) Хүчинтэй → `201`.

#### FR-PROD-120 — Нэг ангилалд харьяалагдах
**Statement:** Бүтээгдэхүүн бүр яг нэг байгаа ангилалд (`category_id`) харьяалагдана **shall**.
- **Source:** Phase0 FR-PROD-008; `supabase/migrations/20260716154417_init_schema.sql` (`products.category_id`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Inspection — schema-д `category_id not null` + FK; Test — байхгүй `category_id` → алдаа (planned)
- **Acceptance:** `category_id`-гүй эсвэл байхгүй ангилалтай insert амжилтгүй.

#### FR-PROD-130 — Нийтлэлийн төлөв
**Statement:** Систем бүтээгдэхүүний `status`-ийг зөвхөн `draft`, `published`, `archived` утгаар хадгалж, шинэ бүтээгдэхүүнд `draft`-ийг default болгоно **shall**.
- **Source:** Phase0 FR-PROD-003; `common.ts` (`productStatusSchema`), DB default
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «POST /admin/products → 201 draft with auto slug»
- **Acceptance:** 1) Status-гүй үүсгэхэд `draft`. 2) Өөр утга → `400`.

#### FR-PROD-140 — Нөөцийн төлөв
**Statement:** Систем `stock_status`-ийг зөвхөн `in_stock`, `out_of_stock`, `pre_order` утгаар хадгална **shall**. Нийтийн дэлгэрэнгүйд эдгээрийг «Бэлэн байгаа», «Түр байхгүй», «Захиалгаар» гэж харуулна **shall**.
- **Source:** Phase0 FR-PROD-005; `apps/web/src/app/products/[slug]/page.tsx` (`STOCK_LABELS`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — утга бүрээр дэлгэрэнгүй хуудасны шошгыг шалгах (planned)
- **Acceptance:** Гурван утга тус бүр зөв шошготой. Өөр утга → `400`.

#### FR-PROD-150 — Бүтээгдэхүүний slug
**Statement:** Систем бүтээгдэхүүний slug-ийг FR-CAT-150-тай ижил хэлбэр, давтагдашгүй байдлаар хадгална **shall**. Өгөөгүй бол нэрээс автоматаар үүсгэж, давхцвал тоон дагавар нэмнэ **shall**.
- **Source:** Phase0 FR-PROD-007; `backend/api/src/services/product.service.ts` (`uniqueSlug`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «POST /admin/products → 201 draft with auto slug»
- **Acceptance:** Кирилл нэр → латин slug. Давхцал → `-2`.

#### FR-PROD-160 — Олон зураг
**Statement:** Систем нэг бүтээгдэхүүнд 0 буюу түүнээс олон зургийг `sort_order`-оор эрэмбэлэн холбоно **shall**.
- **Rationale:** G1 — бүтээгдэхүүн бүрт ≥ 3 бодит фото.
- **Source:** Phase0 FR-PROD-009; `product_images` хүснэгт
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «PATCH publish → visible publicly with images+category joins»
- **Acceptance:** Дэлгэрэнгүйн хариуны `images` нь `sort_order`-ийн өсөх дараалалтай.

#### FR-PROD-170 — Хэрэглэх заавар
**Statement:** Систем `usage_instruction`-ийг markdown текстээр (≤10000 тэмдэгт) хадгална **shall**. Нийтийн хуудсанд түүнийг дугаарласан алхам болгон, HTML-ийг sanitize хийж харуулна **shall**.
- **Rationale:** Vision §2 — «хэрэглэх заавар онлайнд байхгүй».
- **Source:** Phase0 FR-PROD-010; `apps/web/src/components/public/product-tabs.tsx` (`parseSteps`; бүрэн markdown + rehype-sanitize нь хойшилсон)
- **Priority · Phase · Status:** Must · PH5 · partial
- **Verification:** Test — жагсаалт, гарчиг, `<script>` агуулсан заавраар render хийж алхам гарах, script ажиллахгүйг шалгах
- **Acceptance:** 1) Мөр бүр нэг алхам болж харагдана. 2) `<script>` эсвэл `onerror` агуулсан текст ажиллахгүй (NFR-SEC-тэй холбоотой).

#### FR-PROD-180 — Олон бичгийн хайлтын талбар
**Statement:** Систем бүтээгдэхүүн бүрт сонголтот `name_en` болон `search_tags` (text array) талбарыг хадгалж, хайлтын индексэд (`name`, `name_en`, `search_tags`) оруулна **shall**.
- **Source:** Phase0 FR-PUB-013; `supabase/migrations/20260719103322_product_search_vector.sql`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «multi-script search: Cyrillic, English, Latin-transliterated»
- **Acceptance:** `name_en="Green Tara"` бүтээгдэхүүн «green tara» хайлтаар олдоно.

#### FR-PROD-190 — Хэмжээ, жин, материал
**Statement:** Систем бүтээгдэхүүн бүрт сонголтот `height_cm`, `width_cm`, `depth_cm` (эерэг тоо, 0.1 см нарийвчлал), `weight_g` (эерэг бүхэл тоо) болон `material` (≤200 тэмдэгт) талбарыг хадгалж, admin API-аар үүсгэх, засах боломжтой байна **shall**. Хэмжээ, жинг зурган дээр бичихгүй **shall**.
- **Rationale:** D-09. Зураг дээр бичсэн хэмжээг засах, шүүх, хайх боломжгүй, SEO болон screen reader уншихгүй. Талбар нь G1-ийн «шийдвэр гаргахад хэрэгтэй мэдээлэл»-ийг хангана.
- **Source:** Owner шийдвэр D-09 (2026-10-27). Шинэ шаардлага, хуучин ID-гүй.
- **Priority · Phase · Status:** Should · PH3 (PH5-ийн контент оруулахаас өмнө) · planned (DB, Zod, admin form-д талбар байхгүй)
- **Verification:** Test — талбартай POST/PATCH → `201`/`200`; сөрөг тоо эсвэл 0 → `400`; талбаргүй хүсэлт хүчинтэй хэвээр.
- **Acceptance:** 1) Шинэ migration-д 5 nullable багана. 2) `productInputSchema`, admin form-д талбарууд. 3) Хуучин бүтээгдэхүүн өөрчлөлтгүй ажиллана.

#### FR-PROD-200 — Бүтээгдэхүүний амьдралын мөчлөг (API)
**Statement:** Admin API-аар бүтээгдэхүүнийг үүсгэх, засах, нийтлэх, онцлох, архивлах, бүрмөсөн устгах боломжтой байна **shall**.
- **Source:** Phase0 FR-PROD-001, 002, 004, 006, 011; `backend/api/src/controllers/admin/product.controller.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-PROD-210 — Бүтээгдэхүүн үүсгэх
**Statement:** Admin хүчинтэй body-той `POST /api/v1/admin/products` илгээхэд систем `draft` бүтээгдэхүүнийг хадгалж `201`-ийг буцааж, audit бичлэг үүсгэнэ **shall**.
- **Source:** Phase0 FR-PROD-001; `product.service.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «POST /admin/products → 201 draft with auto slug»
- **Acceptance:** `201`; нийтийн жагсаалтад харагдахгүй; `audit_logs`-д `PRODUCT_CREATE`.

#### FR-PROD-220 — Бүтээгдэхүүн засах
**Statement:** Admin `PATCH /api/v1/admin/products/{id}`-аар FR-PROD-110-ийн аль ч талбар болон `model_3d_url`-ийг өөрчлөхөд систем шинэчилсэн бүтээгдэхүүнийг `200`-тай буцаана **shall**.
- **Source:** Phase0 FR-PROD-002; `productPatchSchema`
- **Priority · Phase · Status:** Must · PH3 · implemented (UI нь FR-ADM-330, planned)
- **Verification:** Test — «PATCH publish → visible publicly»
- **Acceptance:** Өөрчилсөн талбар дараагийн GET-д харагдана. Мэдэгдэхгүй id → `404`.

#### FR-PROD-230 — Нийтлэх ба буцаах
**Statement:** Admin `status`-ийг `published` болгоход бүтээгдэхүүн нийтийн API-д харагдана **shall**. `draft` эсвэл `archived` болгоход нийтийн API-аас нуугдана **shall**.
- **Source:** Phase0 FR-PROD-004
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «draft product is NOT publicly visible», «PATCH publish → visible publicly»
- **Acceptance:** Draft → нийтийн slug `404`. Published → `200`.

#### FR-PROD-240 — Онцлох бүтээгдэхүүн
**Statement:** Admin `is_featured=true` тавихад систем тухайн бүтээгдэхүүнийг `GET /products?is_featured=true`-ийн хариунд оруулна **shall**.
- **Source:** Phase0 FR-PROD-006 (нүүрэнд харуулах нь FR-PUB-310)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «public list: pagination meta + is_featured + category filters»
- **Acceptance:** Featured бүтээгдэхүүн filter-ийн хариунд байна, featured биш нь байхгүй.

#### FR-PROD-250 — Архивлах (зөөлөн устгал)
**Statement:** Admin `DELETE /api/v1/admin/products/{id}`-ийг `hard` параметргүй дуудахад систем бүтээгдэхүүнийг устгалгүйгээр `status=archived` болгож, `PRODUCT_ARCHIVE` audit бичлэг үүсгэнэ **shall**.
- **Source:** Phase0 FR-PROD-011; `product.service.ts` (`remove`)
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Test — «DELETE product default = soft archive; ?hard=true removes»
- **Acceptance:** Мөр хэвээр, `status=archived`, нийтэд `404`.

#### FR-PROD-260 — Бүрмөсөн устгах
**Statement:** Систем бүтээгдэхүүнийг зөвхөн `?hard=true` тодорхой параметртэй хүсэлтээр, UI-ийн баталгаажуулалтын дараа (FR-ADM-710) бүрмөсөн устгана **shall**. Мөн `PRODUCT_HARD_DELETE` audit бичлэг үүсгэнэ **shall**.
- **Source:** Phase0 FR-PROD-011 («hard delete shall require explicit confirmation»)
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Test — «DELETE product … ?hard=true removes»
- **Acceptance:** Мөр устсан; audit-д `hard=true` metadata.

#### FR-PROD-300 — Бүтээгдэхүүн хайх, шүүх, хуудаслах (API)
**Statement:** API нь бүтээгдэхүүний жагсаалтыг шүүлтүүр, эрэмбэ, хуудаслалттай буцаана **shall**.
- **Source:** Phase0 FR-PROD-004, 012, 013
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-PROD-310 — Нийтийн жагсаалтад зөвхөн published
**Statement:** `GET /api/v1/products` болон `GET /api/v1/products/{slug}` нь зөвхөн `status=published` бүтээгдэхүүнийг буцаана **shall**. Бусад төлөвийн slug-д `404`-ийг буцаана **shall**.
- **Source:** Phase0 FR-PROD-004; `product.repository.ts` (`listPublished`, `findPublishedBySlug`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «draft product is NOT publicly visible»
- **Acceptance:** Draft/archived нь жагсаалтад байхгүй, slug → `404`.

#### FR-PROD-320 — Шүүлтүүр
**Statement:** Шүүлтүүрүүд **shall**:
- нийтийн жагсаалт: `category_id`, `category_slug`, `stock_status`, `is_featured`, `search`;
- admin жагсаалт: `status`, `category_id`, `search`.

Хүлээн зөвшөөрөгдөөгүй утгад `400`-ийг буцаана **shall**.
- **Rationale:** Phase 0 нь `status` шүүлтүүрийг нийтийн API-д оруулсан байсан. Нийтийн API нь зөвхөн published буцаадаг тул `status` нь зөвхөн admin-д хамаарна.
- **Source:** Phase0 FR-PROD-012; `productListQuerySchema`, `adminProductListQuerySchema`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «public list: pagination meta + is_featured + category filters», «GET /admin/products lists drafts too»
- **Acceptance:** Шүүлтүүр бүр зөвхөн тохирох мөрийг буцаана. Буруу `stock_status` → `400`.

#### FR-PROD-330 — Хуудаслалт
**Statement:** Жагсаалтын API нь `page` (≥1, default 1), `limit` (1–50, default 12) параметрийг хүлээн авч, `meta.total` болон `meta.total_pages`-ийг буцаана **shall**.
- **Source:** Phase0 FR-PROD-013; `productListQuerySchema`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «public list: pagination meta…»
- **Acceptance:** `limit=51` → `400`. 13 бүтээгдэхүүн, `limit=12` → `total_pages=2`.

#### FR-PROD-340 — Эрэмбэлэлт
**Statement:** Нийтийн жагсаалтын API нь `sort`-ийг `newest` (default), `price_asc`, `price_desc` утгаар хүлээн авч, тохирох дарааллаар буцаана **shall**.
- **Source:** code `productListQuerySchema`; Phase 0-д ID байгаагүй
- **Priority · Phase · Status:** Should · PH3 · implemented (UI-д сонголт байхгүй)
- **Verification:** Test — 3 үнэтэй бүтээгдэхүүнээр дараалал шалгах (planned)
- **Acceptance:** `price_asc` → үнэ өсөх дараалалтай.

### 4.5 Медиа (FR-MEDIA)

#### FR-MEDIA-100 — Бүтээгдэхүүний зураг удирдах
**Statement:** Admin бүтээгдэхүүний зургийг байршуулах, эрэмбэлэх, alt текст өгөх, устгах боломжтой байна **shall**.
- **Source:** Phase0 FR-MEDIA-001…006, 009; `backend/api/src/controllers/admin/media.controller.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented (API); UI partial
- **Verification:** children

#### FR-MEDIA-110 — Зураг байршуулах
**Statement:** Admin `POST /api/v1/admin/products/{id}/images`-аар нэг буюу хэд хэдэн файл илгээхэд систем хүчинтэй файл бүрийг `product-images` bucket-д хадгалж, `product_images` мөр үүсгэнэ **shall**.
- **Source:** Phase0 FR-MEDIA-001; `backend/api/src/services/media.service.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «POST images: valid file uploaded, invalid file rejected individually»
- **Acceptance:** Хүчинтэй файл бүрт нэг мөр. Token-гүй → `401`, customer → `403`.

#### FR-MEDIA-120 — Зургийн серверийн шалгалт
**Statement:** Сервер файл бүрийг шалгана **shall**:
- өргөтгөл нь `jpg`, `jpeg`, `png`, `webp`;
- MIME нь өргөтгөлтэйгээ таарсан;
- хэмжээ ≤ 5 MB.

Шалгалт:
- Буруу файлыг систем бусдаас тусад нь шалтгаантайгаар татгалзана **shall**.
- Бүх файл буруу бол `400`-ийг буцаана **shall**.
- **Source:** Phase0 FR-MEDIA-002, FR-MEDIA-003 (серверийн хэсэг); `media.service.ts`, `media.controller.ts` (`STREAM_LIMIT`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «POST images: all invalid → 400…»
- **Acceptance:** 1) `.gif` → татгалзсан. 2) `.png` нэртэй JPEG → татгалзсан. 3) 5 MB + 1 byte → татгалзсан. 4) 3 файлын 1 нь буруу → 2 хадгалагдана.

#### FR-MEDIA-121 — Зургийн client талын шалгалт
**Statement:** Admin-ийн зураг сонгох талбар нь зөвхөн `image/jpeg, image/png, image/webp`-ийг санал болгож, 5 MB-аас том файлыг илгээхээс өмнө шалтгаантайгаар татгалзана **shall**.
- **Source:** Phase0 FR-MEDIA-003; `apps/web/src/components/admin/product-form.tsx` (`accept`, `MAX_SIZE`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Demonstration — 6 MB файл сонгоход алдааны текст харагдах
- **Acceptance:** 6 MB файл сүлжээнд илгээгдэхгүй, алдаа харагдана.

#### FR-MEDIA-130 — Зургийн бичлэгийн талбар
**Statement:** Систем зургийн бичлэг бүрт `product_id`, `image_url`, `alt_text` (≤200, nullable), `sort_order` (≥0)-ийг хадгална **shall**.
- **Source:** Phase0 FR-MEDIA-004; `media.schema.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Inspection — schema ба migration
- **Acceptance:** Дөрвөн талбар бүгд API хариунд байна.

#### FR-MEDIA-140 — Зургийн эрэмбэ ба үндсэн зураг
**Statement:** Admin `PATCH /api/v1/admin/products/{id}/images/{imageId}`-аар `sort_order` эсвэл `alt_text`-ийг өөрчлөх боломжтой байна **shall**. Хамгийн бага `sort_order`-той зураг нь жагсаалтын thumbnail болон дэлгэрэнгүйн эхний зураг болно **shall**.
- **Source:** Phase0 FR-MEDIA-005; `productImagePatchSchema`
- **Priority · Phase · Status:** Must · PH3 · implemented (API); UI нь FR-ADM-330 (planned)
- **Verification:** Test — «PATCH image sort_order/alt_text → 200; then DELETE → 204»
- **Acceptance:** Эрэмбэ сольсны дараа жагсаалтын карт шинэ эхний зургийг харуулна.

#### FR-MEDIA-150 — Зураг устгах
**Statement:** Admin `DELETE /api/v1/admin/products/{id}/images/{imageId}` дуудахад систем мөр болон storage-ийн файлыг устгаж `204`-ийг буцаана **shall**.
- **Source:** Phase0 FR-MEDIA-006
- **Priority · Phase · Status:** Must · PH3 · implemented (API); UI нь FR-ADM-330 (planned)
- **Verification:** Test — «…then DELETE → 204»
- **Acceptance:** Дараагийн GET-д зураг байхгүй.

#### FR-MEDIA-160 — Storage-ийн аюулгүй зам
**Statement:** Систем байршуулсан файлыг хэрэглэгчийн өгсөн нэрээр биш, `products/{productId}/{UUID}.{ext}` замаар хадгална **shall**.
- **Rationale:** Давхцал болон path traversal-аас сэргийлнэ.
- **Source:** Phase0 FR-MEDIA-009; `media.service.ts` (`randomUUID`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Inspection — `media.service.ts`; Test — `../x.png` нэртэй файлын хадгалсан зам UUID-тэй
- **Acceptance:** Хадгалсан замд эх файлын нэр орохгүй.

#### FR-MEDIA-200 — Бүтээгдэхүүний 3D model (GLB)
**Statement:** Admin бүтээгдэхүүн бүрт хамгийн ихдээ нэг GLB/GLTF model байршуулах боломжтой байна **may**.
- **Rationale:** D-07: бүтээгдэхүүн бүрийн 360° viewer post-MVP. `model_3d_url` багана болон `model-assets` bucket нь идэвхгүй хэвээр.
- **Source:** Phase0 FR-MEDIA-007; D-07; `supabase/migrations/20260719103327_storage_policies.sql`
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** children

#### FR-MEDIA-210 — GLB байршуулах
**Statement:** Admin GLB/GLTF файлыг `model-assets` bucket-д байршуулахад систем бүтээгдэхүүний `model_3d_url`-ийг шинэчилнэ **shall**. Өмнөх model нь солигдоно **shall**.
- **Source:** Phase0 FR-MEDIA-007; 06-api-spec `/admin/products/{id}/model` (хэзээ ч хийгдээгүй, D-07)
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Test — PH8-д
- **Acceptance:** Нэг бүтээгдэхүүнд нэгээс олон model мөр үүсэхгүй.

#### FR-MEDIA-220 — GLB-ийн хэмжээ
**Statement:** Систем 5 MB-аас том GLB/GLTF файлыг татгалзана **shall**.
- **Rationale:** Phase 0-д 10 MB (MEDIA-008) болон ≤ 5 MB зорилт (MEDIA-011) зөрчилдсөн. Интро GLB-ийн ≤ 5 MB-тай (G3) нэг утга болгов.
- **Source:** Phase0 FR-MEDIA-008, FR-MEDIA-011
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Test — 5 MB + 1 byte GLB → татгалзсан
- **Acceptance:** ≤ 5 MB → хүлээн авна. > 5 MB → `400`.

#### FR-MEDIA-230 — GLB шахалт
**Statement:** Систем хадгалахаас өмнө GLB-ийг Draco-оор шахна **may**, эсвэл admin урьдчилан шахсан файл оруулна.
- **Rationale:** Серверт `gltf-pipeline` ажиллуулах нь API container-ийн хэмжээ, CPU-д нөлөөлнө. PH8-д Analysis-ээр шийднэ.
- **Source:** Phase0 FR-MEDIA-011; ADR-001
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Analysis — серверийн шахалт ба урьдчилсан шахалтын харьцуулалт
- **Acceptance:** Шийдвэр ADR-д бичигдсэн.

### 4.6 Нийтийн каталог (FR-PUB)

#### FR-PUB-100 — Каталог үзэх ба хайх
**Statement:** Зочин нэвтрэлгүйгээр нийтлэгдсэн бүтээгдэхүүнийг үзэх, ангиллаар шүүх, олон бичгээр хайх боломжтой байна **shall**.
- **Rationale:** G1 outcome — «зочин хүссэн бараагаа онлайнаар олно».
- **Source:** Phase0 FR-PUB-001, 002, 005, 008, 014
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-PUB-110 — Нэвтрэлгүй үзэх
**Statement:** Нэвтрээгүй зочин `/products` болон `/products/{slug}`-ийг нээхэд систем published бүтээгдэхүүнийг нэвтрэх шаардлагагүйгээр харуулна **shall**.
- **Source:** Phase0 FR-PUB-001; `apps/web/src/app/products/(list)/page.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — cookie-гүй browser-ээр хоёр хуудсыг нээх (Playwright, planned)
- **Acceptance:** `200`, бүтээгдэхүүний карт харагдана, login руу redirect хийхгүй.
- **States:** loading — `loading.tsx` skeleton; empty — FR-PUB-150; error — FR-PUB-150; success — картын grid.

#### FR-PUB-120 — Ангиллаар шүүх
**Statement:** Зочин ангиллын chip сонгоход систем `/products?category={slug}` URL-аар зөвхөн тухайн ангиллын бүтээгдэхүүнийг харуулж, сонгосон chip-ийг идэвхтэй төлөвтэй харуулна **shall**.
- **Rationale:** Phase 0-ийн `/categories/[slug]` URL (FR-PUB-008) хэрэгжээгүй. Одоогийн query-string загвар нь хуваалцах боломжтой бөгөөд sitemap-тай нийцдэг.
- **Source:** Phase0 FR-PUB-002, FR-PUB-008; `category-chips.tsx`, `sitemap.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — chip дарахад URL болон тоо өөрчлөгдөхийг шалгах
- **Acceptance:** Хариунд өөр ангиллын бүтээгдэхүүн байхгүй. URL-ыг шинэ tab-д нээхэд ижил үр дүн гарна.
- **States:** busy — шилжилтийн үед хуучин үр дүн нуугдахгүй; empty — FR-PUB-150.

#### FR-PUB-130 — Ангиллын жагсаалт харуулах
**Statement:** Каталогийн хуудас бүх идэвхтэй ангиллыг нэг мөрөнд chip хэлбэрээр харуулна **shall**. Багтахгүй бол хэвтээ scroll хийгдэнэ **shall** (WF-LIST, D-01-ийн тооноос үл хамаарна).
- **Source:** Phase0 FR-PUB-005; WF-HOME-01 «single-row rule»
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Demonstration — 390 px өргөнд 10 ангилалтай үед мөр шилжихгүй
- **Acceptance:** Chip-ууд нэг мөрөнд, хуудас хэвтээ scroll үүсгэхгүй.

#### FR-PUB-140 — Олон бичгийн хайлт
**Statement:** Зочин хайлтын талбарт кирилл, латин галиг эсвэл англи үг оруулахад систем `name`, `name_en`, `search_tags`-аас нэгэн зэрэг хайна **shall**. Латин оролтыг кирилл рүү хөрвүүлж, хоёр хэлбэрийн илэрцийг нэгтгэн буцаана **shall**.
- **Source:** Phase0 FR-PUB-014; `product.service.ts` (`prepareSearch`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — «multi-script search: Cyrillic, English, Latin-transliterated»
- **Acceptance:** «Ногоон дарь эх», «nogoon dar eh», «green tara» гурвуулаа ижил бүтээгдэхүүнийг олно.
- **States:** empty — FR-PUB-150; success — тоо шинэчлэгдэнэ (FR-PUB-160).

#### FR-PUB-150 — Каталогийн хоосон ба алдааны төлөв
**Statement:**
- Илэрц 0 үед систем «Илэрц олдсонгүй. Хайлтаа өөрчлөх эсвэл өөр ангилал сонгоно уу.» текст болон шүүлтүүр цэвэрлэх товчийг харуулна **shall**.
- API хүрэх боломжгүй үед хоосон эсвэл техникийн алдааны дэлгэц биш, «Каталогийг ачаалж чадсангүй» текст болон «Дахин оролдох» товчийг харуулна **shall**.
- **Rationale:** Guide §2 «Төлөвүүд» (F-02).
- **Source:** WF-LIST-06; `apps/web/src/app/products/(list)/page.tsx` (empty бий); `error.tsx` байхгүй
- **Priority · Phase · Status:** Must · PH5 · partial (empty implemented, error planned)
- **Verification:** Test — API-г унтраасан үед хуудсыг нээх
- **Acceptance:** 1) Empty: текст + reset товч харагдана. 2) Error: stack trace эсвэл Next.js-ийн default алдааны хуудас харагдахгүй, retry товч ажиллана.
- **States:** loading / empty / error / success — дээрх.

#### FR-PUB-160 — Илэрцийн тоо
**Statement:** Каталогийн хуудас одоогийн шүүлтүүр болон хайлтад тохирох бүтээгдэхүүний нийт тоог «N бүтээгдэхүүн олдлоо» гэж харуулна **shall**.
- **Source:** WF-LIST-07; `(list)/page.tsx`
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Test — тоо нь `meta.total`-тэй тэнцүү
- **Acceptance:** Шүүлтүүр солиход тоо шинэчлэгдэнэ.

#### FR-PUB-170 — Хуудаслалтын навигаци
**Statement:** Илэрц 1 хуудаснаас их үед каталог хуудаслалтын холбоосыг харуулж, `page` URL параметрийг шүүлтүүртэй хамт хадгална **shall**.
- **Source:** code `components/public/pagination.tsx`
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Test — 13 бүтээгдэхүүн, 2-р хуудас
- **Acceptance:** 2-р хуудасны URL-д `category` болон `q` хадгалагдана.

#### FR-PUB-200 — Бүтээгдэхүүний дэлгэрэнгүй
**Statement:** Зочин бүтээгдэхүүний slug URL-аар шийдвэр гаргахад хэрэгтэй бүх мэдээллийг харна **shall**.
- **Source:** Phase0 FR-PUB-003, 004, 007, 011
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-PUB-210 — Дэлгэрэнгүйн URL
**Statement:** Published бүтээгдэхүүн бүр `/products/{slug}` URL-аар нээгдэнэ **shall**.
- **Source:** Phase0 FR-PUB-003, FR-PUB-007; `apps/web/src/app/products/[slug]/page.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — published slug → `200`
- **Acceptance:** Хуудасны гарчиг бүтээгдэхүүний нэр.

#### FR-PUB-220 — Дэлгэрэнгүйн агуулга
**Statement:** Дэлгэрэнгүй хуудас дараахыг харуулна **shall**:
- нэр;
- зургийн gallery (`sort_order`-оор);
- MNT үнэ;
- богино тайлбар, бүрэн тайлбар;
- хэрэглэх заавар (FR-PROD-170);
- нөөцийн төлөв (FR-PROD-140);
- ангиллын нэр;
- inquiry руу орох товч.
- **Rationale:** G1 outcome — үнэ, зураг, зааврыг дэлгүүрт очилгүйгээр харах.
- **Source:** Phase0 FR-PUB-004 (360° хэсгээс бусад); `product-gallery.tsx`, `product-tabs.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — бүх талбартай fixture бүтээгдэхүүнээр DOM-д 8 элемент байгааг шалгах
- **Acceptance:** 8 элемент бүгд харагдана. Хоосон сонголтот талбарын хэсэг (жишээ нь зааваргүй) нуугдана, хоосон гарчиг үлдэхгүй.
- **States:** loading — серверт render хийгдэнэ (skeleton шаардлагагүй); error — FR-PUB-230; success — дээрх.

#### FR-PUB-230 — Олдоогүй бүтээгдэхүүн
**Statement:** Мэдэгдэхгүй, draft эсвэл archived slug-аар хандахад систем HTTP `404` статустай «Бүтээгдэхүүн олдсонгүй» хуудсыг каталог руу буцах холбоостой харуулна **shall**.
- **Source:** UC-G-004 alternative flow; `apps/web/src/app/products/[slug]/not-found.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — draft slug → статус `404`, холбоос `/products`
- **Acceptance:** Статус код `404` (soft-404 биш). Каталог руу буцах холбоос ажиллана.

#### FR-PUB-240 — Сонгосон бүтээгдэхүүний 360° photo spin
**Statement:** Admin тухайн бүтээгдэхүүнд photo spin идэвхжүүлсэн үед дэлгэрэнгүй хуудас 24–36 фото кадраас бүтсэн, чирж эргүүлэх боломжтой 360° харагдацыг харуулна **may**. Spin-ийн кадрууд зөвхөн зочин түүнийг нээх үед ачаалагдана. Spin-гүй бүтээгдэхүүнд зургийн gallery-г харуулна.
- **Rationale:** D-07: post-MVP. D-09: 3D GLB биш photo spin, зөвхөн нарийн хийцтэй (Tier A) сонгосон бүтээгдэхүүнд. Алтадмал, гялгар гадаргуу 3D-д муу гардаг, photo spin нь бодит барааг харуулж, хямд. Энэ release-д дэлгэрэнгүй хуудас үргэлж зургийн gallery-г харуулна.
- **Source:** Phase0 FR-PUB-004 (viewer хэсэг), FR-PUB-011; D-07; D-09 (2026-10-27-нд GLB viewer-ээс photo spin болгож өөрчилсөн)
- **Өмнөх (v2.0):** «FR-PUB-240 — Бүтээгдэхүүн бүрийн 360° viewer. Бүтээгдэхүүнд `model_3d_url` байвал дэлгэрэнгүй хуудас эргүүлэх, томруулах боломжтой 3D viewer-ийг харуулна **may**. Байхгүй бол зургийн gallery-г харуулна.» D-09-өөр 3D GLB-ийн оронд photo spin болсон.
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Demonstration — PH8-д
- **Acceptance:** Энэ release: `model_3d_url`-аас үл хамааран gallery харагдана, «360°» тэмдэг харагдахгүй.

#### FR-PUB-250 — Хэмжээ, жин, материалыг харуулах
**Statement:** Бүтээгдэхүүнд FR-PROD-190-ийн талбар байвал дэлгэрэнгүй хуудас тэдгээрийг текстээр (жишээ нь «Өндөр 32 см · Өргөн 24 см · Гүн 18 см · Жин 2.4 кг», «Материал: …») харуулж, schema.org Product-ийн `height`, `width`, `depth`, `weight`, `material`-д оруулна **shall**. Утгагүй талбарын мөр харагдахгүй **shall**.
- **Rationale:** D-09; G1 outcome — дэлгүүрт очилгүйгээр барааны хэмжээг мэдэх.
- **Source:** Owner шийдвэр D-09 (2026-10-27).
- **Priority · Phase · Status:** Should · PH5 · planned
- **Verification:** Test — бүх талбартай болон талбаргүй fixture-ээр DOM болон JSON-LD-г шалгах.
- **Acceptance:** 1) Талбартай бүтээгдэхүүнд текст мөр болон JSON-LD утгууд байна. 2) Талбаргүйд хоосон гарчиг, «— см» үлдэхгүй. 3) 1000 г ба түүнээс дээш жин кг-аар харагдана.

#### FR-PUB-260 — Хэмжээний шугамын overlay
**Statement:** Бүтээгдэхүүнд өндөр эсвэл өргөн байвал gallery нь үндсэн зурган дээр UI-аар зурсан нимгэн хэмжээний шугам, утгыг (FR-PROD-190-аас) харуулах харагдацыг санал болгож болно **may**. Зурган файлд шугам, текст шингээхгүй.
- **Rationale:** D-09. Хэмжээг нүдээр ойлгуулна; тоо нь талбараас ирдэг тул зураг дахин авах шаардлагагүй, үргэлж зөв.
- **Source:** Owner шийдвэр D-09 (2026-10-27).
- **Priority · Phase · Status:** Could · PH5 · planned
- **Verification:** Demonstration — 4:5 болон 1:1 зураг дээр 375 ба 1440 px өргөнд.
- **Acceptance:** Шугам зургийн биетийн ирмэгтэй ойролцоо, текст уншигдана (NFR-USE-130). Талбаргүй үед overlay харагдахгүй.

#### FR-PUB-300 — Нүүр хуудасны каталогийн хэсэг
**Statement:** Нүүр хуудас интроны дараа онцлох бүтээгдэхүүн болон ангиллыг харуулна **shall**.
- **Source:** Phase0 FR-PUB-006; WF-HOME-01…04; D-08
- **Priority · Phase · Status:** Must · PH5 · planned
- **Verification:** children

#### FR-PUB-310 — Онцлох бүтээгдэхүүн нүүрэнд
**Statement:** Нүүр хуудас `is_featured=true` published бүтээгдэхүүнээс 4–8-ыг карт хэлбэрээр харуулна **shall**. Featured бүтээгдэхүүн 0 байвал энэ хэсгийг нууж, каталог руу орох холбоосыг харуулна **shall**.
- **Rationale:** G1, G3. Одоогийн нүүр хуудас placeholder.
- **Source:** Phase0 FR-PUB-006; `apps/web/src/app/page.tsx`
- **Priority · Phase · Status:** Must · PH5 · planned
- **Verification:** Test — 0, 3, 10 featured fixture-ээр
- **Acceptance:** 0 → хэсэг нуугдана. 3 → 3 карт. 10 → 8 карт.
- **States:** empty — хэсэг нуугдаж холбоос үлдэнэ; error — хэсэг нуугдаж, интро/нүүр эвдрэхгүй; success — картууд.

#### FR-PUB-320 — Ангиллын мөр нүүрэнд
**Statement:** Нүүр хуудас бүх идэвхтэй ангиллыг нэг мөрөнд харуулж, ангилал бүр `/products?category={slug}` руу хөтөлнө **shall**.
- **Source:** WF-HOME-01; D-01
- **Priority · Phase · Status:** Should · PH5 · planned
- **Verification:** Demonstration — 6, 8, 10 ангилалтай үед
- **Acceptance:** Мөр шилжихгүй, холбоос бүр зөв шүүлтүүрийг нээнэ.

#### FR-PUB-400 — Хүргэлтийн toggle-ийн нийтийн илрэл
**Statement:** Нийтийн давхарга `delivery_enabled`-ийн одоогийн утгыг мэдэж, түүнээс хамаарч захиалгын UI-г харуулах эсвэл нуух ёстой **shall**.
- **Source:** Phase0 FR-PUB-009, 010, FR-SET-005; ADR-002
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-PUB-410 — Нийтийн тохиргооны endpoint
**Statement:** `GET /api/v1/settings/public` нь нэвтрэлтгүйгээр `{ data: { delivery_enabled: boolean } }`-ийг `200`-тай буцаана **shall**.
- **Source:** Phase0 FR-PUB-009; `backend/api/src/controllers/settings.controller.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — token-гүй GET (planned; одоогийн integration suite-д байхгүй)
- **Acceptance:** `200`, `delivery_enabled=false`.

#### FR-PUB-420 — Захиалгын UI нуух
**Statement:** `delivery_enabled=false` үед web болон mobile нь сагс, checkout, захиалга өгөх UI-г огт харуулахгүй байна **shall**.
- **Rationale:** Энэ release-д захиалгын UI огт байхгүй тул шаардлага хангагдсан. PH8-д UI нэмэхдээ FR-PUB-410-ийг уншиж байж харуулах ёстой. Wishlist нь сагс биш (FR-WISH).
- **Source:** Phase0 FR-PUB-010, FR-SET-005
- **Priority · Phase · Status:** Must · PH3 · implemented (UI байхгүй)
- **Verification:** Inspection — нийтийн route-ууд болон component-уудад checkout/order UI байхгүй
- **Acceptance:** «Сагсанд хийх», «Захиалах», «Checkout» элемент нийтийн хуудсанд байхгүй.

#### FR-PUB-500 — Зургаар хайх
**Statement:** Зочин зураг байршуулж эсвэл авч, үзэгдлийн хувьд төстэй бүтээгдэхүүнийг (pgvector embedding) хайх боломжтой байна **may**.
- **Rationale:** Каталог эхлээд дүүрэх ёстой (project-goals §6).
- **Source:** Phase0 FR-PUB-012
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Demonstration — PH8-д
- **Acceptance:** PH8-д тодорхойлно.

### 4.7 Асуулга (FR-INQ)

#### FR-INQ-100 — Асуулга илгээх
**Statement:** Зочин эсвэл нэвтэрсэн хэрэглэгч бүтээгдэхүүний талаар бүртгүүлэлгүйгээр асуулга илгээж, хүлээн авсан гэсэн баталгаа авна **shall**.
- **Rationale:** Захиалга идэвхжээгүй үед борлуулалтын цорын ганц суваг (G2).
- **Source:** Phase0 FR-INQ-001…003, 007; v1.0 FR-01…05; M2 FR-01
- **Priority · Phase · Status:** Must · PH4 · implemented
- **Verification:** children

#### FR-INQ-110 — Зочны асуулга үүсгэх
**Statement:** Зочин `POST /api/v1/inquiries`-д хүчинтэй `customer_name`, `phone`, сонголтот `message`, сонголтот нийтлэгдсэн `product_id` илгээхэд систем яг нэг inquiry мөрийг `status=new`, `customer_id=null`-тай үүсгэж, `201` болон давтагдашгүй `id`-г буцаана **shall**.
- **Rationale:** G2-ийн гол урсгал.
- **Source:** Phase0 FR-INQ-001, 003; v1.0 FR-01; M2 FR-01; code `backend/api/src/controllers/inquiry.controller.ts`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/controllers/inquiry.controller.ts`)
- **Verification:** Test — `backend/api/tests/inquiry-cart.integration.test.ts` («guest → 201, status new, customer_id null»)
- **Acceptance:**
  1. Хариу `201` бөгөөд `data.id` нь UUID, `data.status=new`, `data.customer_id=null`.
  2. DB-д яг 1 мөр нэмэгдэнэ.
  3. Байхгүй `product_id` (зөв UUID) үед `404`, мөр нэмэгдэхгүй.

#### FR-INQ-120 — Асуулгын талбарууд
**Statement:** Асуулга нь зөвхөн `customer_name`, `phone`, `message`, `product_id` гэсэн оролтын талбартай байна **shall**. Email талбар байхгүй **shall**. API түвшинд `message` болон `product_id` сонголтот байна.
- **Rationale:** Owner шийдвэр (2026-07-26): утсаар хариулна, email цуглуулахгүй.
- **Source:** Phase0 FR-INQ-002; WF-INQ-01 (email талбарыг хассан); code `packages/validation-schemas/src/inquiry.schema.ts`, `apps/web/src/lib/inquiry-form-schema.ts`
- **Priority · Phase · Status:** Must · PH4 · implemented (`packages/validation-schemas/src/inquiry.schema.ts`)
- **Verification:** Inspection — shared schema-д 4 талбар байгааг, form-д email input байхгүйг шалгана.
- **Acceptance:** Schema-д яг 4 оролтын талбар байна. Web form-д email input байхгүй.

#### FR-INQ-130 — Нэвтэрсэн хэрэглэгчийн асуулгыг холбох
**Statement:** Хүчинтэй access token-той хэрэглэгч асуулга илгээхэд систем `customer_id`-г зөвхөн баталгаажсан session-ий хэрэглэгчийн ID-аар онооно **shall**. Body дахь owner утгыг үл тооно **shall**. Хүчингүй token-той бол зочин гэж үзэж `customer_id=null` болгоно.
- **Rationale:** Хэрэглэгчийн түүх (FR-INQ-210). Өөр хэрэглэгчийн нэрээр асуулга үүсгэхээс сэргийлнэ.
- **Source:** v1.0 FR-02; code `backend/api/src/hooks/auth.ts` (`optionalAuth`), `supabase/migrations/20260726120000_inquiry_customer_and_cart.sql`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/hooks/auth.ts`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («authenticated → 201, links customer_id»)
- **Acceptance:** A-ийн token-оор илгээхэд `customer_id=A` болно. Body-д `customer_id` нэмж явуулахад schema-аас хасагдаж, хадгалагдсан утга нь A хэвээр байна.

#### FR-INQ-140 — Form-ийн баталгаажуулалт ба алдааны мессеж
**Statement:** Web inquiry form нь илгээхээс өмнө дараах дүрмээр шалгаж, буруу талбар бүрийн доор Монгол алдааг (`aria-describedby`-аар холбож) харуулна **shall**: нэр trim хийсний дараа ≥ 2 тэмдэгт («Нэрээ оруулна уу»), утас яг 8 цифр («Утасны дугаар 8 оронтой байх ёстой»), зурвас хоосон биш («Хүсэлтийн агуулгаа бичнэ үү»). Алдаатай үед хүсэлт илгээхгүй **shall**. API нь shared schema-аар дахин шалгаж (нэр ≥ 2, утас `^[0-9+\s-]{8,15}$`), зөрчилтэй үед `400 VALIDATION_ERROR` буцааж мөр үүсгэхгүй **shall**.
- **Rationale:** Алдаагүй илгээх (G2 outcome). Client дүрэм нь server-ийн дүрмийн хатуу дэд олонлог.
- **Source:** v1.0 FR-03; WF-INQ-01; code `apps/web/src/lib/inquiry-form-schema.ts`, `packages/validation-schemas/src/common.ts:32`
- **Priority · Phase · Status:** Must · PH4 · implemented (`apps/web/src/lib/inquiry-form-schema.ts`)
- **Verification:** Test — дөрвөн буруу оролтоор (нэр 1 тэмдэгт, утас `abc`, утас 7 цифр, хоосон зурвас) form болон API-г тус тусад нь шалгана. API: `inquiry-cart.integration.test.ts` («invalid body → 400»).
- **Acceptance:**
  1. Тохиолдол бүрт харгалзах талбарын мессеж гарч, сүлжээний хүсэлт явахгүй.
  2. API-д шууд илгээхэд `400` буцаж, DB-ийн мөрийн тоо өөрчлөгдөхгүй.
  3. Талбарыг засмагц тухайн алдаа арилна.
- **States:** error: талбарын мессеж + `aria-invalid=true`. Дараагийн алхам нь засах талбарын нэрийг заасан мессеж.

#### FR-INQ-150 — Илгээлтийн төлөв ба баталгаа
**Statement:** Илгээх үед form нь товчийг идэвхгүй болгож «Илгээж байна…» гэж харуулна **shall**. Амжилттай болмогц form-ийг success төлөвөөр сольж, форматласан асуулгын дугаар, хэрэглэгчийн оруулсан утас, каталог руу буцах холбоосыг харуулна **shall**.
- **Rationale:** Баталгаа нь G2 outcome-ийн нэг хэсэг.
- **Source:** v1.0 FR-04; WF-INQ-04; code `apps/web/src/components/public/inquiry-form.tsx`, `apps/web/src/lib/inquiry-display.ts`
- **Priority · Phase · Status:** Must · PH4 · implemented (`apps/web/src/components/public/inquiry-form.tsx`)
- **Verification:** Test (component/e2e) — mock API амжилтын хариугаар шалгана.
- **Acceptance:**
  1. Хүсэлт явж байх үед товч `disabled`, текст «Илгээж байна…» байна. Давхар дарахад хоёр дахь хүсэлт явахгүй.
  2. Амжилтын дараа form алга болж, дугаар, утас, `/products` холбоос харагдана.
- **States:**
  - busy: дээрхтэй ижил;
  - success: дугаар + «Бид таны утас руу холбогдоно» + «Каталог руу буцах»;
  - error: FR-INQ-160, FR-INQ-170-ийг үз.

#### FR-INQ-160 — Spam хязгаар
**Statement:** Нэг IP хаягаас 1 цагийн дотор 3-аас олон асуулга илгээхэд API шинэ мөр үүсгэхгүйгээр `429 RATE_LIMIT_EXCEEDED` буцаана **shall**. Web form нь «Хэт олон хүсэлт илгээсэн байна. 1 цагийн дараа дахин оролдоно уу.» гэж харуулна **shall**.
- **Rationale:** Spam-аас admin inbox-ийг хамгаална.
- **Source:** Phase0 FR-INQ-007; NFR-SEC-002 (inquiry хэсэг); v1.0 FR-05; code `backend/api/src/controllers/inquiry.controller.ts` (`RATE_LIMIT_INQUIRY_MAX`), `apps/web/src/components/public/inquiry-form.tsx:58`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/controllers/inquiry.controller.ts`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («rate limit → 429 after the cap»). Production утга 3 гэдгийг env config-оос inspection хийнэ.
- **Acceptance:** Cap+1 дэх хүсэлт `429` буцааж, DB-ийн мөрийн тоо cap-аас хэтрэхгүй. Production-д `RATE_LIMIT_INQUIRY_MAX=3`.
- **States:** error: дээрх мессеж. Form-ийн оруулсан утгууд хадгалагдана.

#### FR-INQ-170 — Сүлжээ ба серверийн алдаа
**Statement:** Илгээлт сүлжээний эсвэл серверийн алдаагаар бүтэлгүйтэхэд form нь оруулсан утгуудыг хадгалж, Монгол алдааны мессеж («Сүлжээний алдаа — хүсэлт илгээгдсэнгүй. Дахин оролдоно уу.») болон дахин илгээх боломжтой товчийг харуулна **shall**.
- **Rationale:** Алдаанаас гарах зам (G2: «алдаанаас гарч чадаагүй 0»).
- **Source:** code `apps/web/src/components/public/inquiry-form.tsx:57-66`
- **Priority · Phase · Status:** Must · PH4 · implemented (`apps/web/src/components/public/inquiry-form.tsx`)
- **Verification:** Test — API-г унтраасан үед илгээнэ.
- **Acceptance:** Мессеж гарч, бүх талбар утгаа хадгална. API асаасны дараа дахин дарахад амжилттай болно.
- **States:** error (дээрх). Дараагийн алхам нь «Дахин оролдох».

#### FR-INQ-180 — Нэрийг урьдчилан бөглөх
**Statement:** Нэвтэрсэн хэрэглэгч inquiry хуудсыг нээхэд систем нэрийн талбарыг `users.full_name`-ээр урьдчилан бөглөнө **may**. Профайл уншиж чадаагүй үед хоосон талбартай ажиллана **shall**.
- **Rationale:** Илгээх хугацааг богиносгоно (G2 ≤ 2 мин).
- **Source:** code `apps/web/src/app/products/[slug]/inquiry/page.tsx:40-55`
- **Priority · Phase · Status:** Could · PH4 · implemented (`apps/web/src/app/products/[slug]/inquiry/page.tsx`)
- **Verification:** Test — нэртэй customer болон зочноор шалгана.
- **Acceptance:** customer-ийн нэр талбарт харагдана. Зочинд хоосон байна. Профайлын алдаа хуудсыг эвдэхгүй.

#### FR-INQ-200 — Өөрийн асуулгын түүх
**Statement:** Нэвтэрсэн customer өөрийн илгээсэн асуулгуудыг харна **shall**.
- **Rationale:** Хариу хүлээж буй хэрэглэгчид итгэл төрүүлнэ (G2).
- **Source:** v1.0 FR-06
- **Priority · Phase · Status:** Must · PH4 · implemented
- **Verification:** children

#### FR-INQ-210 — Түүх жагсаах
**Statement:** `GET /api/v1/inquiries/mine` нь зөвхөн баталгаажсан хэрэглэгчийн `customer_id`-тай асуулгыг newest-first дарааллаар дугаар, бүтээгдэхүүн, огноо, төлөвтэй буцаана **shall**. Зочинд `401` буцаана **shall**. `/profile` хуудас түүнийг харуулна **shall**.
- **Rationale:** Хувийн өгөгдлийн тусгаарлалттай түүх.
- **Source:** v1.0 FR-06; code `backend/api/src/controllers/inquiry.controller.ts:35`, `apps/web/src/components/public/inquiry-history.tsx`
- **Priority · Phase · Status:** Must · PH4 · implemented (`apps/web/src/components/public/inquiry-history.tsx`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («/inquiries/mine → own only; anon → 401»)
- **Acceptance:** A-ийн хариунд B-ийн мөр байхгүй. Дараалал `created_at desc`. anon → `401`.
- **States:**
  - loading: skeleton эсвэл «Ачаалж байна…»;
  - empty: «Танд одоогоор хүсэлт алга» + «Каталог үзэх» холбоос;
  - error: «⚠ <мессеж>» + дахин ачаалах боломж.

#### FR-INQ-300 — Admin inbox
**Statement:** Admin бүх асуулгыг нэг inbox-оос харж, шүүж, төлөвийг нь удирдана **shall**.
- **Rationale:** G2: асуулга бүрт 1 ажлын өдөрт хариулах.
- **Source:** Phase0 FR-INQ-004…006; FR-ADM-006; v1.0 FR-07…09
- **Priority · Phase · Status:** Must · PH4 · implemented
- **Verification:** children

#### FR-INQ-310 — Inbox жагсаах
**Statement:** `GET /api/v1/admin/inquiries` нь асуулгыг `created_at desc` дарааллаар, `page` (≥ 1, default 1) болон `limit` (1–50, default 12)-аар хуудаслаж, `{data, meta}` хэлбэрээр буцаана **shall**. `/admin/inquiries` хуудас нь нэр, утас, бүтээгдэхүүн, огноо, төлөвийг хүснэгтээр харуулна **shall**.
- **Rationale:** Шинэ асуулгыг эхэнд харна.
- **Source:** Phase0 FR-INQ-004; v1.0 FR-07; code `backend/api/src/controllers/admin/inquiry.controller.ts`, `apps/web/src/components/admin/inquiry-table.tsx`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/repositories/supabase/inquiry.repository.ts:39`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («GET /admin/inquiries → data+meta newest-first; anon 401 / customer 403»)
- **Acceptance:** Хоёр өөр огноотой fixture дээр шинэ нь эхэнд гарна. `meta`-д page, limit, total байна. anon → `401`, customer → `403`.
- **States:**
  - loading;
  - empty: «Хүсэлт алга» (filter идэвхтэй бол «Шүүлтүүрт тохирох хүсэлт алга» + «Шүүлтүүр арилгах»);
  - error: мессеж + дахин ачаалах.

#### FR-INQ-320 — Inbox шүүх
**Statement:** Admin inbox-ийг `status`, `product_id`, `date_from`, `date_to`-ээр шүүхэд систем бүх идэвхтэй нөхцөлийг зэрэг хангасан мөрийг л буцаана **shall**. Буруу query-д `400 VALIDATION_ERROR` буцаана **shall**.
- **Rationale:** Хариулаагүй (`new`) асуулгыг шуурхай олно.
- **Source:** Phase0 FR-INQ-006 (зөвхөн status); v1.0 FR-08 (product/date нэмсэн); code `packages/validation-schemas/src/inquiry.schema.ts` (`adminInquiryListQuerySchema`)
- **Priority · Phase · Status:** Should · PH4 · implemented (`backend/api/src/repositories/supabase/inquiry.repository.ts`). Date filter-ийн тест байхгүй.
- **Verification:** Test — `inquiry-cart.integration.test.ts` («filters by status + product_id»). Огнооны filter-ийн тест planned.
- **Acceptance:** Filter бүр болон хослол бүрийн хариу нь хүлээгдэх ID-тай яг таарна. `status=foo` үед `400`.
- **States:** empty-filter нь FR-INQ-310-ийг үз.

#### FR-INQ-330 — Төлөв шинэчлэх
**Statement:** Admin `PATCH /api/v1/admin/inquiries/{id}/status`-аар `new`, `contacted`, `closed`-ийн аль нэгийг өгөхөд систем шинэ төлөвтэй мөрийг `200`-аар буцааж, audit log-д бүртгэнэ **shall**. Буруу утганд `400`, байхгүй ID-д `404 INQUIRY_NOT_FOUND` буцаана **shall**. Web хүснэгт нь мөр бүрт дараагийн алхмыг (new→«Холбогдсон», contacted→«Хаах») санал болгож, `closed`-ийг `contacted` руу дахин нээх боломж олгоно **shall**.
- **Rationale:** Хариу өгсөн эсэхийг хянах (G2 хэмжүүр).
- **Source:** Phase0 FR-INQ-005; v1.0 FR-09; code `backend/api/src/services/inquiry.service.ts:114`, `apps/web/src/components/admin/inquiry-table.tsx:23-28`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/services/inquiry.service.ts`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («PATCH … → 200; unknown 404; customer 403»). Audit мөрийн шалгалт planned.
- **Acceptance:**
  1. Зөв утга бүрт `200` буцаж, audit-д `action`, `entity_id`, шинэ status бүхий мөр нэмэгдэнэ.
  2. `status=done` → `400`. Байхгүй ID → `404`. customer → `403`.
- **States:**
  - busy: тухайн мөрийн товч идэвхгүй;
  - error: мөр дээр inline мессеж, төлөв хуучнаараа;
  - success: badge шинэчлэгдэнэ.

#### FR-INQ-340 — Хариу өгөх хугацааг харагдуулах
**Statement:** Admin inbox нь `new` төлөвтэй асуулга бүрт үүссэнээс хойш өнгөрсөн хугацааг харуулж, 1 ажлын өдрөөс (24 цаг, амралтын өдрийг тооцохгүй) хэтэрсэн асуулгыг текст шошгоор («Хугацаа хэтэрсэн») тэмдэглэнэ **may**.
- **Rationale:** G2-ийн «1 ажлын өдөрт хариулах» зорилтыг өдөр тутам хянах. Хэмжилтийг audit log-ийн status-change огнооноос гаргана.
- **Source:** docs/project/project-goals.md G2 (шинэ)
- **Priority · Phase · Status:** Could · PH5 · planned
- **Verification:** Test — 2 ажлын өдрийн өмнө үүссэн `new` fixture дээр шалгана.
- **Acceptance:** Шошго зөвхөн хугацаа хэтэрсэн `new` мөр дээр гарна. Өнгөөр дангаар бус, текстээр илэрхийлэгдэнэ.

### 4.8 Хадгалсан бүтээгдэхүүн (FR-WISH)

#### FR-WISH-100 — Wishlist
**Statement:** Нэвтэрсэн хэрэглэгч нийтлэгдсэн бүтээгдэхүүнийг хадгалж, жагсаалтаа харж, хасна **shall**. Wishlist нь тоо хэмжээ, нийт үнэ, checkout агуулахгүй **shall**.
- **Rationale:** Шийдвэр гаргахаас өмнө бараагаа хадгалах (G2). Сагс/захиалга (ORD) PH8 хүртэл идэвхгүй.
- **Source:** v1.0 FR-10…14; M2 FR-02; roadmap Phase 4 «Wishlist / cart draft»; migration `20260726120000_inquiry_customer_and_cart.sql`
- **Priority · Phase · Status:** Must · PH4 · implemented
- **Verification:** children

#### FR-WISH-110 — Нэвтрэлт шаардах
**Statement:** Зочин `/wishlist` нээхэд систем `/login?next=/wishlist` руу шилжүүлнэ **shall**. Зочин бүтээгдэхүүн дээрх «Хадгалах» товч дарахад `/login?next=<одоогийн зам>` руу шилжүүлнэ **shall**. Token-гүй `GET/POST/DELETE /api/v1/cart*` хүсэлт бүрд `401` буцаана **shall**.
- **Rationale:** Wishlist нь хувийн өгөгдөл.
- **Source:** v1.0 FR-10; code `apps/web/src/app/wishlist/page.tsx:22`, `apps/web/src/components/public/save-button.tsx:56`
- **Priority · Phase · Status:** Must · PH4 · implemented (`apps/web/src/app/wishlist/page.tsx`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («cart routes require auth → 401 anon») + page redirect шалгалт.
- **Acceptance:** Гурван endpoint `401`. Хуудас болон товчны redirect нь зөв `next`-тэй.

#### FR-WISH-120 — Хадгалах
**Statement:** Нэвтэрсэн хэрэглэгч нийтлэгдсэн бүтээгдэхүүнийг хадгалахад систем `(user_id, product_id)` мөр үүсгэж `201` буцаана **shall**. Draft, archived эсвэл байхгүй бүтээгдэхүүнд `404` буцаана **shall**.
- **Rationale:** Зөвхөн зочинд харагдах бүтээгдэхүүнийг хадгална.
- **Source:** v1.0 FR-11; M2 FR-02; code `backend/api/src/services/cart.service.ts`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/controllers/cart.controller.ts`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («POST /cart draft product → 404», «unknown product → 404»)
- **Acceptance:** published → `201` + 1 мөр. draft/unknown → `404`, мөр үүсэхгүй.
- **States:**
  - busy: товч идэвхгүй;
  - success: товч «Хадгалсан» төлөвт шилжиж, `aria-pressed=true`;
  - error: товчны дэргэд мессеж гарч, төлөв буцна.

#### FR-WISH-130 — Давхардлыг хориглох
**Statement:** Нэг хэрэглэгч нэг бүтээгдэхүүнийг давтан хадгалахад систем хамгийн ихдээ нэг `(user_id, product_id)` мөр хадгална **shall**. Давтсан хүсэлт ч амжилттай (`201`) хариу авна **shall**.
- **Rationale:** Idempotent хадгалалт. Давхар карт харуулахгүй.
- **Source:** v1.0 FR-12; M2 FR-02; code `supabase/migrations/20260726120000_inquiry_customer_and_cart.sql` (`unique (user_id, product_id)`), `backend/api/src/repositories/supabase/cart.repository.ts:55-85`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/repositories/supabase/cart.repository.ts`)
- **Verification:** Test — `inquiry-cart.integration.test.ts` («add published product (idempotent)»)
- **Acceptance:** Хоёр POST хоёул `201` буцаана. DB болон `GET /cart`-ийн тоо 1 байна.

#### FR-WISH-140 — Wishlist жагсаах
**Statement:** `GET /api/v1/cart` нь зөвхөн баталгаажсан хэрэглэгчийн хадгалсан бүтээгдэхүүнийг `created_at desc` дарааллаар нэр, үндсэн зураг, үнэ, stock status-тай буцаана **shall**. `/wishlist` хуудас тэдгээрийг карт хэлбэрээр харуулна **shall**.
- **Rationale:** Хадгалсан бараагаа буцаж олох.
- **Source:** v1.0 FR-13; code `backend/api/src/repositories/supabase/cart.repository.ts:45-50`, `apps/web/src/components/public/wishlist-grid.tsx`
- **Priority · Phase · Status:** Must · PH4 · implemented (`apps/web/src/components/public/wishlist-grid.tsx`)
- **Verification:** Test — A/B хэрэглэгч, хоёр огноо, хоосон бүртгэлийн fixture дээр шалгана. Одоогийн тест нь хоосон болон нэмэлтийг шалгадаг. Ownership-ийн A/B тест planned.
- **Acceptance:** A-ийн хариунд зөвхөн A-ийн бараа байна. Дараалал зөв. Талбарууд бүрэн.
- **States:**
  - loading;
  - empty: «Хадгалсан бүтээгдэхүүн алга» + «Каталог үзэх» холбоос;
  - error: «⚠ Ачаалж чадсангүй» + дахин ачаалах.

#### FR-WISH-150 — Wishlist-ээс хасах
**Statement:** `DELETE /api/v1/cart/{productId}` нь баталгаажсан хэрэглэгчийн тухайн мөрийг устгаж `204` буцаана **shall**. Байхгүй мөрийг дахин устгахад мөн `204` буцаана **shall**. Бусад хэрэглэгчийн мөрийг өөрчлөхгүй **shall**. UI картыг шууд арилгана **shall**.
- **Rationale:** Idempotent устгалт. Хадгалсан бараа буцаан нэмж болдог тул баталгаажуулах dialog шаардлагагүй.
- **Source:** v1.0 FR-14; M2 FR-02; code `backend/api/src/repositories/supabase/cart.repository.ts:88-97`, `apps/web/src/lib/wishlist-store.ts`
- **Priority · Phase · Status:** Must · PH4 · implemented (`backend/api/src/controllers/cart.controller.ts`)
- **Verification:** Test — A, B хоёр ижил бүтээгдэхүүн хадгалсан үед A хоёр удаа DELETE хийнэ.
- **Acceptance:** Хоёр DELETE хоёул `204`. A-д 0, B-д 1 мөр үлдэнэ.
- **States:**
  - busy: картын товч идэвхгүй;
  - error: мессеж гарч, карт буцаж харагдана;
  - empty: сүүлийн картыг хассаны дараа FR-WISH-140-ийн empty төлөв.

### 4.9 Admin панел (FR-ADM)

#### FR-ADM-100 — Admin хэсэгт хандах эрх
**Statement:** `/admin` доорх бүх хуудсыг зөвхөн `role=admin` нэвтэрсэн хэрэглэгч нээнэ **shall**.
- **Source:** Phase0 FR-ADM-001, 002; `apps/web/src/app/admin/layout.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-ADM-110 — Нэвтрээгүй хандалт
**Statement:** Нэвтрээгүй хэрэглэгч `/admin` доорх аль нэг URL-ийг нээхэд систем `/login?next=/admin` руу redirect хийнэ **shall**.
- **Source:** Phase0 FR-ADM-002; `admin/layout.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — cookie-гүйгээр `/admin/products` нээх (planned)
- **Acceptance:** `/login` руу redirect, admin контент HTML-д агуулагдахгүй.

#### FR-ADM-120 — Admin биш хэрэглэгчийн хандалт
**Statement:** `role=customer` хэрэглэгч `/admin` доорх URL-ийг нээхэд систем нүүр хуудас руу redirect хийнэ **shall**. API нь бие даан `403`-ийг буцаана **shall**.
- **Source:** `admin/layout.tsx`; NFR-SEC-009 (defense in depth)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — customer session-ээр `/admin` болон `GET /api/v1/admin/products`
- **Acceptance:** `/` руу redirect; API `403`.

#### FR-ADM-200 — Хянах самбарын тоо
**Statement:** `/admin` нүүр хуудас нийт бүтээгдэхүүний тоо (төлөв тус бүрээр), inquiry-ийн тоо (`new`/`contacted`/`closed`), featured бүтээгдэхүүний тоог харуулна **shall**. Мөн `new` inquiry-тэй бол inbox руу шууд холбоос харуулна **shall**.
- **Rationale:** Guide §2 — dashboard нь «яг одоо юунд анхаарах вэ?»-д хариулна. G2: 1 ажлын өдөрт хариулах.
- **Source:** Phase0 FR-ADM-003; `apps/web/src/app/admin/page.tsx` (placeholder)
- **Priority · Phase · Status:** Should · PH5 · planned
- **Verification:** Test — мэдэгдэж буй fixture-ээр тоог шалгах
- **Acceptance:** Тоо бүр DB-ийн тоотой таарна. `new` inquiry 0 үед холбоос нь «Шинэ хүсэлт алга» текст болно.
- **States:** loading / error — тоо тус бүрийн оронд «—» ба дахин ачаалах; success — тоо.

#### FR-ADM-300 — Бүтээгдэхүүний удирдлагын UI
**Statement:** Admin бүтээгдэхүүнийг жагсаах, үүсгэх, засах, нийтлэх, архивлах, устгах интерфэйстэй байна **shall**.
- **Source:** Phase0 FR-ADM-004
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### FR-ADM-310 — Бүтээгдэхүүний жагсаалт
**Statement:** `/admin/products` нь бүх төлөвийн бүтээгдэхүүнийг төлөв, ангилал, хайлтын шүүлтүүр, хуудаслалттайгаар харуулна **shall**.
- **Source:** `apps/web/src/components/admin/product-table.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Demonstration — draft/published/archived fixture-ээр
- **Acceptance:** Шүүлтүүр бүр зөв мөрийг үлдээнэ.
- **States:** loading — skeleton/«Ачаалж байна»; empty — «Бүтээгдэхүүн алга» + «Шинэ бүтээгдэхүүн» холбоос; error — алдааны текст + дахин оролдох; success — хүснэгт.

#### FR-ADM-320 — Бүтээгдэхүүн үүсгэх form
**Statement:** `/admin/products/new` нь FR-PROD-110-ийн талбарууд болон олон зургийн байршуулалттай form-ыг харуулна **shall**. «Ноорог хадгалах», «Нийтлэх» гэсэн хоёр үйлдэлтэй байна **shall**. Зургийн байршуулалт явцын хувийг харуулж, бүтэлгүйтвэл бүтээгдэхүүнийг алдалгүй «Дахин оролдох» сонголт өгнө **shall**.
- **Source:** `apps/web/src/components/admin/product-form.tsx` (`uploading`, `upload-failed`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Demonstration — сүлжээг тасалж байршуулах
- **Acceptance:** Байршуулалт бүтэлгүйтэхэд бүтээгдэхүүн хадгалагдсан хэвээр, retry товч ажиллана.
- **States:** busy — товчнууд disabled + явцын хувь; error — талбар бүрийн доор шалтгаан; success — жагсаалт руу буцна.

#### FR-ADM-330 — Бүтээгдэхүүн засах хуудас
**Statement:** `/admin/products/{id}` хуудас дараахыг хийх боломжтой байна **shall**:
- бүтээгдэхүүний бүх талбарыг (`search_tags` орно) урьдчилан бөглөгдсөн form-оор засах;
- зураг нэмэх, эрэмбэлэх, alt текст өгөх, устгах (FR-MEDIA-140/150).
- **Rationale:** G1 — контент оруулахад зайлшгүй. Одоо ийм хуудас байхгүй, жагсаалтаас засах холбоос алга.
- **Source:** Phase0 FR-ADM-004, FR-PROD-002, FR-PUB-015, FR-MEDIA-005/006; `apps/web/src/app/admin/products/` (зөвхөн `page.tsx`, `new/`)
- **Priority · Phase · Status:** Must · PH3 · planned
- **Verification:** Test — талбар засаад хадгалах, зураг эрэмбэлэх, устгах (e2e)
- **Acceptance:** 1) Хадгалсан өөрчлөлт нийтийн хуудсанд харагдана. 2) Зургийн эрэмбэ солигдоно. 3) Мэдэгдэхгүй id → «олдсонгүй» төлөв.
- **States:** loading — form skeleton; error — ачаалах эсвэл хадгалах алдааны шалтгаан; busy — хадгалах товч disabled; success — «Хадгалагдлаа».

#### FR-ADM-340 — Жагсаалтаас төлөв солих
**Statement:** Жагсаалтын мөр бүрээс «Нийтлэх/Нийтлэлээс авах», «Архивлах», «Бүрмөсөн устгах» үйлдлийг хийх боломжтой байна **shall**. Үйлдлийн дараа жагсаалт дахин ачаалагдана **shall**.
- **Source:** `product-table.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Demonstration
- **Acceptance:** Үйлдэл бүрийн дараа мөрийн төлөв шинэчлэгдэнэ. Алдаа гарвал мөр хуучин төлөвтэйгээ үлдэж, шалтгаан харагдана.

#### FR-ADM-400 — Ангиллын удирдлагын UI
**Statement:** `/admin/categories` нь ангиллыг бүтээгдэхүүний тоотойгоор жагсааж, үүсгэх, засах, идэвхжүүлэх/идэвхгүй болгох, хоосон ангиллыг устгах боломжийг өгнө **shall**. Бүтээгдэхүүнтэй ангиллын устгах товч идэвхгүй байна **shall**.
- **Source:** Phase0 FR-ADM-005; `apps/web/src/components/admin/category-table.tsx`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Demonstration
- **Acceptance:** Бүтээгдэхүүнтэй ангилалд устгах боломжгүй. Toggle амжилтгүй бол буцаж хуучин төлөвтэй болно.
- **States:** loading / empty («Ангилал алга») / error / success.

#### FR-ADM-500 — Хүргэлтийн тохиргооны хуудас
**Statement:** Admin тохиргооны хуудаснаас `delivery_enabled`-ийг асаах/унтраах боломжтой байна **shall**. Асаахаас өмнө FR-ADM-710-ийн баталгаажуулалтыг харуулна **shall**.
- **Rationale:** Захиалга/хүргэлт PH8. Энэ release-д toggle-ийг асаах шаардлагагүй, утга нь `false` seed-ээр тогтсон.
- **Source:** Phase0 FR-ADM-007; `admin/layout.tsx` («Тохиргоо (Phase 5)» placeholder холбоос)
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Test — PH8-д
- **Acceptance:** PH8-д.

#### FR-ADM-700 — Буцаах боломжгүй/хор хөнөөлтэй үйлдлийн баталгаажуулалт
**Statement:** Admin өгөгдөл устгах, нийтээс нуух эсвэл системийн зан төлөвийг өөрчлөх үйлдэл хийхээс өмнө систем баталгаажуулалт асууна **shall**.
- **Rationale:** Guide §2 — баталгаажуулалт нь action + impact + risk + reversibility-г харуулна (F-02). «OK/Cancel» хангалтгүй.
- **Source:** Phase0 FR-ADM-008; `apps/web/src/components/admin/ui.tsx` (`ConfirmDialog`)
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### FR-ADM-710 — Баталгаажуулалтын агуулга
**Statement:** Дараах үйлдэлд баталгаажуулах цонх 4 зүйлийг харуулна **shall**:
- үйлдлүүд: бүтээгдэхүүн архивлах, бүтээгдэхүүн бүрмөсөн устгах, ангилал устгах, зураг устгах, `delivery_enabled` солих (PH8);
- **action:** юу хийгдэх, объектын нэр;
- **impact:** нийтийн сайтад юу өөрчлөгдөх, хамт устах зургийн тоо;
- **risk:** анхаарах зүйл;
- **reversibility:** «дараа сэргээж болно» эсвэл «буцаах боломжгүй».
- **Source:** Phase0 FR-ADM-008; `product-table.tsx`, `category-table.tsx`
- **Priority · Phase · Status:** Must · PH3 · partial. Бүтээгдэхүүн/ангиллын текстэд action болон reversibility байна. Зургийн тоо (impact) болон зураг устгах баталгаажуулалт байхгүй.
- **Verification:** Inspection — үйлдэл бүрийн цонхны текстийг 4 элементийн checklist-ээр
- **Acceptance:** 5 үйлдэл тус бүрийн цонхонд 4 элемент бүгд байна. Жишээ: «"Ногоон Дарь Эх"-ийг бүрмөсөн устгах уу? 4 зураг хамт устана. Нийтийн холбоос 404 болно. Буцаах боломжгүй.»

#### FR-ADM-720 — Баталгаажуулах цонхны зан төлөв
**Statement:** Баталгаажуулах цонх нь дараахыг хангана **shall**:
- `role="dialog"` / native `<dialog>`, `aria-modal`, гарчгаар accessible name-тэй;
- нээгдэхэд focus «Болих» товч дээр очно;
- Escape болон «Болих» нь өгөгдөл өөрчлөхгүйгээр хаана;
- хаагдсаны дараа focus үйлдлийг дуудсан товч руу буцна.
- **Rationale:** Guide §5 «Dialog = зан үйл». Буцаах боломжгүй үйлдлийн default нь аюулгүй сонголт.
- **Source:** `ui.tsx` (`Modal` нь `div`; role, Escape, focus удирдлага байхгүй)
- **Priority · Phase · Status:** Must · PH5 · planned
- **Verification:** Test — keyboard-оор (Tab, Escape) Playwright; axe
- **Acceptance:** 1) Escape → цонх хаагдана, хүсэлт явахгүй. 2) Focus trigger руу буцна. 3) axe «dialog name» алдаагүй.

#### FR-ADM-730 — Батлах товчны ялгарал
**Statement:** Буцаах боломжгүй үйлдлийн батлах товч нь үйлдлийн нэрийг агуулсан шошготой (жишээ «Бүрмөсөн устгах»), энгийн товчноос өнгө болон текстээр ялгаатай байна **shall**. «OK»/«Тийм» гэсэн шошго хэрэглэхгүй **shall**.
- **Source:** `ConfirmDialog` (`confirmLabel`)
- **Priority · Phase · Status:** Should · PH3 · implemented
- **Verification:** Inspection
- **Acceptance:** Бүх баталгаажуулах цонхны батлах товч нь үйл үгтэй.

### 4.10 Системийн тохиргоо (FR-SET)

#### FR-SET-100 — Тохиргооны хадгалалт
**Statement:** Систем ажиллагааны тохиргоог key-value хэлбэрээр хадгалж, зөвхөн admin-д өөрчлүүлнэ **shall**.
- **Source:** Phase0 FR-SET-001…003, 006
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### FR-SET-110 — `system_settings` хүснэгт
**Statement:** Систем `system_settings` хүснэгтэд тохиргоог (`key`, jsonb `value`, `updated_at`) хадгална **shall**. Мөрийг migration-аар үүсгэж, зөвхөн update хийнэ **shall** (INSERT/DELETE policy байхгүй).
- **Source:** Phase0 FR-SET-001; `supabase/migrations/20260716154417_init_schema.sql`, `20260716154420_rls_policies.sql`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Inspection — migration ба RLS
- **Acceptance:** Хүснэгт ба policy байна. Admin биш хэрэглэгчийн insert/delete амжилтгүй.

#### FR-SET-120 — `delivery_enabled` default
**Statement:** Систем `delivery_enabled` тохиргоог `false` утгатайгаар seed хийнэ **shall**.
- **Source:** Phase0 FR-SET-002; ADR-002; `20260716154422_seed_system_settings.sql`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — `supabase db reset`-ийн дараа `GET /settings/public` → `false`
- **Acceptance:** `delivery_enabled=false`.

#### FR-SET-130 — Зөвхөн admin өөрчилнө
**Statement:** Систем `system_settings`-ийн update-ийг зөвхөн admin-д зөвшөөрнө **shall**. Customer эсвэл anon-ийн update нь мөрийг өөрчлөхгүй **shall**.
- **Source:** Phase0 FR-SET-003; RLS `system_settings_update_admin`. Admin API endpoint байхгүй.
- **Priority · Phase · Status:** Must · PH3 · partial (RLS бий; admin update endpoint PH8)
- **Verification:** Test — customer session-ээр Supabase update оролдох
- **Acceptance:** Customer update → 0 мөр өөрчлөгдөнө.

#### FR-SET-140 — Toggle-ийн тархах хугацаа
**Statement:** Admin `delivery_enabled`-ийг өөрчилснөөс хойш 60 секундийн дотор `GET /api/v1/settings/public` шинэ утгыг буцаана **shall**.
- **Source:** Phase0 FR-SET-006
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred (endpoint одоо DB-ээс шууд уншдаг)
- **Verification:** Test — PH8-д: toggle солиод 60 s хүртэл 5 s тутам GET хийх
- **Acceptance:** ≤ 60 s-д шинэ утга.

#### FR-SET-200 — Хүргэлтийн хаалт
**Statement:** `delivery_enabled=false` үед систем ямар ч замаар шинэ захиалга үүсгэхийг зөвшөөрөхгүй байна **shall**.
- **Rationale:** ADR-002, `delivery_enabled=false` хүчинтэй.
- **Source:** Phase0 FR-SET-004, FR-ORD-008, NFR-SCA-003
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### FR-SET-210 — API-ийн захиалгын хаалт
**Statement:** `delivery_enabled=false` үед захиалга үүсгэх API (`POST /api/v1/orders`) нь `403` болон `FEATURE_DISABLED` кодтой алдааг буцааж, мөр үүсгэхгүй **shall**.
- **Rationale:** Энэ release-д захиалгын route огт бүртгэгдээгүй (хүсэлт `404`). Энэ нь хаалтыг хангаж байгаа ч Phase 0-ийн `403` гэрээтэй таарахгүй. PH8-д route нэмэхдээ service-ийн хаалтыг заавал оруулна.
- **Source:** Phase0 FR-SET-004, FR-ORD-008; `supabase/migrations/20260716154420_rls_policies.sql` (тайлбар: «gate enforced at the SERVICE layer»)
- **Priority · Phase · Status:** Must · PH8 · partial (route байхгүй → захиалга үүсэхгүй; `403` хэрэгжээгүй)
- **Verification:** Test — `POST /api/v1/orders` → энэ release-д `404`, PH8-аас `403` (toggle false)
- **Acceptance:** Аль ч тохиолдолд `orders` хүснэгтэд мөр нэмэгдэхгүй.

#### FR-SET-220 — DB түвшний захиалгын хаалт
**Statement:** `delivery_enabled=false` үед нэвтэрсэн customer Supabase client-ээр `orders` эсвэл `order_items`-д шууд insert хийх оролдлого амжилтгүй болно **shall**.
- **Rationale:** RLS `orders_insert_own` нь toggle-ийг шалгадаггүй тул API-г тойрох зам нээлттэй байж болзошгүй (table grants-аас хамаарна). Consistency (FR-SET-210) болон defense in depth.
- **Source:** `20260716154420_rls_policies.sql` (`orders_insert_own`), `20260719104500_table_grants.sql`
- **Priority · Phase · Status:** Must · PH3 · unknown (not checked: grants-ийн бодит үр дүнг runtime дээр шалгаагүй)
- **Verification:** Test — customer JWT-ээр `supabase.from('orders').insert(...)`
- **Acceptance:** Insert амжилтгүй (RLS эсвэл permission алдаа), мөр нэмэгдэхгүй.

### 4.11 Нээлтийн интро (FR-INTRO)

> Чиглэл: [D-08](../../agent-context/DECISIONS.md) Concept C. Интро нь click/tap/товчлуураар удирдагдах 4 алхамтай тойрог камерын хөдөлгөөн, эцэст нь «Эхлэх» товчтой. Хуучин 5 секундийн автомат arc (WF-INTRO-02) энэ шаардлагаар орлогдоно. Үйлчлэх зорилго: G3. Production код одоогоор автомат arc-тай тул доорх ихэнх шаардлага `partial` эсвэл `planned`. Лавлах хэрэгжилт нь `docs/nogoolin-prototype-c.html`.

#### FR-INTRO-100 — Интроны дараалал
**Statement:** Нүүр хуудсанд анх орох үед систем Green Tara дүрс бүхий 3D интрог хэрэглэгчийн 4 удаагийн үйлдлээр урагшилдаг дараалалтайгаар харуулж, эцэст нь «Эхлэх» товч болон уриа өгүүлбэрийг гаргана **shall**.
- **Rationale:** Брэндийн premium мэдрэмж (G3), owner-ийн шийдвэр D-08.
- **Source:** Phase0 FR-3D-001…004, FR-3D-008; D-08; owner-ийн 2026-10-14-ний click-intro хүсэлт
- **Priority · Phase · Status:** Must · PH5 · partial (`apps/web/src/components/intro/hero-intro.tsx` — автомат arc, click-алхам байхгүй)
- **Verification:** children

#### FR-INTRO-110 — Session бүрт нэг удаа автоматаар харуулах
**Statement:** Browser session-д интро хараахан үзэгдээгүй (`sessionStorage['nogoolin-intro-seen']` тохируулагдаагүй) үед `/`-д орох үед систем интрог эхлүүлнэ. Нэг session-д интро дууссан эсвэл алгасагдсаны дараа `/`-д дахин ороход шууд нүүрний hero-г харуулна **shall**.
- **Rationale:** Давтан зочлогчийн хугацааг хэмнэх.
- **Source:** Phase0 FR-3D-001, FR-3D-008 (Should→Must, «minimal version» гэсэн олон утгыг хассан); WF-INTRO-08
- **Priority · Phase · Status:** Must · PH5 · implemented (`apps/web/src/components/intro/intro-config.ts` `INTRO_SEEN_KEY`, `hero-intro.tsx:73`)
- **Verification:** Test — шинэ session-д интро эхэлнэ; skip хийгээд reload хийхэд интро гарахгүй; шинэ tab/session-д дахин гарна.
- **Acceptance:** 1) sessionStorage хоосон → интроны 1-р алхам харагдана. 2) Түлхүүр `1` болсны дараа reload → hero шууд, canvas-ийн интро алхам 0.
- **States:** loading — алхмын өмнө ≤ 900 ms ачааллын төлөв (FR-INTRO-340); success — 1-р алхам.

#### FR-INTRO-120 — Дүрсийн байрлал ба хөдөлгөөнгүй байдал
**Statement:** Интроны турш Green Tara дүрс нь дэлхийн координатад байрлал, эргэлтээ өөрчлөхгүй. Дүрсийг кадрын баруун хэсэгт байрлуулахдаа `camera.setViewOffset` асимметр проекц ашиглана; камерыг хажуу тийш шилжүүлэхгүй **shall**.
- **Rationale:** v4-ийн мэдэгдэж буй алдаа (хажуу шилжилт → дүрс 10–20° эргэх мэт харагдах, halo parallax) давтагдахгүй байх.
- **Source:** Phase0 FR-3D-002; 10-roadmap Phase 3 rule; D-04; `intro-config.ts` `VIEW_OFFSET_FRACTION`
- **Priority · Phase · Status:** Must · PH5 · partial (setViewOffset хэрэгжсэн; бодит GLB байхгүй, `DEITY_GLB_URL = null`)
- **Verification:** Inspection + Demonstration — scene код дахь дүрсийн transform тогтмол; алхам бүрийн screenshot-д halo-ийн төв ба дүрсийн төвийн зөрүү ≤ 2 px.
- **Acceptance:** 1) Дүрсийн `position`/`rotation`-д frame бүрт бичилт байхгүй. 2) Камерын lookAt цэг `(0, 1.4, 0)` тогтмол.

#### FR-INTRO-130 — Камерын эхлэх байрлал
**Statement:** Интроны эхэнд камер дүрсийн баруун дээд талаас (азимут > 0, өндөр > lookAt цэг) зүүн доош харсан байрлалд байна **shall**.
- **Rationale:** Owner-ийн тодорхойлсон эхлэл; Prototype A-гийн нээлтийн кадрыг хадгалах.
- **Source:** Phase0 FR-3D-003; D-08; `intro-config.ts` `ARC`
- **Priority · Phase · Status:** Must · PH5 · implemented (одоогийн arc-ийн эхлэл `az 0.85, y 7.5`)
- **Verification:** Inspection — эхлэх pose-ийн утгууд config-д байгаа.
- **Acceptance:** Эхлэх pose-ийн азимут > 0 rad ба камерын y > 1.4.

#### FR-INTRO-140 — 4 алхамт урагшлал ба гол өгүүлбэр
**Statement:** Интро нь хэрэглэгчийн 4 үйлдлээр урагшилна. Үйлдэл нь интроны талбарт click/tap хийх эсвэл FR-INTRO-220-ийн товчлуур юм. Алхам бүрт камер дараалан зүүн → баруун → зүүн → төв байрлал руу шилжинэ. Алхам бүр нэг гол өгүүлбэрийг харуулна, тэр өгүүлбэр дараагийн алхам эхлэхэд алга болно **shall**.
- **Rationale:** Owner-ийн click-to-motion шаардлага. Хэрэглэгч хурдаа өөрөө удирдана (G3).
- **Source:** D-08; owner 2026-10-14; Prototype C `intro.js`
- **Priority · Phase · Status:** Must · PH5 · planned (зөвхөн prototype)
- **Verification:** Test — Playwright: 4 click тутамд камерын pose болон харагдаж буй өгүүлбэрийг шалгах.
- **Acceptance:** 1) Click n (n=1…4) бүрийн дараа камерын азимутын тэмдэг: + (зүүн тийш хөдөлсөн), −, +, 0 (төв) дараалалтай. 2) Нэгэн зэрэг яг нэг өгүүлбэр харагдана. 3) Шилжилт явагдаж байх үед ирсэн нэмэлт click нь алхмыг алгасахгүй (дараалалд орно эсвэл үл тоомсорлогдоно).
- **States:** busy — шилжилтийн үед курсор/товч идэвхгүй харагдана; success — өгүүлбэр гарна.

#### FR-INTRO-150 — Шилжилтийн хөдөлгөөний профайл
**Statement:** Алхам хоорондын камерын шилжилт бүр нь lookAt цэгийн эргэн тойронд тойрог (сферик координатаар интерполяц хийсэн) замаар явна. Хурд нь эхэндээ хамгийн их, төгсгөлд тэг рүү буурна (expo-out төрлийн easing). Нэг шилжилт 1.8 ± 0.1 s үргэлжилнэ **shall**.
- **Rationale:** Owner-ийн «тэсрэлттэй эхэлж, удааширч очих, circular» тодорхойлолт.
- **Source:** D-08; Prototype C (`MOVE_D 1.8s`, expo-out)
- **Priority · Phase · Status:** Must · PH5 · planned
- **Verification:** Test — шилжилтийн үеийн камерын байрлалыг 60 Hz-ээр бичиж, lookAt хүртэлх зай нь (r) шугаман интерполяцаас бусдаар өөрчлөгдөхгүй, хурд нь монотон буурч буйг шалгах.
- **Acceptance:** 1) Шилжилтийн эхний 20% хугацаанд нийт өнцгийн ≥ 50%-ийг туулна. 2) Сүүлийн 10%-д туулах өнцөг ≤ 3%. 3) Камерын замын цэг бүр lookAt-аас r(t)-ийн зайд оршино (лаг ≤ 1%).

#### FR-INTRO-160 — «Эхлэх» товч ба уриа
**Statement:** 4 дэх алхам дууссаны дараа систем «Эхлэх» товч болон брэндийн уриа өгүүлбэрийг харуулна. Товч нь native `<button>` бөгөөд 4 дэх алхмаас өмнө гарахгүй **shall**.
- **Rationale:** Интроны төгсгөл ба каталог руу орох тодорхой үйлдэл.
- **Source:** Phase0 FR-3D-004; D-08
- **Priority · Phase · Status:** Must · PH5 · partial (`hero-intro.tsx` «Эхлэх» товч нь автомат arc-ийн дараа гарна)
- **Verification:** Test
- **Acceptance:** 1) 1–3-р алхамд «Эхлэх» DOM-д харагдахгүй (эсвэл `hidden`). 2) 4-р алхмын шилжилт дуусахад ≤ 300 ms-д харагдана. 3) Уриа өгүүлбэр харагдана.

#### FR-INTRO-170 — Нүүрний hero руу шилжих
**Statement:** «Эхлэх» дарахад систем нэг canvas-ийг хадгалан интроны кадрыг нүүрний hero кадр руу 1.2 ± 0.1 s-д шилжүүлж, `sessionStorage` түлхүүрийг тавьж, хуудасны scroll-ийн түгжээг тайлна **shall**.
- **Rationale:** Интро → каталог тасралтгүй шилжилт (WF-HERO).
- **Source:** WF-HERO-05; D-08 (MORPH 1.2 s); `hero-intro.tsx` `goTo('morph')`
- **Priority · Phase · Status:** Must · PH5 · partial (morph хэрэгжсэн; хугацаа v4-ийнх)
- **Verification:** Test
- **Acceptance:** 1) Шилжилтийн дараа `document.body.style.overflow` ≠ `hidden`. 2) Шилжилтийн үед canvas элемент солигдохгүй (ижил node). 3) Түлхүүр = `1`.
- **States:** success — hero болон «Бүтээгдэхүүн үзэх» холбоос харагдана.

#### FR-INTRO-200 — Интроны удирдлага ба хүртээмж
**Statement:** Интро нь хэрэглэгчийг каталогт хүрэхээс хэзээ ч хаахгүй, гар, дэлгэц уншигч, хөдөлгөөн багасгах тохиргоотой хэрэглэгчид бүрэн ашиглагдана **shall**.
- **Rationale:** Хүртээмж (WCAG 2.1 AA, 2.2.2 Pause/Stop/Hide, 2.1.1 Keyboard); ADVANCED-WEB-GUIDE F-06.
- **Source:** Phase0 FR-3D-005, FR-3D-007, NFR-ACC-004; v1.0 NFR-02; M2 NFR-02
- **Priority · Phase · Status:** Must · PH5 · partial
- **Verification:** children

#### FR-INTRO-210 — Алгасах товч
**Statement:** «Алгасах» товч нь navigation эхэлснээс ≤ 1 s-д харагдаж, интроны бүх алхам болон 3D ачааллын үед харагдсаар байна. Дарахад шууд нүүрний hero төлөвт орж, sessionStorage түлхүүрийг тавина **shall**.
- **Source:** Phase0 FR-3D-005; WF-INTRO-05; v1.0 FR-15 (skip хэсэг)
- **Priority · Phase · Status:** Must · PH5 · implemented (одоогийн интрод, `hero-intro.tsx` эхний frame-ээс DOM товч); click-intro-д planned
- **Verification:** Test — Playwright: `page.goto('/')`-оос товч харагдах хүртэлх хугацаа; алхам бүрд visible.
- **Acceptance:** 1) Харагдах хугацаа ≤ 1000 ms (5 удаа, бүгд). 2) Дарахаас 500 ms-ийн дотор hero төлөв ба scroll чөлөөтэй.
- **States:** success — hero.

#### FR-INTRO-220 — Гарын удирдлага
**Statement:** Интро идэвхтэй үед Enter, Space эсвэл → товч нь дараагийн алхам руу шилжүүлж, Esc нь «Алгасах»-тай ижил үйлдэл хийнэ. «Алгасах» болон «Эхлэх» нь Tab-аар хүрэх боломжтой native товч байна **shall**.
- **Source:** ADVANCED-WEB-GUIDE F-06; Phase0 NFR-ACC-002
- **Priority · Phase · Status:** Must · PH5 · planned
- **Verification:** Test — Playwright keyboard-only сценари.
- **Acceptance:** 1) Хулгана ашиглахгүйгээр 4 алхам → «Эхлэх» → hero хүрнэ. 2) Esc → hero. 3) Tab дараалал: «Алгасах» → (4-р алхмын дараа) «Эхлэх».

#### FR-INTRO-230 — Хөдөлгөөн багасгах тохиргоо
**Statement:** `prefers-reduced-motion: reduce` идэвхтэй үед систем хөдөлгөөнт интрог эхлүүлэхгүй, нүүрний статик hero болон каталогийн холбоосыг navigation-аас ≤ 1 s-д харуулна. Агуулга (гарчиг, уриа, холбоос) нуугдахгүй **shall**.
- **Source:** Phase0 FR-3D-007, NFR-ACC-004; v1.0 NFR-02; M2 NFR-02 (c); WF-INTRO-06
- **Priority · Phase · Status:** Must · PH5 · implemented (`hero-intro.tsx:72–78`)
- **Verification:** Test — browser media emulation (reduce / no-preference).
- **Acceptance:** 1) reduce үед интроны алхам 0, camera arc ажиллахгүй. 2) Hero гарчиг ба `/products` холбоос ≤ 1000 ms-д харагдана. 3) no-preference үед интро эхэлнэ.

#### FR-INTRO-240 — Focus-ийн шилжилт
**Statement:** «Эхлэх» эсвэл «Алгасах» дарсны дараа систем keyboard focus-ийг нүүрний hero гарчиг (`tabindex="-1"`) руу шилжүүлнэ. Focus `<body>` руу алдагдахгүй **shall**.
- **Source:** ADVANCED-WEB-GUIDE F-06; Prototype C `focusHome`
- **Priority · Phase · Status:** Must · PH5 · planned
- **Verification:** Test — шилжилтийн дараа `document.activeElement`.
- **Acceptance:** `document.activeElement` нь hero гарчгийн элемент.

#### FR-INTRO-250 — Алхмын өгүүлбэрийг дэлгэц уншигчид мэдэгдэх
**Statement:** Алхам бүрийн гол өгүүлбэр нь `aria-live="polite"` бүсэд гарч, дэлгэц уншигчид нэг удаа уншигдана **shall**.
- **Source:** ADVANCED-WEB-GUIDE §2 (төлөвийг текстээр); WCAG 4.1.3
- **Priority · Phase · Status:** Should · PH5 · planned
- **Verification:** Inspection + Demonstration (NVDA эсвэл VoiceOver-оор нэг удаа; бүрэн SR audit биш)
- **Acceptance:** Өгүүлбэрийн элемент `aria-live="polite"` бүсийн дотор; canvas нь `aria-hidden="true"` эсвэл тайлбартай.

#### FR-INTRO-260 — Scroll түгжээ
**Statement:** Интро идэвхтэй (алхам 1–4 ба «Эхлэх» хүлээх) үед хуудасны scroll түгжигдэнэ. Hero төлөвт орох (FR-INTRO-170, -210, -230, -320) бүх замд түгжээ тайлагдана **shall**.
- **Source:** WF-INTRO-09; v1.0 FR-15 («scroll lock байхгүй»)
- **Priority · Phase · Status:** Must · PH5 · implemented (`hero-intro.tsx:118–123`)
- **Verification:** Test — зам бүрийн дараа `body.style.overflow`.
- **Acceptance:** Hero төлөвт `overflow` ≠ `hidden` (4 зам бүгд).

#### FR-INTRO-300 — Fallback
**Statement:** 3D asset байхгүй, WebGL дэмжигдэхгүй, эсвэл asset ачаалахад алдаа гарсан ямар ч үед систем хоосон дэлгэцгүйгээр hero болон каталог руу хүрэх замыг өгнө **shall**.
- **Source:** Phase0 FR-3D-006; v1.0 FR-15; M2 NFR-02
- **Priority · Phase · Status:** Must · PH5 · partial
- **Verification:** children

#### FR-INTRO-310 — GLB тохируулаагүй үед орлуулагч
**Statement:** `DEITY_GLB_URL` тохируулаагүй (`null`) үед систем процедурын орлуулагч дүрсийг ижил интроны урсгалд харуулна **shall**.
- **Source:** v1.0 FR-15; M2 NFR-02 (a); WF-INTRO-03
- **Priority · Phase · Status:** Must · PH5 · implemented (`intro-config.ts:13`, `deity.tsx`)
- **Verification:** Test
- **Acceptance:** URL `null` үед canvas-д орлуулагч дүрс, console error 0.

#### FR-INTRO-320 — WebGL байхгүй үед статик hero
**Statement:** WebGL2 болон WebGL context үүсгэж чадахгүй үед систем canvas үүсгэхгүй, статик hero зураг, гарчиг болон ажилладаг `/products` холбоосыг харуулна **shall**.
- **Source:** Phase0 FR-3D-006; v1.0 FR-15; M2 NFR-02 (b); WF-INTRO-07
- **Priority · Phase · Status:** Must · PH5 · implemented (`hero-intro.tsx:26` `webglAvailable`, `static-hero.tsx`)
- **Verification:** Test — WebGL-ийг идэвхгүй болгосон browser (`--disable-webgl`).
- **Acceptance:** 1) `<canvas>` 0. 2) `/products` холбоос дарахад жагсаалт нээгдэнэ. 3) Scroll түгжээгүй.

#### FR-INTRO-330 — GLB ачааллын алдаанаас сэргэх
**Statement:** GLB-ийн URL тохируулагдсан боловч татах (HTTP ≥ 400, сүлжээний алдаа) эсвэл parse хийх үед алдаа гарвал систем ≤ 3 s-д статик hero (FR-INTRO-320-ийн гаралт) руу шилжинэ **shall**.
- **Source:** v1.0 FR-15 «broken asset recovery is a known gap»; M2 NFR-02
- **Priority · Phase · Status:** Must · PH5 · planned
- **Verification:** Test — 404 буцаадаг URL-тай build.
- **Acceptance:** Алдааны дараа ≤ 3000 ms-д статик hero ба `/products` холбоос; хоосон canvas үлдэхгүй.
- **States:** error — хэрэглэгчид алдааны код биш, статик hero харагдана.

#### FR-INTRO-340 — Ачааллын төлөв
**Statement:** 3D scene эсвэл GLB бэлэн болох хүртэл систем ачааллын төлөвийг (брэндийн дэвсгэр + «Алгасах» товч) харуулна. Ачааллын үед хоосон цагаан эсвэл хар дэлгэц гарахгүй **shall**.
- **Source:** Phase0 NFR-PERF-005 (2-р өгүүлбэр); WF-INTRO-01; `intro-config.ts` `LOADING_MS`
- **Priority · Phase · Status:** Must · PH5 · implemented (loading phase)
- **Verification:** Test — CPU 4× throttle-оор эхний 1 s-ийн screenshot.
- **Acceptance:** Navigation-аас scene бэлэн болох хүртэлх бүх screenshot-д брэндийн дэвсгэр ба «Алгасах» харагдана.
- **States:** loading.

#### FR-INTRO-350 — Сул төхөөрөмж дээр хөнгөн горим
**Statement:** Төхөөрөмж `navigator.hardwareConcurrency ≤ 2` эсвэл `navigator.deviceMemory ≤ 2` гэж мэдээлбэл систем интроны атмосферийн эффект (бөөмс, амьсгалах гэрэл)-ийг идэвхгүй болгож болно **may**.
- **Rationale:** Phase 0-ийн «performance is insufficient» гэсэн хэмжигдэхгүй нөхцөлийг хэмжигдэх босго болгов.
- **Source:** Phase0 FR-3D-006 («performance insufficient» хэсэг)
- **Priority · Phase · Status:** Could · PH5 · planned
- **Verification:** Test — `navigator.hardwareConcurrency`-г override хийх.
- **Acceptance:** Босгоос доош үед бөөмсийн тоо 0; интроны 4 алхам хэвээр ажиллана.

### 4.12 Mobile app (FR-MOB)

> Mobile нь G6 буюу дараагийн release. Энэ release-д бүх FR-MOB нь **Won't (this release) · PH8** priority-тэй. Хэрэгжсэн хэсгийн төлөвийг бодит кодоос бүртгэв. Платформын хувилбарын шаардлага нь NFR-COMP-300 руу шилжсэн.

#### FR-MOB-100 — Mobile каталог
**Statement:** Expo app нь web-тэй ижил нийтлэгдсэн каталогийг ангиллаар шүүж, бүтээгдэхүүний дэлгэрэнгүйг харуулна **shall**.
- **Source:** Phase0 FR-MOB-002, FR-MOB-003
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial
- **Verification:** children

#### FR-MOB-110 — Ангиллын шүүлттэй жагсаалт
**Statement:** Жагсаалтын дэлгэц нь нийтлэгдсэн бүтээгдэхүүнийг харуулж, нэг мөр хэвтээ гүйдэг ангиллын chip-ээр шүүнэ **shall**.
- **Source:** Phase0 FR-MOB-002
- **Priority · Phase · Status:** Won't (this release) · PH8 · implemented (`apps/mobile/app/products/index.tsx`)
- **Verification:** Demonstration — Android dev build.
- **Acceptance:** Chip сонгоход зөвхөн тухайн ангиллын бүтээгдэхүүн; «Бүгд» сонголт бүгдийг буцаана.
- **States:** loading / empty («Энэ ангилалд бүтээгдэхүүн алга») / error (FR-MOB-520).

#### FR-MOB-120 — Бүтээгдэхүүний дэлгэрэнгүй
**Statement:** Дэлгэрэнгүй дэлгэц нь зураг, үнэ, тайлбар, хэрэглэх заавар, ангиллыг харуулна **shall**.
- **Source:** Phase0 FR-MOB-003 (360° хэсгийг FR-MOB-130 руу салгав)
- **Priority · Phase · Status:** Won't (this release) · PH8 · implemented (`apps/mobile/app/products/[slug].tsx`)
- **Verification:** Demonstration
- **Acceptance:** Seed бүтээгдэхүүний 5 талбар бүгд харагдана; зураггүй бол placeholder.
- **States:** loading / error / not-found («Бүтээгдэхүүн олдсонгүй» + жагсаалт руу буцах).

#### FR-MOB-130 — Mobile 360° viewer
**Statement:** Бүтээгдэхүүнд photo spin идэвхжсэн бол (FR-PUB-240) дэлгэрэнгүй дэлгэц чирж эргүүлэх 360° photo spin-ийг, байхгүй бол зургийн gallery-г харуулна **shall**.
- **Source:** Phase0 FR-MOB-003 (360° хэсэг), FR-MOB-010; D-07; D-09 (GLB viewer-ээс photo spin болгож өөрчилсөн)
- **Өмнөх (v2.0):** «Бүтээгдэхүүнд `model_3d_url` байвал дэлгэрэнгүй дэлгэц интерактив 360° viewer-ийг (`expo-gl` эсвэл WebView `model-viewer`), байхгүй бол зургийн gallery-г харуулна **shall**.» Acceptance: «GLB-тэй бүтээгдэхүүнд viewer эргэнэ; GLB-гүйд gallery.»
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred (D-07)
- **Verification:** Demonstration
- **Acceptance:** Photo spin-тэй бүтээгдэхүүнд spin эргэнэ; spin-гүйд gallery.

#### FR-MOB-300 — Mobile нээлтийн интро
**Statement:** App эхлэхэд систем Concept C-тэй нийцсэн нээлтийн анимацийг харуулж, анимаци дуусах эсвэл хэрэглэгч товших үед нүүр дэлгэц рүү шилжинэ **shall**.
- **Source:** Phase0 FR-3D-010, FR-3D-011; D-08 (WF-MO-03 орлогдсон)
- **Priority · Phase · Status:** Won't (this release) · PH8 · planned (`app.config.ts:23` Rive plugin оруулаагүй)
- **Verification:** children

#### FR-MOB-310 — Анимацийн технологи
**Statement:** Mobile интро нь `@rive-app/react-native` (ADR-004) эсвэл G6-д сонгох өөр runtime ашиглан, web-ийн C интроны алхмын дарааллыг дагасан анимацийг тоглуулна **shall**.
- **Source:** Phase0 FR-3D-010; ADR-004
- **Priority · Phase · Status:** Won't (this release) · PH8 · planned
- **Verification:** Demonstration — Android, iOS internal build.
- **Acceptance:** Хоёр платформ дээр анимаци алдаагүй тоглоно.

#### FR-MOB-320 — Нүүр дэлгэц рүү шилжих
**Statement:** Анимаци дууссан эсвэл хэрэглэгч дэлгэц товшсон үед ≤ 500 ms-д нүүр дэлгэц рүү шилжинэ; reduce motion тохиргоотой үед анимацийг алгасна **shall**.
- **Source:** Phase0 FR-3D-011
- **Priority · Phase · Status:** Won't (this release) · PH8 · planned
- **Verification:** Test
- **Acceptance:** Товшилтоос шилжилт ≤ 500 ms; OS reduce motion → анимаци 0.

#### FR-MOB-400 — Mobile inquiry
**Statement:** Зочин app-аас бүтээгдэхүүний inquiry-г web-ийн FR-INQ-тай ижил талбар, баталгаажуулалт, хариутайгаар илгээнэ **shall**.
- **Source:** Phase0 FR-MOB-004; G6
- **Priority · Phase · Status:** Won't (this release) · PH8 · planned (`apps/mobile` дотор inquiry байхгүй)
- **Verification:** Test — FR-INQ-ийн acceptance-ийг mobile дээр давтах.
- **Acceptance:** FR-INQ-ийн leaf шаардлага бүрийн acceptance mobile дээр давна.
- **States:** loading / error / success — FR-INQ-тай ижил текст.

#### FR-MOB-500 — Өгөгдөл ба сүлжээ
**Statement:** App нь web-тэй ижил REST API-г ашиглаж, сүлжээний алдааг хэрэглэгчид ойлгомжтой харуулна **shall**.
- **Source:** Phase0 FR-MOB-005…007
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial
- **Verification:** children

#### FR-MOB-510 — Нэг REST API
**Statement:** App нь бүх каталогийн өгөгдлийг `/api/v1/` REST API-аас авна; тусдаа backend эсвэл шууд DB query ашиглахгүй (auth-аас бусад) **shall**.
- **Source:** Phase0 FR-MOB-005; ADR-007
- **Priority · Phase · Status:** Won't (this release) · PH8 · implemented (`apps/mobile/lib/api.ts`)
- **Verification:** Inspection
- **Acceptance:** `apps/mobile`-д `supabase.from(` дуудлага 0 (auth-аас бусад).

#### FR-MOB-520 — Сүлжээний алдааны төлөв
**Statement:** API хүрэх боломжгүй эсвэл ≥ 500 хариу ирэхэд дэлгэц бүр Монгол хэлээр алдааны мессеж ба «Дахин оролдох» товч харуулна; техникийн алдааны код харуулахгүй **shall**.
- **Source:** Phase0 FR-MOB-006; NFR-REL-005 (чанарын тал нь NFR-REL-230)
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial (жагсаалтад «Сервертэй холбогдож чадсангүй», retry товч шалгаагүй)
- **Verification:** Test — airplane mode.
- **Acceptance:** Жагсаалт, дэлгэрэнгүй хоёулаа мессеж + retry; retry амжилттай бол өгөгдөл гарна.
- **States:** error — «Сервертэй холбогдож чадсангүй. Дахин оролдох».

#### FR-MOB-530 — Offline cache
**Statement:** App нь өмнө ачаалсан жагсаалтыг төхөөрөмжид хадгалж, сүлжээгүй үед «offline» тэмдэгтэйгээр харуулж болно **may**.
- **Source:** Phase0 FR-MOB-007
- **Priority · Phase · Status:** Won't (this release) · PH8 · planned
- **Verification:** Demonstration
- **Acceptance:** Нэг удаа ачаалсны дараа airplane mode → жагсаалт + «offline» тэмдэг.

### 4.13 Аудитын бүртгэл (FR-AUD)

#### FR-AUD-100 — Admin үйлдлийн бүртгэл
**Statement:** Систем admin-ийн өгөгдөл өөрчлөх үйлдэл бүрийг өөрчлөгдөшгүй бүртгэлд хадгална **shall**.
- **Rationale:** Хэн юуг хэзээ өөрчилснийг тогтоох. G2-ийн хариу өгөх хугацааг хэмжих эх.
- **Source:** Phase0 FR-AUD-001…005
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### FR-AUD-110 — Өөрчлөх үйлдлийг бүртгэх
**Statement:** Admin бүтээгдэхүүн, ангилал, зураг, inquiry-ийн төлөвийг үүсгэх, засах, устгах үйлдэл бүр амжилттай болсны дараа систем нэг audit мөр нэмнэ **shall**.
- **Rationale:** Хариуцлага, алдааны шинжилгээ.
- **Source:** Phase0 FR-AUD-001; code `backend/api/src/services/product.service.ts:153`, `media.service.ts:190`, `category.service.ts`, `inquiry.service.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/services/product.service.ts`). Үндсэн бичилт ба audit бичилт нь атомик биш (кодын тайлбар).
- **Verification:** Test — CRUD үйлдэл бүрийн дараа `audit_logs`-ийн мөрийн тоог шалгана (planned).
- **Acceptance:** Амжилттай үйлдэл бүрт яг 1 мөр нэмэгдэнэ. Бүтэлгүй (4xx) үйлдэлд мөр нэмэгдэхгүй.

#### FR-AUD-120 — Бүртгэлийн талбарууд
**Statement:** Audit мөр бүр `admin_id`, `action`, `entity_type`, `entity_id`, `metadata` (JSON), `created_at`-тай байна **shall**.
- **Rationale:** ER загвар (04 §3.11).
- **Source:** Phase0 FR-AUD-002; code `supabase/migrations/20260716154417_init_schema.sql:158-187`
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/migrations/20260716154417_init_schema.sql`)
- **Verification:** Inspection — schema-г шалгана.
- **Acceptance:** 6 багана байна. `admin_id`, `action`, `entity_type`, `created_at` нь `not null`.

#### FR-AUD-130 — Зөвхөн нэмэх (append-only)
**Statement:** `anon` болон `authenticated` (admin орно) role-ууд audit мөрийг засах эсвэл устгах боломжгүй байна **shall**. API-д audit засах/устгах endpoint байхгүй **shall**.
- **Rationale:** Бүртгэлийн итгэлцэл.
- **Source:** Phase0 FR-AUD-003; code `supabase/migrations/20260716154420_rls_policies.sql:254-266` (UPDATE/DELETE policy байхгүй)
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/migrations/20260716154420_rls_policies.sql`). `service_role` нь RLS-ийг тойрдог тул append-only нь API кодын дүрмээр хамгаалагдана. REVIEW-г үз.
- **Verification:** Test — admin session-ээр `update`/`delete` оролдоно. Inspection — repository-д update/delete функц байхгүй эсэхийг шалгана.
- **Acceptance:** Оролдлого бүр 0 мөрөнд нөлөөлнө эсвэл алдаа буцаана. `audit-log.repository.ts`-д зөвхөн `log` байна.

#### FR-AUD-140 — Audit log харах
**Statement:** Admin `/admin/audit` хуудсанд audit мөрийг newest-first, 20 мөрөөр хуудаслан, `action` болон `entity_type`-аар шүүж харна **shall**.
- **Rationale:** Бүртгэлийг ашиглах боломжтой болгоно.
- **Source:** Phase0 FR-AUD-004 (S)
- **Priority · Phase · Status:** Should · PH5 · planned (API/UI байхгүй, RLS `audit_logs_select_admin` бий)
- **Verification:** Test — 25 мөртэй fixture дээр шалгана.
- **Acceptance:** Эхний хуудсанд шинэ 20 мөр гарна. Filter ажиллана. customer → `403`.
- **States:** loading, empty («Бүртгэл алга»), error (дахин ачаалах).

#### FR-AUD-150 — Delivery toggle-ийг үргэлж бүртгэх
**Statement:** `delivery_enabled` тохиргоог өөрчлөх үйлдэл бүр хуучин болон шинэ утгатай audit мөр үүсгэнэ **shall**. Audit бичилт бүтэлгүйтвэл тохиргооны өөрчлөлтийг буцаана **shall**.
- **Rationale:** Хүргэлтийг идэвхжүүлэх нь бизнесийн өндөр нөлөөтэй шийдвэр (ADR-002).
- **Source:** Phase0 FR-AUD-005; FR-SET-007
- **Priority · Phase · Status:** Must · PH8 · planned (admin settings endpoint байхгүй; `backend/api/src/services/settings.service.ts` нь зөвхөн унших)
- **Verification:** Test — toggle-ийг асаах, унтраах; audit бичилтийг хүчээр алдаатай болгох.
- **Acceptance:** Өөрчлөлт бүрт `metadata.old`/`metadata.new`-тэй 1 мөр нэмэгдэнэ. Audit алдааны үед тохиргоо хуучнаараа үлдэнэ.

#### FR-AUD-160 — Эрхгүй admin оролдлогыг бүртгэх
**Statement:** Нэвтэрсэн admin биш хэрэглэгч `/api/v1/admin/*`-д хандахад систем `403` буцааж, `action=UNAUTHORIZED_ACCESS`, оролдсон route болон method-той audit мөр нэмнэ **shall**. Бүртгэлийн алдаа `403` хариуг саатуулахгүй **shall**.
- **Rationale:** Халдлагын оролдлогыг илрүүлэх (UC-ADM-011).
- **Source:** code `backend/api/src/hooks/auth.ts:65-80`
- **Priority · Phase · Status:** Should · PH3 · implemented (`backend/api/src/hooks/auth.ts`)
- **Verification:** Test — customer token-оор `/api/v1/admin/ping` дуудна.
- **Acceptance:** `403` буцаж, audit мөр нэмэгдэнэ. Audit repository алдаатай байсан ч `403` буцна.

### 4.14 Захиалга (FR-ORD)

> Энэ хэсгийн шаардлагууд архитектурын бүрэн байдлын төлөө бүртгэгдэв. Захиалгын хүснэгтүүд (`orders`, `order_items`, `delivery_assignments`) болон RLS нь migration-д идэвхгүй байдлаар бий (ADR-002). Хэрэгжүүлэлт нь `delivery_enabled=true` болсны дараа PH8-д хийгдэнэ.

#### FR-ORD-100 — Захиалга өгөх
**Statement:** `delivery_enabled=true` үед нэвтэрсэн customer захиалга өгөх боломжтой байна **shall**.
- **Source:** Phase0 FR-ORD-001…004
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** children

#### FR-ORD-110 — Захиалга үүсгэх
**Statement:** `delivery_enabled=true` үед нэвтэрсэн customer хүчинтэй захиалга илгээхэд систем захиалгыг `status=pending`-тэй хадгалж `201`-ийг буцаана **shall**.
- **Source:** Phase0 FR-ORD-001
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Test — PH8
- **Acceptance:** `201`, нэг `orders` мөр.

#### FR-ORD-120 — Захиалгын талбар
**Statement:** Захиалга бүр `customer_id`, `customer_name`, `phone`, `address`, `status`, `total_amount`-ийг хадгална **shall**.
- **Source:** Phase0 FR-ORD-002; `init_schema.sql` (`orders`)
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial (schema бий)
- **Verification:** Inspection — schema
- **Acceptance:** Багана бүгд байна.

#### FR-ORD-130 — Захиалгын мөр
**Statement:** Захиалга нь 1 буюу түүнээс олон мөртэй (`product_id`, `quantity` ≥ 1, `unit_price`) байна **shall**. `total_amount` нь Σ(`quantity` × `unit_price`)-тэй тэнцэнэ **shall**.
- **Rationale:** Phase 0-д нийлбэрийн дүрэм байгаагүй (Complete).
- **Source:** Phase0 FR-ORD-003; `order_items`
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial (schema бий)
- **Verification:** Test — PH8
- **Acceptance:** Мөргүй захиалга → `400`. Нийлбэр зөрвөл → `400`.

#### FR-ORD-140 — Захиалгын төлөв
**Statement:** Захиалгын `status` нь зөвхөн `pending`, `confirmed`, `delivering`, `completed`, `cancelled` утгатай байна **shall**.
- **Source:** Phase0 FR-ORD-004
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial (schema бий)
- **Verification:** Inspection
- **Acceptance:** Өөр утга DB-д хүлээн авагдахгүй.

#### FR-ORD-200 — Захиалгын удирдлага (admin)
**Statement:** Admin захиалгыг харах, төлөв солих, хүргэгч оноох боломжтой байна **shall**.
- **Source:** Phase0 FR-ORD-005, 006
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** children

#### FR-ORD-210 — Захиалга харах ба төлөв солих
**Statement:** Admin бүх захиалгыг шинэ нь эхэндээ дарааллаар харж, `status`-ийг солих боломжтой байна **shall**. Солилт бүр audit бичлэг үүсгэнэ **shall**.
- **Source:** Phase0 FR-ORD-005; RLS `orders_update_admin`
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Test — PH8
- **Acceptance:** Customer-ийн update → `403`.

#### FR-ORD-220 — Хүргэгч оноох
**Statement:** Admin захиалгад хүргэгч (delivery staff) оноох боломжтой байна **shall**.
- **Source:** Phase0 FR-ORD-006; `delivery_assignments`
- **Priority · Phase · Status:** Won't (this release) · PH8 · deferred
- **Verification:** Test — PH8
- **Acceptance:** Оноолт `delivery_assignments`-д хадгалагдана.

#### FR-ORD-300 — Өөрийн захиалгыг л харах
**Statement:** Customer зөвхөн өөрийн `customer_id`-тай захиалгыг уншина **shall**. Өөр хэрэглэгчийн захиалга хариунд орохгүй **shall**.
- **Source:** Phase0 FR-ORD-007; RLS `orders_select_own_or_admin`
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial (RLS бий)
- **Verification:** Test — A/B customer, PH8
- **Acceptance:** A-ийн хариунд B-ийн захиалга байхгүй.

## 5. Функциональ бус шаардлага

### 5.1 Гүйцэтгэл (NFR-PERF)

> **Хэмжилтийн дүрэм бүх NFR-PERF-д хамаарна (NFR-PERF-100).** Энд байгаа босго нь G3-тай нийцсэн **түр (provisional)** утга. PH2-ийн baseline хэмжилтийн дараа эцэслэнэ. Хэмжээгүй үр дүнг pass гэж бүртгэхгүй.

#### NFR-PERF-100 — Хэмжилтийн протокол
**Statement:** Гүйцэтгэлийн бүх шаардлагын нотолгоо нь доорх протоколын дагуу хэмжигдсэн, raw sample нь `docs/quality/perf-baseline.md`-д хадгалагдсан байна **shall**.
- **Rationale:** Хэмжилт давтагдах, metric-ийн нэр солигдохгүй байх (ADVANCED-WEB-GUIDE §1, §4, F-08).
- **Source:** ADVANCED-WEB-GUIDE F-08; v1.0 NFR-04 (10 run-ийн арга)
- **Priority · Phase · Status:** Must · PH2 · planned
- **Verification:** children

#### NFR-PERF-110 — Lab хэмжилтийн нөхцөл
**Statement:** Lab хэмжилт нь production build (`next build` + `next start` эсвэл staging) дээр, Lighthouse CLI-ийн mobile preset (simulated throttling: Slow 4G, CPU 4×), cold cache, 1 warm-up + 5 sample-аар хийгдэж, median болон min–max-аар тайлагнагдана. Browser-ийн хувилбар, viewport, DPR, seed өгөгдөл, commit hash-ийг тэмдэглэнэ **shall**.
- **Source:** ADVANCED-WEB-GUIDE §4 «Хэмжилтийг шударга тайлагнах»
- **Priority · Phase · Status:** Must · PH2 · planned
- **Verification:** Inspection — perf-baseline.md-ийн мөр бүрт 6 талбар бүрэн.
- **Acceptance:** Хэмжилтийн мөр бүр: build, preset, sample=5 (+1 warm-up), median, min–max, browser/version, commit.

#### NFR-PERF-120 — Lab ба field-ийг ялгах
**Statement:** Lab (Lighthouse) болон field (бодит хэрэглэгчийн, жишээ нь Vercel Speed Insights эсвэл CrUX) утгыг тусдаа баганад тайлагнана; lab утгыг field гэж, нэг fixture-ийн утгыг бүх төхөөрөмжийн гэж нэрлэхгүй **shall**.
- **Source:** ADVANCED-WEB-GUIDE §4
- **Priority · Phase · Status:** Must · PH6 · planned
- **Verification:** Inspection
- **Acceptance:** Тайлангийн хүснэгт бүр «lab» эсвэл «field» гэсэн тэмдэгтэй.

#### NFR-PERF-130 — Босго эцэслэх baseline
**Statement:** NFR-PERF-210…250-ийн босгыг PH2-ийн төгсгөлд `/`, `/products`, `/products/[slug]` гурван хуудсын baseline хэмжилтэд тулгуурлан owner батална; батлагдах хүртэл эдгээр нь provisional гэж тэмдэглэгдэнэ **shall**.
- **Source:** ADVANCED-WEB-GUIDE F-08; roadmap PH2
- **Priority · Phase · Status:** Must · PH2 · planned
- **Verification:** Inspection
- **Acceptance:** perf-baseline.md-д 3 хуудасны baseline; SRS-д «approved» тэмдэг.

#### NFR-PERF-200 — Хуудасны гүйцэтгэл (Web Vitals)
**Statement:** Нийтийн гол хуудсууд (`/`, `/products`, `/products/[slug]`) нь NFR-PERF-100-ийн нөхцөлд доорх босгыг хангана **shall**.
- **Rationale:** G3; Монголын mobile хэрэглэгч.
- **Source:** Phase0 NFR-PERF-001…003; v1.0 NFR-04; G3
- **Priority · Phase · Status:** Must · PH5 · unknown (хэмжээгүй)
- **Verification:** children

#### NFR-PERF-210 — Lighthouse Performance оноо
**Statement:** Гурван гол хуудас тус бүрийн Lighthouse Performance онооны median ≥ 90 байна (provisional) **shall**.
- **Rationale:** F-07: Phase 0-ийн ≥ 80 (жагсаалт), ≥ 85 (дэлгэрэнгүй) болон G3-ийн ≥ 90 гэсэн гурван өөр босгыг G3-ийн утгаар нэгтгэв.
- **Source:** Phase0 NFR-PERF-001, NFR-PERF-003; G3
- **Priority · Phase · Status:** Must · PH5 · unknown (хэмжээгүй)
- **Verification:** Test — Lighthouse CI.
- **Acceptance:** 3 хуудас тус бүрд 5 sample-ийн median ≥ 90.

#### NFR-PERF-220 — Largest Contentful Paint
**Statement:** Гурван гол хуудасны lab LCP-ийн median ≤ 2.5 s байна (provisional) **shall**.
- **Rationale:** Phase 0-ийн «2 секундэд ачаална» гэсэн олон утгатай бичлэгийг нэрлэгдсэн metric болгов; G3-ийн LCP < 2.5 s-тай нийцүүлэв.
- **Source:** Phase0 NFR-PERF-002; v1.0 NFR-04 (2.0 s, 9/10 run → LCP 2.5 s, median-аар солив; OPEN); G3
- **Priority · Phase · Status:** Must · PH5 · unknown (хэмжээгүй)
- **Verification:** Test — Lighthouse CI.
- **Acceptance:** 3 хуудас тус бүрд median LCP ≤ 2500 ms; интро идэвхтэй `/`-д LCP элемент нь canvas биш, текст эсвэл зураг.

#### NFR-PERF-230 — Cumulative Layout Shift
**Statement:** Гурван гол хуудасны lab CLS-ийн median ≤ 0.1 байна **shall**.
- **Source:** ADVANCED-WEB-GUIDE §4 CLS; G3
- **Priority · Phase · Status:** Must · PH5 · unknown (хэмжээгүй)
- **Verification:** Test — Lighthouse CI.
- **Acceptance:** median CLS ≤ 0.1, хуудас бүрд.

#### NFR-PERF-240 — Интерактивын хариу (INP / TBT)
**Statement:** Field INP-ийн 75-р percentile ≤ 200 ms байна. Field өгөгдөл байхгүй үед lab-д Total Blocking Time-ийн median ≤ 200 ms-ийг орлуулагч хэмжүүрээр ашиглаж, «TBT (lab)» гэж нэрлэнэ **shall**.
- **Source:** ADVANCED-WEB-GUIDE §4, §6 (`"use client"` хил)
- **Priority · Phase · Status:** Should · PH6 · unknown (хэмжээгүй)
- **Verification:** Test (lab TBT) + Analysis (field INP, launch-ийн дараа)
- **Acceptance:** Lab TBT median ≤ 200 ms; field INP p75 ≤ 200 ms (launch + 4 долоо хоног).

#### NFR-PERF-300 — Asset болон bundle-ийн төсөв
**Statement:** 3D, фонт, JavaScript-ийн ачаалал нь эхний будалт (first paint) болон LCP-г блоклохгүй **shall**.
- **Source:** Phase0 NFR-PERF-005, FR-3D-009; ADVANCED-WEB-GUIDE §4, §6
- **Priority · Phase · Status:** Must · PH5 · partial
- **Verification:** children

#### NFR-PERF-310 — GLB хэмжээ
**Statement:** Интроны GLB файл нь Draco (gltf-pipeline) шахалтын дараа ≤ 5 MB байна **shall**.
- **Source:** Phase0 FR-3D-009, NFR-PERF-005 (1-р өгүүлбэр); ADR-001; G3
- **Priority · Phase · Status:** Must · PH5 · planned (GLB байхгүй, `DEITY_GLB_URL = null`)
- **Verification:** Inspection — `stat -c %s` эсвэл build check script.
- **Acceptance:** Файлын хэмжээ ≤ 5 242 880 byte.

#### NFR-PERF-320 — 3D bundle-ийг хойшлуулж ачаалах
**Statement:** `three`, `@react-three/fiber`, `@react-three/drei` нь `next/dynamic` (эсвэл ижил dynamic import)-аар зөвхөн интро/hero component-д ачаалагдаж, `/`-ийн эхний render-ийн JS chunk болон бусад route-ийн chunk-д орохгүй **shall**.
- **Source:** ADVANCED-WEB-GUIDE §4 render-blocking, §6; F-09
- **Priority · Phase · Status:** Must · PH5 · implemented (`hero-intro.tsx:21` `dynamic(() => import('./intro-scene'))`)
- **Verification:** Inspection + Analysis — `next build`-ийн chunk тайлан (`@next/bundle-analyzer`).
- **Acceptance:** `/products`, `/products/[slug]`-ийн chunk-д `three` module 0; `/`-ийн эхний chunk-д 0.

#### NFR-PERF-330 — Фонт ачаалах
**Statement:** Web фонтууд нь `next/font`-оор self-host хийгдэж (`display: swap`), гадаад фонтын CSS `<link>` render-blocking байдлаар ачаалагдахгүй **shall**.
- **Rationale:** C дизайн Literata + Golos Text ашиглана (D-08); prototype нь Google Fonts `<link>` ашигладаг.
- **Source:** ADVANCED-WEB-GUIDE §4, §6, F-09
- **Priority · Phase · Status:** Must · PH5 · planned (`apps/web/src/app/layout.tsx`-д фонт тохиргоо байхгүй)
- **Verification:** Inspection + Test — Lighthouse «render-blocking resources»-д фонт 0.
- **Acceptance:** Production HTML-д `fonts.googleapis.com` холбоос 0; Lighthouse render-blocking жагсаалтад фонт 0.

#### NFR-PERF-340 — Интроны frame хугацаа
**Statement:** Интроны камерын шилжилтийн үед лавлах mid-tier Android төхөөрөмж (эсвэл Chrome CPU 4× throttle) дээр frame хугацааны median ≤ 20 ms байна **may**.
- **Source:** ADVANCED-WEB-GUIDE §4 animation
- **Priority · Phase · Status:** Could · PH6 · unknown (хэмжээгүй)
- **Verification:** Test — Performance trace, нэг шилжилт.
- **Acceptance:** Median frame ≤ 20 ms; long task (> 50 ms) шилжилт бүрт ≤ 1.

#### NFR-PERF-400 — Зураг
**Statement:** Бүтээгдэхүүний зураг нь LCP болон CLS-д сөрөг нөлөөгүй, хэрэгтэй хэмжээгээр ачаалагдана **shall**.
- **Source:** Phase0 NFR-PERF-006, NFR-PERF-007, NFR-SCA-004; F-07
- **Priority · Phase · Status:** Must · PH5 · partial
- **Verification:** children

#### NFR-PERF-410 — Fold-оос дээрх зургийг хойшлуулахгүй
**Statement:** Эхний viewport-д харагдах зураг (жагсаалтын эхний 4 карт, дэлгэрэнгүйн үндсэн зураг) нь `priority` (eager, `fetchpriority="high"`)-тай ачаалагдана; `loading="lazy"` авахгүй **shall**.
- **Rationale:** F-07: Phase 0 NFR-PERF-007 «жагсаалтын зураг бүгд lazy» нь LCP дүрэмтэй зөрчилдөж байсныг -410/-420 гэж салгаж шийдэв.
- **Source:** Phase0 NFR-PERF-007 (reworded); ADVANCED-WEB-GUIDE §4 «LCP зураг lazy байна»
- **Priority · Phase · Status:** Must · PH3 · implemented (`apps/web/src/app/products/(list)/page.tsx:89` `priority={i < 4}`, `product-gallery.tsx:29`)
- **Verification:** Inspection + Test — Lighthouse «LCP image was lazily loaded» audit pass.
- **Acceptance:** Lighthouse-ийн lazy-LCP audit pass, 2 хуудаст.

#### NFR-PERF-420 — Fold-оос доорх зургийг хойшлуулах
**Statement:** Эхний viewport-оос гадуурх бүтээгдэхүүний зураг нь lazy ачаалагдана **shall**.
- **Source:** Phase0 NFR-PERF-007 (reworded)
- **Priority · Phase · Status:** Must · PH3 · implemented (`next/image` default lazy, `product-card.tsx`)
- **Verification:** Inspection
- **Acceptance:** 5 дахь картаас эхлэн `<img loading="lazy">`.

#### NFR-PERF-430 — Зургийн хэмжээ ба srcset
**Statement:** Нийтийн хуудасны бүх бүтээгдэхүүний зураг нь `width`/`height` эсвэл `fill` + `sizes`-тэй байж, `srcset`-ээр дэлгэцийн хэмжээнд тохирсон хувилбар өгнө **shall**.
- **Source:** ADVANCED-WEB-GUIDE §4, §6; F-09
- **Priority · Phase · Status:** Must · PH3 · implemented (нийтийн component-ууд `next/image` `fill`+`sizes`); admin `<img>` хамаарахгүй
- **Verification:** Inspection — `apps/web/src/components/public` дахь `<img>` 0.
- **Acceptance:** Нийтийн route-уудад raw `<img>` 0; `next/image` бүр `sizes`-тэй эсвэл тогтмол хэмжээтэй.

#### NFR-PERF-440 — Орчин үеийн зургийн формат
**Statement:** Browser дэмждэг үед бүтээгдэхүүний зураг WebP эсвэл AVIF форматаар хүргэгдэнэ **shall**.
- **Source:** Phase0 NFR-PERF-006
- **Priority · Phase · Status:** Should · PH5 · implemented (`next/image` optimizer; `next.config.ts` `remotePatterns`)
- **Verification:** Test — `Accept: image/webp` header-тэй хүсэлтийн `Content-Type`.
- **Acceptance:** Хариу `image/webp` эсвэл `image/avif`.

#### NFR-PERF-450 — CDN-ээр хүргэх
**Statement:** Бүтээгдэхүүний зураг нь API серверээр дамжихгүй, Supabase Storage CDN эсвэл Vercel Image Optimization-оор хүргэгдэнэ **shall**.
- **Source:** Phase0 NFR-SCA-004
- **Priority · Phase · Status:** Must · PH7 · partial (local-д Supabase Storage; cloud CDN PH7)
- **Verification:** Inspection — зургийн URL-ийн host.
- **Acceptance:** Зургийн хүсэлтийн host нь `*.supabase.co` эсвэл `/_next/image`; API host 0.

#### NFR-PERF-500 — API-ийн гүйцэтгэл
**Statement:** Нийтийн уншлагын API нь NFR-PERF-510-ийн ачааллын нөхцөлд хариуны хугацааны босгыг хангаж, NFR-PERF-520-ийн дагуу cache header буцаана **shall**.
- **Source:** Phase0 NFR-PERF-004, NFR-PERF-008
- **Priority · Phase · Status:** Must · PH6 · partial
- **Verification:** children

#### NFR-PERF-510 — Уншлагын endpoint-ийн хариуны хугацаа
**Statement:** `GET /api/v1/products`, `/products/{slug}`, `/categories` нь 10 зэрэгцээ хэрэглэгч, 60 s ачаалалд (staging, 30 бүтээгдэхүүний seed) p95 ≤ 500 ms хариу өгнө **shall**.
- **Rationale:** Phase 0-ийн «normal load» гэсэн тодорхойгүй нөхцөлийг тоон утгаар солив.
- **Source:** Phase0 NFR-PERF-004
- **Priority · Phase · Status:** Should · PH6 · unknown (хэмжээгүй)
- **Verification:** Test — autocannon эсвэл k6.
- **Acceptance:** 3 endpoint тус бүрд p95 ≤ 500 ms, алдааны хувь 0%.

#### NFR-PERF-520 — Cache-Control header
**Statement:** Нийтийн уншлагын endpoint-ууд нь `Cache-Control: public, max-age=60, stale-while-revalidate=300` (эсвэл PH2-т батлах утга) header буцаана; нэвтэрсэн хэрэглэгчийн болон admin endpoint `private, no-store` буцаана **shall**.
- **Source:** Phase0 NFR-PERF-008
- **Priority · Phase · Status:** Should · PH5 · planned (`backend/api/src`-д Cache-Control тохиргоо олдсонгүй)
- **Verification:** Test — header шалгах.
- **Acceptance:** 3 нийтийн endpoint `public`; `/cart`, `/inquiries/mine`, `/admin/*` `no-store`.

#### NFR-PERF-600 — Хүчин чадал
**Statement:** API нь instance нэмэх замаар хэвтээ өргөжих боломжтой байна **shall**.
- **Source:** Phase0 NFR-SCA-001
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### NFR-PERF-610 — Stateless API
**Statement:** API нь хүсэлт хооронд session эсвэл хэрэглэгчийн төлөвийг процессын санах ойд хадгалахгүй; бүх төлөв JWT болон Supabase-д байна **shall**.
- **Source:** Phase0 NFR-SCA-001; ADR-007
- **Priority · Phase · Status:** Must · PH3 · implemented (JWT auth; in-memory session байхгүй)
- **Verification:** Inspection — `backend/api/src`-д module түвшний mutable хэрэглэгчийн төлөв 0 (rate-limit store-оос бусад, REVIEW-г үз).
- **Acceptance:** 2 instance-ийн ард ижил хүсэлт ижил үр дүнтэй.

### 5.2 Аюулгүй байдал (NFR-SEC)

#### NFR-SEC-100 — Тээвэрлэлт ба хилийн хамгаалалт
**Statement:** Систем бүх сүлжээний урсгалыг шифрлэж, API-д хүрэхээс өмнө болон API-ийн хил дээр хамгаалалт хэрэглэнэ **shall**.
- **Rationale:** 4 давхаргын defense-in-depth (01-vision §6, 08-security).
- **Source:** Phase0 NFR-SEC-001, 006, 007, 012
- **Priority · Phase · Status:** Must · PH3/PH7 · partial
- **Verification:** children

#### NFR-SEC-110 — HTTPS
**Statement:** Production орчинд web болон API-ийн бүх хүсэлт TLS 1.2 эсвэл түүнээс дээш хувилбараар HTTPS-ээр явна **shall**. HTTP хүсэлтийг HTTPS руу 301/308-аар шилжүүлнэ **shall**. HSTS `max-age ≥ 31536000` байна **shall**.
- **Rationale:** Утас, нэр зэрэг хувийн өгөгдлийг дамжуулалтын үед хамгаална.
- **Source:** Phase0 NFR-SEC-001; code `backend/api/src/plugins/helmet.ts` (HSTS)
- **Priority · Phase · Status:** Must · PH7 · partial (HSTS header бий; production domain/TLS PH7-д)
- **Verification:** Test — production domain дээр `curl -I http://…`, TLS scanner (жишээ нь `testssl.sh`) ажиллуулна.
- **Acceptance:** HTTP → 301/308. TLS 1.0/1.1 хүлээж авахгүй. HSTS header байна.

#### NFR-SEC-120 — Edge WAF
**Statement:** Production-д Cloudflare WAF нь web болон API домэйны урд байрлаж, managed ruleset идэвхтэй байна **shall**.
- **Rationale:** Хамгаалалтын 1-р давхарга.
- **Source:** Phase0 NFR-SEC-012
- **Priority · Phase · Status:** Should · PH7 · planned
- **Verification:** Inspection — DNS proxy төлөв болон WAF тохиргоог шалгана.
- **Acceptance:** Хоёр домэйн «proxied» төлөвтэй. Managed rules асаалттай.

#### NFR-SEC-130 — CORS allowlist
**Statement:** API нь `ALLOWED_ORIGINS` env-д заасан origin-уудаас л браузерийн cross-origin хүсэлтийг зөвшөөрнө **shall**. Бусад origin-д CORS header буцаахгүй **shall**. Origin-ийг кодонд hard-code хийхгүй **shall**.
- **Rationale:** Гадны сайтаас credential-тэй хүсэлт явуулахаас сэргийлнэ.
- **Source:** Phase0 NFR-SEC-006; code `backend/api/src/plugins/cors.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/plugins/cors.ts`)
- **Verification:** Test — зөвшөөрсөн болон зөвшөөрөөгүй `Origin` header-тай хүсэлт явуулна.
- **Acceptance:** Зөвшөөрсөн origin-д `Access-Control-Allow-Origin` тэр origin-оор буцна. Бусдад header байхгүй.

#### NFR-SEC-140 — Аюулгүй HTTP header
**Statement:** API бүх хариунд `@fastify/helmet`-ийн header-уудыг (CSP `default-src 'self'`, HSTS, `X-Content-Type-Options: nosniff`, frame хамгаалалт) тавина **shall**. Web хариу нь CSP болон `X-Content-Type-Options` header-тай байна **shall**.
- **Rationale:** XSS, clickjacking-ийн нөлөөг бууруулна.
- **Source:** Phase0 NFR-SEC-007; code `backend/api/src/plugins/helmet.ts`
- **Priority · Phase · Status:** Must · PH3 · partial (API implemented; web-ийн CSP header шалгагдаагүй — `unknown (not checked)`)
- **Verification:** Test — API болон web-ийн хариуны header-ийг шалгана.
- **Acceptance:** Жагсаасан header бүр байна.

#### NFR-SEC-200 — Оролт ба гаралтын хамгаалалт
**Statement:** Систем бүх оролтыг шалгаж, injection болон XSS-ээс хамгаална **shall**.
- **Rationale:** OWASP Top 10 A03.
- **Source:** Phase0 NFR-SEC-002…004, 011; plan F-05
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### NFR-SEC-210 — Request schema баталгаажуулалт
**Statement:** API нь body эсвэл query хүлээж авдаг route бүрд shared Zod schema-аар handler-ээс өмнө шалгаж, зөрчилтэй үед `400` буцаана **shall**. Тодорхойлогдоогүй талбарыг хадгалахгүй **shall**.
- **Rationale:** Буруу эсвэл хортой өгөгдөл DB-д орохгүй.
- **Source:** Phase0 NFR-SEC-003; code `backend/api/src/hooks/validate.ts`, `packages/validation-schemas/src/`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/hooks/validate.ts`)
- **Verification:** Inspection — body/query-тай route бүрт `validateBody` эсвэл `safeParse` байгааг шалгана. Test — `api.integration.test.ts` («invalid body → 400»).
- **Acceptance:** Бүх mutating route schema-тай. Шалгалтгүй route 0.

#### NFR-SEC-220 — SQL injection-оос хамгаалах
**Statement:** API нь DB-тэй зөвхөн Supabase query builder эсвэл параметртэй RPC-ээр харилцана **shall**. Хэрэглэгчийн утгыг SQL string-д холбохыг хориглоно **shall**.
- **Rationale:** SQL injection.
- **Source:** Phase0 NFR-SEC-004; code `backend/api/src/repositories/supabase/`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/repositories/supabase/`; raw SQL олдоогүй)
- **Verification:** Inspection — `grep` ашиглан raw SQL болон template-тэй query хайна. Мөн code review хийнэ.
- **Acceptance:** Хэрэглэгчийн утгыг SQL string-д залгасан тохиолдол 0.

#### NFR-SEC-230 — Файл upload-ийн шалгалт
**Statement:** API нь upload хийсэн файл бүрийн өргөтгөл болон MIME type хоёуланг server талд зөвшөөрсөн жагсаалттай тулгаж, таарахгүй файлыг хадгалахгүйгээр тусад нь татгалзана **shall**.
- **Rationale:** Хортой файл storage-д орохоос сэргийлнэ.
- **Source:** Phase0 NFR-SEC-011; code `backend/api/src/services/media.service.ts:14`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/services/media.service.ts`)
- **Verification:** Test — `api.integration.test.ts` («invalid file rejected individually», «all invalid → 400»).
- **Acceptance:** `.jpg` нэртэй `text/plain` файл татгалзагдана. Хүчинтэй файлууд хадгалагдана.

#### NFR-SEC-240 — Гаралтын escaping (XSS)
**Statement:** Динамик өгөгдлийг (хэрэглэгч эсвэл admin оруулсан аливаа текст: бүтээгдэхүүний нэр, тайлбар, хэрэглэх заавар, ангиллын нэр, inquiry-ийн нэр ба зурвас) web нь зөвхөн React-ийн text interpolation-оор render хийнэ **shall**. `dangerouslySetInnerHTML`-ийг зөвхөн JSON-LD `<script type="application/ld+json">`-д, JSON дотор `<` тэмдэгтийг `\u003c` болгон escape хийсэн үед л хэрэглэнэ **shall**.
- **Rationale:** Admin оруулсан текст `</script>`-ээр script tag-ийг хааж, HTML inject хийх эрсдэл (ADVANCED-WEB-GUIDE §5, F-05).
- **Source:** plan F-05; code `apps/web/src/app/products/[slug]/page.tsx:85` (`JSON.stringify(jsonLd)` escape-гүй)
- **Priority · Phase · Status:** Must · PH3 · partial (JSON-LD escape хийгдээгүй)
- **Verification:** Test — нэр нь `</script><img src=x onerror=alert(1)>` бүтээгдэхүүнийг нийтэлж, дэлгэрэнгүй хуудасны DOM-ийг шалгана. Inspection — `dangerouslySetInnerHTML`-ийг grep хийнэ.
- **Acceptance:** DOM-д `img[src=x]` element үүсэхгүй. JSON-LD нь хүчинтэй JSON хэвээр байна. `dangerouslySetInnerHTML` нь зөвхөн escape хийсэн JSON-LD-д байна.

#### NFR-SEC-250 — Rate limit
**Statement:** API нь IP тус бүрээр хүсэлтийн хязгаар тогтооно **shall**.
- **Rationale:** Brute force болон spam-аас хамгаална.
- **Source:** Phase0 NFR-SEC-002
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### NFR-SEC-251 — Ерөнхий хязгаар
**Statement:** API нь нэг IP-ээс 15 минутад `RATE_LIMIT_GENERAL_MAX` (production-д 100) хүсэлтээс хэтэрсэн хүсэлтэд `429 RATE_LIMIT_EXCEEDED` буцаана **shall**.
- **Rationale:** Нийтлэг abuse.
- **Source:** Phase0 NFR-SEC-002; code `backend/api/src/plugins/rate-limit.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/plugins/rate-limit.ts`). In-memory store нь нэг instance-д л ажиллана.
- **Verification:** Test — max-ийг багасгасан env-ээр шалгана.
- **Acceptance:** max+1 дэх хүсэлт `429` буцааж, `{error, code}` хэлбэртэй байна.

#### NFR-SEC-252 — Нэвтрэлтийн хязгаар
**Statement:** Нэг IP-ээс 15 минутад 5-аас олон нэвтрэх эсвэл нууц үг сэргээх оролдлого хийхэд систем дараагийн оролдлогыг татгалзана **shall**.
- **Rationale:** Нууц үг таах халдлага.
- **Source:** Phase0 NFR-SEC-002 (auth хэсэг). Нэвтрэлт нь Fastify биш Supabase Auth-аар явдаг тул хязгаарыг Supabase Auth-ийн тохиргоонд тавина.
- **Priority · Phase · Status:** Must · PH7 · unknown (not checked — `supabase/config.toml`-ийн `[auth.rate_limit]` болон cloud тохиргоог шалгаагүй)
- **Verification:** Inspection (Supabase Auth rate limit тохиргоо) ба Test — 6 буруу нэвтрэлт хийнэ.
- **Acceptance:** 6 дахь оролдлого татгалзагдана.

#### NFR-SEC-300 — Нэвтрэлт ба эрхийн хяналт
**Statement:** Систем хамгаалагдсан өгөгдөлд хандах бүрд баталгаажуулалт, эрх, эзэмшлийг шалгана **shall**.
- **Rationale:** IDOR болон эрх нэмэгдүүлэх халдлагаас хамгаална.
- **Source:** Phase0 NFR-SEC-008…010, 013; v1.0 NFR-01; M2 NFR-01
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### NFR-SEC-310 — Admin scope-ийн давхар шалгалт
**Statement:** `/api/v1/admin` prefix-ийн доорх бүх route нь нэг Fastify scope-д бүртгэгдэж, `requireAuth` дараа нь `requireAdmin` hook-оор хамгаалагдана **shall**. Admin route-ийг тэр scope-оос гадна бүртгэхгүй **shall**.
- **Rationale:** Нэг route шалгалтаа мартах эрсдэлийг бүтцээр арилгана.
- **Source:** Phase0 NFR-SEC-009; code `backend/api/src/app.ts` (admin scope)
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/app.ts`)
- **Verification:** Inspection — `app.ts` болон `controllers/admin/*`-ийг шалгана. Test — FR-AUTH-320.
- **Acceptance:** Бүх `registerAdmin*` дуудлага admin scope дотор байна.

#### NFR-SEC-320 — Хувийн өгөгдлийн тусгаарлалт (IDOR)
**Statement:** Customer A-ийн session-ээр wishlist эсвэл inquiry түүхийг унших, өөрчлөхөд систем customer B-ийн мөрийг хариунд оруулахгүй, өөрчлөхгүй **shall**. Эзэмшигчийн ID нь зөвхөн баталгаажсан session-ээс ирнэ **shall**, body эсвэл query-ээс ирэхгүй. Зочин `401`, customer admin endpoint-д `403` авна **shall**.
- **Rationale:** Хувийн өгөгдлийн нууцлал.
- **Source:** Phase0 NFR-SEC-010; v1.0 NFR-01; M2 NFR-01; docs/phase-0/08-security.md §9; code `backend/api/src/repositories/supabase/cart.repository.ts`, `inquiry.repository.ts`, migration `20260726120000`
- **Priority · Phase · Status:** Must · PH4 · implemented (статик замыг шалгасан; хоёр customer-ийн бүрэн runtime матриц pending)
- **Verification:** Inspection — I-01 checklist: controller → service → repository → RLS. Test — A/B/admin матриц, `inquiry-cart.integration.test.ts` («own only»).
- **Acceptance:**
  1. A-ийн хариунд B-ийн ID 0 удаа гарна.
  2. A хассаны дараа B-ийн мөр хэвээр байна.
  3. customer admin inbox-д `403` авна.
  4. Хамгаалагдсан зам бүр ownership эсвэл role шалгалттай.

#### NFR-SEC-330 — Access token-ийн хугацаа
**Statement:** Access token-ий хүчинтэй хугацаа 900 секундээс хэтрэхгүй байна **shall**.
- **Rationale:** Хулгайлсан token-ий ашиглах хугацааг хязгаарлана.
- **Source:** Phase0 NFR-SEC-013 (хугацааны хэсэг; rotation нь FR-AUTH-220-д); code `supabase/config.toml:184`
- **Priority · Phase · Status:** Must · PH3 · implemented (local `jwt_expiry = 900`; cloud PH7-д шалгана)
- **Verification:** Inspection — config-ийг шалгана. Test — token-ийн `exp - iat` утгыг тооцно.
- **Acceptance:** `exp - iat ≤ 900`.

#### NFR-SEC-340 — Бүх хүснэгтэд RLS
**Statement:** `public` schema-ийн бүх хүснэгтэд RLS идэвхтэй байна **shall**. Шинэ хүснэгт нэмэх migration бүр RLS болон policy-г тухайн migration дотор тодорхойлно **shall**.
- **Rationale:** Хамгаалалтын 4-р давхарга. Supabase-д шууд хандах client-ийн аюулгүйн тор.
- **Source:** Phase0 NFR-SEC-008; code `supabase/migrations/20260716154420_rls_policies.sql`, `20260726120000_inquiry_customer_and_cart.sql:62`
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/migrations/20260716154420_rls_policies.sql`)
- **Verification:** Test — `select relname from pg_class where relrowsecurity = false` (public schema) query ажиллуулна.
- **Acceptance:** RLS-гүй public хүснэгт 0.

#### NFR-SEC-350 — Эрх нэмэгдүүлэхээс сэргийлэх
**Statement:** `authenticated` role-той хэрэглэгч Supabase client-ээр шууд хандаж өөрийн `public.users.role`, `email`, `id` баганыг өөрчлөх боломжгүй байна **shall**. Зөвхөн `full_name`-ийг өөрчилж болно **shall**.
- **Rationale:** `users_update_own` RLS policy нь баганыг хязгаарладаггүй. Policy-ийн тайлбарт «column restriction is enforced by Zod at the API layer» гэж бичсэн ч web профайл нь API-аар биш, Supabase-аар шууд update хийдэг (`profile-form.tsx:53`). Grant-ийн migration хоосон (`20260719104500_table_grants.sql`). Тиймээс customer өөрийгөө `admin` болгох эрсдэлтэй. Энэ нь runtime-д шалгагдаагүй.
- **Source:** code `supabase/migrations/20260716154420_rls_policies.sql:62-70`, `apps/web/src/components/public/profile-form.tsx:53`, `supabase/migrations/20260719104500_table_grants.sql`. Шинэ шаардлага, review-д илэрсэн.
- **Priority · Phase · Status:** Must · PH3 · unknown (not checked — runtime grant-ийг шалгаагүй; эрсдэлтэй гэж үзнэ)
- **Verification:** Test — customer session-ээр `supabase.from('users').update({role:'admin'}).eq('id', uid)` ажиллуулна.
- **Acceptance:** Update татгалзагдах эсвэл 0 мөрөнд нөлөөлнө. Дараах `select role` нь `customer` хэвээр. `full_name` update амжилттай хэвээр.

#### NFR-SEC-400 — Нууц мэдээллийн удирдлага
**Statement:** Систем нууц утгыг кодоос тусгаарлана **shall**.
- **Rationale:** Нууц алдагдах эрсдэл.
- **Source:** Phase0 NFR-SEC-005; v1.0 §6
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### NFR-SEC-410 — Нууц утга env-д
**Statement:** DB нууц, API key, OAuth client secret, service-role key бүгд environment variable-аар орно **shall**. Git repository-д (түүхийг оруулаад) ямар ч нууц утга байхгүй байна **shall**. `.env.example` нь зөвхөн placeholder агуулна **shall**.
- **Rationale:** Public repository (github.com/Tengis01/Nogoolin).
- **Source:** Phase0 NFR-SEC-005; AGENTS.md; code `backend/api/src/config/env.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/config/env.ts`; secret scan энэ ажлаар ажиллуулаагүй)
- **Verification:** Test — CI дээр secret scanner (жишээ нь gitleaks) бүх түүхэнд ажиллуулна (planned).
- **Acceptance:** Scanner 0 олдвортой.

#### NFR-SEC-420 — Service-role key зөвхөн server талд
**Statement:** Supabase `service_role` key нь зөвхөн API process-д ачаалагдана **shall**. Web-ийн client bundle болон mobile app-д орохгүй **shall**. `NEXT_PUBLIC_` prefix-тэй хувьсагчид нууц утга байхгүй **shall**.
- **Rationale:** service_role нь RLS-ийг тойрдог.
- **Source:** v1.0 §6; code `backend/api/src/app.ts` (`createServiceClient`)
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/lib/supabase.ts`; web bundle-ийг шалгаагүй)
- **Verification:** Inspection — `apps/web/.next/static`-ийн production build-д key-ийн утгыг хайх. `NEXT_PUBLIC_*` жагсаалтыг шалгах.
- **Acceptance:** Bundle-д service key олдохгүй.

#### NFR-SEC-500 — Хувийн мэдээллийн хэрэглээ
**Statement:** Inquiry-ийн утас болон нэрийг зөвхөн тухайн асуулгад хариулах зорилгоор admin-д харуулна **shall**. Нийтийн хуудас, лог, analytics-д дамжуулахгүй **shall**. API-ийн info түвшний лог request body-г бичихгүй **shall**.
- **Rationale:** Хэрэглэгчийн итгэлцэл. Хамгийн бага өгөгдөл цуглуулах зарчим.
- **Source:** v1.0 §6; code `backend/api/src/app.ts` (production logger `info`)
- **Priority · Phase · Status:** Should · PH4 · partial (лог тохиргоог body-гүй гэж үзсэн; хадгалах хугацааны бодлого байхгүй)
- **Verification:** Inspection — лог болон analytics тохиргоог шалгана.
- **Acceptance:** Production логт утасны дугаар 0 удаа гарна.

### 5.3 Найдвартай байдал (NFR-REL)

#### NFR-REL-100 — Хүртээмж
**Statement:** Систем launch-ийн дараа web болон API-г тасралтгүй хүртээмжтэй байлгаж, өгөгдлийг сэргээх боломжтой байна **shall**.
- **Rationale:** Каталог ба inquiry нь бизнесийн суваг (G1, G2).
- **Source:** Phase0 NFR-REL-001, 002, 006
- **Priority · Phase · Status:** Should · PH7 · planned
- **Verification:** children

#### NFR-REL-110 — Web uptime
**Statement:** Launch-аас хойш web-ийн нүүр хуудас болон `/products` нь сар бүр ≥ 99.0% uptime-тай байна **shall**. Uptime-ийг гадны monitor 5 минутын давтамжаар HTTP 200-аар хэмжинэ.
- **Rationale:** Сард ≈ 7 цагаас бага тасалдал.
- **Source:** Phase0 NFR-REL-001
- **Priority · Phase · Status:** Should · PH7 · planned
- **Verification:** Analysis — launch-ийн дараах эхний бүтэн сарын monitor тайланг шинжилнэ.
- **Acceptance:** Хэмжсэн uptime ≥ 99.0%.

#### NFR-REL-120 — API uptime
**Statement:** Launch-аас хойш API-ийн `/api/v1/health` нь сар бүр ≥ 99.0% uptime-тай байна **shall**. Хэмжилт нь NFR-REL-110-тэй ижил.
- **Rationale:** Web-ийн каталог API-аас хамаардаг.
- **Source:** Phase0 NFR-REL-002 (Railway гэж заасан; hosting-ийн сонголт PH7-д); code `backend/api/src/controllers/health.controller.ts`
- **Priority · Phase · Status:** Should · PH7 · planned (health endpoint implemented)
- **Verification:** Analysis
- **Acceptance:** Хэмжсэн uptime ≥ 99.0%.

#### NFR-REL-130 — Backup ба сэргээлт
**Statement:** Production DB өдөр бүр автоматаар backup хийгдэж, ≥ 7 хоног хадгалагдана **shall**. Launch-аас өмнө нэг удаа backup-аас тусдаа орчинд сэргээх туршилт хийнэ **shall**. Point-in-time recovery-г төлбөрт tier ашиглах үед асаана **may**.
- **Rationale:** Бүтээгдэхүүн болон inquiry-ийн өгөгдлийг алдахгүй.
- **Source:** Phase0 NFR-REL-006 (S)
- **Priority · Phase · Status:** Should · PH7 · planned
- **Verification:** Demonstration — сэргээх туршилтыг runbook-ийн дагуу хийж тэмдэглэнэ.
- **Acceptance:** Сэргээсэн DB-д бүтээгдэхүүн болон inquiry-ийн тоо эх DB-тэй таарна.

#### NFR-REL-200 — Алдааны зохицуулалт
**Statement:** Систем алдааны үед бүтэцтэй хариу болон хэрэглэгчид ойлгомжтой төлөвийг харуулна **shall**.
- **Rationale:** Алдаанаас гарах зам.
- **Source:** Phase0 NFR-REL-003…005; v1.0 NFR-05
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### NFR-REL-210 — API-ийн алдааны envelope
**Statement:** API-ийн бүх 4xx/5xx хариу `Content-Type: application/json`-тэй, `{ "error": <хүнд уншигдах текст>, "code": <тогтмол код> }` хэлбэртэй байна **shall**. 5xx хариунд stack trace болон дотоод мессеж агуулахгүй **shall**.
- **Rationale:** Client тогтмол кодоор салбарлана. Дотоод мэдээллийг ил гаргахгүй.
- **Source:** Phase0 NFR-REL-003; code `backend/api/src/app.ts:49-75`
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/app.ts`)
- **Verification:** Test — 400, 401, 403, 404, 409, 429, 500 тохиолдол бүрийг үүсгэж шалгана.
- **Acceptance:** Бүх хариу envelope хэлбэртэй. 500 нь `{error:"Internal server error", code:"INTERNAL"}` байна.

#### NFR-REL-220 — Web-ийн 404 ба 500 хуудас
**Statement:** Web нь байхгүй хаягт HTTP 404 статустай, render-ийн алдаанд error boundary-тэй Монгол хуудсыг харуулна **shall**. Хуудас бүр нүүр болон каталог руу буцах холбоостой байна **shall**.
- **Rationale:** Хэрэглэгчийг хоосон дэлгэцэнд үлдээхгүй.
- **Source:** Phase0 NFR-REL-004; code `apps/web/src/app/products/[slug]/not-found.tsx`
- **Priority · Phase · Status:** Must · PH5 · partial (зөвхөн бүтээгдэхүүний not-found бий; `app/not-found.tsx`, `app/error.tsx` байхгүй)
- **Verification:** Test — `/no-such-page` болон алдаа шидэх test route-оор шалгана.
- **Acceptance:** `/no-such-page` нь HTTP 404 буцааж Монгол текст болон 2 холбоостой. Render алдаанд error хуудас гарч, «Дахин оролдох» товч ажиллана.
- **States:** error: «Хуудас олдсонгүй» / «Алдаа гарлаа» + дараагийн алхам.

#### NFR-REL-230 — Mobile-ийн offline/алдааны төлөв
**Statement:** Mobile app нь API-д хүрч чадахгүй үед дэлгэц бүрт «Сүлжээнд холбогдож чадсангүй» төлөв болон «Дахин оролдох» товчийг харуулна **shall**.
- **Rationale:** Mobile сүлжээ тогтворгүй.
- **Source:** Phase0 NFR-REL-005
- **Priority · Phase · Status:** Won't (this release) · PH8 (G6) · unknown (not checked)
- **Verification:** Test — airplane mode-д шалгана.
- **Acceptance:** Хоосон эсвэл crash дэлгэц 0.

#### NFR-REL-240 — Inquiry retry-ийн idempotency
**Statement:** Client `Idempotency-Key` header-тэй ижил inquiry POST-ийг ижил payload-аар 24 цагийн дотор давтахад систем эхний status болон body-г буцаана **shall**, inquiry мөрийг нэгээс олшруулахгүй **shall**. Ижил key өөр payload-тай бол `409` буцаана **shall**. Web form нь илгээлт бүрт шинэ key үүсгэж, retry-д тэр key-г дахин ашиглана **shall**.
- **Rationale:** Сүлжээний retry давхар асуулга үүсгэж admin-ийг төөрөгдүүлэхээс сэргийлнэ.
- **Source:** v1.0 NFR-05
- **Priority · Phase · Status:** Should · PH6 · planned (header хэрэгжээгүй)
- **Verification:** Test — нэг key/ижил payload хоёр POST, нэг key/өөр payload; clock-controlled 24 цагийн тест.
- **Acceptance:** Эхний тохиолдолд 1 мөр, ижил ID. Хоёр дахь тохиолдолд `409`. 24 цагийн дараа key шинэ гэж тооцогдоно.

### 5.4 Ашиглалт ба хүртээмж (NFR-USE)

#### NFR-USE-100 — WCAG 2.1 AA хүртээмж
**Statement:** Нийтийн web хуудсууд WCAG 2.1 AA-ийн доорх шалгуурыг хангана **shall**.
- **Source:** Phase0 NFR-ACC-001…005; ADVANCED-WEB-GUIDE §3 L7, §7
- **Priority · Phase · Status:** Must · PH5 · partial
- **Verification:** children

#### NFR-USE-110 — Semantic HTML
**Statement:** Хуудас бүр `<header>`, `<nav>`, `<main>`, `<footer>` landmark-тай; үйлдэл нь `<button>`, шилжилт нь `<a href>` элементээр хийгдэнэ; `div`/`span` дээр `onClick` ашиглахгүй **shall**.
- **Source:** Phase0 NFR-ACC-001 (Should→Must); ADVANCED-WEB-GUIDE §5 «Native semantics»
- **Priority · Phase · Status:** Must · PH5 · unknown (not checked)
- **Verification:** Inspection + Test — axe-core `landmark-*`, `region` дүрэм.
- **Acceptance:** axe-ийн landmark зөрчил 0; `apps/web/src`-д `div`/`span`-ийн `onClick` 0.

#### NFR-USE-120 — Гарын удирдлага
**Statement:** Бүх интерактив элемент Tab-аар хүрэгдэж, Enter/Space-ээр идэвхжинэ; keyboard trap байхгүй **shall**.
- **Source:** Phase0 NFR-ACC-002 (Should→Must)
- **Priority · Phase · Status:** Must · PH5 · unknown (not checked)
- **Verification:** Test — гол 3 урсгалыг (бараа олох, inquiry, нэвтрэх) зөвхөн гараар.
- **Acceptance:** 3 урсгал хулгана ашиглахгүйгээр дуусна.

#### NFR-USE-130 — Өнгөний ялгарал
**Statement:** Энгийн текст ≥ 4.5:1, том текст (≥ 24 px эсвэл ≥ 18.66 px bold) болон UI хүрээ ≥ 3:1 ялгаралтай байна **shall**.
- **Source:** Phase0 NFR-ACC-003 (Should→Must)
- **Priority · Phase · Status:** Must · PH5 · unknown (not checked; C token-ууд шинэчлэгдэнэ)
- **Verification:** Test — axe `color-contrast` + C token хосын тооцоо.
- **Acceptance:** axe `color-contrast` зөрчил 0; DESIGN.md-ийн текст/дэвсгэр хос бүр босгыг хангана.

#### NFR-USE-140 — Харагдах focus
**Statement:** Бүх интерактив элемент `:focus-visible` үед ≥ 2 px, дэвсгэртэйгээ ≥ 3:1 ялгаралтай focus хүрээтэй; `outline: none`-ийг орлуулагчгүйгээр ашиглахгүй **shall**.
- **Source:** ADVANCED-WEB-GUIDE §3 L7, F-09
- **Priority · Phase · Status:** Must · PH5 · planned (`globals.css`, component-уудад `focus-visible` 0)
- **Verification:** Inspection + Test — Tab-аар screenshot.
- **Acceptance:** Tab дарах бүрт focus хүрээ харагдана, гол 3 урсгалд.

#### NFR-USE-150 — Зургийн alt текст
**Statement:** Агуулгын зураг бүр утга бүхий `alt` (бүтээгдэхүүний нэр + харагдац)-тай, чимэглэлийн зураг `alt=""`-тэй байна **shall**.
- **Source:** Phase0 NFR-ACC-005 (хайлтын системийн тал нь NFR-SEO-009)
- **Priority · Phase · Status:** Must · PH3 · unknown (not checked)
- **Verification:** Test — axe `image-alt`.
- **Acceptance:** axe `image-alt` зөрчил 0.

#### NFR-USE-160 — Автомат хүртээмжийн оноо
**Statement:** Гурван гол хуудасны Lighthouse Accessibility онооны median ≥ 90, axe-core-ийн critical/serious зөрчил 0 байна **shall**.
- **Rationale:** Автомат шалгалт нь бүрэн screen reader audit биш гэдгийг тайланд тэмдэглэнэ.
- **Source:** G3
- **Priority · Phase · Status:** Must · PH6 · unknown (хэмжээгүй)
- **Verification:** Test — Lighthouse CI + `@axe-core/playwright`.
- **Acceptance:** Оноо ≥ 90; critical/serious 0.

#### NFR-USE-170 — Хөдөлгөөн багасгах (сайт даяар)
**Statement:** `prefers-reduced-motion: reduce` үед сайтын шаардлагагүй transition/animation идэвхгүй болно; төлөвийн өөрчлөлт, success/error мэдэгдэл хэвээр харагдана; логик нь `animationend` event-ээс хамаарахгүй **shall**.
- **Source:** Phase0 NFR-ACC-004 (интроны хэсэг нь FR-INTRO-230); ADVANCED-WEB-GUIDE §4
- **Priority · Phase · Status:** Must · PH5 · implemented (`globals.css:67` media query)
- **Verification:** Test — media emulation.
- **Acceptance:** reduce үед CSS animation-duration ≤ 0.01 ms; inquiry success мессеж харагдана.

#### NFR-USE-180 — Текстийн томруулалт
**Statement:** Browser-ийн zoom 200%-д хуудас агуулга, функцээ алдахгүй; текстийн хэмжээ `rem`-д суурилна (цэвэр `vw` биш) **shall**.
- **Source:** ADVANCED-WEB-GUIDE §3 «Текстэд цэвэр vw»; WCAG 1.4.4
- **Priority · Phase · Status:** Should · PH5 · unknown (not checked)
- **Verification:** Test — 1280 px дээр 200% zoom.
- **Acceptance:** Хэвтээ scroll байхгүй (1.4.10-ийн хүрээнд), текст огтлогдохгүй.

#### NFR-USE-200 — Хэл ба төлөвийн текст
**Statement:** Хэрэглэгчид харагдах интерфэйс нь Монгол хэлтэй, системийн төлөвийг хүний хэлээр, дараагийн алхамтай илэрхийлнэ **shall**.
- **Source:** ADVANCED-WEB-GUIDE §2; D-05
- **Priority · Phase · Status:** Must · PH5 · partial
- **Verification:** children

#### NFR-USE-210 — Монгол хэл
**Statement:** Нийтийн бүх хуудас `<html lang="mn">`-тэй, UI текст нь Кирилл Монгол хэлтэй байна **shall**.
- **Source:** D-05; 01-vision §7
- **Priority · Phase · Status:** Must · PH3 · implemented (`apps/web/src/app/layout.tsx:13`)
- **Verification:** Inspection
- **Acceptance:** `lang="mn"`; UI-ийн Англи хэлтэй товч/label 0 (брэнд нэрээс бусад).

#### NFR-USE-220 — Алдааны мессеж
**Statement:** Хэрэглэгчид харагдах алдааны мессеж бүр юу болсон, хэрэглэгч юу хийхийг Монгол хэлээр хэлнэ; HTTP код, stack trace, backend-ийн алдааны код харуулахгүй **shall**.
- **Source:** ADVANCED-WEB-GUIDE §2 «Системийн дүрмийг хүний хэлээр»
- **Priority · Phase · Status:** Must · PH5 · partial (form-ууд Монгол мессежтэй; бүх замыг шалгаагүй)
- **Verification:** Inspection — alert/error render хийдэг газрууд.
- **Acceptance:** Алдааны текстэд `4xx`/`5xx`, `Error:`, `undefined` 0.

#### NFR-USE-230 — Хүрэлцэх хэмжээ
**Statement:** ≤ 700 px өргөнтэй дэлгэцэд товш, холбоос зэрэг хүрэх элементийн бай ≥ 44 × 44 CSS px байна **shall**.
- **Source:** WCAG 2.5.5 (AAA, зөвлөмж)
- **Priority · Phase · Status:** Should · PH5 · unknown (not checked)
- **Verification:** Inspection — 390 px viewport-д bounding box хэмжих script.
- **Acceptance:** Гол 3 урсгалын хүрэх элемент бүр ≥ 44 × 44.

#### NFR-USE-300 — Usability зорилт
**Statement:** Гол даалгаврын usability хэмжүүр нь `docs/quality/usability-protocol.md`-ийн аргаар хэмжигдэнэ; хэмжигдэх хүртэл «зорилт — хэмжигдээгүй» төлөвтэй байна **shall**.
- **Source:** project-goals G1, G2; ADVANCED-WEB-GUIDE F-03
- **Priority · Phase · Status:** Should · PH6 · planned
- **Verification:** children

#### NFR-USE-310 — Бараа олох
**Statement:** «Тодорхой бараа олж, үнийг нь хэлэх» даалгаврыг ≥ 5 оролцогчийн ≥ 80% нь гүйцэтгэж, median хугацаа ≤ 60 s байна **shall**.
- **Source:** G1
- **Priority · Phase · Status:** Should · PH6 · planned
- **Verification:** Demonstration — usability session.
- **Acceptance:** Completion ≥ 80%, median ≤ 60 s; raw тэмдэглэл хавсаргасан.

#### NFR-USE-320 — Inquiry илгээх
**Statement:** «Бүтээгдэхүүний тухай асуулга илгээх» даалгаврыг ≥ 5 оролцогчийн ≥ 90% нь гүйцэтгэж, median хугацаа ≤ 2 мин байна **shall**.
- **Source:** G2; Phase0 01-vision §8; 10-roadmap Phase 4 (функц нь FR-INQ-100)
- **Priority · Phase · Status:** Should · PH6 · planned
- **Verification:** Demonstration — usability session.
- **Acceptance:** Completion ≥ 90%, median ≤ 120 s; validation алдаанаас гарч чадаагүй тохиолдол 0.

### 5.5 Засвар үйлчилгээ (NFR-MAINT)

#### NFR-MAINT-100 — Архитектурын бүтэц
**Statement:** Код нь давхаргат monolith бүтэц, нэг хэл, хуваалцсан package-тай байна **shall**.
- **Source:** Phase0 NFR-MAIN-001…003, NFR-SCA-002, NFR-SCA-003; ADR-007, ADR-008
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### NFR-MAINT-110 — Controller → Service → Repository
**Statement:** Backend нь Fastify TypeScript дээр Controller → Service → Repository гурван давхаргатай; route handler-т бизнесийн логик, service-т DB query байхгүй **shall**.
- **Source:** Phase0 NFR-MAIN-001; ADR-007
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/src/controllers`, `services`, `repositories`)
- **Verification:** Inspection — `services/`-д `supabase.from(` 0; `controllers/`-д repository import 0.
- **Acceptance:** Хоёр grep-ийн үр дүн 0.

#### NFR-MAINT-120 — TypeScript
**Statement:** Web, API, mobile, shared package-ийн бүх эх код TypeScript байж, `tsc --noEmit` алдаагүй дуусна **shall**.
- **Source:** Phase0 NFR-MAIN-002
- **Priority · Phase · Status:** Must · PH3 · implemented (`lint` script = `tsc --noEmit`)
- **Verification:** Test — `pnpm lint`.
- **Acceptance:** Exit code 0.

#### NFR-MAINT-130 — Хуваалцсан schema
**Statement:** Validation schema болон хуваалцсан төрлүүд `packages/` дотор нэг газар байж, web, API хоёул тэндээс import хийнэ **shall**.
- **Source:** Phase0 NFR-MAIN-003
- **Priority · Phase · Status:** Must · PH3 · implemented (`packages/validation-schemas`)
- **Verification:** Inspection
- **Acceptance:** Inquiry/product schema-ийн давхар тодорхойлолт 0.

#### NFR-MAINT-140 — Нормчилсон schema
**Statement:** DB schema нь 3NF-ийг хангах бөгөөд зориуд хийсэн denormalization бүр migration-ий тайлбарт үндэслэлтэй байна **shall**.
- **Source:** Phase0 NFR-SCA-002
- **Priority · Phase · Status:** Must · PH3 · implemented (`supabase/migrations/20260716154417_init_schema.sql`)
- **Verification:** Inspection — 04-er-diagram-тай харьцуулах.
- **Acceptance:** Үндэслэлгүй давхардсан багана 0.

#### NFR-MAINT-150 — Хүргэлтийг toggle-оор идэвхжүүлэх
**Statement:** Хүргэлт/захиалгын функцийг идэвхжүүлэхэд зөвхөн `delivery_enabled` тохиргоог өөрчлөх ба PH8-ийн UI нэмэх шаардлагатай; одоо байгаа schema-д эвдэх (breaking) migration шаардлагагүй **shall**.
- **Source:** Phase0 NFR-SCA-003; ADR-002
- **Priority · Phase · Status:** Must · PH8 · partial (schema, settings service бий; `backend/api/src/services/settings.service.ts`)
- **Verification:** Inspection — order хүснэгт ба toggle-ийн enforcement.
- **Acceptance:** Order хүснэгтүүд migration-д бий; toggle `false` үед order endpoint 403/404.

#### NFR-MAINT-200 — Хөгжүүлэлтийн процесс
**Statement:** Өөрчлөлт, тохиргоо, DB-ийн хувилбар нь хянагддаг байна **shall**.
- **Source:** Phase0 NFR-MAIN-004, -007, -008
- **Priority · Phase · Status:** Must · PH3 · partial
- **Verification:** children

#### NFR-MAINT-210 — Conventional commits
**Statement:** `main` руу орох commit бүрийн гарчиг `feat|fix|docs|refactor|test|chore(scope)?: ` хэлбэртэй байна **shall**.
- **Source:** Phase0 NFR-MAIN-004
- **Priority · Phase · Status:** Should · PH3 · partial (сүүлийн 15 commit-д «sem6», «new agent chat» зэрэг дүрэм зөрчсөн гарчиг бий)
- **Verification:** Test — commitlint эсвэл CI regex.
- **Acceptance:** 2026-10-19-өөс хойшх commit-д зөрчил 0.

#### NFR-MAINT-220 — Хувилбартай migration
**Statement:** DB-ийн бүх өөрчлөлт `supabase/migrations/` дахь timestamp-тай, append-only migration файлаар хийгдэнэ **shall**.
- **Source:** Phase0 NFR-MAIN-007; ADR-011
- **Priority · Phase · Status:** Must · PH3 · implemented (7 migration)
- **Verification:** Inspection + Test — `supabase db reset` алдаагүй.
- **Acceptance:** Reset exit 0; хуучин migration файлын өөрчлөлт git history-д 0.

#### NFR-MAINT-230 — Гадаад тохиргоо
**Statement:** Орчноос хамаарах тохиргоо бүр environment variable-аар орж, код дахь `process.env.X` бүр `.env.example`-д нууц утгагүйгээр бичигдсэн байна **shall**.
- **Source:** Phase0 NFR-MAIN-008; 08-security §11.2
- **Priority · Phase · Status:** Must · PH3 · partial (`.env.example` бий; бүрэн нийцлийг шалгаагүй)
- **Verification:** Inspection — `process.env.` grep ба `.env.example`-ийн жагсаалтыг харьцуулах script.
- **Acceptance:** Дутуу хувьсагч 0; `.env.example`-д бодит нууц 0.

#### NFR-MAINT-300 — CI/CD хаалт
**Statement:** Web, API, mobile-ийн CI нь шаардлагатай шалгалт амжилттай болсон үед л deploy/build-ийг зөвшөөрнө **shall**.
- **Source:** Phase0 NFR-MAIN-005; v1.0 NFR-03; M2 NFR-03
- **Priority · Phase · Status:** Must · PH4 · partial
- **Verification:** children

#### NFR-MAINT-310 — CI workflow-ууд
**Statement:** Web, API, mobile тус бүр GitHub Actions workflow-тай, PR дээр lint/typecheck ажиллана **shall**.
- **Source:** Phase0 NFR-MAIN-005; ADR-010
- **Priority · Phase · Status:** Must · PH3 · implemented (`.github/workflows/web-deploy.yml`, `api-deploy.yml`, `mobile-build.yml`)
- **Verification:** Inspection
- **Acceptance:** 3 workflow-д lint алхам бий.

#### NFR-MAINT-320 — Skip-гүй integration тестийн хаалт
**Statement:** API deploy job нь тухайн commit-д шаардлагатай integration тест бодитоор ажилласан (≥ 1 executed, 0 failed, шаардлагатай тестийн 0 skipped) ба production Docker build амжилттай болсон үед л ажиллана. Тест fail, бүх тест skip эсвэл build fail бүр deploy-г хаана **shall**.
- **Rationale:** v1.0 NFR-03-ийн gap: тестүүд DB-гүй үед өөрсдөө skip хийж, CI ногоон болдог.
- **Source:** v1.0 NFR-03; M2 NFR-03; Phase0 NFR-MAIN-005/006; G4
- **Priority · Phase · Status:** Must · PH4 · partial (`api-deploy.yml`-д `lint-and-test → docker-build → deploy` бий; `backend/api/tests/*.integration.test.ts` reachability-ээр `t.skip()`, CI local Supabase асаадаггүй)
- **Verification:** Inspection — CI тохиргоо + 3 сөрөг тохиолдлын log.
- **Acceptance:** 1) Тест fail → deploy skipped. 2) DB байхгүй (бүгд skip) → job fail, deploy skipped. 3) Docker build fail → deploy skipped. 4) Амжилттай үед deploy eligible.

#### NFR-MAINT-330 — Web тестийн хаалт
**Statement:** Web workflow нь deploy-оос өмнө бодит тест (unit эсвэл Playwright smoke) ажиллуулж, тест байхгүй эсвэл fail бол deploy-г хаана **shall**.
- **Source:** v1.0 NFR-03 («web рүү өргөтгөх нь дараагийн шаардлага»)
- **Priority · Phase · Status:** Must · PH6 · planned (`apps/web/package.json` `test` = `echo "no tests yet"`)
- **Verification:** Inspection
- **Acceptance:** Web `test` script ≥ 1 тест ажиллуулна; fail үед deploy skipped.

#### NFR-MAINT-400 — Код ба design system
**Statement:** UI код нь баримтжсан contract болон шатлалтай token дээр суурилна **shall**.
- **Source:** D-08; ADVANCED-WEB-GUIDE F-10, F-12
- **Priority · Phase · Status:** Should · PH2 · planned
- **Verification:** children

#### NFR-MAINT-410 — Design token-ийн шатлал
**Statement:** Өнгө, хэмжээ, радиус, сүүдрийн утга нь primitive → semantic → component → brand шатлалтай token-д (Tailwind v4 `@theme`) тодорхойлогдож, component нь semantic token-ийг ашиглана; token файлаас гадуур hex/rgb утга бичихгүй **shall**.
- **Source:** D-08; ADVANCED-WEB-GUIDE §3, F-10; `agent-context/design.md` («no ad-hoc hex»)
- **Priority · Phase · Status:** Should · PH5 · partial (`globals.css` нэг түвшний `:root` token; шатлал байхгүй)
- **Verification:** Inspection — `apps/web/src`-д `#[0-9a-f]{3,8}` grep (token файлаас бусад).
- **Acceptance:** Token файлаас гадуур hex 0; component-ууд primitive token-ийг шууд ашиглахгүй.

#### NFR-MAINT-420 — CSS layer
**Statement:** Төслийн өөрийн бичсэн CSS бүр нэртэй `@layer` дотор байна (layer-гүй app CSS байхгүй) **shall**.
- **Source:** ADVANCED-WEB-GUIDE §3 L3, §6
- **Priority · Phase · Status:** Should · PH5 · planned (`globals.css`-д `@layer` 0)
- **Verification:** Inspection
- **Acceptance:** `globals.css`-ийн `@import 'tailwindcss'`-ээс бусад rule бүр `@layer` дотор.

#### NFR-MAINT-430 — Token refactor-ын regression
**Statement:** v4 token-уудыг шатлал руу шилжүүлэх refactor нь нийтийн гол 6 хуудасны screenshot-т (1440 ба 390 px) 0 px ялгаатай байна **shall**.
- **Source:** ADVANCED-WEB-GUIDE §1 «Refactor ≠ redesign»; roadmap PH5 (a)
- **Priority · Phase · Status:** Should · PH5 · planned
- **Verification:** Test — Playwright `toHaveScreenshot` (maxDiffPixels = 0).
- **Acceptance:** 12 screenshot-ийн ялгаа 0 px.

#### NFR-MAINT-440 — Component contract
**Statement:** Хоёр ба түүнээс олон газар ашиглагддаг UI component бүрийн props (оролт), callback (гаралт), children/slot, controlled state нь `docs/design/components.md`-д бичигдсэн байна **shall**.
- **Source:** ADVANCED-WEB-GUIDE §5, §6, F-12
- **Priority · Phase · Status:** Should · PH2 · planned
- **Verification:** Inspection
- **Acceptance:** `apps/web/src/components/public`-ийн дахин ашиглагддаг component бүр баримтад мөртэй.

#### NFR-MAINT-450 — Шаардлагын traceability
**Statement:** Must шаардлага бүр `docs/requirements/traceability-v2.md`-д ≥ 1 verification (тест файл эсвэл inspection checklist)-тэй холбогдсон байна **shall**.
- **Source:** G4
- **Priority · Phase · Status:** Must · PH6 · planned
- **Verification:** Analysis — traceability-ийн хоосон «Test» нүдийг тоолох script.
- **Acceptance:** Must мөрийн хоосон Test нүд 0.

#### NFR-MAINT-600 — Mobile stack-ийн хязгаарлалт
**Statement:** Mobile app нь web-тэй ижил хэрэгслийн сонголтыг дагана **shall**.
- **Source:** Phase0 FR-MOB-008, FR-MOB-009
- **Priority · Phase · Status:** Won't (this release) · PH8 · implemented
- **Verification:** children

#### NFR-MAINT-610 — Төлөвийн удирдлага
**Statement:** Mobile app-ийн хуваалцсан төлөв Zustand-аар удирдагдана **shall**.
- **Source:** Phase0 FR-MOB-008 (FR биш, дизайны хязгаарлалт)
- **Priority · Phase · Status:** Won't (this release) · PH8 · implemented (`apps/mobile/lib/auth-store.ts`, `zustand ^5`)
- **Verification:** Inspection
- **Acceptance:** Redux/MobX dependency 0.

#### NFR-MAINT-620 — HTTP клиент
**Statement:** Mobile app-ийн HTTP хүсэлт `fetch`, Supabase хүсэлт `supabase-js`-ээр хийгдэнэ; тусдаа HTTP library ашиглахгүй **shall**.
- **Source:** Phase0 FR-MOB-009
- **Priority · Phase · Status:** Won't (this release) · PH8 · implemented (`apps/mobile/lib/api.ts`)
- **Verification:** Inspection
- **Acceptance:** `axios` зэрэг dependency 0.

### 5.6 Нийцтэй байдал (NFR-COMP)

#### NFR-COMP-100 — Browser
**Statement:** Web app нь Chrome, Firefox, Safari, Edge-ийн тест хийх үеийн хамгийн сүүлийн тогтвортой хувилбар дээр гол 3 урсгалыг алдаагүй гүйцэтгэнэ **shall**.
- **Source:** Phase0 NFR-COM-001
- **Priority · Phase · Status:** Must · PH6 · unknown (not checked)
- **Verification:** Demonstration — Playwright chromium/firefox/webkit + гараар Edge.
- **Acceptance:** 4 browser × 3 урсгал = 12 амжилттай; browser-ийн хувилбарыг тайланд бичнэ.

#### NFR-COMP-200 — Responsive
**Statement:** Web app нь 375–1440 px өргөнд хэвтээ scroll-гүй, бүх функц ашиглагдахуйц байна **shall**.
- **Source:** Phase0 NFR-COM-002
- **Priority · Phase · Status:** Must · PH5 · partial (prototype C 390/1440-д шалгагдсан; production C хэрэгжээгүй)
- **Verification:** Test — Playwright 375, 390, 768, 1024, 1440 px.
- **Acceptance:** Viewport бүрд `document.documentElement.scrollWidth ≤ innerWidth`; гол 3 урсгал дуусна.

#### NFR-COMP-300 — Mobile OS
**Statement:** Expo app нь дэмжигдсэн mobile OS-ийн хувилбаруудад ажиллана **shall**.
- **Source:** Phase0 NFR-COM-003, NFR-COM-004, FR-MOB-001
- **Priority · Phase · Status:** Won't (this release) · PH8 · partial
- **Verification:** children

#### NFR-COMP-310 — Android
**Statement:** App нь Android API level 24 (Android 7.0) ба түүнээс дээш дээр суугдаж, ажиллана **shall**.
- **Source:** Phase0 NFR-COM-003, FR-MOB-001
- **Priority · Phase · Status:** Won't (this release) · PH8 · unknown (not checked; Expo SDK 52)
- **Verification:** Demonstration — API 24 emulator.
- **Acceptance:** Суулгалт ба жагсаалт нээгдэнэ.

#### NFR-COMP-320 — iOS
**Statement:** App нь iOS 15.1 ба түүнээс дээш дээр суугдаж, ажиллана **shall**.
- **Source:** Phase0 NFR-COM-004, FR-MOB-001
- **Priority · Phase · Status:** Won't (this release) · PH8 · unknown (not checked)
- **Verification:** Demonstration — iOS 15.1 simulator эсвэл TestFlight.
- **Acceptance:** Суулгалт ба жагсаалт нээгдэнэ.

#### NFR-COMP-400 — API-ийн өгөгдлийн формат
**Statement:** API нь нийцтэй, тогтмол форматаар хариулна **shall**.
- **Source:** Phase0 NFR-COM-005, NFR-COM-006
- **Priority · Phase · Status:** Must · PH3 · unknown (not checked)
- **Verification:** children

#### NFR-COMP-410 — JSON content type
**Statement:** Body-тэй бүх API хариу `Content-Type: application/json; charset=utf-8` буцаана (204 хариуд body байхгүй) **shall**.
- **Source:** Phase0 NFR-COM-005 (reworded: 204-ийг ялгав)
- **Priority · Phase · Status:** Must · PH3 · unknown (not checked; Fastify-ийн default)
- **Verification:** Test — integration тестэд header шалгах.
- **Acceptance:** 200/201/4xx/5xx хариу бүр JSON content-type.

#### NFR-COMP-420 — Огнооны формат
**Statement:** API-ийн бүх огноо/цагийн талбар ISO 8601, UTC (`Z` эсвэл `+00:00`) хэлбэртэй байна **shall**.
- **Source:** Phase0 NFR-COM-006
- **Priority · Phase · Status:** Must · PH3 · unknown (not checked)
- **Verification:** Test — `created_at` талбарыг regex-ээр шалгах.
- **Acceptance:** `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+00:00)$`-д таарна.

#### NFR-COMP-500 — WebGL байхгүй орчин
**Statement:** WebGL-гүй browser дээр web app-ийн бүх нийтийн функц (интрогоос бусад) ажиллана **shall**.
- **Source:** Phase0 FR-3D-006 (нийцтэй байдлын тал); FR-INTRO-320-тэй холбоотой
- **Priority · Phase · Status:** Must · PH5 · implemented (`hero-intro.tsx` `webglAvailable`)
- **Verification:** Test — `--disable-webgl`.
- **Acceptance:** Гол 3 урсгал WebGL-гүй дуусна.

### 5.7 Байршуулалт (NFR-PORT)

#### NFR-PORT-100 — Deploy хийх боломж
**Statement:** Систем нь код өөрчлөхгүйгээр local, staging, production орчинд байршина **shall**.
- **Source:** Phase0 NFR-MAIN-006, NFR-MAIN-008; ADR-010, ADR-011
- **Priority · Phase · Status:** Must · PH7 · partial
- **Verification:** children

#### NFR-PORT-110 — API container
**Statement:** API нь `node:20-alpine` дээр multi-stage Docker build-ээр баригдаж, production stage нь root биш хэрэглэгчээр ажиллана **shall**.
- **Source:** Phase0 NFR-MAIN-006
- **Priority · Phase · Status:** Must · PH3 · implemented (`backend/api/Dockerfile:8, 38, 47` `USER nogoolin`)
- **Verification:** Inspection + Test — `docker run … id -u` ≠ 0.
- **Acceptance:** 2 stage; UID ≠ 0.

#### NFR-PORT-120 — Local stack
**Statement:** Шинэ хөгжүүлэгч `docs/developer/setup.md`-ийн алхмаар (`pnpm install`, `supabase start`, `pnpm dev`) cloud эрхгүйгээр бүтэн stack-ийг local-д асаана **shall**.
- **Source:** ADR-011
- **Priority · Phase · Status:** Should · PH2 · partial (stack ажилладаг; setup баримт planned)
- **Verification:** Demonstration — цэвэр clone дээр.
- **Acceptance:** Баримтын алхмаар `/products` нээгдэнэ, cloud credential 0.

#### NFR-PORT-130 — Орчин солих
**Statement:** Орчин хоорондын ялгаа зөвхөн environment variable-аар (NFR-MAINT-230) тодорхойлогдож, орчинд зориулсан code branch эсвэл build flag байхгүй **shall**.
- **Source:** Phase0 NFR-MAIN-008
- **Priority · Phase · Status:** Must · PH7 · partial
- **Verification:** Inspection — `NODE_ENV`-ээс бусад орчны нөхцөл шалгалт.
- **Acceptance:** Hard-code хийсэн орчны URL 0 (`next.config.ts`-ийн image host жагсаалтаас бусад).

#### NFR-PORT-140 — Web deploy
**Statement:** Web нь `web-deploy.yml`-ээр Vercel-д deploy хийгдэж, custom domain дээр HTTPS-ээр нээгдэнэ **shall**.
- **Source:** 01-vision §8; G1; roadmap PH7
- **Priority · Phase · Status:** Must · PH7 · partial (workflow бий; production deploy хийгдээгүй)
- **Verification:** Demonstration
- **Acceptance:** Domain дээр `/` 200, HTTPS сертификат хүчинтэй.

#### NFR-PORT-150 — Mobile build
**Statement:** Mobile build нь EAS-ээр `workflow_dispatch` гараар ажиллах workflow-аар үүснэ **shall**.
- **Source:** ADR-010
- **Priority · Phase · Status:** Won't (this release) · PH8 · implemented (`.github/workflows/mobile-build.yml`)
- **Verification:** Inspection
- **Acceptance:** Workflow trigger нь зөвхөн `workflow_dispatch` (+ PR lint).

### 5.8 SEO (NFR-SEO)

#### NFR-SEO-100 — Хуудас бүрийн metadata
**Statement:** Нийтийн хуудас бүр хайлтын систем болон share-д зориулсан давтагдашгүй metadata-тай байна **shall**.
- **Rationale:** G1 — зочин хайлтын системээс бараагаа олно.
- **Source:** Phase0 NFR-SEO-001…004
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### NFR-SEO-110 — Давтагдашгүй title
**Statement:** Бүтээгдэхүүний дэлгэрэнгүй хуудас бүр `<title>`-ийг «{нэр} — Ногоолин» хэлбэрээр агуулна **shall**.
- **Source:** Phase0 NFR-SEO-001; `apps/web/src/app/products/[slug]/page.tsx` (`generateMetadata`)
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — хоёр бүтээгдэхүүний HTML-ийн `<title>`
- **Acceptance:** Хоёр title өөр бөгөөд нэр агуулна.

#### NFR-SEO-120 — Meta description
**Statement:** Бүтээгдэхүүний дэлгэрэнгүй хуудас `<meta name="description">`-д `short_description`-ийг агуулна **shall**. Хоосон бол «{нэр} — Ногоолин цахим лавлах»-ыг агуулна **shall**.
- **Source:** Phase0 NFR-SEO-002; `generateMetadata`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — хоёр fixture (тайлбартай, тайлбаргүй)
- **Acceptance:** Хоёр тохиолдол хоёулаа хоосон биш description-тэй.

#### NFR-SEO-130 — Open Graph
**Statement:** Бүтээгдэхүүний дэлгэрэнгүй хуудас `og:title`, `og:description`, `og:url`-ийг агуулна **shall**. Зурагтай бол эхний зургаар `og:image`-ийг агуулна **shall**.
- **Source:** Phase0 NFR-SEO-003; `generateMetadata`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — HTML-ийн meta tag
- **Acceptance:** 4 tag (зурагтай үед) байна. `og:url` нь canonical-тэй тэнцүү.

#### NFR-SEO-140 — Canonical URL
**Statement:** Хуудас бүр canonical URL-тэй байна **shall**:
- бүтээгдэхүүний хуудас: `{site}/products/{slug}`;
- ангиллаар шүүсэн каталог: `{site}/products?category={slug}`;
- бусад шүүлтүүр (`q`, `page`)-тэй каталог: `{site}/products`.
- **Rationale:** Одоо ангиллаар шүүсэн хуудас ч `/products`-ийг canonical болгодог. Энэ нь sitemap-д байгаа ангиллын URL-тай зөрчилдөнө (Consistent).
- **Source:** Phase0 NFR-SEO-004; `(list)/page.tsx` (`alternates.canonical`), `sitemap.ts`
- **Priority · Phase · Status:** Must · PH3 · partial (бүтээгдэхүүн implemented, ангилал planned)
- **Verification:** Test — 3 URL төрлийн canonical
- **Acceptance:** Дээрх 3 дүрэм биелнэ.

#### NFR-SEO-200 — Crawl-ийн удирдлага
**Statement:** Систем хайлтын робот нийтийн хуудсыг олж, хувийн хуудсыг алгасах заавар өгнө **shall**.
- **Source:** Phase0 NFR-SEO-005, 006
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### NFR-SEO-210 — Sitemap
**Statement:** `/sitemap.xml` нь нүүр, `/products`, бүх идэвхтэй ангиллын URL, бүх published бүтээгдэхүүний URL-ыг (бүх хуудсыг дамжиж) агуулна **shall**. API хүрэх боломжгүй үед статик хоёр URL-тай хүчинтэй XML буцаана **shall**.
- **Source:** Phase0 NFR-SEO-005; `apps/web/src/app/sitemap.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — 13 published (2 хуудас) fixture-ээр URL-ын тоо
- **Acceptance:** Published бүтээгдэхүүний URL-ын тоо = published тоо. Draft URL байхгүй.

#### NFR-SEO-220 — robots.txt
**Statement:** `/robots.txt` нь `/admin/`, `/login`, `/signup`-ийг disallow хийж, sitemap-ийн байршлыг заана **shall**.
- **Source:** Phase0 NFR-SEO-006; `apps/web/src/app/robots.ts`
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Inspection — `/robots.txt`-ийн агуулга
- **Acceptance:** 3 disallow мөр болон `Sitemap:` мөр байна.

#### NFR-SEO-300 — Render ба URL
**Statement:** Нийтийн каталогийн хуудас JavaScript-гүйгээр уншигдах агуулгатай, хүн уншихуйц URL-тай байна **shall**.
- **Source:** Phase0 NFR-SEO-007, 008, 009
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** children

#### NFR-SEO-310 — Сервер талын render
**Statement:** Бүтээгдэхүүний жагсаалт болон дэлгэрэнгүй хуудасны анхны HTML хариу (JavaScript ажиллахаас өмнө) бүтээгдэхүүний нэр, үнэ, тайлбарыг агуулна **shall**.
- **Rationale:** ADR-006.
- **Source:** Phase0 NFR-SEO-007; App Router server component
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Test — `curl`-ээр авсан HTML-д нэр, үнэ байгаа эсэх
- **Acceptance:** Хоёр хуудасны HTML-д нэр, үнэ байна.

#### NFR-SEO-320 — Хүн уншихуйц slug
**Statement:** Бүтээгдэхүүний URL нь UUID биш, FR-PROD-150-ийн slug-ийг ашиглана **shall**.
- **Source:** Phase0 NFR-SEO-008
- **Priority · Phase · Status:** Must · PH3 · implemented
- **Verification:** Inspection — sitemap-ийн URL-ууд
- **Acceptance:** Sitemap-ийн бүтээгдэхүүний URL-д UUID байхгүй.

#### NFR-SEO-330 — Зургийн alt текст
**Statement:** Нийтийн хуудасны бүтээгдэхүүний зураг бүр хоосон биш `alt`-тай байна **shall**:
- `alt_text` байвал түүнийг;
- байхгүй бол gallery-д «{нэр} {дугаар}», картад «{нэр}»-ийг.

Launch-ийн өмнө бодит контентын зургуудын ≥ 90% нь admin оруулсан `alt_text`-тэй байна **shall**.
- **Source:** Phase0 NFR-SEO-009; `product-gallery.tsx`, `product-card.tsx`
- **Priority · Phase · Status:** Must · PH5 · partial (fallback implemented; admin-ийн alt оруулах UI нь FR-ADM-330)
- **Verification:** Test — `img:not([alt])`, `img[alt=""]`-ийн тоо 0; Analysis — `alt_text`-тэй зургийн хувь (SQL)
- **Acceptance:** Хоосон alt 0; бодит контентод ≥ 90%.

#### NFR-SEO-340 — Бүтээгдэхүүний structured data
**Statement:** Бүтээгдэхүүний дэлгэрэнгүй хуудас schema.org `Product` JSON-LD-г (`name`, `image`, `url`, `offers.price`, `priceCurrency=MNT`, `availability`) агуулна **shall**. Утгыг escape хийх нь NFR-SEC-ийн шаардлагыг хангана **shall** (`<` → `<`).
- **Source:** code `apps/web/src/app/products/[slug]/page.tsx:83–86`; F-05
- **Priority · Phase · Status:** Should · PH3 · partial (JSON-LD бий; escape planned)
- **Verification:** Test — Google Rich Results эсвэл schema validator; `</script>` агуулсан нэртэй fixture
- **Acceptance:** Validator алдаагүй. `</script>` нэртэй бүтээгдэхүүнээс шинэ element үүсэхгүй.

#### NFR-SEO-400 — Lighthouse SEO оноо
**Statement:** Production build, Lighthouse mobile preset (lab) дээр нүүр, `/products`, бүтээгдэхүүний дэлгэрэнгүй хуудас SEO оноо ≥ 90 авна **shall**. Хэмжих нөхцөл нь 1 warm-up + 5 sample, median.
- **Rationale:** G3. Vision §8 «Lighthouse SEO ≥ 90».
- **Source:** 01-vision §8; project-goals G3
- **Priority · Phase · Status:** Must · PH6 · unknown (not checked; baseline PH2)
- **Verification:** Analysis — `docs/quality/perf-baseline.md`-ийн protocol
- **Acceptance:** Гурван хуудасны median ≥ 90.

## 6. Verification

| Арга | Хэзээ хэрэглэх | Нотолгоо |
|---|---|---|
| **Test (T)** | Оролт, гаралт нь автоматаар эсвэл гараар давтагдах ажиглалт | Тестийн файл, CI log, pass/fail |
| **Inspection (I)** | Код, тохиргоо, баримтыг checklist-ээр унших (RLS, CI dependency, нууц утга) | Checklist + файл/мөр |
| **Analysis (A)** | Хэмжилт, тооцоо, статистик (Lighthouse median, bundle size, GLB хэмжээ) | Raw sample, нөхцөл, median/min–max ([perf baseline](../README.md#quality--quality)) |
| **Demonstration (D)** | Хүнээр ажиглах урсгал (usability task, intro-гийн мэдрэмж) | Task протокол, бичлэг эсвэл тэмдэглэл |

**Хэмжилтийн дүрэм (бүх Analysis):**
- Metric-ийг нэрээр нь бичнэ: LCP, CLS, INP, TBT, Lighthouse оноо, bundle size, GLB байт.
- Нөхцөл бичнэ: production build, Lighthouse mobile preset (simulated throttling), viewport, browser/version.
- 1 warm-up + 5 sample, median ба min–max.
- Lab хэмжилтийг field гэж нэрлэхгүй. Хэмжээгүй үед төлөв нь «хэмжигдээгүй».

**Тестийн хүрээ ба traceability:** Must шаардлага бүр [traceability v2](traceability-v2.md)-д verification-тэй байна (G4).

## 7. Шаардлагын чанарын шалгалт

### 7.1 Шалгуур (шаардлага бүрт)

| # | Шалгуур | Асуулт | Шалгах арга |
|---|---|---|---|
| 1 | **Correct** | Эх сурвалж, owner-ийн шийдвэр (D-xx, ADR), одоогийн кодтой нийцэж байна уу? | Source талбар ба кодын иш |
| 2 | **Unambiguous** | Нэг л утгаар уншигдах уу? «Хурдан», «хялбар», «гэх мэт» байхгүй юу? | Үгийн жагсаалтын script + уншиж шалгах |
| 3 | **Complete** | Нөхцөл, хариу, алдааны тохиолдол, UI төлөв бүрэн үү? | Acceptance, States мөр |
| 4 | **Consistent** | Бусад шаардлага, D-xx шийдвэртэй зөрчилдөхгүй юу? | Area хоорондын тулгалт (§7.4) |
| 5 | **Verifiable** | Pass/fail-аар шалгаж болох уу? | Verification + Acceptance |

Хичээлийн «шаардлага шалгах 5 арга»-ын албан нэрс өөр байвал энэ хүснэгтийг тааруулна ([нээлттэй асуулт](#8-нээлттэй-асуултууд)).

Багц түвшинд нэмж шалгах зүйлс: traceability, ID давхардал, хуучин ID-ийн бүрэн mapping, хүрээ.

### 7.2 Багц түвшний автомат шалгалтын үр дүн (2026-10-18)

| Шалгалт | Үр дүн |
|---|---|
| Шаардлагын тоо | 311 блок, үүнээс 250 leaf шаардлага (2026-10-27: D-09-ийн FR-PROD-190, FR-PUB-250, FR-PUB-260 нэмэгдсэн) |
| ID давхардал | 0 |
| Хуучин ID-ийн mapping | 202 / 202. Phase 0: 177, v1.0: 20, M2: 5. Тоолоогүй ID 0. ([mapping](id-mapping.md)) |
| Mapping-ийн тодорхойлогдоогүй шинэ ID | 0 |
| Traceability-ийн мөр | Leaf бүрт 1 ([traceability](traceability-v2.md)) |
| Олон утгатай үгийн script | Илэрсэн 2 statement-ийг зассан. Үлдсэн 0. |

**Leaf шаардлагын priority:** Must 170 · Should 41 · Could 10 · Won't (this release) 29.

**Хэрэгжилтийн төлөв (кодоос, тест ажиллуулаагүй):** implemented 136 · partial 34 · planned 46 · deferred 11 · unknown 23.

### 7.3 Area-аар

| Төрөл | Area | Блок | Leaf | Leaf Must |
|---|---|---|---|---|
| FR | AUTH | 16 | 13 | 11 |
| FR | USER | 9 | 7 | 2 |
| FR | CAT | 11 | 9 | 5 |
| FR | PROD | 22 | 19 | 15 |
| FR | MEDIA | 12 | 10 | 7 |
| FR | PUB | 22 | 18 | 11 |
| FR | INQ | 16 | 13 | 10 |
| FR | WISH | 6 | 5 | 5 |
| FR | ADM | 15 | 12 | 9 |
| FR | SET | 8 | 6 | 5 |
| FR | INTRO | 21 | 18 | 16 |
| FR | MOB | 12 | 9 | 0 |
| FR | AUD | 7 | 6 | 4 |
| FR | ORD | 9 | 7 | 0 |
| NFR | PERF | 25 | 19 | 14 |
| NFR | SEC | 23 | 18 | 16 |
| NFR | REL | 9 | 7 | 2 |
| NFR | USE | 16 | 13 | 9 |
| NFR | MAINT | 23 | 18 | 11 |
| NFR | COMP | 9 | 7 | 5 |
| NFR | PORT | 6 | 5 | 3 |
| NFR | SEO | 14 | 11 | 10 |

### 7.4 Review-ийн бүртгэл (илэрсэн асуудал ба шийдэл)

Шаардлага бичих явцад илэрсэн асуудлууд, area хоорондын consistency pass-ийн шийдлүүд энд бүртгэгдэнэ. **OPEN** гэж тэмдэглэсэн мөр нь owner-ийн шийдвэр эсвэл runtime шалгалт хүлээж байна.

| ID | Шалгуур | Асуудал | Шийдэл |
|---|---|---|---|
| FR-INQ-120 / FR-INQ-140 | Consistent | v1.0 FR-01/FR-03 нь зурвасыг заавал гэж үзсэн (web form). M2 FR-01 болон API schema нь сонголтот гэсэн. | Client (заавал, WF-INQ-01) болон API (сонголтот) дүрмийг FR-INQ-140-д тусад нь бичив. Client нь server-ийн хатуу дэд олонлог. |
| FR-INQ-140 | Consistent | v1.0 «утас 8 цифр» ↔ API `^[0-9+\s-]{8,15}$` | Хоёр түвшнийг тодорхой бичив. Mobile (G6) нь web-ийн дүрмийг дагах ёстой. Owner батлах: OPEN бүлгийг үз. |
| FR-INQ-330 | Consistent | Phase0 `new → contacted → closed` дараалал ↔ service нь ямар ч шилжилтийг зөвшөөрдөг, UI нь reopen санал болгодог | API-д утгын жагсаалтыг, UI-д санал болгох дарааллыг тусад нь бичив. Дарааллыг API-д хатуу хориглох эсэх нь OPEN. |
| FR-AUTH-110 | Correct | Phase0 нь email/password-ийг зөвхөн admin-д гэж заасан ↔ код нь customer-ийн signup/login-той | Одоогийн кодыг дагав. FR-AUTH-150 нэмэв. |
| FR-AUTH-230 | Complete | Гарсны дараа хуучин JWT ≤ 15 минут хүчинтэй хэвээр | Acceptance-д хязгаарыг ил бичиж, NFR-SEC-330-тай холбов. |
| FR-AUD-130 | Correct | Append-only нь RLS-ээр хамгаалагддаг ч API нь service_role (RLS-ийг тойрдог) ашигладаг | Шаардлагыг anon/authenticated role-оор хязгаарлаж, API repository-д update/delete байхгүйг inspection-д нэмэв. DB trigger-ээр хатуужуулах эсэх нь OPEN. |
| FR-AUD-110 | Complete | Үндсэн бичилт ба audit бичилт атомик биш, audit алдагдаж болно | Хүлээн зөвшөөрсөн хязгаар гэж Status-д бичив. Атомик болгох эсэх нь OPEN. |
| NFR-SEC-350 | Correct | `users_update_own` нь бүх баганыг зөвшөөрдөг. Web шууд Supabase update хийдэг. Grant migration хоосон. Эрх нэмэгдүүлэх эрсдэл. | Шинэ Must шаардлага нэмэв. Status: unknown. Runtime-д шалгаж, баганын grant эсвэл trigger-ээр засах ажил. **OPEN** (security) |
| NFR-SEC-240 | Verifiable | JSON-LD escape хийгдээгүй (F-05) | Шаардлага + XSS payload тест нэмэв. Засварыг тусдаа task-аар хийнэ. |
| NFR-SEC-252 | Correct | Phase0-ийн «auth 5/15min»-ыг Fastify-д тавина гэж заасан ч нэвтрэлт Supabase Auth-аар явдаг | Хязгаарыг Supabase Auth-ийн тохиргооны шаардлага болгов. Status unknown. |
| NFR-SEC-010 → NFR-SEC-320 | Complete | Phase0-д order route-ын ownership орсон | Consistency pass: захиалгын ownership-ийг FR-ORD-300 бичсэн (PH8). Шийдэгдсэн. |
| NFR-REL-110/120 | Unambiguous | «≥ 99% uptime» хэмжих арга, хугацаа заагаагүй | Сар бүр, 5 минутын давтамжтай гадны monitor гэж тодорхой болгов. |
| NFR-REL-120 | Consistent | Phase0 нь Railway-г заасан. Hosting-ийн эцсийн сонголт PH7-д хийгдэнэ. | Hosting-ийн нэрийг хасаж, endpoint-ээр хэмжинэ гэж бичив. |
| NFR-REL-130 | Unambiguous | «where available» гэдэг олон утгатай | ≥ 7 хоног өдөр тутмын backup + сэргээх туршилт болгов. PITR-г `may` болгов. |
| FR-WISH-* | Consistent | API замын нэр `/cart` боловч функц нь wishlist. Ирээдүйн ORD сагстай зөрчилдөнө. | Шаардлагад «wishlist» гэж нэрлэв. Endpoint-ийн нэрийг өөрчлөх эсэх нь OPEN. |
| FR-USER-120 | Verifiable | `full_name`-ийн дээд урт кодонд тодорхойгүй | 100 тэмдэгт гэж санал болгов. **OPEN** (кодонд хязгаар нэмэх эсвэл owner батлах). |
| NFR-SEC-140 | Complete | Web (Next.js)-ийн security header шалгагдаагүй | Status `partial` (web unknown). PH6-д шалгана. |
| FR-CAT-210 | Unambiguous | Phase 0 CAT-007 «any authenticated guest or customer» нь өөртэйгөө зөрчилдсөн (guest нь нэвтрээгүй) | Нэвтрэлт шаардахгүй гэж тодорхой бичсэн (код) |
| FR-CAT-131 | Complete | CAT-003 «нийтэд харагдахгүй» нь ангилал уу, түүний бүтээгдэхүүн үү гэдэг тодорхойгүй. Код нь бүтээгдэхүүнийг шүүдэггүй | Тусдаа Should шаардлага болгосон. OPEN — owner батлах |
| FR-PUB-120 | Consistent | PUB-008 `/categories/[slug]` нь кодын `/products?category=` болон sitemap-тай зөрчилдөнө | Кодыг дагаж дахин бичсэн |
| NFR-SEO-140 | Consistent | Ангиллаар шүүсэн хуудасны canonical `/products` нь sitemap-ийн ангиллын URL-тай зөрчилдөнө | Canonical дүрмийг URL төрлөөр тодорхойлсон; partial |
| FR-MEDIA-220 | Consistent | MEDIA-008 (10 MB) ↔ MEDIA-011 (≤5 MB зорилт) ↔ NFR-PERF-005 (5 MB) | 5 MB-аар нэгтгэсэн |
| FR-MEDIA-010 | Correct | Бичиг баримтын заавар нь системийн шаардлага биш | Хасаж, admin guide (баримт) болгон шилжүүлсэн |
| FR-PROD-320 | Correct | PROD-012-ийн нийтийн `status` шүүлтүүр нь FR-PROD-310-тэй зөрчилдөнө | `status`-ийг зөвхөн admin-д хамааруулсан |
| FR-SET-210 | Consistent | Phase 0 `403` гэрээ ↔ одоо route байхгүй (`404`) | Хоёр төлвийг acceptance-д бичсэн; PH8-д 403 |
| FR-SET-220 | Consistent | RLS `orders_insert_own` нь toggle-ийг шалгадаггүй тул API-г тойрох зам нээлттэй байж магадгүй (grants-аас хамаарна) | Шаардлага нэмсэн, status unknown. NFR-SEC-350-тай хамт тусдаа security task-аар runtime-д шалгана. **OPEN** |
| FR-ADM-720 | Complete | ConfirmDialog нь `div` бөгөөд role, Escape, focus буцаалт байхгүй | Тусдаа шаардлага, planned |
| FR-ADM-710 | Complete | Зураг устгах UI болон баталгаажуулалт байхгүй; impact (зургийн тоо) дутуу | partial, acceptance-д 5 үйлдэл |
| FR-PUB-150 | Complete | `error.tsx` байхгүй; API унтарвал Next-ийн default алдаа гарна | Error төлвийг шаардлагад нэмсэн, planned |
| FR-PUB-310 | Complete | «Featured on home» тоо, хоосон тохиолдол тодорхойгүй | 4–8, 0 үед нуух |
| FR-PROD-170 | Verifiable | «rich text or markdown» олон утгатай | Markdown + алхмын render + sanitize; тестлэх оролт заасан |
| FR-ORD-130 | Complete | Нийлбэрийн дүрэм байгаагүй | Σ дүрэм нэмсэн |
| F-07 | Consistent | Phase 0 NFR-PERF-007 «listing images lazy-loaded» ↔ LCP дүрэм | Consistency pass: NFR-PERF-410/420-оор шийдэгдсэн. Код аль хэдийн нийцсэн: эхний 4 карт болон gallery-ийн үндсэн зураг `priority`. |
| FR-3D (map scope) | Correct | Phase 0 FR-3D-001…011 бүгд интро эсвэл Rive-ийн тухай, per-product viewer-ийн ID байхгүй | Viewer нь FR-PUB-004/011, FR-MEDIA-007/008/011, FR-MOB-003/010-д бий. Бүгд Won't (this release), D-07. Шийдэгдсэн. |
| FR-ADM-006, FR-SET-007 | Consistent | Inbox UI болон toggle audit нь INQ/AUD area-д хамаарна | FR-INQ-300 болон FR-AUD-150 руу merge хийсэн. Шийдэгдсэн. |
| NFR-SEO-340 | Consistent | JSON-LD escape байхгүй (F-05) | Escaping-ийн шаардлага нь NFR-SEC-240. SEO-340 нь агуулгын тал. Засвар нь тусдаа task. |
| FR-ADM-200 | Verifiable | «dashboard display counts» нь «яг одоо юу хийх» гэдгийг хэлдэггүй | Шинэ inquiry-ийн холбоос, тоо нь DB-тэй таарах шалгуур |
| NFR-PERF-210 | Consistent | F-07: Phase0 PERF-001 ≥ 80, PERF-003 ≥ 85, G3 ≥ 90 гурван өөр босго | G3-ийн ≥ 90-ээр нэгтгэж, provisional гэж тэмдэглэв (NFR-PERF-130) |
| NFR-PERF-410/420 | Consistent | F-07: PERF-007 «listing зураг бүгд lazy» ↔ LCP зураг lazy байх ёсгүй | Fold-оос дээш priority / доош lazy гэж салгав; код аль хэдийн ингэж хийгдсэн |
| NFR-PERF-220 | Consistent | v1.0 NFR-04 «2.0 s, 9/10 run» ↔ G3 «LCP < 2.5 s, median» | G3-аар шийдэв; OPEN — owner 2.0 s stretch зорилт хадгалах эсэх |
| NFR-PERF-220 | Unambiguous | Phase0 PERF-002 «load within 2 seconds» ямар metric болох нь тодорхойгүй | LCP + NFR-PERF-110 нөхцөл |
| NFR-PERF-510 | Unambiguous | «under normal load» тодорхойгүй | 10 зэрэгцээ, 60 s, p95, 30 бүтээгдэхүүний seed |
| FR-INTRO-110 | Unambiguous | FR-3D-008 «or show a minimal version» хоёр утгатай | Session-д нэг удаа, дараа нь шууд hero гэж нэг утгатай болгов |
| FR-INTRO-350 | Verifiable | FR-3D-006 «performance is insufficient» хэмжигдэхгүй | hardwareConcurrency/deviceMemory ≤ 2 босго, Could |
| FR-INTRO-130…170 | Correct | Phase0 FR-3D-003/004 нь автомат 5 s arc-ийг тодорхойлсон; D-08 click-intro-оор орлогдсон | D-08-ийг дагав; WF-INTRO-02-ийн шинэчлэл PH2 |
| FR-INTRO-150 | Verifiable | «тэсрэлттэй эхэлж удааширна» гэдэг мэдрэмжийн тодорхойлолт | 20%-д ≥ 50% өнцөг, сүүлийн 10%-д ≤ 3% гэсэн хэмжүүр |
| FR-INTRO-140 | Complete | Шилжилтийн үеийн нэмэлт click-ийн зан төлөв тодорхойгүй | Алхам алгасахгүй гэсэн acceptance нэмэв |
| FR-INTRO-330 | Complete | v1.0-д GLB алдааны сэргэлт «known gap» | Тусдаа Must шаардлага болгов (planned) |
| FR-MOB-* | Consistent | Phase0-д Must; owner шийдвэр «mobile дараагийн release» | Won't (this release) · PH8; хэрэгжсэн төлөвийг хадгалав |
| FR-MOB-130 | Consistent | FR-MOB-003/010 360° viewer ↔ D-07 deferred | deferred |
| FR-MOB-310 | Consistent | FR-3D-010 Rive ↔ D-08 (WF-MO-03 C-гээр орлогдсон) | C-тэй нийцсэн анимаци; runtime-ийн сонголт OPEN (G6) |
| NFR-MAINT-610/620 | Correct | FR-MOB-008/009 нь FR биш, дизайны хязгаарлалт | NFR-MAINT руу шилжүүлэв |
| NFR-USE-110…130 | Correct | Phase0 ACC-001…003 Should; G3 Accessibility ≥ 90 Must | Must болгов |
| NFR-MAINT-210 | Verifiable | Commit дүрэм баталгаажуулах механизм байхгүй; одоогийн history зөрчилтэй | commitlint/CI regex, огнооноос хойш хамаарна; Should |
| NFR-MAINT-320 | Complete | Тест self-skip-ээр CI ногоон болдог (v1.0 gap) | 4 сөрөг/эерэг acceptance; partial хэвээр |
| NFR-PERF-610 | Correct | `@fastify/rate-limit`-ийн default in-memory store нь олон instance-д хуваалцагдахгүй | Энэ release-д API нэг instance гэж тооцно (NFR-SEC-250-ийн хязгаар нэг instance-д хүчинтэй). Олон instance болох үед хуваалцсан store шаардлагатай. **OPEN** (owner) |
| NFR-USE-150 | Consistent | NFR-ACC-005 ↔ NFR-SEO-009 давхцал | Хоёуланг хадгална: USE-150 нь хүртээмжийн, SEO-ийнх нь хайлтын системийн тал. Нэг тестээр хоёуланг шалгана. Шийдэгдсэн. |
| FR-MOB-520 | Consistent | FR-MOB-006 ↔ NFR-REL-005 давхцал | FR-MOB-520 нь функц, NFR-REL-230 нь чанарын шалгуур. Cross-ref хийсэн. Шийдэгдсэн. |
| NFR-USE-320 | Consistent | G2 «≤ 2 мин» нь FR-INQ-тэй холбоотой | Хэмжүүр нь USE-д, функц нь FR-INQ-100-д. Шийдэгдсэн. |
| NFR-COMP-200 | Unambiguous | Доод өргөн 375 px; C prototype 390 px-д шалгагдсан; 320 px төхөөрөмж | OPEN — 320 px хүртэл бууруулах эсэх |

**Аюулгүй байдлын хоёр сэжигтэй асуудал** кодыг уншиж илрүүлсэн, runtime-д батлагдаагүй. F-05-ийн нэгэн адил тус бүрийг тусдаа task болгоно:
- **NFR-SEC-350:** `users_update_own` RLS бодлогоор customer өөрийн `role`-ийг өөрчилж болзошгүй.
- **FR-SET-220:** `orders_insert_own` бодлого нь `delivery_enabled`-ийг шалгадаггүй.

## 8. Нээлттэй асуултууд

Owner батлах ёстой. ID нь холбогдох шаардлагыг заана.

- **Хичээл:** «шаардлага шалгах 5 арга»-ын яг нэрс (§7.1). QA хичээлийн агуулга ирэхэд NFR болон PH6-ийг тааруулна.
- **Огноо:** [project-goals](../project/project-goals.md) G1–G6 болон [roadmap](../project/roadmap.md)-ийн огноонууд.
- **NFR-SEC-350 (security, яаралтай).** Customer Supabase-аар шууд `users.role`-оо өөрчилж чадах эсэхийг runtime-д шалгах шаардлагатай. Чадах бол баганын grant эсвэл `before update` trigger-ээр хаана. Энэ нь F-05-тай адил тусдаа task.
- **FR-INQ-140:** Mobile (G6) болон API нь web-ийн «яг 8 цифр»-ийг дагах уу, эсвэл API-ийн 8–15 тэмдэгт (+, зай, зураас) хэвээр үлдэх үү?
- **FR-INQ-330:** API нь шилжилтийн дарааллыг хатуу хориглох ёстой юу (жишээ нь `closed → new`-ийг хориглох)?
- **FR-INQ (шинэ санаа):** G2-ийн «1 ажлын өдөрт хариулах»-ыг хангахын тулд шинэ асуулга ирэхэд admin-д мэдэгдэл (email/SMS/Telegram) хэрэгтэй юу? Одоо ямар ч мэдэгдэл байхгүй. FR-INQ-340 нь зөвхөн inbox доторх тэмдэглэгээ.
- **FR-WISH-*:** `/api/v1/cart`-ийг ORD (PH8)-ээс өмнө `/wishlist` болгож нэрлэх үү?
- **FR-AUD-110/130:** Audit бичилтийг үндсэн өөрчлөлттэй атомик болгох (DB function/transaction) болон DB trigger-ээр append-only-г хатуужуулах уу?
- **FR-USER-120:** `full_name`-ийн дээд урт (санал 100).
- **NFR-REL-130:** Production Supabase tier (free tier-ийн backup хадгалалт, PITR байхгүй) ба backup бодлого.
- **NFR-SEC-500:** Inquiry-ийн хувийн мэдээллийг хэр удаан хадгалах вэ (retention), устгах хүсэлтийг яаж шийдэх вэ?
- FR-CAT-131: Идэвхгүй ангиллын published бүтээгдэхүүнийг нийтээс нуух уу, эсвэл «ангилалгүй» харагдах уу?
- FR-PUB-120 / NFR-SEO-140: ангиллын URL `/products?category=` хэвээр байх уу, `/categories/[slug]` руу шилжих үү? Canonical болон SEO-д нөлөөлнө.
- FR-SET-220: `orders` руу customer-ийн шууд insert local stack дээр бодитоор боломжтой эсэхийг шалгах. Боломжтой бол RLS-д `delivery_enabled` шалгалт нэмэх. Энэ нь кодын өөрчлөлт.
- FR-PUB-310: нүүрэнд хэдэн featured бүтээгдэхүүн харуулах вэ (санал 4–8)? D-08 C дизайны layout-аас хамаарна.
- FR-ADM-200: хянах самбарт өөр ямар тоо хэрэгтэй вэ (жишээ нь зураггүй/заавааргүй бүтээгдэхүүний тоо — G1 контентын бэлэн байдал)?
- NFR-SEO-330: бодит контентын alt текстийн ≥ 90% зорилт owner-т боломжийн эсэх.
- FR-MEDIA-230: per-product GLB-ийг PH8-д эргэж авч үзэхэд серверийн Draco шахалт уу, гараар шахах уу?
- NFR-PERF-220 / v1.0 NFR-04: LCP ≤ 2.5 s (G3) хангалттай юу? Эсвэл хуучин «2.0 s, 9/10 run» зорилтыг stretch болгож хадгалах уу?
- NFR-PERF-210/220/230/510/520: босгыг PH2-ийн baseline-ий дараа батлах (NFR-PERF-130). Cache-Control-ийн max-age утга?
- NFR-PERF-610: rate-limit store-ийг олон instance-д хуваалцах уу (Redis), эсвэл MVP-д нэг instance гэж тооцох уу?
- FR-MOB-310: mobile интроны runtime — Rive (ADR-004) хэвээр үү, эсвэл C-ийн 3D-ийг expo-gl-ээр давтах уу? (G6)
- FR-INTRO-140: алхам бүрийн 4 гол өгүүлбэр ба эцсийн уриаг owner батлах (prototype C-гийн текстүүд түр).
- NFR-COMP-200: дэмжих доод өргөн 375 эсвэл 320 px?
- NFR-COMP-100: Safari-г бодит iOS төхөөрөмж дээр шалгах уу, эсвэл Playwright WebKit хангалттай юу?
- NFR-USE-310/320: usability-д оролцогч (дэлгүүрийн 5 үйлчлүүлэгч) олдох эсэх; олдохгүй бол «хэмжигдээгүй» хэвээр.
- NFR-MAINT-210: commitlint-ийг CI-д нэмэх үү, эсвэл зөвхөн дүрэм болгон үлдээх үү?
