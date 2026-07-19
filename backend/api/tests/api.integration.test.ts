// Integration tests — run against the LOCAL Supabase stack (`supabase start`).
// The whole suite is skipped (with a visible message) when the stack is not
// reachable, so `pnpm test` stays green in environments without Docker.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMultipart,
  createTestContext,
  loadRootEnv,
  stackReachable,
  TINY_PNG,
  type TestContext,
} from './helpers.js';

loadRootEnv();
const reachable = await stackReachable();

if (!reachable) {
  test('integration suite SKIPPED — local Supabase stack not running (run `pnpm exec supabase start`)', (t) =>
    t.skip());
} else {
  let ctx: TestContext;
  // Per-run token keeps slugs unique so the suite is idempotent across runs
  const runId = String(Date.now() % 1000000);
  // created during the run, shared across sequential tests
  let categoryId = '';
  let categorySlug = '';
  let emptyCategoryId = '';
  let productId = '';
  let productSlug = '';
  let imageId = '';

  before(async () => {
    ctx = await createTestContext();
  });
  after(async () => {
    // best-effort: remove the category left over after the product is gone
    if (categoryId) {
      await ctx.app.inject({
        method: 'DELETE',
        url: `/api/v1/admin/categories/${categoryId}`,
        headers: { authorization: `Bearer ${ctx.adminToken}` },
      });
    }
    await ctx.cleanup();
  });

  const admin = () => ({ authorization: `Bearer ${ctx.adminToken}` });
  const customer = () => ({ authorization: `Bearer ${ctx.customerToken}` });

  // ── Categories ────────────────────────────────────────────────

  test('GET /categories → 200 with data array', async () => {
    const res = await ctx.app.inject({ method: 'GET', url: '/api/v1/categories' });
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.json().data));
  });

  test('POST /admin/categories without token → 401', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/categories',
      payload: { name: 'Хүж' },
    });
    assert.equal(res.statusCode, 401);
    assert.equal(res.json().code, 'UNAUTHORIZED');
  });

  test('POST /admin/categories with customer token → 403', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/categories',
      headers: customer(),
      payload: { name: 'Хүж' },
    });
    assert.equal(res.statusCode, 403);
    assert.equal(res.json().code, 'FORBIDDEN');
  });

  test('POST /admin/categories with invalid body → 400', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/categories',
      headers: admin(),
      payload: { description: 'no name' },
    });
    assert.equal(res.statusCode, 400);
    assert.equal(res.json().code, 'VALIDATION_ERROR');
  });

  test('POST /admin/categories → 201, Cyrillic slug auto-generated', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/categories',
      headers: admin(),
      payload: { name: `Хүж тест ${runId}`, description: 'test', sort_order: 1 },
    });
    assert.equal(res.statusCode, 201);
    const category = res.json().data;
    assert.equal(category.slug, `khuj-tyest-${runId}`); // cyrillicToLatin slugify
    assert.equal(category.is_active, true);
    categoryId = category.id;
    categorySlug = category.slug;
  });

  test('duplicate category name → numeric slug suffix (UC-ADM-007)', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/categories',
      headers: admin(),
      payload: { name: `Хүж тест ${runId}` },
    });
    assert.equal(res.statusCode, 201);
    assert.equal(res.json().data.slug, `khuj-tyest-${runId}-2`);
    emptyCategoryId = res.json().data.id;
  });

  test('GET /categories/{slug} → 200 for active category', async () => {
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/api/v1/categories/${categorySlug}`,
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().data.id, categoryId);
  });

  test('PATCH /admin/categories/{id} → 200; unknown id → 404', async () => {
    const ok = await ctx.app.inject({
      method: 'PATCH',
      url: `/api/v1/admin/categories/${categoryId}`,
      headers: admin(),
      payload: { sort_order: 5 },
    });
    assert.equal(ok.statusCode, 200);
    assert.equal(ok.json().data.sort_order, 5);

    const missing = await ctx.app.inject({
      method: 'PATCH',
      url: '/api/v1/admin/categories/00000000-0000-4000-8000-000000000000',
      headers: admin(),
      payload: { sort_order: 1 },
    });
    assert.equal(missing.statusCode, 404);
  });

  // ── Products ──────────────────────────────────────────────────

  test('POST /admin/products: 401 anon / 403 customer / 400 invalid', async () => {
    const anon = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/products',
      payload: {},
    });
    assert.equal(anon.statusCode, 401);

    const cust = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/products',
      headers: customer(),
      payload: {},
    });
    assert.equal(cust.statusCode, 403);

    const invalid = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/products',
      headers: admin(),
      payload: { name: 'Missing price', category_id: categoryId },
    });
    assert.equal(invalid.statusCode, 400);
    assert.equal(invalid.json().code, 'VALIDATION_ERROR');
  });

  test('POST /admin/products → 201 draft with auto slug', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/products',
      headers: admin(),
      payload: {
        name: `Ногоон Дарь Эх ${runId}`,
        name_en: 'Green Tara',
        category_id: categoryId,
        price: 145000,
        short_description: 'Гар хийцийн товруу',
        usage_instruction: '## Хэрэглэх заавар\n1. Тавих',
        search_tags: ['nogoon dar eh', 'green tara', 'tara statue'],
      },
    });
    assert.equal(res.statusCode, 201);
    const product = res.json().data;
    assert.equal(product.status, 'draft');
    assert.equal(product.slug, `nogoon-dar-ekh-${runId}`);
    assert.equal(product.usage_instruction, '## Хэрэглэх заавар\n1. Тавих');
    productId = product.id;
    productSlug = product.slug;
  });

  test('draft product is NOT publicly visible (FR-PROD-004)', async () => {
    const list = await ctx.app.inject({ method: 'GET', url: '/api/v1/products' });
    assert.equal(list.statusCode, 200);
    assert.ok(!list.json().data.some((p: { id: string }) => p.id === productId));

    const detail = await ctx.app.inject({
      method: 'GET',
      url: `/api/v1/products/${productSlug}`,
    });
    assert.equal(detail.statusCode, 404);
    assert.equal(detail.json().code, 'PRODUCT_NOT_FOUND');
  });

  test('PATCH publish → visible publicly with images+category joins', async () => {
    const patch = await ctx.app.inject({
      method: 'PATCH',
      url: `/api/v1/admin/products/${productId}`,
      headers: admin(),
      payload: { status: 'published', is_featured: true },
    });
    assert.equal(patch.statusCode, 200);
    assert.equal(patch.json().data.status, 'published');

    const detail = await ctx.app.inject({
      method: 'GET',
      url: `/api/v1/products/${productSlug}`,
    });
    assert.equal(detail.statusCode, 200);
    const product = detail.json().data;
    assert.ok(Array.isArray(product.images));
    assert.equal(product.category.id, categoryId);
    assert.equal(product.search_vector, undefined); // internal column stripped
  });

  test('public list: pagination meta + is_featured + category filters', async () => {
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/api/v1/products?is_featured=true&category_id=${categoryId}`,
    });
    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.ok(body.data.some((p: { id: string }) => p.id === productId));
    assert.deepEqual(Object.keys(body.meta).sort(), ['limit', 'page', 'total', 'total_pages']);
  });

  test('multi-script search: Cyrillic, English, Latin-transliterated (FR-PUB-014)', async () => {
    for (const query of ['Ногоон', 'green tara', 'nogoon dar eh']) {
      const res = await ctx.app.inject({
        method: 'GET',
        url: `/api/v1/products?search=${encodeURIComponent(query)}`,
      });
      assert.equal(res.statusCode, 200);
      assert.ok(
        res.json().data.some((p: { id: string }) => p.id === productId),
        `search "${query}" should find the product`,
      );
    }
    const none = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/products?search=zzz-does-not-exist',
    });
    assert.equal(none.json().data.length, 0);
  });

  test('GET /admin/products lists drafts too; requires admin', async () => {
    const anon = await ctx.app.inject({ method: 'GET', url: '/api/v1/admin/products' });
    assert.equal(anon.statusCode, 401);

    const res = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/admin/products?status=published',
      headers: admin(),
    });
    assert.equal(res.statusCode, 200);
    assert.ok(res.json().data.some((p: { id: string }) => p.id === productId));
  });

  // ── Images ────────────────────────────────────────────────────

  test('POST images: valid file uploaded, invalid file rejected individually', async () => {
    const { payload, contentType } = buildMultipart([
      { field: 'files', filename: 'front.png', contentType: 'image/png', data: TINY_PNG },
      {
        field: 'files',
        filename: 'virus.exe',
        contentType: 'application/octet-stream',
        data: Buffer.from('nope'),
      },
      { field: 'alt_texts', value: 'Урд талаас' },
    ]);
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/v1/admin/products/${productId}/images`,
      headers: { ...admin(), 'content-type': contentType },
      payload,
    });
    assert.equal(res.statusCode, 201);
    const body = res.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.rejected.length, 1);
    assert.match(body.data[0].image_url, /product-images/);
    assert.equal(body.data[0].alt_text, 'Урд талаас');
    imageId = body.data[0].id;
  });

  test('POST images: all invalid → 400; anon → 401; customer → 403', async () => {
    const bad = buildMultipart([
      { field: 'files', filename: 'doc.pdf', contentType: 'application/pdf', data: Buffer.from('x') },
    ]);
    const allInvalid = await ctx.app.inject({
      method: 'POST',
      url: `/api/v1/admin/products/${productId}/images`,
      headers: { ...admin(), 'content-type': bad.contentType },
      payload: bad.payload,
    });
    assert.equal(allInvalid.statusCode, 400);
    assert.equal(allInvalid.json().code, 'ALL_FILES_INVALID');

    const anon = await ctx.app.inject({
      method: 'POST',
      url: `/api/v1/admin/products/${productId}/images`,
      payload: {},
    });
    assert.equal(anon.statusCode, 401);

    const cust = await ctx.app.inject({
      method: 'POST',
      url: `/api/v1/admin/products/${productId}/images`,
      headers: customer(),
      payload: {},
    });
    assert.equal(cust.statusCode, 403);
  });

  test('PATCH image sort_order/alt_text → 200; then DELETE → 204', async () => {
    const patch = await ctx.app.inject({
      method: 'PATCH',
      url: `/api/v1/admin/products/${productId}/images/${imageId}`,
      headers: admin(),
      payload: { sort_order: 3 },
    });
    assert.equal(patch.statusCode, 200);
    assert.equal(patch.json().data.sort_order, 3);

    const del = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/products/${productId}/images/${imageId}`,
      headers: admin(),
    });
    assert.equal(del.statusCode, 204);

    const gone = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/products/${productId}/images/${imageId}`,
      headers: admin(),
    });
    assert.equal(gone.statusCode, 404);
  });

  // ── Deletion flows ────────────────────────────────────────────

  test('DELETE category with products → 409 CATEGORY_NOT_EMPTY', async () => {
    const res = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/categories/${categoryId}`,
      headers: admin(),
    });
    assert.equal(res.statusCode, 409);
    assert.equal(res.json().code, 'CATEGORY_NOT_EMPTY');
  });

  test('DELETE empty category → 204', async () => {
    const res = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/categories/${emptyCategoryId}`,
      headers: admin(),
    });
    assert.equal(res.statusCode, 204);
  });

  test('DELETE product default = soft archive; ?hard=true removes', async () => {
    const soft = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/products/${productId}`,
      headers: admin(),
    });
    assert.equal(soft.statusCode, 204);

    const adminView = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/admin/products?status=archived',
      headers: admin(),
    });
    assert.ok(adminView.json().data.some((p: { id: string }) => p.id === productId));

    const publicView = await ctx.app.inject({
      method: 'GET',
      url: `/api/v1/products/${productSlug}`,
    });
    assert.equal(publicView.statusCode, 404); // archived = not public

    const hard = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/admin/products/${productId}?hard=true`,
      headers: admin(),
    });
    assert.equal(hard.statusCode, 204);

    const afterHard = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/admin/products?status=archived',
      headers: admin(),
    });
    assert.ok(!afterHard.json().data.some((p: { id: string }) => p.id === productId));
  });
}
