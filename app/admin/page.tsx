"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  UtensilsCrossed,
  FileText,
  CalendarCheck,
  FolderOpen,
  ChefHat,
  ClipboardList,
  Bug,
  ChevronDown,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

const OVERVIEW_IMAGES = {
  menu: "/admin/overview-menu.jpg",
  sections: "/admin/overview-sections.jpg",
  reservations: "/admin/overview-reservations.jpg",
}

type Stats = {
  categoriesCount: number
  dishesCount: number
  reservationsPending: number
  reservationsTotal: number
}

type DebugInfo = {
  redisConfigured: boolean
  blobConfigured: boolean
  source: string
  dishesCount: number
  firstDishName: string | null
  testVerified?: boolean
}

const statCards = [
  { key: "categoriesCount" as const, label: "Категории", icon: FolderOpen },
  { key: "dishesCount" as const, label: "Блюда", icon: ChefHat },
  { key: "reservationsTotal" as const, label: "Заявки", icon: ClipboardList },
]

const overviewCards = [
  {
    title: "Меню и блюда",
    description: "Категории и карточки блюд: добавление, удаление, редактирование.",
    href: "/admin/menu",
    icon: UtensilsCrossed,
    image: OVERVIEW_IMAGES.menu,
    cta: "Редактор меню",
  },
  {
    title: "Разделы сайта",
    description: "Тексты, заголовки, изображения всех блоков главной страницы.",
    href: "/admin/sections",
    icon: FileText,
    image: OVERVIEW_IMAGES.sections,
    cta: "Редактор разделов",
  },
  {
    title: "Бронирование",
    description: "Заявки с лендинга: статусы, уведомления в Telegram.",
    href: "/admin/reservations",
    icon: CalendarCheck,
    image: OVERVIEW_IMAGES.reservations,
    cta: "Заявки",
  },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [debug, setDebug] = useState<DebugInfo | null>(null)
  const [debugLoading, setDebugLoading] = useState(false)
  const [debugTestLoading, setDebugTestLoading] = useState(false)
  const [debugOpen, setDebugOpen] = useState(false)

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Stats | null) => data && setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-foreground md:text-3xl">
          Панель управления
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управление контентом сайта кафе JAZZ
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon }) => (
          <Card
            key={key}
            className="group relative overflow-hidden border-border/50 bg-card/80 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.04] transition-transform duration-500 group-hover:scale-150" />
            <CardContent className="flex flex-row items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {stats ? stats[key] : "—"}
                </p>
                {key === "reservationsTotal" && stats && stats.reservationsPending > 0 && (
                  <p className="mt-0.5 text-xs font-medium text-amber-500">
                    {stats.reservationsPending} на рассмотрении
                  </p>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {overviewCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href} className="group">
              <Card className="h-full overflow-hidden border-border/50 bg-card/80 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-5">
                  <CardDescription className="mb-3 text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
                    {card.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Debug — collapsed by default */}
      <Collapsible open={debugOpen} onOpenChange={setDebugOpen}>
        <Card className="border-border/30 bg-card/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer select-none transition-colors hover:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Bug className="h-4 w-4" />
                  Диагностика хранилища
                </CardTitle>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    debugOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3 pt-0">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={debugLoading}
                  onClick={async () => {
                    setDebugLoading(true)
                    try {
                      const r = await fetch("/api/admin/content-debug", {
                        credentials: "include",
                        cache: "no-store",
                      })
                      const d = await r.json().catch(() => null)
                      if (r.ok && d) setDebug(d)
                    } finally {
                      setDebugLoading(false)
                    }
                  }}
                >
                  {debugLoading ? "..." : "Проверить"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={debugTestLoading}
                  onClick={async () => {
                    setDebugTestLoading(true)
                    try {
                      const r = await fetch("/api/admin/content-debug", {
                        method: "POST",
                        credentials: "include",
                        cache: "no-store",
                      })
                      const d = await r.json().catch(() => ({}))
                      if (r.ok && d.verified !== undefined) {
                        setDebug((prev) =>
                          prev ? { ...prev, testVerified: d.verified } : null
                        )
                        alert(
                          d.verified
                            ? "Redis: запись и чтение работают"
                            : d.hint || d.error || "Ошибка"
                        )
                      } else {
                        alert(d.error || d.hint || "Ошибка теста")
                      }
                    } finally {
                      setDebugTestLoading(false)
                    }
                  }}
                >
                  {debugTestLoading ? "..." : "Тест записи"}
                </Button>
              </div>
              {debug && (
                <div className="space-y-1 rounded-lg bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
                  <p>
                    Redis: {debug.redisConfigured ? "✓" : "✗"} · Blob:{" "}
                    {debug.blobConfigured ? "✓" : "✗"}
                  </p>
                  <p>
                    Источник: {debug.source} · Блюд: {debug.dishesCount}
                  </p>
                  {debug.firstDishName && <p>Первое блюдо: {debug.firstDishName}</p>}
                  {debug.testVerified !== undefined && (
                    <p className={debug.testVerified ? "text-green-500" : "text-red-500"}>
                      Тест Redis: {debug.testVerified ? "OK" : "Ошибка"}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
