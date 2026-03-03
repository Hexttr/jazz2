import { NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"

const BLOB_HOST = "blob.vercel-storage.com"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url || !url.startsWith("https://") || !url.includes(BLOB_HOST)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ error: "Blob not configured" }, { status: 503 })
  }
  try {
    const result = await get(url, {
      access: "private",
      token,
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    })
    if (!result) {
      return new NextResponse("Not found", { status: 404 })
    }
    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "public, max-age=86400",
        },
      })
    }
    if (!result.stream) {
      return new NextResponse("Not found", { status: 404 })
    }
    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        ETag: result.blob.etag,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return new NextResponse("Error", { status: 500 })
  }
}
