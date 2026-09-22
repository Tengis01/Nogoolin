# Nogoolin Software Requirements Specification

**ICSI438 · Seminar 3 / M3 · Тэнгис · v1.0 draft · 2026-09-22**

## Баримтын төлөв

Энэ хувилбар нь M3-д зориулсан бүрэн агуулгатай draft. Нийт 15 функциональ, 5 функциональ бус шаардлагатай. Peer review болон trial test execution хийгдээгүй; доорх test procedure-ууд нь төлөвлөсөн шалгалт бөгөөд pass болсон нотолгоо биш. Эх кодын хэрэгжилтийн төлөвийг шаардлагын статусад тусад нь тэмдэглэв.

| Талбар | Утга |
|---|---|
| Төсөл | Nogoolin |
| Зохиогч, owner | Тэнгис |
| Хувилбар | v1.0 draft |
| Үндсэн уншигч | Хөгжүүлэгч Тэнгис |
| Хоёрдогч уншигч | ICSI438 хичээлийн багш |
| Public repository | <https://github.com/Tengis01/Nogoolin> |
| Review | Хийгдээгүй; бодит peer comment байхгүй |
| Trial test | Хийгдээгүй; procedure ба pass/fail босго төлөвлөсөн |

## 1. Оршил

### 1.1 Зорилго

Энэ SRS нь Nogoolin-ийн каталогийн inquiry, wishlist болон нүүрний hero fallback урсгалын ажиглагдах зан төлөвийг хэрэгжүүлэлт, шалгалтын гэрээ болгон тодорхойлно. Шаардлага бүр хамгийн чухал үр дүнгээр эхэлж, ID, эх, priority, owner, verification болон pass/fail босготой байна.

### 1.2 Хамрах хүрээ

Хүрээг [SRS Scope Charter](scope-charter.md)-аар тогтоов. Энэ хувилбарт:

- зочин болон нэвтэрсэн хэрэглэгчийн бүтээгдэхүүний inquiry;
- өөрийн inquiry history;
- админы inquiry inbox, filter, status;
- нэвтэрсэн хэрэглэгчийн wishlist;
- asset болон хөдөлгөөний тохиргооноос үл хамааран каталогт хүрэх hero fallback;
- өгөгдлийн тусгаарлалт, гүйцэтгэл, accessibility, retry reliability, deploy gate орно.

Захиалга, төлбөр, хүргэлт, production cloud, mobile inquiry/wishlist, бүтээгдэхүүн бүрийн 360° viewer энэ SRS-ийн хүрээнээс гадуур.

### 1.3 Нэр томьёо

| Нэр | Тайлбар |
|---|---|
| Inquiry | Бүтээгдэхүүний тухай нэр, утас, зурвасаар илгээсэн хүсэлт |
| Wishlist | Нэвтэрсэн хэрэглэгчийн дараа үзэхээр хадгалсан бүтээгдэхүүний жагсаалт; checkout биш |
| Guest | Нэвтрээгүй каталогийн хэрэглэгч |
| Customer | Нэвтэрсэн хэрэглэгч |
| Admin | Inquiry-г харах, төлөв солих эрхтэй хэрэглэгч |
| FR / NFR | Функциональ / функциональ бус шаардлага |
| Priority | `must`, `should`, `could` гэсэн M3-ийн MoSCoW тэмдэглэгээ |
| Planned test | Procedure бичигдсэн боловч энэ ажлаар ажиллуулаагүй шалгалт |

### 1.4 Эх сурвалж

- [Phase 0 requirements](../phase-0/02-requirements.md), [security](../phase-0/08-security.md), [wireframes](../phase-0/07-uiux-wireframes.md), [roadmap](../phase-0/10-roadmap.md)
- Одоогийн inquiry, wishlist, hero, auth болон admin эх код
- ICSI438 Lecture 03, Week 03 handout
- Bhatti et al., *Docs for Developers*, бүлэг 3, х. 58–59
- Chinchilla, *Technical Writing for Software Developers*, бүлэг 5 ба 9
- [Akamai retail performance report](https://www.ir.akamai.com/news-releases/news-release-details/akamai-online-retail-performance-report-milliseconds-are)
- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)

### 1.5 Баримтын бүтэц

§2 нь бүтээгдэхүүний орчин, хэрэглэгч, хязгаарлалтыг; §3 нь интерфэйсийг; §4 нь 15 FR-ийг; §5 нь 5 NFR-ийг тодорхойлно. Чанарын checklist болон 20 мөртэй traceability нь төгсгөлийн хавсралтад байна.

## 2. Ерөнхий тодорхойлолт

### 2.1 Бүтээгдэхүүний орчин

Nogoolin нь Next.js web, Fastify REST API, Supabase PostgreSQL/Auth/Storage бүхий шашин, зан үйлийн бүтээгдэхүүний каталог. Web болон mobile нь нэг `/api/v1/` REST API хэрэглэнэ. Энэ SRS-ийн урсгал web интерфэйс болон API дээр төвлөрнө.

### 2.2 Гол үйлдлүүд

Хэрэглэгч бүтээгдэхүүнээс inquiry илгээж баталгааны дугаар авна. Нэвтэрсэн хэрэглэгч өөрийн inquiry history болон wishlist-ийг харна. Админ inquiry жагсаалтыг шүүж, төлөвийг шинэчилнэ. Hero ажиллах боломжгүй нөхцөлд статик хувилбар каталогийн холбоосыг хадгална.

### 2.3 Хэрэглэгчийн онцлог

- **Guest:** бүртгэлгүйгээр каталог үзэж inquiry илгээнэ.
- **Customer:** өөрийн inquiry history болон wishlist-д хандана.
- **Admin:** хүсэлтүүдийг эрэмбэлж, шүүж, төлөв шинэчилнэ.
- **Developer:** local орчинд API, web, auth болон өгөгдлийн урсгалыг шалгана.

Persona-ийн эх нь [Week 2 нэмэлт](../ICSI438/sem2/wiki/persona-and-pivot.md). Шинэ stakeholder interview хийгдээгүй.

### 2.4 Хязгаарлалт

- Ганцаар хөгжүүлж байгаа тул M3 нь Scope Charter-ийн урсгалаар хязгаарлагдана.
- Монгол интерфэйсийн үндсэн алдааны мессежийг хадгална.
- `delivery_enabled=false`; wishlist нь захиалга, үнэ бодох, checkout хийхгүй.
- Cloud болон бодит 3D asset бэлэн гэж таамаглахгүй.
- Нууц түлхүүр client bundle болон repository-д орохгүй.

### 2.5 Таамаг ба хамаарал

Шалгалтын үед Node 20+, pnpm, Docker, local Supabase болон seed бүтээгдэхүүн бэлэн байна гэж үзнэ. Хэрэв local DB байхгүй бол integration test-ийн үр дүнг pass гэж тооцохгүй. Authenticated тестэд customer болон admin test account шаардана.

## 3. Гадаад интерфэйс

### 3.1 Хэрэглэгчийн интерфэйс

Inquiry form нь нэр, 8 оронтой утас, зурвас, илгээх болон буцах үйлдэлтэй. Success төлөв нь inquiry дугаар, холбоо барих утас, каталог руу буцах холбоос харуулна. Wishlist нь хадгалсан бүтээгдэхүүний карт эсвэл empty state харуулна. Admin inbox нь status/product/date filter болон status update үйлдэлтэй.

### 3.2 Программын интерфэйс

| Интерфэйс | Гол үр дүн |
|---|---|
| `POST /api/v1/inquiries` | `201 {data}` эсвэл validation/not-found/rate-limit алдаа |
| `GET /api/v1/inquiries/mine` | Нэвтэрсэн хэрэглэгчийн өөрийн inquiry жагсаалт |
| `GET /api/v1/admin/inquiries` | Шүүсэн, хуудасласан inquiry жагсаалт |
| `PATCH /api/v1/admin/inquiries/{id}/status` | Шинэ төлөвтэй inquiry |
| `GET /api/v1/cart` | Хэрэглэгчийн wishlist |
| `POST /api/v1/cart` | Нийтлэгдсэн бүтээгдэхүүнийг хадгалж `201` |
| `DELETE /api/v1/cart/{productId}` | Хадгалсан бүтээгдэхүүнийг хасаад `204` |

### 3.3 Харилцаа ба өгөгдлийн формат

REST хүсэлт, хариу JSON форматтай. Огноо ISO 8601 UTC байна. Production орчинд HTTPS хэрэглэнэ. Нэвтэрсэн урсгал Bearer access token ашиглаж, хэрэглэгчийн ID-г body/query-гээс биш баталгаажсан token-оос авна.

### 3.4 Төхөөрөмжийн интерфэйс

Тусгай төхөөрөмж, сенсор, hardware port хэрэглэхгүй. Web интерфэйс mouse, touch болон keyboard оролтыг дэмжинэ.

## 4. Функциональ шаардлага

### FR-01 — Зочны inquiry үүсгэх

**Requirement · must.** Зочин нийтлэгдсэн бүтээгдэхүүний inquiry form-д хүчинтэй нэр, утас, зурвас оруулж илгээхэд систем яг нэг inquiry үүсгэж, `201`, давтагдашгүй ID, `status=new`, `customer_id=null` буцаана.

**Source / owner:** FR-INQ-001…003, inquiry controller/schema · Тэнгис. **Verification T-01:** нийтлэгдсэн бүтээгдэхүүн дээр guest хүсэлт илгээж status, ID, DB-ийн нэг мөр, null customer-ийг шалгана. Аль нэг нь зөрвөл fail. **Mock UI:** [MUI-01](../ICSI438/sem3/assets/01-inquiry-form.png). **Status:** Implemented; test execution not performed.

### FR-02 — Нэвтэрсэн хэрэглэгчийн inquiry-г холбох

**Requirement · must.** Нэвтэрсэн хэрэглэгч inquiry илгээхэд систем хэрэглэгчийн баталгаажсан session ID-г `customer_id` болгон хадгалж, client body дахь owner утгыг үл хэрэгсэнэ.

**Source / owner:** migration 0007, optionalAuth, inquiry service · Тэнгис. **Verification T-02:** A customer-ийн token-оор илгээж, хадгалсан `customer_id=A`; body-д B ID оруулах боломжгүй/үл хэрэгссэн байхыг шалгана. **Mock UI:** [MUI-01](../ICSI438/sem3/assets/01-inquiry-form.png). **Status:** Implemented; not executed.

### FR-03 — Inquiry form-ийг баталгаажуулах

**Requirement · must.** Нэр 2-оос цөөн тэмдэгт, утас 8 цифр биш, зурвас хоосон эсвэл product ID буруу үед web систем тухайн талбарын монгол алдааг үзүүлж, API inquiry мөр үүсгэхгүй.

**Source / owner:** inquiry-form-schema, shared inquiryInputSchema, WF-INQ-01 · Тэнгис. **Verification T-03:** дөрвөн invalid input-ыг тус тус илгээж, field error/HTTP 400 эсвэл 404 болон DB row count өөрчлөгдөөгүйг шалгана. **Mock UI:** [MUI-01](../ICSI438/sem3/assets/01-inquiry-form.png). **Status:** Implemented; not executed.

### FR-04 — Inquiry баталгааг харуулах

**Requirement · must.** Inquiry амжилттай хадгалагдмагц web form-ийг success төлөвөөр сольж, форматласан inquiry дугаар, хэрэглэгчийн утас болон каталог руу буцах холбоос харуулна.

**Source / owner:** WF-INQ-04, `InquirySuccess`, inquiry-display · Тэнгис. **Verification T-04:** successful API response өгч, form алга болсон, дугаар/утас/link харагдсан, link `/products` нээснийг шалгана. **Mock UI:** [MUI-02](../ICSI438/sem3/assets/02-inquiry-success.png). **Status:** Implemented; not executed.

### FR-05 — Inquiry rate limit хэрэгжүүлэх

**Requirement · must.** Нэг IP нэг цагт тохируулсан дээд хэмжээнээс олон inquiry илгээвэл API шинэ мөр үүсгэхгүй, `429` буцааж, web нэг цагийн дараа дахин оролдох монгол тайлбар үзүүлнэ.

**Source / owner:** FR-INQ-007, NFR-SEC-002, rate-limit plugin · Тэнгис. **Verification T-05:** test max=1 үед эхний valid хүсэлт `201`, хоёр дахь нь `429`, DB-д нэг мөр байгааг шалгана. **Status:** Implemented; not executed.

### FR-06 — Өөрийн inquiry history-г харах

**Requirement · must.** Нэвтэрсэн customer өөрийн profile-оос зөвхөн өөрийн inquiry-г newest-first дарааллаар дугаар, бүтээгдэхүүн, огноо, төлөвтэй харна; guest `401` авна.

**Source / owner:** `/inquiries/mine`, inquiry repository, profile UI · Тэнгис. **Verification T-06:** A/B хэрэглэгч тус бүр мөртэй үед A response-д зөвхөн A ID орсон, guest `401`, UI зөв талбаруудтайг шалгана. **Mock UI:** [MUI-03](../ICSI438/sem3/assets/03-inquiry-history.png). **Status:** Implemented; not executed.

### FR-07 — Админ inquiry inbox харах

**Requirement · must.** Баталгаажсан admin inquiry жагсаалтыг newest-first, page/limit metadata-тай харна; guest `401`, энгийн customer `403` авна.

**Source / owner:** FR-INQ-004, FR-ADM-006, admin controller/table · Тэнгис. **Verification T-07:** хоёр өөр огноотой мөр үүсгээд дараалал, metadata, 401/403-г шалгана. **Mock UI:** [MUI-04](../ICSI438/sem3/assets/04-admin-inbox.png). **Status:** Implemented; not executed.

### FR-08 — Админ inquiry шүүх

**Requirement · should.** Admin inquiry inbox-ийг status, product ID болон date range-аар шүүхэд систем зөвхөн бүх идэвхтэй нөхцөлийг хангасан мөрүүдийг буцаана.

**Source / owner:** FR-INQ-006, adminInquiryListQuerySchema · Тэнгис. **Verification T-08:** new/contacted, хоёр product, хоёр огнооны fixture дээр filter бүр болон хослолын ID-г шалгана. **Mock UI:** [MUI-04](../ICSI438/sem3/assets/04-admin-inbox.png). **Status:** Implemented; not executed.

### FR-09 — Inquiry төлөв шинэчлэх

**Requirement · must.** Admin inquiry төлөвийг `new`, `contacted`, `closed` утгын аль нэгээр шинэчлэхэд API шинэ төлөвтэй мөрийг буцааж, audit log-д admin, entity ID, action, status-ийг нэмнэ.

**Source / owner:** FR-INQ-005, inquiryStatusPatchSchema, audit log repository · Тэнгис. **Verification T-09:** valid transition бүр `200` ба audit row үүсгэсэн; invalid status `400`, unknown ID `404`, customer `403` болохыг шалгана. **Mock UI:** [MUI-04](../ICSI438/sem3/assets/04-admin-inbox.png). **Status:** Implemented; not executed.

### FR-10 — Wishlist-д нэвтрэлт шаардах

**Requirement · must.** Guest `/wishlist` нээхэд web `/login?next=/wishlist` рүү шилжүүлж, wishlist API-ийн GET/POST/DELETE хүсэлт бүр `401` буцаана.

**Source / owner:** wishlist page, authenticated API scope · Тэнгис. **Verification T-10:** cookie/token-гүй page ба гурван endpoint-ийг шалгана. Redirect query болон бүх API status зөв байвал pass. **Status:** Implemented; not executed.

### FR-11 — Нийтлэгдсэн бүтээгдэхүүн хадгалах

**Requirement · must.** Нэвтэрсэн хэрэглэгч нийтлэгдсэн бүтээгдэхүүний хадгалах товчийг дарахад систем тухайн хэрэглэгчийн wishlist-д бүтээгдэхүүнийг нэмээд `201` буцаана; draft, archived эсвэл unknown product-д `404` буцаана.

**Source / owner:** cart service/controller, SaveButton · Тэнгис.

**Verification T-11:** published, draft, unknown fixture дээр POST response ба DB мөрийг шалгана. **Mock UI:** [MUI-05](../ICSI438/sem3/assets/05-wishlist.png). **Status:** Implemented; not executed.

### FR-12 — Wishlist давхардлыг хориглох

**Requirement · must.** Нэг хэрэглэгч нэг бүтээгдэхүүнийг давтан хадгалахад систем хамгийн ихдээ нэг `(user_id, product_id)` мөр хадгалж, wishlist-д нэг карт харуулна.

**Source / owner:** cart repository, unique migration constraint · Тэнгис. **Verification T-12:** ижил POST-ыг хоёр удаа явуулж, хоёул амжилттай боловч DB/list count=1 байхыг шалгана. **Mock UI:** [MUI-05](../ICSI438/sem3/assets/05-wishlist.png). **Status:** Implemented; not executed.

### FR-13 — Wishlist жагсаах

**Requirement · must.** Нэвтэрсэн хэрэглэгч wishlist-ээ нээхэд систем зөвхөн өөрийн хадгалсан бүтээгдэхүүнийг newest-first дарааллаар нэр, зураг, үнэ, stock status-тай харуулна; хоосон үед каталогийн холбоостой empty state үзүүлнэ.

**Source / owner:** cart repository, WishlistGrid · Тэнгис. **Verification T-13:** A/B хэрэглэгчийн fixture, хоёр огноо болон empty account ашиглан ownership, order, fields, empty link-ийг шалгана. **Mock UI:** [MUI-05](../ICSI438/sem3/assets/05-wishlist.png). **Status:** Implemented; not executed.

### FR-14 — Wishlist-ээс хасах

**Requirement · must.** Нэвтэрсэн хэрэглэгч хадгалсан бүтээгдэхүүнийг хасахад API `204` буцааж, UI картаа арилгана; ижил DELETE-г дахин хийхэд мөн `204` буцааж бусдын мөрийг өөрчлөхгүй.

**Source / owner:** cart remove service/repository, wishlist store · Тэнгис. **Verification T-14:** A/B хэрэглэгч ижил product хадгалсан үед A хоёр удаа DELETE хийж, A-д 0, B-д 1 мөр үлдсэнийг шалгана. **Mock UI:** [MUI-05](../ICSI438/sem3/assets/05-wishlist.png). **Status:** Implemented; not executed.

### FR-15 — Hero fallback-аас каталогт хүрэх

**Requirement · must.** 3D asset тохируулаагүй эсвэл WebGL боломжгүй үед web canvas-гүй статик hero харуулж, хэрэглэгчид ажиллах `/products` холбоос өгнө.

**Source / owner:** WF-INTRO-03/07, static-hero, intro-config · Тэнгис. **Verification T-15:** asset URL байхгүй ба WebGL disabled хоёр нөхцөлд static hero, link, scroll lock байхгүйг desktop/mobile дээр шалгана. **Status:** Implemented for missing configuration/WebGL; broken asset recovery is a known gap; not executed.

## 5. Функциональ бус шаардлага

### NFR-01 — Хувийн өгөгдлийг тусгаарлах

**Requirement · Security · must.** Customer A-ийн wishlist болон inquiry history response-д customer B-ийн ID эсвэл мөр огт орохгүй; customer admin endpoint-д `403`, guest хамгаалагдсан endpoint-д `401` авна.

**Source / owner:** security §9, P-NG-01, auth hooks, ownership repositories · Тэнгис. **Verification I-01/T-16:** controller→service→repository→RLS замыг inspect хийж, A/B/admin runtime matrix ажиллуулна. Нэг cross-user мөр илэрвэл fail. **Status:** Static path partially inspected; runtime not executed.

### NFR-02 — Хөдөлгөөн багасгах тохиргоо

**Requirement · Accessibility/Reliability · must.** `prefers-reduced-motion: reduce` идэвхтэй үед web хөдөлгөөнт 3D intro-г эхлүүлэхгүй, статик hero болон каталогийн холбоосыг 1 секундийн дотор харуулна.

**Source / owner:** NFR-ACC-004, WF-INTRO-06/07, hero-intro · Тэнгис. **Verification T-17:** browser media emulation-аар reduce/no-preference нөхцөлийг харьцуулж, canvas байхгүй, CTA хугацаа ≤1 s болохыг хэмжинэ. **Status:** Implemented; not executed.

### NFR-03 — Deploy-оос өмнөх тестийн хаалт

**Requirement · Maintainability · must.** API production deploy нь integration test үнэхээр ажиллаж амжилттай болсон, production Docker build амжилттай болсон үед л eligible байна; test fail, all-skipped эсвэл build fail бүр deploy-г хаана.

**Source / owner:** NFR-MAIN-005/006, API workflow, test skip branch · Тэнгис. **Verification I-02:** CI dependency ба гурван negative log-ийг шалгана. **Status:** Gap/planned W9; local DB provisioning байхгүй тул all-skipped хаалт одоогоор хангагдаагүй.

### NFR-04 — Каталогийн хуудсын ачааллын хугацаа

**Requirement · Performance · must.** Нийтлэгдсэн бүтээгдэхүүнтэй `/products` хуудас cold-cache simulated 4G, mid-tier mobile profile дээр 10 хэмжилтийн дор хаяж 9-д нь 2.0 секундээс өмнө үндсэн каталогийн агуулгаа харуулна.

**Source / owner:** NFR-PERF-002; Akamai-ийн retail performance report нь 2 секундийн саатал bounce rate-ийг өсгөдөг болохыг тайлагнасан · Тэнгис. **Verification A-01/T-18:** Lighthouse эсвэл browser trace-аар ижил build/seed/profile дээр 10 run хийж, 9/10 ≤2.0 s бол pass. **Status:** Requirement defined; not executed.

### NFR-05 — Inquiry retry давхардал үүсгэхгүй байх

**Requirement · Reliability · should.** Client `Idempotency-Key`-тай ижил inquiry POST-ыг ижил payload-аар 24 цагийн дотор давтахад систем эхний status/body-г буцааж, inquiry мөрийг нэгээс олшруулахгүй; ижил key өөр payload-тай бол `409` буцаана.

**Source / owner:** давтагдсан илгээлтийн эрсдэл; Stripe idempotent request нь retry-г давхар object үүсгэхгүй болгох, key-г дор хаяж 24 цаг хадгалах жишиг өгдөг · Тэнгис. **Verification T-19:** нэг key/ижил payload хоёр POST → нэг row, ижил ID; нэг key/өөр payload → `409`; 24 цагийн хадгалалтыг clock-controlled test-ээр шалгана. **Status:** Planned; одоогийн API энэ header-ийг хэрэгжүүлээгүй.

## 6. Бусад шаардлага

Inquiry phone нь зөвхөн хариу өгөх зорилгоор хэрэглэгдэнэ. Secret болон service-role key нь server-side орчинд хадгалагдана. Admin status update бүр audit log үүсгэнэ. Монгол интерфэйсийн алдааны мессежийг code/API нэрээс бусад хэсэгт хэрэглэнэ.

## 7. Verification төлөв

Энэ M3 багцаар test procedure болон хэмжигдэх босго бичсэн. Үндсэн хэрэгжилтийн хугацаанаас шалтгаалан 80% trial test ажиллуулаагүй. Иймд ямар ч шаардлагыг энэ баримтаар `verified` гэж зарлаагүй; `implemented` нь зөвхөн кодын зам байгаа гэсэн утгатай.

## Хавсралт A. ISO/IEEE чанарын checklist

| Шалгуур | M3 хяналт |
|---|---|
| Correct | Эх код, Phase 0, Scope Charter-тай тулгасан; stakeholder interview байхгүйг тэмдэглэсэн |
| Unambiguous | Нэг ID нэг ажиглагдах үндсэн үр дүнтэй; тодорхой role, нөхцөл, status ашигласан |
| Complete | 15 FR + 5 NFR, интерфэйс, dependency, error/boundary болон verification орсон |
| Consistent | Wishlist-ийг checkout гэж нэрлээгүй; delivery disabled, scope exclusion-тай зөрчөөгүй |
| Ranked | Week 3-ын `must/should/could` priority бүх шаардлагад бий |
| Verifiable | Шаардлага бүр named procedure болон pass/fail босготой |
| Modifiable | FR/NFR ID тогтвортой, requirement ба traceability тусдаа эхтэй |
| Traceable | [20 мөртэй matrix](traceability-matrix-v1.0.md)-аар source→requirement→verification холбоно |

## Хавсралт B. Шаардлагын тоо

| Төрөл | Must | Should | Could | Нийт |
|---|---:|---:|---:|---:|
| FR | 14 | 1 | 0 | 15 |
| NFR | 4 | 1 | 0 | 5 |
| **Нийт** | **18** | **2** | **0** | **20** |
