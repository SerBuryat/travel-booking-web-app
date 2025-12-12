import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Отключаем все проверки для MVP билда
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Исключаем open-graph-scraper из клиентского bundle
    // так как он использует Node.js API, недоступные в браузере
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
      config.externals = config.externals || [];
      config.externals.push({
        'open-graph-scraper': 'commonjs open-graph-scraper',
      });
    }
    return config;
  },
};

export default nextConfig;
