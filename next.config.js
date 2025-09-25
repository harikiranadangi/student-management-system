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

  // ✅ Ignore ESLint during builds (dev faster)
  eslint: { ignoreDuringBuilds: true },

  // ✅ Standalone output for deployment
  output: "standalone",

  // ✅ Experimental Turbopack + optimizations
  experimental: {
    turbo: true,       // enable Turbopack
    optimizeCss: true, // CSS optimizations
    scrollRestoration: true, // optional: speeds up navigation
  },

  // ✅ Make Prisma external to avoid recompilation
  serverExternalPackages: ["@prisma/client"],

  // Optional: reduce dev-time refresh for large libs
  transpilePackages: [], // Add any heavy local packages if needed
};

export default nextConfig;
