import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**', // Or more specific if needed, like '/a/ACg8oc.../**'
      },
      {
        protocol: 'https',
        hostname: 'authjs.dev', // For the Google icon from authjs.dev
        port: '',
        pathname: '/img/providers/**',
      }
    ],
  },
  /* other config options here */
};

export default nextConfig;
