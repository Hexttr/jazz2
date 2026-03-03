import { Redis } from "@upstash/redis"

/**
 * Единая точка доступа к Redis. Поддерживает переменные:
 * - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Upstash Redis)
 * - KV_REST_API_URL / KV_REST_API_TOKEN (Vercel KV)
 */
export function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN
  if (url && token) {
    return new Redis({ url, token })
  }
  return null
}

export function isRedisConfigured(): boolean {
  return getRedis() !== null
}
