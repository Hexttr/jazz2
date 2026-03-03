import { NextRequest, NextResponse } from "next/server"
import { getContent, putContent } from "@/lib/content"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import type { AppContent } from "@/lib/content-types"

export async function GET() {
  try {
    const content = await getContent()
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    })
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
    } as AppContent
    const result = await putContent(next)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    // Верификация: сразу читаем обратно
    const readBack = await getContent()
    const nextMenu = next.menu as { dishes?: { name?: string }[] }
    const nextSections = next.sections as Record<string, { title?: string }>
    const menuVerified =
      body.menu == null ||
      (readBack.menu?.dishes?.length === nextMenu?.dishes?.length &&
        readBack.menu?.dishes?.[0]?.name === nextMenu?.dishes?.[0]?.name)
    const sectionsVerified =
      body.sections == null ||
      readBack.sections?.hero?.title === nextSections?.hero?.title
    const verified = menuVerified && sectionsVerified
    return NextResponse.json({
      success: true,
      verified,
      ...(!verified && {
        debug: {
          menuVerified,
          sectionsVerified,
          savedFirstDish: nextMenu?.dishes?.[0]?.name,
          readBackFirstDish: readBack.menu?.dishes?.[0]?.name,
        },
      }),
    })
  } catch (e) {
    console.error(e)
    const msg = e instanceof Error ? e.message : "Ошибка сохранения"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
