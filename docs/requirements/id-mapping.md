# Хуучин → шинэ ID mapping

**Doc ID:** REQ-03 · **Хувилбар:** v2.0 draft · **Огноо:** 2026-10-18 · **Owner:** Тэнгис

[SRS v2](srs-v2.md)-ийн хавсралт. Хуучин ID бүр шинэ ID-тай. Нэг ч ID алга болоогүй. Хасагдсан ID-д шалтгааныг бичсэн.

| Эх | Тоо | Баримт |
|---|---|---|
| Phase0 | 177 (118 FR + 59 NFR) | [02-requirements](../phase-0/02-requirements.md) |
| `v1.0:` | 20 (FR-01…15, NFR-01…05) | [SRS v1.0](srs-v1.0.md) |
| `M2:` | 5 (FR-01, FR-02, NFR-01…03) | [M2](requirements.md) |

Change баганын утгууд:
- **kept** — утга хэвээр;
- **reworded** — утга хэвээр, найруулга өөрчилсөн;
- **merged into X** — X шаардлагад нэгтгэсэн;
- **split into X, Y** — хэд хэдэн шаардлагад хуваасан;
- **moved to** — өөр area руу шилжүүлсэн;
- **dropped** — шаардлагаас хассан, шалтгааныг заасан.

| Хуучин ID | Эх | Шинэ ID | Өөрчлөлт |
|---|---|---|---|
| FR-3D-001 | Phase0 | FR-INTRO-110 | merged into FR-INTRO-110 (with FR-3D-008); R3F tech moved to arc42 |
| FR-3D-002 | Phase0 | FR-INTRO-120 | reworded (C: deity right-placed via setViewOffset, static) |
| FR-3D-003 | Phase0 | FR-INTRO-130, FR-INTRO-140, FR-INTRO-150 | split into 130 (start pose), 140 (4-step path), 150 (circular motion profile) |
| FR-3D-004 | Phase0 | FR-INTRO-160 | reworded («after animation completes» → after step 4) |
| FR-3D-005 | Phase0 | FR-INTRO-210 | kept |
| FR-3D-006 | Phase0 | FR-INTRO-320, FR-INTRO-350, NFR-COMP-500 | split: WebGL fallback / measurable low-power threshold / compatibility |
| FR-3D-007 | Phase0 | FR-INTRO-230 | kept, made measurable (≤ 1 s) |
| FR-3D-008 | Phase0 | FR-INTRO-110 | merged into FR-INTRO-110; «minimal version» dropped (ambiguous); Should→Must |
| FR-3D-009 | Phase0 | NFR-PERF-310 | moved to NFR (resource budget) |
| FR-3D-010 | Phase0 | FR-MOB-310 | reworded (C-consistent; runtime choice G6) |
| FR-3D-011 | Phase0 | FR-MOB-320 | kept + reduce-motion criterion |
| FR-ADM-001 | Phase0 | FR-ADM-100 | merged into FR-ADM-100/110 |
| FR-ADM-002 | Phase0 | FR-ADM-110 | reworded (+`next` param) |
| FR-ADM-003 | Phase0 | FR-ADM-200 | reworded (+attention link) |
| FR-ADM-004 | Phase0 | FR-ADM-310, FR-ADM-320, FR-ADM-330, FR-ADM-340 | split into FR-ADM-310…340 |
| FR-ADM-005 | Phase0 | FR-ADM-400 | kept |
| FR-ADM-006 | Phase0 | FR-INQ-300 | merged into FR-INQ-300 (admin inbox UI) |
| FR-ADM-007 | Phase0 | FR-ADM-500 | kept; Won't (PH8) |
| FR-ADM-008 | Phase0 | FR-ADM-700, FR-ADM-710, FR-ADM-720, FR-ADM-730 | split into FR-ADM-710…730 (+guide F-02) |
| FR-AUD-001 | Phase0 | FR-AUD-110 | reworded |
| FR-AUD-002 | Phase0 | FR-AUD-120 | kept |
| FR-AUD-003 | Phase0 | FR-AUD-130 | reworded (service_role хязгаар) |
| FR-AUD-004 | Phase0 | FR-AUD-140 | reworded |
| FR-AUD-005 | Phase0 | FR-AUD-150 | reworded; PH8 |
| FR-AUTH-001 | Phase0 | FR-AUTH-110 | reworded (admin + customer) |
| FR-AUTH-002 | Phase0 | FR-AUTH-120 | reworded (тохируулаагүй төлөв нэмсэн) |
| FR-AUTH-003 | Phase0 | FR-AUTH-130 | reworded; S → Could |
| FR-AUTH-004 | Phase0 | FR-AUTH-140 | kept |
| FR-AUTH-005 | Phase0 | FR-AUTH-210 | reworded |
| FR-AUTH-006 | Phase0 | FR-AUTH-220 | merged into FR-AUTH-220 (NFR-SEC-013 rotation-тэй) |
| FR-AUTH-007 | Phase0 | FR-AUTH-160 | reworded; S → Could, PH8 |
| FR-AUTH-008 | Phase0 | FR-AUTH-310 | reworded |
| FR-AUTH-009 | Phase0 | FR-AUTH-320 | reworded (401 нэмсэн); бүтэц нь NFR-SEC-310 |
| FR-AUTH-010 | Phase0 | FR-AUTH-340 | reworded (email signup ч хамаарна) |
| FR-AUTH-011 | Phase0 | FR-AUTH-230 | reworded (бүх хэрэглэгч) |
| FR-CAT-001 | Phase0 | FR-CAT-110 | reworded (optional slug/description, error codes) |
| FR-CAT-002 | Phase0 | FR-CAT-120 | reworded |
| FR-CAT-003 | Phase0 | FR-CAT-130, FR-CAT-131 | split into FR-CAT-130, FR-CAT-131 |
| FR-CAT-004 | Phase0 | FR-CAT-140 | reworded (409 code) |
| FR-CAT-005 | Phase0 | FR-CAT-150 | reworded (regex, suffix) |
| FR-CAT-006 | Phase0 | FR-CAT-160 | kept |
| FR-CAT-007 | Phase0 | FR-CAT-210 | reworded (no auth required) |
| FR-INQ-001 | Phase0 | FR-INQ-110 | merged into FR-INQ-110 |
| FR-INQ-002 | Phase0 | FR-INQ-120 | reworded (message сонголтот, email байхгүй) |
| FR-INQ-003 | Phase0 | FR-INQ-110 | merged into FR-INQ-110 |
| FR-INQ-004 | Phase0 | FR-INQ-310 | reworded |
| FR-INQ-005 | Phase0 | FR-INQ-330 | reworded (шилжилтийн дарааллыг UI санал болгоно) |
| FR-INQ-006 | Phase0 | FR-INQ-320 | reworded (product/date нэмсэн) |
| FR-INQ-007 | Phase0 | FR-INQ-160 | merged into FR-INQ-160 |
| FR-MEDIA-001 | Phase0 | FR-MEDIA-110 | kept |
| FR-MEDIA-002 | Phase0 | FR-MEDIA-120 | reworded (+MIME match, per-file reject) |
| FR-MEDIA-003 | Phase0 | FR-MEDIA-120, FR-MEDIA-121 | split into server (MEDIA-120), client (MEDIA-121) |
| FR-MEDIA-004 | Phase0 | FR-MEDIA-130 | kept |
| FR-MEDIA-005 | Phase0 | FR-MEDIA-140 | kept |
| FR-MEDIA-006 | Phase0 | FR-MEDIA-150 | kept |
| FR-MEDIA-007 | Phase0 | FR-MEDIA-200, FR-MEDIA-210 | reworded; Won't (D-07) |
| FR-MEDIA-008 | Phase0 | FR-MEDIA-220 | reworded (10 MB → 5 MB, conflict resolved) |
| FR-MEDIA-009 | Phase0 | FR-MEDIA-160 | reworded (path pattern) |
| FR-MEDIA-010 | Phase0 | — | dropped: documentation, not a system requirement → admin onboarding guide (Document Register, PH8, with D-07) |
| FR-MEDIA-011 | Phase0 | FR-MEDIA-220, FR-MEDIA-230 | split into FR-MEDIA-220 (size), FR-MEDIA-230 (compression, Analysis) |
| FR-MOB-001 | Phase0 | NFR-COMP-310, NFR-COMP-320 | moved to NFR-COMP (merged with NFR-COM-003/004) |
| FR-MOB-002 | Phase0 | FR-MOB-110 | kept |
| FR-MOB-003 | Phase0 | FR-MOB-120, FR-MOB-130 | split (detail / 360° viewer) |
| FR-MOB-004 | Phase0 | FR-MOB-400 | kept (Won't this release, G6) |
| FR-MOB-005 | Phase0 | FR-MOB-510 | kept |
| FR-MOB-006 | Phase0 | FR-MOB-520 | reworded (measurable: message + retry) |
| FR-MOB-007 | Phase0 | FR-MOB-530 | kept (Could) |
| FR-MOB-008 | Phase0 | NFR-MAINT-610 | moved to NFR-MAINT (design constraint, not FR) |
| FR-MOB-009 | Phase0 | NFR-MAINT-620 | moved to NFR-MAINT (design constraint, not FR) |
| FR-MOB-010 | Phase0 | FR-MOB-130 | merged into FR-MOB-130; deferred D-07 |
| FR-ORD-001 | Phase0 | FR-ORD-110 | kept; Won't |
| FR-ORD-002 | Phase0 | FR-ORD-120 | kept; Won't |
| FR-ORD-003 | Phase0 | FR-ORD-130 | reworded (+total rule); Won't |
| FR-ORD-004 | Phase0 | FR-ORD-140 | kept; Won't |
| FR-ORD-005 | Phase0 | FR-ORD-210 | reworded (+audit); Won't |
| FR-ORD-006 | Phase0 | FR-ORD-220 | kept; Won't |
| FR-ORD-007 | Phase0 | FR-ORD-300 | kept; Won't |
| FR-ORD-008 | Phase0 | FR-SET-210 | merged into FR-SET-210 |
| FR-PROD-001 | Phase0 | FR-PROD-110, FR-PROD-210 | split into FR-PROD-110 (fields), FR-PROD-210 (create) |
| FR-PROD-002 | Phase0 | FR-PROD-220, FR-ADM-330 | split into API (PROD-220), UI (ADM-330) |
| FR-PROD-003 | Phase0 | FR-PROD-130 | kept (+default draft) |
| FR-PROD-004 | Phase0 | FR-PROD-230, FR-PROD-310 | split into FR-PROD-230, FR-PROD-310 |
| FR-PROD-005 | Phase0 | FR-PROD-140 | reworded (+labels) |
| FR-PROD-006 | Phase0 | FR-PROD-240, FR-PUB-310 | split into API (PROD-240), home display (PUB-310) |
| FR-PROD-007 | Phase0 | FR-PROD-150 | kept |
| FR-PROD-008 | Phase0 | FR-PROD-120 | kept |
| FR-PROD-009 | Phase0 | FR-PROD-160 | kept |
| FR-PROD-010 | Phase0 | FR-PROD-170 | reworded (+sanitize, step rendering) |
| FR-PROD-011 | Phase0 | FR-PROD-250, FR-PROD-260 | split into FR-PROD-250 (archive), FR-PROD-260 (hard delete) |
| FR-PROD-012 | Phase0 | FR-PROD-320 | reworded (status filter admin-only) |
| FR-PROD-013 | Phase0 | FR-PROD-330 | reworded (limits) |
| FR-PUB-001 | Phase0 | FR-PUB-110 | kept |
| FR-PUB-002 | Phase0 | FR-PUB-120 | merged into FR-PUB-120 (with PUB-008) |
| FR-PUB-003 | Phase0 | FR-PUB-210 | merged into FR-PUB-210 (with PUB-007) |
| FR-PUB-004 | Phase0 | FR-PUB-220, FR-PUB-240 | split into content (PUB-220), 360° viewer (PUB-240, Won't) |
| FR-PUB-005 | Phase0 | FR-PUB-130 | reworded (single-row rule) |
| FR-PUB-006 | Phase0 | FR-PUB-310 | reworded (4–8 cards, empty state) |
| FR-PUB-007 | Phase0 | FR-PUB-210 | merged into FR-PUB-210 |
| FR-PUB-008 | Phase0 | FR-PUB-120 | reworded: `/categories/[slug]` → `/products?category={slug}` (code) |
| FR-PUB-009 | Phase0 | FR-PUB-410 | kept |
| FR-PUB-010 | Phase0 | FR-PUB-420 | merged into FR-PUB-420 (with SET-005) |
| FR-PUB-011 | Phase0 | FR-PUB-240 | merged into FR-PUB-240; Won't (D-07) |
| FR-PUB-012 | Phase0 | FR-PUB-500 | kept; Won't (PH8) |
| FR-PUB-013 | Phase0 | FR-PROD-180 | moved to FR-PROD-180 (data model) |
| FR-PUB-014 | Phase0 | FR-PUB-140 | kept |
| FR-PUB-015 | Phase0 | FR-ADM-330 | merged into FR-ADM-330 (edit page incl. search_tags) |
| FR-SET-001 | Phase0 | FR-SET-110 | kept |
| FR-SET-002 | Phase0 | FR-SET-120 | kept |
| FR-SET-003 | Phase0 | FR-SET-130 | kept |
| FR-SET-004 | Phase0 | FR-SET-210 | merged into FR-SET-210 (with ORD-008) |
| FR-SET-005 | Phase0 | FR-PUB-420 | merged into FR-PUB-420 |
| FR-SET-006 | Phase0 | FR-SET-140 | kept; Won't (PH8) |
| FR-SET-007 | Phase0 | FR-AUD-150 | merged into FR-AUD-150 (with FR-AUD-005) |
| FR-USER-001 | Phase0 | FR-USER-110 | kept |
| FR-USER-002 | Phase0 | FR-USER-120 | reworded |
| FR-USER-003 | Phase0 | FR-USER-210 | reworded; S → Could, PH8 |
| FR-USER-004 | Phase0 | FR-USER-220, FR-USER-221 | split into FR-USER-220, FR-USER-221 |
| FR-USER-005 | Phase0 | FR-USER-130 | reworded; бичих хэсэг нь NFR-SEC-350 |
| M2:FR-01 | M2 | FR-INQ-110, FR-INQ-130, FR-INQ-140 | split into FR-INQ-110, FR-INQ-130, FR-INQ-140 |
| M2:FR-02 | M2 | FR-WISH-110…150 | split into FR-WISH-110, FR-WISH-120, FR-WISH-130, FR-WISH-140, FR-WISH-150 |
| M2:NFR-01 | M2 | NFR-SEC-320 | merged into NFR-SEC-320 |
| M2:NFR-02 | M2 | FR-INTRO-310, FR-INTRO-320, FR-INTRO-230, FR-INTRO-210 | split (a/b/c conditions + skip ≤ 1 s) |
| M2:NFR-03 | M2 | NFR-MAINT-320 | merged into NFR-MAINT-320 |
| NFR-ACC-001 | Phase0 | NFR-USE-110 | kept (S→M) |
| NFR-ACC-002 | Phase0 | NFR-USE-120 | kept (S→M) |
| NFR-ACC-003 | Phase0 | NFR-USE-130 | kept (S→M, thresholds explicit) |
| NFR-ACC-004 | Phase0 | FR-INTRO-230, NFR-USE-170 | split (intro / site-wide) |
| NFR-ACC-005 | Phase0 | NFR-USE-150 | kept |
| NFR-COM-001 | Phase0 | NFR-COMP-100 | kept |
| NFR-COM-002 | Phase0 | NFR-COMP-200 | kept |
| NFR-COM-003 | Phase0 | NFR-COMP-310 | kept |
| NFR-COM-004 | Phase0 | NFR-COMP-320 | kept |
| NFR-COM-005 | Phase0 | NFR-COMP-410 | reworded (204 excluded) |
| NFR-COM-006 | Phase0 | NFR-COMP-420 | kept |
| NFR-MAIN-001 | Phase0 | NFR-MAINT-110 | kept |
| NFR-MAIN-002 | Phase0 | NFR-MAINT-120 | kept (+ `tsc` criterion) |
| NFR-MAIN-003 | Phase0 | NFR-MAINT-130 | kept |
| NFR-MAIN-004 | Phase0 | NFR-MAINT-210 | kept (M→Should) |
| NFR-MAIN-005 | Phase0 | NFR-MAINT-310, NFR-MAINT-320 | split (workflows exist / real test gate) |
| NFR-MAIN-006 | Phase0 | NFR-PORT-110 | moved to PORT |
| NFR-MAIN-007 | Phase0 | NFR-MAINT-220 | kept (path per ADR-011) |
| NFR-MAIN-008 | Phase0 | NFR-MAINT-230, NFR-PORT-130 | split (env.example completeness / env-only config) |
| NFR-PERF-001 | Phase0 | NFR-PERF-210 | merged into NFR-PERF-210; threshold 80 → 90 (G3, F-07) |
| NFR-PERF-002 | Phase0 | NFR-PERF-220 | reworded («load within 2 s» → lab LCP ≤ 2.5 s) |
| NFR-PERF-003 | Phase0 | NFR-PERF-210 | merged into NFR-PERF-210; threshold 85 → 90 (G3, F-07) |
| NFR-PERF-004 | Phase0 | NFR-PERF-510 | reworded («normal load» → 10 concurrent, 60 s, p95) |
| NFR-PERF-005 | Phase0 | NFR-PERF-310, FR-INTRO-340 | split (size budget / loading state) |
| NFR-PERF-006 | Phase0 | NFR-PERF-440 | kept (+AVIF) |
| NFR-PERF-007 | Phase0 | NFR-PERF-410, NFR-PERF-420 | split to resolve F-07 (above-fold priority / below-fold lazy) |
| NFR-PERF-008 | Phase0 | NFR-PERF-520 | reworded (concrete header values) |
| NFR-REL-001 | Phase0 | NFR-REL-110 | reworded (хэмжих аргатай); M → Should |
| NFR-REL-002 | Phase0 | NFR-REL-120 | reworded; M → Should |
| NFR-REL-003 | Phase0 | NFR-REL-210 | reworded |
| NFR-REL-004 | Phase0 | NFR-REL-220 | reworded |
| NFR-REL-005 | Phase0 | NFR-REL-230 | reworded; Won't (this release) |
| NFR-REL-006 | Phase0 | NFR-REL-130 | reworded |
| NFR-SCA-001 | Phase0 | NFR-PERF-610 | moved to PERF (capacity) |
| NFR-SCA-002 | Phase0 | NFR-MAINT-140 | moved to MAINT; made verifiable (3NF) |
| NFR-SCA-003 | Phase0 | NFR-MAINT-150 | moved to MAINT; made verifiable |
| NFR-SCA-004 | Phase0 | NFR-PERF-450 | moved to PERF |
| NFR-SEC-001 | Phase0 | NFR-SEC-110 | reworded |
| NFR-SEC-002 | Phase0 | NFR-SEC-251, NFR-SEC-252, FR-INQ-160 | split into NFR-SEC-251, NFR-SEC-252, FR-INQ-160 |
| NFR-SEC-003 | Phase0 | NFR-SEC-210 | reworded (query ч хамаарна) |
| NFR-SEC-004 | Phase0 | NFR-SEC-220 | reworded |
| NFR-SEC-005 | Phase0 | NFR-SEC-410 | reworded |
| NFR-SEC-006 | Phase0 | NFR-SEC-130 | reworded |
| NFR-SEC-007 | Phase0 | NFR-SEC-140 | reworded |
| NFR-SEC-008 | Phase0 | NFR-SEC-340 | reworded |
| NFR-SEC-009 | Phase0 | NFR-SEC-310 | reworded |
| NFR-SEC-010 | Phase0 | NFR-SEC-320 | merged into NFR-SEC-320 (order хэсэг нь ORD/PH8) |
| NFR-SEC-011 | Phase0 | NFR-SEC-230 | kept |
| NFR-SEC-012 | Phase0 | NFR-SEC-120 | reworded; M → Should |
| NFR-SEC-013 | Phase0 | NFR-SEC-330, FR-AUTH-220 | split into NFR-SEC-330, FR-AUTH-220 |
| NFR-SEO-001 | Phase0 | NFR-SEO-110 | kept |
| NFR-SEO-002 | Phase0 | NFR-SEO-120 | reworded (+fallback) |
| NFR-SEO-003 | Phase0 | NFR-SEO-130 | reworded (og:image only when images exist) |
| NFR-SEO-004 | Phase0 | NFR-SEO-140 | reworded (canonical per URL type) |
| NFR-SEO-005 | Phase0 | NFR-SEO-210 | reworded (category URL form, fallback) |
| NFR-SEO-006 | Phase0 | NFR-SEO-220 | reworded (+/login, /signup) |
| NFR-SEO-007 | Phase0 | NFR-SEO-310 | reworded (testable HTML check) |
| NFR-SEO-008 | Phase0 | NFR-SEO-320 | kept |
| NFR-SEO-009 | Phase0 | NFR-SEO-330 | reworded (fallback + ≥90% content target) |
| v1.0:FR-01 | SRS v1.0 | FR-INQ-110 | merged into FR-INQ-110 |
| v1.0:FR-02 | SRS v1.0 | FR-INQ-130 | kept |
| v1.0:FR-03 | SRS v1.0 | FR-INQ-140 | reworded (client/server дүрмийг салгасан) |
| v1.0:FR-04 | SRS v1.0 | FR-INQ-150 | reworded (busy төлөв нэмсэн) |
| v1.0:FR-05 | SRS v1.0 | FR-INQ-160 | merged into FR-INQ-160 |
| v1.0:FR-06 | SRS v1.0 | FR-INQ-210 | kept |
| v1.0:FR-07 | SRS v1.0 | FR-INQ-310 | kept |
| v1.0:FR-08 | SRS v1.0 | FR-INQ-320 | kept |
| v1.0:FR-09 | SRS v1.0 | FR-INQ-330 | reworded |
| v1.0:FR-10 | SRS v1.0 | FR-WISH-110 | reworded (save товч нэмсэн) |
| v1.0:FR-11 | SRS v1.0 | FR-WISH-120 | kept |
| v1.0:FR-12 | SRS v1.0 | FR-WISH-130 | kept |
| v1.0:FR-13 | SRS v1.0 | FR-WISH-140 | kept |
| v1.0:FR-14 | SRS v1.0 | FR-WISH-150 | kept |
| v1.0:FR-15 | SRS v1.0 | FR-INTRO-310, FR-INTRO-320, FR-INTRO-330, FR-INTRO-260 | split (no GLB / no WebGL / broken asset gap / no scroll lock) |
| v1.0:NFR-01 | SRS v1.0 | NFR-SEC-320 | merged into NFR-SEC-320 |
| v1.0:NFR-02 | SRS v1.0 | FR-INTRO-230 | merged into FR-INTRO-230 |
| v1.0:NFR-03 | SRS v1.0 | NFR-MAINT-320 | kept |
| v1.0:NFR-04 | SRS v1.0 | NFR-PERF-220 | merged into NFR-PERF-220 (2.0 s 9/10 → LCP 2.5 s median; OPEN) |
| v1.0:NFR-05 | SRS v1.0 | NFR-REL-240 | reworded (web key үүсгэх нэмсэн) |
