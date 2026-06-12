# Sequence Diagrams

**Document:** `docs/05-sequence-diagrams.md`  
**Project:** Nogoolin — Premium Religious Product Catalog Platform  
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Tengis (Solo Developer)  
**Last Updated:** June 2026  
**Depends On:** [`docs/03-use-cases.md`](./03-use-cases.md), [`docs/04-er-diagram.md`](./04-er-diagram.md)

---

## Changelog

| Version | Date | Type | Description |
|---|---|---|---|
| 1.0.0 | June 2026 | MAJOR | Initial version. 6 sequence diagrams covering auth, inquiry, multi-script search (FR-PUB-014, v1.2.0), delivery toggle, 3D model upload, and future order placement. |

---

## Table of Contents

1. [Overview](#1-overview)
2. [SEQ-001: Google OAuth Sign-In](#2-seq-001-google-oauth-sign-in)
3. [SEQ-002: Submit Product Inquiry](#3-seq-002-submit-product-inquiry)
4. [SEQ-003: Multi-Script Product Search](#4-seq-003-multi-script-product-search)
5. [SEQ-004: Admin Toggles Delivery Setting](#5-seq-004-admin-toggles-delivery-setting)
6. [SEQ-005: Upload 3D Model (GLB)](#6-seq-005-upload-3d-model-glb)
7. [SEQ-006: Place Order (Future)](#7-seq-006-place-order-future)

---

## 1. Overview

This document illustrates the runtime interaction flows between system components: client (web/mobile), Cloudflare, Express API (Controller → Service → Repository), Supabase Auth, Supabase PostgreSQL (with RLS), and Supabase Storage.

Each diagram references the corresponding use case in [`docs/03-use-cases.md`](./03-use-cases.md) and requirements in [`docs/02-requirements.md`](./02-requirements.md).

**Layer key used throughout:**

```
Client → Cloudflare (WAF) → Express API (Controller → Service → Repository) → Supabase
```

---

## 2. SEQ-001: Google OAuth Sign-In

**Ref:** UC-A-002, FR-AUTH-002, FR-AUTH-004, FR-AUTH-010

```mermaid
sequenceDiagram
    actor User
    participant Web as Web/Mobile Client
    participant SBAuth as Supabase Auth
    participant Google
    participant DB as Supabase PostgreSQL

    User->>Web: Click "Sign in with Google"
    Web->>SBAuth: signInWithOAuth(provider: 'google', PKCE)
    SBAuth->>Google: Redirect to consent screen
    Google->>User: Show consent screen
    User->>Google: Grant permission
    Google->>SBAuth: Redirect with authorization code
    SBAuth->>SBAuth: Exchange code for tokens (PKCE verify)
    SBAuth->>DB: INSERT INTO auth.users (if new)
    DB->>DB: Trigger on_auth_user_created fires
    DB->>DB: INSERT INTO public.users (id, email, full_name, role='customer')
    SBAuth-->>Web: Return JWT access_token + refresh_token
    Web->>Web: Store tokens (httpOnly cookie / secure storage)
    Web->>User: Redirect to home page or /admin/dashboard
```

**Notes:**
- For admin users, role is manually set to `admin` post-creation (not via OAuth default).
- Mobile (Flutter) uses native `signInWithIdToken` (FR-AUTH-002), not WebView — same trigger logic applies at the database level.

---

## 3. SEQ-002: Submit Product Inquiry

**Ref:** UC-G-007, FR-INQ-001 to FR-INQ-007

```mermaid
sequenceDiagram
    actor Guest
    participant Web as Web/Mobile Client
    participant CF as Cloudflare WAF
    participant API as Express API
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant DB as Supabase PostgreSQL

    Guest->>Web: Fill inquiry form (name, phone, message)
    Web->>Web: Client-side validation (Zod)
    Web->>CF: POST /api/v1/inquiries
    CF->>CF: Check rate limit / block malicious traffic
    CF->>API: Forward request
    API->>Ctrl: Route to InquiryController
    Ctrl->>Ctrl: Validate body with Zod schema
    Ctrl->>Svc: createInquiry(data)
    Svc->>Svc: Check rate limit (3 / IP / hour)

    alt Rate limit exceeded
        Svc-->>Ctrl: throw RateLimitError
        Ctrl-->>Web: HTTP 429 "Too many submissions"
        Web-->>Guest: Show error message
    else Within limit
        Svc->>Repo: insertInquiry(data, status='new')
        Repo->>DB: INSERT INTO inquiries (...)
        DB-->>Repo: inquiry row
        Repo-->>Svc: inquiry
        Svc-->>Ctrl: inquiry
        Ctrl-->>Web: HTTP 201 Created
        Web-->>Guest: Show success confirmation
    end
```

---

## 4. SEQ-003: Multi-Script Product Search

**Ref:** FR-PUB-013, FR-PUB-014 (v1.2.0)

```mermaid
sequenceDiagram
    actor Guest
    participant Web as Web/Mobile Client
    participant API as Express API
    participant Ctrl as Controller
    participant Svc as SearchService
    participant Translit as Transliteration Util
    participant Repo as Repository
    participant DB as Supabase PostgreSQL

    Guest->>Web: Type search query (Cyrillic, Latin, or English)
    Web->>API: GET /api/v1/products?search=[query]
    API->>Ctrl: Route to ProductController
    Ctrl->>Svc: searchProducts(query)

    Svc->>Svc: Detect script (Cyrillic / Latin / English)

    alt Query is Latin-transliterated Mongolian
        Svc->>Translit: transliterateToCyrillic(query)
        Translit-->>Svc: cyrillicQuery
    else Query is Cyrillic or English
        Svc->>Svc: Use query as-is
    end

    Svc->>Repo: fullTextSearch(query, cyrillicQuery)
    Repo->>DB: SELECT * FROM products WHERE\n  to_tsvector(name || ' ' || name_en) @@ query\n  OR query = ANY(search_tags)
    DB-->>Repo: matching products
    Repo-->>Svc: results
    Svc-->>Ctrl: results
    Ctrl-->>Web: HTTP 200 + product list
    Web-->>Guest: Display matching products
```

**Notes:**
- `search_tags` (text[]) stores pre-populated Latin transliterations and synonyms (e.g. `['nogoon dar eh', 'green tara', 'tara statue']`), managed by admin (FR-PUB-015).
- Transliteration util is a pure function — no external API call required, keeping search latency low (NFR-PERF-004).

---

## 5. SEQ-004: Admin Toggles Delivery Setting

**Ref:** UC-ADM-011, UC-SYS-002, UC-SYS-003, FR-SET-001 to FR-SET-007, FR-AUD-005

```mermaid
sequenceDiagram
    actor Admin
    participant Web as Admin Panel
    participant CF as Cloudflare WAF
    participant MW as Express Middleware (Helmet/CORS/RateLimit)
    participant Ctrl as SettingsController
    participant Svc as SettingsService
    participant Repo as SettingsRepository
    participant AuditRepo as AuditLogRepository
    participant DB as Supabase PostgreSQL (RLS)

    Admin->>Web: Navigate to /admin/settings
    Admin->>Web: Toggle delivery switch ON
    Web->>Web: Show confirmation dialog
    Admin->>Web: Confirm

    Web->>CF: PATCH /api/v1/admin/settings/delivery\n{ delivery_enabled: true }
    CF->>CF: Layer 1 - WAF check
    CF->>MW: Forward request
    MW->>MW: Layer 2 - Helmet, CORS, rate limit
    MW->>Ctrl: Forward request

    Ctrl->>Ctrl: Layer 3 - Verify JWT + role == 'admin'

    alt Not authenticated or not admin
        Ctrl-->>Web: HTTP 401 / 403
        Ctrl->>AuditRepo: Log failed access attempt
        AuditRepo->>DB: INSERT INTO audit_logs (action='UNAUTHORIZED_ACCESS')
    else Authorized admin
        Ctrl->>Svc: updateDeliveryEnabled(true, adminId)
        Svc->>Repo: updateSetting('delivery_enabled', true)
        Repo->>DB: Layer 4 - RLS-checked UPDATE\nUPDATE system_settings SET value=true WHERE key='delivery_enabled'
        DB-->>Repo: updated row
        Repo-->>Svc: ok

        Svc->>AuditRepo: logAction(admin_id, 'DELIVERY_TOGGLE', metadata={from:false,to:true})
        AuditRepo->>DB: INSERT INTO audit_logs (...)

        Svc-->>Ctrl: success
        Ctrl-->>Web: HTTP 200 OK
        Web-->>Admin: Show success notification
    end
```

**Notes:**
- All 4 security layers (Cloudflare WAF → Helmet/CORS/RateLimit → JWT/RBAC → Supabase RLS) are exercised on this admin-only mutation.
- The audit log entry is written **after** the primary operation succeeds (UC-SYS-003), and is append-only (FR-AUD-003).

---

## 6. SEQ-005: Upload 3D Model (GLB)

**Ref:** UC-ADM-006, FR-MEDIA-007 to FR-MEDIA-011

```mermaid
sequenceDiagram
    actor Admin
    participant MeshyAI as Meshy AI (external)
    participant Local as Admin's Machine (gltf-pipeline)
    participant Web as Admin Panel
    participant API as Express API
    participant Storage as Supabase Storage (model-assets)
    participant DB as Supabase PostgreSQL

    Note over Admin,MeshyAI: Offline preparation (~20 min)
    Admin->>MeshyAI: Upload product photos (white background, multi-angle)
    MeshyAI-->>Admin: Generated GLB file
    Admin->>Local: Run gltf-pipeline --draco.compressionLevel 10
    Local-->>Admin: Compressed GLB (≤ 5MB)

    Note over Admin,DB: Upload flow
    Admin->>Web: Click "Upload 3D Model", select GLB
    Web->>Web: Validate file type (.glb/.gltf) and size (≤10MB)

    alt Invalid file
        Web-->>Admin: Show error "Invalid file type or size"
    else Valid file
        Web->>API: POST /api/v1/admin/media/upload (multipart)
        API->>API: Server-side validate MIME type + extension
        API->>Storage: Upload to model-assets/[unique-path].glb
        Storage-->>API: storage URL
        API->>DB: UPDATE products SET model_3d_url = [url] WHERE id = [productId]
        DB-->>API: ok
        API->>DB: INSERT INTO audit_logs (action='MODEL_UPLOAD')
        API-->>Web: HTTP 200 + model_3d_url
        Web-->>Admin: Show success + 3D preview
    end
```

---

## 7. SEQ-006: Place Order (Future)

**Ref:** UC-F-001, FR-ORD-001 to FR-ORD-008, FR-SET-004 — **W priority, gated by `delivery_enabled`**

```mermaid
sequenceDiagram
    actor Customer
    participant Web as Web/Mobile Client
    participant API as Express API
    participant Ctrl as OrderController
    participant Svc as OrderService
    participant SettingsRepo as SettingsRepository
    participant Repo as OrderRepository
    participant DB as Supabase PostgreSQL

    Customer->>Web: Review cart, enter address + phone
    Customer->>Web: Submit order
    Web->>API: POST /api/v1/orders { items, address, phone }
    API->>Ctrl: Route to OrderController
    Ctrl->>Ctrl: Verify JWT (authenticated customer)
    Ctrl->>Svc: placeOrder(customerId, data)

    Svc->>SettingsRepo: getSetting('delivery_enabled')
    SettingsRepo->>DB: SELECT value FROM system_settings WHERE key='delivery_enabled'
    DB-->>SettingsRepo: value

    alt delivery_enabled == false
        Svc-->>Ctrl: throw ForbiddenError
        Ctrl-->>Web: HTTP 403 "Order placement is currently disabled"
        Web-->>Customer: Show message
    else delivery_enabled == true
        Svc->>Repo: createOrder(customerId, data, status='pending')
        Repo->>DB: INSERT INTO orders (...)
        DB-->>Repo: order row
        Repo->>DB: INSERT INTO order_items (...) for each cart item
        Repo-->>Svc: order + items
        Svc-->>Ctrl: order confirmation
        Ctrl-->>Web: HTTP 201 + order ID
        Web-->>Customer: Show order confirmation
        Note over Svc,Ctrl: Future: notify Admin (email/push)
    end
```

---

*Previous document: [`docs/04-er-diagram.md`](./04-er-diagram.md)*  
*Next document: [`docs/06-api-spec.yaml`](./06-api-spec.yaml)*