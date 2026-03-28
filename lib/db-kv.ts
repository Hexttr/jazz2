import { getDb } from "./db"

export function kvGet(key: string): string | null {
  const db = getDb()
  const row = db.prepare("SELECT value FROM kv WHERE key = ?").get(key) as { value: string } | undefined
  return row?.value ?? null
}

export function kvSet(key: string, value: string): void {
  const db = getDb()
  db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(key, value)
}
