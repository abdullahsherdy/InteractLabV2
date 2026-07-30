import type { NextConfig } from "next";

const isPages = process.env.GITHUB_ACTIONS === "true";
const repo = process.env.PAGES_REPO ?? "InteractLab";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isPages ? `/${repo}` : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
