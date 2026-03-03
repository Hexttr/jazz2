import { NextRequest, NextResponse } from "next/server"
import { addReservation, getTelegramId, sendTelegramNotification } from "@/lib/reservations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, hall, date, time, guests, comment } = body
    if (!name || !phone || !hall || !date || !time || !guests) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 })
    }
    const reservation = await addReservation({
      name: String(name),
      phone: String(phone),
      hall: String(hall),
      date: String(date),
      time: String(time),
      guests: String(guests),
      comment: comment ? String(comment) : "",
    })
    if (!reservation) {
      return NextResponse.json({ error: "Не удалось сохранить заявку" }, { status: 503 })
    }
    const telegramId = await getTelegramId()
    if (telegramId) {
      await sendTelegramNotification(reservation, telegramId)
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка отправки" }, { status: 500 })
  }
}
