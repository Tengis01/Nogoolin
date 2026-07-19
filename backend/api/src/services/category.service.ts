import type { Category, CategoryInput, CategoryPatch } from '@nogoolin/validation-schemas';
import type { AuditLogRepository, CategoryRepository } from '../repositories/types.js';
import { conflict, notFound } from '../lib/errors.js';
import { slugify, uniqueSlug } from '../lib/slug.js';

export function createCategoryService(
  categories: CategoryRepository,
  auditLogs: AuditLogRepository,
) {
  return {
    // FR-CAT-007 / FR-PUB-005
    async listActive(): Promise<Category[]> {
      return categories.listActive();
    },

    // FR-ADM-005 — admin management table (includes inactive + counts)
    async listAdmin() {
      return categories.listAllWithCounts();
    },

    // FR-PUB-008 — 404 when inactive or missing
    async getBySlug(slug: string): Promise<Category> {
      const category = await categories.findBySlug(slug);
      if (!category) throw notFound('Category not found', 'CATEGORY_NOT_FOUND');
      return category;
    },

    // UC-ADM-007 — slug auto-generated + numeric-suffix dedupe
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

export type CategoryService = ReturnType<typeof createCategoryService>;
