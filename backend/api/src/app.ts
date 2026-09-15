import Fastify, { type FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import type { Env } from './config/env.js';
import { createAnonClient, createServiceClient } from './lib/supabase.js';
import { ApiError } from './lib/errors.js';
import helmetPlugin from './plugins/helmet.js';
import corsPlugin from './plugins/cors.js';
import rateLimitPlugin from './plugins/rate-limit.js';
import { createSupabaseSettingsRepository } from './repositories/supabase/settings.repository.js';
import { createSupabaseUserRepository } from './repositories/supabase/user.repository.js';
import { createSupabaseAuditLogRepository } from './repositories/supabase/audit-log.repository.js';
import { createSupabaseCategoryRepository } from './repositories/supabase/category.repository.js';
import { createSupabaseProductRepository } from './repositories/supabase/product.repository.js';
import { createSupabaseProductImageRepository } from './repositories/supabase/product-image.repository.js';
import { createSupabaseFileStorage } from './repositories/supabase/storage.repository.js';
import { createSupabaseInquiryRepository } from './repositories/supabase/inquiry.repository.js';
import { createSupabaseCartRepository } from './repositories/supabase/cart.repository.js';
import { createSettingsService } from './services/settings.service.js';
import { createCategoryService } from './services/category.service.js';
import { createProductService } from './services/product.service.js';
import { createMediaService } from './services/media.service.js';
import { createInquiryService } from './services/inquiry.service.js';
import { createCartService } from './services/cart.service.js';
import { registerSettingsRoutes } from './controllers/settings.controller.js';
import { registerHealthRoutes } from './controllers/health.controller.js';
import { registerCategoryRoutes } from './controllers/category.controller.js';
import { registerProductRoutes } from './controllers/product.controller.js';
import {
  registerInquiryRoutes,
  registerInquiryCustomerRoutes,
} from './controllers/inquiry.controller.js';
import { registerCartRoutes } from './controllers/cart.controller.js';
import { registerAdminCategoryRoutes } from './controllers/admin/category.controller.js';
import { registerAdminProductRoutes } from './controllers/admin/product.controller.js';
import { registerAdminMediaRoutes, STREAM_LIMIT } from './controllers/admin/media.controller.js';
import { registerAdminInquiryRoutes } from './controllers/admin/inquiry.controller.js';
import { createAuthHooks } from './hooks/auth.js';

// Composition root: Layer 2 plugins, then Controller → Service → Repository
// wiring per feature. The API is stateless (NFR-SCA-001).
export async function buildApp(env: Env): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // Uniform 06-api-spec Error envelope { error, code } (NFR-REL-003)
  app.setErrorHandler(
    (
      err: Error & { statusCode?: number; code?: string; error?: string },
      request,
      reply,
    ) => {
      if (err instanceof ApiError) {
        return reply.code(err.statusCode).send({ error: err.message, code: err.code });
      }
      // @fastify/rate-limit throws the errorResponseBuilder payload
      // ({ error, code }) with the 429 set on the reply, not on the error —
      // map it back to the standard envelope (FR-INQ-007, NFR-SEC-002).
      if (err.code === 'RATE_LIMIT_EXCEEDED' || reply.statusCode === 429) {
        return reply.code(429).send({
          error: err.error ?? err.message ?? 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
        });
      }
      // Fastify/plugin errors that carry a client status (multipart, etc.)
      if (typeof err.statusCode === 'number' && err.statusCode < 500) {
        return reply
          .code(err.statusCode)
          .send({ error: err.message, code: err.code ?? 'BAD_REQUEST' });
      }
      request.log.error(err);
      return reply.code(500).send({ error: 'Internal server error', code: 'INTERNAL' });
    },
  );

  // Layer 2 — security plugins (docs/phase-0/08 §4)
  await app.register(helmetPlugin);
  await app.register(corsPlugin, { env });
  await app.register(rateLimitPlugin, { env });
  await app.register(multipart, {
    limits: { fileSize: STREAM_LIMIT, files: 10 },
  });

  // Dependency wiring. anonClient: public reads (RLS-constrained).
  // serviceClient: designed RLS bypasses (role lookup, audit writes) AND
  // admin CRUD — admin authorization is enforced by the requireAdmin hook
  // at Layer 3 before any service_role query runs; RLS remains the safety
  // net for clients that talk to Supabase directly (docs/phase-0/08 §6.1).
  const anonClient = createAnonClient(env);
  const serviceClient = createServiceClient(env);
  const settingsRepo = createSupabaseSettingsRepository(anonClient);
  const userRepo = createSupabaseUserRepository(serviceClient);
  const auditLogRepo = createSupabaseAuditLogRepository(serviceClient);
  const categoryRepo = createSupabaseCategoryRepository(anonClient, serviceClient);
  const productRepo = createSupabaseProductRepository(anonClient, serviceClient);
  const productImageRepo = createSupabaseProductImageRepository(serviceClient);
  const fileStorage = createSupabaseFileStorage(serviceClient);
  // Inquiries + cart go through the service client with scoping enforced in
  // the service/controller layer (own-rows filter, admin scope); RLS remains
  // the safety net for any client that talks to Supabase directly.
  const inquiryRepo = createSupabaseInquiryRepository(serviceClient);
  const cartRepo = createSupabaseCartRepository(serviceClient);

  const settingsService = createSettingsService(settingsRepo);
  const categoryService = createCategoryService(categoryRepo, auditLogRepo);
  const productService = createProductService(productRepo, auditLogRepo);
  const mediaService = createMediaService(
    productRepo,
    productImageRepo,
    fileStorage,
    auditLogRepo,
  );
  const inquiryService = createInquiryService(inquiryRepo, productRepo, auditLogRepo);
  const cartService = createCartService(cartRepo, productRepo);

  const { requireAuth, requireAdmin, optionalAuth } = createAuthHooks({
    authClient: anonClient,
    users: userRepo,
    auditLogs: auditLogRepo,
  });

  // Routes — REST at /api/v1 (NFR-COM-005: JSON everywhere)
  await app.register(
    async (api) => {
      registerHealthRoutes(api);
      registerSettingsRoutes(api, settingsService);
      registerCategoryRoutes(api, categoryService);
      registerProductRoutes(api, productService);
      // Public inquiry submission (guest or authenticated via optionalAuth,
      // 3/hr rate limit) — FR-INQ-001..007
      registerInquiryRoutes(api, inquiryService, {
        optionalAuth,
        rateLimitMax: env.RATE_LIMIT_INQUIRY_MAX,
      });

      // Authenticated customer scope — requireAuth (any signed-in user).
      // Own inquiry history + personal save-for-later list (NFR-SEC-010).
      await api.register(async (auth) => {
        auth.addHook('onRequest', requireAuth);
        registerInquiryCustomerRoutes(auth, inquiryService);
        registerCartRoutes(auth, cartService);
      });

      // Admin scope — every route requires JWT + admin role
      // (docs/phase-0/08 §5.5 scoped-plugin encapsulation, NFR-SEC-009)
      await api.register(
        async (admin) => {
          admin.addHook('onRequest', requireAuth);
          admin.addHook('onRequest', requireAdmin);

          admin.get('/ping', async (request) => ({ ok: true, user: request.user }));
          registerAdminCategoryRoutes(admin, categoryService);
          registerAdminProductRoutes(admin, productService);
          registerAdminMediaRoutes(admin, mediaService);
          registerAdminInquiryRoutes(admin, inquiryService);
        },
        { prefix: '/admin' },
      );
    },
    { prefix: '/api/v1' },
  );

  return app;
}
