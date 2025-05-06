/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io", // ImageKit URL
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary URL
      },
    ],
  },
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  allowedDevOrigins: ['http://192.168.5.2:3000'], // Example dev origin, update as necessary

  turbopack: {
    // Optional config
  },

  experimental: {
    serverActions: {}, // Enabled by default
    optimizeCss: true, // Enable CSS optimization
  },
};

export default nextConfig;
