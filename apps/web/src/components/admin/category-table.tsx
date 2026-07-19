'use client';

import { useState } from 'react';
import { MOCK_CATEGORIES, type CategoryRow } from '@/lib/admin/mock-data';
import { slugPreview } from '@/lib/admin/slug-preview';
import {
  ActionButton,
  ConfirmDialog,
  GhostButton,
  Modal,
  PrimaryButton,
  Toggle,
  inputClass,
} from './ui';

// NOTE: mock data — wire to GET /categories + /admin/categories CRUD later.
// Categories are FLAT per docs/04 (no parent_id in the schema), so the
// modal has no parent-category field; see PR notes.
export function CategoryTable() {
  const [rows, setRows] = useState<CategoryRow[]>(MOCK_CATEGORIES);
  const [modal, setModal] = useState<'closed' | 'create' | CategoryRow>('closed');
  const [confirmDelete, setConfirmDelete] = useState<CategoryRow | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function toggleActive(id: string, next: boolean) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, is_active: next } : r)));
  }

  function reorder(from: number, to: number) {
    setRows((rs) => {
      const copy = [...rs];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved!);
      return copy.map((r, i) => ({ ...r, sort_order: i }));
    });
  }

  function saveCategory(name: string, description: string) {
    if (modal === 'create') {
      setRows((rs) => [
        ...rs,
        {
          id: `tmp-${Date.now()}`,
          name,
          slug: slugPreview(name),
          description: description || null,
          sort_order: rs.length,
          is_active: true,
          product_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } else if (modal !== 'closed') {
      setRows((rs) =>
        rs.map((r) =>
          r.id === modal.id ? { ...r, name, description: description || null } : r,
        ),
      );
    }
    setModal('closed');
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">{rows.length} ангилал</p>
        <PrimaryButton onClick={() => setModal('create')}>+ Ангилал нэмэх</PrimaryButton>
      </div>

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
                  if (dragIndex !== null && dragIndex !== index) reorder(dragIndex, index);
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
                    onChange={(next) => toggleActive(row.id, next)}
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

      {modal !== 'closed' && (
        <CategoryModal
          initial={modal === 'create' ? null : modal}
          onSave={saveCategory}
          onClose={() => setModal('closed')}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Ангилал устгах"
          body={`«${confirmDelete.name}» ангиллыг бүрмөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй.`}
          confirmLabel="Устгах"
          onConfirm={() => {
            setRows((rs) => rs.filter((r) => r.id !== confirmDelete.id));
            setConfirmDelete(null);
          }}
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
  initial: CategoryRow | null;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const slug = initial?.slug ?? slugPreview(name);

  return (
    <Modal title={initial ? 'Ангилал засах' : 'Шинэ ангилал'} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onSave(name.trim(), description.trim());
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
          Slug (автоматаар):{' '}
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
        <div className="mt-2 flex justify-end gap-3">
          <GhostButton onClick={onClose}>Болих</GhostButton>
          <PrimaryButton type="submit">Хадгалах</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
