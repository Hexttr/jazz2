import { RESERVATIONS_FILE, TELEGRAM_SETTINGS_FILE } from "./data-paths"
import { readJsonFile, writeJsonAtomic } from "./fs-json"

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

export async function getReservations(): Promise<Reservation[]> {
  const data = await readJsonFile<Reservation[]>(RESERVATIONS_FILE)
  return Array.isArray(data) ? data : []
}

export async function addReservation(
  data: Omit<Reservation, "id" | "status" | "createdAt">
): Promise<Reservation | null> {
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
    await writeJsonAtomic(RESERVATIONS_FILE, list)
    return reservation
  } catch {
    return null
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<boolean> {
  try {
    const list = await getReservations()
    const index = list.findIndex((r) => r.id === id)
    if (index === -1) return false
    list[index] = { ...list[index], status }
    await writeJsonAtomic(RESERVATIONS_FILE, list)
    return true
  } catch {
    return false
  }
}

export async function deleteReservation(id: string): Promise<boolean> {
  try {
    const list = await getReservations()
    const next = list.filter((r) => r.id !== id)
    if (next.length === list.length) return false
    await writeJsonAtomic(RESERVATIONS_FILE, next)
    return true
  } catch {
    return false
  }
}

export async function getTelegramId(): Promise<string> {
  const data = await readJsonFile<TelegramSettings>(TELEGRAM_SETTINGS_FILE)
  if (!data || typeof data.telegramId !== "string") return ""
  return data.telegramId.trim()
}

export async function setTelegramId(telegramId: string): Promise<boolean> {
  try {
    await writeJsonAtomic(TELEGRAM_SETTINGS_FILE, { telegramId: telegramId.trim() })
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
