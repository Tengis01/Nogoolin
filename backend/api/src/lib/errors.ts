// Typed API errors mapped to the 06-api-spec Error schema { error, code }
// by the global error handler in app.ts.
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const notFound = (message: string, code = 'NOT_FOUND') =>
  new ApiError(404, code, message);

export const conflict = (message: string, code = 'CONFLICT') =>
  new ApiError(409, code, message);

export const badRequest = (message: string, code = 'BAD_REQUEST') =>
  new ApiError(400, code, message);

/** Upstream (Supabase Storage) failure — 06-api-spec 502 on upload errors */
export const upstreamError = (message: string, code = 'UPSTREAM_ERROR') =>
  new ApiError(502, code, message);
