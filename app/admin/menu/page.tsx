"use client"

import { useState, useEffect } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [editingDish, setEditingDish] = useState<MenuDish | null>(null)
  const [addingDishTo, setAddingDishTo] = useState<string | null>(null)

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
      const data = await res.json().catch(() => ({}))
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
    const remaining = menu.categories.filter((c) => c.id !== id)
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
    setMenu((m) =>
      m ? { ...m, dishes: [...m.dishes, dish] } : m
    )
    setAddingDishTo(null)
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Категории</CardTitle>
          <Button size="sm" variant="outline" onClick={addCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить категорию
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-lg border border-border bg-muted/20"
            >
              <div
                className="flex cursor-pointer items-center justify-between px-4 py-3"
                onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              >
                <div className="flex items-center gap-2">
                  {openCategory === cat.id ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({menu.dishes.filter((d) => d.categoryId === cat.id).length} блюд)
                  </span>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setEditingCategory(cat)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {openCategory === cat.id && (
                <div className="border-t border-border bg-background/50 p-4">
                  <div className="mb-3 flex justify-end">
                    <Button size="sm" onClick={() => addDish(cat.id)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить блюдо
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {menu.dishes
                      .filter((d) => d.categoryId === cat.id)
                      .map((d) => (
                        <li
                          key={d.id}
                          className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                        >
                          <span className="truncate">{d.name}</span>
                          <span className="text-muted-foreground">{d.price} ₽</span>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => setEditingDish(d)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteDish(d.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

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
