import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { setTelegramId } from "@/lib/reservations"

export async function PUT(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const telegramId = body?.telegramId != null ? String(body.telegramId).trim() : ""
    await setTelegramId(telegramId)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 })
  }
}
