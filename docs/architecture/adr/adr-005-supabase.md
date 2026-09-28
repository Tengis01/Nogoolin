# ADR-005 — Supabase-г data/auth/storage platform болгон сонгох

- **Status:** Accepted
- **Date:** 2026-07 (Phase 0); M4 expanded 2026-09-28
- **Decision owner:** Тэнгис
- **Related requirements:** FR-01…14, NFR-01, NFR-05
- **Related views:** C4-01, C4-02, C4-03, C4-D01…D03

## Context

Nogoolin-д relational product/inquiry/cart өгөгдөл, user authentication, media storage болон row-level authorization хэрэгтэй. Solo developer тусдаа database, auth server, object storage ажиллуулахад operational ачаалал өндөр.

## Decision Drivers

Нэг хөгжүүлэгчийн ажиллагаа, шалгаж болох interface, өгөгдөл хамгаалалт болон requirements coverage.

## Considered options

| Сонголт | Давуу тал | Сул тал |
|---|---|---|
| Supabase | PostgreSQL, Auth, Storage, RLS нэг platform; local CLI stack | Platform-specific client/API; cloud dependency |
| Firebase | Managed auth/data, mobile ecosystem | Relational query болон SQL/RLS загварт тохиромж бага |
| Self-hosted PostgreSQL + auth/storage | Бүрэн хяналт | Setup, patch, backup, auth, storage ажиллагаа их |

## Decision

Supabase PostgreSQL, Auth, Storage-г ашиглана. Local development ба security test-ийг Supabase CLI stack дээр хийнэ; cloud project Phase 6 хүртэл deferred. API repository interface нь Supabase-specific query-г service-ээс тусгаарлана.

## Consequences

- NFR-01-д JWT, ownership болон RLS-ийг хамтад нь хэрэгжүүлэх боломжтой.
- Migration append-only байх ба local reset дээр дахин ажиллах ёстой.
- `service_role` key зөвхөн server environment-д байна.
- Provider солиход repository implementation болон auth integration өөрчлөгдөнө; business service-ийг аль болох хэвээр үлдээнэ.


## Persona pain point ба confirmation

[W1 persona](../../ICSI438/sem1/wiki/02_audience_persona.md)-ийн **P1: session алдагдах; P-NG-01, мөн P2: schema/producer contract нийцэл** хэрэгцээтэй холбов. Энэ нь RAG кейсээс Nogoolin руу шилжүүлсэн тайлбарласан холбоо; уг алдаа Nogoolin-д болсон гэж үзээгүй. [W2 pivot](../../ICSI438/sem2/wiki/persona-and-pivot.md) шилжилтийг тайлбарлана.

Confirmation: decision log болон одоогийн code structure-тай static check хийсэн; шинэ runtime test энэ ажлаар ажиллуулаагүй.
