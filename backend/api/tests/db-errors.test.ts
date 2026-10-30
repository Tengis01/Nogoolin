// Unit tests for the Postgres → API error mapping (H2). No database needed,
// so this suite also runs where the Supabase stack is absent (CI).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dbError } from '../src/lib/db-errors.js';
import { ApiError } from '../src/lib/errors.js';

const cases: Array<[string, number, string]> = [
  ['23505', 409, 'DUPLICATE'],
  ['23503', 400, 'INVALID_REFERENCE'],
  ['22P02', 400, 'VALIDATION_ERROR'],
  ['23514', 400, 'VALIDATION_ERROR'],
];

for (const [pgCode, status, apiCode] of cases) {
  test(`dbError maps ${pgCode} → ${status} ${apiCode}`, () => {
    const err = dbError('product create', { code: pgCode, message: 'detail' });
    assert.ok(err instanceof ApiError);
    assert.equal(err.statusCode, status);
    assert.equal(err.code, apiCode);
    // internal DB detail never reaches the client message
    assert.ok(!err.message.includes('detail'));
  });
}

test('dbError keeps unknown codes as plain errors (→ 500, logged)', () => {
  const err = dbError('product create', { code: '53300', message: 'too many connections' });
  assert.ok(!(err instanceof ApiError));
  assert.equal(err.message, 'product create failed: too many connections');
});

test('dbError handles a missing code', () => {
  const err = dbError('cart list', { message: 'boom' });
  assert.ok(!(err instanceof ApiError));
  assert.equal(err.message, 'cart list failed: boom');
});
