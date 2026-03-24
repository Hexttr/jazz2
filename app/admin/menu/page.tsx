"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ImageDropzone } from "@/components/admin/image-dropzone"
import type { MenuCategory, MenuDish, MenuContent } from "@/lib/content-types"
import { cn, getImageUrl, imageUnoptimized } from "@/lib/utils"

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function getCategoryImage(dishes: MenuDish[], categoryId: string): string | undefined {
  const withImage = dishes.filter((d) => d.categoryId === categoryId && d.image)
  if (withImage.length === 0) return undefined
  return withImage[0].image
}

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null)
  const [saveErrorText, setSaveErrorText] = useState<string>("")
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [editingDish, setEditingDish] = useState<MenuDish | null>(null)

  function loadContent() {
    return fetch(`/api/content?_=${Date.now()}`, { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.menu) setMenu(data.menu)
      })
      .catch(() => setMenu((m) => m ?? { categories: [], dishes: [] }))
  }

  useEffect(() => {
    loadContent().finally(() => setLoading(false))
  }, [])

  async function save(menuOverride?: MenuContent) {
    const baseMenu = menuOverride ?? menu
    if (!baseMenu) return
    setSaving(true)
    setSaveMessage(null)
    setSaveErrorText("")
    // Включаем незавершённые правки из диалогов (если пользователь нажал Сохранить без Готово)
    let dataToSave = baseMenu
    if (editingDish) {
      dataToSave = {
        ...dataToSave,
        dishes: dataToSave.dishes.map((d) =>
          d.id === editingDish.id ? { ...d, ...editingDish } : d
        ),
      }
    }
    if (editingCategory) {
      dataToSave = {
        ...dataToSave,
        categories: dataToSave.categories.map((c) =>
          c.id === editingCategory.id ? { ...c, ...editingCategory } : c
        ),
      }
    }
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ menu: dataToSave }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSaveMessage("success")
        loadContent()
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

  function addCategory() {
    const id = "cat-" + newId()
    const newCat = { id, name: "Новая категория", order: menu?.categories.length ?? 0 }
    const newMenu = menu
      ? { ...menu, categories: [...menu.categories, newCat], dishes: menu.dishes }
      : null
    if (newMenu) {
      setMenu(newMenu)
      setOpenCategory(id)
      setEditingCategory(newCat)
      save(newMenu)
    }
  }

  function updateCategory(id: string, patch: Partial<MenuCategory>) {
    setMenu((m) =>
      m
        ? {
            ...m,
            categories: m.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          }
        : m
    )
  }

  function deleteCategory(id: string) {
    const remaining = menu!.categories.filter((c) => c.id !== id)
    setMenu((m) =>
      m
        ? {
            categories: remaining,
            dishes: m.dishes.filter((d) => d.categoryId !== id),
          }
        : m
    )
    if (openCategory === id) setOpenCategory(remaining[0]?.id ?? null)
    setEditingCategory(null)
  }

  function addDish(categoryId: string) {
    const id = "dish-" + newId()
    const dish: MenuDish = {
      id,
      categoryId,
      name: "Новое блюдо",
      description: "",
      price: "",
    }
    const newMenu = menu ? { ...menu, dishes: [...menu.dishes, dish] } : null
    if (newMenu) {
      setMenu(newMenu)
      setEditingDish(dish)
      save(newMenu)
    }
  }

  function updateDish(id: string, patch: Partial<MenuDish>) {
    setMenu((m) =>
      m
        ? { ...m, dishes: m.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)) }
        : m
    )
  }

  function deleteDish(id: string) {
    setMenu((m) => (m ? { ...m, dishes: m.dishes.filter((d) => d.id !== id) } : m))
    setEditingDish(null)
  }

  if (loading || !menu) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    )
  }

  const categories = menu.categories.slice().sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-white/15 bg-background/80 px-4 py-4 backdrop-blur-xl md:-mx-8 md:px-8 md:py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-wide">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            Меню и блюда
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addCategory} className="border-white/30">
              <Plus className="mr-2 h-4 w-4" />
              Категория
            </Button>
            <Button size="sm" onClick={() => save()} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
        {saveMessage === "success" && (
          <p className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-500">
            Изменения сохранены.
          </p>
        )}
        {saveMessage === "error" && (
          <div className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <p className="font-medium">Не удалось сохранить.</p>
            {saveErrorText && <p className="mt-1 opacity-80">{saveErrorText}</p>}
          </div>
        )}
      </div>

      {/* Category cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pt-4">
        {categories.map((cat) => {
          const dishCount = menu.dishes.filter((d) => d.categoryId === cat.id).length
          const cardImage = getCategoryImage(menu.dishes, cat.id)
          const isOpen = openCategory === cat.id
          return (
            <div
              key={cat.id}
              className={cn(
                "group overflow-hidden rounded-xl border bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                isOpen ? "ring-2 ring-primary border-primary" : "border-white/20"
              )}
            >
              <div
                className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-muted"
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
              >
                {cardImage ? (
                  <Image
                    src={getImageUrl(cardImage)}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={imageUnoptimized(cardImage)}
                    sizes="180px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground/50">
                    <span className="text-[10px] uppercase tracking-widest">Нет фото</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-sans text-sm font-semibold text-white">{cat.name}</h3>
                    <p className="text-[10px] text-white/80">{dishCount} блюд</p>
                  </div>
                  <div className="shrink-0 rounded-full bg-white/20 p-1">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-white" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
                <div
                  className="absolute right-1 top-1 flex gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="icon"
                    className="h-6 w-6 bg-primary text-black hover:bg-primary/90 hover:text-black"
                    onClick={() => setEditingCategory(cat)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-6 w-6 text-white"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Блюда выбранной категории — под карточками */}
      {openCategory && (
        <div className="rounded-xl border border-white/20 bg-card/60 p-5 backdrop-blur-sm">
          {(() => {
            const cat = categories.find((c) => c.id === openCategory)
            const dishes = menu.dishes.filter((d) => d.categoryId === openCategory)
            return (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-sans text-lg font-semibold">
                    Блюда: {cat?.name ?? ""}
                  </h2>
                  <Button size="sm" onClick={() => addDish(openCategory)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить блюдо
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {dishes.map((d) => (
                    <article
                      key={d.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-white/20 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-muted">
                        {d.image ? (
                          <Image
                            src={getImageUrl(d.image)}
                            alt={d.name}
                            fill
                            className="object-cover"
                            unoptimized={imageUnoptimized(d.image)}
                            sizes="200px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground/40 text-xs uppercase">
                            {d.name}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col border-t border-border p-3">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="line-clamp-2 text-sm font-semibold">{d.name}</h4>
                          {d.portion && (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {d.portion}
                            </span>
                          )}
                        </div>
                        {d.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {d.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="font-sans text-base font-bold text-primary shrink-0">
                            {d.price} ₽
                          </p>
                          <div className="flex gap-0.5 shrink-0">
                            <Button
                              size="icon"
                              className="h-6 w-6 bg-primary text-black hover:bg-primary/90 hover:text-black"
                              onClick={() => setEditingDish(d)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-6 w-6 text-white"
                              onClick={() => deleteDish(d.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* Category edit dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать категорию</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory((c) => (c ? { ...c, name: e.target.value } : c))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Порядок (0, 1, 2…)</Label>
                <Input
                  type="number"
                  value={editingCategory.order}
                  onChange={(e) =>
                    setEditingCategory((c) =>
                      c ? { ...c, order: parseInt(e.target.value, 10) || 0 } : c
                    )
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (editingCategory) {
                  updateCategory(editingCategory.id, {
                    name: editingCategory.name,
                    order: editingCategory.order,
                  })
                  setEditingCategory(null)
                }
              }}
            >
              Готово
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dish edit dialog */}
      <Dialog open={!!editingDish} onOpenChange={() => setEditingDish(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Редактировать блюдо</DialogTitle>
          </DialogHeader>
          {editingDish && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={editingDish.name}
                  onChange={(e) =>
                    setEditingDish((d) => (d ? { ...d, name: e.target.value } : d))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Input
                  value={editingDish.description}
                  onChange={(e) =>
                    setEditingDish((d) => (d ? { ...d, description: e.target.value } : d))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Порция</Label>
                  <Input
                    value={editingDish.portion ?? ""}
                    onChange={(e) =>
                      setEditingDish((d) => (d ? { ...d, portion: e.target.value } : d))
                    }
                    placeholder="1/200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Цена, ₽</Label>
                  <Input
                    value={editingDish.price}
                    onChange={(e) =>
                      setEditingDish((d) => (d ? { ...d, price: e.target.value } : d))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Изображение</Label>
                <ImageDropzone
                  value={editingDish.image}
                  onChange={(url) =>
                    setEditingDish((d) => (d ? { ...d, image: url } : d))
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (editingDish) {
                  updateDish(editingDish.id, {
                    name: editingDish.name,
                    description: editingDish.description,
                    portion: editingDish.portion || undefined,
                    price: editingDish.price,
                    image: editingDish.image,
                  })
                  setEditingDish(null)
                }
              }}
            >
              Готово
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
