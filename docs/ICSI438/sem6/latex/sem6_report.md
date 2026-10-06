---
lang: mn
---

\input{sem6-title.tex}

# 1. Кодын API documentation

Nogoolin-ийн backend service-үүдийг JSDoc-оор тайлбарлаж, TypeDoc-оор HTML reference
үүсгэв. Үндсэн төсөл TypeScript тул handout-ийн JSDoc/TypeDoc хувилбарыг сонгосон.
UE-6-ийн Python class-ийн оронд inquiry service-ийн factory болон method-уудыг ашиглав.

Sem6-ийн эх ба файлууд:
<https://github.com/Tengis01/Nogoolin/tree/main/docs/ICSI438/sem6>.
[reference/](reference/index.html) дотор generated API reference,
[audit/](audit/provenance.md) дотор харьцуулалт,
[tools/](tools/package.json) дотор build/test хэрэгслүүд бий.

## 1.1 Хамрах хүрээ ба өмнөх ажлын холбоо

Cart, category, inquiry, media, product, settings гэсэн зургаан service модулийг
хамруулсан. Нийт 44 symbol: 6 factory, 23 method, 6 service type, 2 media interface,
7 interface field. Эдгээрийн **44/44 нь тайлбартай**; function/method бүр parameter,
return, error, жишээтэй. Controller, database adapter, hook болон frontend нь энэ
reference-ийн entry point биш. Төслийн бүх export-ийн бүрэн coverage гэж үзэхгүй.

Sem3-ийн inquiry шаардлага нь service-ийн submit үйлдэлтэй, Sem4-ийн
Controller → Service → Repository бүтэц нь тайлбарын хариуцлагын заагтай,
Sem5-ийн inquiry endpoint нь controller-оор энэ service дуудах урсгалтай холбогдоно.
HTTP contract ба code reference хоёрын зорилго ялгаатай.

## 1.2 Inquiry service-ийн нэг жишээ

Жишээнүүдэд Ногоон Дарь эх бүтээгдэхүүнтэй холбоотой inquiry ашиглав. Service
factory-д repository dependency өгнө. UUID болон repository-уудыг caller урьдчилан
бэлтгэсэн байх нөхцөлийг reference-ийн эхэнд тайлбарласан.

```ts
/**
 * Inquiry үүсгэнэ; product_id байвал бүтээгдэхүүнийг шалгана.
 * @param input - Controller-оор schema шалгасан input.
 * @param customerId - JWT subject UUID эсвэл зочинд null.
 * @returns Repository-ийн үүсгэсэн Inquiry.
 * @throws PRODUCT_NOT_FOUND (404), repository failure.
 */
const inquiry = await service.submit({
  customer_name: "Тест хэрэглэгч",
  phone: "99112233",
  message: "Ногоон Дарь эх байгаа юу?"
}, null);
```

Input validation болон authentication нь controller/schema-д хийгддэг. Service
нь JWT шалгахгүй. Non-exported helper-үүдийг implementation detail гэж тайлбарлаж,
шууд public API болгон гаргаагүй. Зургаан service-ийн comment засварын өмнөх ба дараах
emitted JavaScript ижил гарсан тул runtime үйлдэл өөрчлөгдөөгүй.

\clearpage

# 2. AI audit ба эхтэй тулгасан засвар

Bhatti Ch.5-ийн Explained, Concise, Clear, Usable, Trustworthy гэсэн таван зарчмыг
inquiry module-д хэрэглэв. Нэг controlled faulty draft-ийг эхтэй тулгасан baseline-тай
харьцуулж diff, audit хүснэгт, Use–Verify–Cite log хадгалсан.

## 2.1 Bhatti-ийн таван зарчим

Доорх 0–5 оноо нь локал self-assessment; багшийн болон peer-ийн үнэлгээ биш.

| Зарчим | Draft → baseline | Засварын гол үр дүн |
|---|---|---|
| Explained | 2 → 4 | Validation/auth болон service behavior-ийн зааг тодорхой. |
| Concise | 4 → 4 | Method бүрийн зорилгыг богино бичсэн. |
| Clear | 2 → 4 | Array ба pagination wrapper-ийг ялгасан. |
| Usable | 2 → 4 | Domain жишээ, dependency нөхцөл, snippet type-check. |
| Trustworthy | 1 → 4 | Source ба local test-тэй тулгасан; live test хийгдээгүй. |

Дундаж нь draft 2.2/5, baseline 4.0/5. Бүрэн audit нь тусдаа Markdown файлд байна.

## 2.2 Гурван засвар

**C1 — Validation.** Draft нь submit утсыг яг найман цифр эсэхийг өөрөө шалгана гэсэн.
Бодит implementation-д ийм шалгалт байхгүй. Controller input schema хэрэглэж,
service зөвхөн product байгаа эсэхийг шалган create дууддаг гэж зассан. Sem5-д
тэмдэглэсэн SRS–phone schema drift хэвээр байгаа; энэ ажлаар бүтээгдэхүүний дүрэм өөрчлөөгүй.

**C2 — Return.** Draft нь listOwn pagination metadata буцаана гэсэн. Бодит return
нь Inquiry array; хоосон үед хоосон array буцаадгийг test шалгасан.

**C3 — Status ба transaction.** Draft нь зөвхөн new → contacted → closed дараалалтай,
update ба audit нэг transaction гэсэн. Service нь шилжилтийн дарааллыг хориглодоггүй.
Audit алдаа гарсан ч өмнөх status update rollback болохгүйг local double test шалгасан.
Анхны кодын lifecycle comment-ийг мөн бодит implementation-тэй нийцүүлсэн.

## 2.3 Гарал ба hallucination test

Baseline нь AI-assisted, эх кодтой тулгасан хувилбар. Controlled draft-ийн алдааг
зориуд audit exercise-д оруулсан. Үүнийг Тэнгис бие даан гараар бичсэн эсвэл
GPT-4/Claude-ийн санамсаргүй алдаа олсон гэж үзэхгүй. Одоогийн assistant нь Codex/GPT-6.

Reflection test-д байхгүй getInquiryById method болон InquiryReceipt type-ийг negative
fixture болгон өгсөн. Test эдгээрийг илрүүлж, corrected reference list-ийг зөвшөөрсөн.
Энэ нь detector ажиллах нотолгоо; бодит model output-оос invented API олсон шалгуурын
нотолгоо биш. Independent manual review болон тухайн output-ийн audit нээлттэй.

\clearpage

# 3. Чанар ба автомат build

## 3.1 Chinchilla-ийн зөвлөгөөг хэрэглэсэн нь

Handout “Six Principles” гэж нэрлэсэн ч зургаан нэрийг жагсаагаагүй. Доорх checklist
нь Ch.3 болон Ch.7-ийн зөвлөгөөг энэ ажилд хэрэглэхээр нэгтгэсэн.

| Шалгалт | Энэ ажилд хэрэглэсэн нь |
|---|---|
| Нэг мөр нэр томьёо ба domain | Ногоон Дарь эх → inquiry; тогтмол method/type нэр. |
| Үйлдэл, хариуцагч тодорхой | Controller шалгалт ба service үйлдлийг ялгасан. |
| Богино, хэрэгтэй тайлбар | Summary, parameter, result, error дараалалтай. |
| Бодит хэрэглээтэй жишээ | Guest inquiry болон admin status update. |
| Prerequisite тодорхой | Dependency, UUID, Buffer-ийн нөхцөлтэй. |
| Жишээг шалгаж хадгалах | Snippet type-check, local test, strict build. |

## 3.2 TypeDoc ба GitLab CI

TypeDoc 0.28.14, TypeScript 5.7.3 болон холбогдох dependency-г Sem6-ийн lockfile-д
тогтоосон. Build нь compiler error, missing documentation болон invalid link-ийг
шалгана; warning гарвал амжилтгүй дуусна. Scope-оос гаднах repository/schema contract-д
зориулан notExported шалгалтыг унтраасан бөгөөд шалтгааныг reference index-д бичсэн.

```text
npm ci --prefix docs/ICSI438/sem6/tools
npm run verify --prefix docs/ICSI438/sem6/tools
python3 docs/ICSI438/sem6/latex/build.py
```

Командуудыг Nogoolin root-оос ажиллуулна. Verifier нь coverage → test → TypeDoc
гэсэн дарааллаар ажиллаж verification log хадгална. TeX-ийн compile нь Markdown-оос
дахин үүсгэхгүй; Ctrl+S нь LaTeX Workshop-оор PDF шинэчилнэ.

GitLab pipeline-д docs-build job HTML reference үүсгэж public artifact гаргана.
Default branch дээр publish-docs job тэр artifact-ийг GitLab Pages-д нийтлэхээр
тохируулсан. Root CI файл нь Sem6-ийн CI файлыг include хийдэг. Тусдаа GitLab repo
ашиглахад шаардлагатай source/config-ийг сонгон export хийх хэрэгсэл мөн бэлдсэн.

## 3.3 Бодит verification

| Шалгалт | Үр дүн |
|---|---|
| Public symbol inventory | Service scope-д 44/44. |
| Зан төлөв ба snippet/reflection | 9 test давсан; snippet-ууд type-check давсан. |
| TypeDoc HTML | Local build амжилттай, warning байхгүй. |
| Runtime өөрчлөгдсөн эсэх | Зургаан service-ийн JavaScript output ижил. |
| CI YAML | Parse, include path, job dependency бүтэц шалгасан. |
| GitLab pipeline / Pages | Project байхгүй тул ажиллуулаагүй. |

\clearpage

# 4. Technical debt ба дүгнэлт

## 4.1 TODO/FIXME бүртгэл

Backend, packages болон apps-ийн TS/TSX эхээс нэг TODO олдсон: mobile auth session
AsyncStorage-д хадгалагдаж байгаа бөгөөд encrypted storage-д шилжүүлэх хэрэгтэй.
Хуучин Phase 2 хугацааны тэмдэглэгээг авч, local issue draft-тай холбосон. Authentication
кодын үйлдлийг өөрчлөөгүй.

Issue draft-д session encryption, restore/refresh, logout cleanup, existing session
migration, storage failure болон Android/iOS verification-ийн acceptance criteria бий.
GitLab project байхгүй учраас issue ID зохиогоогүй; бодит issue үүсэх хүртэл энэ
шалгуур нээлттэй. Файл нь issues хавтас дотор байна.

## 4.2 Reflection

**Bhatti-аас авсан санаа.** Миний хувьд Trustworthy зарчим хамгийн хэрэгтэй байлаа.
Зөв хэлбэртэй JSDoc өөрөө зөв тайлбарын баталгаа биш. Жишээлбэл status-ийн сумтай
тайлбарыг хараад шилжилтийн хориг байна гэж ойлгож болох ч код нь түүнийг хэрэгжүүлээгүй.
Тайлбарын claim бүрийг implementation эсвэл test-тэй холбох нь ийм зөрүүг илрүүлнэ.

**Chinchilla-аас үргэлжлүүлэх зүйл.** Нэг domain example-ийг баримт даяар үргэлжлүүлэх
нь method бүрт шинэ нөхцөл ойлгох ачааллыг багасгаж байна. Цаашид жишээнүүдийн
dependency нөхцөлийг эхэнд нь тайлбарлаж, type-check болон test-ийг build-тэй холбоно.

**Ном ба бодит ажлын ялгаа.** Номонд жишээг шалгаж, review хийж, нийтлэн хадгалах
workflow ярьдаг. Энэ ажилд локал build/test бэлэн болсон боловч GitLab project,
бие даасан manual review болон бодит AI output-ийн харьцуулалтын нотолгоо бүрэн биш.
Эдгээрийг локал PDF-ээр орлуулахгүй гэж үзлээ.

## 4.3 Үлдсэн шалгуур

GitLab CI green, live Pages URL, бодит issue дугаар болон repository-wide public
symbol coverage батлагдаагүй. UE-6-ийн independent manual authoring, GPT-4/Claude
response болон spontaneous invented API audit мөн нээлттэй. Одоогийн багц нь
TypeScript хувилбарын локал implementation ба controlled audit exercise юм.

## 4.4 Эх сурвалж

- Sprint 06 Lab Instructions, х.1–2: US-6.1–6.4, UE-6, DoD.
- Bhatti et al., Docs for Developers: Ch.4 х.79; Ch.5 х.86–94.
- Chinchilla, Technical Writing for Software Developers: Ch.3 х.28–33;
  Ch.6 х.69–82; Ch.7 х.89–92; Ch.9 х.123.
- [TypeDoc validation](https://typedoc.org/documents/Options.Validation.html).
- [GitLab Pages workflow](https://docs.gitlab.com/user/project/pages/getting_started/pages_from_scratch/).
- Nogoolin source, Sem6 symbol inventory, audit diff ба verification log.
