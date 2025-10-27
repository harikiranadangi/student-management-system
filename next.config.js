/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Image domains for remote optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  // ✅ Ignore ESLint during builds (for faster CI/dev)
  eslint: { ignoreDuringBuilds: true },

  // ✅ Standalone output (good for Docker / deployment)
  output: "standalone",

  // ✅ Turbopack (replaces experimental.turbo)
  turbopack: {
    // You can enable or tweak settings later if needed
  },

  // ✅ Optional experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // ✅ Avoid rebuilding Prisma client each time
  serverExternalPackages: ["@prisma/client"],

  // ✅ Add local libs here if your monorepo grows
  transpilePackages: [],
};

export default nextConfig;
