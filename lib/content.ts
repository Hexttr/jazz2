import type { AppContent } from "./content-types"
import { readFromMergedFile, readFromSeedFiles } from "./content-files"
import { kvGet, kvSet } from "./db-kv"
import { getDb } from "./db"

export type ContentSource = "database" | "merged" | "seed"

function parseAppContent(raw: string): AppContent | null {
  try {
    const v = JSON.parse(raw) as AppContent
    if (v?.menu && v?.sections) return v
    return null
  } catch {
    return null
  }
}

export async function getContent(): Promise<AppContent> {
  getDb()
  const raw = kvGet("app_content")
  const fromDb = raw ? parseAppContent(raw) : null
  if (fromDb) return fromDb

  const merged = await readFromMergedFile()
  if (merged) return merged
  return await readFromSeedFiles()
}

export async function getContentWithSource(): Promise<{ content: AppContent; source: ContentSource }> {
  getDb()
  const raw = kvGet("app_content")
  const fromDb = raw ? parseAppContent(raw) : null
  if (fromDb) return { content: fromDb, source: "database" }

  const merged = await readFromMergedFile()
  if (merged) return { content: merged, source: "merged" }
  const seed = await readFromSeedFiles()
  return { content: seed, source: "seed" }
}

export async function putContent(
  content: AppContent
): Promise<{ ok: boolean; writtenTo?: "database"; error?: string }> {
  try {
    getDb()
    kvSet("app_content", JSON.stringify(content))
    return { ok: true, writtenTo: "database" }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
