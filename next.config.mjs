/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // ✅ disable Turbopack
  },
  images: {
    domains: ['img.clerk.com'], // ✅ allow Clerk image host
  },
};

export default nextConfig;
