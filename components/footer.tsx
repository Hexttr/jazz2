"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const privacyText = `Кафе JAZZ соблюдает вашу конфиденциальность. Мы собираем только те данные, которые вы добровольно указываете при бронировании столика или обратной связи: имя, контактный телефон и при необходимости электронную почту.

Эти данные используются исключительно для связи с вами, подтверждения брони и улучшения качества обслуживания. Мы не передаём ваши персональные данные третьим лицам и не используем их в рекламных рассылках без вашего согласия.

При посещении сайта могут сохраняться технические данные (cookie) для корректной работы страницы. Вы можете отключить cookie в настройках браузера.

По вопросам обработки персональных данных и их удаления обращайтесь: kafejazz@yandex.ru. Мы рассмотрим ваш запрос в разумные сроки.`

const termsText = `Используя сайт Кафе JAZZ, вы соглашаетесь с настоящими условиями.

Сайт предназначен для информирования о заведении, меню, мероприятиях и бронировании. Оформляя заявку на бронь, вы подтверждаете достоверность указанных контактных данных. Администрация оставляет за собой право связаться с вами для подтверждения бронирования.

Все материалы сайта (тексты, изображения, логотипы) являются собственностью Кафе JAZZ или используются с разрешения правообладателей. Копирование и использование без согласования не допускается.

Кафе JAZZ не несёт ответственности за временную недоступность сайта или неточности в информации, возникшие по техническим причинам. Актуальные данные уточняйте по телефону или электронной почте.

По всем вопросам: kafejazz@yandex.ru, +7 (4752) 52-56-97.`

export function Footer() {
  const [openPrivacy, setOpenPrivacy] = useState(false)
  const [openTerms, setOpenTerms] = useState(false)

  return (
    <footer className="border-t border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-sans text-2xl font-bold tracking-wide text-primary">
              JAZZ
            </span>
            <span className="ml-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              cafe
            </span>
            <p
              className="mt-4 text-sm leading-relaxed text-muted-foreground"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Место, где музыка встречается с
              изысканной кухней. С 2015 года.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="mb-4 text-xs uppercase tracking-[0.2em] text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Навигация
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "#about", label: "О нас" },
                { href: "#menu", label: "Меню" },
                { href: "#banquets", label: "Банкеты" },
                { href: "#gallery", label: "Галерея" },
                { href: "#contacts", label: "Контакты" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Hours */}
          <div>
            <h4
              className="mb-4 text-xs uppercase tracking-[0.2em] text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Часы работы
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { day: "Ежедневно", hours: "10:00 - 24:00" },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  <span className="text-muted-foreground">{item.day}</span>
                  <span className="text-foreground/80">{item.hours}</span>
                </div>
              ))}
              <p
                className="mt-2 text-sm text-primary"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Бизнес-ланч 12:00–16:00 — 350 ₽
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="mb-4 text-xs uppercase tracking-[0.2em] text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Контакты
            </h4>
            <div
              className="flex flex-col gap-2.5 text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              <p>г. Тамбов, ул. Мичуринская, 140 «Б»</p>
              <a href="tel:+74752525697" className="transition-colors hover:text-primary">
                +7 (4752) 52-56-97
              </a>
              <a href="tel:+79156612821" className="transition-colors hover:text-primary">
                +7 (915) 661-28-21
              </a>
              <a href="mailto:kafejazz@yandex.ru" className="transition-colors hover:text-primary">
                kafejazz@yandex.ru
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            &copy; 2026 Кафе JAZZ. Все права защищены.
          </p>
          <div className="flex gap-6">
            <Dialog open={openPrivacy} onOpenChange={setOpenPrivacy}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Политика конфиденциальности
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden flex flex-col sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="font-sans">
                    Политика конфиденциальности
                  </DialogTitle>
                </DialogHeader>
                <div
                  className="overflow-y-auto pr-2 text-sm leading-relaxed text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {privacyText}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={openTerms} onOpenChange={setOpenTerms}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Пользовательское соглашение
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] max-w-lg overflow-hidden flex flex-col sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="font-sans">
                    Пользовательское соглашение
                  </DialogTitle>
                </DialogHeader>
                <div
                  className="overflow-y-auto pr-2 text-sm leading-relaxed text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {termsText}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  )
}
