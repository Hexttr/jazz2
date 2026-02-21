import Image from "next/image"

export function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Интерьер Кафе JAZZ"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 px-6 text-center">
        <p
          className="mb-4 text-sm uppercase tracking-[0.4em] text-primary"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Живая музыка каждый вечер
        </p>
        <h1 className="mb-6 font-sans text-5xl font-bold leading-tight tracking-wide text-white md:text-7xl lg:text-8xl">
          Кафе JAZZ
        </h1>
        <p
          className="mb-10 max-w-xl text-lg leading-relaxed text-white/70"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Изысканная кухня, авторские коктейли и лучшие джазовые музыканты города
          в атмосфере уюта и вдохновения
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#reservation"
            className="border border-primary bg-primary px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-transparent hover:text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Забронировать
          </a>
          <a
            href="#menu"
            className="border border-white/30 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all hover:border-primary hover:text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Смотреть меню
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-xs uppercase tracking-[0.3em] text-white/40"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            scroll
          </span>
          <div className="h-12 w-px bg-white/20" />
        </div>
      </div>
    </section>
  )
}
