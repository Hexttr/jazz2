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
  ArrowRight,
  LayoutDashboard,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getImageUrl } from "@/lib/utils"

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

const statCards = [
  { key: "categoriesCount" as const, label: "Категорий", icon: FolderOpen, href: "/admin/menu" },
  { key: "dishesCount" as const, label: "Блюд", icon: ChefHat, href: "/admin/menu" },
  { key: "reservationsTotal" as const, label: "Заявок", icon: ClipboardList, href: "/admin/reservations" },
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

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Stats | null) => data && setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/15 pb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Панель управления
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Управление контентом сайта кафе JAZZ
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, href }) => (
          <Link key={key} href={href} className="group block">
            <Card
              className="relative overflow-hidden border-white/20 bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.04] transition-transform duration-500 group-hover:scale-150" />
              <CardContent className="flex flex-row items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-3xl font-bold tabular-nums text-foreground">
                    {stats ? stats[key] : "—"}
                    {key === "reservationsTotal" && stats && stats.reservationsPending > 0 && (
                      <span className="text-xs font-medium text-amber-500">
                        ({stats.reservationsPending} на рассмотрении)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {overviewCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href} className="group">
              <Card className="h-full overflow-hidden border-white/20 bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={getImageUrl(card.image)}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-card/80" />
                </div>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-semibold uppercase tracking-wide">{card.title}</CardTitle>
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

    </div>
  )
}
