# Roadmap v2

**Doc ID:** PRJ-02 · **Төрөл:** Process · **Уншигч:** owner/хөгжүүлэгч, хичээлийн багш · **Хувилбар:** v0.1 draft · **Огноо:** 2026-10-18 · **Owner:** Тэнгис

> Энэ баримт [10-roadmap](../phase-0/10-roadmap.md)-ийг (Phase 0–6, 2026-07) орлоно. Хуучин нь legacy эх болж үлдэнэ.
> Phase бүр [төслийн зорилго](project-goals.md)-ын G1–G6-д үйлчилнэ. Огноонууд нь санал бөгөөд owner баталсны дараа SMART-ийн «T» эцэслэгдэнэ.

## Нэршлийн дүрэм

- **Phase:** `PH0`…`PH8`.
- **Алдааны түвшин:** `S1`–`S4`.
- **Шаардлагын priority:** MoSCoW (Must / Should / Could / Won't).

«P1» гэсэн нэр гурван өөр утгатай болж андуурагддаг байсан: хуучин roadmap-ийн priority, phase, алдааны түвшин. Тиймээс үүнийг ашиглахгүй.

## Ерөнхий зураглал

| Phase | Нэр | Үйлчлэх G | Төлөв (2026-10-18) | Огноо (санал) |
|---|---|---|---|---|
| PH0 | Inception | G5 | ✅ дууссан (2026-07-05) | — |
| PH1 | Requirements baseline | G4, G5 | 🔜 одоо | 2026-10-19 → 11-01 |
| PH2 | Architecture & design baseline | G3, G4, G5 | дараа | 11-02 → 11-15 |
| PH3 | Core platform | G1 | ✅ код, дутуу: admin засах хуудас | үлдэгдэл PH5-тай зэрэг |
| PH4 | Engagement | G2 | 🟡 web хийгдсэн | үлдэгдэл PH5-тай зэрэг |
| PH5 | Experience & content | G1, G3 | 🟡 интро placeholder-тэй | 11-16 → 2027-01-15 |
| PH6 | Quality assurance | G4 | дараа | 2027-01-04 → 01-22 |
| PH7 | Launch | G1, G2 | дараа | 01-18 → **01-29** |
| PH8 | Post-launch | G6 + ирээдүй | ирээдүй | тогтоогоогүй |

```
PH0 ✅ → PH1 → PH2 → [PH3/PH4 үлдэгдэл + PH5] → PH6 → PH7 → PH8
                       └─ Staging demo ≈ W14 (2026-12-07 долоо хоног)
```

**Хөндлөн дүрэм.** Тест болон баримтжуулалт нь phase бүрийн Definition of Done-д орно. PH6 нь эцсийн хатуужуулалт бөгөөд «тестийг эцэст нь бичих» phase биш.

**Ажлын дүрэм.** Хуучин roadmap-ийн §10-ийн дүрмүүд хүчинтэй хэвээр:
- Personal Kanban, WIP ≤ 2;
- долоо хоног бүр ням гарагт 30 минутын тойм;
- delivery хаалттай;
- интро үргэлж skip болон fallback-тай.

## PH0 — Inception ✅

- **Гаралт:** `docs/phase-0/` 01–10 (EN/MN), vision, шаардлага v0, use case, ER, sequence, API, wireframe, security, deployment.
- **Хуучин:** Phase 0.

## PH1 — Requirements baseline

- **Үйлчлэх G:** G4, G5.
- **SMART:** 2026-11-01 гэхэд дараахыг хангана:
  - [SRS v2](../requirements/srs-v2.md)-д MVP болон ирээдүйн бүх FR/NFR шинэ шаталсан ID, MoSCoW, phase, verification арга, acceptance criteria, хэрэгжилтийн төлөвтэй бүртгэгдсэн;
  - Phase 0 болон v1.0-ийн ID бүр шинэ ID руу 100% mapping-тай;
  - 5 чанарын шалгуурын review-д нээлттэй «Consistent» зөрчил 0.
- **Гаралт:**
  - [project-goals](project-goals.md), энэ roadmap;
  - [Document Register](../README.md);
  - SRS v2, [traceability v2](../requirements/traceability-v2.md), [ID mapping](../requirements/id-mapping.md).
- **Гарах шалгуур:**
  - owner G1–G6 болон огноог баталсан;
  - SRS v2 «approved»;
  - хичээлийн «шаардлага шалгах 5 арга»-ын нэрсийг тааруулсан.

## PH2 — Architecture & design baseline

- **Үйлчлэх G:** G3, G4, G5.
- **SMART:** 2026-11-15 гэхэд дараахыг хангана:
  - arc42 болон ADR нь D-08 болон SRS v2-тай нийцсэн;
  - C design system нь DESIGN.md-д token шатлалтайгаар бичигдсэн: primitive → semantic → component → brand, Tailwind v4 `@theme`, өөрийн CSS `@layer`-т;
  - wireframe v2 нь WF-INTRO-02/WF-MO-03-ийг C интрогоор сольсон;
  - OpenAPI нь бодит route-уудтай 100% нийцсэн;
  - нүүр, жагсаалт, дэлгэрэнгүй хуудасны **perf baseline** хэмжилт `docs/quality/perf-baseline.md`-д бичигдсэн.
- **Гаралт:** `docs/architecture/` шинэчлэл, `docs/design/` (DESIGN.md, components.md, wireframe v2), `docs/api/openapi.yaml`, perf baseline.
- **Гарах шалгуур:** NFR-PERF-ийн босгыг baseline-д тулгуурлан эцэслэсэн. Component contract (props, callback, children) баримтжсан.
- **Хуучин:** шинэ phase. Хичээлийн Sem4–Sem6, W07–W10-тай давхцана.

## PH3 — Core platform ✅ (үлдэгдэлтэй)

- **Үйлчлэх G:** G1.
- **Хийгдсэн:** monorepo, CI, Supabase local, auth (email, Google), RBAC, ангиллын CRUD, бүтээгдэхүүний жагсаалт/үүсгэх, зураг, жагсаалт/дэлгэрэнгүй хуудас, SEO (sitemap, robots), олон бичигтэй хайлт. [PROGRESS](../../agent-context/PROGRESS.md)-аас.
- **Үлдэгдэл:** admin бүтээгдэхүүн засах хуудас; JSON-LD escape засвар (тусдаа task); хэмжээ, жин, материалын талбар (FR-PROD-190, D-09) — migration, Zod, admin form. PH5-ийн контент оруулахаас өмнө дуусна. Cloud тохиргоо PH7-д.
- **Гарах шалгуур:** FR-ADM болон FR-PROD-ийн Must шаардлагууд «implemented», тесттэй.
- **Хуучин:** Phase 1, Phase 2.

## PH4 — Engagement 🟡

- **Үйлчлэх G:** G2.
- **Хийгдсэн:** inquiry API болон web form, admin inbox, wishlist, profile, inquiry түүх (web).
- **Үлдэгдэл:** CI дээр integration тестүүд skip-гүй ажиллах (SRS v1.0 NFR-03 gap). Mobile inquiry G6 рүү шилжсэн.
- **SMART:** PH5-ийн төгсгөл (2027-01-15) гэхэд FR-INQ болон FR-WISH-ийн Must шаардлагууд CI дээр skip-гүй тестээр баталгаажсан байна.
- **Хуучин:** Phase 4.

## PH5 — Experience & content

- **Үйлчлэх G:** G1, G3.
- **SMART:** 2027-01-15 гэхэд дараахыг хангана:
  - C дизайн production web-ийн бүх нийтийн хуудсанд нэвтэрсэн;
  - бодит Green Tara GLB (≤ 5 MB) интрод ажилладаг;
  - ≥ 30 бодит бүтээгдэхүүн бүрэн контенттой;
  - нүүр хуудас placeholder-гүй.
- **Ажлын дараалал (нэг дор хөрвүүлэхгүй):**
  1. **Token refactor:** одоогийн v4 token-уудыг (`apps/web/src/app/globals.css`) шатлал руу шилжүүлнэ. Шалгуур нь screenshot-ын ялгаа 0px.
  2. **C brand mapping** хуудас хуудсаар: интро → нүүр → жагсаалт → дэлгэрэнгүй → inquiry → auth/profile → admin. Хуудас бүрт screenshot, a11y, perf шалгалт.
  3. Click-intro (4 алхам) нь production R3F дээр. D-04-ийг бодит GLB дээр тааруулна.
  4. Бодит фото, контент оруулах. Зураг авалт нь [D-09 стандарт](../../agent-context/ASSET_SPECS.md#3-product-photography-standard-d-09)-аар: Tier A (нарийн хийцтэй) 4–5 зураг, Tier B (энгийн) 2 зураг. Хэмжээ, жинг талбарт оруулна. Дэлгэрэнгүй хуудсанд FR-PUB-250 (хэмжээний мөр), боломжтой бол FR-PUB-260 (хэмжээний шугамын overlay).
- **Гаралт:** C дизайнтай production web, GLB, контент.
- **Гарах шалгуур:** G3-ийн хэмжүүр staging дээр хэмжигдсэн. FR-INTRO-ийн accessibility шаардлагууд тест давсан.
- **Хуучин:** Phase 3 (360° viewer нь PH8 руу, D-09-өөр photo spin болсон; mobile Rive нь G6 руу).

## PH6 — Quality assurance

- **Үйлчлэх G:** G4.
- **SMART:** 2027-01-22 гэхэд дараахыг хангана:
  - Must шаардлагын 100% нь traceability-д тест эсвэл inspection-тэй;
  - CI gate skip-гүй;
  - нээлттэй S1 алдаа 0;
  - usability protocol-ийн 5 task хэмжигдсэн, эсвэл «хэмжигдээгүй» гэж үндэслэлтэйгээр тэмдэглэгдсэн.
- **Гаралт:**
  - `docs/quality/`: тестийн стратеги, төлөвлөгөө, S1–S4 тодорхойлолт, usability protocol, a11y/perf/security тайлан;
  - owner-ийн vault дахь `00-Vault/ADVANCED-WEB-GUIDE.md` (repo-оос гадуур) §7 checklist-ийг review checklist болгоно.
- **Тэмдэглэл:** Software Quality & Testing хичээлийн агуулга ирэхэд энэ phase болон NFR-ийг тааруулна.
- **Хуучин:** Phase 6-ийн performance, security review хэсэг.

## PH7 — Launch

- **Үйлчлэх G:** G1, G2.
- **SMART:** 2027-01-29 гэхэд дараахыг хангана:
  - web public domain дээр HTTPS-ээр нээгдсэн;
  - API production-д ажилладаг;
  - cloud Supabase-д migration болон RLS орсон;
  - launch checklist 100% биелсэн.
- **Гаралт:** Cloudflare DNS/WAF, Vercel, API deploy, production env (нууц утгыг repo-д оруулахгүй), runbook (`docs/operations/`).
- **Хуучин:** Phase 6-ийн deploy хэсэг. Store гаргах ажил G6 руу шилжсэн.

## PH8 — Post-launch

- **Үйлчлэх G:** G6 болон ирээдүйн хүрээ.
- **Агуулга:**
  - Mobile release (G6);
  - захиалга/хүргэлт: `delivery_enabled` toggle идэвхжүүлэх, order flow, төлбөр. Settings-ийн backend хэсэг бий;
  - сонгосон (Tier A) бүтээгдэхүүний 360° photo spin (D-07, D-09; 3D GLB биш);
  - зургаар хайх (pgvector);
  - MN/EN хэл (D-05);
  - G2-ийн launch-ийн дараах хэмжилт.
- **Хуучин:** Phase 5, §9 Post-launch.

## Хуучин → шинэ mapping

| Хуучин (10-roadmap) | Шинэ | Тайлбар |
|---|---|---|
| Phase 0 Documentation & Planning | PH0 | Хэвээр |
| Phase 1 Foundation | PH3 | Core platform-д нэгтгэсэн |
| Phase 2 Product System | PH3 | Mobile listing/detail нь G6 руу |
| Phase 3 Premium Experience | PH5 | 360° viewer → PH8; Rive → G6 |
| Phase 4 Inquiry | PH4 | Mobile inquiry → G6 |
| Phase 5 Delivery-Ready | PH8 | Schema/toggle бүтэц хэвээр, идэвхжүүлэлт нь PH8-д |
| Phase 6 Launch Preparation | PH6 + PH7 | QA болон launch-ийг салгасан |
| §9 Post-launch | PH8 | — |
| (шинэ) | PH1, PH2 | Шаардлага болон архитектур/дизайны baseline |
