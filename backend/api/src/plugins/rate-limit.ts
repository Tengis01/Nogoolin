import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import type { Env } from '../config/env.js';

// Rate limiting (NFR-SEC-002) — config per docs/08 §4.3.
// Global default: 100 req / 15 min per IP. Stricter per-route overrides
// (auth 5/15min, inquiry 3/hr) are declared on the route definitions.
// In-memory store is an accepted MVP constraint (single container) —
// move to Redis if the API ever scales horizontally.
export default fp<{ env: Env }>(async (fastify, opts) => {
  await fastify.register(rateLimit, {
    max: opts.env.RATE_LIMIT_GENERAL_MAX,
    timeWindow: '15 minutes',
    errorResponseBuilder: () => ({
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    }),
  });
});
