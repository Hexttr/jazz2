"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  LayoutDashboard,
  UtensilsCrossed,
  FileText,
  CalendarCheck,
  LogOut,
  Menu,
  ExternalLink,
  Bug,
  Bell,
  BellOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NOTIFY_STORAGE = "jazz-admin-notify-enabled"

const nav = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Меню и блюда", icon: UtensilsCrossed },
  { href: "/admin/sections", label: "Разделы сайта", icon: FileText },
  { href: "/admin/reservations", label: "Бронирование", icon: CalendarCheck, badge: true },
  { href: "/admin/debug", label: "Диагностика", icon: Bug },
]

function SidebarNav({
  pathname,
  pendingCount,
  onNavigate,
}: {
  pathname: string
  pendingCount: number
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {nav.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        const showBadge = "badge" in item && item.badge && pendingCount > 0
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(212,165,116,0.2)]"
                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
            )}
          >
            <Icon
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors",
                isActive ? "text-primary" : "text-white/50 group-hover:text-white/80"
              )}
            />
            <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                {pendingCount > 99 ? "99+" : pendingCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifyBrowser, setNotifyBrowser] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [notifyPermission, setNotifyPermission] = useState<NotificationPermission | "default">("default")
  const prevPendingRef = useRef<number | null>(null)
  const isLogin = pathname === "/admin/login"

  useEffect(() => {
    setMounted(true)
    try {
      setNotifyBrowser(localStorage.getItem(NOTIFY_STORAGE) === "1")
    } catch {
      setNotifyBrowser(false)
    }
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifyPermission(Notification.permission)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    const r = await fetch("/api/admin/stats", { credentials: "include", cache: "no-store" })
    if (!r.ok) return null
    return r.json() as Promise<{ reservationsPending?: number }>
  }, [])

  useEffect(() => {
    fetchStats().then((data) => {
      if (data && typeof data.reservationsPending === "number") setPendingCount(data.reservationsPending)
    })
  }, [fetchStats])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  /** Браузерные уведомления при росте числа заявок (вкладка может быть в фоне; без push — не при закрытом браузере). */
  useEffect(() => {
    if (isLogin || typeof window === "undefined" || !("Notification" in window)) return
    if (!notifyBrowser) {
      prevPendingRef.current = null
      return
    }
    let cancelled = false
    const tick = async () => {
      const data = await fetchStats()
      if (cancelled || !data || typeof data.reservationsPending !== "number") return
      const next = data.reservationsPending
      const prev = prevPendingRef.current
      prevPendingRef.current = next
      if (prev !== null && next > prev && Notification.permission === "granted") {
        try {
          new Notification("Новая заявка на бронирование", {
            body: `Ожидают обработки: ${next}`,
            icon: "/icons/pwa-192.png",
            tag: "jazz-reservation-pending",
          })
        } catch {
          /* ignore */
        }
      }
    }
    void tick()
    const id = window.setInterval(() => void tick(), 45_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [isLogin, notifyBrowser, fetchStats])

  async function toggleNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) return
    if (notifyBrowser && Notification.permission === "granted") {
      localStorage.setItem(NOTIFY_STORAGE, "0")
      setNotifyBrowser(false)
      prevPendingRef.current = null
      return
    }
    const p = await Notification.requestPermission()
    setNotifyPermission(p)
    if (p === "granted") {
      localStorage.setItem(NOTIFY_STORAGE, "1")
      setNotifyBrowser(true)
      prevPendingRef.current = null
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" })
    router.push("/admin/login")
    router.refresh()
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="text-2xl font-bold tracking-wide text-primary">JAZZ</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">admin</span>
        </Link>
      </div>

      <SidebarNav
        pathname={pathname}
        pendingCount={pendingCount}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="space-y-1 border-t border-white/[0.08] p-3">
        {mounted && !isLogin && typeof window !== "undefined" && "Notification" in window && (
          <button
            type="button"
            onClick={() => void toggleNotifications()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/80"
          >
            {notifyBrowser && notifyPermission === "granted" ? (
              <>
                <Bell className="h-[18px] w-[18px] shrink-0 text-primary" />
                <span className="flex-1">Уведомления о заявках вкл.</span>
              </>
            ) : (
              <>
                <BellOff className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">Уведомления о заявках</span>
              </>
            )}
          </button>
        )}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/80"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          Открыть сайт
        </a>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/[0.06] hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Выйти
        </button>
      </div>
    </>
  )

  return (
    <div data-admin className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-[oklch(0.1_0.005_60)] md:flex">
        {sidebarContent}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-white/[0.06] bg-[oklch(0.1_0.005_60)] p-0 text-white [&>button]:text-white/60"
        >
          <SheetTitle className="sr-only">Навигация</SheetTitle>
          {sidebarContent}
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl md:hidden">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold tracking-wide text-primary">JAZZ</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">admin</span>
        </header>

        <main className="min-h-0 flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
