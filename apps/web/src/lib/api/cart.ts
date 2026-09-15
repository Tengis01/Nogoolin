'use client';

import type { CartItem } from '@nogoolin/validation-schemas';
import { apiFetch } from './client';

// Phase 4 wishlist / cart draft ("save for later"). Deliberately NOT a
// checkout: no quantities, no totals, no order creation.

export async function fetchCart(): Promise<CartItem[]> {
  const res = await apiFetch<{ data: CartItem[] }>('/cart', { auth: true });
  return res.data;
}

/** idempotent server-side — adding an already-saved product is a no-op */
export async function addToCart(productId: string): Promise<CartItem> {
  const res = await apiFetch<{ data: CartItem }>('/cart', {
    method: 'POST',
    body: { product_id: productId },
    auth: true,
  });
  return res.data;
}

/** idempotent server-side — removing an unsaved product still succeeds */
export async function removeFromCart(productId: string): Promise<void> {
  await apiFetch<void>(`/cart/${productId}`, { method: 'DELETE', auth: true });
}
