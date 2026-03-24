"use client"

import { useState } from "react"
import { Bug } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type DebugInfo = {
  storage: string
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
  const [debugLoading, setDebugLoading] = useState(false)
  const [debugTestLoading, setDebugTestLoading] = useState(false)

  return (
    <div className="space-y-6">
      <div className="border-b border-white/15 pb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
          <Bug className="h-6 w-6 text-primary" />
          Диагностика хранилища
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Локальные файлы в каталоге <code className="text-xs">data/</code> на сервере
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
          {debug && (
            <div className="space-y-1 rounded-lg bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
              <p>Хранилище: {debug.storage}</p>
              <p>data/: {debug.dataDir}</p>
              <p>
                app-content.json: {debug.mergedFileExists ? "есть" : "нет (используются menu.json + sections.json)"}
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
