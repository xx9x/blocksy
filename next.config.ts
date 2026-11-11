import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Dashboard pages read localStorage and render after hydration, so only
    // validate segments that explicitly opt in to instant navigation.
    instantInsights: { validationLevel: "manual-warning" },
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
