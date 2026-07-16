import type {
  Category,
  Product,
  ProductListQuery,
  PublicSettings,
} from '@nogoolin/validation-schemas';

// ─────────────────────────────────────────────────────────────
// DB-AGNOSTIC REPOSITORY INTERFACES
//
// The rest of the app (services, controllers) depends ONLY on these
// interfaces — never on Supabase types. This is the isolation that
// enables a future off-Supabase migration without touching services
// (CLAUDE.md layered-architecture rule / NFR-MAIN-001).
//
// Concrete Supabase implementations live in ./supabase/.
// Add new entity interfaces here as features are built.
// ─────────────────────────────────────────────────────────────

export interface SettingsRepository {
  /** FR-PUB-009 — public delivery_enabled flag */
  getPublicSettings(): Promise<PublicSettings>;
  /** FR-SET-003 — admin-only; caller must already be authorized */
  setDeliveryEnabled(enabled: boolean): Promise<void>;
}

export interface ProductRepository {
  /** FR-PUB-001/002, FR-PROD-012/013 — published products, filtered + paginated */
  listPublished(query: ProductListQuery): Promise<{ data: Product[]; total: number }>;
  /** FR-PUB-003 — single published product by slug */
  findBySlug(slug: string): Promise<Product | null>;
}

export interface CategoryRepository {
  /** FR-PUB-005 — active categories ordered by sort_order */
  listActive(): Promise<Category[]>;
}

export interface AuditLogRepository {
  /**
   * FR-AUD-001/002 — written via service_role AFTER the primary operation
   * succeeds (UC-SYS-003). The only legitimate RLS bypass besides the
   * auth sign-up trigger.
   */
  log(entry: {
    admin_id: string;
    action: string;
    entity_type: string;
    entity_id?: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<void>;
}
