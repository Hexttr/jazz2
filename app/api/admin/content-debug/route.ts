import fs from "fs/promises"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { APP_CONTENT_FILE, DATA_DIR } from "@/lib/data-paths"
import { getDatabasePath } from "@/lib/db"
import { readJsonFile, writeJsonAtomic } from "@/lib/fs-json"

/**
 * Диагностика хранилища: SQLite (основное) + legacy JSON в data/.
 */
export const dynamic = "force-dynamic"

async function checkAuth(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  return token && (await verifySession(token))
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }

  const { content, source } = await import("@/lib/content").then((m) => m.getContentWithSource())
  const firstDish = content.menu?.dishes?.[0]
  let mergedFileExists = false
  try {
    await fs.access(APP_CONTENT_FILE)
    mergedFileExists = true
  } catch {
    mergedFileExists = false
  }
  const dbPath = getDatabasePath()
  const databasePathEnv = process.env.DATABASE_PATH?.trim() || null
  let databaseFileExists = false
  let databaseWalExists = false
  let databaseShmExists = false
  try {
    await fs.access(dbPath)
    databaseFileExists = true
  } catch {
    databaseFileExists = false
  }
  try {
    await fs.access(`${dbPath}-wal`)
    databaseWalExists = true
  } catch {
    databaseWalExists = false
  }
  try {
    await fs.access(`${dbPath}-shm`)
    databaseShmExists = true
  } catch {
    databaseShmExists = false
  }
  return NextResponse.json({
    storage: "sqlite",
    /** Полный путь к файлу SQLite на сервере (учитывает DATABASE_PATH). */
    databasePath: dbPath,
    databasePathFromEnv: databasePathEnv,
    databaseFileExists,
    databaseWalExists,
    databaseShmExists,
    /** process.cwd() приложения — база для относительных путей. */
    appCwd: process.cwd(),
    dataDir: DATA_DIR,
    mergedContentFile: APP_CONTENT_FILE,
    mergedFileExists,
    source,
    dishesCount: content.menu?.dishes?.length ?? 0,
    categoriesCount: content.menu?.categories?.length ?? 0,
    firstDishName: firstDish?.name ?? null,
  })
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }

  const testPath = `${DATA_DIR}/.write-test-${Date.now()}.tmp`
  const testValue = `ok-${Date.now()}`
  try {
    await writeJsonAtomic(testPath, { v: testValue })
    const read = await readJsonFile<{ v: string }>(testPath)
    await fs.unlink(testPath).catch(() => {})
    const verified = read?.v === testValue
    return NextResponse.json({
      saved: true,
      verified,
      hint: verified ? "Запись и чтение в data/ работают" : "Файл записан, но прочитано другое значение",
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg, saved: false }, { status: 500 })
  }
}
