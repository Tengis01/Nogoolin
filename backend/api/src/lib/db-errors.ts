import { badRequest, conflict } from './errors.js';

// Postgres → API error mapping (audit H2). Constraint violations caused by
// the request are client errors; anything else stays a plain Error so the
// global handler returns 500 and logs it. The DB message is never sent to
// the client.
export function dbError(
  context: string,
  error: { code?: string; message: string },
): Error {
  switch (error.code) {
    case '23505': // unique_violation (e.g. slug race)
      return conflict('Already exists', 'DUPLICATE');
    case '23503': // foreign_key_violation (e.g. unknown category_id)
      return badRequest('Referenced record does not exist', 'INVALID_REFERENCE');
    case '22P02': // invalid_text_representation (e.g. malformed uuid)
    case '23514': // check_violation
      return badRequest('Invalid value', 'VALIDATION_ERROR');
    default:
      return new Error(`${context} failed: ${error.message}`);
  }
}
