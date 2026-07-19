'use client';

import { useCallback, useEffect, useState } from 'react';
import { categoryInputSchema, categoryPatchSchema } from '@nogoolin/validation-schemas';
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  persistCategoryOrder,
  updateCategory,
  type AdminCategory,
} from '@/lib/api/admin';
import { ApiError } from '@/lib/api/client';
import { slugPreview } from '@/lib/admin/slug-preview';
import { EmptyState, ErrorState, InlineError, LoadingState } from './async-state';
import {
  ActionButton,
  ConfirmDialog,
  GhostButton,
  Modal,
  PrimaryButton,
  Toggle,
  inputClass,
} from './ui';

// Wired to GET/POST /admin/categories, PATCH/DELETE /admin/categories/{id}.
// Categories are FLAT per docs/04 (no parent_id), hence no parent field.
export function CategoryTable() {
  const [rows, setRows] = useState<AdminCategory[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [modal, setModal] = useState<'closed' | 'create' | AdminCategory>('closed');
  const [confirmDelete, setConfirmDelete] = useState<AdminCategory | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    setRows(null);
    try {
      setRows(await fetchAdminCategories());
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Сервертэй холбогдож чадсангүй');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleActive(row: AdminCategory, next: boolean) {
    setMutationError(null);
    setRows((rs) =>
      rs!.map((r) => (r.id === row.id ? { ...r, is_active: next } : r)),
    ); // optimistic
    try {
      await updateCategory(row.id, { is_active: next });
    } catch (err) {
      setRows((rs) => rs!.map((r) => (r.id === row.id ? { ...r, is_active: !next } : r)));
      setMutationError(err instanceof ApiError ? err.message : 'Хадгалж чадсангүй');
    }
  }

  async function reorder(from: number, to: number) {
    if (!rows) return;
    setMutationError(null);
    const previous = new Map(rows.map((r) => [r.id, r.sort_order]));
    const copy = [...rows];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved!);
    const renumbered = copy.map((r, i) => ({ ...r, sort_order: i }));
    setRows(renumbered); // optimistic
    try {
      // persists via PATCH per changed row — not just local state
      await persistCategoryOrder(renumbered, previous);
    } catch (err) {
      await load(); // revert to server truth
      setMutationError(
        err instanceof ApiError ? err.message : 'Дараалал хадгалагдсангүй',
      );
    }
  }

  async function handleSave(
    values: { name: string; description: string },
    editing: AdminCategory | null,
  ): Promise<string | null> {
    try {
      if (editing) {
        const patch = categoryPatchSchema.parse({
          name: values.name,
          description: values.description || undefined,
        });
        await updateCategory(editing.id, patch);
      } else {
        const input = categoryInputSchema.parse({
          name: values.name,
          description: values.description || undefined,
        });
        await createCategory(input);
      }
      setModal('closed');
      await load();
      return null;
    } catch (err) {
      return err instanceof ApiError ? err.message : 'Хадгалж чадсангүй';
    }
  }

  async function handleDelete(row: AdminCategory) {
    setConfirmDelete(null);
    setMutationError(null);
    try {
      await deleteCategory(row.id);
      await load();
    } catch (err) {
      // 409 CATEGORY_NOT_EMPTY arrives here if counts were stale
      setMutationError(err instanceof ApiError ? err.message : 'Устгаж чадсангүй');
    }
  }

  if (loadError) return <ErrorState message={loadError} onRetry={() => void load()} />;
  if (rows === null) return <LoadingState />;

  return (
    <div>
      <InlineError message={mutationError} />
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">{rows.length} ангилал</p>
        <PrimaryButton onClick={() => setModal('create')}>+ Ангилал нэмэх</PrimaryButton>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="Ангилал алга. Эхнийхээ нэмнэ үү." />
      ) : (
        <div className="overflow-x-auto rounded-[18px] border border-[var(--hair)] bg-[var(--paper)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--hair)] text-xs uppercase tracking-wider text-[var(--muted)]">
                <th className="w-10 px-4 py-3" aria-label="Дараалал" />
                <th className="px-4 py-3">Нэр</th>
                <th className="px-4 py-3">Бүтээгдэхүүн</th>
                <th className="px-4 py-3">Идэвхтэй</th>
                <th className="px-4 py-3 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null && dragIndex !== index) {
                      void reorder(dragIndex, index);
                    }
                    setDragIndex(null);
                  }}
                  className={`border-b border-[var(--hair)] last:border-0 ${
                    dragIndex === index ? 'bg-[var(--paper-alt)]' : ''
                  } ${row.is_active ? '' : 'opacity-60'}`}
                >
                  <td className="cursor-grab px-4 py-3 text-[var(--muted)]" title="Чирж эрэмбэлэх">
                    ⠿
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-[var(--ink)]">{row.name}</span>
                    <span className="ml-2 text-xs text-[var(--muted)]">/{row.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{row.product_count}</td>
                  <td className="px-4 py-3">
                    <Toggle
                      on={row.is_active}
                      onChange={(next) => void toggleActive(row, next)}
                      label={`${row.name} идэвхтэй эсэх`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <ActionButton title="Засах" onClick={() => setModal(row)}>
                        Засах
                      </ActionButton>
                      <ActionButton
                        title={
                          row.product_count > 0
                            ? 'Бүтээгдэхүүнтэй ангиллыг устгах боломжгүй'
                            : 'Устгах'
                        }
                        onClick={() => row.product_count === 0 && setConfirmDelete(row)}
                      >
                        Устгах
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal !== 'closed' && (
        <CategoryModal
          initial={modal === 'create' ? null : modal}
          onSave={(values) => handleSave(values, modal === 'create' ? null : modal)}
          onClose={() => setModal('closed')}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Ангилал устгах"
          body={`«${confirmDelete.name}» ангиллыг бүрмөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
          confirmLabel="Устгах"
          onConfirm={() => void handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function CategoryModal({
  initial,
  onSave,
  onClose,
}: {
  initial: AdminCategory | null;
  onSave: (values: { name: string; description: string }) => Promise<string | null>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  // shared-schema validation (same rules as the server, NFR-SEC-003 UX side)
  const nameValid = categoryInputSchema.shape.name.safeParse(name.trim()).success;
  const slug = initial?.slug ?? slugPreview(name);

  return (
    <Modal title={initial ? 'Ангилал засах' : 'Шинэ ангилал'} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!nameValid) {
            setError('Нэрээ оруулна уу (1–120 тэмдэгт)');
            return;
          }
          setPending(true);
          void onSave({ name: name.trim(), description: description.trim() }).then(
            (err) => {
              setPending(false);
              if (err) setError(err);
            },
          );
        }}
        className="flex flex-col gap-4"
      >
        <label className="text-xs font-semibold text-[var(--muted)]">
          Нэр *
          <input
            className={`${inputClass} mt-1`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            lang="mn"
          />
        </label>
        <div className="text-xs text-[var(--muted)]">
          Slug (сервер эцэслэнэ):{' '}
          <span className="font-mono text-[var(--saff-deep)]">/{slug || '…'}</span>
        </div>
        <label className="text-xs font-semibold text-[var(--muted)]">
          Тайлбар
          <textarea
            className={`${inputClass} mt-1 min-h-20 resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            lang="mn"
          />
        </label>
        <InlineError message={error} />
        <div className="mt-2 flex justify-end gap-3">
          <GhostButton onClick={onClose}>Болих</GhostButton>
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? 'Хадгалж байна…' : 'Хадгалах'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
