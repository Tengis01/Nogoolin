'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductStatus } from '@nogoolin/validation-schemas';
import { MOCK_CATEGORIES } from '@/lib/admin/mock-data';
import { slugPreview } from '@/lib/admin/slug-preview';
import { GhostButton, HaloPlaceholder, inputClass, selectClass } from './ui';

interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // FR-MEDIA-002

// NOTE: mock submit — wire to POST/PATCH /admin/products +
// POST /admin/products/{id}/images later. Usage instructions are edited as
// repeatable step blocks and serialized to the markdown `usage_instruction`
// field (docs/04: single markdown column).
export function ProductForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState(MOCK_CATEGORIES[0]?.id ?? '');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [images, setImages] = useState<PendingImage[]>([]);
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [rejected, setRejected] = useState<string[]>([]);
  const [savedAs, setSavedAs] = useState<ProductStatus | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(list: FileList | File[]) {
    const notes: string[] = [];
    const accepted: PendingImage[] = [];
    for (const file of Array.from(list)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        notes.push(`${file.name}: зөвхөн jpg/png/webp`);
      } else if (file.size > MAX_SIZE) {
        notes.push(`${file.name}: 5MB-с том байна`);
      } else {
        accepted.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }
    setImages((imgs) => [...imgs, ...accepted]);
    setRejected(notes);
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((imgs) => {
      const to = index + dir;
      if (to < 0 || to >= imgs.length) return imgs;
      const copy = [...imgs];
      [copy[index], copy[to]] = [copy[to]!, copy[index]!];
      return copy;
    });
  }

  function removeImage(id: string) {
    setImages((imgs) => {
      const img = imgs.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return imgs.filter((i) => i.id !== id);
    });
  }

  function serializeInstructions(): string {
    const filled = steps.map((s) => s.trim()).filter(Boolean);
    if (filled.length === 0) return '';
    return `## Хэрэглэх заавар\n${filled.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  }

  function save(as: ProductStatus) {
    // mock save — logs the payload the real API will receive
    const payload = {
      name: name.trim(),
      name_en: nameEn.trim() || undefined,
      category_id: categoryId,
      price: Number(price),
      full_description: description.trim() || undefined,
      usage_instruction: serializeInstructions() || undefined,
      status: as,
      image_count: images.length,
    };
    console.info('[mock] would submit product:', payload);
    setSavedAs(as);
    setTimeout(() => router.push('/admin/products'), 900);
  }

  const valid = name.trim().length > 0 && categoryId && Number(price) > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(status);
      }}
      className="grid max-w-5xl gap-8 lg:grid-cols-[1.4fr_1fr]"
    >
      {/* ── left column: content ─────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <label className="text-xs font-semibold text-[var(--muted)]">
          Нэр (кирилл) *
          <input
            className={`${inputClass} mt-1`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ногоон Дарь Эх"
            lang="mn"
            required
          />
        </label>
        {name && (
          <p className="-mt-3 text-xs text-[var(--muted)]">
            Slug:{' '}
            <span className="font-mono text-[var(--saff-deep)]">
              /products/{slugPreview(name)}
            </span>
          </p>
        )}

        <label className="text-xs font-semibold text-[var(--muted)]">
          Нэр (англи — олон бичгийн хайлтад)
          <input
            className={`${inputClass} mt-1`}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Green Tara"
          />
        </label>

        <label className="text-xs font-semibold text-[var(--muted)]">
          Дэлгэрэнгүй тайлбар (markdown)
          <textarea
            className={`${inputClass} mt-1 min-h-36 resize-y font-mono text-[13px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'Гар хийцийн хүрэл товруу...\n\n**Онцлог:** ...'}
            lang="mn"
          />
        </label>

        {/* repeatable usage-instruction steps (serialized to markdown) */}
        <fieldset>
          <legend className="mb-2 text-xs font-semibold text-[var(--muted)]">
            Хэрэглэх заавар — алхмууд
          </legend>
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--act)] font-serif text-sm text-[var(--act)]">
                  {i + 1}
                </span>
                <input
                  className={inputClass}
                  value={step}
                  onChange={(e) =>
                    setSteps((ss) => ss.map((s, j) => (j === i ? e.target.value : s)))
                  }
                  placeholder="Алхмын тайлбар…"
                  lang="mn"
                />
                <button
                  type="button"
                  aria-label={`Алхам ${i + 1} устгах`}
                  onClick={() => setSteps((ss) => ss.filter((_, j) => j !== i))}
                  className="px-2 text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSteps((ss) => [...ss, ''])}
            className="mt-2 text-xs font-semibold text-[var(--act)] hover:text-[var(--act-hover)]"
          >
            + Алхам нэмэх
          </button>
        </fieldset>
      </div>

      {/* ── right column: meta + images ──────────────────────── */}
      <div className="flex flex-col gap-5">
        <label className="text-xs font-semibold text-[var(--muted)]">
          Ангилал *
          <select
            className={`${selectClass} mt-1 w-full`}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {MOCK_CATEGORIES.filter((c) => c.is_active).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-[var(--muted)]">
          Үнэ (₮) *
          <input
            className={`${inputClass} mt-1`}
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="145000"
            required
          />
        </label>

        <label className="text-xs font-semibold text-[var(--muted)]">
          Төлөв
          <select
            className={`${selectClass} mt-1 w-full`}
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
          >
            <option value="draft">Ноорог</option>
            <option value="published">Нийтэлсэн</option>
            <option value="archived">Архивласан</option>
          </select>
        </label>

        {/* image dropzone */}
        <div>
          <p className="mb-1 text-xs font-semibold text-[var(--muted)]">
            Зураг (jpg/png/webp, ≤5MB, эхнийх = нүүр зураг)
          </p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInput.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed p-4 text-center transition-colors ${
              dragOver
                ? 'border-[var(--act)] bg-[color-mix(in_srgb,var(--act)_6%,white)]'
                : 'border-[var(--hair)] bg-[var(--paper-alt)]'
            }`}
          >
            <HaloPlaceholder size={32} />
            <p className="text-xs text-[var(--muted)]">
              Зургаа энд чирж тавих эсвэл дарж сонгоно уу
            </p>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </div>
          {rejected.length > 0 && (
            <ul className="mt-2 text-xs text-[var(--saff-deep)]">
              {rejected.map((r) => (
                <li key={r}>⚠ {r}</li>
              ))}
            </ul>
          )}
          {images.length > 0 && (
            <ul className="mt-3 grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <li
                  key={img.id}
                  className="relative overflow-hidden rounded-lg border border-[var(--hair)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={img.file.name}
                    className="aspect-square w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded-full bg-[var(--saff-deep)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      Нүүр
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-[rgba(23,53,42,0.55)] py-0.5">
                    <button
                      type="button"
                      aria-label="Өмнөх байрлал"
                      onClick={() => moveImage(i, -1)}
                      className="px-1 text-xs text-white disabled:opacity-30"
                      disabled={i === 0}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label="Дараах байрлал"
                      onClick={() => moveImage(i, 1)}
                      className="px-1 text-xs text-white disabled:opacity-30"
                      disabled={i === images.length - 1}
                    >
                      →
                    </button>
                    <button
                      type="button"
                      aria-label="Зураг хасах"
                      onClick={() => removeImage(img.id)}
                      className="px-1 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* actions */}
        <div className="mt-2 flex flex-col gap-2">
          {savedAs && (
            <p className="rounded-[14px] bg-[color-mix(in_srgb,var(--act)_10%,white)] px-4 py-2 text-xs font-semibold text-[var(--act-text)]">
              ✓ Хадгаллаа ({savedAs === 'published' ? 'нийтэлсэн' : 'ноорог'}) — жагсаалт руу буцаж байна…
            </p>
          )}
          <button
            type="submit"
            disabled={!valid}
            className="rounded-full bg-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)] disabled:opacity-50"
          >
            Хадгалах
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => save('published')}
            className="rounded-full border border-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act)] transition-colors hover:bg-[color-mix(in_srgb,var(--act)_8%,white)] disabled:opacity-50"
          >
            Хадгалаад нийтлэх
          </button>
          <GhostButton onClick={() => router.push('/admin/products')}>Болих</GhostButton>
        </div>
      </div>
    </form>
  );
}
