# UE4-ADR-01 — Magic Container зураглалыг засах

**Status:** Accepted for exercise · **Date:** 2026-09-28 · **Owner:** Тэнгис

## Context

Before зураг нэг “Magic Container”-д бүх frontend/backend хариуцлагыг багтаасан. Хөгжүүлэгч алдаа гарвал аль deployable unit-ийг шалгахаа мэдэхгүй. Энэ нь W1-ийн [P3 local/pipeline ялгааг оношлох](../../sem1/wiki/02_audience_persona.md) хэрэгцээтэй холбоотой.

## Decision Drivers

Зураг унших эхлэл, deployable boundary, name/technology/responsibility болон data flow-г тодорхой болгох. Bhatti Ch.6 х.116-ын label зарчим, Chinchilla Ch.2 х.22–23-ын architecture reference зорилгыг хэрэглэв.

## Considered Options

1. Magic box-д урт тайлбар нэмэх.
2. Web/Admin, Mobile, REST API-ийг тусдаа container болгон задалж хөрш platform services-ийг ялгах.

## Decision

Хоёрдугаар сонголтыг сонгов. After зураг нь гурван Nogoolin application container-тай; Supabase platform нь Auth, PostgreSQL, Storage хөрш services-ээр харагдана. Shared Zod schema-г library гэж тайлбарлаж, deployable container болгож дүрслэхгүй. Actor болон arrow бүр утгатай label-тай байна.

## Consequences

Уншигч Web → API → Data урсгал болон session замыг ялгана. Mobile-ийн дутуу capability-г ил тод харуулна. Зураг засах нь product кодын refactoring эсвэл runtime validation биш; deployment boundary-г өөрчлөөгүй.

## Confirmation

Before/After Mermaid эх, SVG болон §5 building block хүснэгтийг тулгав. Nogoolin applications **3 ≤ 8**. FR mapping **15/15** бөгөөд NFR-03/05 gap-ийг W5-д үлдээв.
