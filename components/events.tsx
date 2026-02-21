import { Calendar, Clock, Music } from "lucide-react"

const events = [
  {
    day: "Пт",
    date: "28 февраля",
    time: "20:00",
    title: "Jazz Quartet Night",
    artist: "Алексей Козлов Квартет",
    description: "Классический джаз в исполнении легендарного саксофониста и его группы",
    tag: "Джаз",
  },
  {
    day: "Сб",
    date: "1 марта",
    time: "21:00",
    title: "Blues & Soul Evening",
    artist: "Мария Чайковская",
    description: "Вечер блюза и соула с потрясающим вокалом и живым бэндом",
    tag: "Блюз",
  },
  {
    day: "Вс",
    date: "2 марта",
    time: "18:00",
    title: "Sunday Jazz Brunch",
    artist: "Smooth Jazz Trio",
    description: "Расслабленный воскресный бранч под лёгкий smooth jazz",
    tag: "Бранч",
  },
  {
    day: "Чт",
    date: "6 марта",
    time: "20:00",
    title: "Jam Session",
    artist: "Открытый микрофон",
    description: "Свободная джем-сессия для всех музыкантов — приходите играть!",
    tag: "Джем",
  },
  {
    day: "Пт",
    date: "7 марта",
    time: "20:30",
    title: "Latin Jazz Fiesta",
    artist: "Cuba Libre Band",
    description: "Зажигательный вечер латиноамериканского джаза и босса-новы",
    tag: "Латин",
  },
  {
    day: "Сб",
    date: "8 марта",
    time: "19:00",
    title: "Ladies Night Special",
    artist: "Elena & The Swing Band",
    description: "Праздничный вечер для прекрасных дам с лучшими свинг-хитами",
    tag: "Свинг",
  },
]

export function Events() {
  return (
    <section id="events" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Афиша
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            Ближайшие события
          </h2>
          <div className="h-px w-16 bg-primary" />
        </div>

        {/* Events grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.title}
              className="group border border-border bg-card p-6 transition-all hover:border-primary/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 flex-col items-center justify-center border border-primary/30">
                    <span
                      className="text-xs uppercase text-primary"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {event.day}
                    </span>
                    <span
                      className="text-sm font-semibold text-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {event.date.split(" ")[0]}
                    </span>
                  </div>
                  <div>
                    <div
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                  </div>
                </div>
                <span
                  className="border border-primary/30 px-2.5 py-1 text-xs uppercase tracking-wider text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {event.tag}
                </span>
              </div>

              <h3 className="mb-1 font-sans text-xl font-semibold group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <p className="mb-2 flex items-center gap-1.5 text-sm text-primary" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                <Music className="h-3.5 w-3.5" />
                {event.artist}
              </p>
              <p
                className="text-sm leading-relaxed text-muted-foreground"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
