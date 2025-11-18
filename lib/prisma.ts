import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization to avoid connecting during build
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Prevent Prisma from trying to connect during build
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set - Prisma client will not connect')
}
