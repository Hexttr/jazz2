"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { UtensilsCrossed, FileText, CalendarCheck, ExternalLink, FolderOpen, ChefHat, ClipboardList, Bug } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [debug, setDebug] = useState<DebugInfo | null>(null)
  const [debugLoading, setDebugLoading] = useState(false)
  const [debugTestLoading, setDebugTestLoading] = useState(false)

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Stats | null) => data && setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-bold tracking-wide text-foreground">
          Панель управления
        </h1>
        <p className="mt-1 text-muted-foreground">
          Редактирование контента сайта кафе JAZZ
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Категории</p>
              <p className="text-2xl font-bold tabular-nums">
                {stats ? stats.categoriesCount : "—"}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Блюда</p>
              <p className="text-2xl font-bold tabular-nums">
                {stats ? stats.dishesCount : "—"}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ChefHat className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Заявки</p>
              <p className="text-2xl font-bold tabular-nums">
                {stats ? stats.reservationsTotal : "—"}
              </p>
              {stats && stats.reservationsPending > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  На рассмотрении: {stats.reservationsPending}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="overflow-hidden border-border transition-shadow hover:shadow-md">
          <div className="relative h-40 w-full bg-muted">
            <Image
              src={OVERVIEW_IMAGES.menu}
              alt="Меню и блюда"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Меню и блюда</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Категории и карточки блюд: добавление, удаление, редактирование, изображения.
            </CardDescription>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/menu">Открыть редактор меню</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border transition-shadow hover:shadow-md">
          <div className="relative h-40 w-full bg-muted">
            <Image
              src={OVERVIEW_IMAGES.sections}
              alt="Разделы сайта"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Разделы сайта</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Тексты, заголовки, изображения и иконки всех блоков главной страницы.
            </CardDescription>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/sections">Открыть редактор разделов</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border transition-shadow hover:shadow-md">
          <div className="relative h-40 w-full bg-muted">
            <Image
              src={OVERVIEW_IMAGES.reservations}
              alt="Бронирование"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Бронирование</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Заявки с лендинга: статусы, уведомления в Telegram, удаление.
            </CardDescription>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/reservations">Открыть заявки</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bug className="h-4 w-4" />
            Диагностика хранилища
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={debugLoading}
              onClick={async () => {
                setDebugLoading(true)
                try {
                  const r = await fetch("/api/admin/content-debug", { credentials: "include", cache: "no-store" })
                  const d = await r.json().catch(() => null)
                  if (r.ok && d) setDebug(d)
                } finally {
                  setDebugLoading(false)
                }
              }}
            >
              {debugLoading ? "…" : "Проверить"}
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
                    setDebug((prev) => (prev ? { ...prev, testVerified: d.verified } : null))
                    alert(d.verified ? "Redis: запись и чтение работают" : d.hint || d.error || "Ошибка")
                  } else {
                    alert(d.error || d.hint || "Ошибка теста")
                  }
                } finally {
                  setDebugTestLoading(false)
                }
              }}
            >
              {debugTestLoading ? "…" : "Тест записи"}
            </Button>
          </div>
        </CardHeader>
        {debug && (
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Redis: {debug.redisConfigured ? "✓" : "✗"} · Blob: {debug.blobConfigured ? "✓" : "✗"}</p>
            <p>Источник данных: {debug.source} · Блюд: {debug.dishesCount}</p>
            {debug.firstDishName && <p>Первое блюдо: {debug.firstDishName}</p>}
            {debug.testVerified !== undefined && (
              <p className={debug.testVerified ? "text-green-600" : "text-red-600"}>
                Тест Redis: {debug.testVerified ? "OK" : "Ошибка"}
              </p>
            )}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardContent className="pt-6">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
            Открыть сайт в новой вкладке
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
