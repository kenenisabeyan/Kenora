import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@kenora/ui',
    '@kenora/types',
    '@kenora/api-contracts',
    '@kenora/domain',
    '@kenora/observability',
    '@kenora/config',
  ],
  reactStrictMode: true,
};

export default nextConfig;
