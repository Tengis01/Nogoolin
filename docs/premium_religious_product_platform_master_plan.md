# Premium Religious Product Catalog Platform — Master Plan

> This document explains the full project vision, confirmed technical decisions, architecture, development process, and roadmap.  
> It is written so that another AI agent, developer, or technical assistant can immediately understand what the project is about and continue helping with planning, documentation, design, or implementation.

---

## 1. Project Summary

This project is a **premium religious product catalog platform** for Mongolia.

It is not intended to be a simple product listing website. The long-term goal is to build a well-structured, production-ready system that includes:

- A public product catalog website
- A mobile app
- An admin panel
- Product images, prices, descriptions, and usage instructions
- A premium 3D opening experience on the website
- A Rive-based opening animation on mobile
- A future delivery/order system that can be turned on later from the admin panel
- Proper documentation, diagrams, API specification, security design, and deployment plan

The project is being developed by a **solo developer**, so the system must be realistic, maintainable, and not over-engineered.

---

## 2. Core Product Idea

The platform will introduce and display religious products.

Each product can include:

- Product name
- Product image/images
- Price
- Short description
- Full description
- Usage instructions, if needed
- Category
- Availability status
- Future order/delivery support

At the first launch, the system should focus on **product information display**.

Delivery, cart, checkout, and order management should be designed in the architecture, but not fully activated until the business operation is ready.

---

## 3. Long-Term Vision

The long-term goal is to build:

> A premium religious product catalog and future delivery platform with web, admin, and mobile clients sharing one backend system.

The system should be able to evolve from:

```text
Product catalog
   ↓
Inquiry / soft order system
   ↓
Order management
   ↓
Delivery toggle
   ↓
Full delivery workflow
   ↓
Possible payment integration in the future
```

---

## 4. Key UX / Visual Concept

The website should have a premium opening experience.

### Web Opening Concept

The website intro will include a spiritual / religious 3D opening scene.

Initial concept:

- A Green Tara / Ногоон Дарь Эх inspired 3D visual
- The figure/model is placed in the center
- Camera or visual movement comes from the upper-right direction toward the center
- The movement should feel circular, spiral, smooth, and ceremonial
- After the animation finishes, a **Get Started** button appears
- When the user clicks **Get Started**, the user enters the home page

### Important UX Rule

The 3D opening must not block usability.

The intro must include:

- Skip intro button
- Loading state
- Reduced motion fallback
- Static fallback for slow devices
- Mobile-friendly behavior
- Option to show intro only on first visit

The intro is a premium experience, not the main product function.

---

## 5. Mobile Opening Concept

For the Flutter mobile app, real-time 3D should not be the first choice.

Recommended approach:

```text
Flutter Splash Screen
   ↓
Rive intro animation or video + Rive hybrid
   ↓
Get Started transition
   ↓
Home page
```

### Mobile Animation Decision

Use:

- **Rive** for interactive UI animation
- Optional short rendered video for cinematic 3D intro
- Flutter built-in transitions for normal screen navigation

Recommended split:

```text
Web:
Three.js + React Three Fiber + Blender GLB/GLTF

Mobile:
Rive animation or video/Rive hybrid

Normal mobile UI:
Flutter built-in animations + Rive for special interactive elements
```

---

## 6. Development Methodology

### Chosen Method: Personal Kanban

This is a solo developer project. Therefore, Scrum is not suitable.

### Why Not Scrum?

Scrum includes:

- Daily standups
- Sprint planning
- Sprint review
- Retrospective
- Scrum Master
- Product Owner
- Team ceremonies

These are designed for teams, not solo developers. For one person, Scrum creates unnecessary overhead.

### Agile Principles to Keep

Use Agile principles, but not full Scrum ceremonies.

Keep:

- Iterative development
- Working software first
- Small releases
- Continuous improvement
- Frequent review

Avoid:

- Heavy ceremonies
- Story point obsession
- Velocity tracking
- Over-planning

### Kanban Board

Use GitHub Projects.

```text
Backlog → This Week → In Progress → Review → Done
```

Recommended board:

```text
┌──────────┬────────────┬─────────────┬──────────┬──────┐
│ Backlog  │ This Week  │ In Progress │  Review  │ Done │
│          │            │  WIP: 2     │  WIP: 3  │      │
└──────────┴────────────┴─────────────┴──────────┴──────┘
```

### Priority Labels

```text
P0 = Must have / launch blocker
P1 = Should have / important
P2 = Nice to have / future
```

### Weekly Review

Every Sunday, do a 30-minute review:

```text
1. What was completed?
2. What should be done next week?
3. What blockers exist?
4. What should be removed or delayed?
```

Main goal:

> Working software, not ceremony.

---

## 7. Confirmed Final Tech Stack

## 7.1 Web

```text
Framework: Next.js latest stable / Next.js 16.x
Language: TypeScript
Styling: Tailwind CSS
Animation: Framer Motion
State management: Zustand
Validation: Zod
```

### Reason

Next.js is selected because the website needs:

- SEO
- Fast page loading
- Product pages with shareable URLs
- Server-side rendering / static generation options
- Modern React architecture
- Good deployment support through Vercel

Use **latest stable Next.js**, not a fixed old version like Next.js 14.

---

## 7.2 Web 3D

```text
3D Modeling: Blender
3D Format: GLB / GLTF
Web 3D Engine: Three.js
React Integration: React Three Fiber
```

### Reason

This combination is suitable for the planned premium 3D opening experience.

Workflow:

```text
Blender model / scene
   ↓
Export GLB or GLTF
   ↓
Load into Three.js / React Three Fiber
   ↓
Create animation and camera movement
   ↓
Show Get Started button
```

---

## 7.3 Mobile

```text
Framework: Flutter 3.x / latest stable
Language: Dart
Opening animation: Rive
State management: Riverpod
HTTP client: Dio
Supabase integration: supabase_flutter
```

### Reason

Flutter is selected because one codebase can support both Android and iOS.

Rive is selected because it is better suited for interactive app animations than trying to force heavy real-time 3D into the mobile app.

---

## 7.4 Backend API

```text
Framework: Express.js 5
Language: TypeScript
Architecture: Layered Monolith
Validation: Zod
Container: Docker multi-stage
```

### Reason

Express.js is lightweight and flexible.

However, because Express does not enforce structure by default, the project must strictly follow layered architecture.

---

## 7.5 Data, Auth, Storage

```text
Database: Supabase PostgreSQL
Auth: Supabase Auth + JWT
OAuth: Google OAuth first
OAuth future: Facebook OAuth
Storage: Supabase Storage
```

### Reason

Supabase is selected because this project has relational data:

```text
Category → Product → Product Images
Product → Usage Instructions
User → Role
Order → Order Items
Order → Delivery Assignment
```

PostgreSQL is better suited than Firebase/Firestore for this type of structured product/order system.

---

## 7.6 DevOps / Hosting / Security

```text
Web Hosting: Vercel
API Hosting: Railway
DNS / CDN / WAF: Cloudflare
CI/CD: GitHub Actions
Project Board: GitHub Projects
Repository: GitHub monorepo
```

---

## 8. Architecture Decision

### Final Architecture

```text
Layered Monolith / Modular Monolith
```

This is the correct architecture for this project.

### Why Not Microservices?

Microservices are not suitable at the beginning because:

- Solo developer project
- Too much deployment complexity
- Too much infrastructure overhead
- Requires distributed logging, monitoring, service communication
- Harder to debug
- Not necessary for current business requirements

### Why Layered / Modular Monolith?

Because it gives structure without unnecessary complexity.

The system can be organized into modules:

```text
Auth Module
User Module
Product Module
Category Module
Media Module
Admin Module
Settings Module
Inquiry / Order Module
Delivery Module future
Audit Log Module
```

Each module should be separated internally, but deployed as one backend.

---

## 9. High-Level System Architecture

```text
Visitor / Customer
   ↓
Next.js Public Website
   ↓
Express REST API
   ↓
Supabase PostgreSQL + Supabase Storage


Admin
   ↓
Next.js Admin Panel
   ↓
Express REST API
   ↓
Supabase PostgreSQL + Supabase Auth


Mobile User
   ↓
Flutter App
   ↓
Express REST API
   ↓
Supabase PostgreSQL + Supabase Storage
```

All clients share the same backend.

This prevents duplicate business logic.

---

## 10. Backend Layered Structure

The backend should follow this structure:

```text
Controller Layer
   ↓
Service Layer
   ↓
Repository Layer
   ↓
Database / Supabase
```

### Controller Layer

Responsible for:

- Receiving HTTP requests
- Validating request input
- Calling service functions
- Returning response

### Service Layer

Responsible for:

- Business logic
- Rules
- Permission checks
- Delivery toggle logic
- Product publishing rules

### Repository Layer

Responsible for:

- Database queries
- Data persistence
- Query abstraction

---

## 11. Delivery Toggle Design

Delivery will not be fully active at the beginning.

The system must include a setting:

```text
delivery_enabled = false
```

Admin can later turn it on.

### When Delivery is OFF

Public website should show:

```text
Product information
Contact / inquiry option
No full checkout
No real delivery order placement
```

### When Delivery is ON

System can show:

```text
Add to cart
Checkout
Order placement
Delivery option
Order tracking future
```

### Important Rule

The delivery toggle must be checked both in frontend and backend.

Frontend:

```text
If delivery_enabled is false, hide checkout UI.
```

Backend:

```text
If delivery_enabled is false, reject POST /orders.
```

Never rely only on frontend hiding.

---

## 12. Initial Database Entities

Recommended initial entities:

```text
users / profiles
categories
products
product_images
media_assets
system_settings
inquiries
orders future
order_items future
delivery_assignments future
audit_logs
```

### profiles

```text
id
email
full_name
role: admin | customer | delivery_staff
created_at
updated_at
```

### categories

```text
id
name
slug
description
sort_order
is_active
created_at
updated_at
```

### products

```text
id
category_id
name
slug
price
short_description
full_description
usage_instruction
status: draft | published | archived
stock_status: in_stock | out_of_stock | pre_order
is_featured
created_at
updated_at
```

### product_images

```text
id
product_id
image_url
alt_text
sort_order
created_at
```

### media_assets

```text
id
type: image | video | model_3d
url
file_name
size
mime_type
created_at
```

### system_settings

```text
key
value
updated_at
```

Example:

```text
delivery_enabled = false
```

### inquiries

```text
id
product_id
customer_name
phone
message
status: new | contacted | closed
created_at
```

### orders future

```text
id
customer_id
customer_name
phone
address
status: pending | confirmed | delivering | completed | cancelled
total_amount
created_at
updated_at
```

### order_items future

```text
id
order_id
product_id
quantity
unit_price
created_at
```

### delivery_assignments future

```text
id
order_id
delivery_staff_id
vehicle_info
status
assigned_at
completed_at
```

### audit_logs

```text
id
admin_id
action
entity_type
entity_id
metadata
created_at
```

---

## 13. REST API Structure

Use REST API because it is simple, predictable, and suitable for web + mobile clients.

### Public API

```text
GET /api/products
GET /api/products/:slug
GET /api/categories
GET /api/settings/public
POST /api/inquiries
```

### Admin API

```text
POST /api/admin/products
PATCH /api/admin/products/:id
DELETE /api/admin/products/:id

POST /api/admin/categories
PATCH /api/admin/categories/:id
DELETE /api/admin/categories/:id

POST /api/admin/media/upload
GET /api/admin/inquiries
PATCH /api/admin/inquiries/:id/status

GET /api/admin/settings
PATCH /api/admin/settings/delivery
```

### Future Order API

```text
POST /api/orders
GET /api/orders/me
GET /api/admin/orders
PATCH /api/admin/orders/:id/status
POST /api/admin/orders/:id/assign-delivery
```

---

## 14. Authentication and Authorization

Use:

```text
Supabase Auth + JWT
```

### Roles

```text
guest
customer
admin
delivery_staff future
```

### Rules

Guest can:

```text
View products
View categories
View product detail
Send inquiry
```

Customer future can:

```text
Create order
View own order history
Manage profile
```

Admin can:

```text
Manage products
Manage categories
Upload images
Manage inquiries
Toggle delivery
Manage orders future
```

Delivery staff future can:

```text
View assigned delivery orders
Update delivery status
```

### Security Rule

Every admin route must check:

```text
1. Is user authenticated?
2. Does user have admin role?
```

Every order route must check ownership:

```text
User can only access their own orders.
```

---

## 15. Security Design

Required security practices:

```text
- HTTPS only
- JWT verification
- Role-based access control
- Input validation with Zod
- File upload validation
- File size limit
- File type whitelist
- SQL injection prevention through parameterized queries / ORM
- IDOR prevention
- Rate limiting
- CORS configuration
- Environment variables for secrets
- Admin audit logs
- Database backup
```

### IDOR Explanation

IDOR means Insecure Direct Object Reference.

Example problem:

```text
/api/orders/123
```

A user should not be able to change the ID and access another user’s order.

Backend must always verify ownership.

---

## 16. File Upload and Storage

Use Supabase Storage.

Storage buckets:

```text
product-images
product-videos
model-assets
admin-uploads
```

### Product Images

Rules:

```text
Allowed: jpg, jpeg, png, webp
Max size: define limit
Use alt text
Use compressed images
```

### 3D Assets

Rules:

```text
Allowed: glb, gltf
Keep file size optimized
Use compressed models
Provide fallback image
```

### Upload Flow

```text
Admin selects file
   ↓
Frontend validates file type and size
   ↓
API validates again
   ↓
Upload to Supabase Storage
   ↓
Save URL to database
```

---

## 17. UI / UX Scope

### Public Website Screens

```text
Opening intro
Home page
Product list
Product detail
Category page
Usage instruction section
Inquiry/contact section
About page
```

### Admin Screens

```text
Admin login
Dashboard
Product list
Create product
Edit product
Category management
Media upload
Inquiry management
Delivery settings
Order management future
```

### Mobile App Screens

```text
Splash / intro
Home
Product list
Product detail
Category view
Inquiry / contact
Profile future
Order history future
```

---

## 18. Performance Requirements

### Web

```text
- Optimize 3D model size
- Lazy load 3D intro
- Use image optimization
- Use static rendering where possible
- Use SEO-friendly product pages
- Provide fallback for slow devices
```

### Mobile

```text
- Use Rive carefully
- Keep intro short
- Avoid heavy real-time 3D initially
- Test on low-end Android devices
- Cache product data where appropriate
```

### 3D Intro Performance Rules

```text
- Skip button required
- Static fallback required
- Reduced motion support required
- Do not block product browsing
- Do not autoplay heavy assets repeatedly
```

---

## 19. SEO Requirements

The website must be SEO-friendly.

Required:

```text
- Product detail pages must have unique URLs
- Product title in meta title
- Product description in meta description
- Open Graph image
- Clean slug URLs
- Sitemap
- robots.txt
- Structured data future
```

Example URL:

```text
/products/green-tara-statue
```

---

## 20. Project Folder Structure

Recommended monorepo:

```text
religious-product-platform/
├── apps/
│   ├── web/
│   └── mobile/
│
├── backend/
│   └── api/
│
├── packages/
│   ├── shared-types/
│   ├── validation-schemas/
│   └── config/
│
├── database/
│   ├── migrations/
│   ├── seed/
│   └── erd/
│
├── assets/
│   ├── blender/
│   ├── glb/
│   ├── images/
│   └── videos/
│
├── docs/
│   ├── 01-project-vision.md
│   ├── 02-requirements.md
│   ├── 03-use-cases.md
│   ├── 04-architecture.md
│   ├── 05-er-diagram.md
│   ├── 06-sequence-diagrams.md
│   ├── 07-api-spec.md
│   ├── 08-ui-ux.md
│   ├── 09-security.md
│   ├── 10-deployment.md
│   └── 11-final-report.md
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

## 21. Pre-Coding Documentation Plan

Before coding, create the following documents.

### 1. Project Vision + README

Purpose:

```text
Explain what the project is, why it exists, who it is for, goals, non-goals, and scope.
```

Estimated time:

```text
~2 hours
```

### 2. Functional and Non-Functional Requirements

Include:

```text
Functional Requirements
Non-Functional Requirements
Performance requirements
Security requirements
Mobile requirements
SEO requirements
```

Estimated time:

```text
~3 hours
```

### 3. Use Case Diagram

Actors:

```text
Guest
Customer future
Admin
Delivery Staff future
System
```

Estimated time:

```text
~3 hours
```

### 4. API Specification

Use OpenAPI 3.0 YAML.

Include:

```text
All public endpoints
All admin endpoints
Request body
Response body
Error response
Auth requirements
```

Estimated time:

```text
~1 day
```

### 5. UI/UX Wireframes

Use Figma or draw.io.

Include:

```text
Opening screen
Home page
Product listing
Product detail
Admin dashboard
Product form
Mobile main screens
```

Estimated time:

```text
~1–2 days
```

---

## 22. Development Roadmap

Total MVP target:

```text
16 weeks
```

Production polish:

```text
Additional 4–8 weeks if needed
```

Important note:

```text
16 weeks = MVP launch target
20–24 weeks = more realistic polished production target
```

---

## 23. Phase 0 — Documentation and Planning

Duration:

```text
2 weeks
```

Tasks:

```text
Project Vision
README
Functional Requirements
Non-Functional Requirements
Use Case Diagram
ERD
Sequence Diagrams
API Specification
UI Wireframes
Security plan
Deployment plan draft
```

Output:

```text
Clear project direction before coding.
```

---

## 24. Phase 1 — Foundation

Duration:

```text
3 weeks
```

Tasks:

```text
Create monorepo
Set up GitHub repository
Set up GitHub Projects Kanban
Set up Docker
Set up backend Express + TypeScript
Set up Supabase project
Create database schema
Set up Supabase Auth
Set up Google OAuth
Create admin scaffold
Create API base structure
Create shared validation schemas
```

Output:

```text
Working technical foundation.
```

---

## 25. Phase 2 — Product System

Duration:

```text
3 weeks
```

Tasks:

```text
Category CRUD
Product CRUD
Product image upload
Product usage instruction
Product listing page
Product detail page
Admin product management
Image storage integration
```

Output:

```text
Usable product catalog system.
```

---

## 26. Phase 3 — Premium Experience

Duration:

```text
2.5 weeks
```

Tasks:

```text
Blender model / scene preparation
GLB/GLTF export
Three.js / React Three Fiber opening
Camera animation
Get Started flow
Skip intro button
Static fallback
Mobile Rive intro
Mobile intro transition
```

Output:

```text
Premium web and mobile opening experience.
```

---

## 27. Phase 4 — Soft Order / Inquiry System

Duration:

```text
2.5 weeks
```

Important:

At this stage, do not build full checkout if delivery operation is not ready.

Build soft order / inquiry instead.

Tasks:

```text
Product inquiry form
Customer contact request
Wishlist or cart draft
User profile basic future
Inquiry history
Admin inquiry view
Inquiry status update
```

Output:

```text
Users can express interest without requiring full delivery operation.
```

---

## 28. Phase 5 — Delivery-Ready Structure

Duration:

```text
1.5 weeks
```

Tasks:

```text
Delivery toggle
Delivery settings
Order status foundation
Delivery configuration
Future delivery staff role
Backend delivery_enabled enforcement
Admin delivery settings page
```

Output:

```text
System is ready to activate delivery later.
```

---

## 29. Phase 6 — Launch Preparation

Duration:

```text
1.5 weeks
```

Tasks:

```text
Performance optimization
SEO setup
Security review
Cloudflare DNS setup
Vercel web deployment
Railway API deployment
Environment variable setup
Final documentation
Android internal testing build
iOS TestFlight optional
```

Important:

```text
App Store / Play Store public submission should not be a launch blocker.
```

Output:

```text
Web MVP launched and mobile build test-ready.
```

---

## 30. MVP Scope

The first real MVP should include:

```text
Public website
Product catalog
Product detail page
Admin login
Product/category management
Image upload
Usage instruction field
Inquiry/contact system
Delivery toggle setting
3D web intro with fallback
Mobile Rive intro prototype
Basic Flutter product browsing
Deployment
Documentation
```

---

## 31. Not MVP / Future Features

Do not build these at the beginning unless MVP is already stable:

```text
Full payment system
Full delivery staff app
Complex order tracking
Microservices
Message queue
Advanced recommendation system
Multi-vendor marketplace
Real-time chat
Heavy real-time 3D mobile scene
```

---

## 32. Critical Rules

The project must follow these rules:

```text
1. Do not start with microservices.
2. Do not over-engineer the backend.
3. Use one backend for web, admin, and mobile.
4. Keep delivery disabled until business operation is ready.
5. Build product catalog first.
6. Build admin CRUD early.
7. 3D intro must have skip and fallback.
8. Mobile app should use Rive/video instead of heavy 3D at first.
9. Security must be handled from the beginning.
10. Working software is more important than perfect diagrams.
```

---

## 33. Final Direction

The correct direction for this project is:

```text
Premium Religious Product Catalog Platform
+ Future Delivery Support
+ 3D Web Experience
+ Flutter Mobile App
+ Admin-Controlled System
```

Recommended architecture:

```text
Layered Monolith / Modular Monolith
```

Recommended process:

```text
Personal Kanban
```

Recommended first launch:

```text
Web-first MVP
```

Recommended mobile strategy:

```text
Basic Flutter app + Rive intro first
Full mobile polish later
```

Recommended delivery strategy:

```text
Delivery-ready architecture now
Full delivery operation later
```

---

## 34. One-Sentence Summary for Another AI Agent

Build a solo-developer-friendly, production-minded religious product catalog platform using Next.js, Flutter, Express TypeScript, Supabase PostgreSQL/Auth/Storage, Cloudflare, Vercel, and Railway, with a premium Three.js web intro, Rive mobile intro, admin-managed product system, and future delivery toggle, following layered monolith architecture and Personal Kanban workflow.

---

## 35. What the AI Agent Should Help With Next

An AI agent can help with:

```text
1. Creating the Project Vision document
2. Writing the SRS / Requirements document
3. Creating use case descriptions
4. Creating ERD
5. Creating sequence diagrams
6. Writing OpenAPI 3.0 YAML
7. Designing the folder structure
8. Creating GitHub issues
9. Writing database schema
10. Building the Express TypeScript backend scaffold
11. Designing the Next.js UI structure
12. Planning the Flutter app architecture
13. Creating security checklist
14. Creating deployment checklist
```

The next recommended step is:

```text
Create docs/01-project-vision.md and docs/02-requirements.md first.
```
