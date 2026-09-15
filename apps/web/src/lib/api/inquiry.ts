'use client';

import type {
  Inquiry,
  InquiryInput,
  InquiryStatus,
} from '@nogoolin/validation-schemas';
import { apiFetch } from './client';
import type { PaginationMeta } from './admin';

// Phase 4 inquiry endpoints (backend/api controllers are the source of truth
// for these shapes).

/**
 * POST /inquiries — guest OR authenticated (FR-INQ-001). optionalAuth attaches
 * the token when a session exists so the API links customer_id; a signed-out
 * visitor submits exactly the same way, with no login redirect.
 */
export async function submitInquiry(input: InquiryInput): Promise<Inquiry> {
  const res = await apiFetch<{ data: Inquiry }>('/inquiries', {
    method: 'POST',
    body: input,
    optionalAuth: true,
  });
  return res.data;
}

/** GET /inquiries/mine — the signed-in customer's own inquiry history */
export async function fetchMyInquiries(): Promise<Inquiry[]> {
  const res = await apiFetch<{ data: Inquiry[] }>('/inquiries/mine', { auth: true });
  return res.data;
}

// ── admin inbox ────────────────────────────────────────────────

export interface AdminInquiryQuery {
  page?: number;
  status?: InquiryStatus | '';
  product_id?: string;
  date_from?: string;
  date_to?: string;
}

export async function fetchAdminInquiries(
  query: AdminInquiryQuery,
): Promise<{ data: Inquiry[]; meta: PaginationMeta }> {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set('page', String(query.page));
  if (query.status) params.set('status', query.status);
  if (query.product_id) params.set('product_id', query.product_id);
  // date-only inputs → widen to the full day so the range is inclusive
  if (query.date_from) params.set('date_from', `${query.date_from}T00:00:00.000Z`);
  if (query.date_to) params.set('date_to', `${query.date_to}T23:59:59.999Z`);
  const qs = params.toString();
  return apiFetch<{ data: Inquiry[]; meta: PaginationMeta }>(
    `/admin/inquiries${qs ? `?${qs}` : ''}`,
    { auth: true },
  );
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<Inquiry> {
  const res = await apiFetch<{ data: Inquiry }>(`/admin/inquiries/${id}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true,
  });
  return res.data;
}
