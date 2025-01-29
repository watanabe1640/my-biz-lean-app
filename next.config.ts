import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'm.media-amazon.com',
      'placehold.co'
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
};

export default nextConfig;
