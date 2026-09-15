import type { FastifyInstance } from 'fastify';
import {
  adminInquiryListQuerySchema,
  inquiryStatusPatchSchema,
  type InquiryStatusPatch,
} from '@nogoolin/validation-schemas';
import type { InquiryService } from '../../services/inquiry.service.js';
import { validateBody } from '../../hooks/validate.js';
import { badRequest } from '../../lib/errors.js';

// Admin inquiry inbox (06-api-spec /admin/inquiries*) — the parent scope
// already enforces requireAuth + requireAdmin (docs/phase-0/08 §5.5).
export function registerAdminInquiryRoutes(
  fastify: FastifyInstance,
  service: InquiryService,
): void {
  // GET /admin/inquiries — newest first, filter by status/product/date range.
  // status is 06-spec; product_id + date_from/date_to are a Phase-4 superset.
  fastify.get('/inquiries', async (request) => {
    const parsed = adminInquiryListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw badRequest('Invalid query parameters', 'VALIDATION_ERROR');
    }
    return service.listAdmin(parsed.data); // { data, meta } envelope
  });

  // PATCH /admin/inquiries/{id}/status → 200 | 404 INQUIRY_NOT_FOUND
  fastify.patch<{ Params: { id: string }; Body: InquiryStatusPatch }>(
    '/inquiries/:id/status',
    { preHandler: validateBody(inquiryStatusPatchSchema) },
    async (request) => {
      const inquiry = await service.updateStatus(
        request.params.id,
        request.body.status,
        request.user!.id,
      );
      return { data: inquiry };
    },
  );
}
