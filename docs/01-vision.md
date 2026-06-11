# Project Vision

**Document:** `docs/01-vision.md`  
**Project:** Nogoolin — Premium Religious Product Catalog Platform  
**Version:** 1.2.0  
**Status:** Draft  
**Author:** Tengis (Solo Developer)  
**Last Updated:** June 2026

---

## Changelog

| Version | Date | Type | Description |
|---|---|---|---|
| 1.2.0 | June 2026 | MINOR | Added multi-script search (Cyrillic/Latin/English) to value proposition and MVP scope |
| 1.1.0 | June 2026 | MINOR | Added 360° product viewer to value proposition, MVP scope (web + admin + mobile); updated Non-Goals; replaced Blender assumption with Meshy AI; added visual image search to Phase 6+ roadmap |
| 1.0.0 | June 2026 | MAJOR | Initial version |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Product Vision Statement](#4-product-vision-statement)
5. [Core Value Proposition](#5-core-value-proposition)
6. [MVP Scope](#6-mvp-scope)
7. [Non-Goals](#7-non-goals)
8. [Success Metrics](#8-success-metrics)
9. [Constraints and Assumptions](#9-constraints-and-assumptions)
10. [Long-Term Product Evolution](#10-long-term-product-evolution)
11. [Project Constraints](#11-project-constraints)

---

## 1. Executive Summary

**Nogoolin** is a premium religious product catalog and future delivery platform designed specifically for the Mongolian market.

The platform enables customers to discover, learn about, and eventually order traditional religious and spiritual products online — a category that is currently served almost entirely through physical stores with no modern digital experience.

The project is designed and developed by a single developer as both a functional product and a professional portfolio project, built to production-quality standards from the ground up.

---

## 2. Problem Statement

### 2.1 Current Situation

Religious and spiritual products (statues, incense, ritual items, offerings, prayer tools, and similar items) hold significant cultural importance in Mongolian daily life. However, the current purchasing experience is fragmented and inaccessible:

- Products are sold in scattered physical stores in Ulaanbaatar with no centralized online presence
- There is no dedicated digital catalog where customers can browse, compare, or learn about these products
- Product usage instructions are rarely documented — buyers must rely on word-of-mouth or in-store guidance
- No mobile app or web experience exists that reflects the premium, spiritual nature of these products

### 2.2 The Gap

| What exists today | What is missing |
|---|---|
| Physical stores only | Online product catalog |
| No digital discovery | Search, filter, browse by category |
| No usage guidance online | Step-by-step product instructions |
| No premium brand experience | Meaningful, culturally respectful visual identity |
| No future ordering path | Delivery/ordering infrastructure |

### 2.3 Why Now

The adoption of smartphones and mobile internet in Mongolia has grown rapidly. Customers increasingly expect to discover and research products online before purchasing. Building a quality digital experience now establishes a first-mover advantage in this underserved niche.

---

## 3. Target Users

### 3.1 Primary User — The Catalog Visitor (Phase 1)

**Who they are:**  
Mongolian adults — primarily women aged 25–60 — who regularly purchase or are curious about religious/spiritual products. They may be experienced buyers or new to the space.

**What they need:**
- Browse products by category in a clean, trustworthy interface
- View high-quality product photos from multiple angles
- Read detailed product descriptions and usage instructions
- Know the price before visiting a store or placing an inquiry
- Share product links with family members

**Pain points:**
- Cannot find reliable product information online
- Do not know how to correctly use certain ritual items
- Cannot compare products without visiting multiple stores

---

### 3.2 Secondary User — The Inquiry Customer (Phase 4)

**Who they are:**  
A catalog visitor who has decided they want a product and wants to express interest or ask a question before committing to a purchase.

**What they need:**
- A simple way to submit an inquiry without requiring full account registration
- Confirmation that their inquiry was received
- A follow-up response from the business

---

### 3.3 Future User — The Order Customer (Phase 5+)

**Who they are:**  
A customer who is ready to place a full order and have it delivered.

**What they need:**
- Cart and checkout flow
- Order confirmation and status tracking
- Delivery to their address

> **Note:** This user is a future persona. Their experience is architecturally planned but not activated in MVP.

---

### 3.4 Internal User — The Admin

**Who they are:**  
The business owner or operator managing the platform.

**What they need:**
- Create, edit, and manage product listings
- Upload and manage product images
- Manage product categories
- View and respond to customer inquiries
- Toggle delivery on/off when operations are ready
- Audit what changes have been made

---

## 4. Product Vision Statement

> **For Mongolian customers who seek religious and spiritual products, Nogoolin is a premium digital catalog platform that provides a trustworthy, beautiful, and informative product browsing experience — something that does not exist in the market today.**
>
> **Unlike scattered physical stores with no digital presence, Nogoolin offers a curated, visually premium experience that respects the cultural significance of each product and provides educational guidance alongside discovery.**

---

## 5. Core Value Proposition

### For Customers

| Value | Description |
|---|---|
| **Discovery** | Browse and search religious products from anywhere, any time |
| **Education** | Understand each product through descriptions and step-by-step usage instructions |
| **Trust** | A professionally designed platform reflects the quality and seriousness of the products |
| **Premium Experience** | A respectful, culturally appropriate visual identity including a signature 3D intro |
| **360° Product Viewing** | Interact with products in 3D — rotate, zoom, and inspect from every angle before purchasing |
| **Multi-Script Search** | Find products by typing in Cyrillic Mongolian, Latin-transliterated Mongolian, or English — all returning the same results |

### For the Business (Admin)

| Value | Description |
|---|---|
| **Digital Presence** | An owned, professional online storefront — not dependent on social media |
| **Product Management** | Full CRUD control over products, images, categories, and instructions |
| **Inquiry Management** | Receive and track customer interest before delivery operations begin |
| **Scalability** | Delivery system is pre-built and can be activated when the business is ready |

---

## 6. MVP Scope

The MVP is defined as: **Phase 1 through Phase 3** of the development roadmap.

### What the MVP Includes

**Public Website (Next.js)**
- Premium 3D opening animation (Green Tara / Ногоон Дарь Эх, Three.js + React Three Fiber)
- Skip intro button, static fallback, reduced motion support
- Home page with featured products
- Product listing page (with category filter)
- Product detail page (images, price, description, usage instructions)
- **360° interactive 3D model viewer** on product detail page (Three.js OrbitControls); fallback to image gallery if no GLB available
- Category browsing
- Product search across Cyrillic Mongolian, Latin Mongolian, and English simultaneously
- Product inquiry/contact form
- SEO-optimized pages (meta titles, descriptions, Open Graph, clean slugs, sitemap)

**Admin Panel (Next.js `/admin` route)**
- Secure admin login (email/password + Google OAuth)
- Product CRUD (create, edit, publish/archive, delete)
- Category CRUD
- Product image upload (Supabase Storage)
- **3D model (GLB) upload** — generated via Meshy AI workflow, compressed via gltf-pipeline
- Usage instruction management
- Inquiry inbox and status management
- Delivery toggle setting

**Mobile App (Flutter)**
- Rive-based opening animation
- Home page
- Product listing with category filter
- Product detail page
- **360° interactive 3D model viewer** using `model_viewer_plus`; fallback to image gallery
- Product inquiry form

**Backend API (Express.js + TypeScript)**
- REST API at `/api/v1/`
- Layered architecture: Controller → Service → Repository
- Supabase PostgreSQL + Supabase Auth + Supabase Storage
- JWT authentication with role-based access (admin / customer)
- 4-layer security: Cloudflare WAF → Helmet/CORS/rate-limit → JWT/RBAC → RLS

### MVP Exclusions

Features that are **architecturally planned** but **not activated** in MVP:

- Cart and checkout
- Order placement
- Delivery staff management
- Payment integration
- Order tracking

---

## 7. Non-Goals

The following are explicitly **out of scope** and will **not** be built, now or in the near future:

| Non-Goal | Reason |
|---|---|
| Multi-vendor marketplace | This is a single-business platform |
| Real-time chat or live support | Adds complexity without proportional value at this stage |
| Payment gateway integration | Dependent on business licensing and delivery readiness |
| Microservices architecture | Unjustified infrastructure overhead for a solo developer |
| Heavy real-time 3D on mobile (custom renderer) | `model_viewer_plus` covers the need; custom Three.js/flutter_gl is not production-ready |
| Complex delivery staff tracking app | Future phase only |
| Visual image search (camera → find product) | Planned for Phase 6+; requires pgvector + embedding pipeline; catalog must be populated first |
| Multi-language support | Mongolia-first; English may be added later |
| User-generated content / reviews | Future phase |
| Social commerce features | Out of scope |

---

## 8. Success Metrics

### Phase 0–1 Success (Documentation + Foundation)
- [ ] All Phase 0 documents completed before coding begins
- [ ] Monorepo, CI/CD, and Supabase schema up and running
- [ ] Authentication working (email + Google OAuth)
- [ ] Admin scaffold functional

### Phase 2–3 Success (Product Catalog)
- [ ] Admin can create, edit, and publish a product in under 5 minutes
- [ ] Product listing page loads in under 2 seconds on average Mongolian mobile connection
- [ ] Product detail page passes Lighthouse SEO score ≥ 90
- [ ] 3D intro completes without errors; skip button visible within 1 second
- [ ] Mobile Rive intro plays on both Android and iOS

### Phase 4–6 Success (Inquiry + Launch)
- [ ] Customer can submit a product inquiry in under 2 minutes
- [ ] Admin can view and respond to all inquiries from the dashboard
- [ ] Web app deployed to Vercel, accessible via custom domain
- [ ] API deployed to Railway with Docker
- [ ] Mobile app passes internal testing on both platforms

### Long-Term Business Metrics (Post-Launch)
- Monthly active catalog visitors
- Product inquiry conversion rate
- Average time on product detail page
- Return visitor rate
- Time to activate delivery toggle after business is ready

---

## 9. Constraints and Assumptions

### Development Constraints

| Constraint | Impact |
|---|---|
| Solo developer | No team ceremonies; Personal Kanban; conservative scope |
| 16-week MVP timeline | Scope must be tightly managed |
| Limited budget | Using free/low-cost tiers: Vercel, Supabase free, Railway starter |
| App Store costs | Apple Developer: $99/yr required before iOS public release |

### Technical Assumptions

| Assumption | Basis |
|---|---|
| Supabase free tier is sufficient for MVP traffic | Low initial user volume expected |
| Railway starter plan handles initial API load | Estimated low concurrent users at launch |
| Vercel free tier is sufficient for web | Standard Next.js deployment limits |
| Meshy AI produces acceptable GLB quality from product photos | Tested on similar object types; white background + multi-angle photos required |
| GLB files can be compressed under 5MB via gltf-pipeline Draco | Required for acceptable web load time |
| Mongolian users primarily access via mobile | Mobile-responsive and Flutter app are high priority |

### Business Assumptions

| Assumption | Risk if Wrong |
|---|---|
| Business operations are not delivery-ready at launch | Delivery toggle remains off; no impact on catalog MVP |
| Products can be photographed to high quality | Product image quality directly affects UX |
| Admin user has basic digital literacy | If not, onboarding support may be needed |

---

## 10. Long-Term Product Evolution

The platform is designed to evolve in the following direction:

```
Phase 1–3 (MVP)
  Product catalog + 3D opening + 360° product viewer + Admin panel
    ↓
Phase 4
  Inquiry / soft order system
  (Users can express interest without full checkout)
    ↓
Phase 5
  Delivery toggle activated
  Full cart → checkout → order → delivery workflow
    ↓
Phase 6+
  Payment gateway integration
  Order tracking
  Delivery staff mobile app
  Visual image search (camera → find similar product via pgvector)
    ↓
Future
  Expanded product catalog
  Loyalty / repeat customer features
  Possible payment wallet integration
```

The key architectural principle that enables this evolution:

> **The delivery system is fully designed and built in the database schema and API, but kept inactive behind an admin-controlled toggle until business operations are ready.**

This means no major refactoring is required to activate delivery — only the toggle changes.

---

## 11. Project Constraints

### Why This Project Exists

Nogoolin serves two purposes simultaneously:

1. **A real product** — A functional platform for a real business serving real Mongolian customers
2. **A portfolio project** — Demonstrating production-quality software engineering practices including documentation-first development, proper architecture, CI/CD, security design, and full-stack implementation across web, mobile, and backend

### Engineering Philosophy

- **Documentation before code.** All architecture, requirements, use cases, and API specs are written before implementation begins.
- **Correct architecture from day one.** Layered monolith with clean separation of concerns, not a quick prototype.
- **Security by design.** 4-layer defense-in-depth is designed before the first line of backend code is written.
- **Pragmatic solo developer choices.** Every technology decision is justified against solo developer constraints — no over-engineering.
- **Working software over ceremonies.** Personal Kanban over Scrum. Shipping over planning.

---

*This document is a living reference. It should be updated if the project scope, target users, or success criteria change significantly.*

*Next document: [`docs/02-requirements.md`](./02-requirements.md)*
