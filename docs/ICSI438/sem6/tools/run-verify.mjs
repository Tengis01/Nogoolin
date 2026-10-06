import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tools = path.dirname(fileURLToPath(import.meta.url));
const sem = path.resolve(tools, '..');
const log = [`Node ${process.version}`, 'Scope: Sem6 service documentation; local repository doubles, no live database.', ''];
for (const script of ['check', 'test', 'docs']) {
  const r = spawnSync('npm', ['run', script], { cwd: tools, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });
  const output = (r.stdout ?? '') + (r.stderr ?? '') + (r.error ? String(r.error) : '');
  process.stdout.write(output);
  log.push(`$ npm run ${script}`, output, `Exit: ${r.status}`, '');
  fs.mkdirSync(path.join(sem, 'evidence'), { recursive: true });
  fs.writeFileSync(path.join(sem, 'evidence/verification.txt'), log.join('\n'));
  if (r.status !== 0) process.exit(r.status ?? 1);
}
