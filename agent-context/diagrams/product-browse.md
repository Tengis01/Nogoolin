# Flow: Product Browse & Multi-Script Search

> Regenerated from `docs/phase-0/05-sequence-diagrams.md` SEQ-003 (labels updated
> Express → Fastify per finalized stack). Ref: FR-PUB-001/002/013/014,
> UC-G-002/003. Browsing and searching share this path — search adds the
> transliteration branch.

```mermaid
sequenceDiagram
    actor Guest
    participant Web as Web/Mobile Client
    participant API as Fastify API
    participant Ctrl as ProductController
    participant Svc as SearchService
    participant Translit as Transliteration Util
    participant Repo as Repository
    participant DB as Supabase PostgreSQL (RLS)

    Guest->>Web: Browse /products (or type search query)
    Web->>API: GET /api/v1/products?category=&q=&page=&limit=12
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
    Repo->>DB: SELECT ... WHERE to_tsvector(name || ' ' || name_en) @@ query OR query = ANY(search_tags)
    Note over DB: RLS: anon sees status='published' only
    DB-->>Repo: matching products
    Repo-->>Svc: results
    Svc-->>Ctrl: results
    Ctrl-->>Web: HTTP 200 + paginated product list
    Web-->>Guest: Display matching products
```

**Key facts:**
- `search_tags` (text[]) holds admin-managed Latin transliterations + synonyms,
  e.g. `['nogoon dar eh', 'green tara', 'tara statue']` (FR-PUB-015).
- Transliteration is a pure function — no external API, keeps reads <500ms
  (NFR-PERF-004).
- Filters/search/page are always reflected in the URL query (WF-LIST-02) —
  links shareable.
