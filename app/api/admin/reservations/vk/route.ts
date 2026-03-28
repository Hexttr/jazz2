import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { setVkPeerId } from "@/lib/vk-notify"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const peerId = body?.peerId != null ? String(body.peerId).trim() : ""
    const saved = await setVkPeerId(peerId)
    if (!saved) {
      return NextResponse.json(
        { error: "Не удалось сохранить настройки (проверьте доступ к базе данных)." },
        { status: 503 }
      )
    }
    return NextResponse.json({ success: true, peerId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 })
  }
}
