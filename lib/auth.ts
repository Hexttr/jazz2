import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

const SESSION_COOKIE = "jazz_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const RATE_LIMIT_ATTEMPTS = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 min

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "jazz-admin-secret-change-in-production"
)

export type SessionPayload = { sub: "admin"; exp: number }

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(): Promise<string> {
  return new SignJWT({ sub: "admin" } as SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .setIssuedAt()
    .sign(secret)
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE
}

export function getSessionCookieOpts() {
  // На http:// (свой сервер без TLS) браузер не сохранит cookie с Secure=true.
  // На Vercel задаётся VERCEL=1 — включаем Secure. Иначе: COOKIE_SECURE=true вручную.
  const secure =
    process.env.COOKIE_SECURE === "true" ||
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV === "production"
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  }
}

// In-memory rate limit: IP -> { count, resetAt }
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

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get("cookie") || ""
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1].trim()) : null
}
