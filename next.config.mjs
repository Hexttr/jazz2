/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Включено для продакшена — исправляйте ошибки TS
  },
  images: {
    unoptimized: false,
    localPatterns: [{ pathname: "/api/blob" }],
    remotePatterns: [
      { protocol: "https", hostname: "blob.vercel-storage.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
}

export default nextConfig
