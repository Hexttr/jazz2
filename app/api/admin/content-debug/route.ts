import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { getRedis } from "@/lib/redis"

/**
 * Отладочный endpoint: проверка хранилища контента.
 * Только для авторизованных админов.
 * GET — показать источник данных
 * POST — выполнить тест записи и чтения
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

  const redis = getRedis()
  const redisConfigured = redis !== null
  const blobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

  const { content, source } = await import("@/lib/content").then((m) => m.getContentWithSource())
  const firstDish = content.menu?.dishes?.[0]
  return NextResponse.json({
    redisConfigured,
    blobConfigured,
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

  const redis = getRedis()
  if (!redis) {
    return NextResponse.json({
      error: "Redis не настроен", saved: false,
      hint: "Проверьте UPSTASH_REDIS_REST_URL и UPSTASH_REDIS_REST_TOKEN в Vercel",
    }, { status: 400 })
  }

  const testKey = "jazz:debug:test"
  const testValue = `test-${Date.now()}`
  try {
    await redis.set(testKey, testValue)
    const read = await redis.get<string>(testKey)
    await redis.del(testKey)
    const verified = read === testValue
    return NextResponse.json({
      saved: true,
      verified,
      hint: verified ? "Redis write/read работает" : "Redis записал, но прочитал другое значение",
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg, saved: false }, { status: 500 })
  }
}
