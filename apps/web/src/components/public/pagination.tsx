import Link from 'next/link';

// WF-LIST-05: 12/page, number buttons (idle: hairline circle; active: act
// border + tint) + arrow. URL carries ?page=N — pagination, not infinite
// scroll, per the wireframe.
export function Pagination({
  page,
  totalPages,
  baseParams,
}: {
  page: number;
  totalPages: number;
  baseParams: URLSearchParams;
}) {
  if (totalPages <= 1) return null;

  function href(p: number): string {
    const next = new URLSearchParams(baseParams.toString());
    if (p > 1) next.set('page', String(p));
    else next.delete('page');
    return `/products${next.size ? `?${next}` : ''}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Хуудаслалт" className="mt-10 flex items-center justify-center gap-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors ${
            p === page
              ? 'border-[var(--act)] bg-[color-mix(in_srgb,var(--act)_10%,white)] text-[var(--ink)]'
              : 'border-[var(--hair)] text-[var(--muted)] hover:border-[var(--act)]'
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={href(page + 1)}
          aria-label="Дараах хуудас"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hair)] text-sm text-[var(--muted)] transition-colors hover:border-[var(--act)]"
        >
          →
        </Link>
      )}
    </nav>
  );
}
