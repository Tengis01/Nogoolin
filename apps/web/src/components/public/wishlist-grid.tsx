'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ensureLoaded,
  getServerSnapshot,
  getSnapshot,
  reload,
  subscribe,
  toggle,
} from '@/lib/wishlist-store';
import { formatPrice } from './product-card';

// Saved-products list (Phase 4 wishlist / cart draft).
// Explicitly NOT a cart preview: no quantities, no line totals, no sum, no
// checkout button — only "view product" and "remove".

export function WishlistGrid() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    ensureLoaded();
  }, []);

  if (state.phase === 'idle' || state.phase === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[var(--hair)] py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--hair)] border-t-[var(--act)]" />
        <p className="text-sm text-[var(--muted)]">Ачаалж байна…</p>
      </div>
    );
  }

  if (state.phase === 'error') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[var(--saff-deep)] bg-[color-mix(in_srgb,var(--saff-deep)_6%,white)] py-12">
        <p className="text-sm font-semibold text-[var(--saff-deep)]">
          ⚠ {state.error ?? 'Ачаалж чадсангүй'}
        </p>
        <button
          type="button"
          onClick={() => reload()}
          className="rounded-full border border-[var(--hair)] bg-white px-5 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[18px] border border-[var(--hair)] py-16 text-center">
        <svg viewBox="0 0 100 100" fill="none" width={56} height={56} className="text-[var(--saff-deep)] opacity-40">
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
          <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
        </svg>
        <p className="text-sm text-[var(--muted)]">
          Танд хадгалсан бүтээгдэхүүн одоогоор алга.
        </p>
        <Link
          href="/products"
          className="rounded-full bg-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
        >
          Каталог үзэх
        </Link>
      </div>
    );
  }

  return (
    <>
      {state.error && (
        <p className="mb-3 text-xs font-semibold text-[var(--saff-deep)]">⚠ {state.error}</p>
      )}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(235px,1fr))] gap-5">
        {state.items.map((item) => {
          const p = item.product;
          const available = p?.status === 'published';
          const busy = state.pending.has(item.product_id);

          return (
            <li
              key={item.id}
              className="flex flex-col overflow-hidden rounded-[18px] border border-[var(--hair)] bg-[var(--paper)]"
            >
              <div className="relative aspect-[4/3.4] bg-[var(--paper-alt)]">
                {p?.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    sizes="(max-width: 700px) 50vw, 235px"
                    className={`object-cover ${available ? '' : 'opacity-50'}`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg viewBox="0 0 100 100" fill="none" width={56} height={56} className="text-[var(--saff-deep)] opacity-40">
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
                      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
                      <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <p className="line-clamp-2 text-[15.5px] leading-snug text-[var(--ink)]">
                  {p?.name ?? 'Бүтээгдэхүүн'}
                </p>
                {p && (
                  <p className="font-serif text-xl text-[var(--saff-deep)]">
                    {formatPrice(p.price)}
                  </p>
                )}
                {!available && (
                  <p className="text-xs text-[var(--muted)]">Одоогоор боломжгүй</p>
                )}

                <div className="mt-auto flex gap-2 pt-3">
                  {available && p && (
                    <Link
                      href={`/products/${p.slug}`}
                      className="rounded-full border border-[var(--hair)] px-4 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
                    >
                      Үзэх
                    </Link>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void toggle(item.product_id)}
                    className="rounded-full border border-[var(--hair)] px-4 py-1.5 text-xs font-semibold text-[var(--muted)] transition-colors hover:border-[var(--act)] hover:text-[var(--ink)] disabled:opacity-50"
                  >
                    {busy ? 'Хасаж байна…' : 'Хасах'}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
