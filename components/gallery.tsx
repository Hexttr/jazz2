"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

const images = [
  { src: "/images/gallery-1.jpg", alt: "Джаз-бэнд на сцене", span: "md:col-span-2 md:row-span-2" },
  { src: "/images/gallery-2.jpg", alt: "Бар Кафе JAZZ", span: "" },
  { src: "/images/gallery-3.jpg", alt: "Романтический ужин", span: "" },
  { src: "/images/hero.jpg", alt: "Интерьер кафе", span: "md:col-span-2 md:row-span-2" },
  { src: "/images/gallery-4.jpg", alt: "Шеф-повар за работой", span: "" },
  { src: "/images/about.jpg", alt: "Саксофонист", span: "" },
]

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section id="gallery" className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Галерея
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            Атмосфера вечера
          </h2>
          <div className="h-px w-16 bg-primary" />
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[repeat(3,1fr)] md:aspect-[4/3] md:gap-4 md:w-full">
          {images.map((image, index) => (
            <button
              key={image.src}
              onClick={() => setLightbox(index)}
              className={`group relative aspect-square overflow-hidden ${image.span}`}
              aria-label={`Открыть ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span
                  className="border border-white/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Смотреть
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-label="Просмотр фотографии"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 text-white/70 transition-colors hover:text-white"
            aria-label="Закрыть"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox(i)
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === lightbox ? "bg-primary w-6" : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Фото ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
