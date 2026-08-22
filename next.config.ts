import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MediaPipe's WASM runtime needs cross-origin isolation for SIMD/threads.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default nextConfig;
