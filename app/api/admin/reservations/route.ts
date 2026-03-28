import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { getReservations, updateReservationStatus, getTelegramId, deleteReservation } from "@/lib/reservations"
import { getVkPeerId } from "@/lib/vk-notify"
import type { ReservationStatus } from "@/lib/reservations"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  try {
    const [reservations, telegramId, vkPeerId] = await Promise.all([
      getReservations(),
      getTelegramId(),
      getVkPeerId(),
    ])
    return NextResponse.json(
      { reservations, telegramId, vkPeerId },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "CDN-Cache-Control": "no-store",
        },
      }
    )
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

export async function DELETE(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const id = body?.id != null ? String(body.id) : ""
    if (!id) return NextResponse.json({ error: "Укажите id заявки" }, { status: 400 })
    const ok = await deleteReservation(id)
    if (!ok) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 })
  }
}
