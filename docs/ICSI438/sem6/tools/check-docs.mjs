import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const sem = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const root = path.resolve(sem, '../../..');
export const serviceDir = path.join(root, 'backend/api/src/services');
export const files = fs.readdirSync(serviceDir).filter(n => n.endsWith('.service.ts')).sort();
export function parse(file) {
  return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}
export function symbols(sf) {
  const rows = [];
  for (const n of sf.statements) {
    if (!n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    if (!n.name) continue;
    rows.push({ node: n, name: n.name.text, kind: ts.SyntaxKind[n.kind] });
    if (ts.isFunctionDeclaration(n)) {
      for (const s of n.body?.statements ?? []) {
        if (!ts.isReturnStatement(s) || !s.expression || !ts.isObjectLiteralExpression(s.expression)) continue;
        for (const m of s.expression.properties) {
          if (ts.isMethodDeclaration(m)) rows.push({ node: m, name: `${n.name.text}.${m.name.getText(sf)}`, kind: 'Method' });
        }
      }
    }
    if (ts.isInterfaceDeclaration(n)) {
      for (const m of n.members) rows.push({ node: m, name: `${n.name.text}.${m.name.getText(sf)}`, kind: 'Property' });
    }
  }
  return rows;
}
export function doc(node) {
  const d = node.jsDoc?.at(-1);
  const tags = ts.getJSDocTags(node);
  return { summary: d?.comment, tags, names: tags.map(t => t.tagName.text) };
}
export function example(node) {
  const t = ts.getJSDocTags(node).find(t => t.tagName.text === 'example');
  const value = typeof t?.comment === 'string' ? t.comment : '';
  return value.match(/```ts\s*([\s\S]*?)```/)?.[1]?.trim() ?? '';
}

export function check() {
  const rows = [], errors = [];
  for (const f of files) {
    const sf = parse(path.join(serviceDir, f));
    for (const s of symbols(sf)) {
      const d = doc(s.node);
      if (!d.summary) errors.push(`${f}:${s.name}: missing summary`);
      if (s.kind !== 'Property' && !example(s.node)) errors.push(`${f}:${s.name}: missing @example`);
      if (['FunctionDeclaration', 'Method'].includes(s.kind)) {
        for (const tag of ['returns', 'throws']) {
          if (!d.names.includes(tag)) errors.push(`${f}:${s.name}: missing @${tag}`);
        }
        const params = d.tags.filter(t => t.tagName.text === 'param').map(t => t.name?.getText(sf));
        const expected = s.node.parameters.map(p => p.name.getText(sf));
        if (JSON.stringify(params) !== JSON.stringify(expected)) errors.push(`${f}:${s.name}: parameters differ`);
      }
      rows.push({ file: `backend/api/src/services/${f}`, symbol: s.name, kind: s.kind, documented: !!d.summary, example: !!example(s.node) });
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  const result = { scope: 'six backend service modules; not all repository exports', modules: files.length, documented: rows.length, total: rows.length, rows };
  fs.mkdirSync(path.join(sem, 'evidence'), { recursive: true });
  fs.writeFileSync(path.join(sem, 'evidence/coverage.json'), JSON.stringify(result, null, 2) + '\n');
  const md = ['# Public symbol inventory', '', 'Scope: six backend service modules. Repository-wide coverage is not claimed.', '', '| Module | Symbol | Kind | Documented |', '|---|---|---|---|', ...rows.map(r => `| ${path.basename(r.file)} | ${r.symbol} | ${r.kind} | Yes |`), '', `**${result.documented}/${result.total} symbols** in ${result.modules} modules.`, ''];
  fs.writeFileSync(path.join(sem, 'evidence/public-symbols.md'), md.join('\n'));
  console.log(`Documentation coverage: ${result.documented}/${result.total}; ${result.modules} service modules.`);
  return result;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) check();
