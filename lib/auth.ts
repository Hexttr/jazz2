import bcrypt from "bcryptjs"

export type { SessionPayload } from "./admin-session"
export {
  createSession,
  verifySession,
  getSessionCookieName,
  getSessionCookieOpts,
  getSessionTokenFromRequest,
} from "./admin-session"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

const RATE_LIMIT_ATTEMPTS = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 min

const attemptMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  let entry = attemptMap.get(ip)
  if (!entry) {
    attemptMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }
  if (now > entry.resetAt) {
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    attemptMap.set(ip, entry)
    return { allowed: true }
  }
  entry.count += 1
  if (entry.count > RATE_LIMIT_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { allowed: true }
}

export function clearRateLimit(ip: string): void {
  attemptMap.delete(ip)
}
