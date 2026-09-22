# UE-3 — Corg.ly requirement diff ба reflection

**ICSI438 Seminar 3 · Тэнгис · 2026-09-22**

## 1. “Most important information first” хэлбэрийн 5 FR

Эдгээр нь Bhatti-ийн Corg.ly Pet Translation API кейс дээр хийсэн дасгал. Тоон хязгааруудыг дасгалын testable contract болгохын тулд ил тод тогтоосон; Corg.ly-ийн бодит production contract гэж үзэхгүй.

### C-FR-01 — Audio upload

**Corg.ly valid dog-bark audio-г нэг upload ID-тай хүлээн авна.** Баталгаажсан client `POST /audio` руу MP3 эсвэл WAV, 20 MB хүртэл файл илгээхэд API `202`, `uploadId`, `status=queued` буцаана; формат эсвэл хэмжээ зөрвөл `400/413` буцаана.

### C-FR-02 — Authentication

**Corg.ly зөв API key-тэй хүсэлтийг л translation queue-д оруулна.** `Authorization: Bearer` header байхгүй эсвэл хүчингүй бол API `401` буцааж, upload/job үүсгэхгүй.

### C-FR-03 — Translation result

**Corg.ly дууссан job-д англи орчуулга болон confidence утга буцаана.** Client `GET /translations/{jobId}` дуудахад completed job нь `translation`, 0–1 хооронд `confidence`, `completedAt` бүхий `200` хариу өгнө.

### C-FR-04 — Processing status

**Corg.ly дуусаагүй job-ийн одоогийн төлөвийг алдалгүй мэдээлнэ.** Queued/processing job-д API `200`, зөвхөн `queued|processing` status болон retry хийх `pollAfterSeconds` утга буцааж, хоосон translation үүсгэхгүй.

### C-FR-05 — Safe retry

**Corg.ly ижил idempotency key-тэй давтан upload-аас нэг л job хадгална.** Ижил key, ижил файлтай хүсэлтийг 24 цагийн дотор давтахад анхны `uploadId` болон status-г буцаана; ижил key өөр файлтай бол `409` буцаана.

## 2. AI alternative ба зөрүү

| Human/source-first requirement | AI alternative | Concise/Usable зөрчил | Засварын шийдвэр |
|---|---|---|---|
| C-FR-01 | “Users should be able to upload various audio files of a reasonable size so that the innovative platform can process their beloved pets.” | Урт, сурталчилгааны үгтэй; format, size, response байхгүй. | Үр дүнг эхэнд тавьж MP3/WAV, 20 MB, `202/uploadId`, `400/413`-г нэрлэв. |
| C-FR-03 | “The system will try to provide a good translation to the user after processing has eventually completed.” | “try”, “good”, “eventually” нь pass/fail тогтоохгүй; output schema байхгүй. | `translation`, 0–1 confidence, `completedAt`, `200` гэсэн ажиглагдах үр дүн болгосон. |
| C-FR-05 | “The upload process should be robust and avoid unnecessary duplicates whenever possible.” | “robust”, “unnecessary”, “whenever possible” тодорхойгүй; retry identity ба хугацаа байхгүй. | Idempotency key, 24 цаг, ижил/өөр payload-ийн хариуг салгав. |

## 3. Requirement diff

| Шинж | AI draft | Зассан хувилбар |
|---|---|---|
| Эхлэл | Role/desire эсвэл ерөнхий тайлбар | Хэрэглэгчийн авах үр дүн |
| Үйл үг | should, try, avoid | accept, return, create, reject |
| Boundary | reasonable, eventually | 20 MB, 24 h, 0–1, HTTP status |
| Output | Ерөнхий success | Нэрлэсэн JSON field/status |
| Fail case | Байхгүй | `400`, `401`, `409`, `413` |

\newpage

## 4. Нэг хуудасны reflection

Bhatti-ийн “хамгийн чухал мэдээллийг эхэнд тавих” зарчмыг requirement дээр хэрэглэхэд өгүүлбэрийн эхний хэсэг л уншигчид юу авахыг ойлгуулах ёстойг анзаарлаа. Эхний AI хувилбарууд хэрэглэгчийн хүсэл, бүтээгдэхүүнийг магтсан үг, ерөнхий чанараар эхэлсэн. Тэдгээрийг уншихад яг ямар response гарах, ямар нөхцөлд fail болохыг дараа нь таах хэрэгтэй болсон. Харин зассан таван FR “Corg.ly юу буцаах вэ?” гэсэн үр дүнгээр эхэлж, дараа нь input ба boundary-г өгсөн.

Concise гэдэг нь зөвхөн цөөн үг хэрэглэх биш гэж ойлгов. Хэрэггүй үгийг хасахын зэрэгцээ шалгахад зайлшгүй хэрэгтэй format, хэмжээ, ID, status, хугацааг үлдээх шаардлагатай. Жишээлбэл “reasonable size” нь богино боловч usable биш; “MP3/WAV, 20 MB хүртэл” нь арай урт ч шалгаж болно. Мөн “good translation” гэсэн AI өгүүлбэрийг confidence field болон response schema-гаар сольсноор subjective үгийг ажиглагдах output болгосон.

Энэ дасгалын хамгийн том сургамж нь AI-ийн цэвэрхэн сонсогдох өгүүлбэрийг contract гэж шууд хүлээн авч болохгүй явдал байв. AI ихэвчлэн нөхцөл, алдааны хязгаар, хугацааг алгасаж, “should”, “robust”, “quickly” зэрэг аюулгүй мэт боловч шалгах боломжгүй үг хэрэглэсэн. Цаашид candidate бүр дээр input, action, observable output, failure boundary, verification гэсэн таван асуулт тавина. Ингэснээр requirement нь гоё тайлбар биш, тест бичиж болох гэрээ болно.
