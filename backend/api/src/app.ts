import Fastify, { type FastifyInstance } from 'fastify';
import type { Env } from './config/env.js';
import { createAnonClient, createServiceClient } from './lib/supabase.js';
import helmetPlugin from './plugins/helmet.js';
import corsPlugin from './plugins/cors.js';
import rateLimitPlugin from './plugins/rate-limit.js';
import { createSupabaseSettingsRepository } from './repositories/supabase/settings.repository.js';
import { createSupabaseUserRepository } from './repositories/supabase/user.repository.js';
import { createSupabaseAuditLogRepository } from './repositories/supabase/audit-log.repository.js';
import { createSettingsService } from './services/settings.service.js';
import { registerSettingsRoutes } from './controllers/settings.controller.js';
import { registerHealthRoutes } from './controllers/health.controller.js';
import { createAuthHooks } from './hooks/auth.js';

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

  // Dependency wiring. The service client exists ONLY for the designed RLS
  // bypasses (role lookup, audit writes) — it never serves user CRUD.
  const anonClient = createAnonClient(env);
  const serviceClient = createServiceClient(env);
  const settingsRepo = createSupabaseSettingsRepository(anonClient);
  const userRepo = createSupabaseUserRepository(serviceClient);
  const auditLogRepo = createSupabaseAuditLogRepository(serviceClient);
  const settingsService = createSettingsService(settingsRepo);
  const { requireAuth, requireAdmin } = createAuthHooks({
    authClient: anonClient,
    users: userRepo,
    auditLogs: auditLogRepo,
  });

  // Routes — REST at /api/v1 (NFR-COM-005: JSON everywhere)
  await app.register(
    async (api) => {
      registerHealthRoutes(api);
      registerSettingsRoutes(api, settingsService);

      // Admin scope — every route in here requires JWT + admin role
      // (docs/08 §5.5 scoped-plugin encapsulation, NFR-SEC-009)
      await api.register(
        async (admin) => {
          admin.addHook('onRequest', requireAuth);
          admin.addHook('onRequest', requireAdmin);

          // Smoke-test endpoint for the RBAC chain; real admin routes
          // (products/categories/inquiries) arrive in Phase 2
          admin.get('/ping', async (request) => ({
            ok: true,
            user: request.user,
          }));
        },
        { prefix: '/admin' },
      );
    },
    { prefix: '/api/v1' },
  );

  return app;
}
