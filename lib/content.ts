import type { AppContent } from "./content-types"
import { APP_CONTENT_FILE } from "./data-paths"
import { readJsonFile, writeJsonAtomic } from "./fs-json"

async function readFromMergedFile(): Promise<AppContent | null> {
  return readJsonFile<AppContent>(APP_CONTENT_FILE)
}

async function readFromSeedFiles(): Promise<AppContent> {
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

export type ContentSource = "merged" | "seed"

export async function getContent(): Promise<AppContent> {
  const merged = await readFromMergedFile()
  if (merged) return merged
  return await readFromSeedFiles()
}

export async function getContentWithSource(): Promise<{ content: AppContent; source: ContentSource }> {
  const merged = await readFromMergedFile()
  if (merged) return { content: merged, source: "merged" }
  const seed = await readFromSeedFiles()
  return { content: seed, source: "seed" }
}

export async function putContent(
  content: AppContent
): Promise<{ ok: boolean; writtenTo?: "local"; error?: string }> {
  try {
    await writeJsonAtomic(APP_CONTENT_FILE, content)
    return { ok: true, writtenTo: "local" }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
