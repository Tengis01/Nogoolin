import type { FastifyReply, FastifyRequest } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserRole } from '@nogoolin/validation-schemas';
import type { AuditLogRepository, UserRepository } from '../repositories/types.js';

// Layer 3 — JWT authentication + RBAC (docs/phase-0/08 §5.4, NFR-SEC-009).
// requireAuth verifies the Supabase JWT and attaches { id, role }.
// requireAdmin (run after requireAuth) enforces role === 'admin' and logs
// rejected attempts. Repositories stay role-agnostic — enforcement lives here.

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; role: UserRole };
  }
}

export interface AuthHooks {
  requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  optionalAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
}

export function createAuthHooks(deps: {
  /** any Supabase client — token verification calls GoTrue, not the DB */
  authClient: SupabaseClient;
  users: UserRepository;
  auditLogs: AuditLogRepository;
}): AuthHooks {
  return {
    // 401 when the token is missing/invalid/expired (NFR-SEC-009)
    async requireAuth(request, reply) {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        await reply
          .code(401)
          .send({ error: 'Missing access token', code: 'UNAUTHORIZED' });
        return;
      }

      const { data, error } = await deps.authClient.auth.getUser(token);
      if (error || !data.user) {
        await reply
          .code(401)
          .send({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
        return;
      }

      const profile = await deps.users.findAuthProfile(data.user.id);
      request.user = { id: data.user.id, role: profile?.role ?? 'customer' };
    },

    // Best-effort auth for public routes that behave differently when a
    // user is signed in (POST /inquiries links customer_id, FR-INQ-001).
    // Never rejects: a missing/invalid token just means "guest".
    async optionalAuth(request) {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) return;
      const { data, error } = await deps.authClient.auth.getUser(token);
      if (error || !data.user) return;
      const profile = await deps.users.findAuthProfile(data.user.id);
      request.user = { id: data.user.id, role: profile?.role ?? 'customer' };
    },

    // 403 when authenticated but not admin (FR-AUTH-009); the rejected
    // attempt is audit-logged fire-and-forget (UC-ADM-011 exception flow)
    async requireAdmin(request, reply) {
      if (request.user?.role !== 'admin') {
        if (request.user) {
          deps.auditLogs
            .log({
              admin_id: request.user.id,
              action: 'UNAUTHORIZED_ACCESS',
              entity_type: 'route',
              metadata: { attempted_route: request.url, method: request.method },
            })
            .catch(() => {
              /* never block the 403 on a logging failure */
            });
        }
        await reply
          .code(403)
          .send({ error: 'Admin access required', code: 'FORBIDDEN' });
      }
    },
  };
}
