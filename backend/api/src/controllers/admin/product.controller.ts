import type { FastifyInstance } from 'fastify';
import {
  adminProductListQuerySchema,
  productInputSchema,
  productPatchSchema,
  type ProductInput,
  type ProductPatch,
} from '@nogoolin/validation-schemas';
import type { ProductService } from '../../services/product.service.js';
import { validateBody } from '../../hooks/validate.js';
import { badRequest } from '../../lib/errors.js';

// Admin product routes (06-api-spec /admin/products*) — parent scope
// enforces requireAuth + requireAdmin.
export function registerAdminProductRoutes(
  fastify: FastifyInstance,
  service: ProductService,
): void {
  // GET /admin/products — all statuses, paginated
  fastify.get('/products', async (request) => {
    const parsed = adminProductListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw badRequest('Invalid query parameters', 'VALIDATION_ERROR');
    }
    return service.listAdmin(parsed.data);
  });

  // POST /admin/products → 201, status defaults to draft
  fastify.post<{ Body: ProductInput }>(
    '/products',
    { preHandler: validateBody(productInputSchema) },
    async (request, reply) => {
      const product = await service.create(request.body, request.user!.id);
      return reply.code(201).send({ data: product });
    },
  );

  // PATCH /admin/products/{id} → 200 | 404 (edits, publish/archive,
  // search_tags, model_3d_url)
  fastify.patch<{ Params: { id: string }; Body: ProductPatch }>(
    '/products/:id',
    { preHandler: validateBody(productPatchSchema) },
    async (request) => {
      const product = await service.update(
        request.params.id,
        request.body,
        request.user!.id,
      );
      return { data: product };
    },
  );

  // DELETE /admin/products/{id}?hard= → 204 (soft archive by default)
  fastify.delete<{ Params: { id: string }; Querystring: { hard?: string } }>(
    '/products/:id',
    async (request, reply) => {
      const hard = request.query.hard === 'true';
      await service.remove(request.params.id, hard, request.user!.id);
      return reply.code(204).send();
    },
  );
}
