'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@nogoolin/validation-schemas';

// WF-LIST-02 (single-row rule, same as WF-HOME-01 ⚠): chips sit in ONE row
// at any count — wrapping prohibited; overflow = horizontal scroll (hidden
// scrollbar) + right-edge fade. Selection reflected in ?category= (linkable).
export function CategoryChips({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get('category') ?? '';

  function select(slug: string) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set('category', slug);
    else next.delete('category');
    next.delete('page'); // filter change resets pagination
    router.push(`/products${next.size ? `?${next}` : ''}`);
  }

  const chips = [{ slug: '', name: 'Бүгд' }, ...categories];

  return (
    <div className="relative">
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => {
          const isActive = active === chip.slug;
          return (
            <button
              key={chip.slug || 'all'}
              type="button"
              onClick={() => select(chip.slug)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'border-[var(--act)] bg-[color-mix(in_srgb,var(--act)_10%,white)] text-[var(--ink)]'
                  : 'border-[var(--hair)] text-[var(--muted)] hover:border-[var(--act)] hover:text-[var(--ink)]'
              }`}
            >
              {chip.name}
            </button>
          );
        })}
      </div>
      {/* right fade signals overflow (24px, into the background) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[var(--paper)] to-transparent" />
    </div>
  );
}
