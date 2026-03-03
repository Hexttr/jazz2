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

const SECTION_PREVIEW_IMAGES: Record<string, string> = {
  hero: "/admin/sections/section-hero.jpg",
  about: "/admin/sections/section-about.jpg",
  menu: "/admin/sections/section-menu.jpg",
  events: "/admin/sections/section-events.jpg",
  gallery: "/admin/sections/section-gallery.jpg",
  reservation: "/admin/sections/section-reservation.jpg",
  contacts: "/admin/sections/section-contacts.jpg",
  footer: "/admin/sections/section-footer.jpg",
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null)
  const [saveErrorText, setSaveErrorText] = useState<string>("")
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
    setSaveErrorText("")
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sections }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSaveMessage("success")
      } else {
        setSaveMessage("error")
        setSaveErrorText(typeof data.error === "string" ? data.error : "Не удалось сохранить")
      }
    } catch {
      setSaveMessage("error")
      setSaveErrorText("Ошибка сети или сервера")
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
        <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <p className="font-medium">Не удалось сохранить.</p>
          {saveErrorText && <p className="mt-1 text-destructive/90">{saveErrorText}</p>}
        </div>
      )}

      {/* Карточки разделов — 6 в ряд, как в Меню */}
      <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {sectionKeys.map((key) => {
          const block = (sections[key] as Record<string, unknown>) || {}
          const isOpen = openSection === key
          const cardImage = SECTION_PREVIEW_IMAGES[key]

          return (
            <div
              key={key}
              className={cn(
                "group overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/40 hover:shadow-md",
                isOpen ? "ring-2 ring-primary border-primary" : "border-border"
              )}
            >
              <div
                className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-muted"
                onClick={() => setOpenSection(isOpen ? null : key)}
              >
                <Image
                  src={cardImage}
                  alt={SECTION_LABELS[key]}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="180px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2">
                  <h3 className="truncate font-sans text-sm font-semibold text-white">
                    {SECTION_LABELS[key]}
                  </h3>
                  <div className="shrink-0 rounded-full bg-white/20 p-1">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-white" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Редактирование выбранного раздела — ниже карточек */}
      {openSection && (() => {
        const block = (sections[openSection] as Record<string, unknown>) || {}
        return (
        <div
          className="rounded-xl border-2 border-border p-4"
          style={{ backgroundColor: "lab(20 18.7 33.77)" }}
        >
          <h2 className="mb-4 font-sans text-lg font-semibold">
            {SECTION_LABELS[openSection]}
          </h2>
          <div className="space-y-4">
            {openSection === "hero" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Подпись (над заголовком)</Label>
                            <Input
                              value={(block.label as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "label", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={(block.title as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Текст под заголовком</Label>
                          <Input
                            value={(block.text as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "text", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Фоновое изображение</Label>
                            <ImageDropzone
                              value={(block.image as string) ?? ""}
                              onChange={(url) => updateSection(openSection, "image", url)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Логотип</Label>
                            <ImageDropzone
                              value={(block.logo as string) ?? ""}
                              onChange={(url) => updateSection(openSection, "logo", url)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {openSection === "about" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Подпись</Label>
                            <Input
                              value={(block.label as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "label", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={(block.title as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Первый абзац</Label>
                          <Input
                            value={(block.text as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "text", e.target.value)}
                            className="h-auto min-h-[80px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Второй абзац</Label>
                          <Input
                            value={(block.text2 as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "text2", e.target.value)}
                            className="h-auto min-h-[80px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Изображение блока</Label>
                          <ImageDropzone
                            value={(block.image as string) ?? ""}
                            onChange={(url) => updateSection(openSection, "image", url)}
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
                    {openSection === "menu" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Подпись</Label>
                            <Input
                              value={(block.label as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "label", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={(block.title as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Подпись под меню</Label>
                          <Input
                            value={(block.footerNote as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "footerNote", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {openSection === "events" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Подпись</Label>
                            <Input
                              value={(block.label as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "label", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={(block.title as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Подзаголовок</Label>
                          <Input
                            value={(block.subtitle as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "subtitle", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {openSection === "gallery" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Подпись</Label>
                          <Input
                            value={(block.label as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "label", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Заголовок</Label>
                          <Input
                            value={(block.title as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "title", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {openSection === "reservation" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Подпись</Label>
                            <Input
                              value={(block.label as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "label", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={(block.title as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Текст</Label>
                          <Input
                            value={(block.text as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "text", e.target.value)}
                            className="h-auto min-h-[60px]"
                          />
                        </div>
                      </div>
                    )}
                    {openSection === "contacts" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Подпись</Label>
                            <Input
                              value={(block.label as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "label", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Заголовок</Label>
                            <Input
                              value={(block.title as string) ?? ""}
                              onChange={(e) => updateSection(openSection, "title", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Адрес</Label>
                          <Input
                            value={(block.address as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "address", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={(block.email as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "email", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Часы работы (текст)</Label>
                          <Input
                            value={(block.hours as string) ?? ""}
                            onChange={(e) => updateSection(openSection, "hours", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Бизнес-ланч: заголовок</Label>
                          <Input
                            value={((block.businessLunch as Record<string, string>)?.title) ?? ""}
                            onChange={(e) =>
                              updateSectionNested(openSection, "businessLunch", "title", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Бизнес-ланч: цена, ₽</Label>
                          <Input
                            value={((block.businessLunch as Record<string, string>)?.price) ?? ""}
                            onChange={(e) =>
                              updateSectionNested(openSection, "businessLunch", "price", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    )}
            {openSection === "footer" && (
              <div className="space-y-2">
                <Label>Слоган (под логотипом)</Label>
                <Input
                  value={(block.tagline as string) ?? ""}
                  onChange={(e) => updateSection(openSection, "tagline", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        )
      })()}
    </div>
  )
}
