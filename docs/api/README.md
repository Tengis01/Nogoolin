# API documentation

Одоогийн contract: [Phase 0 OpenAPI](../phase-0/06-api-spec.yaml). Давхар spec үүсгээгүй.

W5-д `/cart`, `/inquiries/mine`, inquiry `customer_id`, admin filter-ийг [бодит controller](../../backend/api/src/controllers/inquiry.controller.ts), [cart controller](../../backend/api/src/controllers/cart.controller.ts), shared schemas-тай нийцүүлнэ. [SDD §5](../architecture/sdd-template.md#5-гадаад-интерфэйс-ба-contract-gap)-д зөрүү бий. Энэ нь төлөвлөгөө; contract-ийг шинэчилсэн гэж үзэхгүй.
