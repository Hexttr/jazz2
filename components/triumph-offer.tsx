"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const PROGRAM = ["Ведущий", "DJ-звукорежиссёр", "Дед Мороз и Снегурочка", "Живой звук"] as const

export function TriumphOffer() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto mt-4 w-full max-w-xl border border-primary/55 bg-black/50 px-4 py-3 text-center backdrop-blur-sm sm:px-5">
      <p className="font-sans text-base font-bold leading-snug tracking-wide text-white sm:text-lg">
        Новогодний корпоратив в стиле «Иван Васильевич меняет профессию!»
      </p>
      <p
        className="mt-2 text-[11px] uppercase tracking-[0.18em] text-primary sm:text-xs sm:tracking-[0.22em]"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        от агентства праздников «ТРИУМФ»
      </p>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="mt-2 inline-flex min-h-11 items-center justify-center px-3 text-xs font-medium uppercase tracking-[0.22em] text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Подробнее
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/75" />
          <Dialog.Content
            className="fixed inset-x-0 bottom-0 z-[80] flex max-h-[100dvh] w-full flex-col overflow-hidden border border-primary/40 bg-[#14110e] shadow-2xl outline-none pt-[env(safe-area-inset-top)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:max-h-[min(92dvh,820px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pt-0"
            tabIndex={-1}
            onOpenAutoFocus={(event) => {
              event.preventDefault()
              if (event.currentTarget instanceof HTMLElement) event.currentTarget.focus()
            }}
          >
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="sticky top-0 z-10 flex h-0 justify-end overflow-visible">
                <Dialog.Close
                  className="mr-3 mt-[max(0.75rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center border border-white/25 bg-black/70 text-white transition-colors hover:border-primary hover:text-primary sm:mt-3"
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>
              <img
                src="/images/ivan-vasilievich-new-year.webp"
                alt="Новогодний банкет: царское облачение и праздничный зал с ёлкой"
                width={1280}
                height={720}
                className="h-44 w-full object-cover object-[center_30%] sm:aspect-video sm:h-auto"
              />
              <div
                className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pb-8"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-primary">
                  Специальное предложение
                </p>
                <Dialog.Title className="mt-2 font-sans text-2xl font-bold leading-tight tracking-wide text-white sm:text-3xl">
                  Новогодний корпоратив в стиле «Иван Васильевич меняет профессию!»
                </Dialog.Title>
                <Dialog.Description className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                  От театра торжеств «ТРИУМФ» — пять часов программы, в которых любимая комедия становится праздником для всего зала.
                </Dialog.Description>
                <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                  Царский пир встречается с новогодней ночью. Гости узнают знакомую историю, смеются вместе и остаются внутри неё до последнего танца.
                </p>
                <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-primary">Пять часов программы</p>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PROGRAM.map((item) => (
                    <li
                      key={item}
                      className="border border-primary/35 bg-black/40 px-3 py-2.5 text-sm text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <Dialog.Close asChild>
                  <a
                    href="#reservation"
                    className="mt-6 flex min-h-11 items-center justify-center border border-primary bg-primary px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-transparent hover:text-primary"
                  >
                    Забронировать зал
                  </a>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
