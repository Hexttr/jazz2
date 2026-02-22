"use client"

import Image from "next/image"
import { Users, Sparkles, Wine } from "lucide-react"

const banquetHalls = [
  {
    id: "ambiance",
    name: "Амбианс",
    subtitle: "Камерный зал",
    capacity: 40,
    image: "/images/gallery-3.jpg",
    description: "Уютное пространство для тёплых торжеств. Тёплое освещение, живая музыка на расстоянии вытянутой руки и атмосфера, где каждый гость — часть одного целого.",
    ideal: "Свадьбы, юбилеи, корпоративные вечера, дни рождения",
    features: ["Живой джаз-бэнд", "Винная карта", "Индивидуальное меню", "Звукоизоляция"],
  },
  {
    id: "grand",
    name: "Гранд",
    subtitle: "Парадный зал",
    capacity: 100,
    image: "/images/hero.jpg",
    description: "Просторный зал с панорамной сценой и профессиональным звуком. Идеален для масштабных праздников — свадебных банкетов, корпоративов и премиум-мероприятий.",
    ideal: "Большие свадьбы, юбилеи компаний, гала-ужины, презентации",
    features: ["Сцена с аппаратурой", "Танцпол", "Премиум-бар", "Зал для ведущего"],
  },
]

export function Events() {
  return (
    <section id="banquets" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Аренда залов
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            Банкеты
          </h2>
          <p
            className="mx-auto max-w-2xl text-muted-foreground"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Два зала — от камерного ужина до масштабного торжества
          </p>
          <div className="mt-6 h-px w-16 bg-primary" />
        </div>

        {/* Banquet halls */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {banquetHalls.map((hall) => (
            <div
              key={hall.id}
              className="group relative overflow-hidden border border-border bg-card transition-all hover:border-primary/40"
            >
              {/* Image block */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={hall.image}
                  alt={hall.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Capacity badge */}
                <div className="absolute right-6 top-6 flex items-center gap-2 border border-primary/50 bg-background/90 px-4 py-2.5 backdrop-blur-sm">
                  <Users className="h-5 w-5 text-primary" />
                  <span
                    className="font-sans text-lg font-semibold tracking-wide"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    до {hall.capacity} гостей
                  </span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span
                    className="mb-1 block text-xs uppercase tracking-[0.3em] text-primary/90"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {hall.subtitle}
                  </span>
                  <h3 className="font-sans text-3xl font-bold tracking-wide text-white md:text-4xl">
                    {hall.name}
                  </h3>
                </div>
              </div>

              {/* Content block */}
              <div className="p-6 lg:p-8">
                <p
                  className="mb-6 leading-relaxed text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {hall.description}
                </p>

                <div className="mb-6 flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p
                    className="text-sm text-foreground/90"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    <span className="font-medium text-primary">Идеально для: </span>
                    {hall.ideal}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hall.features.map((feature) => (
                    <span
                      key={feature}
                      className="flex items-center gap-1.5 border border-border bg-muted/30 px-3 py-1.5 text-xs uppercase tracking-wider text-foreground/80"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      <Wine className="h-3 w-3 text-primary" />
                      {feature}
                    </span>
                  ))}
                </div>

                <a
                  href="#reservation"
                  className="mt-6 inline-block border border-primary bg-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-transparent hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Забронировать зал
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
