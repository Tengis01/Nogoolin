'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthCard, inputClass, primaryButtonClass } from '@/components/auth/auth-card';

// Password reset step 2: landed on from the email link. The browser client
// exchanges the recovery code in the URL automatically (PKCE,
// detectSessionInUrl) — then updateUser sets the new password.
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <AuthCard title="Шинэ нууц үг">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          required
          minLength={6}
          placeholder="Шинэ нууц үг (6+ тэмдэгт)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        {error && <p className="text-xs text-[#a9861b]">{error}</p>}
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? 'Хадгалж байна…' : 'Нууц үг шинэчлэх'}
        </button>
      </form>
    </AuthCard>
  );
}
