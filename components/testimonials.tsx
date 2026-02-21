"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const reviews = [
  {
    name: "Анна Петрова",
    role: "Постоянный гость",
    text: "Невероятная атмосфера! Живой джаз, потрясающая кухня и внимательный персонал. Каждый визит — настоящий праздник. Отдельное спасибо шеф-повару за фондан!",
    rating: 5,
  },
  {
    name: "Дмитрий Соколов",
    role: "Музыкант",
    text: "Лучшая джазовая площадка в городе. Великолепный звук, уютная сцена, благодарная публика. Играть здесь — одно удовольствие. А кухня — отдельный вид искусства.",
    rating: 5,
  },
  {
    name: "Елена Михайлова",
    role: "Ресторанный критик",
    text: "Кафе JAZZ успешно сочетает высокую гастрономию с живой музыкой. Стейк Рибай — один из лучших в городе, а авторские коктейли заслуживают отдельной статьи.",
    rating: 5,
  },
  {
    name: "Максим Волков",
    role: "Гость",
    text: "Праздновали годовщину свадьбы — всё было идеально. Персонал помог организовать сюрприз, музыканты сыграли нашу любимую мелодию. Рекомендую!",
    rating: 5,
  },
  {
    name: "Ольга Кузнецова",
    role: "Гость",
    text: "Место, куда хочется возвращаться снова и снова. Уютная атмосфера, живой джаз и коктейли, которые не найти больше нигде. Особенно люблю воскресные бранчи!",
    rating: 4,
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1))

  return (
    <section id="reviews" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Отзывы
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            Что говорят гости
          </h2>
          <div className="h-px w-16 bg-primary" />
        </div>

        {/* Review carousel */}
        <div className="mx-auto max-w-3xl">
          <div className="relative border border-border bg-card p-8 md:p-12">
            <Quote className="mb-6 h-10 w-10 text-primary/30" />

            <p
              className="mb-8 text-lg leading-relaxed text-foreground/80 md:text-xl"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {reviews[current].text}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < reviews[current].rating
                          ? "fill-primary text-primary"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-sans text-lg font-semibold">
                  {reviews[current].name}
                </p>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {reviews[current].role}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                  aria-label="Предыдущий отзыв"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                  aria-label="Следующий отзыв"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 transition-all ${
                    i === current
                      ? "w-8 bg-primary"
                      : "w-1.5 bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Отзыв ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
