/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  typescript: {
    ignoreBuildErrors: false, // Включено для продакшена — исправляйте ошибки TS
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos", pathname: "/**" }],
  },
}

export default nextConfig
