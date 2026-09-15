import type { FastifyInstance } from 'fastify';
import { inquiryInputSchema, type InquiryInput } from '@nogoolin/validation-schemas';
import type { InquiryService } from '../services/inquiry.service.js';
import type { AuthHooks } from '../hooks/auth.js';
import { validateBody } from '../hooks/validate.js';

// Public inquiry submission (06-api-spec POST /inquiries).
// Guest OR authenticated (optionalAuth links customer_id). Rate limited to
// RATE_LIMIT_INQUIRY_MAX per hour (FR-INQ-007, NFR-SEC-002).
export function registerInquiryRoutes(
  fastify: FastifyInstance,
  service: InquiryService,
  opts: { optionalAuth: AuthHooks['optionalAuth']; rateLimitMax: number },
): void {
  fastify.post<{ Body: InquiryInput }>(
    '/inquiries',
    {
      config: { rateLimit: { max: opts.rateLimitMax, timeWindow: '1 hour' } },
      preHandler: [opts.optionalAuth, validateBody(inquiryInputSchema)],
    },
    async (request, reply) => {
      const inquiry = await service.submit(request.body, request.user?.id ?? null);
      return reply.code(201).send({ data: inquiry });
    },
  );
}

// Authenticated customer inquiry history (a customer reads only their own).
// Registered inside the requireAuth scope. Spec-gap addition beyond
// 06-api-spec v1.0 (FR-INQ / "Inquiry history" roadmap task).
export function registerInquiryCustomerRoutes(
  fastify: FastifyInstance,
  service: InquiryService,
): void {
  fastify.get('/inquiries/mine', async (request) => {
    return { data: await service.listOwn(request.user!.id) };
  });
}
