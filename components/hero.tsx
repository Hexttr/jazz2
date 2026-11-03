import Image from "next/image"
import { TriumphOffer } from "@/components/triumph-offer"
import { getImageUrl, imageUnoptimized } from "@/lib/utils"
import { visibleNewYearPromo, type NewYearPromo } from "@/lib/new-year-promo"

type HeroContent = {
  label?: string
  title?: string
  text?: string
  image?: string
  logo?: string
  newYear?: unknown
}

const defaultHero: HeroContent = {
  label: "Здесь каждое событие становится особенным",
  title: "ДЖАЗ кафе",
  text: "Изысканная кухня, мягкий свет, уютный интерьер и джазовые мелодии, которые льются как вино",
  image: "/images/hero.jpg",
  logo: "/images/logo.png",
}

function NewYearOffer({ promo }: { promo: NewYearPromo }) {
  return (
    <div className="w-full min-w-0 max-w-4xl">
      <h2 className="font-sans text-4xl font-bold leading-tight tracking-wide text-white sm:text-5xl">
        {promo.label}
      </h2>
      <TriumphOffer />
      <div className="mx-auto mt-4 h-px w-16 bg-primary" />
      <p
        className="mt-3 text-sm text-white/80 sm:text-base"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {promo.dates}
      </p>
      <div className="mt-5 grid items-stretch gap-3 sm:grid-cols-2 sm:gap-4">
        {promo.halls.map((hall, index) => (
          <div
            key={`${hall.name}-${index}`}
            className="flex h-full flex-col border border-primary/45 bg-black/50 px-5 py-4 text-left backdrop-blur-sm"
          >
            {hall.kind ? (
              <p
                className="text-[11px] uppercase tracking-[0.28em] text-primary"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {hall.kind}
              </p>
            ) : null}
            <div className={`flex items-baseline justify-between gap-3 ${hall.kind ? "mt-2" : ""}`}>
              <p className="whitespace-nowrap font-sans text-xl font-bold leading-none tracking-wide text-white sm:text-2xl">
                {hall.name}
              </p>
              <p className="shrink-0 whitespace-nowrap font-sans text-xl font-bold leading-none text-primary sm:text-2xl">
                {hall.price}
              </p>
            </div>
            <p
              className="mb-4 mt-2 text-xs text-white/70 sm:text-sm"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {hall.detail}
            </p>
            <a
              href="#reservation"
              className="mt-auto border border-primary bg-primary px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-transparent hover:text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {promo.button}
            </a>
          </div>
        ))}
      </div>
      <p
        className="mt-4 text-sm leading-relaxed text-white/75"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {promo.note}
      </p>
    </div>
  )
}

export function Hero({ content }: { content?: Record<string, unknown> | null }) {
  const c: HeroContent = content ? { ...defaultHero, ...content } : defaultHero
  const promo = visibleNewYearPromo(c.newYear)
  return (
    <section id="hero" className={`relative w-full overflow-x-clip ${promo ? "min-h-dvh" : "h-screen overflow-hidden"}`}>
      <Image
        src={getImageUrl(c.image ?? "/images/hero.jpg") || "/images/hero.jpg"}
        alt="Интерьер Кафе JAZZ"
        fill
        className="object-cover"
        priority
        quality={90}
        unoptimized={imageUnoptimized(c.image ?? "")}
      />
      <div className={promo ? "absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/45" : "absolute inset-0 bg-black/60"} />

      <div
        className={`relative z-10 flex w-full min-w-0 flex-col items-center px-6 text-center ${
          promo ? "min-h-dvh justify-end pb-8 pt-20 sm:pb-10" : "h-full justify-end pb-24"
        }`}
      >
        <div className={`relative flex justify-center ${promo ? "mb-2" : "mb-6"}`}>
          <Image
            src={getImageUrl(c.logo ?? "/images/logo.png") || "/images/logo.png"}
            alt="Логотип Кафе JAZZ"
            width={200}
            height={200}
            className={promo ? "h-auto w-24 object-contain sm:w-32" : "object-contain"}
            priority
            unoptimized={imageUnoptimized(c.logo ?? "")}
          />
        </div>
        <p
          className={`max-w-full min-w-0 text-xs uppercase tracking-[0.22em] text-primary sm:text-sm sm:tracking-[0.4em] ${promo ? "mb-2" : "mb-4"}`}
          style={{ fontFamily: "var(--font-inter), sans-serif", ...(content?.labelColor ? { color: content.labelColor as string } : {}) }}
        >
          {c.label}
        </p>
        <h1
          className={`font-sans font-bold leading-tight tracking-wide text-white ${
            promo ? "mb-10 text-4xl sm:mb-14 sm:text-5xl md:text-6xl" : "mb-6 text-5xl md:text-7xl lg:text-8xl"
          }`}
          style={content?.titleColor ? { color: content.titleColor as string } : undefined}
        >
          {c.title}
        </h1>
        {promo ? (
          <NewYearOffer promo={promo} />
        ) : (
          <>
            <p
              className="mb-10 max-w-xl text-lg leading-relaxed text-white/70"
              style={{ fontFamily: "var(--font-inter), sans-serif", ...(content?.textColor ? { color: content.textColor as string } : {}) }}
            >
              {c.text}
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
          </>
        )}
      </div>
    </section>
  )
}
