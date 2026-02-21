import { MapPin, Phone, Mail, Instagram } from "lucide-react"

export function Contacts() {
  return (
    <section id="contacts" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Контакты
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            Как нас найти
          </h2>
          <div className="h-px w-16 bg-primary" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact cards */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 border border-border p-6 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans font-semibold">Адрес</h3>
                <p
                  className="text-sm leading-relaxed text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  г. Москва, ул. Большая Дмитровка, д. 15
                  <br />
                  м. Театральная / Охотный Ряд
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-border p-6 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans font-semibold">Телефон</h3>
                <a
                  href="tel:+74951234567"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  +7 (495) 123-45-67
                </a>
                <br />
                <a
                  href="tel:+74959876543"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  +7 (495) 987-65-43
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-border p-6 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans font-semibold">Email</h3>
                <a
                  href="mailto:info@cafe-jazz.ru"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  info@cafe-jazz.ru
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-border p-6 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                <Instagram className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans font-semibold">Соцсети</h3>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  @cafe_jazz_msk
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative h-full min-h-[400px] overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.0!2d37.6117!3d55.7601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzM2LjQiTiAzN8KwMzYnNDIuMSJF!5e0!3m2!1sru!2sru!4v1700000000000!5m2!1sru!2sru"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.3) brightness(0.7)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Расположение Кафе JAZZ на карте"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
