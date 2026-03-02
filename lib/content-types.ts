export type MenuCategory = { id: string; name: string; order: number }
export type MenuDish = {
  id: string
  categoryId: string
  name: string
  description: string
  portion?: string
  price: string
  image?: string
}
export type MenuContent = { categories: MenuCategory[]; dishes: MenuDish[] }

export type SectionBlock = {
  label?: string
  title?: string
  subtitle?: string
  text?: string
  text2?: string
  image?: string
  imageAlt?: string
  icon?: string
  [key: string]: unknown
}
export type SectionsContent = Record<string, SectionBlock>

export type AppContent = { menu: MenuContent; sections: SectionsContent }
