import sharp from "sharp";
import { readdir, mkdir, stat, rename, unlink, rmdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MENU_DIR = join(__dirname, "..", "public", "images", "menu");
const TMP_DIR = join(MENU_DIR, ".tmp");
const MAX_SIZE = 1200;
const QUALITY = 82;

async function main() {
  const files = (await readdir(MENU_DIR)).filter((f) => f.endsWith(".jpg"));
  await mkdir(TMP_DIR, { recursive: true });

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = join(MENU_DIR, file);
    const outputPath = join(TMP_DIR, file);
    const fileStat = await stat(inputPath);
    totalBefore += fileStat.size;

    const image = sharp(inputPath);
    const meta = await image.metadata();
    const needResize =
      (meta.width && meta.width > MAX_SIZE) ||
      (meta.height && meta.height > MAX_SIZE);

    let pipeline = image;
    if (needResize) {
      pipeline = pipeline.resize(MAX_SIZE, MAX_SIZE, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    await pipeline
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(outputPath);

    const outStat = await stat(outputPath);
    totalAfter += outStat.size;
    const saved = ((1 - outStat.size / fileStat.size) * 100).toFixed(0);
    console.log(`${file}: ${(fileStat.size / 1024).toFixed(0)} KB → ${(outStat.size / 1024).toFixed(0)} KB (-${saved}%)`);
  }

  for (const file of files) {
    await unlink(join(MENU_DIR, file));
    await rename(join(TMP_DIR, file), join(MENU_DIR, file));
  }
  await rmdir(TMP_DIR);

  console.log("\n---");
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
