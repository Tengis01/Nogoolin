'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  productInputSchema,
  type ProductInput,
  type ProductStatus,
} from '@nogoolin/validation-schemas';
import {
  createProduct,
  fetchAdminCategories,
  uploadProductImages,
  type AdminCategory,
} from '@/lib/api/admin';
import { ApiError } from '@/lib/api/client';
import { slugPreview } from '@/lib/admin/slug-preview';
import { InlineError } from './async-state';
import { GhostButton, HaloPlaceholder, inputClass, selectClass } from './ui';

interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // FR-MEDIA-002 (server re-validates)

type Phase =
  | { step: 'editing' }
  | { step: 'saving' }
  | { step: 'uploading'; progress: number }
  | { step: 'upload-failed'; productId: string; message: string }
  | { step: 'done' };

// Wired to POST /admin/products + POST /admin/products/{id}/images.
// Validation uses the SAME Zod schema as the server (client = UX only,
// the API re-validates unconditionally — docs/08 §7.1).
export function ProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[] | null>(null);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [images, setImages] = useState<PendingImage[]>([]);
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [rejected, setRejected] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ step: 'editing' });
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchAdminCategories()
      .then((cs) => {
        setCategories(cs);
        const firstActive = cs.find((c) => c.is_active);
        if (firstActive) setCategoryId((id) => id || firstActive.id);
      })
      .catch((err) => {
        setCategories([]);
        setFormError(
          err instanceof ApiError ? err.message : 'Ангилал ачаалж чадсангүй',
        );
      });
  }, []);

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

  function buildPayload(as: ProductStatus): ProductInput | null {
    const filledSteps = steps.map((s) => s.trim()).filter(Boolean);
    const candidate = {
      name: name.trim(),
      name_en: nameEn.trim() || undefined,
      category_id: categoryId,
      price: Number(price),
      full_description: description.trim() || undefined,
      usage_instruction:
        filledSteps.length > 0
          ? `## Хэрэглэх заавар\n${filledSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
          : undefined,
      status: as,
    };
    const parsed = productInputSchema.safeParse(candidate);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[String(issue.path[0])] = issue.message;
      }
      setFieldErrors(errors);
      return null;
    }
    setFieldErrors({});
    return parsed.data;
  }

  async function uploadTo(productId: string): Promise<void> {
    if (images.length === 0) {
      setPhase({ step: 'done' });
      return;
    }
    setPhase({ step: 'uploading', progress: 0 });
    try {
      const result = await uploadProductImages(
        productId,
        images.map((img) => ({ file: img.file })),
        (fraction) => setPhase({ step: 'uploading', progress: fraction }),
      );
      if (result.rejected.length > 0) {
        setRejected(result.rejected.map((r) => `${r.filename}: ${r.reason}`));
      }
      setPhase({ step: 'done' });
    } catch (err) {
      // product exists; only images failed (e.g. 502 storage) — allow retry
      setPhase({
        step: 'upload-failed',
        productId,
        message:
          err instanceof ApiError
            ? err.message
            : 'Зураг илгээхэд алдаа гарлаа — дахин оролдоно уу',
      });
    }
  }

  async function save(as: ProductStatus) {
    setFormError(null);
    const payload = buildPayload(as);
    if (!payload) return;
    setPhase({ step: 'saving' });
    try {
      const product = await createProduct(payload);
      await uploadTo(product.id);
    } catch (err) {
      setPhase({ step: 'editing' });
      setFormError(err instanceof ApiError ? err.message : 'Хадгалж чадсангүй');
    }
  }

  useEffect(() => {
    if (phase.step === 'done') {
      const t = setTimeout(() => router.push('/admin/products'), 900);
      return () => clearTimeout(t);
    }
  }, [phase.step, router]);

  const busy = phase.step === 'saving' || phase.step === 'uploading';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(status);
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
          {fieldErrors['name'] && (
            <span className="mt-1 block text-[11px] text-[var(--saff-deep)]">
              {fieldErrors['name']}
            </span>
          )}
        </label>
        {name && (
          <p className="-mt-3 text-xs text-[var(--muted)]">
            Slug (сервер эцэслэнэ):{' '}
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
            disabled={categories === null}
          >
            {categories === null && <option>Ачаалж байна…</option>}
            {categories
              ?.filter((c) => c.is_active)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          {fieldErrors['category_id'] && (
            <span className="mt-1 block text-[11px] text-[var(--saff-deep)]">
              Ангилал сонгоно уу
            </span>
          )}
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
          {fieldErrors['price'] && (
            <span className="mt-1 block text-[11px] text-[var(--saff-deep)]">
              Үнэ эерэг тоо байх ёстой
            </span>
          )}
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

        {/* status / progress / actions */}
        <div className="mt-2 flex flex-col gap-2">
          <InlineError message={formError} />

          {phase.step === 'uploading' && (
            <div>
              <p className="mb-1 text-xs text-[var(--muted)]">
                Зураг илгээж байна… {Math.round(phase.progress * 100)}%
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--paper-alt)]">
                <div
                  className="h-full rounded-full bg-[var(--act)] transition-[width]"
                  style={{ width: `${Math.round(phase.progress * 100)}%` }}
                />
              </div>
            </div>
          )}

          {phase.step === 'upload-failed' && (
            <div className="rounded-[14px] border border-[var(--saff-deep)] bg-[color-mix(in_srgb,var(--saff-deep)_6%,white)] p-3">
              <p className="mb-2 text-xs font-semibold text-[var(--saff-deep)]">
                Бүтээгдэхүүн хадгалагдсан, гэвч зураг илгээгдсэнгүй: {phase.message}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void uploadTo(phase.productId)}
                  className="rounded-full bg-[var(--act)] px-4 py-1.5 text-xs font-semibold text-[var(--act-text)]"
                >
                  Зургийг дахин илгээх
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  className="rounded-full border border-[var(--hair)] px-4 py-1.5 text-xs font-semibold text-[var(--ink)]"
                >
                  Зураггүй үргэлжлүүлэх
                </button>
              </div>
            </div>
          )}

          {phase.step === 'done' && (
            <p className="rounded-[14px] bg-[color-mix(in_srgb,var(--act)_10%,white)] px-4 py-2 text-xs font-semibold text-[var(--act-text)]">
              ✓ Хадгаллаа — жагсаалт руу буцаж байна…
            </p>
          )}

          <button
            type="submit"
            disabled={busy || categories === null}
            className="rounded-full bg-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)] disabled:opacity-50"
          >
            {phase.step === 'saving' ? 'Хадгалж байна…' : 'Хадгалах'}
          </button>
          <button
            type="button"
            disabled={busy || categories === null}
            onClick={() => void save('published')}
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
