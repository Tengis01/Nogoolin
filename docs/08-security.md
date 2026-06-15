# Security Design Document

**Document:** `docs/08-security.md`  
**Project:** Nogoolin — Premium Religious Product Catalog Platform  
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Tengis (Solo Developer)  
**Last Updated:** June 2026  
**Depends On:** [`docs/02-requirements.md`](./02-requirements.md), [`docs/04-er-diagram.md`](./04-er-diagram.md), [`docs/05-sequence-diagrams.md`](./05-sequence-diagrams.md), [`docs/06-api-spec.yaml`](./06-api-spec.yaml)

---

## Changelog

| Version | Date | Type | Description |
|---|---|---|---|
| 1.0.0 | June 2026 | MAJOR | Initial version. Formalizes the 4-layer defense-in-depth model referenced throughout requirements (NFR-SEC-001 to NFR-SEC-013) and SEQ-004, with concrete RLS policies, threat checklist, and pre-launch security checklist. |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Defense-in-Depth Architecture](#2-defense-in-depth-architecture)
3. [Layer 1: Cloudflare WAF](#3-layer-1-cloudflare-waf)
4. [Layer 2: Express Middleware](#4-layer-2-express-middleware)
5. [Layer 3: JWT Authentication & RBAC](#5-layer-3-jwt-authentication--rbac)
6. [Layer 4: Supabase Row Level Security](#6-layer-4-supabase-row-level-security)
7. [Input Validation Strategy](#7-input-validation-strategy)
8. [File Upload Security](#8-file-upload-security)
9. [IDOR Prevention](#9-idor-prevention)
10. [Audit Logging](#10-audit-logging)
11. [Secrets Management](#11-secrets-management)
12. [Threat Model Summary](#12-threat-model-summary)
13. [Pre-Launch Security Checklist](#13-pre-launch-security-checklist)

---

## 1. Overview

### 1.1 Purpose

This document formalizes the security architecture for Nogoolin into a single
reference. While individual security requirements are scattered across
[`docs/02-requirements.md`](./02-requirements.md) (Section 4.2, NFR-SEC-001 to
NFR-SEC-013) and illustrated in [`SEQ-004`](./05-sequence-diagrams.md#5-seq-004-admin-toggles-delivery-setting),
this document is the **single source of truth** for:

- What each security layer does and does not cover
- The exact Supabase RLS policies per table
- The threat model and accepted risk posture for a solo-developer MVP
- A concrete checklist to run through before production launch

### 1.2 Scope

Covers security for:
- Public web (Next.js)
- Admin panel (Next.js `/admin`)
- Flutter mobile app
- Express.js REST API (`/api/v1/`)
- Supabase PostgreSQL (RLS), Auth, and Storage

### 1.3 Security Philosophy

> **Security is designed before the first line of backend code is written** (Project Constraint, `01-vision.md` §11).

Given this is a solo-developer project, the security model favors:

- **Defense-in-depth over a single perfect layer** — if one layer is misconfigured, others still hold.
- **Database-enforced security (RLS) as the last line of defense** — even if application code has a bug, RLS prevents data leakage.
- **Fail closed, not fail open** — when in doubt (e.g. `delivery_enabled` unset, JWT unverifiable), the system denies access.
- **No security theater** — no controls are added that the solo developer cannot realistically configure, monitor, and maintain (e.g. no SIEM, no WAF rule authoring beyond Cloudflare defaults + managed rulesets).

---

## 2. Defense-in-Depth Architecture

Every request — public or admin — passes through up to four independent
security layers before touching data. Each layer assumes the previous layer
**may have failed**, and re-checks what it can.

```
┌─────────────────────────────────────────────────────────────────┐
│  Client (Next.js Web / Admin / Flutter Mobile)                    │
└───────────────────────────┬───────────────────────────────────────┘
                              │ HTTPS (TLS 1.2+, NFR-SEC-001)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1 — Cloudflare WAF / Edge                                  │
│  • DDoS mitigation                                                │
│  • Managed WAF rulesets (OWASP Core Rule Set)                     │
│  • Edge rate limiting (coarse, IP-based)                          │
│  • TLS termination, bot fight mode                                │
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2 — Express Middleware                                     │
│  • Helmet.js (secure headers, NFR-SEC-007)                        │
│  • CORS (allowlist: web + admin domains, NFR-SEC-006)             │
│  • express-rate-limit (per-route, NFR-SEC-002)                    │
│  • Zod request validation (NFR-SEC-003)                           │
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3 — JWT Authentication + RBAC                              │
│  • Verify Supabase Auth JWT signature + expiry (NFR-SEC-013)      │
│  • Extract role claim (guest / customer / admin)                  │
│  • requireAuth() / requireAdmin() middleware (FR-AUTH-009)        │
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4 — Supabase PostgreSQL RLS                                │
│  • Row Level Security on every table (NFR-SEC-008)                │
│  • Ownership checks at the database level (IDOR, NFR-SEC-010)     │
│  • Append-only enforcement for audit_logs (FR-AUD-003)            │
│  • Parameterized queries via Supabase client (NFR-SEC-004)        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Layer Responsibility Matrix

| Layer | Stops | Does NOT stop | If this layer fails... |
|---|---|---|---|
| 1. Cloudflare WAF | Volumetric DDoS, known exploit signatures, bot traffic | Application logic bugs, valid-looking malicious requests | Layer 2 rate limiting + Layer 3 auth still apply |
| 2. Express Middleware | Malformed/oversized requests, missing headers, route-level abuse | Authenticated user abusing their own permissions | Layer 3 auth still required; Layer 4 RLS still enforced |
| 3. JWT/RBAC | Unauthenticated access to admin routes, expired tokens | A bug in RLS policy logic | Layer 4 RLS is the final backstop |
| 4. Supabase RLS | Direct data access bypassing app logic, IDOR, cross-tenant leakage | Nothing below this — **last line of defense** | N/A — this is the floor |

### 2.2 Reference: SEQ-004 Walkthrough

[`SEQ-004 (Admin Toggles Delivery Setting)`](./05-sequence-diagrams.md#5-seq-004-admin-toggles-delivery-setting)
is the canonical example of all 4 layers firing in sequence on a single
admin-only mutation:

```
PATCH /api/v1/admin/settings/delivery
  → Layer 1: Cloudflare WAF check
  → Layer 2: Helmet, CORS, rate limit
  → Layer 3: Verify JWT + role == 'admin'
  → Layer 4: RLS-checked UPDATE on system_settings
  → Audit log entry written (FR-AUD-005)
```

If Layer 3 rejects the request (non-admin or invalid JWT), a
`UNAUTHORIZED_ACCESS` audit log entry is still written
(UC-ADM-011 Exception Flow) — security events are logged even on denial.

---

## 3. Layer 1: Cloudflare WAF

**Ref:** NFR-SEC-001, NFR-SEC-012

### 3.1 Purpose

Cloudflare sits in front of both Vercel (web/admin) and Railway (API) as the
DNS/CDN/WAF layer (per `01-vision.md` tech stack). It is the first point of
contact for every request and blocks malicious traffic **before** it reaches
application infrastructure.

### 3.2 Configuration

| Control | Setting | Notes |
|---|---|---|
| SSL/TLS mode | Full (Strict) | Enforces TLS 1.2 minimum end-to-end (NFR-SEC-001) |
| Always Use HTTPS | On | Redirects all HTTP → HTTPS |
| Minimum TLS Version | 1.2 | TLS 1.3 preferred where supported |
| WAF — Managed Rules | OWASP Core Rule Set (Cloudflare Managed Ruleset) | Free tier includes core managed rules |
| Bot Fight Mode | On | Free tier; mitigates basic bot traffic against `/api/v1/inquiries` |
| Rate Limiting (Edge) | Coarse IP-based rule on `/api/v1/*` | Backstop above Express rate limiting (Layer 2) |
| Browser Integrity Check | On | Blocks requests with malformed/missing headers common in scripted attacks |
| Page Rules — Cache | Bypass cache for `/api/*` and `/admin/*` | Prevents stale or sensitive admin responses being cached at edge |

### 3.3 What Cloudflare Does NOT Do

Cloudflare is the **outermost** layer and is intentionally kept simple:

- It does **not** know about user roles, JWTs, or `delivery_enabled`
- It does **not** replace per-route rate limiting (Layer 2) — Cloudflare's
  free-tier rate limiting is coarse (IP + path), while `express-rate-limit`
  enforces the precise limits in NFR-SEC-002 (e.g. 5 req/15min on auth routes
  specifically)
- It is **not** a substitute for input validation — a request that passes
  WAF rules can still contain a logically invalid payload, which Layer 2/3
  must reject

> **Design principle:** if Cloudflare is ever misconfigured, disabled, or
> bypassed (e.g. direct Railway URL access during debugging), Layers 2–4
> must still hold independently. No security decision in this project relies
> *solely* on Cloudflare.

---

## 4. Layer 2: Express Middleware

**Ref:** NFR-SEC-002, NFR-SEC-003, NFR-SEC-006, NFR-SEC-007

This layer runs inside the Express.js + TypeScript API, before any
controller logic executes. It is implemented as a middleware chain applied
globally (in `app.ts`) plus per-route middleware for stricter limits.

### 4.1 Helmet.js — Secure Headers (NFR-SEC-007)

```typescript
// apps/api/src/middleware/security.ts
import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https://*.supabase.co', 'data:'],
      connectSrc: ["'self'", 'https://*.supabase.co'],
      // GLB models and product images served from Supabase Storage CDN
      mediaSrc: ["'self'", 'https://*.supabase.co'],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow GLB/image fetch from web origin
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
});
```

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS for 1 year (NFR-SEC-001) |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-sniffing attacks on uploaded images/GLB |
| `X-Frame-Options` | `DENY` | Prevents `/admin` from being framed (clickjacking) |
| `Content-Security-Policy` | restrictive, allows Supabase Storage | Mitigates XSS via injected scripts |
| `Referrer-Policy` | `no-referrer-when-downgrade` | Default Helmet behavior, sufficient for MVP |

### 4.2 CORS Configuration (NFR-SEC-006)

```typescript
// apps/api/src/middleware/cors.ts
import cors from 'cors';

const ALLOWED_ORIGINS = [
  'https://nogoolin.mn',          // public web
  'https://admin.nogoolin.mn',    // admin panel (or nogoolin.mn/admin)
  'http://localhost:3000',        // local dev only — removed in production env
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // required for httpOnly cookie-based auth
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});
```

> **Note:** The Flutter mobile app does not send an `Origin` header in the
> same way browsers do, so CORS does not restrict mobile API access — mobile
> requests are authenticated via Layer 3 (JWT) instead. CORS exists
> specifically to prevent **browser-based** cross-origin abuse of cookies.

### 4.3 Rate Limiting (NFR-SEC-002)

Two tiers of `express-rate-limit`, applied per route group:

```typescript
// apps/api/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

// General API endpoints: 100 req / 15 min per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
});

// Auth endpoints: 5 req / 15 min per IP (stricter — UC-A-001 Exception Flow)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Please wait.', code: 'RATE_LIMIT_EXCEEDED' },
});

// Inquiry endpoint: 3 req / hour per IP (FR-INQ-007, UC-G-007 Exception Flow)
export const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
});
```

| Route group | Limit | Window | Requirement |
|---|---|---|---|
| `/api/v1/*` (general) | 100 req | 15 min | NFR-SEC-002 |
| `/api/v1/auth/*`, Supabase Auth proxy routes | 5 req | 15 min | NFR-SEC-002, UC-A-001 |
| `POST /api/v1/inquiries` | 3 req | 1 hour | FR-INQ-007, UC-G-007 |

> Rate limit state is stored **in-memory** for MVP (single Railway
> container). If the API scales to multiple instances (NFR-SCA-001), this
> must move to a shared store (e.g. Redis) — noted as a Phase 6+
> consideration, not an MVP blocker given the expected traffic.

### 4.4 Zod Request Validation (NFR-SEC-003)

Every controller validates `req.body`, `req.query`, and `req.params` against
a Zod schema **before** calling the service layer. Validation schemas live in
`packages/validation-schemas/` (shared with frontend for client-side
validation, per `NFR-MAIN-003`).

```typescript
// packages/validation-schemas/src/inquiry.schema.ts
import { z } from 'zod';

export const inquiryInputSchema = z.object({
  customer_name: z.string().min(2),
  phone: z.string().regex(/^[0-9+\s-]{8,15}$/),
  message: z.string().optional(),
  product_id: z.string().uuid().nullable().optional(),
});

// apps/api/src/middleware/validate.ts
export const validateBody = (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: result.error.flatten(),
      });
    }
    req.body = result.data; // use parsed/typed data downstream
    next();
  };
```

This middleware directly implements the `400` responses defined throughout
[`06-api-spec.yaml`](./06-api-spec.yaml) (e.g. `InquiryInput`, `ProductInput`,
`ProductPatchInput` schemas).

### 4.5 Layer 2 Summary Table

| Middleware | Library | Requirement | Applied to |
|---|---|---|---|
| Secure headers | `helmet` | NFR-SEC-007 | All routes (global) |
| CORS | `cors` | NFR-SEC-006 | All routes (global) |
| General rate limit | `express-rate-limit` | NFR-SEC-002 | All `/api/v1/*` (global) |
| Auth rate limit | `express-rate-limit` | NFR-SEC-002 | Auth-related routes |
| Inquiry rate limit | `express-rate-limit` | FR-INQ-007 | `POST /inquiries` |
| Body/query validation | `zod` | NFR-SEC-003 | Per-route, before service layer |

---

## 5. Layer 3: JWT Authentication & RBAC

**Ref:** NFR-SEC-009, NFR-SEC-013, FR-AUTH-001 to FR-AUTH-011

### 5.1 Purpose

Layer 3 verifies **who is making the request** (authentication) and **what
they are allowed to do** (authorization/RBAC), before any controller logic
runs. It assumes Layers 1–2 may have let through a well-formed but malicious
or unauthorized request.

### 5.2 Token Lifecycle (NFR-SEC-013)

| Token | Lifetime | Storage | Rotation |
|---|---|---|---|
| Access token (JWT) | 15 minutes | httpOnly cookie (web/admin) / secure storage (Flutter) | Not rotated — short-lived by design |
| Refresh token | 7 days | httpOnly cookie (web/admin) / secure storage (Flutter) | **Rotated on every use** (FR-AUTH-006) |

```
┌──────────────┐   sign in    ┌──────────────┐
│   Client      │ ───────────▶ │ Supabase Auth │
│ (Web/Mobile)  │ ◀─────────── │               │
└──────────────┘  access(15m) │               │
       │          + refresh(7d)└──────────────┘
       │
       │ access token expires (15 min)
       ▼
┌──────────────┐  refresh     ┌──────────────┐
│   Client      │ ───────────▶ │ Supabase Auth │
│               │ ◀─────────── │ rotates       │
└──────────────┘  new access  │ refresh token │
                  + new refresh└──────────────┘
```

> **Why 15 minutes?** A stolen access token has a narrow exploitation window.
> Refresh token rotation (FR-AUTH-006) means a replayed old refresh token is
> rejected — if Supabase detects reuse of a rotated-out refresh token, the
> entire session family is revoked (Supabase Auth default behavior).

### 5.3 Roles (FR-AUTH-008)

| Role | Persisted? | Assigned | Notes |
|---|---|---|---|
| `guest` | No | Default (unauthenticated) | Not stored in `public.users` — represents anonymous visitors |
| `customer` | Yes | Auto-assigned on sign-up (UC-SYS-001) | Default role for all new accounts |
| `admin` | Yes | **Manually set** by Tengis directly in Supabase dashboard or via SQL | Never self-assignable through any API endpoint |
| `delivery_staff` | Reserved (W) | Future — not assignable in MVP | Schema supports it (`04-er-diagram.md`), no code path grants it yet |

> **Critical rule:** there is **no API endpoint** that lets a user set their
> own `role` to `admin`. `FR-USER-004` ("admin can change a user's role") is
> the *only* code path that writes to `role`, and it itself requires
> `requireAdmin()` — i.e., only an existing admin can create another admin.
> The first admin account is bootstrapped manually (see
> [`09-deployment.md`](./09-deployment.md) for the exact procedure).

### 5.4 Middleware Implementation

```typescript
// apps/api/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only, never exposed to client
);

export interface AuthedRequest extends Request {
  user?: { id: string; role: 'customer' | 'admin' | 'delivery_staff' };
}

/**
 * Verifies the JWT (signature + expiry) and attaches the user + role
 * to the request. Returns 401 if the token is missing or invalid.
 * Ref: NFR-SEC-009
 */
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies['sb-access-token'] ?? req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Missing access token', code: 'UNAUTHORIZED' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', data.user.id)
    .single();

  req.user = { id: data.user.id, role: profile?.role ?? 'customer' };
  next();
}

/**
 * Requires requireAuth() to have run first.
 * Returns 403 if the authenticated user is not an admin.
 * Ref: FR-AUTH-009
 */
export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required', code: 'FORBIDDEN' });
  }
  next();
}
```

### 5.5 Applying the Middleware

Per [`06-api-spec.yaml`](./06-api-spec.yaml), every `/admin/*` route requires
both checks (NFR-SEC-009: "verify both authentication AND authorization
before processing"):

```typescript
// apps/api/src/routes/admin/products.routes.ts
import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { productInputSchema, productPatchSchema } from '@nogoolin/validation-schemas';

const router = Router();

router.use(requireAuth, requireAdmin); // applies to ALL routes below

router.get('/', adminProductController.list);
router.post('/', validateBody(productInputSchema), adminProductController.create);
router.patch('/:id', validateBody(productPatchSchema), adminProductController.update);
router.delete('/:id', adminProductController.remove);

export default router;
```

Public routes apply **no** auth middleware at all (`security: []` in the API
spec) — e.g. `GET /products`, `GET /categories`, `POST /inquiries`.

### 5.6 OAuth & PKCE (FR-AUTH-002, FR-AUTH-004)

| Aspect | Web (Next.js) | Mobile (Flutter) |
|---|---|---|
| Flow | PKCE via `supabase-js` `signInWithOAuth` | Native `signInWithIdToken` (FR-AUTH-002) — **not** WebView |
| Why PKCE | Prevents authorization code interception (no client secret in browser) | Native flow avoids WebView cookie/session issues entirely |
| Trigger | `UC-A-002` (SEQ-001) | Same Supabase trigger fires server-side regardless of client |

Both paths converge at the same database trigger (`on_auth_user_created`,
UC-SYS-001) — **the security guarantee is identical** regardless of which
client signed the user up, because the trigger runs in Postgres, not in
client code.

### 5.7 Linking Multiple OAuth Providers (FR-AUTH-007, S-priority)

When a user links a second provider (e.g. Facebook after Google) to an
existing account, Supabase Auth matches on verified email. This is handled
entirely by Supabase Auth — **no custom code** is required, and no
additional RLS consideration applies since `auth.users.id` remains stable
across linked identities.

### 5.8 Sign-Out (FR-AUTH-011, UC-A-004)

```typescript
// Sign-out invalidates the refresh token server-side AND clears client storage
await supabase.auth.signOut(); // revokes refresh token at Supabase
// + clear httpOnly cookies (web) / secure storage (mobile)
```

A signed-out access token remains technically valid until its 15-minute
expiry (JWTs are stateless), but the refresh token is revoked immediately —
this is an accepted MVP tradeoff (15-minute exposure window is the same
window described in §5.2).

---

## 6. Layer 4: Supabase Row Level Security

**Ref:** NFR-SEC-008, NFR-SEC-010, NFR-SEC-004, FR-AUD-003

### 6.1 Purpose

RLS is the **last line of defense** (§2.1). Even if every layer above is
bypassed — a forged JWT somehow validates, a CORS misconfiguration, an
application bug in a controller — Postgres itself refuses to return or
modify rows the requesting role is not entitled to.

Every table created in `supabase/migrations/` has RLS **enabled** from the
first migration (NFR-SEC-008), including the future-only tables (`orders`,
`order_items`, `delivery_assignments`) per NFR-SCA-003.

### 6.2 Supabase Roles Used in Policies

| Supabase role | Maps to | How identified |
|---|---|---|
| `anon` | Guest (unauthenticated) | No JWT, or `anon` API key |
| `authenticated` | Customer (or Admin) | Valid Supabase Auth JWT, `auth.uid()` available |
| `service_role` | Backend API (server-side only) | Service role key — **bypasses RLS entirely**, used only for trusted server operations (e.g. audit log writes, triggers) |

> The Express API uses the **`authenticated`** context (forwarding the
> user's JWT to Supabase) for normal CRUD, so RLS is enforced even for
> requests that pass through the backend. The `service_role` key is reserved
> for operations that must bypass RLS by design (audit log inserts,
> `on_auth_user_created` trigger) and is **never** exposed to any client.

### 6.3 Helper Function: `is_admin()`

Since `users.role` lives in a table that itself has RLS, a naive policy like
`role = 'admin'` on the `users` table would recurse infinitely. A
`SECURITY DEFINER` helper function breaks this cycle safely:

```sql
-- supabase/migrations/0001_init.sql (excerpt)

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
```

This function is referenced in every admin-only policy below as `is_admin()`.

---

### 6.4 Table: `users`

**Ref:** FR-USER-001, FR-USER-002, FR-USER-003, FR-USER-004, FR-USER-005

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- FR-USER-005: a user can read only their own profile; admin can read all
CREATE POLICY "users_select_own_or_admin"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_admin());

-- FR-USER-002: a user can update their own row.
-- Column-level restriction (full_name only, not role) is enforced by Zod
-- at the API layer (NFR-SEC-003) — RLS allows the UPDATE, the app controls
-- which columns are present in the payload.
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- FR-USER-004: only admin can change a user's role
CREATE POLICY "users_update_role_admin_only"
  ON public.users FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- No direct INSERT policy — rows created exclusively by on_auth_user_created
-- trigger (UC-SYS-001), which runs as SECURITY DEFINER and bypasses RLS.
-- No DELETE policy — user deletion is out of scope for MVP.
```

---

### 6.5 Table: `categories`

**Ref:** FR-CAT-003, FR-CAT-007, FR-PUB-005

```sql
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- FR-CAT-007, FR-PUB-005: anyone can read active categories
CREATE POLICY "categories_select_active"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR is_admin());

-- Admin: full CRUD
CREATE POLICY "categories_admin_all"
  ON public.categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.6 Table: `products`

**Ref:** FR-PROD-004, FR-PROD-008, FR-PUB-001

```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- FR-PROD-004: only `published` products visible to guests/customers
CREATE POLICY "products_select_published"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR is_admin());

-- Admin: full CRUD
CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.7 Table: `product_images`

**Ref:** FR-MEDIA-004, FR-MEDIA-005, FR-MEDIA-006

```sql
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Visible if the parent product is published (or caller is admin)
CREATE POLICY "product_images_select_via_product"
  ON public.product_images FOR SELECT
  TO anon, authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id AND p.status = 'published'
    )
  );

-- Admin: full CRUD
CREATE POLICY "product_images_admin_all"
  ON public.product_images FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.8 Table: `media_assets`

**Ref:** `04-er-diagram.md` §3.5 — site-wide assets (3D intro model, hero images)

```sql
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Site-wide assets are publicly readable — needed by the unauthenticated
-- 3D opening animation (FR-3D-001)
CREATE POLICY "media_assets_select_all"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: full CRUD
CREATE POLICY "media_assets_admin_all"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.9 Table: `system_settings`

**Ref:** FR-SET-001 to FR-SET-007, FR-PUB-009

```sql
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- FR-PUB-009: delivery_enabled readable by public settings endpoint
CREATE POLICY "system_settings_select_all"
  ON public.system_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- FR-SET-003: only admin can update settings
CREATE POLICY "system_settings_update_admin"
  ON public.system_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- No INSERT/DELETE — rows seeded once via migration and only ever updated.
```

---

### 6.10 Table: `inquiries`

**Ref:** FR-INQ-001 to FR-INQ-007, UC-G-007, UC-ADM-009, UC-ADM-010

```sql
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- FR-INQ-001: guests and customers can submit inquiries without auth
CREATE POLICY "inquiries_insert_anyone"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new'); -- FR-INQ-003: always created with status='new'

-- UC-ADM-009: only admin can view inquiry inbox
CREATE POLICY "inquiries_select_admin"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (is_admin());

-- UC-ADM-010: only admin can update inquiry status
CREATE POLICY "inquiries_update_admin"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- No DELETE policy — inquiries retained for admin history.
```

> **Rate limiting reminder:** `inquiries_insert_anyone` allows any anon
> request to insert. The 3-per-hour-per-IP limit (FR-INQ-007) is enforced
> at **Layer 2** (`express-rate-limit`), not RLS — Postgres has no concept
> of "requests per IP." RLS here only ensures inserted rows are well-formed
> (`status = 'new'`).

---

### 6.11 Future Tables: `orders`, `order_items`, `delivery_assignments`

**Ref:** FR-ORD-001 to FR-ORD-008, NFR-SEC-010 (IDOR), NFR-SCA-003

Created with RLS **enabled and policies in place** in the initial migration,
even though they remain empty while `delivery_enabled = false`.

```sql
-- ── orders ──────────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- FR-ORD-007 / NFR-SEC-010: customer can only see their own orders
CREATE POLICY "orders_select_own_or_admin"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid() OR is_admin());

-- FR-ORD-001: customer can create an order for themselves only.
-- NOTE: delivery_enabled check (FR-SET-004, UC-SYS-002) is enforced at
-- the SERVICE LAYER (Express), not in this policy. RLS enforces ownership;
-- service layer enforces feature activation. Deliberate separation.
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- FR-ORD-005: only admin updates order status
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── order_items ─────────────────────────────────────────
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_via_order"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_via_order"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
    )
  );

-- ── delivery_assignments ────────────────────────────────
ALTER TABLE public.delivery_assignments ENABLE ROW LEVEL SECURITY;

-- Visible to assigned delivery staff member or admin
CREATE POLICY "delivery_assignments_select_own_or_admin"
  ON public.delivery_assignments FOR SELECT
  TO authenticated
  USING (delivery_staff_id = auth.uid() OR is_admin());

-- Only admin creates/updates assignments
CREATE POLICY "delivery_assignments_admin_write"
  ON public.delivery_assignments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.12 Table: `audit_logs`

**Ref:** FR-AUD-001 to FR-AUD-005 (append-only)

```sql
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- UC-ADM-012: only admin can view the audit log
CREATE POLICY "audit_logs_select_admin"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (is_admin());

-- NO INSERT policy for authenticated/anon.
-- Audit log writes happen exclusively via service_role key (bypasses RLS),
-- called from the Repository layer AFTER the primary operation succeeds
-- (UC-SYS-003).
--
-- NO UPDATE or DELETE policy for ANY role — FR-AUD-003 "append-only,
-- not editable or deletable by anyone, including admins" is enforced by
-- the absence of UPDATE/DELETE policies. Default-deny means no role can
-- modify existing entries.
```

---

### 6.13 RLS Policy Summary Table

| Table | anon SELECT | authenticated SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| `users` | — | own row, or admin (all) | trigger only (SECURITY DEFINER) | own row / admin (role) | — |
| `categories` | active only | active, or admin (all) | admin | admin | admin |
| `products` | published only | published, or admin (all) | admin | admin | admin |
| `product_images` | via published product | via published product, or admin | admin | admin | admin |
| `media_assets` | all | all | admin | admin | admin |
| `system_settings` | all | all | — (seeded only) | admin | — |
| `inquiries` | — | admin only | anon + authenticated | admin | — |
| `orders` *(future)* | — | own, or admin | own (`customer_id`) | admin | — |
| `order_items` *(future)* | — | via own order, or admin | via own order | — | — |
| `delivery_assignments` *(future)* | — | own assignment, or admin | admin | admin | — |
| `audit_logs` | — | admin only | service_role only | **none** | **none** |

---

## 7. Input Validation Strategy

**Ref:** NFR-SEC-003, NFR-SEC-004, NFR-MAIN-003

### 7.1 Validation Layers

Input validation happens at **two points**, both using the same Zod schemas
(shared via `packages/validation-schemas/`, NFR-MAIN-003):

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT-SIDE (Next.js forms, Flutter forms)                       │
│  • Same Zod schema (web) / Dart equivalent (mobile)               │
│  • Immediate UX feedback — NOT a security boundary                │
│  • Can always be bypassed (browser devtools, modified app)        │
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVER-SIDE (Express Controller — Layer 2)                       │
│  • SAME Zod schema, re-validated unconditionally                  │
│  • THIS is the security boundary (NFR-SEC-003)                    │
│  • Client validation failing ≠ server validation skipped          │
└─────────────────────────────────────────────────────────────────┘
```

> **Rule:** client-side validation exists purely for UX (instant feedback,
> fewer round-trips). The server **never** trusts that client validation ran.
> Every `POST`/`PATCH` controller calls `validateBody(schema)` regardless of
> what the client claims to have already checked.

### 7.2 Schema Inventory

| Schema | Used for | Key constraints |
|---|---|---|
| `inquiryInputSchema` | `POST /inquiries` | `phone` regex `^[0-9+\s-]{8,15}$`, `customer_name` min 2 chars |
| `productInputSchema` | `POST /admin/products` | `name`, `category_id` (uuid), `price` (positive number) required |
| `productPatchSchema` | `PATCH /admin/products/:id` | All fields optional (see `06-api-spec.yaml` `ProductPatchInput`) |
| `categoryInputSchema` | `POST /admin/categories` | `name` required |
| `categoryPatchSchema` | `PATCH /admin/categories/:id` | All fields optional |
| `deliveryToggleSchema` | `PATCH /admin/settings/delivery` | `delivery_enabled: boolean` |
| `inquiryStatusSchema` | `PATCH /admin/inquiries/:id/status` | `status` enum: `new \| contacted \| closed` |

### 7.3 Parameterized Queries (NFR-SEC-004)

All database access goes through the **Repository layer** using the
Supabase JS client's query builder — never raw string concatenation:

```typescript
// ✅ CORRECT — Supabase query builder, parameterized internally
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
  .ilike('name', `%${searchTerm}%`);

// ❌ FORBIDDEN — raw SQL string interpolation (never appears in this codebase)
// const query = `SELECT * FROM products WHERE category_id = '${categoryId}'`;
```

For the multi-script full-text search (FR-PUB-014, SEQ-003), Postgres
`plainto_tsquery()` is called via `.textSearch()`, which is also parameterized:

```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('name_en', cyrillicQuery, { type: 'plain' });
```

---

## 8. File Upload Security

**Ref:** FR-MEDIA-001 to FR-MEDIA-011, NFR-SEC-011

### 8.1 Two Upload Types, Two Buckets

| Upload type | Bucket | Allowed types | Max size | Requirement |
|---|---|---|---|---|
| Product images | `product-images` | `jpg`, `jpeg`, `png`, `webp` | 5MB/file | FR-MEDIA-001/002 |
| 3D models (GLB) | `model-assets` | `.glb`, `.gltf` | 10MB (target ≤5MB post-Draco) | FR-MEDIA-007/008 |

### 8.2 Validation Pipeline (NFR-SEC-011)

```
┌────────────────────────────────────────────────────────────────┐
│ 1. CLIENT (browser/Flutter)                                       │
│    • Check file extension + size before upload                   │
│    • UX only — does not stop a crafted multipart request          │
└──────────────────────────┬─────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. SERVER — Multer + custom fileFilter                            │
│    • Check MIME type AND file extension (NFR-SEC-011)            │
│    • Enforce size limit (Multer `limits.fileSize`)                │
└──────────────────────────┬─────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. SERVER — Filename sanitization + unique path (FR-MEDIA-009)   │
│    • Strip path traversal characters (../, /, \)                 │
│    • UUID-based storage path:                                     │
│      product-images/{productId}/{uuid}.webp                       │
│      model-assets/{productId}/{uuid}.glb                          │
└──────────────────────────┬─────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. SUPABASE STORAGE — bucket-level MIME allowlist                 │
│    • Configured per-bucket `allowed_mime_types` as final          │
│      backstop, independent of application code                    │
└────────────────────────────────────────────────────────────────┘
```

### 8.3 Implementation

```typescript
// apps/api/src/middleware/upload.ts
import multer from 'multer';
import { randomUUID } from 'crypto';
import path from 'path';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MODEL_EXTENSIONS = ['.glb', '.gltf'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // FR-MEDIA-002
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!IMAGE_MIME_TYPES.includes(file.mimetype) || !IMAGE_EXTENSIONS.includes(ext)) {
      return cb(new Error('INVALID_FILE_TYPE'));
    }
    cb(null, true);
  },
});

export const modelUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // FR-MEDIA-008
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!MODEL_EXTENSIONS.includes(ext)) {
      return cb(new Error('INVALID_FILE_TYPE'));
    }
    cb(null, true);
  },
});

export function buildStoragePath(
  productId: string,
  originalName: string,
  bucket: 'product-images' | 'model-assets'
) {
  const ext = path.extname(originalName).toLowerCase();
  return `${productId}/${randomUUID()}${ext}`;
}
```

### 8.4 Why Both MIME Type AND Extension?

| Check alone | Bypass technique |
|---|---|
| Extension only | Rename `malware.php` to `malware.jpg` — extension passes |
| MIME type only (from `Content-Type` header) | `Content-Type` is client-supplied and trivially spoofable |
| **Both, server-side** | Attacker must produce a file whose extension, declared MIME type, AND actual content all pass — combined with Storage never executing files, residual risk is very low |

---

## 9. IDOR Prevention

**Ref:** NFR-SEC-010, master plan §15

### 9.1 What IDOR Looks Like in Nogoolin

> Insecure Direct Object Reference: a user changes an ID in a request and
> accesses another user's data, because the backend checks *authentication*
> but not *ownership*.

Example attack (Phase 5+ when orders are active):

```
Customer A is authenticated (valid JWT).
GET /api/v1/orders/{order-id-belonging-to-customer-B}

❌ VULNERABLE: checks "is authenticated?" → yes → returns order.
✅ CORRECT:    checks "is authenticated AND owns this order?" → no → 404.
```

### 9.2 Defense-in-Depth: Two Layers

| Layer | Mechanism |
|---|---|
| Service layer (Express) | Explicit `WHERE customer_id = req.user.id` in every repository query |
| RLS (§6.11) | `orders_select_own_or_admin` policy: `customer_id = auth.uid() OR is_admin()` |

Even if the service layer query forgets the `customer_id` filter, RLS still
blocks the row.

### 9.3 404 vs 403 — Information Disclosure

Ownership-failure responses return **404, not 403** — so an attacker cannot
distinguish "this order doesn't exist" from "this order exists but isn't
yours," preventing ID enumeration:

```typescript
// apps/api/src/services/order.service.ts (future, Phase 5)
async function getOrderForCustomer(orderId: string, customerId: string) {
  const order = await orderRepo.findById(orderId);
  if (!order || order.customer_id !== customerId) {
    throw new NotFoundError('Order not found'); // same response either way
  }
  return order;
}
```

---

## 10. Audit Logging

**Ref:** FR-AUD-001 to FR-AUD-005, UC-SYS-003

### 10.1 What Gets Logged

| Trigger | `action` value | `entity_type` | `metadata` example |
|---|---|---|---|
| Product created | `PRODUCT_CREATE` | `product` | `{ name, status: 'draft' }` |
| Product published | `PRODUCT_PUBLISH` | `product` | `{ from: 'draft', to: 'published' }` |
| Product archived | `PRODUCT_ARCHIVE` | `product` | `{ from: 'published', to: 'archived' }` |
| Product hard-deleted | `PRODUCT_DELETE` | `product` | `{ name, hard: true }` |
| Category created | `CATEGORY_CREATE` | `category` | `{ name }` |
| Category updated | `CATEGORY_UPDATE` | `category` | `{ changed_fields }` |
| Category deactivated | `CATEGORY_DEACTIVATE` | `category` | `{ is_active: false }` |
| Product image uploaded | `IMAGE_UPLOAD` | `product_image` | `{ product_id, image_url }` |
| Product image deleted | `IMAGE_DELETE` | `product_image` | `{ product_id, image_url }` |
| 3D model uploaded/replaced | `MODEL_UPLOAD` | `product` | `{ product_id, model_3d_url }` (SEQ-005) |
| 3D model removed | `MODEL_REMOVE` | `product` | `{ product_id }` |
| Inquiry status changed | `INQUIRY_STATUS_UPDATE` | `inquiry` | `{ from: 'new', to: 'contacted' }` |
| Delivery toggle changed | `DELIVERY_TOGGLE` | `system_settings` | `{ from: false, to: true }` (FR-AUD-005) |
| Non-admin attempted admin route | `UNAUTHORIZED_ACCESS` | `route` | `{ attempted_route, user_id_or_null }` |
| User role changed | `USER_ROLE_CHANGE` | `user` | `{ target_user_id, from: 'customer', to: 'admin' }` |

### 10.2 Write Timing (UC-SYS-003)

```typescript
// apps/api/src/services/product.service.ts (excerpt)
async function publishProduct(id: string, adminId: string) {
  const updated = await productRepo.update(id, { status: 'published' });

  // Audit write happens AFTER the primary operation succeeds.
  // If the audit write fails, the product update is NOT rolled back —
  // audit logging is best-effort observability, not a transactional
  // requirement for MVP. Failures surface via Railway logs.
  try {
    await auditLogRepo.log({
      admin_id: adminId,
      action: 'PRODUCT_PUBLISH',
      entity_type: 'product',
      entity_id: id,
      metadata: { to: 'published' },
    });
  } catch (err) {
    logger.error('Audit log write failed', { err, action: 'PRODUCT_PUBLISH', entity_id: id });
  }

  return updated;
}
```

### 10.3 Failed Access Attempts (UC-ADM-011 Exception Flow)

Failed `requireAdmin()` checks write their audit entry from **within Layer 3
middleware itself**, using the `service_role` key:

```typescript
export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    auditLogRepo.log({
      admin_id: req.user?.id ?? null,
      action: 'UNAUTHORIZED_ACCESS',
      entity_type: 'route',
      entity_id: null,
      metadata: { attempted_route: req.originalUrl, method: req.method },
    }).catch(() => {}); // fire-and-forget, never blocks the 403 response

    return res.status(403).json({ error: 'Admin access required', code: 'FORBIDDEN' });
  }
  next();
}
```

---

## 11. Secrets Management

**Ref:** NFR-SEC-005, NFR-MAIN-008

### 11.1 Secret Inventory

| Secret | Used by | Where stored (production) | Where stored (local dev) |
|---|---|---|---|
| `SUPABASE_URL` | API, Web | Railway + Vercel env vars | `.env` (gitignored) |
| `SUPABASE_ANON_KEY` | Web, Mobile, API | Vercel env vars, Railway env vars, Flutter build config | `.env` / `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | API only — **never** sent to any client | Railway env vars (server-only) | `.env` (gitignored, **never** committed) |
| `GOOGLE_OAUTH_CLIENT_ID` / `SECRET` | Supabase Auth config | Supabase dashboard (not app code) | Supabase dashboard |
| `FACEBOOK_OAUTH_APP_ID` / `SECRET` (S) | Supabase Auth config | Supabase dashboard | Supabase dashboard |
| `CLOUDFLARE_API_TOKEN` | CI/CD (DNS/cache purge) | GitHub Actions secrets | N/A |
| `RAILWAY_TOKEN` | GitHub Actions (`api-deploy.yml`) | GitHub Actions secrets | N/A |
| `VERCEL_TOKEN` | GitHub Actions (`web-deploy.yml`) | GitHub Actions secrets | N/A |

### 11.2 Rules (NFR-SEC-005)

1. **No secret ever appears in source code**, including test fixtures, seed
   scripts, or documentation examples (all examples in this doc and
   `06-api-spec.yaml` use placeholder values like `xxxx.supabase.co`).
2. `.env.example` (NFR-MAIN-008) lists every required variable with empty or
   placeholder values, kept in sync whenever a new secret is introduced —
   this is a Definition of Done item for any PR adding config.
3. `SUPABASE_SERVICE_ROLE_KEY` is the highest-sensitivity secret — it
   bypasses RLS entirely (§6.2). It lives **only** in the Railway server
   environment and is never used in:
   - Next.js client bundles (would require `NEXT_PUBLIC_` prefix)
   - Flutter app builds
   - GitHub Actions steps not deploying the API
4. `.gitignore` includes `.env`, `.env.local`, `.env.*.local` from day one.
5. If a secret is ever accidentally committed: **rotate immediately** in the
   relevant dashboard — `git history` rewriting alone is insufficient since
   the old value must be treated as compromised regardless.

### 11.3 Database Backups (NFR-REL-006)

Supabase automatic daily backups are enabled from project creation.
Point-in-time recovery (PITR) may not be available on the free/starter tier —
accepted as an MVP risk (NFR-REL-006 is **S**-priority, not **M**). Manual
`pg_dump` exports are considered for Phase 6+ if PITR remains unavailable.

---

## 12. Threat Model Summary

**Ref:** Master plan §15, NFR-SEC-001 to NFR-SEC-013

| Threat | Mitigated by | Layer(s) | Residual risk (MVP) |
|---|---|---|---|
| DDoS / volumetric attack | Cloudflare | 1 | Low — free tier handles common cases |
| SQL injection | Supabase query builder, no raw SQL | 4 | Very low — no code path constructs raw SQL |
| XSS (stored, via product markdown content) | `rehype-sanitize` in Next.js markdown renderer | App layer | Medium — admin-authored content is trusted; sanitization applies as defense-in-depth for compromised admin accounts |
| CSRF | `SameSite` cookie attribute + CORS allowlist | 2 | Low |
| Brute-force login | `authLimiter` (5/15min) + Supabase Auth lockout | 1, 2 | Low |
| Inquiry spam | `inquiryLimiter` (3/hr) + Cloudflare Bot Fight Mode | 1, 2 | Medium — rotating IPs can still submit; acceptable for MVP given no email triggers per inquiry |
| IDOR (future orders) | Service-layer ownership check + RLS | 3, 4 | Low — fully designed pre-activation (§9) |
| Privilege escalation (customer → admin) | No self-service role API; `is_admin()` gate on `users_update_role_admin_only` | 3, 4 | Low |
| Malicious file upload | MIME+extension validation, Storage-only serving, no server-side execution | 2 | Low |
| JWT theft (XSS or device compromise) | httpOnly cookies (web), 15-min expiry, refresh rotation | 3 | Medium — 15-min window accepted; httpOnly prevents JS-based exfiltration |
| Audit log tampering | No UPDATE/DELETE policy on `audit_logs` for any role | 4 | Very low |
| Secrets leakage | `.gitignore`, env-var-only, service_role confined to API | N/A | Low, contingent on developer discipline (§11.2) |
| `delivery_enabled` bypass | Checked at service layer (UC-SYS-002) AND RLS ownership on `orders` | 3, 4 | Low — double-gated |

### 12.1 Explicitly Accepted Risks (Solo Developer MVP)

These are documented, not overlooked:

- **No WAF rule authoring beyond Cloudflare managed rulesets** — custom WAF
  rules require Cloudflare paid plans; managed rulesets cover OWASP Top 10
  patterns adequately for MVP traffic.
- **In-memory rate limiting** (§4.3) — acceptable for a single Railway
  instance; revisit if horizontal scaling (NFR-SCA-001) is triggered.
- **No SIEM / centralized security monitoring** — Railway + Vercel +
  Supabase dashboards are the monitoring surface. `audit_logs` +
  `UNAUTHORIZED_ACCESS` entries are the closest equivalent.
- **No automated penetration testing** — a manual review against §13
  substitutes for MVP; consider a third-party audit before Phase 6+ if
  real transaction volume follows delivery-toggle activation.

---

## 13. Pre-Launch Security Checklist

**Ref:** Phase 6 ("Security review", master plan §29)

Run through manually before the first production deployment
(`09-deployment.md`), and again before flipping `delivery_enabled = true`.

### 13.1 Infrastructure

- [ ] Cloudflare SSL/TLS mode set to **Full (Strict)**
- [ ] Cloudflare "Always Use HTTPS" enabled
- [ ] Cloudflare WAF Managed Ruleset enabled
- [ ] Cloudflare Bot Fight Mode enabled
- [ ] Cache bypass rules active for `/api/*` and `/admin/*`
- [ ] Supabase project region confirmed as Singapore

### 13.2 Application

- [ ] `helmet()` applied globally; CSP directives reviewed against actual
      Supabase Storage domain
- [ ] CORS `ALLOWED_ORIGINS` contains **only** production domains (no
      `localhost` entries in production env)
- [ ] All three rate limiters (`general`, `auth`, `inquiry`) active and
      tested with `curl` loops to confirm 429s fire at correct thresholds
- [ ] Every `/admin/*` route confirmed to use `requireAuth` + `requireAdmin`
      (spot-check against `06-api-spec.yaml` — 13 admin paths)
- [ ] Zod schemas present for every `POST`/`PATCH` body (§7.2 inventory —
      7 schemas)

### 13.3 Database (RLS)

- [ ] RLS **enabled** on all 11 tables:
      ```sql
      SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';
      -- all must show rowsecurity = true
      ```
- [ ] `is_admin()` function deployed and `EXECUTE` granted to `anon`,
      `authenticated`
- [ ] Test as `anon`: `SELECT * FROM products WHERE status='draft'` → **0 rows**
- [ ] Test as non-admin `authenticated`: attempt
      `UPDATE system_settings SET value='true' WHERE key='delivery_enabled'`
      → must fail with RLS violation
- [ ] Confirm `audit_logs` has **no** UPDATE/DELETE policies:
      ```sql
      SELECT * FROM pg_policies WHERE tablename='audit_logs';
      -- only SELECT policy for admin should appear
      ```
- [ ] First admin account bootstrapped via direct SQL/Supabase dashboard
      (not via any API endpoint) — see `09-deployment.md`

### 13.4 Secrets & Config

- [ ] `.env.example` up to date with every variable in §11.1
- [ ] `SUPABASE_SERVICE_ROLE_KEY` confirmed **absent** from:
  - [ ] Next.js client bundle (`grep` build output for key prefix)
  - [ ] Flutter APK/IPA build artifacts
  - [ ] Any `NEXT_PUBLIC_*` variable
- [ ] All secrets rotated if any were used during development with test values
- [ ] GitHub Actions secrets configured for `web-deploy.yml`,
      `api-deploy.yml`, `flutter-build.yml`

### 13.5 File Uploads

- [ ] Supabase Storage bucket `product-images`: MIME allowlist configured
      (jpg/jpeg/png/webp), public read, admin-only write
- [ ] Supabase Storage bucket `model-assets`: extension allowlist
      (.glb/.gltf), public read, admin-only write
- [ ] Test upload of a renamed `.php` file with `.jpg` extension → rejected
      at Layer 2 (Multer fileFilter)

### 13.6 Before Enabling Delivery (`delivery_enabled = true`)

- [ ] `orders`, `order_items`, `delivery_assignments` RLS policies
      re-verified against §6.11 (no drift since initial migration)
- [ ] `POST /orders` confirmed to return `403 DELIVERY_DISABLED` while
      `delivery_enabled = false` (UC-SYS-002)
- [ ] `DELIVERY_TOGGLE` audit log entries confirmed working in both
      directions (enable and disable)
- [ ] IDOR test: Customer A cannot retrieve Customer B's order via
      `GET /orders/me` or by guessing order IDs

---

*Previous document: [`docs/06-api-spec.yaml`](./06-api-spec.yaml)*  
*Next document: [`docs/09-deployment.md`](./09-deployment.md)*
