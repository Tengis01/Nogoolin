import { AuthCard } from '@/components/auth/auth-card';
import { SignupForm } from '@/components/auth/signup-form';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { oauthProviderFlags } from '@/lib/oauth-providers';

export const metadata = { title: 'Бүртгүүлэх — Ногоолин' };

export default function SignupPage() {
  return (
    <AuthCard title="Бүртгүүлэх">
      <SignupForm />
      <OAuthButtons configured={oauthProviderFlags()} />
    </AuthCard>
  );
}
