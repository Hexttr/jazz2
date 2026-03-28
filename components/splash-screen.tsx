"use client"

import { useEffect, useState } from "react"

/** Смена версии — один раз показать сплэш снова после обновления логики PWA. */
const STORAGE_KEY = "jazz-splash-v2"
/** Конец сплеша после exit-анимации (2.45s задержка + 0.85s fade). */
const SHOW_MS = 3400

/**
 * iOS «На экран Домой»: в первую очередь navigator.standalone.
 * Android / Chrome: display-mode.
 */
function isInstalledPwa(): boolean {
  if (typeof window === "undefined") return false
  try {
    const nav = window.navigator as Navigator & { standalone?: boolean }
    if (nav.standalone === true) return true
  } catch {
    /* ignore */
  }
  if (typeof window.matchMedia !== "function") return false
  const modes = ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"] as const
  for (const m of modes) {
    try {
      if (window.matchMedia(`(display-mode: ${m})`).matches) return true
    } catch {
      /* ignore */
    }
  }
  return false
}

/**
 * Сплэш только в установленном PWA (с главного экрана). В обычной вкладке браузера не показывается.
 */
export function SplashScreen() {
  const [mode, setMode] = useState<"check" | "run" | "done">("check")

  useEffect(() => {
    let cancelled = false
    let tSplash: number | undefined
    /** Небольшая задержка: на iOS/Android корректно определяется standalone/display-mode. */
    const t0 = window.setTimeout(() => {
      if (cancelled) return
      if (!isInstalledPwa()) {
        setMode("done")
        return
      }
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) {
          setMode("done")
          return
        }
      } catch {
        /* ignore */
      }
      setMode("run")
      tSplash = window.setTimeout(() => {
        if (cancelled) return
        try {
          sessionStorage.setItem(STORAGE_KEY, "1")
        } catch {
          /* ignore */
        }
        setMode("done")
      }, SHOW_MS)
    }, 50)

    return () => {
      cancelled = true
      window.clearTimeout(t0)
      if (tSplash) window.clearTimeout(tSplash)
    }
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
