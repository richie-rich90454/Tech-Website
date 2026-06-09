import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'americancareercollege.edu',
      },
    ],
  },
};

export default nextConfig;