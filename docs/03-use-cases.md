# Use Case Specification

**Document:** `docs/03-use-cases.md`  
**Project:** Nogoolin — Premium Religious Product Catalog Platform  
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Tengis (Solo Developer)  
**Last Updated:** June 2026  
**Depends On:** [`docs/02-requirements.md`](./02-requirements.md)

---

## Changelog

| Version | Date | Type | Description |
|---|---|---|---|
| 1.0.0 | June 2026 | MAJOR | Initial version |

---

## Table of Contents

1. [Actors](#1-actors)
2. [Use Case Overview](#2-use-case-overview)
3. [Guest Use Cases](#3-guest-use-cases)
4. [Auth Use Cases](#4-auth-use-cases)
5. [Admin Use Cases](#5-admin-use-cases)
6. [System Use Cases](#6-system-use-cases)
7. [Future Use Cases](#7-future-use-cases)

---

## 1. Actors

| Actor | Type | Description |
|---|---|---|
| **Guest** | Primary | Any unauthenticated visitor on the web or mobile app. No sign-in required for catalog browsing. |
| **Customer** | Primary | An authenticated user who has signed in. Can submit inquiries and manage their profile. Future: place orders. |
| **Admin** | Primary | The business owner or operator. Full access to product management, settings, and inquiry management via the admin panel. |
| **System** | Secondary | Automated system behavior such as token issuance, audit log writing, trigger execution, and delivery toggle enforcement. |
| **Delivery Staff** | Future | Will be able to view and update assigned delivery orders. Not active in MVP. |

---

## 2. Use Case Overview

### Guest

| ID | Use Case | Priority |
|---|---|---|
| UC-G-001 | Watch or Skip 3D Opening Animation | M |
| UC-G-002 | Browse Product Catalog | M |
| UC-G-003 | Filter Products by Category | M |
| UC-G-004 | View Product Detail | M |
| UC-G-005 | View 360° 3D Product Model | M |
| UC-G-006 | View Product Usage Instructions | M |
| UC-G-007 | Submit Product Inquiry | M |
| UC-G-008 | Search Products by Image | C |

### Auth

| ID | Use Case | Priority |
|---|---|---|
| UC-A-001 | Sign In with Email and Password | M |
| UC-A-002 | Sign In with Google OAuth | M |
| UC-A-003 | Sign In with Facebook OAuth | S |
| UC-A-004 | Sign Out | M |

### Admin

| ID | Use Case | Priority |
|---|---|---|
| UC-ADM-001 | Sign In to Admin Panel | M |
| UC-ADM-002 | Create Product | M |
| UC-ADM-003 | Edit Product | M |
| UC-ADM-004 | Publish or Archive Product | M |
| UC-ADM-005 | Upload Product Images | M |
| UC-ADM-006 | Upload 3D Model (GLB) | M |
| UC-ADM-007 | Create Category | M |
| UC-ADM-008 | Edit or Deactivate Category | M |
| UC-ADM-009 | View Inquiry List | M |
| UC-ADM-010 | Update Inquiry Status | M |
| UC-ADM-011 | Toggle Delivery Setting | M |
| UC-ADM-012 | View Audit Log | S |

### System

| ID | Use Case | Priority |
|---|---|---|
| UC-SYS-001 | Auto-create User Profile on OAuth Sign-in | M |
| UC-SYS-002 | Enforce Delivery Toggle at API Level | M |
| UC-SYS-003 | Write Audit Log Entry on Admin Action | M |

### Future

| ID | Use Case | Priority |
|---|---|---|
| UC-F-001 | Place Order | W |
| UC-F-002 | View Own Order History | W |
| UC-F-003 | Cancel Order | W |

---

## 3. Guest Use Cases

---

### UC-G-001 — Watch or Skip 3D Opening Animation

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Guest navigates to the root URL `/` for the first time |
| **Preconditions** | Guest has not visited the site before (or has cleared session) |
| **Postconditions** | Guest lands on the home page |

**Main Flow:**
1. Guest navigates to `/`
2. System begins loading the 3D GLB model in the background
3. System displays a loading indicator while the model loads
4. System plays the 3D opening animation (Green Tara model, circular camera movement)
5. Animation completes; System displays the "Get Started" button
6. Guest clicks "Get Started"
7. System navigates Guest to the home page

**Alternative Flow A — Skip Intro:**
- At step 3 or 4, Guest clicks "Skip Intro"
- System immediately navigates Guest to the home page

**Alternative Flow B — Returning Visitor:**
- Guest has visited before (session flag set)
- System skips the animation and navigates directly to the home page

**Alternative Flow C — Reduced Motion:**
- Guest OS has `prefers-reduced-motion` enabled
- System skips animation and shows the "Get Started" button immediately over a static hero image

**Exception Flow — WebGL Unavailable:**
- System detects WebGL is not supported or device performance is insufficient
- System displays a static fallback image instead of the 3D model
- System shows the "Get Started" button immediately

---

### UC-G-002 — Browse Product Catalog

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Guest navigates to `/products` or clicks a catalog link |
| **Preconditions** | At least one published product exists |
| **Postconditions** | Guest sees a paginated list of published products |

**Main Flow:**
1. Guest navigates to `/products`
2. System fetches all published products from `GET /api/v1/products`
3. System displays products in a grid layout with thumbnail image, name, and price
4. System paginates results (default: 12 per page)
5. Guest scrolls or navigates to the next page

**Alternative Flow — No Products:**
- No published products exist in the database
- System displays an empty state message

**Alternative Flow — Filter Applied:**
- Guest selects a category (see UC-G-003)
- System refetches with category filter applied

---

### UC-G-003 — Filter Products by Category

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Guest selects a category from the filter UI or navigates to `/categories/[slug]` |
| **Preconditions** | At least one active category exists |
| **Postconditions** | Guest sees only products belonging to the selected category |

**Main Flow:**
1. Guest views the product listing page
2. System displays a list of active categories as filter options
3. Guest selects a category
4. System fetches products filtered by `category_id` from `GET /api/v1/products?category_id=[id]`
5. System updates the product list to show only matching products
6. System updates the URL to reflect the selected category

**Alternative Flow — No Products in Category:**
- The selected category has no published products
- System displays an empty state message specific to that category

---

### UC-G-004 — View Product Detail

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Guest clicks on a product card or navigates directly to `/products/[slug]` |
| **Preconditions** | Product with the given slug exists and has status `published` |
| **Postconditions** | Guest sees full product information |

**Main Flow:**
1. Guest navigates to `/products/[slug]`
2. System fetches product data from `GET /api/v1/products/[slug]`
3. System renders the product detail page with: name, image gallery, price, short description, full description, usage instructions, stock status, category
4. If `model_3d_url` exists, System renders the 360° 3D viewer (see UC-G-005)
5. Guest reads product information

**Alternative Flow — Product Not Found:**
- No published product exists with the given slug
- System returns HTTP 404
- System displays a "Product not found" page with a link back to the catalog

**Alternative Flow — Out of Stock:**
- Product `stock_status` is `out_of_stock`
- System displays stock status badge; inquiry form remains accessible

---

### UC-G-005 — View 360° 3D Product Model

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Product detail page loads and product has `model_3d_url` set |
| **Preconditions** | Guest is on a product detail page; `model_3d_url` is present; WebGL is available |
| **Postconditions** | Guest has interacted with the 3D model |

**Main Flow:**
1. System loads the GLB file from `model_3d_url` (Supabase Storage CDN)
2. System displays a loading indicator while the model downloads
3. System renders the model in the Three.js viewer with OrbitControls (web) or `model_viewer_plus` (mobile)
4. Guest rotates the model by dragging (mouse / touch)
5. Guest zooms with scroll wheel or pinch gesture
6. Guest pans by right-click drag (web) or two-finger drag (mobile)

**Alternative Flow — No 3D Model:**
- `model_3d_url` is null
- System does not render the 3D viewer
- System shows the image gallery as the primary visual

**Exception Flow — GLB Load Failure:**
- The GLB file fails to load (network error, corrupted file)
- System falls back to the image gallery silently
- System logs the error

---

### UC-G-006 — View Product Usage Instructions

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Guest scrolls to the usage instructions section on the product detail page |
| **Preconditions** | Guest is on a product detail page; product has `usage_instruction` content |
| **Postconditions** | Guest has read the usage instructions |

**Main Flow:**
1. Guest is on the product detail page
2. System renders the `usage_instruction` field as formatted text (markdown rendered)
3. Guest reads the instructions

**Alternative Flow — No Instructions:**
- Product has no `usage_instruction` content
- System does not render the section; no empty placeholder shown

---

### UC-G-007 — Submit Product Inquiry

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Guest clicks "Inquire" or "Contact" button on a product detail page |
| **Preconditions** | Guest is on a product detail page or the contact page |
| **Postconditions** | Inquiry is saved with status `new`; Guest receives confirmation |

**Main Flow:**
1. Guest clicks the inquiry/contact button
2. System displays the inquiry form: customer name, phone number, message, and pre-filled product reference
3. Guest fills in the form fields
4. Guest submits the form
5. System validates all required fields (client-side)
6. System sends `POST /api/v1/inquiries` with form data
7. System validates fields server-side and checks rate limit (3 per IP per hour)
8. System saves the inquiry to the database with status `new`
9. System displays a success confirmation message to the Guest

**Alternative Flow — Validation Failure:**
- Required fields are empty or phone number format is invalid
- System highlights the invalid fields with error messages
- Guest corrects the fields and resubmits

**Exception Flow — Rate Limit Exceeded:**
- Guest has submitted 3 inquiries within the past hour from the same IP
- System returns HTTP 429
- System displays a message: "Too many submissions. Please try again later."

---

### UC-G-008 — Search Products by Image *(Future — C Priority)*

| Field | Value |
|---|---|
| **Actor** | Guest |
| **Trigger** | Guest clicks the camera/image search button |
| **Preconditions** | pgvector extension enabled; product image embeddings exist |
| **Postconditions** | Guest sees visually similar products |

**Main Flow:**
1. Guest taps the image search button
2. System prompts Guest to upload an image or take a photo
3. Guest provides an image
4. System sends the image to the embedding API (CLIP or equivalent)
5. System queries Supabase pgvector for nearest-neighbor product images
6. System returns the top matching products
7. System displays results as a product grid

---

## 4. Auth Use Cases

---

### UC-A-001 — Sign In with Email and Password

| Field | Value |
|---|---|
| **Actor** | Admin, Customer |
| **Trigger** | User navigates to `/sign-in` or `/admin/sign-in` |
| **Preconditions** | User account exists in Supabase Auth |
| **Postconditions** | User is authenticated; JWT access token and refresh token are issued |

**Main Flow:**
1. User navigates to the sign-in page
2. System displays the sign-in form (email, password)
3. User enters credentials and submits
4. System sends credentials to Supabase Auth
5. Supabase Auth validates credentials and returns JWT access token and refresh token
6. System stores tokens securely (httpOnly cookie or secure storage)
7. System redirects user to the appropriate home page (admin → `/admin/dashboard`, customer → `/`)

**Alternative Flow — Invalid Credentials:**
- Supabase Auth rejects the credentials
- System displays: "Invalid email or password"
- User remains on the sign-in page

**Exception Flow — Rate Limit:**
- Auth endpoint receives more than 5 requests in 15 minutes from the same IP
- System returns HTTP 429
- System displays: "Too many sign-in attempts. Please wait."

---

### UC-A-002 — Sign In with Google OAuth

| Field | Value |
|---|---|
| **Actor** | Admin, Customer |
| **Trigger** | User clicks "Sign in with Google" |
| **Preconditions** | Google OAuth is configured in Supabase; PKCE flow is enabled |
| **Postconditions** | User is authenticated; profile row exists in `public.users` |

**Main Flow:**
1. User clicks "Sign in with Google"
2. System initiates PKCE OAuth flow with Supabase Auth
3. System redirects user to Google consent screen
4. User grants permission
5. Google redirects back to the callback URL with authorization code
6. System exchanges code for tokens via Supabase Auth
7. If user is new: System (trigger) auto-creates a row in `public.users` with role `customer`
8. System redirects user to the appropriate page

**Exception Flow — OAuth Denied:**
- User denies permission on Google consent screen
- System returns user to the sign-in page with a neutral message

---

### UC-A-004 — Sign Out

| Field | Value |
|---|---|
| **Actor** | Admin, Customer |
| **Trigger** | User clicks "Sign Out" |
| **Preconditions** | User is authenticated |
| **Postconditions** | Session is invalidated; tokens are cleared |

**Main Flow:**
1. User clicks "Sign Out"
2. System calls Supabase Auth `signOut()`
3. System clears stored tokens from client
4. System redirects user to the sign-in page or home page

---

## 5. Admin Use Cases

---

### UC-ADM-001 — Sign In to Admin Panel

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin navigates to any `/admin` route |
| **Preconditions** | None |
| **Postconditions** | Admin is authenticated and on the dashboard |

**Main Flow:**
1. Admin navigates to `/admin`
2. System checks for valid session
3. No valid session: System redirects to `/admin/sign-in`
4. Admin signs in (see UC-A-001 or UC-A-002)
5. System verifies user role = `admin`
6. System redirects to `/admin/dashboard`

**Exception Flow — Non-Admin User:**
- Authenticated user has role `customer`
- System returns HTTP 403 and redirects to sign-in page with error message

---

### UC-ADM-002 — Create Product

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin clicks "New Product" in the admin panel |
| **Preconditions** | Admin is authenticated; at least one active category exists |
| **Postconditions** | New product exists in database with status `draft` |

**Main Flow:**
1. Admin navigates to `/admin/products/new`
2. System renders the product creation form
3. Admin fills in: name, category, price, short description, full description, usage instructions, stock status
4. Admin selects `is_featured` if applicable
5. Admin clicks "Save as Draft"
6. System validates all fields with Zod schema
7. System sends `POST /api/v1/admin/products`
8. System auto-generates a slug from the product name
9. System saves the product with status `draft`
10. System redirects Admin to the product edit page
11. System writes an audit log entry

**Alternative Flow — Validation Error:**
- Required fields are empty or price is not a valid number
- System highlights invalid fields with error messages
- Admin corrects and resubmits

---

### UC-ADM-003 — Edit Product

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin clicks "Edit" on a product in the product list |
| **Preconditions** | Admin is authenticated; product exists |
| **Postconditions** | Product is updated; audit log entry written |

**Main Flow:**
1. Admin navigates to `/admin/products/[id]/edit`
2. System loads current product data
3. Admin modifies one or more fields
4. Admin clicks "Save Changes"
5. System validates the updated fields
6. System sends `PATCH /api/v1/admin/products/[id]`
7. System updates the product in the database
8. System shows a success notification
9. System writes an audit log entry

---

### UC-ADM-004 — Publish or Archive Product

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin clicks "Publish" or "Archive" on a product |
| **Preconditions** | Product exists; Admin is authenticated |
| **Postconditions** | Product status is updated; audit log entry written |

**Main Flow (Publish):**
1. Admin views a product with status `draft`
2. Admin clicks "Publish"
3. System displays a confirmation dialog
4. Admin confirms
5. System sends `PATCH /api/v1/admin/products/[id]` with `status: published`
6. System updates the product; it is now visible on the public catalog
7. System writes an audit log entry

**Main Flow (Archive):**
1. Admin views a published product
2. Admin clicks "Archive"
3. System displays a confirmation dialog
4. Admin confirms
5. System sends `PATCH /api/v1/admin/products/[id]` with `status: archived`
6. Product is no longer visible on the public catalog
7. System writes an audit log entry

---

### UC-ADM-005 — Upload Product Images

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin clicks "Add Images" on the product edit page |
| **Preconditions** | Admin is on the product edit page |
| **Postconditions** | Images are stored in Supabase Storage; `product_images` records created |

**Main Flow:**
1. Admin clicks "Add Images"
2. System opens a file picker (accepts jpg, jpeg, png, webp; max 5MB each)
3. Admin selects one or more image files
4. System validates file type and size on the client side
5. System uploads valid files to Supabase Storage `product-images` bucket
6. System creates `product_images` records with `image_url`, `alt_text` (from file name), `sort_order`
7. System displays the uploaded images in the image management UI

**Alternative Flow — Invalid File:**
- Admin selects a file that exceeds 5MB or has a disallowed type
- System displays an error: "Invalid file. Allowed: jpg, jpeg, png, webp. Max size: 5MB."
- Invalid files are not uploaded; valid files in the same batch proceed

**Exception Flow — Upload Failure:**
- Supabase Storage upload fails (network error)
- System displays an error notification
- No database record is created for the failed file

---

### UC-ADM-006 — Upload 3D Model (GLB)

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin clicks "Upload 3D Model" on the product edit page |
| **Preconditions** | Admin has a Draco-compressed GLB file (≤ 5MB) prepared via Meshy AI + gltf-pipeline workflow |
| **Postconditions** | GLB file stored in Supabase Storage; `products.model_3d_url` updated |

**Main Flow:**
1. Admin clicks "Upload 3D Model"
2. System opens a file picker (accepts .glb, .gltf only; max 10MB)
3. Admin selects the GLB file
4. System validates file type and size on the client side
5. System uploads the file to Supabase Storage `model-assets` bucket with a unique path
6. System updates `products.model_3d_url` with the storage URL
7. System shows a success notification and a preview of the 3D model

**Alternative Flow — Replace Existing Model:**
- A `model_3d_url` already exists for the product
- Admin uploads a new file
- System overwrites the old file in storage and updates `model_3d_url`

**Alternative Flow — Remove Model:**
- Admin clicks "Remove 3D Model"
- System deletes the file from storage
- System sets `model_3d_url` to null

---

### UC-ADM-007 — Create Category

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin clicks "New Category" |
| **Preconditions** | Admin is authenticated |
| **Postconditions** | New active category exists in database |

**Main Flow:**
1. Admin navigates to `/admin/categories/new`
2. Admin fills in: name, description, sort order
3. Admin submits the form
4. System validates and sends `POST /api/v1/admin/categories`
5. System auto-generates a unique slug from the name
6. System saves the category with `is_active = true`
7. System writes an audit log entry

**Exception Flow — Duplicate Slug:**
- Generated slug already exists
- System appends a numeric suffix to make it unique (e.g., `incense-2`)

---

### UC-ADM-009 — View Inquiry List

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin navigates to `/admin/inquiries` |
| **Preconditions** | Admin is authenticated |
| **Postconditions** | Admin sees a list of all inquiries |

**Main Flow:**
1. Admin navigates to `/admin/inquiries`
2. System fetches inquiries from `GET /api/v1/admin/inquiries`, sorted by newest first
3. System displays: customer name, phone, product name, message preview, status, submitted date
4. Admin can filter by status (`new`, `contacted`, `closed`)

---

### UC-ADM-010 — Update Inquiry Status

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin selects a new status for an inquiry |
| **Preconditions** | Admin is on the inquiry list or detail view |
| **Postconditions** | Inquiry status is updated; audit log entry written |

**Main Flow:**
1. Admin views an inquiry
2. Admin changes the status dropdown: `new` → `contacted` → `closed`
3. System sends `PATCH /api/v1/admin/inquiries/[id]/status`
4. System updates the status in the database
5. System writes an audit log entry

---

### UC-ADM-011 — Toggle Delivery Setting

| Field | Value |
|---|---|
| **Actor** | Admin |
| **Trigger** | Admin navigates to `/admin/settings` and toggles the delivery switch |
| **Preconditions** | Admin is authenticated with role `admin` |
| **Postconditions** | `delivery_enabled` setting updated; audit log entry written |

**Main Flow (Enable Delivery):**
1. Admin navigates to `/admin/settings`
2. System displays current `delivery_enabled` state: OFF
3. Admin toggles the switch to ON
4. System displays a confirmation dialog: "Enabling delivery will allow customers to place orders. Continue?"
5. Admin confirms
6. System sends `PATCH /api/v1/admin/settings/delivery` with `{ delivery_enabled: true }`
7. System updates `system_settings` table
8. System writes an audit log entry with `action: DELIVERY_TOGGLE`, `metadata: { from: false, to: true }`
9. System shows a success notification

**Main Flow (Disable Delivery):**
- Steps mirror the above with `delivery_enabled: false`
- Confirmation dialog: "Disabling delivery will prevent new orders. Existing orders are not affected."

**Exception Flow — Non-Admin Attempt:**
- A non-admin user attempts `PATCH /api/v1/admin/settings/delivery`
- System returns HTTP 403
- System writes a failed-access audit log entry

---

## 6. System Use Cases

---

### UC-SYS-001 — Auto-create User Profile on OAuth Sign-in

| Field | Value |
|---|---|
| **Actor** | System |
| **Trigger** | A new user is created in Supabase Auth via social login |
| **Preconditions** | OAuth sign-in is successful; no existing row in `public.users` for this `auth.users.id` |
| **Postconditions** | A row in `public.users` exists with role `customer` |

**Main Flow:**
1. User successfully signs in via Google/Facebook OAuth
2. Supabase Auth creates a new row in `auth.users`
3. A database trigger (`on_auth_user_created`) fires automatically
4. Trigger inserts a row into `public.users`: `{ id, email, full_name, role: 'customer' }`
5. User is redirected to the app

---

### UC-SYS-002 — Enforce Delivery Toggle at API Level

| Field | Value |
|---|---|
| **Actor** | System |
| **Trigger** | A request is received at `POST /api/v1/orders` |
| **Preconditions** | None |
| **Postconditions** | If `delivery_enabled = false`, the request is rejected |

**Main Flow:**
1. System receives `POST /api/v1/orders`
2. System queries `system_settings` for `delivery_enabled`
3. `delivery_enabled = false`: System returns HTTP 403 with `{ error: "Order placement is currently disabled" }`
4. `delivery_enabled = true`: System proceeds with order creation flow

---

### UC-SYS-003 — Write Audit Log Entry on Admin Action

| Field | Value |
|---|---|
| **Actor** | System |
| **Trigger** | An admin performs a create, update, delete, or settings-change operation |
| **Preconditions** | Admin is authenticated |
| **Postconditions** | An immutable audit log entry exists in `audit_logs` |

**Main Flow:**
1. Admin performs an action (e.g., publishes a product)
2. Service layer calls the audit log repository after the primary operation succeeds
3. System writes: `{ admin_id, action, entity_type, entity_id, metadata, created_at }`
4. The entry is append-only and cannot be modified or deleted

---

## 7. Future Use Cases

> These use cases are defined for architectural reference. They are not implemented in MVP. They are gated by `delivery_enabled = true`.

---

### UC-F-001 — Place Order *(Future)*

| Field | Value |
|---|---|
| **Actor** | Customer |
| **Preconditions** | Customer is authenticated; `delivery_enabled = true`; cart has at least one item |

**Main Flow:**
1. Customer reviews cart
2. Customer enters delivery address and phone number
3. Customer submits the order
4. System validates `delivery_enabled = true` at the API level
5. System creates an `orders` record with status `pending`
6. System creates `order_items` records for each cart item
7. System returns order confirmation with order ID
8. System notifies Admin of the new order (future: push notification or email)

---

### UC-F-002 — View Own Order History *(Future)*

| Field | Value |
|---|---|
| **Actor** | Customer |
| **Preconditions** | Customer is authenticated; has at least one past order |

**Main Flow:**
1. Customer navigates to `/profile/orders`
2. System fetches orders from `GET /api/v1/orders/me`
3. System displays orders sorted by newest first: order ID, date, total, status
4. Customer clicks an order to view detail (items, delivery status)

---

*Previous document: [`docs/02-requirements.md`](./02-requirements.md)*  
*Next document: [`docs/04-er-diagram.md`](./04-er-diagram.md)*
