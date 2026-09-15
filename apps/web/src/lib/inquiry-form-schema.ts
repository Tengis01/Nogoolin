import { z } from 'zod';
import { inquiryInputSchema, type InquiryInput } from '@nogoolin/validation-schemas';

// Client-side inquiry validation.
//
// The SHARED schema (`inquiryInputSchema`, the exact one the API validates
// with) is the base — the field set and `product_id` rule come from it, so
// the client can never drift from the server contract.
//
// WF-INQ-01 (docs/phase-0/07 §3.6.2, highest precedence) specifies STRICTER rules and
// exact Mongolian error strings for three fields, so those are layered on top:
//   name    — required, non-empty trimmed   → "Нэрээ оруулна уу"
//   phone   — ^\d{8}$ (MN mobile)           → "Утасны дугаар 8 оронтой байх ёстой"
//   message — required, non-empty           → "Хүсэлтийн агуулгаа бичнэ үү"
// Each is a subset of what the server accepts (server phone allows 8–15 chars
// incl. +/space/-, message is optional), so anything passing here passes the
// API. `SchemaStaysCompatible` below makes that a COMPILE-TIME guarantee.
//
// NOTE: WF-INQ-01 also lists an optional И-мэйл (email) field. It is
// deliberately omitted — there is no email column or API field (FR-INQ-002 is
// phone-only). Owner decision 2026-07-26; rendering it would silently discard
// what the customer typed. See PROGRESS.md for the doc-reconciliation note.

export const inquiryFormSchema = inquiryInputSchema.extend({
  customer_name: z
    .string()
    .trim()
    .min(2, 'Нэрээ оруулна уу'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{8}$/, 'Утасны дугаар 8 оронтой байх ёстой'),
  message: z
    .string()
    .trim()
    .min(1, 'Хүсэлтийн агуулгаа бичнэ үү'),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

// Compile-time proof that client-validated data is always a valid API body.
// If the shared schema changes shape, this breaks the build instead of
// failing silently at runtime.
type SchemaStaysCompatible = InquiryFormValues extends InquiryInput ? true : never;
const _typeCheck: SchemaStaysCompatible = true;
void _typeCheck;

/** field name → first error message, from a failed safeParse */
export function fieldErrors(
  error: z.ZodError<InquiryFormValues>,
): Partial<Record<keyof InquiryFormValues, string>> {
  const out: Partial<Record<keyof InquiryFormValues, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof InquiryFormValues | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
