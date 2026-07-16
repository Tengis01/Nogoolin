# Flow: Submit Product Inquiry (Guest)

> Regenerated from `docs/05-sequence-diagrams.md` SEQ-002 (labels updated
> Express → Fastify per finalized stack). Ref: UC-G-007, FR-INQ-001…007.

```mermaid
sequenceDiagram
    actor Guest
    participant Web as Web/Mobile Client
    participant CF as Cloudflare WAF
    participant API as Fastify API
    participant Ctrl as InquiryController
    participant Svc as InquiryService
    participant Repo as InquiryRepository
    participant DB as Supabase PostgreSQL

    Guest->>Web: Fill inquiry form (name, phone, message)
    Web->>Web: Client-side validation (shared Zod schema — UX only)
    Web->>CF: POST /api/v1/inquiries
    CF->>CF: Layer 1 — WAF / bot check
    CF->>API: Forward request
    API->>Ctrl: Route to InquiryController
    Ctrl->>Ctrl: Server-side Zod validation (security boundary, NFR-SEC-003)
    Ctrl->>Svc: createInquiry(data)
    Svc->>Svc: Rate limit check (3 / IP / hour, FR-INQ-007)

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
        Ctrl-->>Web: HTTP 201 Created + inquiry number
        Web-->>Guest: Success state (INQ-YYYY-NNNN pill, WF-INQ-04)
    end
```

**Key facts:**
- No authentication required (FR-INQ-001); `product_id` optional.
- RLS allows anon INSERT but forces `status='new'`; only admin can SELECT/UPDATE.
- Client and server validate with the SAME Zod schema from
  `packages/validation-schemas` — server never trusts the client ran it.
- Exact field validation messages are locked in docs/07 §3.6.2.
