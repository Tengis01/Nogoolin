import Fastify, { type FastifyInstance } from 'fastify';
import type { Env } from './config/env.js';
import { createAnonClient } from './lib/supabase.js';
import helmetPlugin from './plugins/helmet.js';
import corsPlugin from './plugins/cors.js';
import rateLimitPlugin from './plugins/rate-limit.js';
import { createSupabaseSettingsRepository } from './repositories/supabase/settings.repository.js';
import { createSettingsService } from './services/settings.service.js';
import { registerSettingsRoutes } from './controllers/settings.controller.js';
import { registerHealthRoutes } from './controllers/health.controller.js';

// Composition root: wire Layer 2 plugins, then Controller → Service →
// Repository per feature. The API is stateless (NFR-SCA-001).
export async function buildApp(env: Env): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // Layer 2 — security plugins (docs/08 §4)
  await app.register(helmetPlugin);
  await app.register(corsPlugin, { env });
  await app.register(rateLimitPlugin, { env });

  // Dependency wiring (per request-less singletons for now; per-request
  // JWT-forwarding clients arrive with the auth work in Week 3)
  const anonClient = createAnonClient(env);
  const settingsRepo = createSupabaseSettingsRepository(anonClient);
  const settingsService = createSettingsService(settingsRepo);

  // Routes — REST at /api/v1 (NFR-COM-005: JSON everywhere)
  await app.register(
    async (api) => {
      registerHealthRoutes(api);
      registerSettingsRoutes(api, settingsService);
    },
    { prefix: '/api/v1' },
  );

  return app;
}
