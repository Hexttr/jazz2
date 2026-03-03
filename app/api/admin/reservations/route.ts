import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { getReservations, updateReservationStatus, getTelegramId } from "@/lib/reservations"
import type { ReservationStatus } from "@/lib/reservations"

export async function GET(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  try {
    const [reservations, telegramId] = await Promise.all([getReservations(), getTelegramId()])
    return NextResponse.json({ reservations, telegramId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { id, status } = body as { id: string; status: ReservationStatus }
    if (!id || !["pending", "approved", "archived"].includes(status)) {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 })
    }
    const ok = await updateReservationStatus(id, status)
    if (!ok) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 })
  }
}
