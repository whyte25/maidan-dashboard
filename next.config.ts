import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  redirects: async () => {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/products",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
