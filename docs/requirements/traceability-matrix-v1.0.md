# Traceability Matrix — SRS v1.0 draft

**Nogoolin · ICSI438 M3 · Тэнгис · 2026-09-22**

Нийт 20 шаардлага, 20 мөр, 8 баганатай. `Planned` verification нь procedure бичигдсэн боловч энэ ажлаар ажиллуулаагүй гэсэн утгатай. Peer review болон stakeholder interview хийгдээгүй.

| ID | Source | Owner | Verification | Dependency | Risk | Status | Last-Reviewed |
|---|---|---|---|---|---|---|---|
| FR-01 | FR-INQ-001…003; controller/schema | Тэнгис | T-01 guest create | Product, DB | Давхар мөр | Implemented; planned test | 2026-09-22 |
| FR-02 | migration 0007; optionalAuth | Тэнгис | T-02 session link | Auth | Client owner spoof | Implemented; planned test | 2026-09-22 |
| FR-03 | form/shared schemas; WF-INQ-01 | Тэнгис | T-03 invalid matrix | Zod, UI | Web/API drift | Implemented; planned test | 2026-09-22 |
| FR-04 | WF-INQ-04; InquirySuccess | Тэнгис | T-04 success UI | Create response | Баталгаа ойлгомжгүй | Implemented; planned test | 2026-09-22 |
| FR-05 | FR-INQ-007; rate-limit plugin | Тэнгис | T-05 cap+1 | IP detection | Spam / shared IP | Implemented; planned test | 2026-09-22 |
| FR-06 | inquiries mine; P-NG-01 | Тэнгис | T-06 A/B/guest | Auth, ownership | Cross-user leak | Implemented; planned test | 2026-09-22 |
| FR-07 | FR-INQ-004; admin inbox | Тэнгис | T-07 order/RBAC | Admin role | Unauthorized inbox | Implemented; planned test | 2026-09-22 |
| FR-08 | FR-INQ-006; query schema | Тэнгис | T-08 filter matrix | Seed variety | Буруу result set | Implemented; planned test | 2026-09-22 |
| FR-09 | FR-INQ-005; audit repository | Тэнгис | T-09 status/audit | Admin, audit | Төлөв audit-гүй | Implemented; planned test | 2026-09-22 |
| FR-10 | wishlist page; auth scope | Тэнгис | T-10 redirect/401 | Auth middleware | Guest data access | Implemented; planned test | 2026-09-22 |
| FR-11 | cart service; SaveButton | Тэнгис | T-11 product states | Published product | Draft exposure | Implemented; planned test | 2026-09-22 |
| FR-12 | cart repository; unique pair | Тэнгис | T-12 repeated POST | DB constraint | Duplicate cards | Implemented; planned test | 2026-09-22 |
| FR-13 | cart list; WishlistGrid | Тэнгис | T-13 owner, order, empty | Product join | Null/stale product | Implemented; planned test | 2026-09-22 |
| FR-14 | cart remove; wishlist store | Тэнгис | T-14 repeated DELETE | Ownership | Бусдын мөр устах | Implemented; planned test | 2026-09-22 |
| FR-15 | WF-INTRO-03/07; static hero | Тэнгис | T-15 fallback paths | Intro config | Blank/locked page | Partial; planned test | 2026-09-22 |
| NFR-01 | Security §9; P-NG-01 | Тэнгис | I-01/T-16 A/B matrix | JWT, RLS, RBAC | Personal data leak | Partial inspection | 2026-09-22 |
| NFR-02 | NFR-ACC-004; hero-intro | Тэнгис | T-17 reduce ≤1 s | Browser media query | Motion barrier | Implemented; planned test | 2026-09-22 |
| NFR-03 | NFR-MAIN-005/006; CI | Тэнгис | I-02 negative CI | Local DB, Docker | False-green deploy | Gap; planned W9 | 2026-09-22 |
| NFR-04 | NFR-PERF-002; Akamai | Тэнгис | A-01/T-18 9/10 ≤2 s | Seed, 4G profile | Slow catalog | Defined; not executed | 2026-09-22 |
| NFR-05 | Stripe idempotency; retry risk | Тэнгис | T-19 24 h retry | Key store/clock | Duplicate inquiry | Planned; not implemented | 2026-09-22 |

## W1 persona холбоо

W1 P1-ийн session оношлох хэрэгцээг P-NG-01-ээр дамжуулан FR-02, FR-06, FR-10, NFR-01-т холбоно. W1 P3-ийн local/pipeline ялгааг NFR-03-т холбоно. Энэ нь шинэ төсөлд хийсэн тайлбарласан mapping бөгөөд W1-д IDOR эсвэл CI gate байсан гэж өөрчлөөгүй.

## Change record

| Version | Өөрчлөлт | Review |
|---|---|---|
| M2 v0.2 | 2 FR + 3 NFR-ийн seed, 5 мөр | Self-check |
| M3 v1.0 draft | 15 FR + 5 NFR, 20 мөр, Week 3 priority | Source/code check |
| Peer-reviewed v1.0 | Үүсгээгүй | Бодит peer comment байхгүй |
