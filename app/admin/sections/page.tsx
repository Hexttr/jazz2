"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Save, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageDropzone } from "@/components/admin/image-dropzone"
import { IconPicker } from "@/components/admin/icon-picker"
import type { SectionsContent, AppContent } from "@/lib/content-types"
import { cn } from "@/lib/utils"

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

const SECTION_IMAGES: Record<string, string> = {
  hero: "https://picsum.photos/seed/jazz-hero/400/250",
  about: "https://picsum.photos/seed/jazz-about/400/250",
  menu: "https://picsum.photos/seed/jazz-menu/400/250",
  events: "https://picsum.photos/seed/jazz-events/400/250",
  gallery: "https://picsum.photos/seed/jazz-gallery/400/250",
  reservation: "https://picsum.photos/seed/jazz-reservation/400/250",
  contacts: "https://picsum.photos/seed/jazz-contacts/400/250",
  footer: "https://picsum.photos/seed/jazz-footer/400/250",
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null)
  const [openSection, setOpenSection] = useState<string | null>(null)

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

  function updateAboutFeature(index: number, field: string, value: string) {
    setSections((s) => {
      if (!s?.about) return s
      const about = s.about as Record<string, unknown>
      const features = [...((about.features as Record<string, string>[]) || [])]
      if (!features[index]) return s
      features[index] = { ...features[index], [field]: value }
      return { ...s, about: { ...about, features } }
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

  const sectionKeys = Object.keys(SECTION_LABELS)

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectionKeys.map((key) => {
          const block = (sections[key] as Record<string, unknown>) || {}
          const isOpen = openSection === key
          const cardImage = (block.image as string) || SECTION_IMAGES[key]

          return (
            <div
              key={key}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div
                className="relative aspect-[16/10] cursor-pointer overflow-hidden bg-muted"
                onClick={() => setOpenSection(isOpen ? null : key)}
              >
                {cardImage ? (
                  <Image
                    src={cardImage}
                    alt={SECTION_LABELS[key]}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={cardImage.startsWith("http")}
                    sizes="400px"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
                  <h3 className="font-sans text-lg font-semibold text-white">
                    {SECTION_LABELS[key]}
                  </h3>
                  <div className="flex items-center gap-1 rounded-full bg-white/20 p-1.5">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="min-h-0">
                  <div className="border-t border-border bg-muted/20 p-4">
                    {key === "hero" && (
                      <div className="space-y-4">
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
                      </div>
                    )}
                    {key === "about" && (
                      <div className="space-y-4">
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
                        <div className="space-y-3">
                          <Label>Блоки с иконками (О нас)</Label>
                          {((block.features as { icon?: string; title?: string; description?: string }[]) || []).map(
                            (f, i) => (
                              <div key={i} className="rounded-lg border border-border bg-background p-3">
                                <IconPicker
                                  label="Иконка"
                                  value={f.icon}
                                  onChange={(iconId) => updateAboutFeature(i, "icon", iconId)}
                                />
                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                  <Input
                                    placeholder="Заголовок"
                                    value={f.title ?? ""}
                                    onChange={(e) => updateAboutFeature(i, "title", e.target.value)}
                                  />
                                  <Input
                                    placeholder="Описание"
                                    value={f.description ?? ""}
                                    onChange={(e) => updateAboutFeature(i, "description", e.target.value)}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {key === "menu" && (
                      <div className="space-y-4">
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
                      </div>
                    )}
                    {key === "events" && (
                      <div className="space-y-4">
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
                      </div>
                    )}
                    {key === "gallery" && (
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
                    )}
                    {key === "reservation" && (
                      <div className="space-y-4">
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
                      </div>
                    )}
                    {key === "contacts" && (
                      <div className="space-y-4">
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
                      </div>
                    )}
                    {key === "footer" && (
                      <div className="space-y-2">
                        <Label>Слоган (под логотипом)</Label>
                        <Input
                          value={(block.tagline as string) ?? ""}
                          onChange={(e) => updateSection(key, "tagline", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
