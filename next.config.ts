import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/trading/BTC",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
