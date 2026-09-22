export type NewYearHall = {
  name: string
  kind: string
  price: string
  detail: string
}

export type NewYearPromo = {
  enabled: boolean
  label: string
  dates: string
  note: string
  button: string
  halls: NewYearHall[]
}

export const DEFAULT_NEW_YEAR_PROMO: NewYearPromo = {
  enabled: true,
  label: "Новогодние корпоративы",
  dates: "с 15 по 30 декабря",
  note: "Алкоголь в стоимость не входит — можно привезти свой",
  button: "Забронировать зал",
  halls: [
    {
      name: "Гранд",
      kind: "Банкетный зал",
      price: "5 000 ₽",
      detail: "с гостя, с программой",
    },
    {
      name: "Амбианс",
      kind: "Малый зал",
      price: "4 500 ₽",
      detail: "с гостя, с программой",
    },
  ],
}

function textOr(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback
}

/** Полный объект для экрана и формы. Пустая строка сохраняется, подстановка — только если поля ещё нет. */
export function newYearPromoFrom(raw: unknown): NewYearPromo {
  const input = raw && typeof raw === "object" ? (raw as Partial<NewYearPromo>) : {}
  const sourceHalls = Array.isArray(input.halls) ? input.halls : []
  const halls = DEFAULT_NEW_YEAR_PROMO.halls.map((fallback, index) => {
    const hall = sourceHalls[index]
    return {
      name: textOr(hall?.name, fallback.name),
      kind: textOr(hall?.kind, fallback.kind),
      price: textOr(hall?.price, fallback.price),
      detail: textOr(hall?.detail, fallback.detail),
    }
  })
  return {
    enabled: input.enabled !== false,
    label: textOr(input.label, DEFAULT_NEW_YEAR_PROMO.label),
    dates: textOr(input.dates, DEFAULT_NEW_YEAR_PROMO.dates),
    note: textOr(input.note, DEFAULT_NEW_YEAR_PROMO.note),
    button: textOr(input.button, DEFAULT_NEW_YEAR_PROMO.button),
    halls,
  }
}

/** null — на первом экране обычные подзаголовок и кнопки. */
export function visibleNewYearPromo(raw: unknown): NewYearPromo | null {
  if (raw && typeof raw === "object" && (raw as { enabled?: boolean }).enabled === false) return null
  return newYearPromoFrom(raw)
}
