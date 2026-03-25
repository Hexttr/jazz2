import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Приводит путь к картинке к абсолютному от корня сайта.
 * Иначе строка вида `uploads/foo.png` или `файл.png` на странице `/admin/...`
 * превращается в относительный URL и браузер запрашивает `/admin/uploads/...` → 404.
 */
export function getImageUrl(url: string | undefined | null): string {
  if (url == null || url === "") return ""
  const u = String(url).trim()
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  if (u.startsWith("/")) return u
  if (u.startsWith("uploads/")) return `/${u}`
  // Только имя файла после загрузки (без префикса)
  if (/^[a-z0-9_.-]+\.(png|jpe?g|webp|gif)$/i.test(u)) return `/uploads/${u}`
  return `/${u.replace(/^\/+/, "")}`
}

export function imageUnoptimized(src: string): boolean {
  const u = getImageUrl(src)
  return (
    u.startsWith("http://") ||
    u.startsWith("https://") ||
    u.startsWith("/uploads")
  )
}
