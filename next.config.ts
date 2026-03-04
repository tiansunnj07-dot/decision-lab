import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 确保 MDX 内容文件被包含在 standalone 输出中
  outputFileTracingIncludes: {
    "/blog/*": ["./src/content/blog/**/*"],
  },
};

export default nextConfig;
