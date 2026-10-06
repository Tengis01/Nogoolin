import type { CartItem } from '@nogoolin/validation-schemas';
import type { CartRepository, ProductRepository } from '../repositories/types.js';
import { notFound } from '../lib/errors.js';

// Phase 4 "Wishlist / cart draft" — a per-user save-for-later list.
// Deliberately NOT an order: no quantity, price, or checkout logic here.
/**
 * Хэрэглэгчийн хадгалсан бүтээгдэхүүний service үүсгэнэ.
 *
 * @param cart - Хадгалсан бүтээгдэхүүний repository.
 * @param products - Бүтээгдэхүүний repository.
 * @returns list, add, remove method бүхий service.
 * @throws Factory өөрөө алдаа шидэхгүй.
 * @example
 * ```ts
 * const service = createCartService(cartRepository, productRepository);
 * ```
 */
export function createCartService(cart: CartRepository, products: ProductRepository) {
  return {
    /**
     * Нэг хэрэглэгчийн хадгалсан бүтээгдэхүүнийг уншина.
     *
     * @param userId - Controller-оор баталгаажсан хэрэглэгчийн UUID.
     * @returns CartItem жагсаалт; хоосон байж болно.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const saved = await service.list(customerId);
     * ```
     */
    async list(userId: string): Promise<CartItem[]> {
      return cart.listByUser(userId);
    },

    // You can only save a product you could browse — published only
    // (drafts/archived behave as not-found, matching the public catalog).
    /**
     * Published бүтээгдэхүүнийг хэрэглэгчийн жагсаалтад хадгална.
     *
     * @param userId - Controller-оор баталгаажсан хэрэглэгчийн UUID.
     * @param productId - Хадгалах бүтээгдэхүүний UUID.
     * @returns Хадгалсан CartItem; давхардлыг repository idempotent байдлаар шийднэ.
     * @throws PRODUCT_NOT_FOUND (404) — бүтээгдэхүүн байхгүй эсвэл published биш; repository-ийн алдаа дамжина.
     * @example
     * ```ts
     * const saved = await service.add(customerId, productId);
     * ```
     */
    async add(userId: string, productId: string): Promise<CartItem> {
      const product = await products.findById(productId);
      if (!product || product.status !== 'published') {
        throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      }
      return cart.add(userId, productId);
    },

    // Idempotent: removing an item that isn't saved is a no-op success.
    /**
     * Хадгалсан бүтээгдэхүүнийг жагсаалтаас хасна.
     *
     * @param userId - Хэрэглэгчийн UUID.
     * @param productId - Хасах бүтээгдэхүүний UUID.
     * @returns Promise<void>; өмнө нь байгаагүй item-д мөн амжилттай дуусна.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * await service.remove(customerId, productId);
     * ```
     */
    async remove(userId: string, productId: string): Promise<void> {
      await cart.remove(userId, productId);
    },
  };
}

/** CartService нь createCartService-ийн method-уудын inferred contract.
 * @example
 * ```ts
 * type Service = CartService;
 * ```
 */
export type CartService = ReturnType<typeof createCartService>;
