import path from "path"
import { APP_CONTENT_FILE, DATA_DIR } from "./data-paths"
import type { AppContent } from "./content-types"
import { readJsonFile } from "./fs-json"

export async function readFromMergedFile(): Promise<AppContent | null> {
  return readJsonFile<AppContent>(APP_CONTENT_FILE)
}

export async function readFromSeedFiles(): Promise<AppContent> {
  const fs = await import("fs/promises")
  const menuPath = path.join(DATA_DIR, "menu.json")
  const sectionsPath = path.join(DATA_DIR, "sections.json")
  const [menuBuf, sectionsBuf] = await Promise.all([
    fs.readFile(menuPath, "utf-8"),
    fs.readFile(sectionsPath, "utf-8"),
  ])
  return {
    menu: JSON.parse(menuBuf) as AppContent["menu"],
    sections: JSON.parse(sectionsBuf) as AppContent["sections"],
  }
}
