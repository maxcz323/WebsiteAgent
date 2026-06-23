import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  turbopack: {
    root: '/Users/max323/Downloads/website-agent-improved',
  },
};

export default nextConfig;
