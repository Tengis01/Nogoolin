# M4-IF-01 — REST interface ба shared validation contract

- **Status:** Accepted — existing implementation documented
- **Date:** 2026-09-28
- **Decision owner:** Тэнгис
- **Category:** Interface; MADR course record
- **Requirements:** FR-01…14, NFR-01, NFR-03
- **Views:** C4-02, C4-03, C4-D01…03

## Context

Web, admin, mobile нэг API ашиглана. Field, HTTP status болон auth boundary зөрвөл client зөв request илгээсэн ч өөр орчинд буруу үр дүн авна. W1-ийн [P2 schema/producer нийцэл, P3 local/pipeline ялгаа](../../ICSI438/sem1/wiki/02_audience_persona.md)-г шинэ төсөлд contract drift-ийн эрсдэлтэй холбов. W1 vector dimension нь Nogoolin-ийн өгөгдлийн талбар биш.

## Decision Drivers

Client бүрт ойлгомжтой HTTP interface, reusable TypeScript schema, testable auth/status boundary, нэг хөгжүүлэгчид бага tooling хэрэгтэй.

## Considered Options

1. Versioned REST JSON + shared Zod schema.
2. GraphQL schema/server нэмж client query composition хийх.
3. Client бүр тусдаа request/validation model хадгалах.

## Decision

Одоогийн `/api/v1/` REST JSON interface болон shared Zod package-г баримтжуулна. Inquiry POST `201`, invalid input `400`, guest auth scope `401`, non-admin `403`, unknown product `404`, rate limit `429` байна. Wishlist `/cart` нэртэй боловч checkout биш. HTTP API нь runtime interface; Zod package нь library тул C4 Container болгон зурахгүй.

## Consequences

- Web/API contract нэг schema-тай, алдааны төлөв тодорхой болно.
- Schema шинэчлэхэд consumer bundler ба test-ийг хамт шалгана.
- Mobile одоогоор зарим type-only import хэрэглэж байгаа; runtime validation parity-г бүрэн болсон гэж зарлахгүй.
- Legacy OpenAPI-г W5-д одоогийн inquiry/cart contract-тай нийцүүлэх шаардлагатай.

## Confirmation

Одоогийн controllers, shared schemas, web API client-ийг статик байдлаар тулгав. Энэ record шинэ product decision, шинэ endpoint эсвэл runtime test үүсгэхгүй.
