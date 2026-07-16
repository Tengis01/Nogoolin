import type { FastifyInstance } from 'fastify';

// Health check (docs/09 §5.5) — no auth, no sensitive data.
// Railway (and local tooling) uses this to confirm the process is alive.
export function registerHealthRoutes(fastify: FastifyInstance): void {
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
  }));
}
