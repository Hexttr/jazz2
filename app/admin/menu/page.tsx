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
import { cn } from "@/lib/utils"

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function getCategoryImage(dishes: MenuDish[], categoryId: string): string | undefined {
  const withImage = dishes.filter((d) => d.categoryId === categoryId && d.image)
  if (withImage.length === 0) return undefined
  return withImage[Math.floor(Math.random() * withImage.length)].image
}

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [editingDish, setEditingDish] = useState<MenuDish | null>(null)

  useEffect(() => {
    fetch("/api/content", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.menu) setMenu(data.menu)
        if (data.menu?.categories?.length) setOpenCategory(data.menu.categories[0].id)
      })
      .catch(() => setMenu({ categories: [], dishes: [] }))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!menu) return
    setSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ menu }),
      })
      if (res.ok) setSaveMessage("success")
      else setSaveMessage("error")
    } catch {
      setSaveMessage("error")
    } finally {
      setSaving(false)
    }
  }

  function addCategory() {
    const id = "cat-" + newId()
    setMenu((m) =>
      m
        ? {
            ...m,
            categories: [...m.categories, { id, name: "Новая категория", order: m.categories.length }],
            dishes: m.dishes,
          }
        : m
    )
    setOpenCategory(id)
    setEditingCategory({ id, name: "Новая категория", order: 0 })
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
    setMenu((m) => (m ? { ...m, dishes: [...m.dishes, dish] } : m))
    setEditingDish(dish)
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-sans text-2xl font-bold tracking-wide">Меню и блюда</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Категория
          </Button>
          <Button onClick={save} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
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

      {/* Category cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const dishCount = menu.dishes.filter((d) => d.categoryId === cat.id).length
          const cardImage = getCategoryImage(menu.dishes, cat.id)
          const isOpen = openCategory === cat.id
          return (
            <div
              key={cat.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div
                className="relative aspect-[16/10] cursor-pointer overflow-hidden bg-muted"
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
              >
                {cardImage ? (
                  <Image
                    src={cardImage}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={cardImage.startsWith("http")}
                    sizes="400px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground/50">
                    <span className="text-sm uppercase tracking-widest">Нет фото</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-sans text-lg font-semibold text-white">{cat.name}</h3>
                    <p className="text-xs text-white/80">{dishCount} блюд</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white/20 p-1.5">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
                <div
                  className="absolute right-2 top-2 flex gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                    onClick={() => setEditingCategory(cat)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded: dishes grid */}
              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="min-h-0">
                  <div className="border-t border-border bg-muted/20 p-4">
                    <div className="mb-4 flex justify-end">
                      <Button size="sm" onClick={() => addDish(cat.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить блюдо
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {menu.dishes
                        .filter((d) => d.categoryId === cat.id)
                        .map((d) => (
                          <article
                            key={d.id}
                            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-primary/50"
                          >
                            <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-t-2xl bg-muted">
                              {d.image ? (
                                <Image
                                  src={d.image}
                                  alt={d.name}
                                  fill
                                  className="object-cover"
                                  unoptimized={d.image.startsWith("http")}
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
                              <p className="mt-2 font-sans text-base font-bold text-primary">
                                {d.price} ₽
                              </p>
                              <div className="mt-2 flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs"
                                  onClick={() => setEditingDish(d)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => deleteDish(d.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </article>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

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
