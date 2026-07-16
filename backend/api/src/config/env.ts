import { z } from 'zod';

// All config comes from environment variables (NFR-SEC-005, NFR-MAIN-008).
// Local dev: values printed by `supabase start` (see README).
// Production: Railway env vars — cloud credentials arrive in Phase 6.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(3001),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  // Server-only — bypasses RLS; never reaches any client (docs/08 §11.2)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Comma-separated allowlist (docs/08 §4.2)
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // NFR-SEC-002 rate limits
  RATE_LIMIT_GENERAL_MAX: z.coerce.number().int().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().default(5),
  RATE_LIMIT_INQUIRY_MAX: z.coerce.number().int().default(3),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    // Fail fast with the exact missing/invalid variable names —
    // values are never printed (they may be secrets).
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration — ${issues}`);
  }
  return result.data;
}

export function allowedOrigins(env: Env): string[] {
  return env.ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}
