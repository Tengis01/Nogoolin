import type { FastifyInstance } from 'fastify';
import { productListQuerySchema } from '@nogoolin/validation-schemas';
import type { ProductService } from '../services/product.service.js';
import { badRequest } from '../lib/errors.js';

// Public product routes (06-api-spec /products, /products/{slug})
export function registerProductRoutes(
  fastify: FastifyInstance,
  service: ProductService,
): void {
  // GET /products — published only; filters + multi-script search + sort
  fastify.get('/products', async (request) => {
    const parsed = productListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw badRequest('Invalid query parameters', 'VALIDATION_ERROR');
    }
    return service.listPublic(parsed.data); // { data, meta } envelope
  });

  // GET /products/{slug} — published only, with images + category
  fastify.get<{ Params: { slug: string } }>(
    '/products/:slug',
    async (request) => {
      return { data: await service.getPublishedBySlug(request.params.slug) };
    },
  );
}
