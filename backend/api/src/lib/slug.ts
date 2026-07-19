import { cyrillicToLatin } from './translit.js';

// Slug auto-generation (FR-PROD-007, FR-CAT-005): Cyrillic names are
// transliterated to Latin, then reduced to url-safe hyphenated form.
export function slugify(name: string): string {
  const base = cyrillicToLatin(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return base || 'item';
}

/**
 * Uniqueness with numeric suffix (UC-ADM-007 Exception Flow): base,
 * base-2, base-3, … `exists` is the repository slug-existence probe.
 */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  if (!(await exists(base))) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!(await exists(candidate))) return candidate;
  }
}
