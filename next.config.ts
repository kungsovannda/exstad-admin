import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "d2vyhi5ouo1we3.cloudfront.net",
      "scontent.fpnh11-1.fna.fbcdn.net",
      "upload.wikimedia.org",
      "exstad-api.daradev.me",
      "t4.ftcdn.net",
      "example.com",
      "api.exstad.tech",
      "www.keycdn.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2vyhi5ouo1we3.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/documents/**",
      },
    ],
  },
};

export default nextConfig;
