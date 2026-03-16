import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/driving-schools-in-:city",
        destination: "/city-driving-schools/:city",
      },
    ];
  },
};

export default nextConfig;
