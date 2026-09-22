# Таван шалгаж болох шаардлага

**Nogoolin · M2 / US-2.2 · Тэнгис · 2026-09-15 · v0.1 / draft**

FR нь үйлдлийн, NFR нь чанар/хязгаарлалтын шаардлага. Доорх ID нь энэ шинэ багцын ID; Phase 0-ийн урт ID-г солихгүй. `must` = зайлшгүй, `shall` = тохирсон хүрээнд заавал биелүүлэх, `may` = сонголтот гэсэн хичээлийн тэмдэглэгээг хэрэглэв. Энд тавуулаа `must`. Owner: **Тэнгис**. Source interview: **хийгдээгүй**; эх нь repo-ийн файл ба өөрийн шинжилгээ. Pass/fail нь төлөвлөсөн шалгуур; тестийг энэ ажлаар ажиллуулаагүй.

## FR-01

**Асуулга хадгалах · Priority: must · Verification: Test (T-01)**

Зочин эсвэл нэвтэрсэн хэрэглэгч зөв нэр, утас, сонголтот зурвас болон бүтээгдэхүүний ID-тай асуулга илгээхэд систем нэг шинэ асуулга хадгалж, `201`, давтагдашгүй ID, `status=new` бүхий баталгааг **must** буцаана.

**T-01:** local өгөгдлийн санд нийтлэгдсэн бүтээгдэхүүн, rate limit-д хүрээгүй IP бэлтгэнэ. Нэр `Тэнгис`, тестийн утас `99112233`, сонголтот зурвас болон бүтээгдэхүүний ID-тай `POST /api/v1/inquiries` явуулна. Guest болон customer нөхцөл бүрд 201, нэг мөр нэмэгдсэн, status=new, guest-ийн customer_id=null, customer-ийнх өөрийн ID байвал pass. Нэр 1 тэмдэгт эсвэл утас `abc` үед 400, мөр нэмэгдэхгүй; байхгүй бүтээгдэхүүний зөв хэлбэртэй UUID үед 404, мөр нэмэгдэхгүй байна. Аль нэг хүлээлт зөрвөл fail. Утасны бүрэн формат нь [shared schema](../../packages/validation-schemas/src/common.ts)-д байна.

**Source:** [Phase 0 FR-INQ-001…003](../phase-0/02-requirements.md), [inquiry schema](../../packages/validation-schemas/src/inquiry.schema.ts), [controller](../../backend/api/src/controllers/inquiry.controller.ts). Email талбар оруулахгүй; message API дээр сонголтот. **Төлөв:** хэрэгжилт, тестийн эх байгаа; шинэ ажиллуулалтын нотолгоо pending.

## FR-02

**Wishlist-ийн төлөв хадгалах · Priority: must · Verification: Test (T-02)**

Нэвтэрсэн хэрэглэгч нийтлэгдсэн бүтээгдэхүүнийг хадгалах, жагсаалтаа харах, хасахад систем хэрэглэгч-бүтээгдэхүүн хос бүрд хамгийн ихдээ нэг хадгалсан бичлэгтэй төлөвийг **must** хадгална.

**T-02:** A хэрэглэгч бүтээгдэхүүн P-г `POST /api/v1/cart`-аар хоёр удаа нэмэхэд хүсэлт бүр 201, `GET /api/v1/cart`-д P яг нэг удаа байна. Хуудсыг дахин ачаалахад P хадгалагдсан байна. `DELETE /api/v1/cart/P`-г хоёр удаа дуудахад хоёул 204, дараах GET-д P байхгүй байвал pass. Guest хүсэлт 401, draft/байхгүй бүтээгдэхүүн нэмэх хүсэлт 404 байна. Аль нэг хүлээлт зөрвөл fail. Энэ нь wishlist бөгөөд тоо хэмжээ, нийт үнэ, checkout агуулахгүй.

**Source:** [cart controller](../../backend/api/src/controllers/cart.controller.ts), [cart repository](../../backend/api/src/repositories/supabase/cart.repository.ts), [wishlist page](../../apps/web/src/app/wishlist/page.tsx), [20260726120000 migration](../../supabase/migrations/20260726120000_inquiry_customer_and_cart.sql). **Төлөв:** хэрэгжилт, тестийн эх байгаа; runtime pending. Phase 0-д wishlist-ийн бие даасан FR байгаагүй; одоогийн кодоос сэргээн тодорхойлов.

## NFR-01

**Хэрэглэгчдийн өгөгдлийг тусгаарлах · Priority: must · Verification: Inspection (I-01)**

Customer A-ийн session-ээр wishlist болон inquiry history унших/өөрчлөхөд систем өөр customer B-ийн хувийн мөрийг хариунд оруулахгүй, өөрчлөхгүй байхыг **must** хангана; guest нь эдгээр хамгаалагдсан үйлдэлд 401 авна. Админ inbox-д зөвхөн баталгаажсан admin хүрнэ.

**I-01:** хамгаалагдсан cart GET/POST/DELETE, inquiry mine GET, admin inquiry GET/PATCH-ийн controller → service → repository болон RLS-ийг шалгана. Эзэмшигчийн ID баталгаажсан session-ээс ирдэг, хэрэглэгчийн body/query-гээс ирдэггүй; cart нь `user_id`, inquiry нь `customer_id`-аар шүүгддэг; insert нь session-ийн ID оноодог; RLS болон admin role guard бий гэдгийг мөр бүрд нотолбол pass. Нэг хамгаалагдсан зам ownership/role шалгалтгүй бол fail. Public catalog, guest inquiry create-д сохроор `user_id` filter шаардахгүй.

**Дэмжих тест:** A/B хоёр customer үүсгээд A-ийн хариунд B-ийн ID огт байхгүй, A хасахад B-ийн хадгалсан бүтээгдэхүүн хэвээр, customer admin inbox-д 403 авдгийг шалгана. **Source:** [security §9](../phase-0/08-security.md#9-idor-prevention), [P-NG-01 / W1 холбоо](../ICSI438/sem2/wiki/persona-and-pivot.md), дээрх хоёр repository ба migration. **Төлөв:** статик замыг шалгасан; бүрэн I-01 checklist, хоёр-customer runtime нотолгоо pending.

## NFR-02

**Asset-гүй үед каталогт хүрэх · Priority: must · Verification: Test (T-03)**

Нүүрний 3D asset тохируулаагүй үед систем орлуулагчийг, WebGL боломжгүй эсвэл reduced-motion идэвхтэй үед статик hero-г **must** үзүүлж, хэрэглэгчийг каталогт хүрэх боломжтой байлгана.

**T-03:** desktop 1440×900, mobile хэмжээ 390×844 бүхий browser-д sessionStorage-г цэвэрлэж дараахыг тус бүр шалгана: (a) GLB URL тохируулаагүй — орлуулагч харагдах; (b) WebGL unavailable — статик hero; (c) reduced-motion — хөдөлгөөнт intro алгасагдах. Intro гарсан нөхцөлд skip нь navigation эхэлснээс 1 секундийн дотор харагдаж, дарахад home төлөвт орно. Нөхцөл бүрд бүтээгдэхүүний холбоосоор `/products` нээгдэж, жагсаалт харагдвал pass; хоосон дэлгэц, түгжигдсэн scroll, хүрэх боломжгүй каталог байвал fail. Browser/version, local build, хэмжсэн хугацааг тэмдэглэнэ. Буруу URL/404 asset-ийн recovery нь тусдаа gap, энэ шаардлагын батлагдсан хэрэгжилт гэж үзэхгүй.

**Source:** [WF-INTRO-03/05/06/07](../phase-0/07-uiux-wireframes.md), [hero-intro](../../apps/web/src/components/intro/hero-intro.tsx), [deity](../../apps/web/src/components/intro/deity.tsx), [P-NG-02](../ICSI438/sem2/wiki/persona-and-pivot.md). **Төлөв:** код байгаа; шинэ browser evidence pending.

## NFR-03

**Deploy-оос өмнөх тестийн хаалт · Priority: must · Verification: Inspection (I-02)**

API production deploy нь тухайн commit-ийн шаардлагатай integration тестүүд бодитоор ажиллаж амжилттай дууссан, production container build амжилттай болсон үед л эхлэхийг систем **must** хангана. Тест fail болох, бүх integration тест алгасагдах, эсвэл Docker build fail болох нөхцөл бүр deploy-г хаана.

**I-02:** CI тохиргоо, тестийн entry point, job dependency болон гурван сөрөг тохиолдлын CI log-ийг шалгана. Test fail / DB unavailable буюу all-skipped / Docker build fail бүрд deploy job skipped эсвэл blocked, амжилттай тохиолдолд deploy нь зөвхөн хоёр шалгалтын дараа eligible болсон байвал pass. Энэ review нь production deploy ажиллуулах шаардлагагүй. Auto-deploy зэрэг CI-ийг тойрох зам Phase 6-д хаагдсан эсэхийг мөн шалгана.

**Source:** [NFR-MAIN-005/006](../phase-0/02-requirements.md), [deployment §8.4](../phase-0/09-deployment.md), [api workflow](../../.github/workflows/api-deploy.yml), [test skip branch](../../backend/api/tests/inquiry-cart.integration.test.ts), [Dockerfile](../../backend/api/Dockerfile). **Төлөв: gap / planned (W09).** `lint-and-test → docker-build → deploy` холбоо байгаа ч тестүүд DB-гүй үед skip хийнэ, workflow local Supabase асаахгүй. Иймд хаалт бүрэн хэрэгжсэн гэж үзэхгүй. Web workflow-д test команд байхгүй; энэ NFR API-д хамаарна, web рүү өргөтгөх нь дараагийн шаардлага.
