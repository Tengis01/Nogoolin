'use client';

import { useState } from 'react';

// WF-DET-05 tabs. The Үзүүлэлт (specifications) tab from the wireframe is
// omitted: the schema (docs/04) has no specifications field yet.
// Usage guide (UC-G-006): the markdown `usage_instruction` is parsed into
// numbered steps — circled number + text, per the wireframe.
// Content is rendered as React-escaped text (no raw HTML injection); full
// markdown rendering w/ rehype-sanitize is a Phase 3+ polish item.

function parseSteps(markdown: string): string[] {
  return markdown
    .split('\n')
    .map((line) => /^\s*\d+[.)]\s+(.*)$/.exec(line)?.[1] ?? '')
    .filter(Boolean);
}

export function ProductTabs({
  fullDescription,
  usageInstruction,
}: {
  fullDescription: string | null;
  usageInstruction: string | null;
}) {
  const tabs = [
    fullDescription ? ('description' as const) : null,
    usageInstruction ? ('usage' as const) : null,
  ].filter((t) => t !== null);
  const [active, setActive] = useState(tabs[0] ?? 'description');

  if (tabs.length === 0) return null;

  const steps = usageInstruction ? parseSteps(usageInstruction) : [];

  return (
    <section className="mt-10">
      <div className="flex gap-6 border-b border-[var(--hair)]">
        {fullDescription && (
          <TabButton
            label="Дэлгэрэнгүй тайлбар"
            active={active === 'description'}
            onClick={() => setActive('description')}
          />
        )}
        {usageInstruction && (
          <TabButton
            label="Хэрэглэх заавар"
            active={active === 'usage'}
            onClick={() => setActive('usage')}
          />
        )}
      </div>

      <div className="max-w-[52em] py-6 text-[15px] leading-[1.85] text-[var(--ink)]">
        {active === 'description' && fullDescription && (
          <div className="whitespace-pre-line">{fullDescription}</div>
        )}
        {active === 'usage' && usageInstruction && (
          steps.length > 0 ? (
            <ol className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--act)] font-serif text-sm text-[var(--act)]">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="whitespace-pre-line">{usageInstruction}</div>
          )
        )}
      </div>
    </section>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors ${
        active
          ? 'border-[var(--act)] text-[var(--act)]'
          : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
      }`}
    >
      {label}
    </button>
  );
}
