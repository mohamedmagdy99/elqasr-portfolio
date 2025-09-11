import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'realestate-gallery.s3.eu-central-1.amazonaws.com',
                pathname: '/**',
            },
        ],
    },

};

export default nextConfig;
