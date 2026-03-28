import type { MetadataRoute } from "next"

/** PWA: сайт — «На главный экран» в Chrome / Safari, режим как приложение (без адресной строки). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Кафе JAZZ — Тамбов",
    short_name: "JAZZ",
    description: "Изысканная кухня, банкеты, живая музыка. Кафе JAZZ в Тамбове.",
    start_url: "/",
    scope: "/",
    /** fullscreen — без UI браузера; при отсутствии поддержки — standalone. */
    display: "fullscreen",
    display_override: ["fullscreen", "standalone", "minimal-ui"],
    background_color: "#1a1410",
    theme_color: "#1a1410",
    orientation: "portrait-primary",
    lang: "ru",
    dir: "ltr",
    categories: ["food", "lifestyle"],
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
    shortcuts: [
      {
        name: "Бронирование зала",
        short_name: "Бронь",
        description: "Оставить заявку на банкетный зал",
        url: "/#reservation",
        icons: [{ src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Админка",
        short_name: "Админ",
        description: "Панель управления сайтом",
        url: "/admin",
        icons: [{ src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  }
}
