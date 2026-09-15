import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { oauthProviderFlags } from '@/lib/oauth-providers';

export const metadata = { title: 'Нэвтрэх — Ногоолин' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = oauthProviderFlags(); // server-side env check

  return (
    <AuthCard title="Нэвтрэх">
      <LoginForm next={next ?? '/'} />
      <OAuthButtons configured={configured} next={next ?? '/'} />
    </AuthCard>
  );
}
