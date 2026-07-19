import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Shared workspace packages ship TS source — Next transpiles them
  transpilePackages: ['@nogoolin/validation-schemas'],
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
