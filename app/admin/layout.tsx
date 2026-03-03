"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  UtensilsCrossed,
  FileText,
  CalendarCheck,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Меню и блюда", icon: UtensilsCrossed },
  { href: "/admin/sections", label: "Разделы сайта", icon: FileText },
  { href: "/admin/reservations", label: "Бронирование", icon: CalendarCheck, badge: true },
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { reservationsPending?: number } | null) => {
        if (data && typeof data.reservationsPending === "number")
          setPendingCount(data.reservationsPending)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            admin
          </span>
        </Link>
      </div>

      <SidebarNav
        pathname={pathname}
        pendingCount={pendingCount}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="space-y-1 border-t border-white/[0.08] p-3">
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
          onClick={handleLogout}
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
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-white/[0.06] bg-[oklch(0.1_0.005_60)] md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile header + sheet */}
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
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold tracking-wide text-primary">JAZZ</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            admin
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
