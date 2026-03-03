const sharp = require("sharp")
const path = require("path")
const fs = require("fs").promises

const DIR = path.join(process.cwd(), "public", "admin", "sections")
const MAX_WIDTH = 400
const QUALITY = 72

async function main() {
  const files = await fs.readdir(DIR)
  const jpgs = files.filter((f) => f.endsWith(".jpg"))
  for (const name of jpgs) {
    const src = path.join(DIR, name)
    const buf = await sharp(src)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer()
    await fs.writeFile(src, buf)
    const stat = await fs.stat(src)
    console.log(name, (stat.size / 1024).toFixed(1), "KB")
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
