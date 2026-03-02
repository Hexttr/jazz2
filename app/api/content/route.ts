import { NextRequest, NextResponse } from "next/server"
import { getContent, putContent } from "@/lib/content"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"

export async function GET() {
  try {
    const content = await getContent()
    return NextResponse.json(content)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }
  let body: { menu?: unknown; sections?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Неверный JSON" }, { status: 400 })
  }
  try {
    const current = await getContent()
    const next = {
      menu: body.menu ?? current.menu,
      sections: body.sections ?? current.sections,
    }
    const result = await putContent(next)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 })
  }
}
