"use client"

import { useState, useEffect, useCallback } from "react"
import { Info, Save, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Reservation, ReservationStatus } from "@/lib/reservations"

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "На рассмотрении",
  approved: "Согласовано",
  archived: "Архив",
}

const TELEGRAM_ID_HINT = `Как узнать свой ID в Telegram:
1. Напишите боту @userinfobot в Telegram
2. Отправьте ему любое сообщение
3. Бот пришлёт ваш числовой ID (например, 123456789)
4. Скопируйте это число и вставьте в поле ниже.

Либо используйте @getmyid_bot — он тоже покажет ваш ID.`

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [telegramId, setTelegramId] = useState("")
  const [loading, setLoading] = useState(true)
  const [savingTelegram, setSavingTelegram] = useState(false)
  const [telegramError, setTelegramError] = useState<string | null>(null)
  const [filter, setFilter] = useState<ReservationStatus | "all">("all")
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    try {
      const res = await fetch(
        `/api/admin/reservations?_=${Date.now()}`,
        { credentials: "include", cache: "no-store" }
      )
      if (res.status === 401) {
        window.location.href = "/admin/login"
        return
      }
      const data = (await res.json()) as { reservations?: Reservation[]; telegramId?: string }
      if (Array.isArray(data.reservations)) setReservations(data.reservations)
      if (data.telegramId != null) setTelegramId(String(data.telegramId))
    } catch {
      // ignore
    } finally {
      if (showRefreshing) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadData().finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [loadData])

  async function saveTelegramId() {
    setSavingTelegram(true)
    setTelegramError(null)
    try {
      const res = await fetch("/api/admin/reservations/telegram", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ telegramId: telegramId.trim() }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        error?: string
        telegramId?: string
      }
      if (res.status === 401) {
        window.location.href = "/admin/login"
        return
      }
      if (res.ok && data.error == null) {
        const saved = data.telegramId != null ? String(data.telegramId) : telegramId.trim()
        setTelegramId(saved)
      } else {
        setTelegramError(data.error || "Не удалось сохранить Telegram ID")
      }
    } catch {
      setTelegramError("Ошибка соединения")
    } finally {
      setSavingTelegram(false)
    }
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    const res = await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
    }
  }

  const filtered =
    filter === "all"
      ? reservations.filter((r) => r.status !== "archived")
      : reservations.filter((r) => r.status === filter)
  const hallName = (hall: string) => (hall === "grand" ? "Гранд" : "Амбианс")

  async function deleteReservation(id: string) {
    if (!confirm("Удалить эту заявку?")) return
    const res = await fetch("/api/admin/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setReservations((prev) => prev.filter((r) => r.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="font-sans text-2xl font-bold tracking-wide">Бронирование</h1>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Label className="text-sm font-medium">Telegram ID для уведомлений</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Инструкция"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs whitespace-pre-line text-xs">
              {TELEGRAM_ID_HINT}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="Например: 123456789"
            className="max-w-xs"
          />
          <Button onClick={saveTelegramId} disabled={savingTelegram}>
            <Save className="mr-2 h-4 w-4" />
            {savingTelegram ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
        {telegramError && (
          <p className="mt-2 text-sm text-destructive">{telegramError}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Укажите ID и сохраните. Чтобы получать сообщения, сначала напишите боту в Telegram команду /start — иначе бот не сможет отправить вам уведомление. Токен бота: TELEGRAM_BOT_TOKEN в настройках проекта.
        </p>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Label className="text-sm">Фильтр:</Label>
          <Select value={filter} onValueChange={(v) => setFilter(v as ReservationStatus | "all")}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заявки</SelectItem>
              <SelectItem value="pending">{STATUS_LABELS.pending}</SelectItem>
              <SelectItem value="approved">{STATUS_LABELS.approved}</SelectItem>
              <SelectItem value="archived">{STATUS_LABELS.archived}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Обновление…" : "Обновить"}
          </Button>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-lg border border-border bg-muted/30 p-6 text-center text-muted-foreground">
            Заявок пока нет
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-semibold">
                    {r.name} · {r.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hallName(r.hall)} · {r.date} {r.time} · {r.guests} гостей
                    {r.comment ? ` · ${r.comment}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>
                <Select
                  value={r.status}
                  onValueChange={(v) => updateStatus(r.id, v as ReservationStatus)}
                >
                  <SelectTrigger
                    className={`w-[180px] ${
                      r.status === "approved"
                        ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                        : r.status === "archived"
                          ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                          : ""
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{STATUS_LABELS.pending}</SelectItem>
                    <SelectItem value="approved">{STATUS_LABELS.approved}</SelectItem>
                    <SelectItem value="archived">{STATUS_LABELS.archived}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteReservation(r.id)}
                  aria-label="Удалить заявку"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
