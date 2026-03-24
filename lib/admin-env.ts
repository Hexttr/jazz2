import fs from "fs"
import path from "path"

/**
 * Хеш пароля для админки. Сначала читаем `.env` на диске: иначе при `next build`
 * Next подставляет в бандл значение `process.env.ADMIN_PASSWORD_HASH` на момент сборки,
 * и смена `.env` без пересборки не меняет пароль.
 */
export function getAdminPasswordHash(): string {
  try {
    const envPath = path.join(process.cwd(), ".env")
    const txt = fs.readFileSync(envPath, "utf-8")
    const line = txt.split(/\r?\n/).find((l) => l.trim().startsWith("ADMIN_PASSWORD_HASH="))
    if (line) {
      const raw = line.split("=", 2)[1]?.trim() ?? ""
      return raw.replace(/^["']|["']$/g, "")
    }
  } catch {
    /* no .env */
  }
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim() ?? ""
  return raw.replace(/^["']|["']$/g, "")
}
