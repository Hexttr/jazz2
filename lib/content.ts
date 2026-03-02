import { put, list, del } from "@vercel/blob"
import type { AppContent } from "./content-types"

const BLOB_KEY = "jazz-content.json"

async function readFromBlob(): Promise<AppContent | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null
  try {
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length === 0) return null
    const res = await fetch(blobs[0].url)
    if (!res.ok) return null
    return (await res.json()) as AppContent
  } catch {
    return null
  }
}

async function readFromFiles(): Promise<AppContent> {
  const path = await import("path")
  const fs = await import("fs/promises")
  const menuPath = path.join(process.cwd(), "data", "menu.json")
  const sectionsPath = path.join(process.cwd(), "data", "sections.json")
  const [menuBuf, sectionsBuf] = await Promise.all([
    fs.readFile(menuPath, "utf-8"),
    fs.readFile(sectionsPath, "utf-8"),
  ])
  return {
    menu: JSON.parse(menuBuf),
    sections: JSON.parse(sectionsBuf),
  }
}

export async function getContent(): Promise<AppContent> {
  const fromBlob = await readFromBlob()
  if (fromBlob) return fromBlob
  return await readFromFiles()
}

export async function putContent(content: AppContent): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "BLOB_READ_WRITE_TOKEN не задан. Добавьте в Vercel или экспортируйте JSON вручную." }
  }
  try {
    const { blobs } = await list({ prefix: BLOB_KEY })
    for (const b of blobs) await del(b.url)
    await put(BLOB_KEY, JSON.stringify(content, null, 2), {
      access: "public",
      contentType: "application/json",
    })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Ошибка сохранения" }
  }
}
