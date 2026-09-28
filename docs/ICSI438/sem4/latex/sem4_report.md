---
lang: mn
---

\input{sem4-title.tex}

# Nogoolin архитектурын баримт бичиг

**arc42 v9 lean profile · ICSI438 Seminar 4 / M4 · Тэнгис · v0.1 draft · 2026-09-28**

Энэ баримт нь Nogoolin-ийн одоогийн код, Seminar 3-ын SRS болон шийдвэрийн бүртгэлийг нэг архитектурын зураглалд холбов. Arc42-ийн 12 хэсгийг хадгалж, §3, §5, §6-д C4 загварыг хэрэглэв. Week 04 Lab Assignment-ийн §1, §3, §5, гурван MADR, persona холбоо, ≥80% FR coverage болон UE-4 шаардлагыг энэ хувилбарт тусгав. Lecture 04 хараахан байхгүй.

| Талбар | Утга |
|---|---|
| Төсөл | Nogoolin |
| Зохиогч | Тэнгис |
| Хувилбар | v0.1 draft |
| Requirements baseline | [SRS v1.0 draft](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md), [20 мөртэй matrix](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/traceability-matrix-v1.0.md) |
| Public repository | <https://github.com/Tengis01/Nogoolin> |
| Аргачлал | [arc42 v9](https://arc42.org/download/), [C4 model](https://c4model.com/) ба ADR |

# 1. Оршил ба зорилго

## 1.1 Системийн зорилго

Nogoolin нь Монголын шашны бүтээгдэхүүний каталог, хэрэглэгчийн inquiry, хадгалсан бүтээгдэхүүний жагсаалт болон админ удирдлагыг web, mobile, REST API-аар нийлүүлэх систем. Одоогийн M4 хүрээ нь SRS-д тогтоосон inquiry, wishlist, admin inquiry болон нүүрний fallback урсгалд төвлөрнө.

## 1.2 Оролцогч талууд

| Оролцогч | Архитектураас хүлээх зүйл |
|---|---|
| Зочин ба хэрэглэгч | Каталог үзэх, inquiry илгээх, өөрийн өгөгдөлд л хандах |
| Админ | Inquiry-г шүүх, төлөв солих, өөрчлөлтийг audit-д үлдээх |
| Тэнгис, хөгжүүлэгч | Нэг repository-д ойлгомжтой бүтэц, локал шалгалт, бага operational overhead |
| ICSI438 багш | SRS → architecture → decision холбоог шалгах боломж |

## 1.3 Архитектурын гол зорилгууд

1. **Өгөгдөл тусгаарлалт:** JWT, ownership filter, RBAC, RLS-ийг давхар хэрэглэж NFR-01-ийг хангах.
2. **Засварлах боломж:** Controller → Service → Repository хилийг хадгалж, UI/API/schema drift-ийг бууруулах.
3. **Хүртээмж ба fallback:** хөдөлгөөн багасгах тохиргоо, static hero-г хадгалж NFR-02-ыг хангах.
4. **Шалгаж болох build:** integration test үнэхээр ажилласан эсэхийг CI ялгаж NFR-03-ын false-green эрсдэлийг арилгах.
5. **Хариу өгөх хугацаа:** каталогийн замыг NFR-04-ийн 2.0 секундийн босготой уялдуулах.

# 2. Хязгаарлалт

| Төрөл | Хязгаарлалт |
|---|---|
| Баг | Нэг хөгжүүлэгч; microservice-ийн нэмэлт ажиллагааг даахгүй |
| Технологи | TypeScript monorepo; Next.js, Expo, Fastify, Supabase, Zod |
| Архитектур | Нэг Fastify backend; controller/service/repository давхарга |
| Өгөгдөл | Local-first Supabase CLI; cloud project Phase 6 хүртэл үүсээгүй |
| Аюулгүй байдал | Secret зөвхөн environment variable-д; RLS бүх хүснэгтэд |
| Хүргэлт | `delivery_enabled=false`; order урсгал M4-ийн идэвхтэй scope биш |
| Нотолгоо | Planned test-ийг executed/verified гэж тэмдэглэхгүй |

# 3. Контекст ба хамрах хүрээ

Arc42 §3 нь системийн хил, хэрэглэгч болон хөрш системийг харуулна. C4 System Context нь Nogoolin-ийг нэг black box болгон үзүүлж, дотоод технологийн дэлгэрэнгүйг §5 руу үлдээв.

![C4-01 — Nogoolin System Context](../tmp/diagrams/c4-01-system-context.pdf){width=100%}

*Mermaid эх: [c4-01-system-context.mmd](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem4/diagrams/c4-01-system-context.mmd).*

**Зургийн тэмдэглэгээ:** Person нь хүний role, Software System нь нэг систем, Container нь ажиллах application, Component нь API доторх нэгж. Цэнхэр хүрээ Nogoolin-ийн эзэмшил, саарал хүрээ external system. Сум бүр data flow label-тай. Mermaid flowchart дээр C4 type, name, technology, responsibility-г ил тод бичсэн; runtime нь C4-ийн зөвшөөрсөн sequence style.

## 3.1 Бизнес контекст

| Харилцагч | Nogoolin руу орох мэдээлэл | Nogoolin-оос гарах мэдээлэл |
|---|---|---|
| Зочин | Каталогийн хайлт, inquiry form | Бүтээгдэхүүн, inquiry confirmation |
| Хэрэглэгч | Session, inquiry, wishlist үйлдэл | Өөрийн inquiry, хадгалсан бүтээгдэхүүн |
| Админ | Inquiry filter, status command | Inbox, шинэ төлөв, audit үр дүн |
| OAuth provider | Authorization response | OAuth authorization request |
| Supabase platform | Auth/storage/database response | Auth, query, storage request |

## 3.2 Техникийн контекст

- Browser ба mobile client нь HTTPS JSON API-аар Fastify backend-тай харилцана.
- Web/mobile нь Supabase Auth-тай session үүсгэнэ; API JWT-г шалгана.
- Repository давхарга PostgreSQL болон Storage-тай Supabase client-аар харилцана.
- Production-ийн Cloudflare, Vercel, Railway нь төлөвлөсөн target; local development-д localhost ба Supabase CLI stack хэрэглэгдэнэ.

## 3.3 W1 persona-тай холбоо

W1-д нэг хөгжүүлэгч persona, Тэнгис, болон P1/P2/P3 pain point байсан. Тэдгээрийг шинэ хэрэглэгчтэй хийсэн ярилцлага гэж өөрчлөхгүй. Доорх гурван external role нь Nogoolin-ийн бизнес actor; W1 persona-ийн оношлох хэрэгцээг role бүрийн architecture boundary-д шилжүүлэн холбов.

| External actor | W1 холбоо | Nogoolin-д тайлбарласан холбоо |
|---|---|---|
| Зочин | [P3: local/pipeline ялгаа](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem1/wiki/02_audience_persona.md) | Inquiry response ба алдаа аль API/DB хэсэгт гарсныг ялгах |
| Customer | [P1: session алдагдах](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem1/wiki/02_audience_persona.md) | Session, own inquiry, wishlist boundary; P-NG-01 |
| Админ | [P1, P3](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem1/wiki/02_audience_persona.md) | JWT/role болон data query/audit-ийг тусад нь шалгах |

Энэ нь гурван role-ийг W1-ийн нэг persona-тай холбосон mapping; W1-д гурван тусдаа persona байсан гэж зарлаагүй. [W2 pivot](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem2/wiki/persona-and-pivot.md) нь шилжилтийн үндэслэлийг хадгална.

# 4. Шийдлийн стратеги

| Зорилго/хязгаарлалт | Стратеги | Холбогдох шийдвэр |
|---|---|---|
| Solo developer, бага ажиллагаа | Нэг Fastify backend бүхий layered monolith | [ADR-007](https://github.com/Tengis01/Nogoolin/blob/main/docs/architecture/adr/adr-007-layered-monolith.md) |
| TypeScript REST API | Fastify plugin/hook болон schema validation | [ADR-003](https://github.com/Tengis01/Nogoolin/blob/main/docs/architecture/adr/adr-003-fastify.md) |
| Relational data, auth, storage, RLS | Supabase platform, repository abstraction | [ADR-005](https://github.com/Tengis01/Nogoolin/blob/main/docs/architecture/adr/adr-005-supabase.md) |
| SEO ба admin/public web | Next.js App Router; одоогийн ADR-006 |
| Shared contract | Zod schema-г `packages/validation-schemas`-д төвлөрүүлэх |
| Local-first security test | Supabase CLI migrations; одоогийн ADR-011 |

Энэ хэсэг сонголтыг товч харуулна. Static бүтэц §5, runtime харилцан үйлчлэл §6, бүрэн decision reasoning §9-ийн ADR холбоосуудад байна.

# 5. Бүрэлдэхүүний зураглал

## 5.1 Level 1 — Container view

![C4-02 — Nogoolin Container View](../tmp/diagrams/c4-02-container.pdf){width=100%}

*Mermaid эх: [c4-02-container.mmd](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem4/diagrams/c4-02-container.mmd).*

| Container | Үүрэг | Технологи ба code location |
|---|---|---|
| Web + Admin | Public catalog, inquiry, wishlist, profile, admin inbox | Next.js; `apps/web` |
| Mobile | Catalog, auth; inquiry/wishlist mobile хэсэг дутуу | Expo/React Native; `apps/mobile` |
| REST API | Auth boundary, business rule, persistence orchestration | Fastify/TypeScript; `backend/api` |
| Shared validation library | Web/API contract; deployable container биш | Zod; `packages/validation-schemas` |
| Supabase Auth | Session, JWT, OAuth bridge | Local stack; cloud deferred |
| PostgreSQL | Product, inquiry, cart, audit ба RLS | `supabase/migrations` |
| Storage | Product media | Supabase Storage |

## 5.2 Level 2 — Fastify API component view

![C4-03 — Fastify API Component View](../tmp/diagrams/c4-03-api-component.pdf){width=100%}

*Mermaid эх: [c4-03-api-component.mmd](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem4/diagrams/c4-03-api-component.mmd).*

| Component | Үүрэг | Хил ба requirement |
|---|---|---|
| Plugins/Hooks | Helmet, CORS, rate limit, auth, RBAC, validation | FR-05, FR-10, NFR-01 |
| Controllers | HTTP input/output, status code, route composition | FR-01…14 |
| Services | Business rule, state transition, ownership orchestration | FR-02, FR-09, FR-11…14, NFR-05 |
| Repositories | Supabase query ба DB-specific mapping | FR-01…14, NFR-01 |
| Shared schemas | Request/response validation contract | FR-03, NFR-03 |
| Audit repository | Admin mutation болон denied-access audit | FR-09, NFR-01 |

Controller дотор business logic, service дотор шууд database query хийхгүй. Энэ хил нь ADR-007-ийн гол үр дагавар бөгөөд кодын одоогийн folder structure-тэй таарна.

## 5.3 Building block → SRS холбоо

| Building block | Хариуцах requirement ID |
|---|---|
| Web public/inquiry/history | FR-01, FR-03, FR-04, FR-06, FR-15; NFR-02/04 |
| Web admin inbox | FR-07, FR-08, FR-09; NFR-01 |
| Web wishlist | FR-10, FR-11, FR-12, FR-13, FR-14; NFR-01 |
| API plugins/auth/validation | FR-02, FR-03, FR-05, FR-10; NFR-01 |
| Inquiry controller/service/repository | FR-01, FR-02, FR-04, FR-06, FR-07, FR-08, FR-09; NFR-05 planned |
| Cart controller/service/repository | FR-10, FR-11, FR-12, FR-13, FR-14 |
| PostgreSQL/Auth/audit | FR-01, FR-02, FR-06, FR-09, FR-12; NFR-01 |
| CI/deployment tooling | NFR-03 gap; бүрэлдэхүүнд оноосон боловч хэрэгжээгүй |

Бүх ID-ийн [SRS эх](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md) болон [20 мөрийн architecture mapping](https://github.com/Tengis01/Nogoolin/blob/main/docs/architecture/architecture-traceability.md) холбоотой. Functional mapping coverage **15/15 = 100%**, DoD-ийн ≥80% буюу 12/15 босгыг хангана. **Orphan FR: 0**. NFR-03/05 нь orphan биш, хариуцах building block байгаа ч хэрэгжилтийн gap; W5 төлөвлөгөөнд үлдээнэ. Coverage нь runtime test pass гэсэн үг биш.

# 6. Ажиллах үеийн зураглал

## 6.1 Inquiry илгээх

![C4-D01 — Inquiry Runtime](../tmp/diagrams/c4-d01-inquiry.pdf){width=100%}

*Mermaid эх: [c4-d01-inquiry.mmd](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem4/diagrams/c4-d01-inquiry.mmd).*

Guest эсвэл customer form илгээхэд client ба API ижил Zod contract ашиглана. Hook нь optional session, input болон rate limit-ийг шалгана. Service нь inquiry үүсгэж repository-оор PostgreSQL-д хадгална. Invalid input `400`, хэтрэлт `429`, амжилт `201` байна. Энэ scenario FR-01…06, NFR-01, NFR-04, NFR-05-тай холбоотой.

## 6.2 Wishlist жагсаалт ба хадгалалт

![C4-D02 — Wishlist Runtime](../tmp/diagrams/c4-d02-wishlist.pdf){width=100%}

*Mermaid эх: [c4-d02-wishlist.mmd](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem4/diagrams/c4-d02-wishlist.mmd).*

Guest API түвшинд `401` авна. Customer session баталгаажсаны дараа service published product болон ownership-ийг шалгаж, repository unique user-product constraint-тай ажиллана. Remove нь idempotent байна. Энэ scenario FR-10…14 ба NFR-01-ийг хамарна.

## 6.3 Админ inquiry төлөв шинэчлэх

![C4-D03 — Admin Inquiry Runtime](../tmp/diagrams/c4-d03-admin-inquiry.pdf){width=100%}

*Mermaid эх: [c4-d03-admin-inquiry.mmd](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem4/diagrams/c4-d03-admin-inquiry.mmd).*

Admin inbox command API-д очиход JWT ба role шалгана. Schema зөвшөөрөгдсөн status утгыг шалгаж, service шинэчлэлт хийж, primary update амжилттай болсны дараа audit row нэмнэ. Customer `403`, invalid status `400`, unknown ID `404` авна. Энэ scenario FR-07…09 ба NFR-01-тэй холбоотой.

# 7. Байршуулалтын зураглал

| Орчин | Web | API | Data/Auth/Storage | Төлөв |
|---|---|---|---|---|
| Local | `localhost:3000` | `localhost:3001` | Supabase CLI Docker stack | Ашиглаж буй development target |
| Production | Vercel | Railway Docker | Supabase cloud, Singapore | Phase 6-д төлөвлөсөн; ажиллаж буй мэт батлаагүй |
| Edge | Cloudflare DNS/WAF | API domain proxy | Хамаарахгүй | Production target |
| Mobile distribution | Expo dev client / EAS | Ижил REST API | Supabase Auth | EAS build manual trigger |

Нууц утгууд diagram эсвэл баримтад бичигдэхгүй. Production topology нь `docs/phase-0/09-deployment.md`-ийн зорилтот загвар; cloud project одоогоор байхгүй.

# 8. Хөндлөн огтлох ойлголтууд

| Ойлголт | Хэрэгжүүлэх зарчим |
|---|---|
| Authentication | Supabase session; API JWT verification |
| Authorization | `requireAuth`/`requireAdmin`, ownership filter, PostgreSQL RLS |
| Validation | Shared Zod schema; client validation нь UX, server validation нь заавал |
| Error contract | Тогтвортой HTTP status болон хэрэглэгчид ойлгомжтой message |
| Audit | Admin mutation ба denied access-ийг append-only log-д үлдээх |
| Configuration | Environment variable; secret repository-д хадгалахгүй |
| Resilience | Reduced motion, WebGL static fallback, idempotent remove |
| Observability | Одоогоор structured application log ба audit; production monitoring deferred |

# 9. Архитектурын шийдвэрүүд

US-4.3-ийн Tech Stack, Persistence, Interface ангилал бүрд нэг MADR бичив. ADR-003/005 нь одоогийн шийдвэрийн дэлгэрэнгүй; M4-IF-01 нь одоогийн REST contract-ийг баримтжуулсан course record. ADR-007 нь нэмэлт архитектурын үндэслэлээр тусдаа эхэд хадгалагдана.

| ID | Шийдвэр | Status | Requirements/C4 холбоо |
|---|---|---|---|
| [ADR-003](https://github.com/Tengis01/Nogoolin/blob/main/docs/architecture/adr/adr-003-fastify.md) | Fastify over Express | Accepted | FR-01…14, NFR-03/04; C4-02/03/D01…D03 |
| [ADR-005](https://github.com/Tengis01/Nogoolin/blob/main/docs/architecture/adr/adr-005-supabase.md) | Supabase over Firebase/self-hosted PostgreSQL | Accepted | FR-01…14, NFR-01/05; бүх data/auth view |
| [M4-IF-01](https://github.com/Tengis01/Nogoolin/blob/main/docs/architecture/adr/m4-if-01-rest-interface.md) | Versioned REST + shared Zod contract | Accepted, existing implementation | FR-01…14, NFR-01/03; C4-02/03 |

ADR-006 Next.js, ADR-010 manual EAS build, ADR-011 local-first DB нь [decision log](https://github.com/Tengis01/Nogoolin/blob/main/agent-context/DECISIONS.md)-д хэвээр бөгөөд энэ M4-д бүрэн карт болгон давтаагүй.

# 10. Чанарын шаардлага

| ID | Quality scenario | Архитектурын хариу | Verification төлөв |
|---|---|---|---|
| NFR-01 | A хэрэглэгч B-ийн inquiry/wishlist-г харахгүй | JWT + ownership + RLS; C4-D01/D02/D03 | Partial inspection; runtime matrix planned |
| NFR-02 | Reduced motion үед CTA 1 секундэд бэлэн | Web container static/reduced-motion path | Implemented; test planned |
| NFR-03 | DB integration suite skip бол CI fail | Build/deployment gate; local Supabase dependency | Gap; planned W9 |
| NFR-04 | 10 run-ийн 9-д каталог ≤2.0 s | SSR/SSG, Fastify, indexed PostgreSQL query | Defined; measurement not executed |
| NFR-05 | Ижил idempotency key 24 цагт нэг inquiry | Service/repository key store шаардлагатай | Planned; not implemented |

# 11. Эрсдэл ба техникийн өр

| Эрсдэл/өр | Нөлөө | Одоогийн хариу |
|---|---|---|
| CI local DB provision хийхгүй | Integration test бүгд skip хийгээд green болох | NFR-03 gap гэж ил тод тэмдэглэсэн |
| Inquiry idempotency key store байхгүй | Retry давхар inquiry үүсгэж магадгүй | NFR-05 planned; ADR шаардлагатай байж болно |
| Phase 0-ийн Express/хуучин path | Architecture drift, буруу diagram | Код ба decision log-ийг M4 source болгосон |
| Production service үүсээгүй | Deployment зураг нотолгоо мэт ойлгогдох | §7-д target гэж тэмдэглэсэн |
| Mobile inquiry/wishlist дутуу | Container capability зөрөх | C4-02 болон status-д gap гэж тэмдэглэсэн |
| Mermaid renderer/layout өөрчлөгдөх | Renderer update layout эвдэх | CLI 11.17.0 pin, lockfile, SVG diff ба targeted visual QA |

# 12. Нэр томьёо

| Нэр | Тайлбар |
|---|---|
| arc42 | Architecture documentation-ийн 12 хэсэгтэй бүтэц |
| C4 | System Context, Container, Component, Code гэсэн zoom түвшний загвар |
| Container | Тусдаа ажиллах эсвэл deploy хийх application/data store |
| Component | Container доторх тодорхой үүрэгтэй нэгж |
| Dynamic view | Нэг feature ажиллах үеийн элементүүдийн дараалал |
| ADR | Нэг архитектурын шийдвэрийн context, choice, consequence бүртгэл |
| RLS | PostgreSQL Row Level Security |
| Layered monolith | Нэг deployable API дотор хариуцлагаар тусгаарласан давхаргууд |

## Эх сурвалж

- [arc42 template v9 download](https://arc42.org/download/)
- [arc42 §3 — Context and Scope](https://docs.arc42.org/section-3/)
- [arc42 §5 — Building Block View](https://docs.arc42.org/section-5/)
- [arc42 §6 — Runtime View](https://docs.arc42.org/section-6/)
- [C4 model — System Context](https://c4model.com/diagrams/system-context)
- [C4 model — Dynamic diagram](https://c4model.com/diagrams/dynamic)
- [Mermaid C4 syntax](https://mermaid.js.org/syntax/c4)
- [ADR templates](https://adr.github.io/adr-templates/)

\newpage

# Architecture Traceability — M4 v0.1 draft

Энэ хүснэгт нь [Seminar 3-ын 20 мөртэй traceability matrix](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/traceability-matrix-v1.0.md)-ийн ID-г өөрчлөлгүй архитектурын element, arc42 section, C4 view болон ADR-тай холбоно. Энэ нь verification execution-ийн шинэ нотолгоо биш.

\begingroup\footnotesize\setlength{\tabcolsep}{2pt}\sloppy

| ID | Architecture responsibility | arc42 | C4 view | ADR | Architecture status |
|---|---|---|---|---|---|
| [FR-01](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-01--зочны-inquiry-үүсгэх) | Inquiry Controller → Service → Repository | §5, §6.1 | C4-02, C4-03, C4-D01 | 003, 005, 007 | Implemented path; test planned |
| [FR-02](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-02--нэвтэрсэн-хэрэглэгчийн-inquiry-г-холбох) | optionalAuth, session-derived customer ID | §5.2, §6.1, §8 | C4-03, C4-D01 | 003, 005, 007 | Implemented; test planned |
| [FR-03](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-03--inquiry-form-ийг-баталгаажуулах) | Shared Zod schema and validation hook | §5.2, §8 | C4-03, C4-D01 | 003, 007 | Implemented; test planned |
| [FR-04](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-04--inquiry-баталгааг-харуулах) | Inquiry response and Web success state | §5.1, §6.1 | C4-02, C4-D01 | 003, 007 | Implemented; test planned |
| [FR-05](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-05--inquiry-rate-limit-хэрэгжүүлэх) | Fastify route rate limit | §5.2, §6.1, §8 | C4-03, C4-D01 | 003, 007 | Implemented; test planned |
| [FR-06](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-06--өөрийн-inquiry-history-г-харах) | Authenticated own-inquiry query and RLS | §5.2, §6.1, §8 | C4-03, C4-D01 | 005, 007 | Implemented; test planned |
| [FR-07](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-07--админ-inquiry-inbox-харах) | Admin inbox controller/repository | §5.1, §6.3 | C4-02, C4-03, C4-D03 | 003, 005, 007 | Implemented; test planned |
| [FR-08](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-08--админ-inquiry-шүүх) | Admin query validation and filtering | §5.2, §6.3 | C4-03, C4-D03 | 003, 007 | Implemented; test planned |
| [FR-09](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-09--inquiry-төлөв-шинэчлэх) | Status service and audit repository | §5.2, §6.3, §8 | C4-03, C4-D03 | 005, 007 | Implemented; test planned |
| [FR-10](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-10--wishlist-д-нэвтрэлт-шаардах) | Web route guard and API requireAuth | §5.1, §6.2, §8 | C4-02, C4-03, C4-D02 | 003, 005, 007 | Implemented; test planned |
| [FR-11](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-11--нийтлэгдсэн-бүтээгдэхүүн-хадгалах) | Published-product rule in cart service | §5.2, §6.2 | C4-03, C4-D02 | 005, 007 | Implemented; test planned |
| [FR-12](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-12--wishlist-давхардлыг-хориглох) | Service/repository plus unique DB pair | §5.2, §6.2 | C4-03, C4-D02 | 005, 007 | Implemented; test planned |
| [FR-13](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-13--wishlist-жагсаах) | Customer-scoped cart list and Web grid | §5.1, §6.2 | C4-02, C4-03, C4-D02 | 003, 005, 007 | Implemented; test planned |
| [FR-14](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-14--wishlist-ээс-хасах) | Idempotent remove service/repository | §5.2, §6.2 | C4-03, C4-D02 | 005, 007 | Implemented; test planned |
| [FR-15](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#fr-15--hero-fallback-аас-каталогт-хүрэх) | Web intro config and static fallback | §5.1, §8, §10 | C4-02 | Existing ADR-006 | Partial; test planned |
| [NFR-01](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#nfr-01--хувийн-өгөгдлийг-тусгаарлах) | JWT, RBAC, ownership, RLS defense-in-depth | §3, §5, §6, §8, §10 | C4-01…03, C4-D01…03 | 003, 005, 007 | Partial inspection |
| [NFR-02](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#nfr-02--хөдөлгөөн-багасгах-тохиргоо) | Reduced-motion and static Web path | §5.1, §8, §10 | C4-02 | Existing ADR-006 | Implemented; test planned |
| [NFR-03](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#nfr-03--deploy-оос-өмнөх-тестийн-хаалт) | Local DB integration and negative CI gate | §7, §10, §11 | C4-02 | Existing ADR-010/011 | Gap; planned W9 |
| [NFR-04](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#nfr-04--каталогийн-хуудсын-ачааллын-хугацаа) | SSR/Web, Fastify API and indexed data path | §4, §5, §10 | C4-02, C4-03 | 003, 005, 007 | Defined; not measured |
| [NFR-05](https://github.com/Tengis01/Nogoolin/blob/main/docs/requirements/srs-v1.0.md#nfr-05--inquiry-retry-давхардал-үүсгэхгүй-байх) | Inquiry service idempotency boundary | §5.2, §6.1, §10, §11 | C4-03, C4-D01 | 005, 007 | Planned; not implemented |

\endgroup

## Coverage summary

- Requirement rows: **20 / 20**.
- Functional building-block coverage: **15/15 = 100%**; required ≥80% = 12/15.
- Orphan FR: **0**. NFR-03 ба NFR-05 implementation gap-ийг W5-д үргэлжлүүлнэ.
- Static views: C4-01, C4-02, C4-03.
- Runtime views: C4-D01, C4-D02, C4-D03.
- Main MADRs: ADR-003 (Tech Stack), ADR-005 (Persistence), M4-IF-01 (Interface). ADR-007 нь supporting decision.
- `implemented` нь code path байгааг, `verified` нь ажиллуулсан нотолгоог илэрхийлнэ; энэ хүснэгт шинэ requirement-ийг verified гэж зарлаагүй.


\newpage

# ADR-003 — Fastify-г API framework болгон сонгох

- **Status:** Accepted
- **Date:** 2026-06; M4 expanded 2026-09-28
- **Decision owner:** Тэнгис
- **Related requirements:** FR-01…14, NFR-03, NFR-04
- **Related views:** C4-02, C4-03, C4-D01…D03

## Context

Nogoolin-д web, admin, mobile гурвыг үйлчлэх TypeScript REST API хэрэгтэй. Solo developer учраас framework нь бага boilerplate-тай, schema validation, security hook, plugin encapsulation болон integration test-д тохиромжтой байх шаардлагатай.

## Decision Drivers

Нэг хөгжүүлэгчийн ажиллагаа, шалгаж болох interface, өгөгдөл хамгаалалт болон requirements coverage.

## Considered options

| Сонголт | Давуу тал | Сул тал |
|---|---|---|
| Fastify | TypeScript support, plugin/hook model, хурдан request path | Express-ээс жижиг ecosystem; plugin lifecycle сурах шаардлагатай |
| Express | Өргөн ecosystem, олон жишээ | Validation/security composition-г гараар их зохион байгуулна |
| Next.js route handlers only | Web-тэй нэг deploy | Mobile/admin API хил, repository/service structure бүдгэрнэ |

## Decision

Fastify + TypeScript-ийг port 3001 дээрх `/api/v1/` REST API framework болгоно. Helmet, CORS, rate-limit, auth, validation-ийг plugin/hook-д; HTTP mapping-ийг controller-д; business rule-ийг service-д; data access-ийг repository-д байрлуулна.

## Consequences

- Web, admin, mobile нэг тогтвортой API contract ашиглана.
- Security болон validation route handler бүрт давтагдахгүй.
- Plugin order, encapsulation болон error mapping-ийг test-ээр хамгаалах шаардлагатай.
- Phase 0 дахь Express нэршил хуучирсан; шинэ architecture view Fastify-г ашиглана.


## Persona pain point ба confirmation

[W1 persona](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem1/wiki/02_audience_persona.md)-ийн **P3: local ба pipeline-ийн ялгааг оношлох; P-NG-03** хэрэгцээтэй холбов. Энэ нь RAG кейсээс Nogoolin руу шилжүүлсэн тайлбарласан холбоо; уг алдаа Nogoolin-д болсон гэж үзээгүй. [W2 pivot](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem2/wiki/persona-and-pivot.md) шилжилтийг тайлбарлана.

Confirmation: decision log болон одоогийн code structure-тай static check хийсэн; шинэ runtime test энэ ажлаар ажиллуулаагүй.

\newpage

# ADR-005 — Supabase-г data/auth/storage platform болгон сонгох

- **Status:** Accepted
- **Date:** 2026-07 (Phase 0); M4 expanded 2026-09-28
- **Decision owner:** Тэнгис
- **Related requirements:** FR-01…14, NFR-01, NFR-05
- **Related views:** C4-01, C4-02, C4-03, C4-D01…D03

## Context

Nogoolin-д relational product/inquiry/cart өгөгдөл, user authentication, media storage болон row-level authorization хэрэгтэй. Solo developer тусдаа database, auth server, object storage ажиллуулахад operational ачаалал өндөр.

## Decision Drivers

Нэг хөгжүүлэгчийн ажиллагаа, шалгаж болох interface, өгөгдөл хамгаалалт болон requirements coverage.

## Considered options

| Сонголт | Давуу тал | Сул тал |
|---|---|---|
| Supabase | PostgreSQL, Auth, Storage, RLS нэг platform; local CLI stack | Platform-specific client/API; cloud dependency |
| Firebase | Managed auth/data, mobile ecosystem | Relational query болон SQL/RLS загварт тохиромж бага |
| Self-hosted PostgreSQL + auth/storage | Бүрэн хяналт | Setup, patch, backup, auth, storage ажиллагаа их |

## Decision

Supabase PostgreSQL, Auth, Storage-г ашиглана. Local development ба security test-ийг Supabase CLI stack дээр хийнэ; cloud project Phase 6 хүртэл deferred. API repository interface нь Supabase-specific query-г service-ээс тусгаарлана.

## Consequences

- NFR-01-д JWT, ownership болон RLS-ийг хамтад нь хэрэгжүүлэх боломжтой.
- Migration append-only байх ба local reset дээр дахин ажиллах ёстой.
- `service_role` key зөвхөн server environment-д байна.
- Provider солиход repository implementation болон auth integration өөрчлөгдөнө; business service-ийг аль болох хэвээр үлдээнэ.


## Persona pain point ба confirmation

[W1 persona](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem1/wiki/02_audience_persona.md)-ийн **P1: session алдагдах; P-NG-01, мөн P2: schema/producer contract нийцэл** хэрэгцээтэй холбов. Энэ нь RAG кейсээс Nogoolin руу шилжүүлсэн тайлбарласан холбоо; уг алдаа Nogoolin-д болсон гэж үзээгүй. [W2 pivot](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem2/wiki/persona-and-pivot.md) шилжилтийг тайлбарлана.

Confirmation: decision log болон одоогийн code structure-тай static check хийсэн; шинэ runtime test энэ ажлаар ажиллуулаагүй.

\newpage

# M4-IF-01 — REST interface ба shared validation contract

- **Status:** Accepted — existing implementation documented
- **Date:** 2026-09-28
- **Decision owner:** Тэнгис
- **Category:** Interface; MADR course record
- **Requirements:** FR-01…14, NFR-01, NFR-03
- **Views:** C4-02, C4-03, C4-D01…03

## Context

Web, admin, mobile нэг API ашиглана. Field, HTTP status болон auth boundary зөрвөл client зөв request илгээсэн ч өөр орчинд буруу үр дүн авна. W1-ийн [P2 schema/producer нийцэл, P3 local/pipeline ялгаа](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem1/wiki/02_audience_persona.md)-г шинэ төсөлд contract drift-ийн эрсдэлтэй холбов. W1 vector dimension нь Nogoolin-ийн өгөгдлийн талбар биш.

## Decision Drivers

Client бүрт ойлгомжтой HTTP interface, reusable TypeScript schema, testable auth/status boundary, нэг хөгжүүлэгчид бага tooling хэрэгтэй.

## Considered Options

1. Versioned REST JSON + shared Zod schema.
2. GraphQL schema/server нэмж client query composition хийх.
3. Client бүр тусдаа request/validation model хадгалах.

## Decision

Одоогийн `/api/v1/` REST JSON interface болон shared Zod package-г баримтжуулна. Inquiry POST `201`, invalid input `400`, guest auth scope `401`, non-admin `403`, unknown product `404`, rate limit `429` байна. Wishlist `/cart` нэртэй боловч checkout биш. HTTP API нь runtime interface; Zod package нь library тул C4 Container болгон зурахгүй.

## Consequences

- Web/API contract нэг schema-тай, алдааны төлөв тодорхой болно.
- Schema шинэчлэхэд consumer bundler ба test-ийг хамт шалгана.
- Mobile одоогоор зарим type-only import хэрэглэж байгаа; runtime validation parity-г бүрэн болсон гэж зарлахгүй.
- Legacy OpenAPI-г W5-д одоогийн inquiry/cart contract-тай нийцүүлэх шаардлагатай.

## Confirmation

Одоогийн controllers, shared schemas, web API client-ийг статик байдлаар тулгав. Энэ record шинэ product decision, шинэ endpoint эсвэл runtime test үүсгэхгүй.

\newpage

# UE-4 — Container зураглалын Before/After засвар

## Аргачлал

Bhatti Ch.6-ийн гурван алхмыг хэрэглэв: эхлээд элемент, хилийн ноорог гаргах; уншигч хаанаас эхлэхийг тодруулах; box/arrow бүрийг утгатай label-тай болгох. Handout нь х.112/113/116 гэж заасан боловч локал номын хэвлэмэл хуудас дээр эдгээр гурван дэд гарчиг х.116-д хамт байна. Энд цаасан дээр зурсан эсвэл хүнээр review хийлгэсэн нотолгоо зохиогоогүй; editable Mermaid эхийг ноорог болгон ашиглав.

## Before — зориуд оруулсан anti-pattern

![UE-4 Before — Magic Container](../tmp/diagrams/ue4-before-container.pdf){width=100%}

“Magic Container” нь web, mobile, API-ийн ялгаа, технологи, хариуцлагыг нууж байна. “Does stuff” arrow нь ямар мэдээлэл дамжуулж байгааг хэлэхгүй. Энэ нь зөвхөн UE-4 сургалтын алдаатай зураг; ажиллаж буй system design гэж үзэхгүй.

## After — нэр, технологи, хариуцлага тодорхой болсон

![UE-4 After — Nogoolin Container View](../tmp/diagrams/c4-02-container.pdf){width=100%}

Chinchilla Ch.2 х.22–23-ын architecture reference нь харилцан хамааралтай хэсгүүдийг тайлбарлах зорилготой. After зурагт Web/Admin, Mobile, REST API-г тусдаа deployable unit болгон задалж, Supabase services-ийг хөрш системээр ялгав. Actor, request, authentication болон persistence замын label тодорхой болсон. Shared schema нь library учраас container биш; §5.2 component view-д reference хийнэ.

| Өмнөх зөрүү | Засвар | Үр дүн |
|---|---|---|
| Нэг “Magic” box | Web, Mobile, API болгож салгасан | Deployable хариуцлага харагдана |
| “Various technologies” | Next.js, Expo, Fastify | Stack тодорхой |
| “Does stuff” | JSON API, session, query/media label | Data flow ойлгомжтой |
| Бүх боломж бэлэн мэт | Mobile inquiry/wishlist incomplete | Бодит capability-г ялгасан |


\newpage

# UE4-ADR-01 — Magic Container зураглалыг засах

**Status:** Accepted for exercise · **Date:** 2026-09-28 · **Owner:** Тэнгис

## Context

Before зураг нэг “Magic Container”-д бүх frontend/backend хариуцлагыг багтаасан. Хөгжүүлэгч алдаа гарвал аль deployable unit-ийг шалгахаа мэдэхгүй. Энэ нь W1-ийн [P3 local/pipeline ялгааг оношлох](https://github.com/Tengis01/Nogoolin/blob/main/docs/ICSI438/sem1/wiki/02_audience_persona.md) хэрэгцээтэй холбоотой.

## Decision Drivers

Зураг унших эхлэл, deployable boundary, name/technology/responsibility болон data flow-г тодорхой болгох. Bhatti Ch.6 х.116-ын label зарчим, Chinchilla Ch.2 х.22–23-ын architecture reference зорилгыг хэрэглэв.

## Considered Options

1. Magic box-д урт тайлбар нэмэх.
2. Web/Admin, Mobile, REST API-ийг тусдаа container болгон задалж хөрш platform services-ийг ялгах.

## Decision

Хоёрдугаар сонголтыг сонгов. After зураг нь гурван Nogoolin application container-тай; Supabase platform нь Auth, PostgreSQL, Storage хөрш services-ээр харагдана. Shared Zod schema-г library гэж тайлбарлаж, deployable container болгож дүрслэхгүй. Actor болон arrow бүр утгатай label-тай байна.

## Consequences

Уншигч Web → API → Data урсгал болон session замыг ялгана. Mobile-ийн дутуу capability-г ил тод харуулна. Зураг засах нь product кодын refactoring эсвэл runtime validation биш; deployment boundary-г өөрчлөөгүй.

## Confirmation

Before/After Mermaid эх, SVG болон §5 building block хүснэгтийг тулгав. Nogoolin applications **3 ≤ 8**. FR mapping **15/15** бөгөөд NFR-03/05 gap-ийг W5-д үлдээв.

\newpage

# Seminar 4 reflection

## 1. Bhatti-ийн ямар ойлголт миний дадлыг өөрчилсөн бэ?

Bhatti Ch.6 х.116-ын “Use labels” зарчим хамгийн их нөлөөлөв. Би өмнө нь нэртэй хайрцаг ба сум байхад архитектур ойлгомжтой гэж үздэг байсан. UE-4-ийн Magic Container дээр нэр, технологи, хариуцлага болон сумны data flow байхгүй үед зураг мэдээлэл өгдөггүйг харлаа. After хувилбарт “Uses”, “Does stuff”-ийг JSON request, session, persistence гэсэн бодит харилцаагаар сольж, уншигчийн эхлэх actor-ийг тодорхой болгов. Номын х.117 SVG зөвлөмжийн дагуу зургаа scalable vector хэлбэрээр хадгалав.

## 2. Chinchilla-ийн ямар ойлголтыг W16-аас хойш ашиглах вэ?

Chinchilla Ch.4 х.47–51-ын navigation ба hierarchy зарчмыг үргэлжлүүлнэ. Architecture-ийг нэг урт тайлбарт нуухын оронд arc42 §3-аас §5 руу, requirement-ээс building block, ADR руу холбоосоор шилжих боломжтой болгов. Ch.2 х.22–23-ын дагуу architecture reference нь хэсгүүдийн харилцаа, сонгосон шийдлийн үндэслэлийг тайлбарлах ёстой; эхлэх tutorial-ийг орлохгүй. Дараагийн төсөлд мөн diagram, decision, requirement холбоосыг хамт хадгална.

## 3. Ном ба бодит ажиллагааны хамгийн том зөрүү хаана байна вэ?

Ном зураглалаа уншигчаар шалгах, label-ийг ойлгодог эсэхийг туршихыг зөвлөдөг. Одоогоор би зураг, код, requirement-ээ өөрөө тулгасан; гаднын reviewer-ийн санал байхгүй. Мөн 100% FR mapping нь код ажиллаж, тест өнгөрсөн гэсэн баталгаа биш. NFR-03 CI gate, NFR-05 idempotency gap хэвээр. Иймээс M4-д coverage ба runtime evidence-ийг ялгаж, W5-д interface drift болон эдгээр gap-ийг үргэлжлүүлэхээр тэмдэглэв.

## Standup ба retrospective — өөрийн тэмдэглэл

Өнөөдөр §1/3/5-ыг зааварт нийцүүлж, зургаа Mermaid эхтэй болголоо. Үндсэн гурван ADR-ийн scope тодорхой; нэмэлт тодруулга нь W1-ийн ганц persona-ийг гурван бизнес role-той холбосон mapping-ийг багш хэрхэн үнэлэх тухай байна. Хамгийн их тус болсон хэсэг нь §5: хариуцлага ба FR mapping нэг дор харагдана. Дараагийн sprint-д ADR-ийн confirmation болон interface drift шалгалтыг илүү тодорхой болгоно. Энэ нь багийн хурал болсон тухай протокол биш.
