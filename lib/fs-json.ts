import fs from "fs/promises"
import path from "path"

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const buf = await fs.readFile(filePath, "utf-8")
    return JSON.parse(buf) as T
  } catch (e) {
    const err = e as NodeJS.ErrnoException
    if (err.code === "ENOENT") return null
    throw e
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

/** Атомарная запись JSON (rename поверх существующего файла). */
export async function writeJsonAtomic(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath))
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(tmp, json, "utf-8")
  await fs.rename(tmp, filePath)
}
