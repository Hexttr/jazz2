import type { MetadataRoute } from "next"

/** Отдельный манифест для раздела /admin — ярлык с главного экрана открывает админку. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/admin",
    name: "JAZZ — админка",
    short_name: "JAZZ admin",
    description: "Панель управления сайтом Кафе JAZZ",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen"],
    background_color: "#0c0c0c",
    theme_color: "#1a1410",
    orientation: "any",
    lang: "ru",
    icons: [
      {
        src: "/icons/pwa-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
