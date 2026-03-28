import { getDb } from "./db"
import { kvGet, kvSet } from "./db-kv"

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

type TelegramSettings = { telegramId: string }

function parseReservations(raw: string | null): Reservation[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    return Array.isArray(data) ? (data as Reservation[]) : []
  } catch {
    return []
  }
}

export async function getReservations(): Promise<Reservation[]> {
  getDb()
  return parseReservations(kvGet("reservations"))
}

export async function addReservation(
  data: Omit<Reservation, "id" | "status" | "createdAt">
): Promise<Reservation | null> {
  try {
    getDb()
    const list = parseReservations(kvGet("reservations"))
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    const reservation: Reservation = {
      ...data,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    list.unshift(reservation)
    kvSet("reservations", JSON.stringify(list))
    return reservation
  } catch {
    return null
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<boolean> {
  try {
    getDb()
    const list = parseReservations(kvGet("reservations"))
    const index = list.findIndex((r) => r.id === id)
    if (index === -1) return false
    list[index] = { ...list[index], status }
    kvSet("reservations", JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export async function deleteReservation(id: string): Promise<boolean> {
  try {
    getDb()
    const list = parseReservations(kvGet("reservations"))
    const next = list.filter((r) => r.id !== id)
    if (next.length === list.length) return false
    kvSet("reservations", JSON.stringify(next))
    return true
  } catch {
    return false
  }
}

export async function getTelegramId(): Promise<string> {
  getDb()
  const raw = kvGet("telegram")
  if (!raw) return ""
  try {
    const data = JSON.parse(raw) as TelegramSettings
    return typeof data.telegramId === "string" ? data.telegramId.trim() : ""
  } catch {
    return ""
  }
}

export async function setTelegramId(telegramId: string): Promise<boolean> {
  try {
    getDb()
    kvSet("telegram", JSON.stringify({ telegramId: telegramId.trim() }))
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
    const chatId = telegramId.trim()
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    })
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { description?: string }
      console.error("[Telegram] sendMessage failed:", res.status, err.description || res.statusText)
    }
    return res.ok
  } catch (e) {
    console.error("[Telegram] sendMessage error:", e)
    return false
  }
}
