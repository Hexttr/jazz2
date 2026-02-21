import Image from "next/image"
import { Music, Utensils, Wine } from "lucide-react"

const features = [
  {
    icon: Music,
    title: "Живая музыка",
    description:
      "Каждый вечер на нашей сцене выступают лучшие джазовые музыканты города и приглашённые гости",
  },
  {
    icon: Utensils,
    title: "Авторская кухня",
    description:
      "Наш шеф-повар создаёт блюда, вдохновлённые европейской и азиатской кулинарными традициями",
  },
  {
    icon: Wine,
    title: "Фирменные коктейли",
    description:
      "Барная карта включает классические и авторские коктейли, подобранные под каждое блюдо",
  },
]

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            О нас
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            Место, где рождается музыка
          </h2>
          <div className="h-px w-16 bg-primary" />
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt="Саксофонист на сцене Кафе JAZZ"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content */}
          <div>
            <p
              className="mb-8 text-lg leading-relaxed text-foreground/70"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Кафе JAZZ открыло свои двери в 2015 году и с тех пор стало одним
              из самых любимых мест города для ценителей хорошей музыки и
              изысканной кухни. Мы создали пространство, где каждый вечер
              превращается в незабываемое событие.
            </p>
            <p
              className="mb-12 text-lg leading-relaxed text-foreground/70"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Наша философия проста: качественная музыка, превосходная кухня и
              безупречный сервис. Мы верим, что настоящий джаз лучше всего
              звучит в компании близких людей за бокалом отличного вина.
            </p>

            <div className="flex flex-col gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-sans text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
