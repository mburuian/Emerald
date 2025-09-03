import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpvbnaudsfjisjrbjrjy.supabase.co", // ✅ Supabase project domain
        pathname: "/storage/v1/object/public/**",    // ✅ Allow images from your bucket
      },
    ],
  },
};

export default nextConfig;
