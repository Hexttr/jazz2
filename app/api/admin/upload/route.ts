import { NextRequest, NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Загрузка файлов не настроена (BLOB_READ_WRITE_TOKEN)" },
      { status: 503 }
    )
  }

  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }

  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 })
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        const ext = pathname.includes(".")
          ? pathname.slice(pathname.lastIndexOf(".")).toLowerCase()
          : ".jpg"
        if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
          throw new Error("Разрешены только изображения (JPEG, PNG, WebP, GIF)")
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: true,
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Blob upload error:", error)
    const message = error instanceof Error ? error.message : "Ошибка загрузки"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
