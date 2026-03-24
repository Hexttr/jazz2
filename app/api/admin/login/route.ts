import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, createSession, getSessionCookieName, getSessionCookieOpts, checkRateLimit, clearRateLimit } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1"
  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      { status: 429, headers: limit.retryAfter ? { "Retry-After": String(limit.retryAfter) } : undefined }
    )
  }
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim() ?? ""
  const hash = raw.replace(/^["']|["']$/g, "")
  if (!hash) {
    return NextResponse.json({ error: "Сервер не настроен" }, { status: 500 })
  }
  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Неверный запрос" }, { status: 400 })
  }
  const password = body.password
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Укажите пароль" }, { status: 400 })
  }
  const ok = await verifyPassword(password, hash)
  if (!ok) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 })
  }
  clearRateLimit(ip)
  const token = await createSession()
  const res = NextResponse.json({ success: true })
  res.cookies.set(getSessionCookieName(), token, getSessionCookieOpts())
  return res
}
