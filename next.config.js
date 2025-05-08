/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone", // Great for Vercel or Dockerized deployment
  experimental: {
    optimizeCss: true, // Optional: for better CSS performance
  },
  serverExternalPackages: ["@prisma/client"], // ✅ updated key name
};

export default nextConfig;
