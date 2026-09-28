# Mermaid C4 sources

Typed flowcharts implement C4 static views; sequence diagrams implement C4 runtime views.

## c4-01-system-context

```mermaid
flowchart TB
  g(["Зочин · Person
P3: inquiry алдаа оношлох"])
  c(["Customer · Person
P1: session/own data"])
  a(["Админ · Person
P1/P3: role/audit"])
  n["Nogoolin · Software System
Каталог, inquiry, wishlist, admin"]
  sb["Supabase · External System
Auth, PostgreSQL, Storage"]
  oa["OAuth Providers · External System
Google/Facebook identity"]
  g -->|Каталог / inquiry| n
  c -->|Session / wishlist / history| n
  a -->|Inbox / status| n
  n -->|Auth, query, media request| sb
  sb -->|Result / data| n
  sb -->|OAuth request| oa
  oa -->|Authorization response| sb
  class g,c,a person
  class n internal
  class sb,oa external

classDef person fill:#19354A,color:#fff,stroke:#19354A
classDef internal fill:#E8F2F3,color:#19354A,stroke:#167D8D
classDef external fill:#F1F1F1,color:#333,stroke:#777
```

## c4-02-container

```mermaid
flowchart TB
  g(["Зочин · Person
P3: inquiry урсгал"])
  c(["Customer · Person
P1: session/ownership"])
  a(["Админ · Person
P1/P3: role/audit"])
  subgraph n["Nogoolin"]
    w["Web + Admin · Container
Next.js / TypeScript
Catalog, inquiry, wishlist, inbox"]
    m["Mobile · Container
Expo / React Native
Catalog/auth; inquiry pending"]
    api["REST API · Container
Fastify / TypeScript
Auth boundary, business rules"]
  end
  subgraph sb["Supabase Platform"]
    auth["Auth · External Service
JWT / OAuth
Session ба identity"]
    db[("PostgreSQL · External Data Store
SQL / RLS
Inquiry, cart, product, audit")]
    st["Storage · External Service
Object storage
Product media"]
  end
  g -->|HTTPS catalog/inquiry| w
  c -->|HTTPS web| w
  c -->|Mobile UI| m
  a -->|HTTPS /admin| w
  w -->|JSON / HTTPS| api
  m -->|JSON / HTTPS| api
  w -->|Session / HTTPS| auth
  m -->|Session / HTTPS| auth
  api -->|getUser / HTTPS| auth
  api -->|CRUD / Supabase client| db
  api -->|Media / HTTPS| st
  class g,c,a person
  class w,m,api internal
  class auth,db,st external

classDef person fill:#19354A,color:#fff,stroke:#19354A
classDef internal fill:#E8F2F3,color:#19354A,stroke:#167D8D
classDef external fill:#F1F1F1,color:#333,stroke:#777
```

## c4-03-api-component

```mermaid
flowchart TB
 client["Web/Admin + Mobile · External Containers
Next.js / Expo
JSON client"]
 subgraph api["Fastify API"]
  hook["Plugins / Hooks · Component
Fastify
Auth, RBAC, rate limit, validation"]
  ctrl["Controllers · Component
TypeScript
HTTP mapping"]
  svc["Services · Component
TypeScript
Business orchestration"]
  repo["Repositories · Component
TypeScript
Data access"]
  audit["Audit Repository · Component
TypeScript
Append-only events"]
 end
 schema["Shared Schemas · Library
Zod / TypeScript
Validation contract"]
 auth["Supabase Auth · External System
JWT identity"]
 db[("PostgreSQL · External System
RLS protected data")]
 client -->|JSON / HTTPS| hook
 hook -->|Validate| schema
 hook -->|getUser| auth
 hook -->|Accepted request| ctrl
 ctrl -->|Call| svc
 svc -->|Query / command| repo
 svc -->|Admin event| audit
 repo -->|CRUD| db
 audit -->|INSERT| db
 class hook,ctrl,svc,repo,audit internal
 class client,schema,auth,db external

classDef person fill:#19354A,color:#fff,stroke:#19354A
classDef internal fill:#E8F2F3,color:#19354A,stroke:#167D8D
classDef external fill:#F1F1F1,color:#333,stroke:#777
```

## c4-d01-inquiry

```mermaid
sequenceDiagram
 actor U as User
 participant W as Web client
 participant A as Fastify API
 participant D as PostgreSQL
 autonumber
 U->>W: Inquiry form
 W->>A: POST /api/v1/inquiries
 A->>A: Hooks: optionalAuth, Zod, rate limit
 alt Invalid / rate limit
 A-->>W: 400 / 429
 else Accepted
 A->>A: Controller → Inquiry Service
 A->>D: Repository INSERT + session customerId
 D-->>A: Inquiry row
 A-->>W: 201 + ID/status
 W-->>U: Success confirmation
 end
 Note over A,D: NFR-05 idempotency planned
```

## c4-d02-wishlist

```mermaid
sequenceDiagram
 actor U as Customer
 participant W as Web client
 participant A as Fastify API
 participant D as PostgreSQL
 autonumber
 U->>W: Save / list / remove
 W->>A: GET/POST/DELETE /cart + JWT
 alt Guest
 A-->>W: 401
 else Authenticated
 A->>A: Hooks → Controller → Cart Service
 A->>A: Published product, session user ID
 A->>D: Repository: user-scoped operation
 D-->>A: Own rows / result
 A-->>W: 200 / 201 / 204
 W-->>U: Wishlist UI
 end
 Note over A,D: RLS, unique pair, idempotent remove
```

## c4-d03-admin-inquiry

```mermaid
sequenceDiagram
 actor U as Admin
 participant W as Admin web
 participant A as Fastify API
 participant D as PostgreSQL
 autonumber
 U->>W: Select status
 W->>A: PATCH /admin/inquiries/{id}/status
 alt Missing / non-admin session
 A-->>W: 401 / 403
 else Admin
 A->>A: Auth/RBAC, Zod → Controller → Service
 A->>D: Inquiry Repository: UPDATE
 D-->>A: Updated row (unknown → 404)
 A->>D: Audit Repository: INSERT event
 A-->>W: 200 + new status
 W-->>U: Updated inbox
 end
 Note over A,D: Update/audit тусдаа, atomic биш
```

## ue4-before-container

```mermaid
flowchart TB
 g(["Зочин · Person"])
 c(["Customer · Person"])
 a(["Админ · Person"])
 subgraph n["Nogoolin Boundary"]
  magic["Magic Container · Container
Various technologies
Бүх зүйлийг хийнэ"]
 end
 sb["Supabase · External System
Auth/Data/Storage"]
 g -->|Uses| magic
 c -->|Uses| magic
 a -->|Uses| magic
 magic -->|Does stuff| sb
 class g,c,a person
 class magic internal
 class sb external

classDef person fill:#19354A,color:#fff,stroke:#19354A
classDef internal fill:#E8F2F3,color:#19354A,stroke:#167D8D
classDef external fill:#F1F1F1,color:#333,stroke:#777
```

