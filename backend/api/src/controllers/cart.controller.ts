import type { FastifyInstance } from 'fastify';
import { cartItemInputSchema, type CartItemInput } from '@nogoolin/validation-schemas';
import type { CartService } from '../services/cart.service.js';
import { validateBody } from '../hooks/validate.js';

// Per-user "save for later" list (Phase 4 wishlist / cart draft).
// Registered inside the requireAuth scope — every route is the caller's
// own list (NFR-SEC-010). NOT a checkout: no quantity/price/order logic.
export function registerCartRoutes(
  fastify: FastifyInstance,
  service: CartService,
): void {
  // GET /cart — the caller's saved items, newest first
  fastify.get('/cart', async (request) => {
    return { data: await service.list(request.user!.id) };
  });

  // POST /cart — add a product (idempotent) → 201 | 404 PRODUCT_NOT_FOUND
  fastify.post<{ Body: CartItemInput }>(
    '/cart',
    { preHandler: validateBody(cartItemInputSchema) },
    async (request, reply) => {
      const item = await service.add(request.user!.id, request.body.product_id);
      return reply.code(201).send({ data: item });
    },
  );

  // DELETE /cart/{productId} — remove one item (idempotent) → 204
  fastify.delete<{ Params: { productId: string } }>(
    '/cart/:productId',
    async (request, reply) => {
      await service.remove(request.user!.id, request.params.productId);
      return reply.code(204).send();
    },
  );
}
