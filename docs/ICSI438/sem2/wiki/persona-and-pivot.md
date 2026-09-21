# Nogoolin persona — Week 2 нэмэлт

**Тэнгис · 2026-09-15 · US-2.3 · Өөрийн ажиглалт; ярилцлага хийгдээгүй.**

## Уншигч ба бүтээгдэхүүний хэрэглэгч

**Хөгжүүлэгч persona:** Тэнгис, TypeScript/React ашигладаг, web/API/өгөгдлийн санг холбож ажиллуулна. Зорилго нь Nogoolin-ийн inquiry/wishlist урсгалыг local орчинд давтаж шалгаж, алдааг аль давхаргаас хайхаа ойлгох. Хэрэгсэл: Fedora, VS Code, Git, pnpm, Docker, DevTools.

**Бүтээгдэхүүний хэрэглэгч:** каталог үзэж, асуулга илгээх эсвэл дараа үзэх бүтээгдэхүүнээ хадгалах хүн. Энэ нь [Phase 0 vision](../../../phase-0/01-vision.md)-ийн catalog visitor/inquiry customer тайлбарын хураангуй; шинэ хүнтэй ярилцсан үр дүн биш.

## P-NG-01 — Session ба өгөгдөл эзэмших эрхийг ялгах

Нэвтрэлт ажиллаж байсан ч A хэрэглэгч B-ийн wishlist, inquiry history-г харах ёсгүй. Шалгах зааварт guest, customer A/B, admin-ийн ялгаа байхгүй бол эрхийн алдаа анзаарагдахгүй үлдэнэ. Энэ бол код болон security баримтаас гаргасан эрсдэлийн ажиглалт; бодит халдлага болсон гэсэн үг биш.

**Source:** [08-security §9](../../../phase-0/08-security.md#9-idor-prevention), [cart repository](../../../../backend/api/src/repositories/supabase/cart.repository.ts), [inquiry repository](../../../../backend/api/src/repositories/supabase/inquiry.repository.ts). **Холбоо:** [NFR-01](../../../requirements/requirements.md#nfr-01).

## P-NG-02 — Asset бэлэн бус үед урсгалыг шалгах

Бодит Green Tara GLB/.riv бэлэн болоогүй үед каталогийн урсгалыг хүлээлгэхгүй шалгах хэрэгтэй. Asset тохируулаагүй нөхцөл дэх орлуулагч, WebGL-гүй болон reduced-motion хувилбарын үр дүнг тус бүр тодорхой болгоно.

**Source:** [Asset contract](../../../../agent-context/ASSET_SPECS.md), [deity.tsx](../../../../apps/web/src/components/intro/deity.tsx), [hero-intro.tsx](../../../../apps/web/src/components/intro/hero-intro.tsx). **Холбоо:** [NFR-02](../../../requirements/requirements.md#nfr-02).

## P-NG-03 — Хуучин заавар ба бодит орчин зөрөх

Flutter/Express гэсэн хуучин тайлбаруудыг одоогийн React Native/Fastify шийдвэртэй андуурч болно. Мөн local өгөгдлийн сан байхгүй үед тест алгасагдсаныг бүрэн шалгалт өнгөрсөн гэж ойлгох эрсдэлтэй.

**Source:** [ADR-003/004/011](../../../../agent-context/DECISIONS.md), [integration test-ийн skip салаа](../../../../backend/api/tests/inquiry-cart.integration.test.ts). **Холбоо:** [NFR-03](../../../requirements/requirements.md#nfr-03), [SDD](../../../architecture/sdd-template.md).

## Week 1-тэй холбосон үндэслэл

[Өмнө хүлээлгэн өгсөн W1 persona](../../sem1/wiki/02_audience_persona.md)-ийн **P1** нь нэвтрэлтийн cookie/session-ийг шалгах зааврын хэрэгцээ байсан. Түүний authentication-ийг оношлох хэрэгцээг Nogoolin-д өргөжүүлж **P1 → P-NG-01 → NFR-01** гэж холбов. Authentication болон ownership нь өөр ойлголт; W1-д IDOR байсан гэж үзээгүй. Мөн W1-ийн **P3** нь local ба pipeline-д өөр үр дүн гарахыг оношлох, өөр замтай байх хэрэгцээ; үүнээс **P3 → P-NG-03 → NFR-03** холбоог шинэ төсөлд шилжүүлэн гаргав.

Эдгээр нь Week 2-т нэмсэн тайлбарласан холбоо. US-2.3-ийн W1 pain point шалгуурт энэ шилжүүлэлт нийцэх эсэхийг багш/reviewer-ээр баталгаажуулна; Week 1-ийн эхийг өөрчлөөгүй.
