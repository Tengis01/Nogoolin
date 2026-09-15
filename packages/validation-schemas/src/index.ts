// @nogoolin/validation-schemas — single source of truth for validation
// across web, api, and mobile (NFR-SEC-003, NFR-MAIN-003).
// Client-side use = UX only; the API re-validates unconditionally
// (docs/phase-0/08 §7.1 — server never trusts that client validation ran).

export * from './common.js';
export * from './user.schema.js';
export * from './category.schema.js';
export * from './product.schema.js';
export * from './media.schema.js';
export * from './inquiry.schema.js';
export * from './cart.schema.js';
export * from './settings.schema.js';
export * from './order.schema.js';
export * from './audit.schema.js';
