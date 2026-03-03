"use client"

import { useState, useRef } from "react"
import { CalendarDays, Phone, Users, Building2 } from "lucide-react"

export function Reservation({ content }: { content?: Record<string, unknown> | null }) {
  const label = (content?.label as string) ?? "Бронирование"
  const title = (content?.title as string) ?? "Забронируйте зал"
  const text = (content?.text as string) ?? "Выберите зал «Амбианс» (до 20 гостей) или «Гранд» (до 80 гостей). Заполните форму — мы свяжемся с вами для подтверждения."
  const twoHallsTitle = (content?.twoHallsTitle as string) ?? "Два зала"
  const twoHallsText = (content?.twoHallsText as string) ?? "Амбианс — до 20 гостей, Гранд — до 80 гостей"
  const hoursTitle = (content?.hoursTitle as string) ?? "Часы работы"
  const hoursText = (content?.hoursText as string) ?? "Ежедневно с 10:00 до 24:00"
  const phoneTitle = (content?.phoneTitle as string) ?? "Телефон для бронирования"
  const phones = (content?.phones as string[]) ?? ["+7 (4752) 52-56-97", "+7 (915) 661-28-21"]
  const capacityTitle = (content?.capacityTitle as string) ?? "Вместимость"
  const capacityText = (content?.capacityText as string) ?? "До 80 гостей"
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    hall: "",
    date: "",
    time: "",
    guests: "",
    comment: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const openDatePicker = () => {
    const el = dateInputRef.current
    if (el && "showPicker" in el && typeof (el as HTMLInputElement).showPicker === "function") {
      (el as HTMLInputElement).showPicker()
    } else {
      el?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          phone: formState.phone,
          hall: formState.hall,
          date: formState.date,
          time: formState.time,
          guests: formState.guests,
          comment: formState.comment,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        setFormState({ name: "", phone: "", hall: "", date: "", time: "", guests: "", comment: "" })
      } else {
        setSubmitError((data.error as string) || "Не удалось отправить заявку")
      }
    } catch {
      setSubmitError("Ошибка соединения")
    }
  }

  return (
    <section id="reservation" className="relative bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left - text */}
          <div className="flex flex-col justify-center">
            <span
              className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif", ...(content?.labelColor && { color: content.labelColor as string }) }}
            >
              {label}
            </span>
            <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl" style={content?.titleColor ? { color: content.titleColor as string } : undefined}>
              {title}
            </h2>
            <div className="mb-8 h-px w-16 bg-primary" />
            <p
              className="mb-8 text-lg leading-relaxed text-foreground/70"
              style={{ fontFamily: "var(--font-inter), sans-serif", ...(content?.textColor && { color: content.textColor as string }) }}
            >
              {text}
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold">{twoHallsTitle}</p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {twoHallsText}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold">{hoursTitle}</p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {hoursText}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold">{phoneTitle}</p>
                  {phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/30">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold">{capacityTitle}</p>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {capacityText}
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
                {submitError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {submitError}
                  </p>
                )}
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
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="hall"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Зал
                  </label>
                  <select
                    id="hall"
                    required
                    value={formState.hall}
                    onChange={(e) =>
                      setFormState({ ...formState, hall: e.target.value })
                    }
                    className="border border-border bg-transparent px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    <option value="" className="bg-card">Выбрать зал</option>
                    <option value="ambiance" className="bg-card">Амбианс (до 20 гостей)</option>
                    <option value="grand" className="bg-card">Гранд (до 80 гостей)</option>
                  </select>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="date"
                      className="cursor-pointer text-xs uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      onClick={(e) => { e.preventDefault(); openDatePicker(); }}
                    >
                      Дата
                    </label>
                    <input
                      ref={dateInputRef}
                      id="date"
                      type="date"
                      required
                      min={new Date().toISOString().slice(0, 10)}
                      value={formState.date}
                      onChange={(e) =>
                        setFormState({ ...formState, date: e.target.value })
                      }
                      onClick={openDatePicker}
                      className="cursor-pointer border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary [color-scheme:light]"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      aria-label="Выберите дату"
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
                      className="cursor-pointer border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-primary [color-scheme:light]"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      aria-label="Выберите время"
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
                      {Array.from({ length: 66 }, (_, i) => i + 15).map((n) => (
                        <option key={n} value={String(n)} className="bg-card">
                          {n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}
                        </option>
                      ))}
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
