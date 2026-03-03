"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Save, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageDropzone } from "@/components/admin/image-dropzone"
import { IconPicker } from "@/components/admin/icon-picker"
import type { SectionsContent, AppContent } from "@/lib/content-types"
import { cn } from "@/lib/utils"

const DEFAULTS = {
  primary: "#d4a574",
  white: "#ffffff",
  white70: "#b8b8b8",
  foreground: "#ede9e0",
  muted: "#9c9588",
} as const

function ColorInput({
  value,
  onChange,
  title = "Цвет текста",
  defaultValue = DEFAULTS.primary,
}: {
  value?: string
  onChange: (v: string) => void
  title?: string
  defaultValue?: string
}) {
  return (
    <div className="flex min-h-[2.25rem] w-10 shrink-0 self-stretch overflow-hidden rounded border border-white">
      <input
        type="color"
        title={title}
        value={value || defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full min-h-0 cursor-pointer border-0 bg-transparent p-0"
      />
    </div>
  )
}

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
    value: string | string[] | number | Record<string, unknown>[] | undefined
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

  function updateEventsHall(hallIndex: number, field: string, value: unknown) {
    setSections((s) => {
      if (!s?.events) return s
      const events = s.events as Record<string, unknown>
      const halls = [...((events.halls as Record<string, unknown>[]) || [])]
      if (!halls[hallIndex]) return s
      halls[hallIndex] = { ...halls[hallIndex], [field]: value }
      return { ...s, events: { ...events, halls } }
    })
  }

  function updateEventsHallFeature(hallIndex: number, featureIndex: number, value: string) {
    setSections((s) => {
      if (!s?.events) return s
      const events = s.events as Record<string, unknown>
      const halls = [...((events.halls as Record<string, unknown>[]) || [])]
      const hall = halls[hallIndex] as Record<string, unknown>
      if (!hall) return s
      const features = [...((hall.features as string[]) || [])]
      features[featureIndex] = value
      halls[hallIndex] = { ...hall, features }
      return { ...s, events: { ...events, halls } }
    })
  }

  function updateGalleryImage(index: number, field: string, value: string) {
    setSections((s) => {
      if (!s?.gallery) return s
      const gallery = s.gallery as Record<string, unknown>
      const images = [...((gallery.images as { src: string; alt: string; span: string }[]) || [])]
      if (!images[index]) return s
      images[index] = { ...images[index], [field]: value }
      return { ...s, gallery: { ...gallery, images } }
    })
  }

  function addGalleryImage() {
    setSections((s) => {
      if (!s?.gallery) return s
      const gallery = s.gallery as Record<string, unknown>
      const images = [...((gallery.images as { src: string; alt: string; span: string }[]) || [])]
      images.push({ src: "", alt: "", span: "" })
      return { ...s, gallery: { ...gallery, images } }
    })
  }

  function removeGalleryImage(index: number) {
    setSections((s) => {
      if (!s?.gallery) return s
      const gallery = s.gallery as Record<string, unknown>
      const images = ((gallery.images as { src: string; alt: string; span: string }[]) || []).filter((_, i) => i !== index)
      return { ...s, gallery: { ...gallery, images } }
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
        const isHeroSection = openSection === "hero"
        return (
        <div
          className="rounded-xl border-2 border-border p-4 [&_input]:border-white [&_input]:focus-visible:border-white"
          style={{ backgroundColor: "lab(21 0 0)" }}
        >
          <h2 className="mb-4 font-sans text-lg font-semibold">
            {SECTION_LABELS[openSection]}
          </h2>
          <div className="space-y-4">
            {openSection === "hero" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Подпись (над заголовком)</Label>
                              <Input value={(block.label as string) ?? ""} onChange={(e) => updateSection(openSection, "label", e.target.value)} />
                            </div>
                            <ColorInput value={block.labelColor as string} onChange={(v) => updateSection(openSection, "labelColor", v)} defaultValue={DEFAULTS.primary} />
                          </div>
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Заголовок</Label>
                              <Input value={(block.title as string) ?? ""} onChange={(e) => updateSection(openSection, "title", e.target.value)} />
                            </div>
                            <ColorInput value={block.titleColor as string} onChange={(v) => updateSection(openSection, "titleColor", v)} defaultValue={isHeroSection ? DEFAULTS.white : DEFAULTS.foreground} />
                          </div>
                        </div>
                        <div className="flex gap-2 items-stretch">
                          <div className="flex-1 space-y-2">
                            <Label>Текст под заголовком</Label>
                            <Input value={(block.text as string) ?? ""} onChange={(e) => updateSection(openSection, "text", e.target.value)} />
                          </div>
                          <ColorInput value={block.textColor as string} onChange={(v) => updateSection(openSection, "textColor", v)} defaultValue={isHeroSection ? DEFAULTS.white70 : DEFAULTS.foreground} />
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
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Подпись</Label>
                              <Input value={(block.label as string) ?? ""} onChange={(e) => updateSection(openSection, "label", e.target.value)} />
                            </div>
                            <ColorInput value={block.labelColor as string} onChange={(v) => updateSection(openSection, "labelColor", v)} defaultValue={DEFAULTS.primary} />
                          </div>
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Заголовок</Label>
                              <Input value={(block.title as string) ?? ""} onChange={(e) => updateSection(openSection, "title", e.target.value)} />
                            </div>
                            <ColorInput value={block.titleColor as string} onChange={(v) => updateSection(openSection, "titleColor", v)} defaultValue={isHeroSection ? DEFAULTS.white : DEFAULTS.foreground} />
                          </div>
                        </div>
                        <div className="flex gap-2 items-stretch">
                          <div className="flex-1 space-y-2">
                            <Label>Первый абзац</Label>
                            <Input value={(block.text as string) ?? ""} onChange={(e) => updateSection(openSection, "text", e.target.value)} className="h-auto min-h-[80px]" />
                          </div>
                          <ColorInput value={block.textColor as string} onChange={(v) => updateSection(openSection, "textColor", v)} defaultValue={isHeroSection ? DEFAULTS.white70 : DEFAULTS.foreground} />
                        </div>
                        <div className="flex gap-2 items-stretch">
                          <div className="flex-1 space-y-2">
                            <Label>Второй абзац</Label>
                            <Input value={(block.text2 as string) ?? ""} onChange={(e) => updateSection(openSection, "text2", e.target.value)} className="h-auto min-h-[80px]" />
                          </div>
                          <ColorInput value={block.text2Color as string} onChange={(v) => updateSection(openSection, "text2Color", v)} defaultValue={DEFAULTS.foreground} />
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
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Подпись</Label>
                              <Input value={(block.label as string) ?? ""} onChange={(e) => updateSection(openSection, "label", e.target.value)} />
                            </div>
                            <ColorInput value={block.labelColor as string} onChange={(v) => updateSection(openSection, "labelColor", v)} defaultValue={DEFAULTS.primary} />
                          </div>
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Заголовок</Label>
                              <Input value={(block.title as string) ?? ""} onChange={(e) => updateSection(openSection, "title", e.target.value)} />
                            </div>
                            <ColorInput value={block.titleColor as string} onChange={(v) => updateSection(openSection, "titleColor", v)} defaultValue={isHeroSection ? DEFAULTS.white : DEFAULTS.foreground} />
                          </div>
                        </div>
                        <div className="flex gap-2 items-stretch">
                          <div className="flex-1 space-y-2">
                            <Label>Подпись под меню</Label>
                            <Input value={(block.footerNote as string) ?? ""} onChange={(e) => updateSection(openSection, "footerNote", e.target.value)} />
                          </div>
                          <ColorInput value={block.footerNoteColor as string} onChange={(v) => updateSection(openSection, "footerNoteColor", v)} defaultValue={DEFAULTS.muted} />
                        </div>
                      </div>
                    )}
                    {openSection === "events" && (
                      <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Подпись</Label>
                              <Input value={(block.label as string) ?? ""} onChange={(e) => updateSection(openSection, "label", e.target.value)} />
                            </div>
                            <ColorInput value={block.labelColor as string} onChange={(v) => updateSection(openSection, "labelColor", v)} defaultValue={DEFAULTS.primary} />
                          </div>
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Заголовок</Label>
                              <Input value={(block.title as string) ?? ""} onChange={(e) => updateSection(openSection, "title", e.target.value)} />
                            </div>
                            <ColorInput value={block.titleColor as string} onChange={(v) => updateSection(openSection, "titleColor", v)} defaultValue={isHeroSection ? DEFAULTS.white : DEFAULTS.foreground} />
                          </div>
                        </div>
                        <div className="flex gap-2 items-stretch">
                          <div className="flex-1 space-y-2">
                            <Label>Подзаголовок</Label>
                            <Input value={(block.subtitle as string) ?? ""} onChange={(e) => updateSection(openSection, "subtitle", e.target.value)} />
                          </div>
                          <ColorInput value={block.subtitleColor as string} onChange={(v) => updateSection(openSection, "subtitleColor", v)} defaultValue={DEFAULTS.muted} />
                        </div>
                        <div className="border-t border-white/20 pt-4 space-y-6">
                          <Label className="text-base">Карточки залов</Label>
                          {((block.halls as Record<string, unknown>[]) || []).map((hall, hi) => (
                            <div key={hi} className="rounded-lg border border-white/30 bg-black/20 p-4 space-y-3">
                              <h4 className="font-sans font-semibold text-white/90">Зал {hi + 1}: {(hall.name as string) || "—"}</h4>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Название</Label>
                                  <Input value={(hall.name as string) ?? ""} onChange={(e) => updateEventsHall(hi, "name", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Подзаголовок</Label>
                                  <Input value={(hall.subtitle as string) ?? ""} onChange={(e) => updateEventsHall(hi, "subtitle", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Вместимость</Label>
                                  <Input type="number" value={(hall.capacity as number) ?? ""} onChange={(e) => updateEventsHall(hi, "capacity", parseInt(e.target.value, 10) || 0)} />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                  <Label className="text-xs">Изображение</Label>
                                  <ImageDropzone value={(hall.image as string) ?? ""} onChange={(url) => updateEventsHall(hi, "image", url)} />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                  <Label className="text-xs">Описание</Label>
                                  <Input value={(hall.description as string) ?? ""} onChange={(e) => updateEventsHall(hi, "description", e.target.value)} className="h-auto min-h-[60px]" />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                  <Label className="text-xs">Идеально для</Label>
                                  <Input value={(hall.ideal as string) ?? ""} onChange={(e) => updateEventsHall(hi, "ideal", e.target.value)} />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                  <Label className="text-xs">Особенности (каждая с новой строки или через запятую)</Label>
                                  <Input value={((hall.features as string[]) || []).join(", ")} onChange={(e) => updateEventsHall(hi, "features", e.target.value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean))} className="h-auto min-h-[60px]" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {openSection === "gallery" && (
                      <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Подпись</Label>
                              <Input value={(block.label as string) ?? ""} onChange={(e) => updateSection(openSection, "label", e.target.value)} />
                            </div>
                            <ColorInput value={block.labelColor as string} onChange={(v) => updateSection(openSection, "labelColor", v)} defaultValue={DEFAULTS.primary} />
                          </div>
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Заголовок</Label>
                              <Input value={(block.title as string) ?? ""} onChange={(e) => updateSection(openSection, "title", e.target.value)} />
                            </div>
                            <ColorInput value={block.titleColor as string} onChange={(v) => updateSection(openSection, "titleColor", v)} defaultValue={isHeroSection ? DEFAULTS.white : DEFAULTS.foreground} />
                          </div>
                        </div>
                        <div className="border-t border-white/20 pt-4">
                          <div className="mb-3 flex items-center justify-between">
                            <Label className="text-base">Изображения галереи</Label>
                            <Button type="button" size="sm" variant="outline" onClick={addGalleryImage} className="border-white/50 text-white hover:bg-white/10"><Plus className="mr-1 h-4 w-4" />Добавить</Button>
                          </div>
                          <div className="space-y-3">
                            {((block.images as { src: string; alt: string; span: string }[]) || []).map((img, gi) => (
                              <div key={gi} className="flex flex-wrap items-end gap-3 rounded-lg border border-white/30 bg-black/20 p-3">
                                <div className="w-24 shrink-0">
                                  <Label className="text-xs">Превью</Label>
                                  {img.src ? <Image src={img.src} alt={img.alt || ""} width={96} height={72} className="mt-1 rounded object-cover" unoptimized={img.src.startsWith("http")} /> : <div className="mt-1 h-[72px] rounded bg-white/10 flex items-center justify-center text-xs text-white/50">Нет</div>}
                                </div>
                                <div className="flex-1 min-w-[200px] space-y-1">
                                  <Label className="text-xs">URL изображения</Label>
                                  <ImageDropzone value={img.src} onChange={(url) => updateGalleryImage(gi, "src", url)} />
                                </div>
                                <div className="flex-1 min-w-[120px] space-y-1">
                                  <Label className="text-xs">Подпись (alt)</Label>
                                  <Input value={img.alt} onChange={(e) => updateGalleryImage(gi, "alt", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Размер</Label>
                                  <select value={img.span || ""} onChange={(e) => updateGalleryImage(gi, "span", e.target.value)} className="h-9 rounded border border-white bg-transparent px-2 text-sm text-white">
                                    <option value="">Обычный</option>
                                    <option value="md:col-span-2 md:row-span-2">Большой (2×2)</option>
                                  </select>
                                </div>
                                <Button type="button" size="icon" variant="destructive" className="h-8 w-8 shrink-0" onClick={() => removeGalleryImage(gi)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {openSection === "reservation" && (
                      <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Подпись</Label>
                              <Input value={(block.label as string) ?? ""} onChange={(e) => updateSection(openSection, "label", e.target.value)} />
                            </div>
                            <ColorInput value={block.labelColor as string} onChange={(v) => updateSection(openSection, "labelColor", v)} defaultValue={DEFAULTS.primary} />
                          </div>
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Заголовок</Label>
                              <Input value={(block.title as string) ?? ""} onChange={(e) => updateSection(openSection, "title", e.target.value)} />
                            </div>
                            <ColorInput value={block.titleColor as string} onChange={(v) => updateSection(openSection, "titleColor", v)} defaultValue={isHeroSection ? DEFAULTS.white : DEFAULTS.foreground} />
                          </div>
                        </div>
                        <div className="flex gap-2 items-stretch">
                          <div className="flex-1 space-y-2">
                            <Label>Текст (основной)</Label>
                            <Input value={(block.text as string) ?? ""} onChange={(e) => updateSection(openSection, "text", e.target.value)} className="h-auto min-h-[60px]" />
                          </div>
                          <ColorInput value={block.textColor as string} onChange={(v) => updateSection(openSection, "textColor", v)} defaultValue={isHeroSection ? DEFAULTS.white70 : DEFAULTS.foreground} />
                        </div>
                        <div className="border-t border-white/20 pt-4 space-y-4">
                          <Label className="text-base">Блоки под текстом</Label>
                          <div className="rounded-lg border border-white/30 bg-black/20 p-4 space-y-3">
                            <Label className="text-xs">Два зала — заголовок</Label>
                            <Input value={(block.twoHallsTitle as string) ?? "Два зала"} onChange={(e) => updateSection(openSection, "twoHallsTitle", e.target.value)} />
                            <Label className="text-xs">Два зала — текст</Label>
                            <Input value={(block.twoHallsText as string) ?? "Амбианс — до 20 гостей, Гранд — до 80 гостей"} onChange={(e) => updateSection(openSection, "twoHallsText", e.target.value)} />
                          </div>
                          <div className="rounded-lg border border-white/30 bg-black/20 p-4 space-y-3">
                            <Label className="text-xs">Часы работы — заголовок</Label>
                            <Input value={(block.hoursTitle as string) ?? "Часы работы"} onChange={(e) => updateSection(openSection, "hoursTitle", e.target.value)} />
                            <Label className="text-xs">Часы работы — текст</Label>
                            <Input value={(block.hoursText as string) ?? "Ежедневно с 10:00 до 24:00"} onChange={(e) => updateSection(openSection, "hoursText", e.target.value)} />
                          </div>
                          <div className="rounded-lg border border-white/30 bg-black/20 p-4 space-y-3">
                            <Label className="text-xs">Телефон — заголовок</Label>
                            <Input value={(block.phoneTitle as string) ?? "Телефон для бронирования"} onChange={(e) => updateSection(openSection, "phoneTitle", e.target.value)} />
                            <Label className="text-xs">Телефоны (по одному на строку)</Label>
                            <Input value={((block.phones as string[]) || ["+7 (4752) 52-56-97", "+7 (915) 661-28-21"]).join("\n")} onChange={(e) => updateSection(openSection, "phones", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} className="h-auto min-h-[60px]" placeholder="+7 (4752) 52-56-97" />
                          </div>
                          <div className="rounded-lg border border-white/30 bg-black/20 p-4 space-y-3">
                            <Label className="text-xs">Вместимость — заголовок</Label>
                            <Input value={(block.capacityTitle as string) ?? "Вместимость"} onChange={(e) => updateSection(openSection, "capacityTitle", e.target.value)} />
                            <Label className="text-xs">Вместимость — текст</Label>
                            <Input value={(block.capacityText as string) ?? "До 80 гостей"} onChange={(e) => updateSection(openSection, "capacityText", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    )}
                    {openSection === "contacts" && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Подпись</Label>
                              <Input value={(block.label as string) ?? ""} onChange={(e) => updateSection(openSection, "label", e.target.value)} />
                            </div>
                            <ColorInput value={block.labelColor as string} onChange={(v) => updateSection(openSection, "labelColor", v)} defaultValue={DEFAULTS.primary} />
                          </div>
                          <div className="flex gap-2 items-stretch">
                            <div className="flex-1 space-y-2">
                              <Label>Заголовок</Label>
                              <Input value={(block.title as string) ?? ""} onChange={(e) => updateSection(openSection, "title", e.target.value)} />
                            </div>
                            <ColorInput value={block.titleColor as string} onChange={(v) => updateSection(openSection, "titleColor", v)} defaultValue={isHeroSection ? DEFAULTS.white : DEFAULTS.foreground} />
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
              <div className="flex gap-2 items-stretch">
                <div className="flex-1 space-y-2">
                  <Label>Слоган (под логотипом)</Label>
                  <Input value={(block.tagline as string) ?? ""} onChange={(e) => updateSection(openSection, "tagline", e.target.value)} />
                </div>
                <ColorInput value={block.taglineColor as string} onChange={(v) => updateSection(openSection, "taglineColor", v)} defaultValue={DEFAULTS.muted} />
              </div>
            )}
          </div>
        </div>
        )
      })()}
    </div>
  )
}
