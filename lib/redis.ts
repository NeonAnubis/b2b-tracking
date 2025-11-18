import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Redis credentials')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Helper functions for session management
export const sessionCache = {
  async get(sessionId: string) {
    return redis.get(`session:${sessionId}`)
  },

  async set(sessionId: string, data: any, ttl: number = 1800) {
    return redis.setex(`session:${sessionId}`, ttl, JSON.stringify(data))
  },

  async delete(sessionId: string) {
    return redis.del(`session:${sessionId}`)
  },

  async getAnonymousMapping(anonymousId: string) {
    return redis.get(`anon:${anonymousId}`)
  },

  async setAnonymousMapping(anonymousId: string, leadId: number, ttl: number = 86400) {
    return redis.setex(`anon:${anonymousId}`, ttl, leadId)
  }
}
