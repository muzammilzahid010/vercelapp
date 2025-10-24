import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable strict mode for production
  reactStrictMode: true,
  // Remove development-specific webpack config for production
  webpack: (config, { dev }) => {
    if (dev) {
      // Development-only webpack config
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    return config;
  },
};

export default nextConfig;
