import path from "path"
import fs from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { UPLOADS_DIR } from "@/lib/data-paths"
import { ensureDir } from "@/lib/fs-json"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8 MB (свой сервер)

export async function POST(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Нет файла" }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Разрешены только изображения (JPEG, PNG, WebP, GIF)" },
      { status: 400 }
    )
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Размер файла не должен превышать 8 МБ" },
      { status: 400 }
    )
  }
  const name = file.name || "image"
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : ".jpg"
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`
  try {
    await ensureDir(UPLOADS_DIR)
    const buffer = Buffer.from(await file.arrayBuffer())
    const diskPath = path.join(UPLOADS_DIR, filename)
    await fs.writeFile(diskPath, buffer)
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (e) {
    console.error("Upload error:", e)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}
