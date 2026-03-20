"use client"

import Image from "next/image"
import { getImageUrl } from "@/lib/utils"
import { Users, Sparkles, Wine, Palette, Flower2, Cake, Music2, Mic2 } from "lucide-react"

const defaultExtras = [
  { title: "Индивидуальное оформление и стильная сервировка", note: "Учтём ваши предпочтения", icon: "Palette" },
  { title: "Цветочное оформление зала", note: "Подберём композицию под концепцию праздника", icon: "Flower2" },
  { title: "Авторский праздничный торт", note: "Создадим по вашим пожеланиям", icon: "Cake" },
  { title: "Музыкальное сопровождение", note: "Составим плейлист", icon: "Music2" },
  { title: "Ведущий", note: "Порекомендуем специалиста под формат вашего мероприятия", icon: "Mic2" },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette,
  Flower2,
  Cake,
  Music2,
  Mic2,
}

const banquetHalls = [
  {
    id: "ambiance",
    name: "Амбианс",
    subtitle: "Камерный зал",
    capacity: 20,
    image: "/images/gallery-3.jpg",
    description: "Уютное пространство для тёплых торжеств. Тёплое освещение, живая музыка на расстоянии вытянутой руки и атмосфера, где каждый гость — часть одного целого.",
    ideal: "Свадьбы, юбилеи, корпоративные вечера, дни рождения",
    features: ["Живой джаз-бэнд", "Винная карта", "Индивидуальное меню", "Звукоизоляция"],
  },
  {
    id: "grand",
    name: "Гранд",
    subtitle: "Парадный зал",
    capacity: 80,
    image: "/images/hero.jpg",
    description: "Просторный зал с панорамной сценой и профессиональным звуком. Идеален для масштабных праздников — свадебных банкетов, корпоративов и премиум-мероприятий.",
    ideal: "Большие свадьбы, юбилеи компаний, гала-ужины, презентации",
    features: ["Сцена с аппаратурой", "Танцпол", "Премиум-бар", "Зал для ведущего"],
  },
]

export function Events({ content }: { content?: Record<string, unknown> | null }) {
  const label = (content?.label as string) ?? "Аренда залов"
  const title = (content?.title as string) ?? "Банкеты"
  const subtitle = (content?.subtitle as string) ?? "Два зала — от камерного ужина до масштабного торжества"
  const halls = (content?.halls as typeof banquetHalls) ?? banquetHalls
  const extrasTitle = (content?.extrasTitle as string) ?? "Дополнительные возможности"
  const extras = (content?.extras as { title: string; note: string }[]) ?? defaultExtras
  return (
    <section id="banquets" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif", ...(content?.labelColor ? { color: content.labelColor as string } : {}) }}
          >
            {label}
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl" style={content?.titleColor ? { color: content.titleColor as string } : undefined}>
            {title}
          </h2>
          <p
            className="mx-auto max-w-2xl text-muted-foreground"
            style={{ fontFamily: "var(--font-inter), sans-serif", ...(content?.subtitleColor ? { color: content.subtitleColor as string } : {}) }}
          >
            {subtitle}
          </p>
          <div className="mt-6 h-px w-16 bg-primary" />
        </div>

        {/* Banquet halls */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {halls.map((hall) => (
            <div
              key={hall.id}
              className="group relative overflow-hidden border border-border bg-card transition-all hover:border-primary/40"
            >
              {/* Image block */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getImageUrl(hall.image)}
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

        {/* Дополнительные возможности */}
        <div className="mt-20 lg:mt-24">
          <div className="mb-10 flex flex-col items-center text-center">
            <span
              className="mb-2 text-xs uppercase tracking-[0.3em] text-primary/80"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Дополнительно
            </span>
            <h3 className="font-sans text-2xl font-bold tracking-wide md:text-3xl" style={content?.titleColor ? { color: content.titleColor as string } : undefined}>
              {extrasTitle}
            </h3>
            <div className="mt-4 h-px w-12 bg-primary/60" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {extras.map((item, i) => {
              const iconKey = defaultExtras[i]?.icon ?? "Palette"
              const Icon = iconMap[iconKey] ?? Palette
              return (
                <div
                  key={i}
                  className="group flex flex-col border border-border/60 bg-card/50 p-5 transition-all hover:border-primary/40 hover:bg-card/70"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mb-1 font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
