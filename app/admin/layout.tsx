import type { Metadata, Viewport } from "next"
import { AdminLayoutClient } from "./admin-layout-client"

export const metadata: Metadata = {
  title: "Админка — Кафе JAZZ",
  applicationName: "JAZZ admin",
  description: "Панель управления сайтом Кафе JAZZ",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "JAZZ admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
