'use client';

import type { CartItem } from '@nogoolin/validation-schemas';
import { createClient } from '@/lib/supabase/client';
import { addToCart, fetchCart, removeFromCart } from '@/lib/api/cart';

// Tiny module-level store for the saved-products list.
//
// Why not React context: Save buttons render inside SERVER-rendered pages
// (listing, detail) that would each need a client provider wrapper. A module
// singleton + useSyncExternalStore keeps every button in sync across pages
// with one fetch, no provider plumbing, and no prop drilling.

export type WishlistPhase = 'idle' | 'loading' | 'ready' | 'guest' | 'error';

interface WishlistState {
  phase: WishlistPhase;
  /** product_ids currently saved */
  ids: ReadonlySet<string>;
  items: CartItem[];
  /** product_ids with an in-flight toggle (button shows a pending state) */
  pending: ReadonlySet<string>;
  error: string | null;
}

let state: WishlistState = {
  phase: 'idle',
  ids: new Set(),
  items: [],
  pending: new Set(),
  error: null,
};

const listeners = new Set<() => void>();

function setState(patch: Partial<WishlistState>): void {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): WishlistState {
  return state;
}

/** server render has no session/localStorage — always the idle snapshot */
export function getServerSnapshot(): WishlistState {
  return INITIAL_SERVER_STATE;
}

const INITIAL_SERVER_STATE: WishlistState = {
  phase: 'idle',
  ids: new Set(),
  items: [],
  pending: new Set(),
  error: null,
};

let loadPromise: Promise<void> | null = null;

/**
 * Loads the list once per page session. Guests resolve to phase 'guest'
 * WITHOUT hitting the API (no 401 noise, no login redirect) — Save buttons
 * then send them to /login on click.
 */
export function ensureLoaded(): void {
  if (loadPromise) return;
  loadPromise = (async () => {
    setState({ phase: 'loading', error: null });
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setState({ phase: 'guest', ids: new Set(), items: [] });
        return;
      }
      const items = await fetchCart();
      setState({
        phase: 'ready',
        items,
        ids: new Set(items.map((i) => i.product_id)),
      });
    } catch {
      setState({ phase: 'error', error: 'Хадгалсан жагсаалтыг ачаалж чадсангүй' });
    }
  })();
}

/** force a refetch (used after mutations on the wishlist page) */
export function reload(): void {
  loadPromise = null;
  ensureLoaded();
}

function withPending(productId: string, on: boolean): ReadonlySet<string> {
  const next = new Set(state.pending);
  if (on) next.add(productId);
  else next.delete(productId);
  return next;
}

/**
 * Optimistic add/remove. Reverts on failure so the button never lies about
 * what the server actually stored.
 */
export async function toggle(productId: string): Promise<void> {
  if (state.pending.has(productId)) return;
  const wasSaved = state.ids.has(productId);
  const nextIds = new Set(state.ids);
  if (wasSaved) nextIds.delete(productId);
  else nextIds.add(productId);

  setState({
    ids: nextIds,
    pending: withPending(productId, true),
    error: null,
    // drop the row immediately so the wishlist page reflects the removal
    items: wasSaved ? state.items.filter((i) => i.product_id !== productId) : state.items,
  });

  try {
    if (wasSaved) {
      await removeFromCart(productId);
    } else {
      const item = await addToCart(productId);
      setState({ items: [item, ...state.items.filter((i) => i.product_id !== productId)] });
    }
    setState({ pending: withPending(productId, false) });
  } catch {
    // revert to the pre-toggle truth
    const reverted = new Set(state.ids);
    if (wasSaved) reverted.add(productId);
    else reverted.delete(productId);
    setState({
      ids: reverted,
      pending: withPending(productId, false),
      error: wasSaved ? 'Устгаж чадсангүй' : 'Хадгалж чадсангүй',
    });
    if (wasSaved) reload(); // re-sync the dropped row
  }
}
