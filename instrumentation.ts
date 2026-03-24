import { loadEnvConfig } from "@next/env"

/** Гарантируем загрузку `.env` из каталога приложения (systemd, cwd). */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    loadEnvConfig(process.cwd())
  }
}
