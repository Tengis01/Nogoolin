# Software Requirements Specification

**Document:** `docs/02-requirements.md`  
**Project:** Nogoolin — Premium Religious Product Catalog Platform  
**Version:** 1.2.0  
**Status:** Draft  
**Author:** Tengis (Solo Developer)  
**Last Updated:** June 2026  
**Depends On:** [`docs/01-vision.md`](./01-vision.md)

---

## Changelog

| Version | Date | Type | Description |
|---|---|---|---|
| 1.2.0 | June 2026 | MINOR | Added `name_en` and `search_tags` to FR-PROD-001; added FR-PUB-013 (multi-script search fields), FR-PUB-014 (Cyrillic/Latin/English unified search), FR-PUB-015 (admin tag management) |
| 1.1.0 | June 2026 | MINOR | Added `model_3d_url` to FR-PROD-001; upgraded FR-MEDIA-007/008 S→M; added FR-MEDIA-010 (Meshy AI workflow), FR-MEDIA-011 (Draco compression); added FR-PUB-011 (360° viewer + fallback), FR-PUB-012 (image search, C); added FR-MOB-010 (model_viewer_plus); updated constraints and assumptions for Meshy AI |
| 1.0.0 | June 2026 | MAJOR | Initial version |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Stakeholders](#2-stakeholders)
3. [Functional Requirements](#3-functional-requirements)
   - 3.1 [Authentication & Authorization](#31-authentication--authorization)
   - 3.2 [User & Profile Management](#32-user--profile-management)
   - 3.3 [Category Management](#33-category-management)
   - 3.4 [Product Management](#34-product-management)
   - 3.5 [Media Management](#35-media-management)
   - 3.6 [Public Catalog](#36-public-catalog)
   - 3.7 [Inquiry System](#37-inquiry-system)
   - 3.8 [Admin Panel](#38-admin-panel)
   - 3.9 [System Settings & Delivery Toggle](#39-system-settings--delivery-toggle)
   - 3.10 [3D Opening Experience](#310-3d-opening-experience)
   - 3.11 [Mobile App](#311-mobile-app)
   - 3.12 [Order System (Future)](#312-order-system-future)
   - 3.13 [Audit Logging](#313-audit-logging)
4. [Non-Functional Requirements](#4-non-functional-requirements)
   - 4.1 [Performance](#41-performance)
   - 4.2 [Security](#42-security)
   - 4.3 [Availability & Reliability](#43-availability--reliability)
   - 4.4 [Scalability](#44-scalability)
   - 4.5 [Maintainability](#45-maintainability)
   - 4.6 [SEO](#46-seo)
   - 4.7 [Accessibility](#47-accessibility)
   - 4.8 [Compatibility](#48-compatibility)
5. [Constraints](#5-constraints)
6. [Assumptions](#6-assumptions)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements for the Nogoolin platform. It serves as the authoritative reference for what the system must do before design, database modeling, API specification, and implementation begin.

### 1.2 Scope

This document covers:
- The public-facing web catalog (Next.js)
- The admin panel (Next.js `/admin`)
- The Flutter mobile application
- The Express.js REST API backend
- Supabase PostgreSQL data layer

### 1.3 Requirement Naming Convention

Each requirement is identified by a unique code:

```
FR-[MODULE]-[NUMBER]   → Functional Requirement
NFR-[MODULE]-[NUMBER]  → Non-Functional Requirement
```

**Priority levels (MoSCoW):**

| Priority | Label | Meaning |
|---|---|---|
| **M** | Must Have | MVP blocker. Cannot launch without it. |
| **S** | Should Have | Important but not a launch blocker. |
| **C** | Could Have | Nice to have. Deferred if time is tight. |
| **W** | Won't Have | Explicitly excluded from current scope. |

---

## 2. Stakeholders

| Stakeholder | Role | Primary Concern |
|---|---|---|
| Guest / Visitor | Public web or app user (unauthenticated) | Browse products freely, no sign-up required |
| Customer | Authenticated user | Submit inquiries, view history (future: place orders) |
| Admin | Business owner / operator | Manage catalog, view inquiries, toggle delivery |
| Delivery Staff | Future role | View and update delivery assignments |
| Developer | Solo developer (Tengis) | Maintainable, documented, testable codebase |

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-001 | The system shall allow admin users to sign in using email and password. | M |
| FR-AUTH-002 | The system shall allow users to sign in using Google OAuth (via Supabase Auth `signInWithIdToken`). | M |
| FR-AUTH-003 | The system shall allow users to sign in using Facebook OAuth. | S |
| FR-AUTH-004 | The system shall implement the PKCE flow for OAuth authentication. | M |
| FR-AUTH-005 | The system shall issue JWT access tokens upon successful authentication. | M |
| FR-AUTH-006 | The system shall rotate refresh tokens on each use. | M |
| FR-AUTH-007 | The system shall allow linking multiple OAuth providers to a single account. | S |
| FR-AUTH-008 | The system shall support the following roles: `guest`, `customer`, `admin`. The role `delivery_staff` shall be reserved for future use. | M |
| FR-AUTH-009 | The system shall reject requests to admin-protected routes from non-admin users with HTTP 403. | M |
| FR-AUTH-010 | A database trigger shall automatically create a row in `public.users` when a new Supabase Auth user is created via social login. | M |
| FR-AUTH-011 | The system shall allow admin to sign out and invalidate their session. | M |

---

### 3.2 User & Profile Management

| ID | Requirement | Priority |
|---|---|---|
| FR-USER-001 | The system shall store user profiles with `id`, `email`, `full_name`, `role`, `created_at`, `updated_at`. | M |
| FR-USER-002 | A customer shall be able to view and update their own profile (full name). | S |
| FR-USER-003 | An admin shall be able to view a list of all registered users. | S |
| FR-USER-004 | An admin shall be able to change a user's role. | S |
| FR-USER-005 | A user shall only be able to access their own profile data. | M |

---

### 3.3 Category Management

| ID | Requirement | Priority |
|---|---|---|
| FR-CAT-001 | An admin shall be able to create a new category with `name`, `slug`, `description`, `sort_order`. | M |
| FR-CAT-002 | An admin shall be able to edit any existing category. | M |
| FR-CAT-003 | An admin shall be able to deactivate a category (`is_active = false`). Deactivated categories shall not appear on the public site. | M |
| FR-CAT-004 | An admin shall be able to delete a category that has no products assigned to it. | S |
| FR-CAT-005 | Category slugs shall be unique and URL-safe. | M |
| FR-CAT-006 | Categories shall be orderable by `sort_order`. | S |
| FR-CAT-007 | Any authenticated guest or customer shall be able to retrieve the list of active categories. | M |

---

### 3.4 Product Management

| ID | Requirement | Priority |
|---|---|---|
| FR-PROD-001 | An admin shall be able to create a product with: `name`, `name_en`, `slug`, `category_id`, `price`, `short_description`, `full_description`, `usage_instruction`, `status`, `stock_status`, `is_featured`, `model_3d_url`, `search_tags`. | M |
| FR-PROD-002 | An admin shall be able to edit any product field. | M |
| FR-PROD-003 | Products shall support the following statuses: `draft`, `published`, `archived`. | M |
| FR-PROD-004 | Only products with status `published` shall be visible on the public catalog. | M |
| FR-PROD-005 | Products shall support the following stock statuses: `in_stock`, `out_of_stock`, `pre_order`. | M |
| FR-PROD-006 | An admin shall be able to mark a product as `is_featured`. Featured products shall appear on the home page. | M |
| FR-PROD-007 | Product slugs shall be unique, URL-safe, and auto-generated from the product name if not manually provided. | M |
| FR-PROD-008 | A product shall belong to exactly one category. | M |
| FR-PROD-009 | A product shall support multiple images. | M |
| FR-PROD-010 | A product shall support a `usage_instruction` field containing rich text or markdown. | M |
| FR-PROD-011 | An admin shall be able to soft-delete (archive) a product. Hard delete shall require explicit confirmation. | S |
| FR-PROD-012 | The API shall support filtering products by `category_id`, `status`, `stock_status`, and `is_featured`. | M |
| FR-PROD-013 | The API shall support paginated product listing results. | M |

---

### 3.5 Media Management

| ID | Requirement | Priority |
|---|---|---|
| FR-MEDIA-001 | An admin shall be able to upload product images to Supabase Storage. | M |
| FR-MEDIA-002 | The system shall validate image files: allowed types `jpg`, `jpeg`, `png`, `webp`; maximum file size 5MB. | M |
| FR-MEDIA-003 | Validation shall occur on both the frontend and the backend API. | M |
| FR-MEDIA-004 | Each product image record shall store: `product_id`, `image_url`, `alt_text`, `sort_order`. | M |
| FR-MEDIA-005 | An admin shall be able to set the sort order of images for a product. The first image shall be the primary/thumbnail image. | M |
| FR-MEDIA-006 | An admin shall be able to delete a specific product image. | M |
| FR-MEDIA-007 | The system shall support uploading GLB/GLTF 3D model files (generated via Meshy AI or Blender) to the `model-assets` storage bucket. Each product may have at most one 3D model file. | M |
| FR-MEDIA-008 | GLB/GLTF files shall have a maximum size of 10MB after Draco compression. | M |
| FR-MEDIA-009 | All uploaded file names shall be sanitized and given unique storage paths to prevent collisions. | M |
| FR-MEDIA-010 | The recommended 3D model production workflow is: photograph product (white background, multiple angles) → generate GLB via Meshy AI → compress via `gltf-pipeline` with Draco compression → upload to `model-assets` bucket. This workflow shall be documented in the admin onboarding guide. | M |
| FR-MEDIA-011 | GLB files shall be automatically compressed using Draco compression (`gltf-pipeline --draco.compressionLevel 10`) before being stored. The target output size is ≤ 5MB per model. | M |

---

### 3.6 Public Catalog

| ID | Requirement | Priority |
|---|---|---|
| FR-PUB-001 | A guest shall be able to browse all published products without authentication. | M |
| FR-PUB-002 | A guest shall be able to filter products by category. | M |
| FR-PUB-003 | A guest shall be able to view a product detail page by its slug URL. | M |
| FR-PUB-004 | The product detail page shall display: name, images (gallery), price, short description, full description, usage instructions, stock status, category, and a 360° 3D model viewer if `model_3d_url` is present. | M |
| FR-PUB-005 | A guest shall be able to view a list of all active categories. | M |
| FR-PUB-006 | The home page shall display featured products. | M |
| FR-PUB-007 | Product URLs shall follow the pattern `/products/[slug]`. | M |
| FR-PUB-008 | Category URLs shall follow the pattern `/categories/[slug]`. | M |
| FR-PUB-009 | The system shall provide a public settings endpoint `GET /api/v1/settings/public` that returns `delivery_enabled` status. | M |
| FR-PUB-010 | The frontend shall conditionally show or hide checkout/order UI based on `delivery_enabled`. | M |
| FR-PUB-011 | If a product has a `model_3d_url`, the product detail page shall display an interactive 360° model viewer using Three.js OrbitControls (web), allowing the user to rotate, zoom, and pan the model with mouse or touch. If `model_3d_url` is absent, the standard image gallery shall be shown instead. | M |
| FR-PUB-012 | A guest shall be able to search for visually similar products by uploading or taking a photo. The system shall compare the image embedding against stored product image embeddings (via Supabase pgvector) and return the closest matching products. | C |
| FR-PUB-013 | Every product shall have a `name_en` (English name) field and a `search_tags` field (PostgreSQL text array) to support multi-script search. Example: `name = "Ногоон Дарь Эх"`, `name_en = "Green Tara"`, `search_tags = ['nogoon dar eh', 'green tara', 'tara statue']`. | M |
| FR-PUB-014 | The product search function shall return matching results regardless of whether the user queries in Cyrillic Mongolian, Latin-transliterated Mongolian, or English. The system shall transliterate Latin input to Cyrillic before querying, and shall search across `name`, `name_en`, and `search_tags` simultaneously using PostgreSQL full-text search. | M |
| FR-PUB-015 | An admin shall be able to manually add and edit `search_tags` for each product from the admin panel. | S |

---

### 3.7 Inquiry System

| ID | Requirement | Priority |
|---|---|---|
| FR-INQ-001 | A guest shall be able to submit a product inquiry without being authenticated. | M |
| FR-INQ-002 | The inquiry form shall collect: `customer_name`, `phone`, `message`, and optionally `product_id`. | M |
| FR-INQ-003 | Submitted inquiries shall be stored with status `new` by default. | M |
| FR-INQ-004 | An admin shall be able to view all inquiries in the admin panel, sorted by newest first. | M |
| FR-INQ-005 | An admin shall be able to update inquiry status: `new` → `contacted` → `closed`. | M |
| FR-INQ-006 | An admin shall be able to filter inquiries by status. | S |
| FR-INQ-007 | The system shall prevent inquiry spam with rate limiting: maximum 3 submissions per IP per hour. | M |

---

### 3.8 Admin Panel

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-001 | The admin panel shall be accessible at `/admin` and require authentication. | M |
| FR-ADM-002 | Unauthenticated access to any `/admin` route shall redirect to the login page. | M |
| FR-ADM-003 | The admin dashboard shall display: total product count, total inquiry count (by status), featured product count. | S |
| FR-ADM-004 | The admin shall have a full product management interface (list, create, edit, publish, archive, delete). | M |
| FR-ADM-005 | The admin shall have a full category management interface (list, create, edit, deactivate). | M |
| FR-ADM-006 | The admin shall have an inquiry inbox (list, view detail, update status). | M |
| FR-ADM-007 | The admin shall have a settings page with the delivery toggle control. | M |
| FR-ADM-008 | The admin panel shall display a confirmation dialog before any destructive action (delete, archive). | S |

---

### 3.9 System Settings & Delivery Toggle

| ID | Requirement | Priority |
|---|---|---|
| FR-SET-001 | The system shall maintain a `system_settings` table with key-value pairs. | M |
| FR-SET-002 | The system shall have a `delivery_enabled` setting with a default value of `false`. | M |
| FR-SET-003 | Only an admin shall be able to update `delivery_enabled`. | M |
| FR-SET-004 | When `delivery_enabled = false`, the backend shall reject all `POST /api/v1/orders` requests with HTTP 403 and an appropriate error message. | M |
| FR-SET-005 | When `delivery_enabled = false`, the frontend shall hide all cart, checkout, and order placement UI. | M |
| FR-SET-006 | The toggle state change shall be reflected in the public settings API within 60 seconds (via cache TTL or immediate update). | S |
| FR-SET-007 | The delivery toggle action shall be recorded in the audit log. | M |

---

### 3.10 3D Opening Experience

| ID | Requirement | Priority |
|---|---|---|
| FR-3D-001 | The web app shall display a 3D opening animation on the first visit using Three.js and React Three Fiber. | M |
| FR-3D-002 | The animation shall feature a Green Tara (Ногоон Дарь Эх) inspired 3D model centered on screen. | M |
| FR-3D-003 | The camera shall perform a smooth, circular movement from the upper-right direction toward the center. | M |
| FR-3D-004 | A "Get Started" button shall appear after the animation completes. | M |
| FR-3D-005 | A "Skip Intro" button shall be visible and functional within 1 second of the page loading. | M |
| FR-3D-006 | The system shall display a static image fallback on devices where WebGL is unavailable or performance is insufficient. | M |
| FR-3D-007 | The system shall respect the OS-level `prefers-reduced-motion` setting and skip or reduce the animation accordingly. | M |
| FR-3D-008 | The 3D intro shall only autoplay on the first visit. Subsequent visits shall skip directly to the home page or show a minimal version. | S |
| FR-3D-009 | The GLB/GLTF model used in the intro shall not exceed 5MB after optimization. | M |
| FR-3D-010 | The Flutter mobile app shall display a Rive-based opening animation on launch. | M |
| FR-3D-011 | The Rive animation shall transition into the home screen upon completion or user tap. | M |

---

### 3.11 Mobile App

| ID | Requirement | Priority |
|---|---|---|
| FR-MOB-001 | The Flutter app shall support Android (API level 21+) and iOS (iOS 13+). | M |
| FR-MOB-002 | The app shall display the product listing with category filter. | M |
| FR-MOB-003 | The app shall display the product detail page with images, price, description, usage instructions, and a 360° 3D model viewer if `model_3d_url` is present. | M |
| FR-MOB-004 | The app shall allow a guest to submit a product inquiry. | M |
| FR-MOB-005 | The app shall consume the same REST API as the web frontend. | M |
| FR-MOB-006 | The app shall handle network errors gracefully and show user-friendly error messages. | M |
| FR-MOB-007 | The app shall cache product listing data for offline viewing of previously loaded products. | C |
| FR-MOB-008 | The app shall use Riverpod for state management. | M |
| FR-MOB-009 | The app shall use Dio for all HTTP requests. | M |
| FR-MOB-010 | The app shall use the `model_viewer_plus` Flutter package to render the interactive 360° 3D model viewer on the product detail page. If no GLB file is available for a product, the image gallery shall be shown as a fallback. | M |

---

### 3.12 Order System (Future)

> These requirements are defined for architectural completeness. They are **not activated in MVP**. Implementation is gated by `delivery_enabled = true`.

| ID | Requirement | Priority |
|---|---|---|
| FR-ORD-001 | An authenticated customer shall be able to place an order when `delivery_enabled = true`. | W |
| FR-ORD-002 | An order shall contain: `customer_id`, `customer_name`, `phone`, `address`, `status`, `total_amount`. | W |
| FR-ORD-003 | An order shall contain one or more order items, each with `product_id`, `quantity`, `unit_price`. | W |
| FR-ORD-004 | Order statuses shall be: `pending`, `confirmed`, `delivering`, `completed`, `cancelled`. | W |
| FR-ORD-005 | An admin shall be able to view all orders and update their status. | W |
| FR-ORD-006 | An admin shall be able to assign a delivery staff member to an order. | W |
| FR-ORD-007 | A customer shall only be able to view their own orders. | W |
| FR-ORD-008 | The system shall prevent order placement when `delivery_enabled = false` at the API level. | M |

---

### 3.13 Audit Logging

| ID | Requirement | Priority |
|---|---|---|
| FR-AUD-001 | The system shall log all admin actions that create, update, or delete data. | M |
| FR-AUD-002 | Each audit log entry shall record: `admin_id`, `action`, `entity_type`, `entity_id`, `metadata`, `created_at`. | M |
| FR-AUD-003 | The audit log shall be append-only. Existing entries shall not be editable or deletable by anyone, including admins. | M |
| FR-AUD-004 | An admin shall be able to view the audit log in the admin panel, sorted by newest first. | S |
| FR-AUD-005 | The delivery toggle action shall always be recorded in the audit log. | M |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Priority |
|---|---|---|
| NFR-PERF-001 | The product listing page shall achieve a Lighthouse Performance score of ≥ 80 on a simulated mid-tier mobile device. | M |
| NFR-PERF-002 | The product listing page shall load within 2 seconds on a 4G mobile connection in Mongolia. | M |
| NFR-PERF-003 | The product detail page shall achieve a Lighthouse Performance score of ≥ 85. | M |
| NFR-PERF-004 | All API responses for read operations (product list, product detail, categories) shall respond within 500ms under normal load. | M |
| NFR-PERF-005 | The 3D opening GLB model shall be ≤ 5MB. A loading state shall be displayed until the model is ready. | M |
| NFR-PERF-006 | All product images served via Supabase Storage or Vercel shall be served in WebP format where supported. | S |
| NFR-PERF-007 | Product listing images shall be lazy-loaded. | M |
| NFR-PERF-008 | The API shall use HTTP response caching headers (Cache-Control) for public, read-only endpoints. | S |

---

### 4.2 Security

| ID | Requirement | Priority |
|---|---|---|
| NFR-SEC-001 | All data in transit shall be encrypted via HTTPS (TLS 1.2 minimum, TLS 1.3 preferred). | M |
| NFR-SEC-002 | The API shall implement rate limiting: 100 requests per 15 minutes per IP for general endpoints; 5 requests per 15 minutes for auth endpoints. | M |
| NFR-SEC-003 | The API shall validate all request bodies using Zod schemas before processing. | M |
| NFR-SEC-004 | The API shall use parameterized queries or an ORM at all times. Raw SQL string interpolation is forbidden. | M |
| NFR-SEC-005 | All database secrets, API keys, and OAuth credentials shall be stored as environment variables. No secrets shall appear in the codebase. | M |
| NFR-SEC-006 | The API shall implement CORS, restricting allowed origins to the web app domain and admin domain. | M |
| NFR-SEC-007 | The API shall use the Helmet.js middleware for setting secure HTTP headers. | M |
| NFR-SEC-008 | Supabase Row Level Security (RLS) shall be enabled on all tables. | M |
| NFR-SEC-009 | All admin routes shall verify both authentication (valid JWT) and authorization (admin role) before processing the request. | M |
| NFR-SEC-010 | All order and inquiry routes shall verify ownership before returning or modifying data (IDOR prevention). | M |
| NFR-SEC-011 | File uploads shall be validated for both MIME type and file extension on the server side. | M |
| NFR-SEC-012 | Cloudflare WAF shall be the first layer of defense, blocking malicious traffic before it reaches the API. | M |
| NFR-SEC-013 | JWT tokens shall have a short expiry (15 minutes for access tokens). Refresh tokens shall be rotated on each use. | M |

---

### 4.3 Availability & Reliability

| ID | Requirement | Priority |
|---|---|---|
| NFR-REL-001 | The web application shall target ≥ 99% uptime during the MVP phase, leveraging Vercel's infrastructure. | M |
| NFR-REL-002 | The API shall target ≥ 99% uptime during the MVP phase, leveraging Railway's infrastructure. | M |
| NFR-REL-003 | The system shall handle API errors gracefully, returning structured JSON error responses. | M |
| NFR-REL-004 | The web frontend shall display user-friendly error pages for 404 and 500 states. | M |
| NFR-REL-005 | The mobile app shall display user-friendly error states when the API is unreachable. | M |
| NFR-REL-006 | Supabase database backups shall be enabled. Point-in-time recovery shall be configured where available. | S |

---

### 4.4 Scalability

| ID | Requirement | Priority |
|---|---|---|
| NFR-SCA-001 | The API shall be stateless, enabling horizontal scaling by adding more instances without code changes. | M |
| NFR-SCA-002 | The database schema shall be normalized to avoid unnecessary data duplication. | M |
| NFR-SCA-003 | The system shall be designed to support activating delivery functionality without requiring a major refactoring of the codebase. | M |
| NFR-SCA-004 | Product images shall be served via CDN (Supabase Storage with CDN, or Vercel Image Optimization) rather than directly from the application server. | M |

---

### 4.5 Maintainability

| ID | Requirement | Priority |
|---|---|---|
| NFR-MAIN-001 | The backend shall follow a strict 3-layer architecture: Controller → Service → Repository. Business logic shall not appear in controllers. Database queries shall not appear in services. | M |
| NFR-MAIN-002 | The codebase shall use TypeScript throughout (web, API, shared types). | M |
| NFR-MAIN-003 | Shared types and validation schemas shall live in shared packages within the monorepo. | M |
| NFR-MAIN-004 | The monorepo shall use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. | M |
| NFR-MAIN-005 | GitHub Actions CI/CD pipelines shall be configured for web, API, and mobile build/deploy workflows. | M |
| NFR-MAIN-006 | The API shall be containerized using a Docker multi-stage build on `node:20-alpine`. The container shall run as a non-root user. | M |
| NFR-MAIN-007 | Database changes shall be managed through versioned migration files in `supabase/migrations/`. | M |
| NFR-MAIN-008 | All environment-specific configuration shall be externalized via `.env` files. A `.env.example` file shall be kept up-to-date. | M |

---

### 4.6 SEO

| ID | Requirement | Priority |
|---|---|---|
| NFR-SEO-001 | Every product detail page shall have a unique `<title>` tag containing the product name. | M |
| NFR-SEO-002 | Every product detail page shall have a unique `<meta name="description">` containing the product's short description. | M |
| NFR-SEO-003 | Every product detail page shall have Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`. | M |
| NFR-SEO-004 | Product and category pages shall use canonical URLs. | M |
| NFR-SEO-005 | The web app shall generate and serve a `sitemap.xml` including all published product and category URLs. | M |
| NFR-SEO-006 | The web app shall serve a `robots.txt` that disallows crawling of `/admin` routes. | M |
| NFR-SEO-007 | Product detail pages shall be server-side rendered (SSR) or statically generated (SSG) for SEO. | M |
| NFR-SEO-008 | All product and category page URLs shall use human-readable slugs (e.g., `/products/green-tara-statue`). | M |
| NFR-SEO-009 | All product images shall have descriptive `alt` text. | M |

---

### 4.7 Accessibility

| ID | Requirement | Priority |
|---|---|---|
| NFR-ACC-001 | The web app shall use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<button>`, etc.). | S |
| NFR-ACC-002 | All interactive elements shall be keyboard-navigable. | S |
| NFR-ACC-003 | Color contrast ratios shall meet WCAG 2.1 AA standards for all text content. | S |
| NFR-ACC-004 | The 3D intro animation shall respect `prefers-reduced-motion` OS settings. | M |
| NFR-ACC-005 | All product images shall have `alt` text. Decorative images shall use `alt=""`. | M |

---

### 4.8 Compatibility

| ID | Requirement | Priority |
|---|---|---|
| NFR-COM-001 | The web app shall function correctly on the latest stable versions of Chrome, Firefox, Safari, and Edge. | M |
| NFR-COM-002 | The web app shall be fully responsive and usable on screen widths from 375px (iPhone SE) to 1440px (desktop). | M |
| NFR-COM-003 | The Flutter app shall support Android API level 21 (Android 5.0) and above. | M |
| NFR-COM-004 | The Flutter app shall support iOS 13 and above. | M |
| NFR-COM-005 | The API shall return `Content-Type: application/json` for all responses. | M |
| NFR-COM-006 | All API dates shall be returned in ISO 8601 format (UTC). | M |

---

## 5. Constraints

| Constraint | Impact |
|---|---|
| Solo developer | No parallel development streams; scope must be managed strictly |
| 16-week MVP target | All M-priority requirements must be met within this window |
| Supabase free tier | Storage, bandwidth, and connection limits apply; upgrade if needed post-launch |
| Railway starter plan | Container instance limits; not suitable for high concurrency at scale |
| Vercel free tier | Serverless function execution limits; sufficient for MVP traffic |
| Apple Developer Program | Required for iOS public distribution; $99/year; not a launch blocker for web |
| Meshy AI 3D generation | Paid plan likely required beyond free tier limits; ~20 min per product; output GLB must be compressed before upload |

---

## 6. Assumptions

| Assumption | If False |
|---|---|
| Business operations are not delivery-ready at launch time | Delivery toggle remains off; no impact on catalog MVP |
| Product photography is available before Phase 2 | Product listing pages will be incomplete or require placeholder images |
| Admin user has basic computer literacy | Onboarding documentation or tutorial flow may be required |
| Mongolian users primarily use mobile devices (Android dominant) | Flutter priority remains correct; no architecture change needed |
| No payment processing is needed for MVP | If required sooner than expected, a payment gateway integration will need to be planned |
| Meshy AI generates acceptable quality GLB models from product photos | If quality is insufficient for certain products, Blender manual modeling will be required as fallback for those products only |
| Product photos for Meshy AI input are taken against a white background with multiple angles and good lighting | If photo quality is poor, Meshy AI output quality will degrade; photography guidelines must be provided to the content team |

---

*This document is a living reference. It should be updated when requirements change, are clarified, or are reprioritized.*

*Previous document: [`docs/01-vision.md`](./01-vision.md)*  
*Next document: [`docs/03-use-cases.md`](./03-use-cases.md)*
