"use client"

import { useState } from "react"
import { CalendarDays, Clock, Users } from "lucide-react"

export function Reservation() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    comment: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormState({ name: "", phone: "", date: "", time: "", guests: "", comment: "" })
  }

  return (
    <section id="reservation" className="relative bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left - text */}
          <div className="flex flex-col justify-center">
            <span
              className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Бронирование
            </span>
            <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
              Забронируйте
              <br />
              ваш столик
            </h2>
            <div className="mb-8 h-px w-16 bg-primary" />
            <p
              className="mb-8 text-lg leading-relaxed text-foreground/70"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Мы рекомендуем бронировать столики заранее, особенно на пятницу и
              субботу. Для больших компаний или специальных мероприятий свяжитесь
              с нами по телефону.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold">Ежедневно</p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Пн-Чт: 12:00 - 00:00
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Пт-Сб: 12:00 - 02:00
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Вс: 11:00 - 23:00
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold">Живая музыка</p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Ежедневно с 19:00
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold">Вместимость</p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    До 120 гостей, VIP-зал на 20 персон
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - form */}
          <div className="border border-border p-8 md:p-10">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center border border-primary">
                  <span className="text-2xl text-primary">&#10003;</span>
                </div>
                <h3 className="mb-2 font-sans text-2xl font-semibold">Спасибо!</h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Мы свяжемся с вами для подтверждения бронирования.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="mb-2 font-sans text-2xl font-semibold">
                  Заполните форму
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="name"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Имя
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="phone"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Телефон
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className="border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="date"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Дата
                    </label>
                    <input
                      id="date"
                      type="date"
                      required
                      value={formState.date}
                      onChange={(e) =>
                        setFormState({ ...formState, date: e.target.value })
                      }
                      className="border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="time"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Время
                    </label>
                    <input
                      id="time"
                      type="time"
                      required
                      value={formState.time}
                      onChange={(e) =>
                        setFormState({ ...formState, time: e.target.value })
                      }
                      className="border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="guests"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Гостей
                    </label>
                    <select
                      id="guests"
                      required
                      value={formState.guests}
                      onChange={(e) =>
                        setFormState({ ...formState, guests: e.target.value })
                      }
                      className="border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      <option value="" className="bg-card">Выбрать</option>
                      <option value="1" className="bg-card">1 гость</option>
                      <option value="2" className="bg-card">2 гостя</option>
                      <option value="3" className="bg-card">3 гостя</option>
                      <option value="4" className="bg-card">4 гостя</option>
                      <option value="5" className="bg-card">5 гостей</option>
                      <option value="6" className="bg-card">6 гостей</option>
                      <option value="7+" className="bg-card">7+ гостей</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="comment"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Комментарий
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    value={formState.comment}
                    onChange={(e) =>
                      setFormState({ ...formState, comment: e.target.value })
                    }
                    className="resize-none border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    placeholder="Особые пожелания..."
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 border border-primary bg-primary px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-transparent hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Забронировать
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
