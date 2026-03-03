import { getRedis } from "./redis"

const REDIS_RESERVATIONS = "jazz:reservations"
const REDIS_TELEGRAM_ID = "jazz:telegram_id"

export type ReservationStatus = "pending" | "approved" | "archived"

export type Reservation = {
  id: string
  name: string
  phone: string
  hall: string
  date: string
  time: string
  guests: string
  comment: string
  status: ReservationStatus
  createdAt: string
}

export async function getReservations(): Promise<Reservation[]> {
  const redis = getRedis()
  if (!redis) return []
  try {
    const raw = await redis.get<string>(REDIS_RESERVATIONS)
    if (typeof raw !== "string") return []
    const list = JSON.parse(raw) as Reservation[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function addReservation(data: Omit<Reservation, "id" | "status" | "createdAt">): Promise<Reservation | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const list = await getReservations()
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    const reservation: Reservation = {
      ...data,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    list.unshift(reservation)
    await redis.set(REDIS_RESERVATIONS, JSON.stringify(list))
    return reservation
  } catch {
    return null
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const list = await getReservations()
  const index = list.findIndex((r) => r.id === id)
  if (index === -1) return false
  list[index] = { ...list[index], status }
  await redis.set(REDIS_RESERVATIONS, JSON.stringify(list))
  return true
}

export async function getTelegramId(): Promise<string> {
  const redis = getRedis()
  if (!redis) return ""
  try {
    const id = await redis.get<string>(REDIS_TELEGRAM_ID)
    return typeof id === "string" ? id : ""
  } catch {
    return ""
  }
}

/** Returns true if saved, false if Redis not configured or error. */
export async function setTelegramId(telegramId: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  try {
    await redis.set(REDIS_TELEGRAM_ID, telegramId.trim())
    return true
  } catch {
    return false
  }
}

export async function sendTelegramNotification(reservation: Reservation, telegramId: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token || !telegramId.trim()) return false
  const hallLabel = reservation.hall === "grand" ? "Гранд" : "Амбианс"
  const text = [
    "🆕 Новая заявка на бронирование",
    "",
    `Имя: ${reservation.name}`,
    `Телефон: ${reservation.phone}`,
    `Зал: ${hallLabel}`,
    `Дата: ${reservation.date}`,
    `Время: ${reservation.time}`,
    `Гостей: ${reservation.guests}`,
    reservation.comment ? `Комментарий: ${reservation.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n")
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramId.trim(),
          text,
        }),
      }
    )
    return res.ok
  } catch {
    return false
  }
}
