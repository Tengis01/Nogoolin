# SRS Template — Nogoolin

**ICSI405 / M2 / US-2.1 · Тэнгис · 2026-09-15 · v0.1 / draft**

## 1. Оршил

**1.1 Purpose.** Энэ SRS нь inquiry, wishlist, хувийн өгөгдлийн тусгаарлалт, hero fallback, API-ийн тестийн хаалтын хүлээгдэх үр дүнг хөгжүүлэгч болон reviewer-т тодорхойлно. M2-д таван шаардлагын draft бэлтгэсэн; бүрэн бүтээгдэхүүний SRS эсвэл ISO нийцлийн гэрчилгээ биш.

**1.2 Scope.** [Scope Charter](scope-charter.md)-ийн included/excluded/postponed шийдвэрийг мөрдөнө. Catalog нь inquiry/wishlist-ийн урьдчилсан нөхцөл; 360° product viewer хасагдсан, Phase 5/6 ажиллагаа хойшлогдсон. Үндсэн төсөл W2-оос Nogoolin болсон.

**1.3 Definitions.** Inquiry = бүтээгдэхүүний асуулга; wishlist = дараа үзэхээр хадгалсан жагсаалт; guest = нэвтрээгүй хэрэглэгч; customer = өөрийн мэдээлэлд эрхтэй хэрэглэгч; admin = тусгай удирдах эрхтэй хэрэглэгч. IDOR = эзэмшигчийг шалгалгүй өөр хүний мэдээлэлд хүрэх алдаа; RLS = өгөгдлийн мөрийн түвшний хандалтын дүрэм. FR/NFR болон Test/Inspection нь [шаардлагын баримт](requirements.md)-д тайлбартай.

**1.4 References.** [W2 handout](../ICSI405/sem2/Software_Project_Documentation_Week_02_Handout.pdf), Lecture 02, слайд 4–8; [Phase 0 index](../phase-0/README.md), [кодын нотолгоо](traceability-matrix.md). [IEEE 830-1998](https://ieeexplore.ieee.org/document/720574) нь SRS-ийн бүтэц/чанарын зөвлөмж; [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) нь requirements engineering-ийн процесс, мэдээллийн агуулгыг тодорхойлдог. Доорх нь хичээлийн зориулалтаар тохируулсан IEEE 830 бүтэц; чанарын найман шалгуурыг Lecture 02-ын rubric-аар ашиглав.

**1.5 Overview.** §2 нь бүтээгдэхүүний орчин, хэрэглэгч, таамаг; §3-ын mapping нь бүрэн/дутуу хэсэг; [5 шаардлага](requirements.md), [traceability](traceability-matrix.md), [SDD](../architecture/sdd-template.md) нь дэлгэрэнгүй холбоотой баримтууд.

## 2. Ерөнхий тодорхойлолт

**2.1 Product perspective.** Nogoolin бол шашин, зан үйлийн бүтээгдэхүүний каталог. Web хэрэглэгч бүтээгдэхүүн үзэж, асуулга илгээнэ; customer хадгалсан бүтээгдэхүүн болон асуулгын түүхээ харна; admin inbox-оос асуулгыг боловсруулна. Нэг хэрэглэгчийн хувийн мэдээллийг бусдад үзүүлэхгүй.

**2.2 Product functions.** Энэ draft-ийн үйлдэл FR-01 (асуулга), FR-02 (wishlist); тэдгээрийн чанарын хязгаар NFR-01…03. Бүтээгдэхүүн засварлах, search, auth-ийн бүх нарийвчилсан FR нь Phase 0 эхэд байгаа бөгөөд W3-д сонгон өргөжүүлнэ.

**2.3 User characteristics.** [Persona нэмэлт](../ICSI405/sem2/wiki/persona-and-pivot.md): хэрэглэгч энгийн монгол интерфэйс, баталгаа хүснэ; хөгжүүлэгч давтаж шалгах алхам, эрхийн ялгаа, орчны хамаарлыг мэдэх хэрэгтэй. Эдгээр нь баримт/кодын шинжилгээ; хэрэглэгчийн ярилцлага pending.

**2.4 Constraints.** Ганцаараа хөгжүүлэх хүрээ; монгол интерфэйс; delivery идэвхгүй; cloud холболт Phase 6 хүртэл хойшлогдсон. Fastify/Next.js/Supabase/Docker-ийн сонголт нь [SDD](../architecture/sdd-template.md)-д байна.

**2.5 Assumptions/dependencies.** Local өгөгдлийн сан, нийтлэгдсэн бүтээгдэхүүн болон test customer/admin бэлэн үед acceptance шалгалт ажиллана. Бодит GLB/.riv asset, cloud account, production log бэлэн гэж үзэхгүй. Тестүүд ажилласан эсэхийг үр дүнгээс тусад нь шалгана.

**2.6 Apportioning.** W3-д өргөжүүлсэн SRS, W4-д архитектур, W5-д API, W8-д диаграм, W9-д Docs-as-Code/CI evidence бэлтгэх төлөвлөгөөтэй. Эдгээр нь хичээлийн долоо хоног; Phase 0–6 нь бүтээгдэхүүний roadmap тул хооронд нь адилтгахгүй.

## 3. IEEE 830 section mapping

`complete` = M2 загварт тухайн хэсгийн агуулга/холбоос байна; хэрэгжилт болон stakeholder approval гэсэн үг биш. `planned (Wxx)` = нөхөх долоо хоног. `n-a (justified)` = энэ хүрээнд хамаарахгүй, шалтгаан нь Content-д бий. Мөр бүр яг нэг төлөвтэй.

| Section | Content / эх материал | Status |
|---|---|---|
| 1.1 Purpose | §1.1: хөгжүүлэгч/reviewer-ийн зорилго | complete |
| 1.2 Scope | Scope Charter; 01 vision, 10 roadmap | complete |
| 1.3 Definitions | §1.3: inquiry, wishlist, IDOR, RLS | complete |
| 1.4 References | §1.4: handout, lecture, Phase 0, код | complete |
| 1.5 Overview | §1.5: холбоотой баримтын бүтэц | complete |
| 2.1 Product perspective | §2.1; 01 vision, 03 use cases | complete |
| 2.2 Product functions | §2.2; FR-01/02-ийн хүрээ | complete |
| 2.3 User characteristics | Persona нэмэлт; 01 vision, W1 persona | complete |
| 2.4 Constraints | §2.4; Scope Charter, SDD | complete |
| 2.5 Assumptions/dependencies | §2.5; 10 roadmap, asset/DB нөхцөл | complete |
| 2.6 Apportioning | §2.6; Phase 5/6 postponed | complete |
| 3.1.1 User interfaces | §3.1 доор; 07 wireframes; persona | complete |
| 3.1.2 Hardware interfaces | Тусгай төхөөрөмж/сенсортой холболт энэ web/API хүрээнд байхгүй. | n-a (justified) |
| 3.1.3 Software interfaces | §3.1 доор; 06 API, shared schema; wishlist OpenAPI gap | planned (W05) |
| 3.1.4 Communication interfaces | §3.1: JSON, auth, status; 06 API, 08 security | complete |
| 3.2 Functional requirements | FR-01/02 draft; M3-д сонгосон хүрээнд 15 FR болгон өргөжүүлэх | planned (W03) |
| 3.3 Performance requirements | 02 requirements-ийн NFR-PER; reference орчин/ачааллыг хэмжих нөхцөлтэй болгох | planned (W03) |
| 3.4 Logical database requirements | 04 ER эх + inquiry/customer/cart migration; өгөгдөл/unique/ownership дүрмийг нийцүүлэх | planned (W03) |
| 3.5 Design constraints | §2.4 ба SDD; delivery-off, local-first, solo хүрээ | complete |
| 3.6.1 Reliability | NFR-02 draft; recovery, asset 404 шалгуурыг нөхөх | planned (W03) |
| 3.6.2 Availability | 02 requirements; outage хэмжих нөхцөл тодорхойлох | planned (W03) |
| 3.6.3 Security | NFR-01 draft; 08 security; 5 NFR багцад өргөжүүлэх | planned (W03) |
| 3.6.4 Maintainability | NFR-03 gap; 09 deployment; CI-ийн бодит run evidence | planned (W09) |
| 3.6.5 Portability | 02 requirements; browser/mobile дэмжлэгийн шалгах матриц | planned (W03) |
| 3.7 Other requirements | Audit/хувийн мэдээллийн хадгалах ба устгах бодлого тодруулах; 08 security | planned (W03) |
| Appendix A: Traceability | 8 багана, 5 ID, source ба persona холбоо | complete |
| Appendix B: Assumptions/quality | §2.5 ба §4; эх сурвалжийн хязгаарлалт | complete |

### 3.1 External interface-ийн M2 эхлэл

**User:** бүтээгдэхүүний detail-ээс тусдаа inquiry page рүү орж нэр/утас, сонголтот зурвас илгээнэ; амжилтын баталгаа ба 400/404/429 алдааг ялгана. Wishlist-д хадгалах/хасах, profile-д зөвхөн өөрийн асуулга харах; guest хамгаалагдсан хуудсанд нэвтрэх урсгалтай. Hero нь skip/static fallback-тай. Persona-ийн P-NG-01 нь эрхийн алдаа, P-NG-02 нь asset-гүй төлөвийг тайлбарлах хэрэгцээг өгнө.

**Software/communication:** REST JSON интерфэйс: `/api/v1/inquiries`, `/api/v1/cart`, `/api/v1/inquiries/mine`; protected API нь Bearer session token-оор хэрэглэгчийг тогтооно. 201/204 амжилт, 400 validation, 401 нэвтрэлт, 403 эрх, 404 олдоогүй, 429 rate limit. Production transport нь HTTPS гэсэн security эхийн хязгаартай; localhost нь хөгжүүлэлтийн орчин. Field/schema-ийн бүрэн contract W5; 06 OpenAPI-д cart/history нэмэлт хараахан нийцээгүй.

## 4. Чанарын review ба W3 ажлын хүрээ

| Lecture 02-ын шалгуур | Энэ draft-д хэрэглэсэн арга |
|---|---|
| Correct | Source нь бодит файл; interview/approval pending гэж тэмдэглэсэн |
| Unambiguous | Input, action, output, pass/fail-ийг тус бүр нэрлэсэн |
| Complete | Таван шаардлагын нөхцөл/хязгаар бий; бүтээгдэхүүний бүрэн SRS W3 |
| Consistent | Email-гүй inquiry, wishlist ≠ checkout; технологи SDD-д |
| Ranked | Шаардлага бүр must; optional боломж энэ багцад ороогүй |
| Verifiable | T-01…03, I-01…02; нотолгооны төлөв тусдаа |
| Modifiable | Тогтвортой ID, салгасан Markdown, нэг traceability эх |
| Traceable | 8 багана; Phase 0/код/тайлбарласан W1 холбоо |
