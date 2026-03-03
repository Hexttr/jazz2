"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, UtensilsCrossed, FileText, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Меню и блюда", icon: UtensilsCrossed },
  { href: "/admin/sections", label: "Разделы сайта", icon: FileText },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-muted/30 font-sans">
      <aside className="sticky top-0 flex h-screen w-56 flex-col border-r border-white/10 bg-black">
        <div className="flex h-14 items-center border-b border-white/20 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-sans text-2xl font-bold tracking-wide text-primary">
              JAZZ
            </span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-white/90 sm:inline">
              cafe
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {nav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-white/20 p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-8" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </main>
    </div>
  )
}
