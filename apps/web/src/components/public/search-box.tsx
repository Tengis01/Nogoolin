'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// WF-LIST-03: pill input, 300ms debounce. The query goes to the SERVER via
// ?q= → API `search` param (multi-script FR-PUB-014) — no client filtering.
export function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim()) next.set('q', value.trim());
      else next.delete('q');
      next.delete('page');
      router.replace(`/products${next.size ? `?${next}` : ''}`);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="🔍 Хайх… (кирилл / латин / англи)"
      aria-label="Бүтээгдэхүүн хайх"
      className="w-full max-w-64 rounded-full border border-[var(--hair)] bg-white px-5 py-2 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--act)]"
    />
  );
}
