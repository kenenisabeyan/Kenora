import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd(), "../../"),
  transpilePackages: [
    "@kenora/ui",
    "@kenora/types",
    "@kenora/api-contracts",
    "@kenora/domain",
    "@kenora/observability",
    "@kenora/config",
  ],
  reactStrictMode: true,
};

export default nextConfig;
