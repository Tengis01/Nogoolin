import type { CartItem } from '@nogoolin/validation-schemas';
import type { CartRepository, ProductRepository } from '../repositories/types.js';
import { notFound } from '../lib/errors.js';

// Phase 4 "Wishlist / cart draft" — a per-user save-for-later list.
// Deliberately NOT an order: no quantity, price, or checkout logic here.
export function createCartService(cart: CartRepository, products: ProductRepository) {
  return {
    async list(userId: string): Promise<CartItem[]> {
      return cart.listByUser(userId);
    },

    // You can only save a product you could browse — published only
    // (drafts/archived behave as not-found, matching the public catalog).
    async add(userId: string, productId: string): Promise<CartItem> {
      const product = await products.findById(productId);
      if (!product || product.status !== 'published') {
        throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      }
      return cart.add(userId, productId);
    },

    // Idempotent: removing an item that isn't saved is a no-op success.
    async remove(userId: string, productId: string): Promise<void> {
      await cart.remove(userId, productId);
    },
  };
}

export type CartService = ReturnType<typeof createCartService>;
