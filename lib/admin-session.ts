import { SignJWT, jwtVerify } from "jose"

const SESSION_COOKIE = "jazz_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "jazz-admin-secret-change-in-production"
)

export type SessionPayload = { sub: "admin"; exp: number }

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

export function getSessionTokenFromRequest(request: Request): string | null {
  const withCookies = request as Request & {
    cookies?: { get: (name: string) => { value: string } | undefined }
  }
  const parsed = withCookies.cookies?.get(SESSION_COOKIE)?.value
  if (parsed) return parsed

  const raw = request.headers.get("cookie") || ""
  const match = raw.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1].trim()) : null
}
