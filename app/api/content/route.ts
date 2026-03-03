import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getContent, getContentWithSource, putContent } from "@/lib/content"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { getRedis } from "@/lib/redis"
import type { AppContent } from "@/lib/content-types"

export async function GET() {
  try {
    const { content, source } = await getContentWithSource()
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "X-Content-Source": source,
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
    const redis = getRedis()
    const readBackDirect = redis ? await redis.get<string>("jazz:content") : null
    revalidatePath("/")
    // Верификация: читаем обратно с повтором (eventual consistency у Blob/Redis)
    let readBack: Awaited<ReturnType<typeof getContentWithSource>>["content"] | null = null
    let source: "redis" | "blob" | "files" = "files"
    const nextMenu = next.menu as { dishes?: { name?: string }[] }
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await getContentWithSource()
      readBack = res.content
      source = res.source
      const menuMatch =
        body.menu == null ||
        (readBack.menu?.dishes?.length === nextMenu?.dishes?.length &&
          readBack.menu?.dishes?.[0]?.name === nextMenu?.dishes?.[0]?.name)
      if (menuMatch) break
      if (attempt < 2) await new Promise((r) => setTimeout(r, 600))
    }
    const nextSections = next.sections as Record<string, { title?: string }>
    const menuVerified =
      body.menu == null ||
      (readBack?.menu?.dishes?.length === nextMenu?.dishes?.length &&
        readBack?.menu?.dishes?.[0]?.name === nextMenu?.dishes?.[0]?.name)
    const sectionsVerified =
      body.sections == null ||
      readBack?.sections?.hero?.title === nextSections?.hero?.title
    const verified = menuVerified && sectionsVerified
    let directFirstDish: string | null = null
    if (typeof readBackDirect === "string") {
      try {
        const parsed = JSON.parse(readBackDirect) as { menu?: { dishes?: { name?: string }[] } }
        directFirstDish = parsed?.menu?.dishes?.[0]?.name ?? null
      } catch {
        /* ignore */
      }
    }
    return NextResponse.json({
      success: true,
      verified,
      source,
      writtenTo: result.writtenTo,
      redisConfiguredInPost: redis !== null,
      directFirstDish: directFirstDish,
      firstDishAfterSave: readBack?.menu?.dishes?.[0]?.name ?? null,
      ...(!verified && {
        debug: {
          menuVerified,
          sectionsVerified,
          savedFirstDish: nextMenu?.dishes?.[0]?.name,
          readBackFirstDish: readBack?.menu?.dishes?.[0]?.name,
        },
      }),
    })
  } catch (e) {
    console.error(e)
    const msg = e instanceof Error ? e.message : "Ошибка сохранения"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
