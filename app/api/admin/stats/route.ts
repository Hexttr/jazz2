import { NextRequest, NextResponse } from "next/server"
import { getSessionTokenFromRequest, verifySession } from "@/lib/auth"
import { getContent } from "@/lib/content"
import { getReservations } from "@/lib/reservations"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const token = getSessionTokenFromRequest(request)
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
  }

  try {
    const [content, reservations] = await Promise.all([
      getContent(),
      getReservations(),
    ])
    const categoriesCount = content.menu?.categories?.length ?? 0
    const dishesCount = content.menu?.dishes?.length ?? 0
    const reservationsPending = reservations.filter((r) => r.status === "pending").length
    const reservationsTotal = reservations.length

    return NextResponse.json({
      categoriesCount,
      dishesCount,
      reservationsPending,
      reservationsTotal,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
  }
}
