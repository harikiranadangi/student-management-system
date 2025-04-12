/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  allowedDevOrigins: ['http://192.168.5.2:3000'],

  experimental: {
    serverActions: {}, // <- empty object means enabled
    turbo: {},         // <- empty object means enabled
    optimizeCss: true, // this one is ok as true
  },
};

export default nextConfig;
