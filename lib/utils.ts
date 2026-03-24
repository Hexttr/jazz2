import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Внешние URL и загрузки в /uploads — без оптимизатора Next Image. */
export function getImageUrl(url: string | undefined | null): string {
  return url ?? ""
}

export function imageUnoptimized(src: string): boolean {
  return src.startsWith("http") || src.startsWith("/uploads")
}
