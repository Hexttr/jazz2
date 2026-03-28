import fs from "fs"
import path from "path"
import Database from "better-sqlite3"
import { DATA_DIR } from "./data-paths"
import { runMigrations } from "./db-migrate"

let _db: Database.Database | null = null

/** Путь к файлу SQLite: по умолчанию data/app.db; можно вынести вне каталога деплоя (DATABASE_PATH). */
export function getDatabasePath(): string {
  const fromEnv = process.env.DATABASE_PATH?.trim()
  if (fromEnv) {
    return path.isAbsolute(fromEnv) ? fromEnv : path.join(process.cwd(), fromEnv)
  }
  return path.join(DATA_DIR, "app.db")
}

export function getDb(): Database.Database {
  if (_db) return _db
  const dbPath = getDatabasePath()
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const db = new Database(dbPath)
  db.pragma("journal_mode = WAL")
  db.exec(`
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    )
  `)
  runMigrations(db)
  _db = db
  return _db
}
