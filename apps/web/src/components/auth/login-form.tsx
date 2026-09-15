'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { inputClass, primaryButtonClass } from './auth-card';

// UC-A-001 — email + password sign-in. Session cookies are set by
// @supabase/ssr; GoTrue issues 15-min access + 7-day rotating refresh.
export function LoginForm({ next = '/' }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (error) {
      setError('И-мэйл эсвэл нууц үг буруу байна');
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        required
        placeholder="И-мэйл"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <input
        type="password"
        required
        placeholder="Нууц үг"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputClass}
      />
      {error && <p className="text-xs text-[#a9861b]">{error}</p>}
      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? 'Нэвтэрч байна…' : 'Нэвтрэх'}
      </button>
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <Link href="/signup" className="hover:text-[var(--act)]">
          Бүртгүүлэх
        </Link>
        <Link href="/reset-password" className="hover:text-[var(--act)]">
          Нууц үг мартсан?
        </Link>
      </div>
    </form>
  );
}
