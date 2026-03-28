"use client"

import { useEffect, useState } from "react"
import { Bug } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type DebugInfo = {
  storage: string
  databasePath?: string
  databasePathFromEnv?: string | null
  databaseFileExists?: boolean
  databaseWalExists?: boolean
  databaseShmExists?: boolean
  appCwd?: string
  dataDir: string
  mergedContentFile: string
  mergedFileExists: boolean
  source: string
  dishesCount: number
  firstDishName: string | null
  testVerified?: boolean
}

export default function AdminDebugPage() {
  const [debug, setDebug] = useState<DebugInfo | null>(null)
  const [debugError, setDebugError] = useState<string | null>(null)
  const [debugLoading, setDebugLoading] = useState(false)
  const [debugTestLoading, setDebugTestLoading] = useState(false)

  async function loadDebug() {
    setDebugLoading(true)
    setDebugError(null)
    try {
      const r = await fetch("/api/admin/content-debug", {
        credentials: "include",
        cache: "no-store",
      })
      const d = await r.json().catch(() => null)
      if (r.status === 401) {
        window.location.href = "/admin/login"
        return
      }
      if (r.ok && d && !d.error) {
        setDebug(d as DebugInfo)
      } else {
        setDebugError((d && (d.error as string)) || `Ошибка ${r.status}`)
      }
    } catch {
      setDebugError("Ошибка соединения")
    } finally {
      setDebugLoading(false)
    }
  }

  useEffect(() => {
    void loadDebug()
  }, [])

  return (
    <div className="space-y-6">
      <div className="border-b border-white/15 pb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
          <Bug className="h-6 w-6 text-primary" />
          Диагностика хранилища
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Контент и заявки в SQLite; каталог <code className="text-xs">data/</code> на сервере. Ниже — полный путь к файлу БД для
          бэкапа.
        </p>
      </div>

      <Card className="border-white/20 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bug className="h-4 w-4" />
            Состояние
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" disabled={debugLoading} onClick={() => void loadDebug()}>
              {debugLoading ? "..." : "Обновить"}
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
                        ? "Запись и чтение в data/ работают"
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
          {debugError && (
            <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{debugError}</p>
          )}
          {debug && (
            <div className="space-y-2 rounded-lg bg-muted/30 p-3 font-mono text-xs text-muted-foreground break-all">
              <p>Хранилище: {debug.storage}</p>
              {debug.appCwd != null && <p>process.cwd(): {debug.appCwd}</p>}
              {debug.databasePathFromEnv != null && debug.databasePathFromEnv !== "" && (
                <p>DATABASE_PATH в .env: {debug.databasePathFromEnv}</p>
              )}
              <p className="text-foreground">
                <span className="font-semibold text-primary">Файл SQLite (для бэкапа):</span> {debug.databasePath ?? "—"}
              </p>
              <p>
                Файл существует: {debug.databaseFileExists === true ? "да" : debug.databaseFileExists === false ? "нет" : "—"}
                {debug.databaseWalExists ? " · WAL: -wal есть" : ""}
                {debug.databaseShmExists ? " · -shm есть" : ""}
              </p>
              <p>data/: {debug.dataDir}</p>
              <p>
                app-content.json (legacy): {debug.mergedFileExists ? "есть" : "нет"}
              </p>
              <p>
                Источник: {debug.source} · Блюд: {debug.dishesCount}
              </p>
              {debug.firstDishName && <p>Первое блюдо: {debug.firstDishName}</p>}
              {debug.testVerified !== undefined && (
                <p className={debug.testVerified ? "text-green-500" : "text-red-500"}>
                  Тест записи: {debug.testVerified ? "OK" : "Ошибка"}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
