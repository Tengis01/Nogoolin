// Route-level request/response schemas.
// Single source of truth is the shared package (NFR-MAIN-003) — the API
// re-exports it so route files import from one local place. Add API-only
// schemas (e.g. internal pagination envelopes) here as routes are built.
export * from '@nogoolin/validation-schemas';
