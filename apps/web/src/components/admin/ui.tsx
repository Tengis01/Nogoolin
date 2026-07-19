'use client';

// Small shared admin-UI atoms. All colors come from the v4 tokens in
// globals.css — no ad-hoc hex, no red anywhere (design lock).

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-full border border-[var(--hair)] px-6 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
    >
      {children}
    </button>
  );
}

/** small inline table action */
export function ActionButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg border border-[var(--hair)] px-2.5 py-1 text-xs text-[var(--muted)] transition-colors hover:border-[var(--act)] hover:text-[var(--ink)]"
    >
      {children}
    </button>
  );
}

/** active/inactive switch (no red — inactive is neutral) */
export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        on ? 'bg-[var(--act)]' : 'bg-[var(--hair)]'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-[color-mix(in_srgb,var(--act)_12%,white)] text-[var(--act-text)] border-[var(--act)]',
  draft: 'bg-[var(--paper-alt)] text-[var(--muted)] border-[var(--hair)]',
  archived: 'bg-[color-mix(in_srgb,var(--saff-deep)_12%,white)] text-[var(--saff-deep)] border-[var(--saff-deep)]',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'Нийтэлсэн',
  draft: 'Ноорог',
  archived: 'Архивласан',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES['draft']}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,53,42,0.45)] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-semibold text-[var(--ink)]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/** FR-ADM-008 — confirmation before any destructive action (no red; the
 *  confirm button uses saffron-deep as the "caution" accent) */
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mb-6 text-sm text-[var(--muted)]">{body}</p>
      <div className="flex justify-end gap-3">
        <GhostButton onClick={onCancel}>Болих</GhostButton>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-[var(--saff-deep)] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export const inputClass =
  'w-full rounded-[14px] border border-[var(--hair)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--act)]';

export const selectClass =
  'rounded-[14px] border border-[var(--hair)] bg-white px-3 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--act)]';

export function formatPrice(price: number): string {
  return `${price.toLocaleString('en-US')}₮`;
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

/** halo-ring placeholder for products without photos (design.md signature) */
export function HaloPlaceholder({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      width={size}
      height={size}
      className="text-[var(--saff-deep)] opacity-40"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
      <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
    </svg>
  );
}
