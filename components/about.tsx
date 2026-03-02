import Image from "next/image"
import { Music, Utensils, CalendarDays } from "lucide-react"

const features = [
  {
    icon: Utensils,
    title: "Авторская кухня",
    description:
      "Наш шеф-повар создаёт блюда, вдохновлённые европейской и азиатской кулинарными традициями",
  },
  {
    icon: CalendarDays,
    title: "Банкетные залы",
    description:
      "Амбианс — до 20 гостей, Гранд — до 80 гостей. Звоните +7 (4752) 52-56-97",
  },
  {
    icon: Music,
    title: "Живая музыка",
    description:
      "Каждый вечер на нашей сцене выступают лучшие джазовые музыканты города и приглашённые гости",
  },
]

export function About({ content }: { content?: Record<string, unknown> | null }) {
  const label = (content?.label as string) ?? "О нас"
  const title = (content?.title as string) ?? "Мы — Кафе JAZZ"
  const text = (content?.text as string) ?? "С 2010 года мы создаём пространство, где каждый чувствует себя как дома. Тысячи гостей возвращаются к нам за неповторимой атмосферой, изысканной кухней и заботой, которая проявляется в каждой мелочи."
  const text2 = (content?.text2 as string) ?? "Кафе JAZZ — здесь каждое событие становится особенным. Доверьте нам ваш праздник — и мы сделаем всё, чтобы он запомнился! Большая парковка и удобное расположение — дополнительные плюсы вашего визита."
  const image = (content?.image as string) ?? "/images/about.jpg"
  const imageAlt = (content?.imageAlt as string) ?? "Саксофонист на сцене Кафе JAZZ"
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {label}
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            {title}
          </h2>
          <div className="h-px w-16 bg-primary" />
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              unoptimized={image.startsWith("http")}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content */}
          <div>
            <p
              className="mb-8 text-lg leading-relaxed text-foreground/70"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {text}
            </p>
            <p
              className="mb-12 text-lg leading-relaxed text-foreground/70"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {text2}
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
