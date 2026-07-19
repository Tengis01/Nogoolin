// Client-side slug PREVIEW only — the server (backend/api/src/lib/slug.ts)
// generates the authoritative slug incl. uniqueness suffixes (FR-PROD-007).
const CYR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'ye', ё: 'yo', ж: 'j',
  з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

export function slugPreview(name: string): string {
  return name
    .toLowerCase()
    .split('')
    .map((ch) => CYR[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}
