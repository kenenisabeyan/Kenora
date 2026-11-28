import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
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
