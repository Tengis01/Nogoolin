import type { Category, CategoryInput, CategoryPatch } from '@nogoolin/validation-schemas';
import type { AuditLogRepository, CategoryRepository } from '../repositories/types.js';
import { conflict, notFound } from '../lib/errors.js';
import { slugify, uniqueSlug } from '../lib/slug.js';

/**
 * Ангилал удирдах service үүсгэнэ; admin эрхийг controller шалгана.
 *
 * @param categories - Ангиллын repository.
 * @param auditLogs - Admin үйлдлийг бүртгэх repository.
 * @returns Ангилал унших, нэмэх, засах, устгах service.
 * @throws Factory өөрөө алдаа шидэхгүй.
 * @example
 * ```ts
 * const service = createCategoryService(categoryRepository, auditLogRepository);
 * ```
 */
export function createCategoryService(
  categories: CategoryRepository,
  auditLogs: AuditLogRepository,
) {
  return {
    // FR-CAT-007 / FR-PUB-005
    /**
     * Идэвхтэй ангиллуудыг уншина.
     *
     * @returns Category жагсаалт; эрэмбийг repository тогтооно.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const categories = await service.listActive();
     * ```
     */
    async listActive(): Promise<Category[]> {
      return categories.listActive();
    },

    // FR-ADM-005 — admin management table (includes inactive + counts)
    /**
     * Admin жагсаалтад бүх ангилал болон бүтээгдэхүүний тоог уншина.
     *
     * @returns Category ба product_count бүхий жагсаалт.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const categories = await service.listAdmin();
     * ```
     */
    async listAdmin() {
      return categories.listAllWithCounts();
    },

    // FR-PUB-008 — 404 when inactive or missing
    /**
     * Slug-аар repository-ийн буцаасан ангиллыг уншина.
     *
     * @param slug - Ангиллын slug.
     * @returns Олдсон Category.
     * @throws CATEGORY_NOT_FOUND (404) — repository null буцаасан; бусад repository алдаа дамжина.
     * @example
     * ```ts
     * const category = await service.getBySlug("burhan");
     * ```
     */
    async getBySlug(slug: string): Promise<Category> {
      const category = await categories.findBySlug(slug);
      if (!category) throw notFound('Category not found', 'CATEGORY_NOT_FOUND');
      return category;
    },

    // UC-ADM-007 — slug auto-generated + numeric-suffix dedupe
    /**
     * Давхардалгүй slug үүсгэж ангилал нэмээд audit бүртгэнэ.
     *
     * @param input - Controller-оор schema шалгасан CategoryInput.
     * @param adminId - Controller-оор admin эрх баталгаажсан UUID.
     * @returns Үүсгэсэн Category.
     * @throws Repository, slug эсвэл audit алдаа дамжина; audit алдаа нь өмнөх insert-ийг rollback хийхгүй.
     * @example
     * ```ts
     * const category = await service.create(
     *   {
     *     name: "Бурхан",
     *     slug: "burhan"
     *   },
     *   adminId
     * );
     * ```
     */
    async create(input: CategoryInput, adminId: string): Promise<Category> {
      const slug = await uniqueSlug(
        input.slug ?? slugify(input.name),
        (s) => categories.slugExists(s),
      );
      const category = await categories.create({ ...input, slug });
      await auditLogs.log({
        admin_id: adminId,
        action: 'CATEGORY_CREATE',
        entity_type: 'category',
        entity_id: category.id,
        metadata: { name: category.name, slug: category.slug },
      });
      return category;
    },

    // UC-ADM-008 — includes deactivation (FR-CAT-003)
    /**
     * Ангиллыг хэсэгчлэн засаж audit бүртгэнэ.
     *
     * @param id - Ангиллын UUID.
     * @param patch - Шалгасан CategoryPatch.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Зассан Category.
     * @throws CATEGORY_NOT_FOUND (404); repository/audit алдаа дамжина, rollback батлахгүй.
     * @example
     * ```ts
     * const category = await service.update(
     *   categoryId,
     *   {
     *     is_active: false
     *   },
     *   adminId
     * );
     * ```
     */
    async update(id: string, patch: CategoryPatch, adminId: string): Promise<Category> {
      const category = await categories.update(id, patch);
      if (!category) throw notFound('Category not found', 'CATEGORY_NOT_FOUND');
      await auditLogs.log({
        admin_id: adminId,
        action: 'CATEGORY_UPDATE',
        entity_type: 'category',
        entity_id: id,
        metadata: { fields: Object.keys(patch) },
      });
      return category;
    },

    // FR-CAT-004 — only deletable when no products are assigned
    /**
     * Бүтээгдэхүүнгүй ангиллыг устгаж audit бүртгэнэ.
     *
     * @param id - Ангиллын UUID.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Promise<void>.
     * @throws CATEGORY_NOT_FOUND (404), CATEGORY_NOT_EMPTY (409); repository/audit алдаа дамжина.
     * @example
     * ```ts
     * await service.remove(emptyCategoryId, adminId);
     * ```
     */
    async remove(id: string, adminId: string): Promise<void> {
      const category = await categories.findById(id);
      if (!category) throw notFound('Category not found', 'CATEGORY_NOT_FOUND');
      const productCount = await categories.countProducts(id);
      if (productCount > 0) {
        throw conflict(
          'Category has products assigned and cannot be deleted',
          'CATEGORY_NOT_EMPTY',
        );
      }
      await categories.delete(id);
      await auditLogs.log({
        admin_id: adminId,
        action: 'CATEGORY_DELETE',
        entity_type: 'category',
        entity_id: id,
        metadata: { name: category.name },
      });
    },
  };
}

/** CategoryService нь createCategoryService-ийн method-уудын inferred contract.
 * @example
 * ```ts
 * type Service = CategoryService;
 * ```
 */
export type CategoryService = ReturnType<typeof createCategoryService>;
