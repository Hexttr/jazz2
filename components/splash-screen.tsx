"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "jazz-splash-v1"
/** Конец сплеша после exit-анимации (2.45s задержка + 0.85s fade). */
const SHOW_MS = 3400

/**
 * Однократный за сессию сплеш на главной: тёмный фон, золотой логотип, лёгкое свечение.
 */
export function SplashScreen() {
  const [mode, setMode] = useState<"check" | "run" | "done">("check")

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        setMode("done")
        return
      }
    } catch {
      /* ignore */
    }
    setMode("run")
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1")
      } catch {
        /* ignore */
      }
      setMode("done")
    }, SHOW_MS)
    return () => window.clearTimeout(t)
  }, [])

  if (mode !== "run") return null

  return (
    <div
      className="jazz-splash-exit pointer-events-none fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#0a0806]"
      style={{
        animation: "jazz-splash-exit 0.85s ease-in 2.45s forwards",
      }}
      aria-hidden
    >
      {/* Radial glow */}
      <div
        className="jazz-splash-animate pointer-events-none absolute h-[min(120vw,720px)] w-[min(120vw,720px)] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.12_65_/_0.25)_0%,transparent_65%)]"
        style={{ animation: "jazz-splash-glow 3s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.35 0.06 55 / 0.35), transparent 55%)",
          animation: "jazz-splash-bg 4s ease-in-out infinite alternate",
        }}
      />

      {/* Gold line */}
      <div
        className="jazz-splash-animate mb-10 h-px w-[min(12rem,50vw)] origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
        style={{ animation: "jazz-splash-line 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
      />

      <h1
        className="jazz-splash-animate font-serif text-5xl font-bold tracking-[0.15em] text-transparent sm:text-6xl md:text-7xl"
        style={{
          backgroundImage:
            "linear-gradient(105deg, oklch(0.55 0.1 60) 0%, oklch(0.82 0.14 70) 35%, oklch(0.6 0.1 55) 50%, oklch(0.85 0.12 68) 65%, oklch(0.55 0.1 60) 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          animation:
            "jazz-splash-title 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards, jazz-splash-shimmer 3.5s linear 0.5s infinite",
        }}
      >
        JAZZ
      </h1>

      <p
        className="jazz-splash-animate mt-6 max-w-xs text-center text-sm font-medium uppercase tracking-[0.35em] text-primary/70"
        style={{
          opacity: 0,
          animation: "jazz-splash-title 1s ease 0.6s forwards",
        }}
      >
        Тамбов
      </p>
    </div>
  )
}
