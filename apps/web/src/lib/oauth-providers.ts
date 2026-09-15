// Server-only helper: which OAuth providers have real credentials.
// The client IDs live in the root .env (consumed by supabase/config.toml);
// mirror them into apps/web/.env.local so the login page can detect
// configuration state. Placeholder or empty ⇒ "not configured" UI state
// instead of a crashing OAuth redirect (Task 2 requirement).
const PLACEHOLDER_HINTS = ['your-', 'xxxx', 'placeholder', 'changeme'];

function isConfigured(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.toLowerCase();
  return !PLACEHOLDER_HINTS.some((hint) => v.includes(hint));
}

export function oauthProviderFlags() {
  return {
    google: isConfigured(process.env.GOOGLE_CLIENT_ID),
    facebook: isConfigured(process.env.FACEBOOK_CLIENT_ID),
  };
}
