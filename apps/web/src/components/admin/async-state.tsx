'use client';

import { HaloPlaceholder } from './ui';

// Shared loading / error / empty views for admin data tables.

export function LoadingState({ label = 'Ачаалж байна…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--hair)] border-t-[var(--act)]" />
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[var(--saff-deep)] bg-[color-mix(in_srgb,var(--saff-deep)_6%,white)] py-12">
      <p className="text-sm font-semibold text-[var(--saff-deep)]">⚠ {message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-[var(--hair)] bg-white px-5 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
      >
        Дахин оролдох
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] py-16 text-center">
      <HaloPlaceholder size={56} />
      <p className="text-sm text-[var(--muted)]">{message}</p>
    </div>
  );
}

/** inline (non-blocking) mutation error line */
export function InlineError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="mb-3 text-xs font-semibold text-[var(--saff-deep)]">⚠ {message}</p>;
}
