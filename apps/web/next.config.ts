import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Shared workspace packages ship TS source — Next transpiles them
  transpilePackages: ['@nogoolin/validation-schemas'],
};

export default nextConfig;
