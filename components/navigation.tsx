"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"

const navLinks = [
  { href: "#about", label: "О нас" },
  { href: "#menu", label: "Меню" },
  { href: "#banquets", label: "Банкеты" },
  { href: "#gallery", label: "Галерея" },
  { href: "#contacts", label: "Контакты" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="font-sans text-3xl font-bold tracking-wide text-primary">
            JAZZ
          </span>
          <span className="hidden text-sm font-semibold uppercase tracking-[0.3em] text-white sm:inline">
            cafe
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-foreground/70 transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href="tel:+74752525697"
            className="flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <Phone className="h-4 w-4" />
            +7 (4752) 52-56-97
          </a>
          <a
            href="#reservation"
            className="rounded-none border border-primary bg-primary px-6 py-2.5 text-sm font-medium tracking-wider text-primary-foreground transition-all hover:bg-transparent hover:text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Бронь стола
          </a>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-foreground lg:hidden"
          aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border bg-background/95 backdrop-blur-md px-6 pb-6 pt-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg text-foreground/70 transition-colors hover:text-primary"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <a
                href="tel:+74752525697"
                className="flex items-center gap-2 text-foreground/70"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                <Phone className="h-4 w-4" />
                +7 (4752) 52-56-97
              </a>
              <a
                href="#reservation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-block border border-primary bg-primary px-6 py-2.5 text-center text-sm font-medium tracking-wider text-primary-foreground transition-all hover:bg-transparent hover:text-primary"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Бронь стола
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
