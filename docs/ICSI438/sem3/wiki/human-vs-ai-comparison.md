# Use–Verify–Cite: AI candidate ба эхээр шалгасан засвар

**Nogoolin · ICSI438 M3 · Тэнгис · 2026-09-22**

Энэ хүснэгтийн AI candidate нь requirement drafting-ийн эхний санал. Засварыг Scope Charter, Phase 0, одоогийн код болон хэмжигдэх шалгууртай тулгаж хийсэн. AI output-ыг дангаар нь specification гэж үзээгүй.

| № | AI candidate | Илэрсэн зөрүү | Эхээр шалгасан засвар | Cite |
|---:|---|---|---|---|
| 1 | “The system should let users easily send product inquiries.” | `should`, “easily” хоёр нь хэмжигдэхгүй; guest/customer, input, output, status байхгүй. | **FR-01:** valid нэр, утас, зурваст яг нэг inquiry үүсгэж `201`, ID, `status=new`, guest-д `customer_id=null` буцаана. | inquiry controller, inquiry schema, FR-INQ-001…003 |
| 2 | “The wishlist may be available to both guests and registered users and should remember products.” | Одоогийн auth boundary-тай зөрсөн; wishlist-ийг checkout-той андуурах эрсдэлтэй; duplicate boundary байхгүй. | **FR-10–14:** guest redirect/401; зөвхөн customer-ийн жагсаалт; published product; unique user-product pair; idempotent remove. | `wishlist/page.tsx`, `cart.controller.ts`, `cart.repository.ts`, migration 0007 |
| 3 | “The app shall always display an impressive 3D hero and load quickly.” | Asset байхгүй нөхцөл, WebGL, reduced motion-ийг орхисон; “impressive”, “quickly” шалгах боломжгүй; хоёр чанарыг нэг өгүүлбэрт хольсон. | **FR-15:** missing asset/WebGL үед static hero + `/products`; **NFR-02:** reduced motion үед CTA ≤1 s; **NFR-04:** 10 run-ийн 9-д каталог ≤2.0 s. | WF-INTRO-03/06/07, `hero-intro.tsx`, `static-hero.tsx`, Akamai report |

## Use–Verify–Cite протокол

1. **Use:** AI-г эхний candidate болон эрсдэлийн асуулт гаргахад ашиглав.
2. **Verify:** Requirement бүрийг repository-ийн schema, controller, service, UI болон Phase 0 эхтэй тулгав.
3. **Cite:** Final шаардлагын Source болон traceability мөрд шалгасан файл, баримт, гаднын эхийг бичив.

## Дүгнэлт

AI candidate нь хурдан эхлэл өгсөн боловч гурван тохиолдолд хэмжигдэх босго, системийн хил, одоогийн auth/asset нөхцөлийг алдсан. Source-оор шалгасны дараа өгүүлбэрүүд pass/fail нөхцөлтэй болсон. Энэ хүснэгт нь AI өөрийгөө зөв гэж баталсан нотолгоо биш; хүлээлгэн өгөхийн өмнөх эцсийн утгын хяналтыг Тэнгис хийнэ.
