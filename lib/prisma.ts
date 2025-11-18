import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a function to initialize Prisma client only when needed
function createPrismaClient() {
  // During build without DATABASE_URL, create a mock client
  if (!process.env.DATABASE_URL) {
    console.warn('[Prisma] DATABASE_URL not set - using placeholder client')
    // Return a Prisma client that won't try to connect
    return new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://placeholder:placeholder@placeholder:5432/placeholder'
        }
      }
    })
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// Lazy initialization to avoid connecting during build
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
