'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import {
  ensureLoaded,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  toggle,
} from '@/lib/wishlist-store';

// "Save for later" toggle (Phase 4 wishlist / cart draft). Appears on product
// cards and the detail page. NOT an add-to-cart: nothing here implies a
// purchase, quantity, or checkout.

function BookmarkIcon({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4.5h12a1 1 0 0 1 1 1V20l-7-4-7 4V5.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function SaveButton({
  productId,
  variant = 'card',
}: {
  productId: string;
  variant?: 'card' | 'detail';
}) {
  const router = useRouter();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    ensureLoaded();
  }, []);

  const saved = state.ids.has(productId);
  const busy = state.pending.has(productId);

  function handleClick(e: React.MouseEvent) {
    // cards wrap the whole tile in a <Link> — never navigate on a save click
    e.preventDefault();
    e.stopPropagation();
    if (state.phase === 'guest') {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    void toggle(productId);
  }

  const label = saved ? 'Хадгалсан жагсаалтаас хасах' : 'Дараа үзэхээр хадгалах';

  if (variant === 'detail') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${
          saved
            ? 'border-[var(--act)] text-[var(--act-text)]'
            : 'border-[var(--hair)] text-[var(--ink)] hover:border-[var(--act)]'
        }`}
      >
        <BookmarkIcon filled={saved} />
        {saved ? 'Хадгалсан' : 'Хадгалах'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--paper)]/90 backdrop-blur transition-colors disabled:opacity-60 ${
        saved
          ? 'border-[var(--act)] text-[var(--act)]'
          : 'border-[var(--hair)] text-[var(--muted)] hover:border-[var(--act)] hover:text-[var(--act)]'
      }`}
    >
      <BookmarkIcon filled={saved} size={16} />
    </button>
  );
}
