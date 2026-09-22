/**
 * Контакты на сайте читаются из sections.contacts (ключ app_content в SQLite).
 * Карточки, карта, подвал и телефон в шапке берут одни и те же поля.
 * Подстановки ниже — только если в базе поля ещё нет (пустая установка).
 */

export const FALLBACK_ADDRESS = "г. Тамбов, ул. Мичуринская, 140Б"
export const FALLBACK_EMAIL = "kafejazz@yandex.ru"
export const FALLBACK_HOURS = "Работаем каждый день с 10:00 до 24:00"
export const FALLBACK_PHONES = ["+7 (4752) 52-56-97", "+7 (915) 661-28-21"]

export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return "tel:"
  return `tel:+${digits}`
}

export function siteContacts(content?: Record<string, unknown> | null) {
  const rawPhones = content?.phones
  const phones = Array.isArray(rawPhones)
    ? rawPhones.filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    : []
  const address = content?.address
  const email = content?.email
  const hours = content?.hours
  return {
    address: typeof address === "string" ? address : FALLBACK_ADDRESS,
    email: typeof email === "string" && email.trim() ? email : FALLBACK_EMAIL,
    hours: typeof hours === "string" ? hours : FALLBACK_HOURS,
    phones: phones.length > 0 ? phones : [...FALLBACK_PHONES],
  }
}
