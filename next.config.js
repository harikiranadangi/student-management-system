/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  allowedDevOrigins: ['http://192.168.5.2:3000'],

  turbopack: {
    // You can add additional configurations if needed here.
    // For example:
    // enabled: true,
  },

  experimental: {
    serverActions: {}, // <- Empty object means enabled
    optimizeCss: true, // This is fine as true
  },
};

export default nextConfig;
