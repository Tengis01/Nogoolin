import type {
  AdminProductListQuery,
  Product,
  ProductInput,
  ProductListQuery,
  ProductPatch,
} from '@nogoolin/validation-schemas';
import type {
  AuditLogRepository,
  ProductRepository,
  SearchTerms,
} from '../repositories/types.js';
import { notFound } from '../lib/errors.js';
import { slugify, uniqueSlug } from '../lib/slug.js';
import { containsCyrillic, latinToCyrillic } from '../lib/translit.js';

interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; total_pages: number };
}

function paginate<T>(
  result: { data: T[]; total: number },
  page: number,
  limit: number,
): Paginated<T> {
  return {
    data: result.data,
    meta: {
      page,
      limit,
      total: result.total,
      total_pages: Math.max(1, Math.ceil(result.total / limit)),
    },
  };
}

// SEQ-003: detect script; Latin queries are additionally searched as their
// Cyrillic transliteration so both forms match (FR-PUB-014).
function prepareSearch(query: string | undefined): SearchTerms | null {
  const raw = query?.trim();
  if (!raw) return null;
  if (containsCyrillic(raw)) return { raw, transliterated: null };
  const transliterated = latinToCyrillic(raw);
  return { raw, transliterated: transliterated === raw ? null : transliterated };
}

export function createProductService(
  products: ProductRepository,
  auditLogs: AuditLogRepository,
) {
  return {
    // FR-PUB-001/002, FR-PROD-012/013, FR-PUB-014
    async listPublic(query: ProductListQuery): Promise<Paginated<Product>> {
      const result = await products.listPublished(query, prepareSearch(query.search));
      return paginate(result, query.page, query.limit);
    },

    // FR-ADM-004 — all statuses
    async listAdmin(query: AdminProductListQuery): Promise<Paginated<Product>> {
      const result = await products.listAll(query);
      return paginate(result, query.page, query.limit);
    },

    // FR-PUB-003/004 — published only
    async getPublishedBySlug(slug: string): Promise<Product> {
      const product = await products.findPublishedBySlug(slug);
      if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      return product;
    },

    // UC-ADM-002 — draft by default (DB default), slug auto + dedupe
    async create(input: ProductInput, adminId: string): Promise<Product> {
      const slug = await uniqueSlug(
        input.slug ?? slugify(input.name),
        (s) => products.slugExists(s),
      );
      const product = await products.create({ ...input, slug });
      await auditLogs.log({
        admin_id: adminId,
        action: 'PRODUCT_CREATE',
        entity_type: 'product',
        entity_id: product.id,
        metadata: { name: product.name, slug: product.slug },
      });
      return product;
    },

    // UC-ADM-003/004 — general edits, publish/archive, tags, model URL
    async update(id: string, patch: ProductPatch, adminId: string): Promise<Product> {
      const before = await products.findById(id);
      if (!before) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      const product = await products.update(id, patch);
      if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');

      // Status transitions get their own audit action (UC-ADM-004, FR-AUD-001)
      const action =
        patch.status && patch.status !== before.status
          ? patch.status === 'published'
            ? 'PRODUCT_PUBLISH'
            : patch.status === 'archived'
              ? 'PRODUCT_ARCHIVE'
              : 'PRODUCT_UPDATE'
          : 'PRODUCT_UPDATE';

      await auditLogs.log({
        admin_id: adminId,
        action,
        entity_type: 'product',
        entity_id: id,
        metadata: { fields: Object.keys(patch) },
      });
      return product;
    },

    // DELETE /admin/products/{id} — soft (archive) by default; ?hard=true
    // permanently deletes with image cascade (FR-PROD-011)
    async remove(id: string, hard: boolean, adminId: string): Promise<void> {
      const product = await products.findById(id);
      if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');

      if (hard) {
        await products.hardDelete(id);
      } else {
        await products.update(id, { status: 'archived' });
      }
      await auditLogs.log({
        admin_id: adminId,
        action: hard ? 'PRODUCT_HARD_DELETE' : 'PRODUCT_ARCHIVE',
        entity_type: 'product',
        entity_id: id,
        metadata: { name: product.name, hard },
      });
    },
  };
}

export type ProductService = ReturnType<typeof createProductService>;
