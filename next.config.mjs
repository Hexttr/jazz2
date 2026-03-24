/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Включено для продакшена — исправляйте ошибки TS
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos", pathname: "/**" }],
  },
}

export default nextConfig
