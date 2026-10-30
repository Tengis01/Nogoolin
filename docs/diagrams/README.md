# Diagram sources

## Canonical: M8 diagram suite (ARC-07, Sem10)

Nogoolin-ийн гол диаграмууд ICSI438 repo-д байна. Шинэ болон өөрчлөгдсөн диаграм **зөвхөн** эдгээр файлд орно. Засварын дараа тэнд `render.sh`-ийг дахин ажиллуулна.

- Эх: <https://gitlab.com/Tengis01/icsi438-nogoolin/-/tree/main/sem10/docs/diagrams>
- Вэбээр үзэх: <https://icsi438-nogoolin-442a5f.gitlab.io/sem10/>
- Кодтой тулгасан commit: Nogoolin `885e591`

| Файл | Агуулга |
|---|---|
| `c4-context.puml` | Хэн ашигладаг, ямар гадаад системтэй холбогддог |
| `c4-container.puml` | Web, Mobile, API, Supabase ба тэдгээрийн протокол |
| `sequence-inquiry.mmd` | Inquiry илгээх урсгал, 400/429 алдааны замтай |
| `data-model.mmd` | Үндсэн 5 хүснэгт, PK/FK, холбоос |
| `bpmn-process.puml` | Inquiry-г хүлээн авахаас хаах хүртэлх процесс, 3 lane |

## Frozen: хадгална, шинэчлэхгүй

Эдгээр нь түүхэн эх. Устгахгүй, гэхдээ засахгүй. Зөрүү гарвал canonical диаграм зөв.

- [ER diagram](../phase-0/04-er-diagram.md), [Sequence diagrams](../phase-0/05-sequence-diagrams.md) (Phase 0, ARC-05)
- [Auth](../../agent-context/diagrams/auth.md), [Inquiry submit](../../agent-context/diagrams/inquiry-submit.md), [Product browse](../../agent-context/diagrams/product-browse.md) (`agent-context/diagrams/`, ARC-05)
- [arc42](../architecture/arc42-nogoolin.md) доторх Sem4 C4 диаграм (ARC-01)

## Өөрчлөлтийн түүх

| Огноо | Өөрчлөлт |
|---|---|
| 2026-10-30 | Sem10-ийн diagram suite-ийг canonical болгож, бусдыг frozen гэж тэмдэглэсэн. Өмнөх текст: «W8-д эдгээрийг одоогийн inquiry/customer/cart бүтэц болон шинэ SRS/SDD-тэй тулгаж, C4/ER/sequence-ийн review хийсэн source-ыг энд нэгтгэнэ. Энэ task-аар шинэ диаграм үүсгээгүй.» Энэ ажил Sem10-д хийгдсэн. |
