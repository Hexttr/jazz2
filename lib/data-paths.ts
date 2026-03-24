import path from "path"

/** Каталог данных приложения на сервере (рядом с проектом). */
export const DATA_DIR = path.join(process.cwd(), "data")

export const APP_CONTENT_FILE = path.join(DATA_DIR, "app-content.json")
export const RESERVATIONS_FILE = path.join(DATA_DIR, "reservations.json")
export const TELEGRAM_SETTINGS_FILE = path.join(DATA_DIR, "telegram.json")

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")
