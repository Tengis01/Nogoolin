import type { FastifyInstance } from 'fastify';
import type { CategoryService } from '../services/category.service.js';

// Public category routes (06-api-spec /categories, /categories/{slug})
export function registerCategoryRoutes(
  fastify: FastifyInstance,
  service: CategoryService,
): void {
  // GET /categories — active categories ordered by sort_order
  fastify.get('/categories', async () => {
    return { data: await service.listActive() };
  });

  // GET /categories/{slug} — 404 when missing/inactive
  fastify.get<{ Params: { slug: string } }>(
    '/categories/:slug',
    async (request) => {
      return { data: await service.getBySlug(request.params.slug) };
    },
  );
}
