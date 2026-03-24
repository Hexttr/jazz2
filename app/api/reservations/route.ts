import { NextRequest, NextResponse } from "next/server"
import { addReservation, getTelegramId, sendTelegramNotification } from "@/lib/reservations"

export const dynamic = "force-dynamic"

const RESERVATION_RATE_LIMIT = 5
const RESERVATION_RATE_WINDOW_MS = 60 * 1000 // 1 min
const reservationAttempts = new Map<string, { count: number; resetAt: number }>()

function checkReservationRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = reservationAttempts.get(ip)
  if (!entry) {
    reservationAttempts.set(ip, { count: 1, resetAt: now + RESERVATION_RATE_WINDOW_MS })
    return { allowed: true }
  }
  if (now > entry.resetAt) {
    entry.count = 1
    entry.resetAt = now + RESERVATION_RATE_WINDOW_MS
    return { allowed: true }
  }
  entry.count += 1
  if (entry.count > RESERVATION_RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { allowed: true }
}

const VALID_HALLS = ["ambiance", "grand"]
const MAX_NAME = 200
const MAX_PHONE = 50
const MAX_COMMENT = 1000

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1"
    const limit = checkReservationRateLimit(ip)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Слишком много заявок. Попробуйте позже." },
        { status: 429, headers: limit.retryAfter ? { "Retry-After": String(limit.retryAfter) } : undefined }
      )
    }

    const body = await request.json()
    const { name, phone, hall, date, time, guests, comment } = body
    if (!name || !phone || !hall || !date || !time || !guests) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 })
    }

    const nameStr = String(name).trim()
    const phoneStr = String(phone).trim()
    const hallStr = String(hall).toLowerCase()
    const dateStr = String(date)
    const timeStr = String(time)
    const guestsStr = String(guests)
    const commentStr = comment ? String(comment).trim() : ""

    if (nameStr.length > MAX_NAME) return NextResponse.json({ error: "Имя слишком длинное" }, { status: 400 })
    if (phoneStr.length > MAX_PHONE) return NextResponse.json({ error: "Телефон слишком длинный" }, { status: 400 })
    if (!VALID_HALLS.includes(hallStr)) return NextResponse.json({ error: "Выберите зал Амбианс или Гранд" }, { status: 400 })
    if (commentStr.length > MAX_COMMENT) return NextResponse.json({ error: "Комментарий слишком длинный" }, { status: 400 })

    const guestsNum = parseInt(guestsStr, 10)
    if (isNaN(guestsNum) || guestsNum < 15 || guestsNum > 80) {
      return NextResponse.json({ error: "Количество гостей должно быть от 15 до 80" }, { status: 400 })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateStr)) return NextResponse.json({ error: "Неверный формат даты" }, { status: 400 })
    const today = new Date().toISOString().slice(0, 10)
    if (dateStr < today) return NextResponse.json({ error: "Дата не может быть в прошлом" }, { status: 400 })

    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(timeStr)) return NextResponse.json({ error: "Неверный формат времени" }, { status: 400 })

    const reservation = await addReservation({
      name: nameStr,
      phone: phoneStr,
      hall: hallStr,
      date: dateStr,
      time: timeStr,
      guests: guestsStr,
      comment: commentStr,
    })
    if (!reservation) {
      return NextResponse.json(
        { error: "Не удалось сохранить заявку. Попробуйте позже или свяжитесь с нами по телефону." },
        { status: 503 }
      )
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
