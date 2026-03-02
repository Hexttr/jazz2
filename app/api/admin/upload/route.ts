import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Загрузка файлов не настроена (BLOB_READ_WRITE_TOKEN)" }, { status: 503 })
  }
  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Нет файла" }, { status: 400 })
  }
  const name = file.name || "image"
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : ".jpg"
  const filename = `jazz/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type || "image/jpeg",
    })
    return NextResponse.json({ url: blob.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}
