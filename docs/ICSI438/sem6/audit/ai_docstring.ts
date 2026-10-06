// Controlled faulty AI exercise draft: not integrated; see provenance.md.
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
} from '../../../../backend/api/src/repositories/types.js';
import { notFound } from '../../../../backend/api/src/lib/errors.js';

// @internal — pagination хэлбэр нь service return-д харагдана; тусдаа supported API биш.
interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; total_pages: number };
}

/**
 * Зочин болон нэвтэрсэн хэрэглэгчийн inquiry service үүсгэнэ.
 *
 * @param inquiries - Inquiry хадгалах, унших repository.
 * @param products - Холбогдох бүтээгдэхүүнийг шалгах repository.
 * @param auditLogs - Admin төлөв өөрчилсөн үйлдлийг бүртгэх repository.
 * @returns submit, listOwn, listAdmin, updateStatus method бүхий service.
 * @throws Factory өөрөө алдаа шидэхгүй.
 * @example
 * ```ts
 * const service = createInquiryService(
 *   inquiryRepository,
 *   productRepository,
 *   auditLogRepository
 * );
 * ```
 */
export function createInquiryService(
  inquiries: InquiryRepository,
  products: ProductRepository,
  auditLogs: AuditLogRepository,
) {
  return {
    // UC-G-007 / FR-INQ-001..003 — guest OR authenticated submission.
    // customerId is the JWT subject when present, else null (guest).
    /**
     * Inquiry үүсгэхдээ утсыг яг 8 цифр эсэхийг service өөрөө шалгана.
     *
     * @param input - Controller-оор inquiryInputSchema шалгасан input; email талбаргүй.
     * @param customerId - JWT subject UUID эсвэл зочинд null; caller өөрөө баталгаажуулна.
     * @returns Repository-ийн үүсгэсэн Inquiry; input validation болон auth энэ method-д хийгдэхгүй.
     * @throws PRODUCT_NOT_FOUND (404) — product_id олдохгүй; repository алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const inquiry = await service.submit(
     *   {
     *     customer_name: "Тест хэрэглэгч",
     *     phone: "99112233",
     *     message: "Ногоон Дарь эх байгаа юу?"
     *   },
     *   null
     * );
     * ```
     */
    async submit(input: InquiryInput, customerId: string | null): Promise<Inquiry> {
      // A referenced product must exist (clean 404 instead of an FK 500).
      if (input.product_id) {
        const product = await products.findById(input.product_id);
        if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      }
      return inquiries.create({ ...input, customer_id: customerId });
    },

    // "Inquiry history" — a customer reads only their own (migration 0007).
    /**
     * Өгсөн хэрэглэгчийн inquiry жагсаалтыг repository-оос уншина.
     *
     * @param customerId - Controller-оор баталгаажсан хэрэглэгчийн UUID; service JWT шалгахгүй.
     * @returns Pagination metadata бүхий InquiryPage буцаана.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const inquiries = await service.listOwn(customerId);
     * ```
     */
    async listOwn(customerId: string): Promise<Inquiry[]> {
      return inquiries.listByCustomer(customerId);
    },

    // FR-INQ-004/006 — admin inbox, newest first, filterable + paginated.
    /**
     * Admin inquiry жагсаалтад pagination metadata нэмнэ.
     *
     * @param query - Schema шалгасан AdminInquiryListQuery; page ≥ 1, limit 1–50.
     * @returns Inquiry data болон page/limit/total/total_pages; хоосон үед total_pages = 1.
     * @throws Repository-ийн алдаа өөрчлөгдөхгүй дамжина.
     * @example
     * ```ts
     * const page = await service.listAdmin({ page: 1, limit: 12, status: "new" });
     * ```
     */
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

    // UC-ADM-010 / FR-INQ-005 — accepted status values; transition order is not enforced here.
    /**
     * Inquiry status-ийг зөвхөн new → contacted → closed дарааллаар, нэг transaction-д өөрчилнө.
     *
     * @param id - Inquiry UUID.
     * @param status - Шалгасан new, contacted эсвэл closed утга; шилжилтийн дарааллыг service хориглохгүй.
     * @param adminId - Controller-оор admin эрх баталгаажсан UUID.
     * @returns Зассан Inquiry.
     * @throws INQUIRY_NOT_FOUND (404); repository/audit алдаа дамжина. Audit бүтэлгүйтвэл status өөрчлөлт rollback хийгдэхгүй.
     * @example
     * ```ts
     * const inquiry = await service.updateStatus(inquiryId, "contacted", adminId);
     * ```
     */
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

/** InquiryService нь createInquiryService-ийн method-уудын inferred contract.
 * @example
 * ```ts
 * type Service = InquiryService;
 * ```
 */
export type InquiryService = ReturnType<typeof createInquiryService>;
