import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/**/*.wasm"],
  },
};

export default nextConfig;
