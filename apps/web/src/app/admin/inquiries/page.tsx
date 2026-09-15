import { InquiryTable } from '@/components/admin/inquiry-table';

// FR-ADM-006 — admin inquiry inbox. Auth/RBAC comes from the existing
// /admin layout (Phase 1): server-side session + role check on every request.

export const metadata = { title: 'Хүсэлтүүд — Ногоолин админ' };

export default function AdminInquiriesPage() {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
        Харилцагч
      </p>
      <h1 className="mb-6 text-3xl text-[var(--ink)]">Хүсэлтүүд</h1>
      <InquiryTable />
    </div>
  );
}
