// Shared shell for all auth screens — white-zone card per design tokens.
export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper-alt)] px-[5vw]">
      <div className="w-full max-w-md rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] p-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
          НОГООЛИН
        </p>
        <h1 className="mb-6 text-2xl text-[var(--ink)]">{title}</h1>
        {children}
      </div>
    </main>
  );
}

export const inputClass =
  'w-full rounded-[14px] border border-[var(--hair)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--act)]';

export const primaryButtonClass =
  'w-full rounded-full bg-[var(--act)] px-8 py-3 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)] disabled:opacity-50';
