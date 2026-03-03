import { put, list, get } from "@vercel/blob"
import type { AppContent } from "./content-types"
import { getRedis } from "./redis"

const BLOB_KEY = "jazz-content.json"
const REDIS_KEY = "jazz:content"

async function readFromRedis(): Promise<AppContent | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    const raw = await redis.get<string>(REDIS_KEY)
    if (typeof raw !== "string") return null
    return JSON.parse(raw) as AppContent
  } catch {
    return null
  }
}

async function readFromBlob(): Promise<AppContent | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return null
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token })
    if (blobs.length === 0) return null
    const result = await get(blobs[0].pathname, { access: "private", token })
    if (!result || result.statusCode !== 200 || !result.stream) return null
    const text = await new Response(result.stream).text()
    return JSON.parse(text) as AppContent
  } catch {
    return null
  }
}

async function readFromFiles(): Promise<AppContent> {
  const path = await import("path")
  const fs = await import("fs/promises")
  const menuPath = path.join(process.cwd(), "data", "menu.json")
  const sectionsPath = path.join(process.cwd(), "data", "sections.json")
  try {
    const [menuBuf, sectionsBuf] = await Promise.all([
      fs.readFile(menuPath, "utf-8"),
      fs.readFile(sectionsPath, "utf-8"),
    ])
    return {
      menu: JSON.parse(menuBuf) as AppContent["menu"],
      sections: JSON.parse(sectionsBuf) as AppContent["sections"],
    }
  } catch (e) {
    console.error("[content] readFromFiles failed:", e)
    return {
      menu: { categories: [], dishes: [] },
      sections: {},
    }
  }
}

export async function getContent(): Promise<AppContent> {
  const fromRedis = await readFromRedis()
  if (fromRedis) return fromRedis
  const fromBlob = await readFromBlob()
  if (fromBlob) return fromBlob
  return await readFromFiles()
}

export async function putContent(content: AppContent): Promise<{ ok: boolean; error?: string }> {
  const redis = getRedis()
  if (redis) {
    try {
      await redis.set(REDIS_KEY, JSON.stringify(content))
      return { ok: true }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return { ok: false, error: msg }
    }
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return {
      ok: false,
      error:
        "Настройте хранилище: в Vercel добавьте Redis (Storage → Connect Store → Upstash Redis) или задайте BLOB_READ_WRITE_TOKEN.",
    }
  }
  try {
    await put(BLOB_KEY, JSON.stringify(content, null, 2), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
      token,
    })
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
