/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ap.rdcpix.com', 'photos.zillowstatic.com'],
  },
  webpack: (config) => {
    config.externals.push({
      oracledb: 'commonjs oracledb',
      'pg-query-stream': 'commonjs pg-query-stream',
    });
    return config;
  },
};

export default nextConfig;
