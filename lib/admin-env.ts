import fs from "fs"
import path from "path"

/**
 * Хеш пароля для админки. Берём из process.env; если пусто (Turbopack заинлайнил
 * пустое значение при сборке) — читаем строку из `.env` на диске.
 */
export function getAdminPasswordHash(): string {
  let raw = process.env.ADMIN_PASSWORD_HASH?.trim() ?? ""
  if (!raw) {
    try {
      const envPath = path.join(process.cwd(), ".env")
      const txt = fs.readFileSync(envPath, "utf-8")
      const line = txt.split(/\r?\n/).find((l) => l.trim().startsWith("ADMIN_PASSWORD_HASH="))
      if (line) {
        raw = line.split("=", 2)[1]?.trim() ?? ""
      }
    } catch {
      /* no .env */
    }
  }
  return raw.replace(/^["']|["']$/g, "")
}
