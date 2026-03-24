import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { setTelegramId } from "@/lib/reservations"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const telegramId = body?.telegramId != null ? String(body.telegramId).trim() : ""
    const saved = await setTelegramId(telegramId)
    if (!saved) {
      return NextResponse.json(
        {
          error: "Не удалось сохранить настройки (проверьте права на каталог data/).",
        },
        { status: 503 }
      )
    }
    return NextResponse.json({ success: true, telegramId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 })
  }
}
