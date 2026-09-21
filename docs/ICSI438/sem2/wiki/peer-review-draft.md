# Peer review draft — M2

**Тэнгис · Nogoolin · 2026-09-15 · Бэлтгэсэн; илгээгээгүй**

## Reviewer-т зориулсан тайлбар

Week 2-оос Document RAG Chatbot-оос Nogoolin руу шилжсэн. Week 1-ийн ажлыг өөрчлөөгүй. Phase 0 баримтаас SRS-ийн шаардлага болон SDD-ийн технологийн шийдвэрийг салгаж, таван шаардлагын draft ба traceability бэлтгэлээ.

**Унших дараалал:** [Scope Charter](../../../requirements/scope-charter.md) → [persona нэмэлт](persona-and-pivot.md) → [SRS загвар](../../../requirements/srs-template.md) → [5 шаардлага](../../../requirements/requirements.md) → [traceability](../../../requirements/traceability-matrix.md) → [SDD](../../../architecture/sdd-template.md).

## Шалгах асуултууд

1. Included/excluded/postponed нь ганцаараа хөгжүүлэх хүрээнд хангалттай тодорхой байна уу? Product 360° viewer ба нүүрний hero хоёр ялгагдаж байна уу?
2. Mapping-ийн мөр бүр яг нэг төлөвтэй, n-a нь тайлбартай байна уу? Complete төлөвийг template-ийн агуулгатай гэж зөв ойлгож байна уу?
3. FR-01/02, NFR-01…03 бүрд оролт, үйлдэл, гаралт, pass/fail хязгаар хангалттай юу? Олон шалгуурыг M3-д дэд шаардлага болгох хэрэгтэй юу?
4. **W1 P1 → P-NG-01 → NFR-01**, **W1 P3 → P-NG-03 → NFR-03** гэсэн тайлбарласан холбоо нь төсөл сольсон нөхцөлд US-2.3-ын persona шаардлагыг хангах уу?
5. Ownership-ийг session-ээс авах дүрэм ойлгомжтой юу? Guest inquiry, customer history, admin inbox-ийг зөв ялгасан уу?
6. NFR-03-т all-skipped тестийг fail гэж үзэх шалгуур хангалттай юу? SRS/SDD-ийн хил зааг алдагдсан өгүүлбэр байна уу?

## Санал бүртгэх загвар

| Reviewer / огноо | Requirement/section | Асуудал ба санал | Хариу / өөрчлөлт |
|---|---|---|---|
| Pending | Pending | Санал хараахан ирээгүй | Pending |

## Source interview ба submission

Source interview хийгдээгүй; owner нь Тэнгис, source нь repo-ийн файл ба өөрийн ажиглалт. Хүлээн авагч болон Confluence/LMS холбоос байхгүй тул 2026-09-15-ны хэрэглэгчийн заавраар илгээлт/нийтлэлийг алгассан. Peer review хийсэн, neighboring team-д илгээсэн гэж тэмдэглэхгүй. Дараа нь хүлээн авах суваг тодорхой болбол Confluence Requirements хэсэгт repo permalink холбож, submission evidence хадгалж болно.

## Богино retrospective

**Сайн болсон:** Phase 0-ийн их хэмжээний эхээс M2-д хэрэгтэй жижиг хүрээ сонгож, кодтой тулгав. **Тодорхойгүй байсан:** SRS-ийн "юу хийх" ба SDD-ийн "яаж хийх" өгүүлбэрүүд холилдсон; W1 persona нь өөр төсөл байсан. **Дараагийн өөрчлөлт:** шаардлага бүрийг source → observable result → verification дарааллаар бичиж, тестийн команд амжилттай дууссан эсэхээс гадна тест үнэхээр ажилласан эсэхийг шалгана.

Chinchilla-ийн бүлэг 5-аас далд таамаг ба одоогийн дуусах нөхцөлийг эхэлж тодруулах аргыг үргэлжлүүлэн хэрэглэнэ. Номын үйл явц ба энэ ажлын хамгийн том зөрүү нь бодит хэрэглэгч/reviewer-ийн feedback хараахан аваагүй байхад draft-ыг кодын шинжилгээнээс эхлүүлсэн явдал юм.
