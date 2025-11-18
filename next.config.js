/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Output configuration for Vercel
  output: 'standalone',
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
  // Skip trailing slash redirect
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
