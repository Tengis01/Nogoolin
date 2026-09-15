import type {
  AdminInquiryListQuery,
  AdminProductListQuery,
  CartItem,
  Category,
  CategoryInput,
  CategoryPatch,
  Inquiry,
  InquiryInput,
  InquiryStatus,
  Product,
  ProductImage,
  ProductInput,
  ProductListQuery,
  ProductPatch,
  PublicSettings,
  UserRole,
} from '@nogoolin/validation-schemas';

// ─────────────────────────────────────────────────────────────
// DB-AGNOSTIC REPOSITORY INTERFACES
//
// Services and controllers depend ONLY on these interfaces — never on
// Supabase types (NFR-MAIN-001; enables future off-Supabase migration).
// Concrete Supabase implementations live in ./supabase/.
// Repositories are role-AGNOSTIC: RBAC enforcement happens in the
// controller-layer hooks, never here.
// ─────────────────────────────────────────────────────────────

export interface UserRepository {
  findAuthProfile(id: string): Promise<{ id: string; role: UserRole } | null>;
}

export interface SettingsRepository {
  getPublicSettings(): Promise<PublicSettings>;
  setDeliveryEnabled(enabled: boolean): Promise<void>;
}

/** Search terms prepared by the service layer (FR-PUB-014) */
export interface SearchTerms {
  /** the raw query as typed */
  raw: string;
  /** Cyrillic transliteration when the query was Latin; null otherwise */
  transliterated: string | null;
}

export interface CategoryRepository {
  /** FR-CAT-007 / FR-PUB-005 — active categories ordered by sort_order */
  listActive(): Promise<Category[]>;
  /** FR-ADM-005 — admin list: includes inactive, with product counts */
  listAllWithCounts(): Promise<Array<Category & { product_count: number }>>;
  findBySlug(slug: string): Promise<Category | null>;
  findById(id: string): Promise<Category | null>;
  slugExists(slug: string): Promise<boolean>;
  create(data: CategoryInput & { slug: string }): Promise<Category>;
  /** returns null when the id does not exist */
  update(id: string, patch: CategoryPatch): Promise<Category | null>;
  delete(id: string): Promise<void>;
  /** FR-CAT-004 — deletion guard */
  countProducts(categoryId: string): Promise<number>;
}

export interface ProductRepository {
  /** Public list: published only, filters + multi-script search + sort */
  listPublished(
    query: ProductListQuery,
    search: SearchTerms | null,
  ): Promise<{ data: Product[]; total: number }>;
  /** Admin list: any status (FR-ADM-004) */
  listAll(query: AdminProductListQuery): Promise<{ data: Product[]; total: number }>;
  /** FR-PUB-003 — published only, with images + category */
  findPublishedBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  slugExists(slug: string): Promise<boolean>;
  create(data: ProductInput & { slug: string }): Promise<Product>;
  /** returns null when the id does not exist */
  update(id: string, patch: ProductPatch): Promise<Product | null>;
  hardDelete(id: string): Promise<void>;
}

export interface ProductImageRepository {
  findById(productId: string, imageId: string): Promise<ProductImage | null>;
  nextSortOrder(productId: string): Promise<number>;
  insert(record: {
    product_id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
  }): Promise<ProductImage>;
  update(
    imageId: string,
    patch: { sort_order?: number; alt_text?: string },
  ): Promise<ProductImage>;
  delete(imageId: string): Promise<void>;
}

/** Object-storage port (Supabase Storage today; keeps services storage-agnostic) */
export interface FileStorage {
  /** uploads and returns the public URL; throws on upstream failure */
  uploadPublic(
    bucket: string,
    path: string,
    data: Buffer,
    contentType: string,
  ): Promise<string>;
  remove(bucket: string, path: string): Promise<void>;
}

export interface InquiryRepository {
  /** Create a `new` inquiry; customer_id is NULL for guests (FR-INQ-001) */
  create(data: InquiryInput & { customer_id: string | null }): Promise<Inquiry>;
  /** Admin inbox — filters + newest-first pagination (FR-INQ-004/006) */
  listAll(query: AdminInquiryListQuery): Promise<{ data: Inquiry[]; total: number }>;
  /** A customer's OWN inquiries, newest first (customer_id = caller) */
  listByCustomer(customerId: string): Promise<Inquiry[]>;
  /** returns null when the id does not exist */
  updateStatus(id: string, status: InquiryStatus): Promise<Inquiry | null>;
}

export interface CartRepository {
  /** The caller's saved items, newest first, with product summaries */
  listByUser(userId: string): Promise<CartItem[]>;
  /** Idempotent add (UNIQUE(user_id, product_id)); returns the row */
  add(userId: string, productId: string): Promise<CartItem>;
  /** Remove one product; returns false when it was not in the list */
  remove(userId: string, productId: string): Promise<boolean>;
}

export interface AuditLogRepository {
  log(entry: {
    admin_id: string;
    action: string;
    entity_type: string;
    entity_id?: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<void>;
}
