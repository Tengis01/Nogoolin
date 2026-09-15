// Mongolian Cyrillic ⇄ Latin transliteration — pure functions, no external
// calls (SEQ-003 note: keeps search latency low, NFR-PERF-004).
//
// latinToCyrillic: multi-script search (FR-PUB-014) — a Latin-typed query is
// transliterated to Cyrillic and BOTH forms are searched.
// cyrillicToLatin: slug auto-generation from Cyrillic names (FR-PROD-007).
//
// Mapping follows common informal Mongolian romanization. Digraphs are
// resolved before single letters (kh→х before h, sh→ш before s, …).

const LATIN_DIGRAPHS: Array<[string, string]> = [
  ['kh', 'х'],
  ['ts', 'ц'],
  ['ch', 'ч'],
  ['sh', 'ш'],
  ['yo', 'ё'],
  ['yu', 'ю'],
  ['ya', 'я'],
  ['ii', 'ий'],
];

const LATIN_SINGLE: Record<string, string> = {
  a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', e: 'э', j: 'ж', z: 'з',
  i: 'и', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р',
  s: 'с', t: 'т', u: 'у', f: 'ф', h: 'х', c: 'ц', w: 'в', y: 'й',
  q: 'к', x: 'кс',
};

export function latinToCyrillic(input: string): string {
  let rest = input.toLowerCase();
  let out = '';
  outer: while (rest.length > 0) {
    for (const [digraph, cyr] of LATIN_DIGRAPHS) {
      if (rest.startsWith(digraph)) {
        out += cyr;
        rest = rest.slice(digraph.length);
        continue outer;
      }
    }
    const ch = rest[0]!;
    out += LATIN_SINGLE[ch] ?? ch;
    rest = rest.slice(1);
  }
  return out;
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'ye', ё: 'yo', ж: 'j',
  з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

export function cyrillicToLatin(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join('');
}

export function containsCyrillic(input: string): boolean {
  return /[Ѐ-ӿ]/.test(input);
}
