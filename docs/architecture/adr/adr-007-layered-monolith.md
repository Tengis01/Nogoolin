# ADR-007 — Layered Monolith-ийг microservices-ээс сонгох

- **Status:** Accepted
- **Date:** 2026-07; M4 expanded 2026-09-22
- **Decision owner:** Тэнгис
- **Related requirements:** FR-01…15, NFR-01…05
- **Related views:** C4-02, C4-03, C4-D01…D03

## Context

Nogoolin нь нэг хөгжүүлэгчтэй, нэг MVP хугацаатай. Inquiry, wishlist, admin, catalog domain-ууд тусдаа хариуцлагатай боловч одоогийн scale-д service бүрийг тусдаа deploy, network, monitoring, data consistency-тэй болгох хэрэгцээ байхгүй.

## Considered options

| Сонголт | Давуу тал | Сул тал |
|---|---|---|
| Layered monolith | Нэг deploy, нэг test boundary, бага ажиллагаа; code responsibility тодорхой | Давхаргын дүрэм сахихгүй бол coupling өснө |
| Microservices | Independent deploy/scale | Network failure, observability, contract/version, data consistency ачаалал хэт өндөр |
| Unlayered monolith | Эхлэхэд хурдан | Route/business/query холилдож test ба өөрчлөлт хүндрэнэ |

## Decision

Нэг Fastify deployable дотор Controller → Service → Repository гэсэн хатуу гурван давхаргыг хэрэглэнэ. Controllers HTTP concern, services business rule, repositories data access-ийг дангаар хариуцна. Shared Zod schema contract boundary болно.

## Consequences

- Нэг backend web/admin/mobile-г үйлчилж, deployment ба debugging энгийн байна.
- Repository abstraction нь Supabase-ээс шилжих боломжийг хадгална.
- Code review болон test нь controller дахь business logic, service дахь direct DB query-г хориглоно.
- Scale бодитоор шаардах хүртэл service boundary-г network boundary болгохгүй.

