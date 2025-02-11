/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable faster builds with SWC minification

  images: {
    domains: ['ap.rdcpix.com', 'photos.zillowstatic.com'],
  },

  experimental: {
    runtime: 'nodejs', // Forces Node.js runtime (Fix for jsonwebtoken issues)
  },
};

export default nextConfig;
