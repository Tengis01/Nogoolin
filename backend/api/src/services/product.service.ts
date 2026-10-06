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

// @internal — pagination хэлбэр нь service return-д харагдана; тусдаа supported API биш.
interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; total_pages: number };
}

// @internal — зөвхөн энэ модулийн хэрэгжилт; caller шууд дуудахгүй.
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
// @internal — зөвхөн энэ модулийн хэрэгжилт; caller шууд дуудахгүй.
function prepareSearch(query: string | undefined): SearchTerms | null {
  const raw = query?.trim();
  if (!raw) return null;
  if (containsCyrillic(raw)) return { raw, transliterated: null };
  const transliterated = latinToCyrillic(raw);
  return { raw, transliterated: transliterated === raw ? null : transliterated };
}

/**
 * Каталог болон admin бүтээгдэхүүний service үүсгэнэ.
 *
 * @param products - Бүтээгдэхүүний repository.
 * @param auditLogs - Admin үйлдлийн бүртгэл.
 * @returns Бүтээгдэхүүн унших, нэмэх, засах, устгах service.
 * @throws Factory өөрөө алдаа шидэхгүй.
 * @example
 * ```ts
 * const service = createProductService(productRepository, auditLogRepository);
 * ```
 */
export function createProductService(
  products: ProductRepository,
  auditLogs: AuditLogRepository,
) {
  return {
    // FR-PUB-001/002, FR-PROD-012/013, FR-PUB-014
    /**
     * Нийтийн каталогийг filter, хайлт, pagination-аар уншина.
     *
     * @param query - Schema шалгасан query; page ≥ 1, limit 1–50. Latin хайлтад кирилл хувилбар нэмнэ.
     * @returns Product data ба page/limit/total/total_pages; total_pages хамгийн багадаа 1.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const page = await service.listPublic(
     *   {
     *     page: 1,
     *     limit: 12,
     *     sort: "newest",
     *     search: "burhan"
     *   }
     * );
     * ```
     */
    async listPublic(query: ProductListQuery): Promise<Paginated<Product>> {
      const result = await products.listPublished(query, prepareSearch(query.search));
      return paginate(result, query.page, query.limit);
    },

    // FR-ADM-004 — all statuses
    /**
     * Бүх status-ийн бүтээгдэхүүнийг admin жагсаалтад уншина.
     *
     * @param query - Schema шалгасан AdminProductListQuery.
     * @returns Product data болон pagination metadata.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const page = await service.listAdmin({ page: 1, limit: 12, status: "draft" });
     * ```
     */
    async listAdmin(query: AdminProductListQuery): Promise<Paginated<Product>> {
      const result = await products.listAll(query);
      return paginate(result, query.page, query.limit);
    },

    // FR-PUB-003/004 — published only
    /**
     * Published бүтээгдэхүүнийг slug-аар уншина.
     *
     * @param slug - Бүтээгдэхүүний slug.
     * @returns Олдсон Product.
     * @throws PRODUCT_NOT_FOUND (404); repository-ийн алдаа дамжина.
     * @example
     * ```ts
     * const product = await service.getPublishedBySlug("nogoon-dari-ekh");
     * ```
     */
    async getPublishedBySlug(slug: string): Promise<Product> {
      const product = await products.findPublishedBySlug(slug);
      if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      return product;
    },

    // UC-ADM-002 — draft by default (DB default), slug auto + dedupe
    /**
     * Давхардалгүй slug-тай бүтээгдэхүүн үүсгэж audit бүртгэнэ.
     *
     * @param input - Schema шалгасан ProductInput; name, category_id, price шаардлагатай.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Үүсгэсэн Product; draft default-ийг database хариуцна.
     * @throws Repository/slug/audit алдаа дамжина; insert ба audit атомик биш.
     * @example
     * ```ts
     * const product = await service.create(
     *   {
     *     name: "Ногоон Дарь эх",
     *     category_id: categoryId,
     *     price: 120000
     *   },
     *   adminId
     * );
     * ```
     */
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
    /**
     * Бүтээгдэхүүнийг засаж status өөрчлөлтөд тохирсон audit бүртгэнэ.
     *
     * @param id - Бүтээгдэхүүний UUID.
     * @param patch - Schema шалгасан ProductPatch.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Зассан Product.
     * @throws PRODUCT_NOT_FOUND (404); repository/audit алдаа дамжина, rollback батлахгүй.
     * @example
     * ```ts
     * const product = await service.update(
     *   productId,
     *   {
     *     status: "published"
     *   },
     *   adminId
     * );
     * ```
     */
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
    /**
     * Бүтээгдэхүүнийг archive хийх эсвэл бүрэн устгана.
     *
     * @param id - Бүтээгдэхүүний UUID.
     * @param hard - true бол hardDelete; false бол status-ийг archived болгоно.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Promise<void>.
     * @throws PRODUCT_NOT_FOUND (404); repository/audit алдаа дамжина.
     * @example
     * ```ts
     * await service.remove(productId, false, adminId);
     * ```
     */
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

/** ProductService нь createProductService-ийн method-уудын inferred contract.
 * @example
 * ```ts
 * type Service = ProductService;
 * ```
 */
export type ProductService = ReturnType<typeof createProductService>;
