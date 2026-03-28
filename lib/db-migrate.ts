import fs from "fs"
import path from "path"
import Database from "better-sqlite3"
import type { AppContent } from "./content-types"
import {
  APP_CONTENT_FILE,
  DATA_DIR,
  RESERVATIONS_FILE,
  TELEGRAM_SETTINGS_FILE,
} from "./data-paths"

const K_APP = "app_content"
const K_RES = "reservations"
const K_TG = "telegram"

function readFileJson<T>(filePath: string): T | null {
  try {
    const buf = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(buf) as T
  } catch {
    return null
  }
}

function mergedFromFiles(): AppContent | null {
  const merged = readFileJson<AppContent>(APP_CONTENT_FILE)
  if (merged?.menu && merged?.sections) return merged
  return null
}

function seedFromFiles(): AppContent | null {
  try {
    const menuPath = path.join(DATA_DIR, "menu.json")
    const sectionsPath = path.join(DATA_DIR, "sections.json")
    const menuBuf = fs.readFileSync(menuPath, "utf-8")
    const sectionsBuf = fs.readFileSync(sectionsPath, "utf-8")
    return {
      menu: JSON.parse(menuBuf) as AppContent["menu"],
      sections: JSON.parse(sectionsBuf) as AppContent["sections"],
    }
  } catch {
    return null
  }
}

/**
 * Однократный перенос из legacy JSON в SQLite, если ключей ещё нет.
 */
export function runMigrations(db: InstanceType<typeof Database>): void {
  const get = (key: string): string | null => {
    const row = db.prepare("SELECT value FROM kv WHERE key = ?").get(key) as { value: string } | undefined
    return row?.value ?? null
  }
  const set = (key: string, value: string): void => {
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(key, value)
  }

  if (!get(K_APP)) {
    const merged = mergedFromFiles()
    if (merged) {
      set(K_APP, JSON.stringify(merged))
    } else {
      const seed = seedFromFiles()
      if (seed) set(K_APP, JSON.stringify(seed))
    }
  }

  if (!get(K_RES)) {
    const fromFile = readFileJson<unknown[]>(RESERVATIONS_FILE)
    set(K_RES, JSON.stringify(Array.isArray(fromFile) ? fromFile : []))
  }

  if (!get(K_TG)) {
    const fromFile = readFileJson<{ telegramId?: string }>(TELEGRAM_SETTINGS_FILE)
    set(K_TG, JSON.stringify({ telegramId: typeof fromFile?.telegramId === "string" ? fromFile.telegramId : "" }))
  }
}
