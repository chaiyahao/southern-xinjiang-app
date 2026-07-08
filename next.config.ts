import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  webpack: (config, { isServer }) => {
    if (config.watchOptions) {
      config.watchOptions.ignored = [
        ...((Array.isArray(config.watchOptions.ignored)
          ? config.watchOptions.ignored
          : [config.watchOptions.ignored]) as string[]),
        "**/data-store/**",
      ];
    }
    return config;
  },
};

export default nextConfig;
