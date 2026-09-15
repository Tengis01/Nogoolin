'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { inputClass, primaryButtonClass } from './auth-card';

// Sign-up: full_name travels in user metadata so the on_auth_user_created
// trigger copies it into public.users (role auto-assigned 'customer' —
// UC-SYS-001; admin is NEVER self-assignable, docs/phase-0/08 §5.3).
export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Email confirmations are disabled locally (config.toml) — the session
    // is active immediately after sign-up.
    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        required
        placeholder="Бүтэн нэр"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className={inputClass}
      />
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
        minLength={6}
        placeholder="Нууц үг (6+ тэмдэгт)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputClass}
      />
      {error && <p className="text-xs text-[#a9861b]">{error}</p>}
      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? 'Бүртгэж байна…' : 'Бүртгүүлэх'}
      </button>
      <p className="text-xs text-[var(--muted)]">
        Бүртгэлтэй юу?{' '}
        <Link href="/login" className="hover:text-[var(--act)]">
          Нэвтрэх
        </Link>
      </p>
    </form>
  );
}
