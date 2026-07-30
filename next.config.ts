import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a stray lockfile in the home directory otherwise wins the root inference
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
