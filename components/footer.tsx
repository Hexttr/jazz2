export function Footer() {
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
                { href: "#events", label: "Афиша" },
                { href: "#gallery", label: "Галерея" },
                { href: "#reviews", label: "Отзывы" },
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
                { day: "Пн - Чт", hours: "12:00 - 00:00" },
                { day: "Пт - Сб", hours: "12:00 - 02:00" },
                { day: "Воскресенье", hours: "11:00 - 23:00" },
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
                Живая музыка с 19:00
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
              <p>ул. Большая Дмитровка, д. 15</p>
              <p>г. Москва</p>
              <a href="tel:+74951234567" className="transition-colors hover:text-primary">
                +7 (495) 123-45-67
              </a>
              <a href="mailto:info@cafe-jazz.ru" className="transition-colors hover:text-primary">
                info@cafe-jazz.ru
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
            &copy; 2025 Кафе JAZZ. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
