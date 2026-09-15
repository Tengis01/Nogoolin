'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthCard, inputClass, primaryButtonClass } from '@/components/auth/auth-card';

// Password reset step 1: request the email. Locally, no SMTP is configured —
// the reset email is visible in Inbucket/Mailpit at http://127.0.0.1:54324.
export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/update-password`,
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard title="Нууц үг сэргээх">
      {sent ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--ink)]">
            Сэргээх холбоос илгээгдлээ — и-мэйлээ шалгана уу.
          </p>
          <p className="text-xs text-[var(--muted)]">
            (Локал орчинд: http://127.0.0.1:54324 дээрх тест-инбоксоос харна.)
          </p>
          <Link href="/login" className="text-xs text-[var(--muted)] hover:text-[var(--act)]">
            ← Нэвтрэх рүү буцах
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Бүртгэлтэй и-мэйл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          {error && <p className="text-xs text-[#a9861b]">{error}</p>}
          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending ? 'Илгээж байна…' : 'Сэргээх холбоос авах'}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
