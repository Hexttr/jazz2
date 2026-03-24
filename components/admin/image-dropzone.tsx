"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, getImageUrl, imageUnoptimized } from "@/lib/utils"

type Props = {
  value?: string
  onChange: (url: string) => void
  alt?: string
  className?: string
  disabled?: boolean
}

export function ImageDropzone({ value, onChange, alt = "", className, disabled }: Props) {
  const [drag, setDrag] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Выберите изображение (JPG, PNG, WebP)")
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Размер файла не должен превышать 8 МБ")
      return
    }
    setError("")
    setUploading(true)
    try {
      const form = new FormData()
      form.set("file", file)
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || "Ошибка загрузки")
        return
      }
      if (data.url) onChange(data.url)
    } catch {
      setError("Ошибка загрузки")
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDrag(false)
    if (disabled || uploading) return
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDrag(true)
  }

  function onDragLeave() {
    setDrag(false)
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative flex min-h-[140px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 transition-colors",
          drag && !disabled && "border-primary bg-primary/5",
          disabled && "opacity-60"
        )}
      >
        {value ? (
          <>
            <div className="relative h-[160px] w-full overflow-hidden rounded-lg">
              <Image
                src={getImageUrl(value)}
                alt={alt}
                fill
                className="object-contain p-2"
                unoptimized={imageUnoptimized(value)}
                sizes="320px"
              />
            </div>
            {!disabled && (
              <div className="absolute right-2 top-2 flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => onChange("")}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInput}
              disabled={disabled || uploading}
            />
            <Upload className="h-8 w-8" />
            <span>
              {uploading ? "Загрузка…" : "Перетащите изображение сюда или нажмите для выбора"}
            </span>
          </label>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
