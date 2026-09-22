import { MapPin, Phone, Clock, Mail, UtensilsCrossed } from "lucide-react"
import { siteContacts, telHref } from "@/lib/site-contacts"

export function Contacts({ content }: { content?: Record<string, unknown> | null }) {
  const label = (content?.label as string) ?? "Контакты"
  const title = (content?.title as string) ?? "Как нас найти"
  const businessLunch = (content?.businessLunch as { title?: string; text?: string; price?: string }) ?? {}
  const { address, hours, phones, email } = siteContacts(content)
  return (
    <section id="contacts" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Business Lunch block */}
        <div className="mb-16 overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-8 p-6 md:p-8 lg:p-10">
            <div className="flex items-start gap-4 md:flex-1">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary bg-primary/10">
                <UtensilsCrossed className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans text-2xl font-bold tracking-wide text-primary md:text-3xl">
                  {businessLunch.title ?? "Бизнес-ланч"}
                </h3>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {businessLunch.text ?? "По будням с 12:00 до 16:00"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2 border-t border-primary/20 pt-4 md:mt-0 md:border-t-0 md:pt-0 md:border-l md:border-primary/20 md:pl-8">
              <span className="font-sans text-4xl font-bold tracking-wide text-primary">{businessLunch.price ?? "350"}</span>
              <span
                className="text-lg text-muted-foreground"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                ₽
              </span>
            </div>
          </div>
        </div>

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
                  {address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-border p-6 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans font-semibold">Телефон</h3>
                {phones.map((phone) => (
                  <a
                    key={phone}
                    href={telHref(phone)}
                    className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 border border-border p-6 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans font-semibold">Часы работы</h3>
                <p
                  className="text-sm leading-relaxed text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {hours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-border p-6 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-sans font-semibold">Email</h3>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {email}
                </a>
              </div>
            </div>

            </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative h-full min-h-[400px] overflow-hidden border border-border">
              <iframe
                src={`https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(address)}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Расположение Кафе JAZZ на карте"
                className="absolute inset-0 min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
