import path from "path"
import fs from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { UPLOADS_DIR } from "@/lib/data-paths"
import { ensureDir } from "@/lib/fs-json"

export const runtime = "nodejs"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8 MB

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
}

function effectiveMime(file: File): string {
  const t = file.type?.trim()
  if (t && ALLOWED_TYPES.includes(t)) return t
  const name = file.name || ""
  const dot = name.lastIndexOf(".")
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : ""
  return EXT_TO_MIME[ext] ?? t ?? ""
}

export async function POST(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Некорректные данные формы" }, { status: 400 })
  }

  const file = formData.get("file")
  if (!file || typeof (file as Blob).arrayBuffer !== "function") {
    return NextResponse.json({ error: "Нет файла" }, { status: 400 })
  }

  const blob = file as File
  const mime = effectiveMime(blob)
  if (!mime || !ALLOWED_TYPES.includes(mime)) {
    return NextResponse.json(
      {
        error:
          "Разрешены только изображения JPEG, PNG, WebP, GIF (если браузер не передал тип файла, сохраните фото с расширением .jpg/.png)",
      },
      { status: 400 }
    )
  }

  if (blob.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Размер файла не должен превышать 8 МБ" },
      { status: 400 }
    )
  }

  const name = blob.name || "image"
  const extFromName = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : ""
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extFromName)
    ? extFromName
    : mime === "image/png"
      ? ".png"
      : mime === "image/webp"
        ? ".webp"
        : mime === "image/gif"
          ? ".gif"
          : ".jpg"

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`

  try {
    await ensureDir(UPLOADS_DIR)
    const buffer = Buffer.from(await blob.arrayBuffer())
    const diskPath = path.join(UPLOADS_DIR, filename)
    await fs.writeFile(diskPath, buffer, { mode: 0o664 })
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (e) {
    console.error("Upload error:", e)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}
