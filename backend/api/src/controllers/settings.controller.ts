import type { FastifyInstance } from 'fastify';
import type { SettingsService } from '../services/settings.service.js';

// Controller = thin Fastify route handlers. No business logic here
// (NFR-MAIN-001) — delegate to the service immediately.
export function registerSettingsRoutes(
  fastify: FastifyInstance,
  service: SettingsService,
): void {
  // FR-PUB-009 — public, unauthenticated
  fastify.get('/settings/public', async () => {
    return service.getPublicSettings();
  });
}
