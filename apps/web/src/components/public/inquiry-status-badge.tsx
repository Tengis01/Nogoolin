import type { InquiryStatus } from '@nogoolin/validation-schemas';
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_STYLES } from '@/lib/inquiry-display';

// Shared by the customer's inquiry history and the admin inbox (one badge,
// one label set — the admin table imports this rather than duplicating it).
export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${INQUIRY_STATUS_STYLES[status]}`}
    >
      {INQUIRY_STATUS_LABELS[status]}
    </span>
  );
}
