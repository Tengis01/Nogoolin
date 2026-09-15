import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Shared workspace packages ship TS source — Next transpiles them
  transpilePackages: ['@nogoolin/validation-schemas'],
  images: {
    remotePatterns: [
      // local Supabase Storage (dev)
      { protocol: 'http', hostname: '127.0.0.1', port: '54321' },
      { protocol: 'http', hostname: 'localhost', port: '54321' },
      // cloud Supabase Storage (Phase 6)
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  webpack: (config) => {
    // validation-schemas uses NodeNext ".js" import specifiers (required by
    // the API's tsc); map them back to .ts for webpack
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.js'],
    };
    return config;
  },
};

export default nextConfig;
