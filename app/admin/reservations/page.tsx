"use client"

import { useState, useEffect, useCallback } from "react"
import { Info, Save, RefreshCw, Trash2, MessageCircle, Clock, Users, MapPin, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import type { Reservation, ReservationStatus } from "@/lib/reservations"

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "На рассмотрении",
  approved: "Согласовано",
  archived: "Архив",
}

const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  approved: "bg-green-500/15 text-green-500 border-green-500/30",
  archived: "bg-muted text-muted-foreground border-border",
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
  const [telegramSuccess, setTelegramSuccess] = useState(false)
  const [filter, setFilter] = useState<ReservationStatus | "all">("all")
  const [refreshing, setRefreshing] = useState(false)
  const [telegramOpen, setTelegramOpen] = useState(false)

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
    loadData().finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [loadData])

  async function saveTelegramId() {
    setSavingTelegram(true)
    setTelegramError(null)
    setTelegramSuccess(false)
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
        setTelegramSuccess(true)
        setTimeout(() => setTelegramSuccess(false), 3000)
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
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  const pendingCount = reservations.filter((r) => r.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-white/15 bg-background/80 px-4 py-4 backdrop-blur-xl md:-mx-8 md:px-8 md:py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-wide">
              <CalendarCheck className="h-6 w-6 text-primary" />
              Бронирование
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {reservations.length} заявок всего
              {pendingCount > 0 && (
                <span className="ml-2 text-amber-500">{pendingCount} на рассмотрении</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Telegram settings — collapsible */}
      <Collapsible open={telegramOpen} onOpenChange={setTelegramOpen}>
        <div className="rounded-xl border border-white/20 bg-card/80">
          <CollapsibleTrigger asChild>
            <div className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <MessageCircle className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Telegram-уведомления</p>
                  <p className="text-xs text-muted-foreground">
                    {telegramId ? `ID: ${telegramId}` : "Не настроено"}
                  </p>
                </div>
              </div>
              <Badge variant={telegramId ? "secondary" : "outline"} className="text-xs">
                {telegramId ? "Активно" : "Выключено"}
              </Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-border/30 px-5 py-4">
              <div className="mb-3 flex items-center gap-2">
                <Label className="text-sm">Telegram ID</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                      aria-label="Инструкция"
                    >
                      <Info className="h-3 w-3" />
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
                  placeholder="123456789"
                  className="max-w-xs"
                />
                <Button size="sm" onClick={saveTelegramId} disabled={savingTelegram}>
                  <Save className="mr-2 h-4 w-4" />
                  {savingTelegram ? "..." : "Сохранить"}
                </Button>
              </div>
              {telegramError && (
                <p className="mt-2 text-sm text-destructive">{telegramError}</p>
              )}
              {telegramSuccess && (
                <p className="mt-2 text-sm text-green-500">Сохранено</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground/70">
                Напишите боту @jazz_68_bot команду /start, чтобы получать уведомления.
              </p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v as ReservationStatus | "all")}>
          <SelectTrigger className="w-[180px] border-border/60">
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
          variant="outline"
          size="sm"
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="border-border/60"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Обновить
        </Button>
      </div>

      {/* Reservations list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 py-16">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
            <Clock className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">Заявок пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="group rounded-xl border border-white/20 bg-card/80 p-4 transition-all duration-200 hover:border-white/40 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{r.name}</h3>
                    <Badge
                      variant="outline"
                      className={`text-[11px] ${STATUS_COLORS[r.status]}`}
                    >
                      {STATUS_LABELS[r.status]}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {hallName(r.hall)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {r.date} {r.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {r.guests} гостей
                    </span>
                    <span>{r.phone}</span>
                  </div>
                  {r.comment && (
                    <p className="mt-1.5 text-sm text-muted-foreground/80 italic">
                      {r.comment}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-muted-foreground/50">
                    {new Date(r.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Select
                    value={r.status}
                    onValueChange={(v) => updateStatus(r.id, v as ReservationStatus)}
                  >
                    <SelectTrigger className="w-[160px] border-border/60 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{STATUS_LABELS.pending}</SelectItem>
                      <SelectItem value="approved">{STATUS_LABELS.approved}</SelectItem>
                      <SelectItem value="archived">{STATUS_LABELS.archived}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteReservation(r.id)}
                    aria-label="Удалить заявку"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
