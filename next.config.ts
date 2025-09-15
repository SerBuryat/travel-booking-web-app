import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Отключаем все проверки для MVP билда
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
