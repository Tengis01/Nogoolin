// Export only the source/config needed for this course pipeline, never environment files.
import fs from 'node:fs';
import path from 'node:path';
import { root, sem } from './check-docs.mjs';

const target = path.join(sem, 'tmp/gitlab-bundle');
const exact = ['.gitlab-ci.yml', 'tsconfig.base.json', 'backend/api/package.json', 'backend/api/src/repositories/types.ts', 'backend/api/src/lib/errors.ts', 'backend/api/src/lib/slug.ts', 'backend/api/src/lib/translit.ts', 'packages/validation-schemas/package.json'];
for (const folder of ['backend/api/src/services', 'packages/validation-schemas/src']) {
  for (const n of fs.readdirSync(path.join(root, folder))) if (n.endsWith('.ts')) exact.push(`${folder}/${n}`);
}
const semFiles = ['gitlab-ci.yml', 'typedoc.json', 'tsconfig.json', 'api-reference.md', 'tools/package.json', 'tools/package-lock.json', 'tools/check-docs.mjs', 'tools/test-documentation.mjs', 'tools/run-verify.mjs', 'audit/ai-references.json'];
for (const f of semFiles) exact.push(`docs/ICSI438/sem6/${f}`);
for (const f of exact) {
  const dest = path.join(target, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(root, f), dest);
}
fs.writeFileSync(path.join(target, '.gitignore'), 'node_modules/\npublic/\ndocs/ICSI438/sem6/tmp/\ndocs/ICSI438/sem6/reference/\n');
fs.writeFileSync(path.join(target, 'README.md'), '# Nogoolin Seminar 6 documentation build\n\nThis is an allowlisted course source bundle, not the complete application.\nRun `npm ci --prefix docs/ICSI438/sem6/tools` then `npm run verify --prefix docs/ICSI438/sem6/tools`.\nGitLab CI builds the same API reference and publishes public/ from the default branch.\nThe GitHub source link in the reference points to the original project.\n');
console.log(`Exported ${exact.length} allowlisted files to ${path.relative(root, target)}.`);
