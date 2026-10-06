# Audit-ийн гарал ба хязгаар

2026-10-06. Энэ session-ийн AI assistant нь Codex / GPT-6.
GPT-4 эсвэл Claude ашигласан гэж мэдүүлэхгүй.

`manual_docstring.ts` нь handout-ийн deliverable нэрийг хадгалсан **эх кодтой тулгасан,
AI-assisted baseline** юм. Тэнгис өөрөө бие даан гараар бичсэн хувилбар гэж үзэхгүй.
`ai_docstring.ts` нь baseline-тай ижил runtime кодтой, зориуд буруу claim агуулсан
**controlled exercise draft**. Audit-ийн засварууд нь source verification-ийн үр дүн;
бие даасан хүний review хийсэн гэсэн нотолгоо биш.

`manual-vs-ai.diff` нь энэ хоёр comment хувилбарын ялгаа. Phone validation, pagination,
status transition/transaction-ийн буруу claim-уудыг ил тод audit fixture болгосон.
`ai-references.json` дахь `seeded` хэсгийн `getInquiryById`, `InquiryReceipt` нь negative
test-д зориуд оруулсан байхгүй symbol. Эдгээрийг бодит GPT-4/Claude response-оос
гэнэт олдсон hallucination гэж тайлагнахгүй.

**Бодитоор илэрсэн lying-comment эрсдэл:** анхны inquiry source-ийн
`status lifecycle new → contacted → closed` гэсэн comment-оос шилжилтийн хориг байна
гэж ойлгож болох ч method нь зөвхөн status update ба audit хийдэг. Тайлбарыг зассан;
closed → new дуудлага service-д зөвшөөрөгдөхийг local double test баталсан.

Handout-ийн independent manual authoring, GPT-4/Claude output болон бодитоор олдсон
invented API шалгуурын нотолгоо энэ багцад бүрэн биш. Actual model output ирвэл
түүнийг хадгалж, diff болон audit-ийг ижил workflow-оор шинэчилнэ.
