import { readFile } from "fs/promises"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { UPLOADS_DIR } from "@/lib/data-paths"

export const runtime = "nodejs"

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
}

export async function GET(
  _request: NextRequest,
  segmentData: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await segmentData.params
  const rel = Array.isArray(segments) ? segments.join("/") : ""
  if (!rel || rel.includes("..")) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const base = path.resolve(UPLOADS_DIR)
  const resolved = path.resolve(base, rel)
  if (!resolved.startsWith(base + path.sep)) {
    return new NextResponse("Not Found", { status: 404 })
  }

  try {
    const buf = await readFile(resolved)
    const ext = path.extname(rel).toLowerCase()
    const type = MIME[ext] ?? "application/octet-stream"
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    })
  } catch {
    return new NextResponse("Not Found", { status: 404 })
  }
}
