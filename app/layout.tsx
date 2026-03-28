import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: 'Кафе JAZZ в Тамбове! Изысканная кухня, банкеты! Бронируйте по телефону - +7(4752)525-697',
  description: 'Кафе JAZZ в Тамбове — изысканная кухня, банкеты, живая музыка. Бронируйте столик по телефону +7 (4752) 52-56-97.',
  applicationName: 'Кафе JAZZ',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Кафе JAZZ',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1410',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
