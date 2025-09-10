import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "d2vyhi5ouo1we3.cloudfront.net",
      "scontent.fpnh11-1.fna.fbcdn.net",
      "upload.wikimedia.org",
      "t4.ftcdn.net", // <- add this
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2vyhi5ouo1we3.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net", // <- optional but useful for wildcard paths
      },
    ],
  },
};

export default nextConfig;