# Architecture Traceability — M4 v0.1 draft

Энэ хүснэгт нь [Seminar 3-ын 20 мөртэй traceability matrix](../requirements/traceability-matrix-v1.0.md)-ийн ID-г өөрчлөлгүй архитектурын element, arc42 section, C4 view болон ADR-тай холбоно. Энэ нь verification execution-ийн шинэ нотолгоо биш.

| ID | Architecture responsibility | arc42 | C4 view | ADR | Architecture status |
|---|---|---|---|---|---|
| [FR-01](../requirements/srs-v1.0.md#fr-01--зочны-inquiry-үүсгэх) | Inquiry Controller → Service → Repository | §5, §6.1 | C4-02, C4-03, C4-D01 | 003, 005, 007 | Implemented path; test planned |
| [FR-02](../requirements/srs-v1.0.md#fr-02--нэвтэрсэн-хэрэглэгчийн-inquiry-г-холбох) | optionalAuth, session-derived customer ID | §5.2, §6.1, §8 | C4-03, C4-D01 | 003, 005, 007 | Implemented; test planned |
| [FR-03](../requirements/srs-v1.0.md#fr-03--inquiry-form-ийг-баталгаажуулах) | Shared Zod schema and validation hook | §5.2, §8 | C4-03, C4-D01 | 003, 007 | Implemented; test planned |
| [FR-04](../requirements/srs-v1.0.md#fr-04--inquiry-баталгааг-харуулах) | Inquiry response and Web success state | §5.1, §6.1 | C4-02, C4-D01 | 003, 007 | Implemented; test planned |
| [FR-05](../requirements/srs-v1.0.md#fr-05--inquiry-rate-limit-хэрэгжүүлэх) | Fastify route rate limit | §5.2, §6.1, §8 | C4-03, C4-D01 | 003, 007 | Implemented; test planned |
| [FR-06](../requirements/srs-v1.0.md#fr-06--өөрийн-inquiry-history-г-харах) | Authenticated own-inquiry query and RLS | §5.2, §6.1, §8 | C4-03, C4-D01 | 005, 007 | Implemented; test planned |
| [FR-07](../requirements/srs-v1.0.md#fr-07--админ-inquiry-inbox-харах) | Admin inbox controller/repository | §5.1, §6.3 | C4-02, C4-03, C4-D03 | 003, 005, 007 | Implemented; test planned |
| [FR-08](../requirements/srs-v1.0.md#fr-08--админ-inquiry-шүүх) | Admin query validation and filtering | §5.2, §6.3 | C4-03, C4-D03 | 003, 007 | Implemented; test planned |
| [FR-09](../requirements/srs-v1.0.md#fr-09--inquiry-төлөв-шинэчлэх) | Status service and audit repository | §5.2, §6.3, §8 | C4-03, C4-D03 | 005, 007 | Implemented; test planned |
| [FR-10](../requirements/srs-v1.0.md#fr-10--wishlist-д-нэвтрэлт-шаардах) | Web route guard and API requireAuth | §5.1, §6.2, §8 | C4-02, C4-03, C4-D02 | 003, 005, 007 | Implemented; test planned |
| [FR-11](../requirements/srs-v1.0.md#fr-11--нийтлэгдсэн-бүтээгдэхүүн-хадгалах) | Published-product rule in cart service | §5.2, §6.2 | C4-03, C4-D02 | 005, 007 | Implemented; test planned |
| [FR-12](../requirements/srs-v1.0.md#fr-12--wishlist-давхардлыг-хориглох) | Service/repository plus unique DB pair | §5.2, §6.2 | C4-03, C4-D02 | 005, 007 | Implemented; test planned |
| [FR-13](../requirements/srs-v1.0.md#fr-13--wishlist-жагсаах) | Customer-scoped cart list and Web grid | §5.1, §6.2 | C4-02, C4-03, C4-D02 | 003, 005, 007 | Implemented; test planned |
| [FR-14](../requirements/srs-v1.0.md#fr-14--wishlist-ээс-хасах) | Idempotent remove service/repository | §5.2, §6.2 | C4-03, C4-D02 | 005, 007 | Implemented; test planned |
| [FR-15](../requirements/srs-v1.0.md#fr-15--hero-fallback-аас-каталогт-хүрэх) | Web intro config and static fallback | §5.1, §8, §10 | C4-02 | Existing ADR-006 | Partial; test planned |
| [NFR-01](../requirements/srs-v1.0.md#nfr-01--хувийн-өгөгдлийг-тусгаарлах) | JWT, RBAC, ownership, RLS defense-in-depth | §3, §5, §6, §8, §10 | C4-01…03, C4-D01…03 | 003, 005, 007 | Partial inspection |
| [NFR-02](../requirements/srs-v1.0.md#nfr-02--хөдөлгөөн-багасгах-тохиргоо) | Reduced-motion and static Web path | §5.1, §8, §10 | C4-02 | Existing ADR-006 | Implemented; test planned |
| [NFR-03](../requirements/srs-v1.0.md#nfr-03--deploy-оос-өмнөх-тестийн-хаалт) | Local DB integration and negative CI gate | §7, §10, §11 | C4-02 | Existing ADR-010/011 | Gap; planned W9 |
| [NFR-04](../requirements/srs-v1.0.md#nfr-04--каталогийн-хуудсын-ачааллын-хугацаа) | SSR/Web, Fastify API and indexed data path | §4, §5, §10 | C4-02, C4-03 | 003, 005, 007 | Defined; not measured |
| [NFR-05](../requirements/srs-v1.0.md#nfr-05--inquiry-retry-давхардал-үүсгэхгүй-байх) | Inquiry service idempotency boundary | §5.2, §6.1, §10, §11 | C4-03, C4-D01 | 005, 007 | Planned; not implemented |

## Coverage summary

- Requirement rows: **20 / 20**.
- Functional building-block coverage: **15/15 = 100%**; required ≥80% = 12/15.
- Orphan FR: **0**. NFR-03 ба NFR-05 implementation gap-ийг W5-д үргэлжлүүлнэ.
- Static views: C4-01, C4-02, C4-03.
- Runtime views: C4-D01, C4-D02, C4-D03.
- Main MADRs: ADR-003 (Tech Stack), ADR-005 (Persistence), M4-IF-01 (Interface). ADR-007 нь supporting decision.
- `implemented` нь code path байгааг, `verified` нь ажиллуулсан нотолгоог илэрхийлнэ; энэ хүснэгт шинэ requirement-ийг verified гэж зарлаагүй.

