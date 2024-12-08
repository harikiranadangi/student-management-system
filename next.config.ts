import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Protocol of the external image
        hostname: "images.pexels.com", // Hostname of the external source
        pathname: "**", // Allow all paths
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Add Cloudinary domain
        pathname: "**", // Allow all paths from this domain
      },
    ],
  },
};

export default nextConfig;
