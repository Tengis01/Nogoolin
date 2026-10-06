import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { root, sem, serviceDir, files, parse, symbols, example } from './check-docs.mjs';

const tmp = path.join(sem, 'tmp/runtime');
fs.mkdirSync(tmp, { recursive: true });
const inquiryPath = path.join(serviceDir, 'inquiry.service.ts');
const emit = text => ts.transpileModule(text, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022, removeComments: true },
}).outputText;
fs.writeFileSync(path.join(tmp, 'errors.mjs'), emit(fs.readFileSync(path.join(root, 'backend/api/src/lib/errors.ts'), 'utf8')));
fs.writeFileSync(path.join(tmp, 'inquiry.mjs'), emit(fs.readFileSync(inquiryPath, 'utf8')).replace('../lib/errors.js', './errors.mjs'));
const { createInquiryService } = await import(pathToFileURL(path.join(tmp, 'inquiry.mjs')));
const cfg = ts.readConfigFile(path.join(sem, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, sem);
const fixtureId = '00000000-0000-4000-8000-000000000001';
const input = { customer_name: 'Тест хэрэглэгч', phone: '99112233', message: 'Ногоон Дарь эх байгаа юу?' };
function fixture() {
  const state = { created: null, status: 'closed', audit: [], auditFailure: false };
  const repo = {
    async create(v) { state.created = v; return { ...v, id: fixtureId, status: 'new' }; },
    async listByCustomer() { return []; },
    async listAll() { return { data: [], total: 0 }; },
    async updateStatus(id, status) { state.status = status; return { id, status }; },
  };
  const product = { async findById() { return null; } };
  const audit = { async log(e) { if (state.auditFailure) throw new Error('audit unavailable'); state.audit.push(e); } };
  return { state, repo, service: createInquiryService(repo, product, audit) };
}

test('guest inquiry snippet: null customer ID is accepted', async () => {
  const { service, state } = fixture();
  const result = await service.submit(input, null);
  assert.equal(result.status, 'new');
  assert.equal(state.created.customer_id, null);
});
test('unknown referenced product rejects with documented 404 code', async () => {
  const { service, state } = fixture();
  await assert.rejects(service.submit({ ...input, product_id: fixtureId }, null), e => e.code === 'PRODUCT_NOT_FOUND' && e.statusCode === 404);
  assert.equal(state.created, null);
});
test('listOwn returns an array, without a pagination envelope', async () => {
  const { service } = fixture();
  assert.deepEqual(await service.listOwn(fixtureId), []);
});
test('empty admin list keeps total_pages at 1', async () => {
  const { service } = fixture();
  assert.deepEqual(await service.listAdmin({ page: 1, limit: 12 }), { data: [], meta: { page: 1, limit: 12, total: 0, total_pages: 1 } });
});
test('service does not enforce closed-to-new transition prohibition', async () => {
  const { service, state } = fixture();
  await service.updateStatus(fixtureId, 'new', fixtureId);
  assert.equal(state.status, 'new');
  assert.equal(state.audit[0].action, 'INQUIRY_STATUS_UPDATE');
});
test('missing inquiry rejects before logging audit', async () => {
  const { service, repo, state } = fixture();
  repo.updateStatus = async () => null;
  await assert.rejects(service.updateStatus(fixtureId, 'contacted', fixtureId), e => e.code === 'INQUIRY_NOT_FOUND');
  assert.equal(state.audit.length, 0);
});
test('audit failure propagates and does not roll back prior status mutation', async () => {
  const { service, state } = fixture();
  state.auditFailure = true;
  await assert.rejects(service.updateStatus(fixtureId, 'contacted', fixtureId), /audit unavailable/);
  assert.equal(state.status, 'contacted');
});

test('all JSDoc snippets type-check with declared repository/UUID prerequisites', () => {
  const common = `
import type { AuditLogRepository, ProductRepository, CategoryRepository, CartRepository, SettingsRepository, ProductImageRepository, FileStorage, InquiryRepository } from ${JSON.stringify(path.join(root, 'backend/api/src/repositories/types.js'))};
declare const auditLogRepository: AuditLogRepository;
declare const productRepository: ProductRepository;
declare const categoryRepository: CategoryRepository;
declare const cartRepository: CartRepository;
declare const settingsRepository: SettingsRepository;
declare const imageRepository: ProductImageRepository;
declare const fileStorage: FileStorage;
declare const inquiryRepository: InquiryRepository;
declare const productId: string, categoryId: string, emptyCategoryId: string, imageId: string, inquiryId: string, customerId: string, adminId: string;
declare const imageBytes: Buffer;
`;
  const chunks = [common];
  for (const [i, file] of files.entries()) {
    const sf = parse(path.join(serviceDir, file));
    const entries = symbols(sf);
    const factory = entries.find(s => s.kind === 'FunctionDeclaration').name;
    const exported = entries.filter(s => ['FunctionDeclaration', 'TypeAliasDeclaration', 'InterfaceDeclaration'].includes(s.kind)).map(s => s.name);
    chunks.push(`import { ${exported.join(', ')} } from ${JSON.stringify(path.join(serviceDir, file.replace('.ts', '.js')))};`);
    chunks.push(`async function examples${i}() { const service = ${factory}(${sf.statements.find(s => s.name?.text === factory).parameters.map(p => ({ repo: 'settingsRepository', cart: 'cartRepository', products: 'productRepository', categories: 'categoryRepository', images: 'imageRepository', storage: 'fileStorage', auditLogs: 'auditLogRepository', inquiries: 'inquiryRepository' })[p.name.text]).join(', ')});`);
    for (const s of entries) { const code = example(s.node); if (code) chunks.push(`{\n${code}\n}`); }
    chunks.push('}');
  }
  const file = path.join(sem, 'tmp/examples.mts');
  fs.writeFileSync(file, chunks.join('\n'));
  const program = ts.createProgram([...parsed.fileNames, file], parsed.options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const output = ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCurrentDirectory: () => root, getCanonicalFileName: s => s, getNewLine: () => '\n' });
  assert.equal(diagnostics.length, 0, output);
});

test('reflection catches seeded ghost method/type, accepts corrected reference list', () => {
  const refs = JSON.parse(fs.readFileSync(path.join(sem, 'audit/ai-references.json'), 'utf8'));
  const runtime = fixture().service;
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const checker = program.getTypeChecker();
  const schema = program.getSourceFile(path.join(root, 'packages/validation-schemas/src/index.ts'));
  const names = new Set(checker.getExportsOfModule(checker.getSymbolAtLocation(schema)).map(s => s.name));
  const inquiry = program.getSourceFile(inquiryPath);
  const factories = new Set(checker.getExportsOfModule(checker.getSymbolAtLocation(inquiry)).map(s => s.name));
  const verify = r => [
    ...(!factories.has(r.factory) ? [`missing factory: ${r.factory}`] : []),
    ...r.methods.filter(m => typeof runtime[m] !== 'function').map(m => `missing method: ${m}`),
    ...r.types.filter(t => !names.has(t)).map(t => `missing type: ${t}`),
  ];
  assert.deepEqual(verify(refs.corrected), []);
  assert.deepEqual(verify(refs.seeded), ['missing method: getInquiryById', 'missing type: InquiryReceipt']);
});
