// Loading SKELETON (not a spinner): card-shaped placeholders matching the
// grid, pulsing in paper-alt — content appears in place without layout shift.
export default function ProductsLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-[1200px] px-[5vw] py-8">
      <div className="mb-2 h-3 w-24 animate-pulse rounded bg-[var(--paper-alt)]" />
      <div className="mb-6 h-9 w-56 animate-pulse rounded-lg bg-[var(--paper-alt)]" />
      <div className="mb-7 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-[var(--paper-alt)]" />
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(235px,1fr))] gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[18px] border border-[var(--hair)]">
            <div className="aspect-[4/3.4] animate-pulse bg-[var(--paper-alt)]" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-20 animate-pulse rounded-full bg-[var(--paper-alt)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[var(--paper-alt)]" />
              <div className="h-6 w-24 animate-pulse rounded bg-[var(--paper-alt)]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
