/**
 * Только для Edge Middleware: проверка HS256 JWT без пакета `jose`
 * (в Edge-бандле jose даёт ReferenceError: __import_unsupported).
 * Логин и API по-прежнему используют `lib/admin-session.ts` + jose.
 */
const SESSION_COOKIE = "jazz_admin_session"

function sessionSecretBytes(): Uint8Array {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "jazz-admin-secret-change-in-production"
  )
}

function base64UrlToBytes(input: string): Uint8Array {
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = b64.length % 4
  if (pad) b64 += "=".repeat(4 - pad)
  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

/** Проверка JWT, выданного SignJWT (HS256), совместима с `lib/admin-session.ts`. */
export async function verifyAdminJwtEdge(token: string): Promise<boolean> {
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [h, p, sigB64] = parts
  if (!h || !p || !sigB64) return false
  const message = new TextEncoder().encode(`${h}.${p}`)
  let signature: Uint8Array
  try {
    signature = base64UrlToBytes(sigB64)
  } catch {
    return false
  }
  const secret = sessionSecretBytes()
  let key: CryptoKey
  try {
    key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, [
      "verify",
    ])
  } catch {
    return false
  }
  let ok: boolean
  try {
    ok = await crypto.subtle.verify("HMAC", key, signature, message)
  } catch {
    return false
  }
  if (!ok) return false
  let payload: { sub?: string; exp?: number }
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(p))
    payload = JSON.parse(json) as { sub?: string; exp?: number }
  } catch {
    return false
  }
  if (payload.sub !== "admin") return false
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp != null && payload.exp < now) return false
  return true
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE
}
