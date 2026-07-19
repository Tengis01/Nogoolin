import type { FastifyInstance } from 'fastify';
import {
  categoryInputSchema,
  categoryPatchSchema,
  type CategoryInput,
  type CategoryPatch,
} from '@nogoolin/validation-schemas';
import type { CategoryService } from '../../services/category.service.js';
import { validateBody } from '../../hooks/validate.js';

// Admin category routes (06-api-spec /admin/categories*) — the parent scope
// already enforces requireAuth + requireAdmin (docs/08 §5.5).
export function registerAdminCategoryRoutes(
  fastify: FastifyInstance,
  service: CategoryService,
): void {
  // GET /admin/categories — all categories (incl. inactive) with product
  // counts. NOTE: not in 06-api-spec v1.0.0 (spec gap) but required by
  // FR-ADM-005 "list, create, edit, deactivate"; response shape
  // {data: (Category & {product_count})[]}.
  fastify.get('/categories', async () => {
    return { data: await service.listAdmin() };
  });

  // POST /admin/categories → 201
  fastify.post<{ Body: CategoryInput }>(
    '/categories',
    { preHandler: validateBody(categoryInputSchema) },
    async (request, reply) => {
      const category = await service.create(request.body, request.user!.id);
      return reply.code(201).send({ data: category });
    },
  );

  // PATCH /admin/categories/{id} → 200 | 404
  fastify.patch<{ Params: { id: string }; Body: CategoryPatch }>(
    '/categories/:id',
    { preHandler: validateBody(categoryPatchSchema) },
    async (request) => {
      const category = await service.update(
        request.params.id,
        request.body,
        request.user!.id,
      );
      return { data: category };
    },
  );

  // DELETE /admin/categories/{id} → 204 | 404 | 409 CATEGORY_NOT_EMPTY
  fastify.delete<{ Params: { id: string } }>(
    '/categories/:id',
    async (request, reply) => {
      await service.remove(request.params.id, request.user!.id);
      return reply.code(204).send();
    },
  );
}
