"use client"

import type { LucideIcon } from "lucide-react"
import {
  Music,
  Utensils,
  CalendarDays,
  Users,
  Sparkles,
  Wine,
  MapPin,
  Phone,
  Clock,
  Mail,
  UtensilsCrossed,
  Building2,
  Palette,
  Flower2,
  Cake,
  Music2,
  Mic2,
} from "lucide-react"

export const LANDING_ICONS: { id: string; name: string; Icon: LucideIcon }[] = [
  { id: "Music", name: "Музыка", Icon: Music },
  { id: "Utensils", name: "Кухня / столовые приборы", Icon: Utensils },
  { id: "CalendarDays", name: "Календарь", Icon: CalendarDays },
  { id: "Users", name: "Люди / гости", Icon: Users },
  { id: "Sparkles", name: "Искры / праздник", Icon: Sparkles },
  { id: "Wine", name: "Вино", Icon: Wine },
  { id: "MapPin", name: "Местоположение", Icon: MapPin },
  { id: "Phone", name: "Телефон", Icon: Phone },
  { id: "Clock", name: "Часы", Icon: Clock },
  { id: "Mail", name: "Почта", Icon: Mail },
  { id: "UtensilsCrossed", name: "Кухня (скрещённые)", Icon: UtensilsCrossed },
  { id: "Building2", name: "Здание / зал", Icon: Building2 },
  { id: "Palette", name: "Оформление / палитра", Icon: Palette },
  { id: "Flower2", name: "Цветы", Icon: Flower2 },
  { id: "Cake", name: "Торт", Icon: Cake },
  { id: "Music2", name: "Музыка (альт)", Icon: Music2 },
  { id: "Mic2", name: "Микрофон / ведущий", Icon: Mic2 },
]

export function getIconById(id: string): LucideIcon | null {
  const found = LANDING_ICONS.find((i) => i.id === id)
  return found ? found.Icon : null
}
