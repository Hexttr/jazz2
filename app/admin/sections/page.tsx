"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageDropzone } from "@/components/admin/image-dropzone"
import type { SectionsContent, AppContent } from "@/lib/content-types"

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero (главный экран)",
  about: "О нас",
  menu: "Блок меню",
  events: "Банкеты",
  gallery: "Галерея",
  reservation: "Бронирование",
  contacts: "Контакты",
  footer: "Подвал",
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null)

  useEffect(() => {
    fetch("/api/content", { credentials: "include" })
      .then((r) => r.json())
      .then((data: AppContent) => {
        if (data.sections) setSections(data.sections)
      })
      .catch(() => setSections({}))
      .finally(() => setLoading(false))
  }, [])

  function updateSection(
    key: string,
    field: string,
    value: string | number | Record<string, unknown>[] | undefined
  ) {
    setSections((s) => {
      if (!s) return s
      const block = { ...(s[key] as Record<string, unknown>), [field]: value }
      return { ...s, [key]: block }
    })
  }

  function updateSectionNested(key: string, nestedKey: string, field: string, value: unknown) {
    setSections((s) => {
      if (!s) return s
      const block = s[key] as Record<string, unknown>
      const nested = (block[nestedKey] as Record<string, unknown>) || {}
      const next = { ...block, [nestedKey]: { ...nested, [field]: value } }
      return { ...s, [key]: next }
    })
  }

  async function save() {
    if (!sections) return
    setSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sections }),
      })
      if (res.ok) setSaveMessage("success")
      else setSaveMessage("error")
    } catch {
      setSaveMessage("error")
    } finally {
      setSaving(false)
    }
  }

  if (loading || !sections) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-2xl font-bold tracking-wide">Разделы сайта</h1>
        <Button onClick={save} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Сохранение…" : "Сохранить"}
        </Button>
      </div>
      {saveMessage === "success" && (
        <p className="rounded-md bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400">
          Изменения сохранены.
        </p>
      )}
      {saveMessage === "error" && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          Не удалось сохранить. Проверьте настройки (Vercel Blob).
        </p>
      )}

      {Object.keys(SECTION_LABELS).map((key) => {
        const block = (sections[key] as Record<string, unknown>) || {}
        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{SECTION_LABELS[key]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {key === "hero" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Подпись (над заголовком)</Label>
                      <Input
                        value={(block.label as string) ?? ""}
                        onChange={(e) => updateSection(key, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={(block.title as string) ?? ""}
                        onChange={(e) => updateSection(key, "title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Текст под заголовком</Label>
                    <Input
                      value={(block.text as string) ?? ""}
                      onChange={(e) => updateSection(key, "text", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Фоновое изображение</Label>
                      <ImageDropzone
                        value={(block.image as string) ?? ""}
                        onChange={(url) => updateSection(key, "image", url)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Логотип</Label>
                      <ImageDropzone
                        value={(block.logo as string) ?? ""}
                        onChange={(url) => updateSection(key, "logo", url)}
                      />
                    </div>
                  </div>
                </>
              )}
              {key === "about" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Подпись</Label>
                      <Input
                        value={(block.label as string) ?? ""}
                        onChange={(e) => updateSection(key, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={(block.title as string) ?? ""}
                        onChange={(e) => updateSection(key, "title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Первый абзац</Label>
                    <Input
                      value={(block.text as string) ?? ""}
                      onChange={(e) => updateSection(key, "text", e.target.value)}
                      className="h-auto min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Второй абзац</Label>
                    <Input
                      value={(block.text2 as string) ?? ""}
                      onChange={(e) => updateSection(key, "text2", e.target.value)}
                      className="h-auto min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Изображение блока</Label>
                    <ImageDropzone
                      value={(block.image as string) ?? ""}
                      onChange={(url) => updateSection(key, "image", url)}
                    />
                  </div>
                </>
              )}
              {key === "menu" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Подпись</Label>
                      <Input
                        value={(block.label as string) ?? ""}
                        onChange={(e) => updateSection(key, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={(block.title as string) ?? ""}
                        onChange={(e) => updateSection(key, "title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Подпись под меню</Label>
                    <Input
                      value={(block.footerNote as string) ?? ""}
                      onChange={(e) => updateSection(key, "footerNote", e.target.value)}
                    />
                  </div>
                </>
              )}
              {key === "events" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Подпись</Label>
                      <Input
                        value={(block.label as string) ?? ""}
                        onChange={(e) => updateSection(key, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={(block.title as string) ?? ""}
                        onChange={(e) => updateSection(key, "title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Подзаголовок</Label>
                    <Input
                      value={(block.subtitle as string) ?? ""}
                      onChange={(e) => updateSection(key, "subtitle", e.target.value)}
                    />
                  </div>
                </>
              )}
              {key === "gallery" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Подпись</Label>
                      <Input
                        value={(block.label as string) ?? ""}
                        onChange={(e) => updateSection(key, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={(block.title as string) ?? ""}
                        onChange={(e) => updateSection(key, "title", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              {key === "reservation" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Подпись</Label>
                      <Input
                        value={(block.label as string) ?? ""}
                        onChange={(e) => updateSection(key, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={(block.title as string) ?? ""}
                        onChange={(e) => updateSection(key, "title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Текст</Label>
                    <Input
                      value={(block.text as string) ?? ""}
                      onChange={(e) => updateSection(key, "text", e.target.value)}
                      className="h-auto min-h-[60px]"
                    />
                  </div>
                </>
              )}
              {key === "contacts" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Подпись</Label>
                      <Input
                        value={(block.label as string) ?? ""}
                        onChange={(e) => updateSection(key, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Заголовок</Label>
                      <Input
                        value={(block.title as string) ?? ""}
                        onChange={(e) => updateSection(key, "title", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Адрес</Label>
                    <Input
                      value={(block.address as string) ?? ""}
                      onChange={(e) => updateSection(key, "address", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={(block.email as string) ?? ""}
                      onChange={(e) => updateSection(key, "email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Часы работы (текст)</Label>
                    <Input
                      value={(block.hours as string) ?? ""}
                      onChange={(e) => updateSection(key, "hours", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Бизнес-ланч: заголовок</Label>
                    <Input
                      value={((block.businessLunch as Record<string, string>)?.title) ?? ""}
                      onChange={(e) =>
                        updateSectionNested(key, "businessLunch", "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Бизнес-ланч: цена, ₽</Label>
                    <Input
                      value={((block.businessLunch as Record<string, string>)?.price) ?? ""}
                      onChange={(e) =>
                        updateSectionNested(key, "businessLunch", "price", e.target.value)
                      }
                    />
                  </div>
                </>
              )}
              {key === "footer" && (
                <>
                  <div className="space-y-2">
                    <Label>Слоган (под логотипом)</Label>
                    <Input
                      value={(block.tagline as string) ?? ""}
                      onChange={(e) => updateSection(key, "tagline", e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
