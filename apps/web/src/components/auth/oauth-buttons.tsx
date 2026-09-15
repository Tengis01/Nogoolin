'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Provider = 'google' | 'facebook';

const LABELS: Record<Provider, string> = {
  google: 'Google-ээр нэвтрэх',
  facebook: 'Facebook-ээр нэвтрэх',
};

// PKCE OAuth via supabase-js signInWithOAuth (FR-AUTH-002/004, docs/phase-0/08 §5.6).
// Unconfigured providers render disabled with an explanatory note — never
// a crashing redirect (credentials arrive once the OAuth apps are registered).
export function OAuthButtons({
  configured,
  next = '/',
}: {
  configured: { google: boolean; facebook: boolean };
  next?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="mt-6 border-t border-[var(--hair)] pt-6">
      <div className="flex flex-col gap-3">
        {(['google', 'facebook'] as const).map((provider) =>
          configured[provider] ? (
            <button
              key={provider}
              type="button"
              onClick={() => void signIn(provider)}
              className="w-full rounded-full border border-[var(--hair)] px-8 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
            >
              {LABELS[provider]}
            </button>
          ) : (
            <button
              key={provider}
              type="button"
              disabled
              title="OAuth provider not configured"
              className="w-full cursor-not-allowed rounded-full border border-dashed border-[var(--hair)] px-8 py-3 text-sm text-[var(--muted)]"
            >
              {LABELS[provider]} — тохируулаагүй
            </button>
          ),
        )}
      </div>
      {(!configured.google || !configured.facebook) && (
        <p className="mt-3 text-xs text-[var(--muted)]">
          Идэвхгүй товч = OAuth провайдер хараахан тохируулаагүй (README-гийн
          заавраар client ID/secret-ээ .env-д нэмнэ үү).
        </p>
      )}
      {error && <p className="mt-3 text-xs text-[#a9861b]">{error}</p>}
    </div>
  );
}
