'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Basic profile editing (Phase 4). Only `full_name` is editable:
// `email` comes from Supabase Auth (changing it is a verification flow, not
// in scope) and `role` is admin-controlled (FR-USER-004). The users table has
// no phone column, so contact info here is name + email only.
//
// Writes go through supabase-js on the user's OWN row — RLS policy
// `users_update_own` is the enforcement (docs/phase-0/08 §6.4).

export function ProfileForm({
  email,
  initialName,
}: {
  email: string;
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  // Baseline for the dirty check. MUST be state, not the `initialName` prop:
  // the prop comes from the server render and does not change after a save,
  // so comparing against it would leave the form permanently "dirty" —
  // the confirmation would never show and Save would never re-disable.
  const [baseline, setBaseline] = useState(initialName);

  const dirty = name.trim() !== baseline.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Нэр дор хаяж 2 тэмдэгт байх ёстой');
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError('Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.');
        return;
      }
      const { error: updateError } = await supabase
        .from('users')
        .update({ full_name: trimmed })
        .eq('id', userData.user.id);
      if (updateError) {
        setError('Хадгалж чадсангүй. Дахин оролдоно уу.');
        return;
      }
      setBaseline(trimmed);
      setSaved(true);
      // the page heading is server-rendered from full_name — re-fetch it
      router.refresh();
    } catch {
      setError('Сүлжээний алдаа — хадгалж чадсангүй.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] p-6"
    >
      {error && (
        <p role="alert" className="mb-4 text-[12.5px] font-semibold text-[var(--warn)]">
          ⚠ {error}
        </p>
      )}
      {saved && (
        <p className="mb-4 text-[12.5px] font-semibold text-[var(--act)]">
          ✓ Хадгаллаа
        </p>
      )}

      <div className="mb-4">
        <label htmlFor="profile-name" className="mb-1.5 block text-[13px] font-medium text-[var(--ink)]">
          Нэр
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          autoComplete="name"
          className="w-full max-w-md rounded-[14px] border border-[var(--hair)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--act)]"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="profile-email" className="mb-1.5 block text-[13px] font-medium text-[var(--ink)]">
          И-мэйл
        </label>
        <input
          id="profile-email"
          type="email"
          value={email}
          readOnly
          disabled
          className="w-full max-w-md rounded-[14px] border border-[var(--hair)] bg-[var(--paper-alt)] px-4 py-2.5 text-sm text-[var(--muted)]"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">
          И-мэйл хаягийг өөрчлөх боломжгүй.
        </p>
      </div>

      <button
        type="submit"
        disabled={saving || !dirty}
        className="rounded-full bg-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)] disabled:opacity-50"
      >
        {saving ? 'Хадгалж байна…' : 'Хадгалах'}
      </button>
    </form>
  );
}
