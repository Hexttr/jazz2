import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Преобразует приватный Blob URL в прокси-URL для отображения */
export function getImageUrl(url: string | undefined | null): string {
  if (!url?.startsWith("http")) return url ?? ""
  if (url.includes("private.blob.vercel-storage.com")) {
    return `/api/blob?url=${encodeURIComponent(url)}`
  }
  return url
}
