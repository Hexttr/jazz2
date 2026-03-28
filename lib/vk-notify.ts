import { getDb } from "./db"
import { kvGet, kvSet } from "./db-kv"
import type { Reservation } from "./reservations"

type VkSettings = { peerId: string }

const K_VK = "vk"

function parseVk(raw: string | null): VkSettings {
  if (!raw) return { peerId: "" }
  try {
    const o = JSON.parse(raw) as { peerId?: unknown }
    return { peerId: typeof o.peerId === "string" ? o.peerId.trim() : "" }
  } catch {
    return { peerId: "" }
  }
}

export async function getVkPeerId(): Promise<string> {
  getDb()
  return parseVk(kvGet(K_VK)).peerId
}

export async function setVkPeerId(peerId: string): Promise<boolean> {
  try {
    getDb()
    kvSet(K_VK, JSON.stringify({ peerId: peerId.trim() }))
    return true
  } catch {
    return false
  }
}

function randomIdVk(): number {
  return Math.floor(Math.random() * 2_147_483_647)
}

/**
 * Личное сообщение ВКонтакте через API (нужен VK_ACCESS_TOKEN с правом messages).
 * peer_id — числовой ID получателя (пользователя), который разрешил сообщения от сообщества / написал первым.
 */
export async function sendVkNotification(reservation: Reservation, peerId: string): Promise<boolean> {
  const token = process.env.VK_ACCESS_TOKEN?.trim()
  if (!token || !peerId.trim()) return false
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

  const body = new URLSearchParams({
    access_token: token,
    v: "5.199",
    random_id: String(randomIdVk()),
    peer_id: peerId.trim(),
    message: text,
  })

  try {
    const res = await fetch("https://api.vk.com/method/messages.send", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    const data = (await res.json()) as {
      response?: number
      error?: { error_msg?: string; error_code?: number }
    }
    if (data.error) {
      console.error("[VK] messages.send:", data.error.error_code, data.error.error_msg)
      return false
    }
    return typeof data.response === "number"
  } catch (e) {
    console.error("[VK] messages.send error:", e)
    return false
  }
}
