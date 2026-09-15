import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// OAuth / PKCE callback (SEQ-001): exchanges the auth code for a session,
// then redirects to `next`. Registered in supabase/config.toml
// additional_redirect_urls.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
