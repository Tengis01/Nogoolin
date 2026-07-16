import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { allowedOrigins, type Env } from '../config/env.js';

// CORS allowlist (NFR-SEC-006) — config per docs/08 §4.2.
// Origins come from ALLOWED_ORIGINS env (local: http://localhost:3000;
// production adds https://nogoolin.mn — set per environment, never hardcoded).
export default fp<{ env: Env }>(async (fastify, opts) => {
  const origins = allowedOrigins(opts.env);
  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin || origins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
});
