import { getDb } from "./db"
import { kvGet, kvSet } from "./db-kv"
import type { Reservation } from "./reservations"

const K_MAX = "max"

export type MaxSettings = {
  /** Личное сообщение пользователю (integer id в MAX). */
  userId: string
  /** Сообщение в чат (группа и т.п.). Если задано, используется вместо userId. */
  chatId: string
}

function parseMax(raw: string | null): MaxSettings {
  if (!raw) return { userId: "", chatId: "" }
  try {
    const o = JSON.parse(raw) as { userId?: unknown; chatId?: unknown }
    return {
      userId: typeof o.userId === "string" ? o.userId.trim() : "",
      chatId: typeof o.chatId === "string" ? o.chatId.trim() : "",
    }
  } catch {
    return { userId: "", chatId: "" }
  }
}

export async function getMaxSettings(): Promise<MaxSettings> {
  getDb()
  return parseMax(kvGet(K_MAX))
}

export async function setMaxSettings(settings: MaxSettings): Promise<boolean> {
  try {
    getDb()
    kvSet(
      K_MAX,
      JSON.stringify({
        userId: settings.userId.trim(),
        chatId: settings.chatId.trim(),
      })
    )
    return true
  } catch {
    return false
  }
}

/**
 * Уведомление в мессенджер MAX (официальный API: dev.max.ru).
 * Нужен MAX_BOT_TOKEN из кабинета бота и user_id или chat_id получателя.
 */
export async function sendMaxNotification(reservation: Reservation, settings: MaxSettings): Promise<boolean> {
  const token = process.env.MAX_BOT_TOKEN?.trim()
  const chatId = settings.chatId.trim()
  const userId = settings.userId.trim()
  if (!token || (!chatId && !userId)) return false

  const hallLabel = reservation.hall === "grand" ? "Гранд" : "Амбианс"
  const text = [
    "Новая заявка на бронирование",
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

  const url = new URL("https://platform-api.max.ru/messages")
  if (chatId) {
    url.searchParams.set("chat_id", chatId)
  } else {
    url.searchParams.set("user_id", userId)
  }

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, notify: true }),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      console.error("[MAX] messages:", res.status, errText.slice(0, 500))
      return false
    }
    return true
  } catch (e) {
    console.error("[MAX] messages error:", e)
    return false
  }
}
