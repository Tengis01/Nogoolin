# Кодын аудит: SRS v2 харьцуулалт, чанар, архитектур

**Doc ID:** QA-05 · **Хувилбар:** v1.0 draft · **Огноо:** 2026-10-27 · **Төлөв:** draft, owner review хийгдээгүй · **Хамрах хүрээ:** `main` (`17bf71b`) дээрх `backend/api`, `apps/web`, `apps/mobile`, `packages/*`, `supabase/`, `.github/workflows`

## 0. Хураангуй

- **Кодын хэмжээ.** Энэ код 2026-07-14…07-26-нд AI агентуудтай бичигдсэн бөгөөд TS/TSX/SQL нийт ~11.5k мөр. Ажил `chore/phase3-closeout` branch дээр хийгдсэн. Тэр branch-д 32 commit бий, 30 нь `Co-Authored-By: Claude Fable 5`. 2026-09-15-нд `4528492 "ICSI405 merge"` нэртэй нэг squash commit болж main руу орсон.
- **Архитектур.** Сонгосон загвар (layered monolith, Controller → Service → Repository, хуваалцсан Zod) нь энэ төслийн хэмжээнд зөв. Backend-ийн бүтэц цэвэр байна. Гол сул тал нь **web зарим өгөгдлийг API-г тойрч Supabase-аас шууд уншиж, бичдэг**. Ингэснээр хоёр өөр эрхийн загвар үүсэж, доорх C1 эмзэг байдлын үндсэн шалтгаан болсон.
- **SRS v2-той харьцуулалт.** 219 Must шаардлагын 140 нь (64%) «implemented». Гэхдээ энэ нь зөвхөн «код байгаа» гэсэн утгатай, тест ажиллаагүй. Доорх §4.3-т SRS-ийн 6 төлөвийг кодоос харж засах санал өгсөн.
- **Хамгийн яаралтай.** C1: customer өөрийгөө admin болгож чадна (§3).
- **Тест.** CI ногоон гардаг ч integration тест бүгд skip болдог. Web, mobile, schemas дээр тест огт алга.

## 1. Аргачлал ба хязгаарлалт

| Хийсэн | Хийгээгүй (шалтгаан) |
|---|---|
| Backend-ийн бүх эх файлыг уншсан: controllers, services, repositories, hooks, plugins, lib | `pnpm type-check/lint/build`: `node_modules` суулгаагүй. AGENTS.md-ийн дагуу implicit install хийгээгүй |
| Бүх migration болон RLS policy, `supabase/config.toml` | Integration тест: Docker/Supabase ажиллаагүй байсан |
| Web: API client, middleware, admin layout, detail page, home, admin component-уудын хэмжүүр | Browser-оор шалгаагүй. Runtime дээр эмзэг байдлыг туршаагүй |
| Mobile: API давхарга, dependency | Mobile build |
| SRS v2-ийн 308 «Priority · Phase · Status» мөрийг задалж, кодтой тулгасан | Lighthouse, a11y хэмжилт |

Олдвор бүрийг статик уншлагаар тогтоосон. «Баталгаажсан» гэж бичээгүй л бол runtime-д туршаагүй гэсэн үг.

## 2. Архитектур

### 2.1 Одоогийн бүтэц

```
apps/web (Next.js 15, SSR) ──REST /api/v1──▶ backend/api (Fastify)
     │                                       Controller → Service → Repository
     │                                                         │
     └──supabase-js шууд (auth + public.users)──▶ Supabase ◀──┘ (anon + service_role)
                                                  Postgres + RLS, Auth, Storage
apps/mobile (Expo) ──REST (зөвхөн нийтийн каталог)──▶ backend/api
packages/validation-schemas (Zod) ── web, mobile (type-only), api хуваалцана
packages/shared-types ── хоосон (.gitkeep)
```

### 2.2 Сайн талууд

- **Давхаргын хуваарилалт цэвэр.** Controller-ууд 11–97 мөр, нимгэн. Бизнесийн дүрэм service-д, query repository-д байрладаг. Raw SQL байхгүй.
- **Dependency Inversion.** Service-үүд `repositories/types.ts` интерфэйсээс хамаардаг, Supabase-ийн төрлөөс хамаардаггүй. `app.ts` нь composition root болж factory function-оор DI хийдэг, тиймээс тестэд double солиход хялбар.
- **Admin scope encapsulation.** `/admin` дор `requireAuth` болон `requireAdmin` hook-ууд scope түвшинд нэг удаа бүртгэгддэг тул шинэ route нэмэхэд мартах эрсдэлгүй.
- **Хуваалцсан Zod schema.** Ижил дүрэм API body validation болон web form-д хоёуланд нь ажилладаг.
- **Fail-fast env.** `config/env.ts` нь буруу тохиргоонд утгыг нь хэвлэхгүйгээр зогсдог.
- **Олон бичгийн хайлт.** `lib/translit.ts` цэвэр функц, generated `search_vector` болон GIN index-тэй.
- **Нэг загварын алдааны envelope** (`{error, code}`), RLS бүх хүснэгтэд асаалттай.

### 2.3 Сул талууд

| # | Асуудал | Нөлөө |
|---|---|---|
| A1 | **Өгөгдөлд хандах хоёр зам.** Web `public.users`-ийг шууд уншиж, бичдэг (`profile-form.tsx:53`, `admin/layout.tsx:24`, `products/[slug]/inquiry/page.tsx:50`, `profile/page.tsx:28`). Бусад бүх зүйл API-аар явдаг | Эрхийн дүрэм API-ийн service болон RLS гэсэн хоёр газарт байна. RLS-д нэг алдаа гарвал API-ийн хамгаалалтыг бүрэн тойрно (C1). Schema өөрчлөхөд web UI шууд эвдэрнэ (coupling) |
| A2 | **Cross-cutting audit log гараар бичигддэг.** 10 газарт `auditLogs.log(...)` давтагдсан, мөн гол бичилттэй нэг transaction-д ордоггүй | Шинэ mutation нэмэхэд audit-аа мартах эрсдэлтэй. Audit бичилт амжилтгүй болбол client 500 авна, гэхдээ өөрчлөлт аль хэдийн commit болсон байна (H3) |
| A3 | **`shared-types` хоосон.** API contract (envelope, `PaginationMeta`, API client) хаана ч хуваалцагдаагүй | `API_URL` 3 удаа, `PaginationMeta` 3 удаа, fetcher-ууд web болон mobile-д давхар бичигдсэн, `formatPrice` 2 удаа |
| A4 | **Validation нэг загвартай биш.** Body-г `validateBody` preHandler, query-г controller дотор inline `safeParse`-аар шалгадаг. Path param огт шалгагддаггүй | 400-ийн хариунд details заримдаа ирж, заримдаа ирэхгүй. UUID биш param 500 буцаана (H1). OpenAPI-г кодоос автоматаар үүсгэх боломжгүй |
| A5 | **Web-ийн admin component-ууд «god component».** `product-form.tsx` 509 мөр, 15 `useState`. `inquiry-table` 13, `product-table` 12, `category-table` 11 `useState`-тэй | Fetch, loading/error, form state, харагдац бүгд нэг файлд. Дахин ашиглах, тестлэх боломжгүй |
| A6 | **Auth hook хүсэлт бүрт 2 сүлжээний дуудлага хийдэг** (GoTrue `getUser` + `users` lookup). Middleware нийтийн хуудас бүр дээр `getUser()` дууддаг | Хүсэлт бүрт латенси нэмэгдэнэ (NFR-PERF-510). Каталогийн хуудас ч session refresh хүлээдэг |

### 2.4 Clean code ба зарчмуудын үнэлгээ

| Зарчим | Backend | Web | Тайлбар |
|---|---|---|---|
| High cohesion | ✅ Сайн | ⚠️ Дунд | Backend feature тус бүр нэг модульд. Web-ийн admin component-ууд олон үүрэгтэй (A5) |
| Low coupling | ✅ Сайн | ❌ Сул | Backend интерфэйсээр холбогддог. Web DB schema-д шууд холбогдсон (A1) |
| SRP | ✅ | ⚠️ | `media.controller.ts` multipart parsing хийдэг. Үүнийг тусдаа helper болговол цэвэр болно |
| DRY | ⚠️ | ⚠️ | `Paginated`/`paginate` нь 2 service-д, `optionalAuth` нь `requireAuth`-ийн хуулбар, audit 10 газарт, API helper-ууд 3 газарт давтагдсан |
| Open/Closed, өргөтгөхөд хялбар | ✅ | ⚠️ | Шинэ resource нэмэхэд repo/service/controller гурвыг нэмж, `app.ts`-д wiring хийхэд хангалттай. Web-д data layer (React Query гэх мэт) байхгүй тул шинэ хуудас бүр state-ээ гараар бичдэг |
| Type safety | ⚠️ | ⚠️ | Repository бүр `as Product` гэж cast хийдэг, runtime parse байхгүй. Schema өөрчлөгдөхөд төрөл худлаа хэлнэ |
| Нэршил | ✅ | ✅ | Ойлгомжтой, нэг загвартай |
| Comment | ⚠️ | ✅ | Sem6-д нэмсэн JSDoc boilerplate хэт их (жишээ нь `@throws Factory өөрөө алдаа шидэхгүй`). Comment-ууд Phase 0-ийн ID-г иш татдаг (FR-INQ-007, NFR-MAIN-001), SRS v2-ийн ID-г биш |
| Design token | — | ⚠️ | `text-[11px]`, `text-[12.5px]`, `text-[15.5px]` зэрэг 10+ дурын хэмжээ байна, type scale байхгүй (NFR-MAINT-410) |

## 3. Олдворууд (ноцтойн дарааллаар)

### Critical

**C1. Customer өөрийгөө admin болгож чадна** (NFR-SEC-350, FR-AUTH-310)
- **Хаана:** `supabase/migrations/20260716154420_rls_policies.sql:66-70` (`users_update_own`). Баганыг хязгаарладаггүй, `20260719104500_table_grants.sql` нь 0 байт.
- **Сценари:** Нэвтэрсэн хэрэглэгч browser console-оос нийтийн anon key-тэй client-ээр `supabase.from('users').update({ role: 'admin' }).eq('id', myId)` ажиллуулна. Policy-ийн `using`/`with check` нь зөвхөн `id = auth.uid()`-г шалгадаг тул update амжилттай болно. Үүний дараа API-ийн `requireAdmin` (`hooks/auth.ts:48`) role-ийг энэ хүснэгтээс уншдаг тул бүх admin endpoint нээгдэнэ. Хэрэглэгч `email` баганаа ч өөрчилж чадна.
- **Засвар:** Шинэ migration нэмнэ: `revoke update on public.users from authenticated; grant update (full_name) on public.users to authenticated;`. Эсвэл `BEFORE UPDATE` trigger тавьж, `is_admin()` биш үед `role`/`email` өөрчлөхийг хориглоно. Засварын хамт SRS-ийн Verification-д заасан тестийг нэмнэ.
- **Тэмдэглэл:** SRS v2 энэ эрсдэлийг «unknown» гэж тэмдэглэсэн. Supabase-ийн default grant-ийн дагуу кодоос харахад эмзэг байдал бий. Local stack дээр нэг SQL-ээр баталгаажуулах шаардлагатай.

### High

**H1. UUID биш path param 500 буцаана** (NFR-REL-210, NFR-SEC-210)
- `:id`, `:imageId`, `:productId` гэсэн бүх route param шалгалтгүйгээр `.eq('id', …)` руу шууд дамждаг. `DELETE /api/v1/cart/abc` илгээхэд Postgres `22P02` алдаа өгч, repository `throw new Error`-оор дамжуулж, эцэст нь `500 INTERNAL` болно. Энэ хариу 400 эсвэл 404 байх ёстой.
- **Засвар:** Нэг `validateParams(z.object({ id: z.string().uuid() }))` hook нэмэх. Илүү сайн шийдэл нь `fastify-type-provider-zod`-оор body, query, params гуравыг нэг загвараар шалгах (A4). Ингэснээр OpenAPI-г кодоос үүсгэх боломж нээгдэнэ (roadmap-ийн API-02).

**H2. Repository-ийн алдаа бүгд 500 болж хувирдаг**
- `uniqueSlug` нь шалгаад дараа нь insert хийдэг (`lib/slug.ts:18`). Хоёр зэрэг хүсэлт ирэхэд UNIQUE `23505` алдаа гарч 500 буцна. Байхгүй `category_id`-тай бүтээгдэхүүн үүсгэхэд FK `23503` алдаа гарч мөн 500 буцна, 400/404 байх ёстой.
- **Засвар:** Repository-д нэг `mapDbError(error)` helper нэмж `23505→409`, `23503→400`, `22P02→400` гэж хөрвүүлэх. Slug-ийн хувьд insert дээр `23505` гарвал дараагийн дугаараар дахин оролдох.

**H3. Олон алхамт бичилт атомик биш** (FR-AUD-110, FR-PROD-260, FR-MEDIA-110/150)
- Гол бичилт хийгдсэний дараа audit бичигддэг. Audit амжилтгүй бол client 500 авдаг ч өөрчлөлт хадгалагдсан, audit бичлэг байхгүй үлдэнэ.
- `uploadImages`: Storage-д файл байршсаны дараа DB insert амжилтгүй болбол Storage дээр өнчин файл үлдэнэ.
- `deleteImage`: Storage-оос файл устсаны дараа DB delete амжилтгүй болбол DB-д файлгүй бичлэг үлдэнэ.
- `hardDelete` бүтээгдэхүүнийг устгахад `product_images` мөрүүд cascade-аар устдаг ч **Storage-ийн файлууд үлддэг**.
- **Засвар:** Mutation болон audit-ийг Postgres function (RPC) дотор нэг transaction-д хийх, эсвэл audit-ийг DB trigger-ээр бичих. Storage-ийн хувьд compensating delete хийх, мөн hard delete-ийн өмнө файлуудыг устгах.

**H4. CI худал ногоон гардаг** (NFR-MAINT-320, NFR-MAINT-330)
- `api-deploy.yml:36` `pnpm --filter @nogoolin/api test` ажиллуулдаг ч CI-д Supabase байхгүй. `tests/helpers.ts` reachability шалгаад 36 тестийг бүгдийг нь skip хийдэг. Web, mobile, validation-schemas-ийн `test` script нь `echo "no tests yet"`. Энэ repo-д unit тест огт алга.
- **Засвар:** CI-д `supabase/setup-cli` болон `supabase start` нэмэх, `CI=true` үед skip-ийг алдаа гэж тооцох. Service-үүдэд repository double ашигласан unit тест нэмэх (DI бэлэн байгаа).

### Medium

| # | Олдвор | Байршил | Засвар |
|---|---|---|---|
| M1 | Inquiry-ийн `customer_name`, `message` дээд урттай биш. Spam-аар хязгааргүй том мөр хадгалж болно | `packages/validation-schemas/src/inquiry.schema.ts:31-33` | `.max(100)`, `.max(2000)` нэмэх, утгыг SRS FR-INQ-120-д тохиролцох |
| M2 | JSON-LD-д `</script>` escape хийгддэггүй. Admin бүтээгдэхүүний нэрээр stored XSS хийх боломжтой | `apps/web/src/app/products/[slug]/page.tsx:85` | `JSON.stringify(x).replace(/</g, '\\u003c')` |
| M3 | Bearer token-ыг `replace('Bearer ', '')`-оор задалдаг, `optionalAuth` нь `requireAuth`-ийн хуулбар | `backend/api/src/hooks/auth.ts:32,56` | `extractBearer()` болон `resolveUser()` helper гаргах, JWT-г local-аар (JWKS) шалгах |
| M4 | CORS татгалзсан хариу 500 болдог (`cb(new Error)`, statusCode байхгүй) | `backend/api/src/plugins/cors.ts:15` | `ApiError(403, 'CORS_FORBIDDEN')` ашиглах |
| M5 | Middleware бүх route дээр ажилладаг | `apps/web/src/middleware.ts:41` | Matcher-ийг `/admin`, `/profile`, `/wishlist`, auth route-уудаар хязгаарлах |
| M6 | `Cache-Control` header байхгүй | `backend/api/src` | Нийтийн GET-үүдэд `public, max-age=60, stale-while-revalidate` нэмэх (NFR-PERF-520) |
| M7 | Existence check хийхэд `findById` 3 join-тэй бүтэн бүтээгдэхүүн татдаг (cart, inquiry, media) | `product.repository.ts:119` | `exists(id)` эсвэл `findStatus(id)` method нэмэх |
| M8 | Inquiry-д нийтлэгдээгүй (draft/archived) бүтээгдэхүүний ID-аар асуулга илгээж болно | `inquiry.service.ts:66-68` | `status === 'published'` нөхцөл шалгах (cart аль хэдийн шалгадаг) |
| M9 | Dead code: `RATE_LIMIT_AUTH_MAX` хэрэглэгддэггүй, `schemas/index.ts`-ийг хэн ч import хийдэггүй | `config/env.ts:20`, `schemas/index.ts` | Устгах, эсвэл NFR-SEC-252-ийн дагуу ашиглах |
| M10 | Admin component-ууд fetch, state, view-ийг нэг дор хольсон (A5) | `components/admin/*.tsx` | `useAdminProducts()` зэрэг hook гаргах, `react-hook-form` болон `zodResolver` ашиглах |

### Low

- **L1.** UI-д хоцорсон текст үлдсэн: admin dashboard дээр «Phase 1 scaffold … Phase 2-т нэмэгдэнэ», nav дээр «Тохиргоо (Phase 5)».
- **L2.** DB-д `CHECK` constraint байхгүй (`price >= 0`, `order_items.quantity > 0`). Зөвхөн Zod-оор хамгаалагдсан.
- **L3.** `20260719104500_table_grants.sql` 0 байт. Нэр нь хамгаалалт байгаа мэт төөрөгдүүлдэг (C1-тэй холбоотой).
- **L4.** Inquiry-ийн төлөвийн шилжилтийг хянадаггүй (`closed → new` болж болно). SRS FR-INQ-330 үүнийг шаарддаг эсэхийг тодруулах.
- **L5.** `AGENTS.md:1` мөрөнд санамсаргүй «claud» гэсэн текст орсон.
- **L6.** Comment-уудад Phase 0-ийн ID-ууд байна. SRS v2-ийн ID руу шилжүүлэх эсвэл `id-mapping.md`-ээр дамжуулж уншихаар тохиролцох.

## 4. SRS v2-той харьцуулалт

### 4.1 Тоон дүн (SRS v2-ийн өөрийн «Status» мөрөөс)

| Priority | implemented | partial | planned | unknown | Нийт |
|---|---|---|---|---|---|
| Must | 140 | 43 | 19 | 17 | 219 |
| Should | 14 | 5 | 19 | 4 | 42 |
| Could | 1 | 1 | 7 | 1 | 10 |

Release-ээс гадуурх (Won't/deferred) шаардлага ~37 байгаа. Үүнд захиалга, хүргэлт, mobile intro, 360° viewer, зургаар хайх орно.

### 4.2 Дутуу байгаа Must/Should шаардлагууд (хэсгээр)

| Хэсэг | Дутуу | ID |
|---|---|---|
| **Admin** | Бүтээгдэхүүн засах хуудас болон `GET /admin/products/:id` (Засах товч stub). Хянах самбарын тоо. Зураг устгах баталгаажуулалт, impact-ийн текст | FR-ADM-330, FR-ADM-300, FR-ADM-200, FR-ADM-700…720 |
| **Нүүр хуудас** | Онцлох бүтээгдэхүүн, ангиллын мөр. Одоогоор зөвхөн «Бүтээгдэхүүн үзэх» товч байна | FR-PUB-300, 310, 320 |
| **Алдааны хуудас** | `app/not-found.tsx`, `app/error.tsx` байхгүй, каталогийн алдааны төлөв байхгүй | NFR-REL-220, FR-PUB-150 |
| **Интро** | Код v4-ийн автомат arc хэвээр. SRS prototype C-ийн 4 click-алхам, гарын удирдлага, focus, GLB алдаанаас сэргэхийг шаарддаг. Бодит GLB байхгүй (D-04) | FR-INTRO-100, 140, 150, 160, 220, 240, 330; NFR-PERF-310 |
| **Тохиргоо, audit** | Admin settings endpoint байхгүй (`setDeliveryEnabled` repo-д бий ч ашиглагддаггүй). Audit log харах API/UI байхгүй | FR-SET-130, 200, FR-AUD-150, FR-AUD-140 |
| **Аюулгүй байдал** | C1, M2, rate limit | NFR-SEC-350, 240, 252 |
| **Гүйцэтгэл** | Бүх NFR-PERF хэмжигдээгүй. Фонт тохиргоо байхгүй. Cache-Control байхгүй | NFR-PERF-1xx…5xx |
| **Хүртээмж** | `focus-visible` 0 газар, автомат хэмжилт байхгүй | NFR-USE-140, 160 |
| **Засвар үйлчилгээ** | Web тест 0, token-ийн шатлал, `@layer`, component contract | NFR-MAINT-330, 410, 420, 440 |
| **Mobile** | Зөвхөн auth, жагсаалт, дэлгэрэнгүй байна. Inquiry, wishlist, intro байхгүй (ихэнх нь энэ release-д Won't) | FR-MOB-* |

### 4.3 SRS-ийн төлөвийг засах санал (кодоос харсан)

| ID | SRS-д | Кодын бодит байдал | Санал |
|---|---|---|---|
| NFR-SEC-350 | unknown | Policy болон хоосон grant-аас харахад эмзэг (C1) | **violated** (runtime-д батлах) |
| NFR-REL-210 | implemented | Envelope зөв, гэхдээ буруу UUID, CORS, constraint алдаа бүгд 500 (H1, H2, M4) | partial |
| NFR-SEC-210 | implemented | Path param шалгадаггүй, inquiry-ийн урт хязгааргүй (H1, M1) | partial |
| FR-AUD-110 | implemented | Атомик биш (H3) | partial |
| FR-PROD-260 | implemented | Storage-ийн файлууд үлддэг (H3) | partial |
| NFR-SEC-252 | unknown | API-ийн `RATE_LIMIT_AUTH_MAX` ашиглагддаггүй. Нэвтрэлт Supabase руу шууд явдаг тул хязгаар нь `config.toml`-ийн `[auth.rate_limit]`-д байна | partial, эх үүсвэрийг тодруулах |

## 5. Зөвлөмж: дараалсан ажлын төлөвлөгөө

**P0. Шинэ feature нэмэхээс өмнө (1–2 өдөр)**
1. C1: шинэ migration (column grant эсвэл trigger) болон тест. Эхлээд local stack дээр эмзэг байдлыг баталгаажуулна.
2. H1 болон H2: params validation, DB алдааг ApiError руу хөрвүүлэх.
3. H4: CI-д Supabase асааж, skip-ийг алдаа гэж тооцох.

**P1. PH2-ийн архитектурын baseline-д оруулах**
4. A1: `GET/PATCH /me` endpoint нэмж, web-ийн `from('users')` 4 дуудлагыг API руу шилжүүлэх. Supabase-ийг web-д зөвхөн auth-д ашиглана.
5. A4: `fastify-type-provider-zod`-оор validation-ийг нэгтгэж, OpenAPI-г кодоос үүсгэх (API-02).
6. A3: `packages/shared-types`-ийг API contract болон web, mobile хоёрт хуваалцах API client болгох.
7. A2 болон H3: audit-ийг transaction эсвэл trigger-ээр бичих, Storage-д compensation хийх.
8. A6: auth hook-д JWT-г local-аар шалгах, middleware-ийн matcher-ийг нарийсгах.

**P2. PH3/PH5 feature ажил**
9. Admin засах хуудас, баталгаажуулах dialog, нүүрний хэсгүүд, алдааны хуудсууд.
10. Admin component-уудыг hook болон form library ашиглан задлах (A5).
11. Prototype C-ийн 4 алхамт интро, бодит GLB (D-04), design token-ийн шатлал.

**P3. Чанар**
12. Perf baseline, a11y хэмжилт, comment-уудын ID-г v2 руу шилжүүлэх.

## 6. Дахин шалгах команд

```bash
pnpm install --frozen-lockfile
pnpm run type-check && pnpm run lint
supabase start && pnpm --filter @nogoolin/api test   # skip-гүй ажилласан эсэхийг тоолох
# C1-ийг баталгаажуулах: customer session-ээр
#   supabase.from('users').update({ role: 'admin' }).eq('id', uid)
```
