# ADR-003 — Fastify-г API framework болгон сонгох

- **Status:** Accepted
- **Date:** 2026-06; M4 expanded 2026-09-28
- **Decision owner:** Тэнгис
- **Related requirements:** FR-01…14, NFR-03, NFR-04
- **Related views:** C4-02, C4-03, C4-D01…D03

## Context

Nogoolin-д web, admin, mobile гурвыг үйлчлэх TypeScript REST API хэрэгтэй. Solo developer учраас framework нь бага boilerplate-тай, schema validation, security hook, plugin encapsulation болон integration test-д тохиромжтой байх шаардлагатай.

## Decision Drivers

Нэг хөгжүүлэгчийн ажиллагаа, шалгаж болох interface, өгөгдөл хамгаалалт болон requirements coverage.

## Considered options

| Сонголт | Давуу тал | Сул тал |
|---|---|---|
| Fastify | TypeScript support, plugin/hook model, хурдан request path | Express-ээс жижиг ecosystem; plugin lifecycle сурах шаардлагатай |
| Express | Өргөн ecosystem, олон жишээ | Validation/security composition-г гараар их зохион байгуулна |
| Next.js route handlers only | Web-тэй нэг deploy | Mobile/admin API хил, repository/service structure бүдгэрнэ |

## Decision

Fastify + TypeScript-ийг port 3001 дээрх `/api/v1/` REST API framework болгоно. Helmet, CORS, rate-limit, auth, validation-ийг plugin/hook-д; HTTP mapping-ийг controller-д; business rule-ийг service-д; data access-ийг repository-д байрлуулна.

## Consequences

- Web, admin, mobile нэг тогтвортой API contract ашиглана.
- Security болон validation route handler бүрт давтагдахгүй.
- Plugin order, encapsulation болон error mapping-ийг test-ээр хамгаалах шаардлагатай.
- Phase 0 дахь Express нэршил хуучирсан; шинэ architecture view Fastify-г ашиглана.


## Persona pain point ба confirmation

[W1 persona](../../ICSI438/sem1/wiki/02_audience_persona.md)-ийн **P3: local ба pipeline-ийн ялгааг оношлох; P-NG-03** хэрэгцээтэй холбов. Энэ нь RAG кейсээс Nogoolin руу шилжүүлсэн тайлбарласан холбоо; уг алдаа Nogoolin-д болсон гэж үзээгүй. [W2 pivot](../../ICSI438/sem2/wiki/persona-and-pivot.md) шилжилтийг тайлбарлана.

Confirmation: decision log болон одоогийн code structure-тай static check хийсэн; шинэ runtime test энэ ажлаар ажиллуулаагүй.
