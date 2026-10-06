# Bhatti audit — Inquiry service

[Baseline](audit/manual_docstring.ts) · [Controlled AI draft](audit/ai_docstring.ts) ·
[Diff](audit/manual-vs-ai.diff) · [Гарал](audit/provenance.md).

Bhatti Ch.5, х.86–94-ийн Explained, Concise, Clear, Usable, Trustworthy зарчмыг
0–5 оноогоор **локал self-assessment** хийв. Багшийн болон peer-ийн үнэлгээ биш.

| Зарчмын нэр | Controlled draft | Эхтэй тулгасан baseline | Үндэслэл |
|---|---:|---:|---|
| Explained | 2 | 4 | Input/auth-ийг аль давхарга шалгахыг ялгасан; async error ба audit side effect нэмсэн. |
| Concise | 4 | 4 | Нэг method нэг гол үйлдэл; repository-ийн бүх implementation-ийг давтаагүй. |
| Clear | 2 | 4 | listOwn нь array, listAdmin нь pagination wrapper гэдгийг ялгасан. |
| Usable | 2 | 4 | Ногоон Дарь эхийн нэг domain example; prebound dependency/UUID нөхцөлтэй, snippets type-check давсан. |
| Trustworthy | 1 | 4 | Source ба 7 зан төлөвийн test-тэй тулгасан; live database болон human review хийгдээгүй. |

Controlled draft: **2.2/5**; baseline: **4.0/5**. Эдгээр нь хэмжсэн хэрэглэгчийн үр дүн биш.

## Засварууд

| ID | Draft дахь claim | Зассан тайлбар | Verification |
|---|---|---|---|
| C1 | submit утсыг яг 8 цифр эсэхийг шалгана | Controller Zod шалгана; service нь product байгаа эсэхийг шалгаж create дуудна | inquiry controller, schema, service implementation |
| C2 | listOwn pagination metadata буцаана | Inquiry[] буцаана; хоосон үед [] | listOwn test |
| C3 | status зөвхөн new → contacted → closed; нэг transaction | Service дараалал хориглохгүй; update дараа audit, rollback батлахгүй | transition ба audit failure tests |

Эдгээр нь controlled faulty draft-ийг эхтэй тулгасан засвар. “Тэнгис өөрөө manual
review хийсэн” эсвэл “GPT-4/Claude-ийн spontaneous алдаа олсон” гэж үзэхгүй.

## Chinchilla — зургаан хэрэглэх шалгалт

Handout нь “Six Principles” гэж нэрлэсэн боловч зургаан нэрийг жагсаагаагүй.
Доорх нь Ch.3 ба Ch.7-ийн зөвлөгөөг Sem6-д хэрэглэхээр нэгтгэсэн checklist;
номын албан зургаан нэртэй taxonomy гэж мэдүүлэхгүй.

| Шалгалт | Эх | Хэрэглэсэн нотолгоо |
|---|---|---|
| Нэр томьёо ба domain нэг мөр | Ch.3 х.28, Ch.7 х.89–90 | Ногоон Дарь эх → inquiry; тогтмол method/type нэр |
| Үйлдэл ба хариуцагч тодорхой | Ch.3 х.28–30 | Controller validation/auth; service behavior-ийг ялгасан |
| Уншигчид хэрэгтэй богино тайлбар | Ch.3 х.30–33 | Summary, params, result, error гэсэн дараалал |
| Жишээ нь бодит хэрэглээтэй | Ch.7 х.89–90 | Guest inquiry болон admin status update |
| Prerequisite тодорхой | Ch.7 х.92 | Reference index-д dependency, UUID, Buffer нөхцөл |
| Жишээг шалгаж хадгалах | Ch.7 х.91, Ch.6 х.69–82 | Snippet type-check, repository double test, strict build |

## Use–Verify–Cite log

| ID | Use / claim | Verify / evidence | Cite / шийдвэр |
|---|---|---|---|
| U1 | Phone validation service-д байна | submit body-д schema parse байхгүй; controller validateBody хэрэглэдэг | C1-д зассан; source/schema |
| U2 | Lifecycle arrow нь transition enforcement | updateStatus шинэ status-ийг шууд repository-д дамжуулдаг | C3-д зассан; source/test |
| U3 | getInquiryById / InquiryReceipt | Reflection negative fixture хоёр symbol байхгүйг илрүүлсэн | Seeded test; spontaneous hallucination нотолгоо биш |

Бодит invented API шалгуур нээлттэй. [Verification log](evidence/verification.txt),
[test source](tools/test-documentation.mjs), [coverage](evidence/public-symbols.md).
