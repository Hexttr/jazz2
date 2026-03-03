import { put, get } from "@vercel/blob"
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
    const result = await get(BLOB_KEY, { access: "private", useCache: false, token })
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
  const [menuBuf, sectionsBuf] = await Promise.all([
    fs.readFile(menuPath, "utf-8"),
    fs.readFile(sectionsPath, "utf-8"),
  ])
  return {
    menu: JSON.parse(menuBuf) as AppContent["menu"],
    sections: JSON.parse(sectionsBuf) as AppContent["sections"],
  }
}

export async function getContent(): Promise<AppContent> {
  const fromRedis = await readFromRedis()
  if (fromRedis) return fromRedis
  const fromBlob = await readFromBlob()
  if (fromBlob) return fromBlob
  return await readFromFiles()
}

export async function getContentWithSource(): Promise<{ content: AppContent; source: "redis" | "blob" | "files" }> {
  const fromRedis = await readFromRedis()
  if (fromRedis) return { content: fromRedis, source: "redis" }
  const fromBlob = await readFromBlob()
  if (fromBlob) return { content: fromBlob, source: "blob" }
  const fromFiles = await readFromFiles()
  return { content: fromFiles, source: "files" }
}

export async function putContent(content: AppContent): Promise<{ ok: boolean; writtenTo?: "redis" | "blob" | "both"; error?: string }> {
  const redis = getRedis()
  const json = JSON.stringify(content)
  let wroteRedis = false
  let wroteBlob = false

  if (redis) {
    try {
      await redis.set(REDIS_KEY, json)
      wroteRedis = true
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return { ok: false, error: `Redis: ${msg}` }
    }
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token) {
    try {
      await put(BLOB_KEY, JSON.stringify(content, null, 2), {
        access: "private",
        contentType: "application/json",
        allowOverwrite: true,
        cacheControlMaxAge: 60,
        token,
      })
      wroteBlob = true
    } catch (e) {
      if (!wroteRedis) {
        const msg = e instanceof Error ? e.message : String(e)
        return { ok: false, error: `Blob: ${msg}` }
      }
    }
  }

  if (!wroteRedis && !wroteBlob) {
    return {
      ok: false,
      error:
        "Настройте хранилище: UPSTASH_REDIS_REST_URL/TOKEN или BLOB_READ_WRITE_TOKEN в Vercel.",
    }
  }
  return {
    ok: true,
    writtenTo: wroteRedis && wroteBlob ? "both" : wroteRedis ? "redis" : "blob",
  }
}
