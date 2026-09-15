import type {
  AdminInquiryListQuery,
  Inquiry,
  InquiryInput,
  InquiryStatus,
} from '@nogoolin/validation-schemas';
import type {
  AuditLogRepository,
  InquiryRepository,
  ProductRepository,
} from '../repositories/types.js';
import { notFound } from '../lib/errors.js';

interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; total_pages: number };
}

export function createInquiryService(
  inquiries: InquiryRepository,
  products: ProductRepository,
  auditLogs: AuditLogRepository,
) {
  return {
    // UC-G-007 / FR-INQ-001..003 — guest OR authenticated submission.
    // customerId is the JWT subject when present, else null (guest).
    async submit(input: InquiryInput, customerId: string | null): Promise<Inquiry> {
      // A referenced product must exist (clean 404 instead of an FK 500).
      if (input.product_id) {
        const product = await products.findById(input.product_id);
        if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      }
      return inquiries.create({ ...input, customer_id: customerId });
    },

    // "Inquiry history" — a customer reads only their own (migration 0007).
    async listOwn(customerId: string): Promise<Inquiry[]> {
      return inquiries.listByCustomer(customerId);
    },

    // FR-INQ-004/006 — admin inbox, newest first, filterable + paginated.
    async listAdmin(query: AdminInquiryListQuery): Promise<Paginated<Inquiry>> {
      const result = await inquiries.listAll(query);
      return {
        data: result.data,
        meta: {
          page: query.page,
          limit: query.limit,
          total: result.total,
          total_pages: Math.max(1, Math.ceil(result.total / query.limit)),
        },
      };
    },

    // UC-ADM-010 / FR-INQ-005 — status lifecycle new → contacted → closed.
    async updateStatus(
      id: string,
      status: InquiryStatus,
      adminId: string,
    ): Promise<Inquiry> {
      const inquiry = await inquiries.updateStatus(id, status);
      if (!inquiry) throw notFound('Inquiry not found', 'INQUIRY_NOT_FOUND');
      await auditLogs.log({
        admin_id: adminId,
        action: 'INQUIRY_STATUS_UPDATE',
        entity_type: 'inquiry',
        entity_id: id,
        metadata: { status },
      });
      return inquiry;
    },
  };
}

export type InquiryService = ReturnType<typeof createInquiryService>;
