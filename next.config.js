/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip database connection during build
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark Prisma as external to prevent bundling issues
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      })
    }
    return config
  },
}

module.exports = nextConfig
