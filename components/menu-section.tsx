"use client"

import { useState } from "react"
import Image from "next/image"

const categories = [
  { id: "cuts", label: "Нарезки и закуски" },
  { id: "salads", label: "Салаты" },
  { id: "hot-appetizers", label: "Горячие закуски" },
  { id: "meat", label: "Мясные блюда" },
  { id: "fish-sides", label: "Рыба и гарниры" },
  { id: "pancakes", label: "Блинчики" },
]

const menuItems: Record<
  string,
  { name: string; description: string; price: string; image?: string }[]
> = {
  "cuts": [
    { name: "Сырная нарезка 1/200", description: "Пармезан, Маасдам, Чечил, Президент, грецкий орех, мёд", price: "850" },
    { name: "Мясная нарезка 1/200", description: "Буженина, язык, карбонат, сырокопчёная колбаса", price: "800" },
    { name: "Рыбная нарезка 1/200", description: "Форель, сёмга, лимон", price: "800" },
    { name: "Карпаччо из лосося 1/180", description: "", price: "800" },
    { name: "Овощная нарезка 1/500", description: "Помидоры, огурцы, перец болгарский, зелень", price: "450" },
    { name: "Разносол 1/300", description: "Капуста солёная, корейская морковь, корнишоны, помидоры, маслины, оливки", price: "450" },
    { name: "Дори с лакомкой 1/200 (5 шт.)", description: "", price: "400" },
    { name: "Шампиньоны фаршированные 1/100", description: "", price: "100" },
    { name: "Баклажаны фаршированные 1/200 (5 шт.)", description: "Сыр, грецкий орех, овощи", price: "500" },
    { name: "Бутерброд с икрой 1 шт.", description: "", price: "200" },
    { name: "Брускетты с сёмгой, с креветками 1 шт.", description: "", price: "200" },
    { name: "Брускетты с вялеными помидорами 1 шт.", description: "", price: "100" },
    { name: "Заливное из языка 1/100", description: "", price: "250" },
    { name: "Заливное из языка (блюдо 6 порций)", description: "", price: "1300" },
  ],
  "salads": [
    { name: "Салат «Шапка Мономаха» 1/200", description: "Куриное мясо, картофель, гранат, орех, яйцо, сыр, майонез", price: "450" },
    { name: "Салат «Дамский» 1/200", description: "Куриное мясо, ананас, майонез, зелень", price: "400" },
    { name: "Салат «Цезарь» 1/250", description: "Куриное филе, лист салата, пармезан, черри, соус", price: "550" },
    { name: "Салат «Цезарь» с креветками 1/250", description: "Креветки, лист салата, пармезан, черри, соус", price: "750" },
    { name: "Салат «Джаз» 1/200", description: "Говядина, перец болгарский, маринованный лук", price: "450" },
    { name: "Салат мясной 1/200", description: "Говядина, картофель, солёный огурец, морковь, майонез", price: "400" },
    { name: "Салат «Корель» 1/200", description: "Говядина, корейская морковь, грибы, огурец маринованный, лук порей, майонез", price: "450" },
    { name: "Салат «Пикантный» 1/200", description: "Копчёная курица, яйцо, корейская морковь, сыр, грибы, майонез", price: "450" },
    { name: "Салат «Греческий» 1/200", description: "Огурец, помидор, перец болгарский, маслины, брынза, оливковое масло", price: "350" },
    { name: "Салат «Лесная сказка» 1/200", description: "Куриное филе, шампиньоны, яйцо, грецкий орех, зелень, горошек, майонез", price: "450" },
    { name: "Салат «Нежный» 1/200", description: "Язык, яйцо, огурец свежий, сыр, зелень, майонез", price: "600" },
    { name: "Салат «Говядина с рукколой» 1/250", description: "Говядина, черри, маринованный лук, руккола, соус с оливковым маслом", price: "500" },
    { name: "Салат «Перепелиное гнездо» 1/250", description: "Салат микс, кальмары, шампиньоны, перепелиное яйцо, соус", price: "600" },
    { name: "Салат «Морской коктейль» 1/200", description: "Кальмары, мидии, морские гребешки, сёмга слабосолёная, сливочный соус, лист салата", price: "650" },
    { name: "Салат «Дары моря» 1/200", description: "Филе хоки, кальмары, крабовое мясо, яйцо, горошек, майонез", price: "450" },
    { name: "Салат со шпинатом, сыром моцареллой и черри 1/200", description: "Шпинат, моцарелла, помидоры черри, соус", price: "400" },
    { name: "Салат «Грецкий язык» 1/200", description: "Язык, грибы, грецкий орех, майонез", price: "600" },
  ],
  "hot-appetizers": [
    { name: "Жюльен из курицы и грибов 1/120", description: "Куриное филе, грибы, лук, сливки, сметана, сыр", price: "250" },
    { name: "Жюльен из языка и грибов 1/120", description: "Язык, грибы, сливки, сметана, сыр", price: "400" },
    { name: "Куриное филе фаршированное ананасом и сыром 1/200", description: "", price: "500" },
    { name: "Куриные рулеты фаршированные 1/200", description: "", price: "300" },
  ],
  "meat": [
    { name: "Куриные ножки фаршированные грибами и овощами 1/200", description: "", price: "500" },
    { name: "Рулька свиная 1/100", description: "", price: "300" },
    { name: "Отбивная с грибами 1/200", description: "Свинина, шампиньоны, моцарелла", price: "500" },
    { name: "Мясо по-французски 1/200", description: "Свинина, помидор, сыр, майонез", price: "450" },
    { name: "Буженина запечённая с овощами 1/150", description: "Свинина, перец болгарский, баклажан, помидор", price: "400" },
    { name: "Мясо на дранниках «Джаз» 1/200", description: "Свинина, драники, сметана, сыр", price: "700" },
    { name: "Свинина запечённая с ананасом 1/200", description: "Свинина, ананас, сыр, майонез", price: "500" },
    { name: "Стейк из свинины на кости 1/200", description: "", price: "650" },
    { name: "Утка фаршированная апельсином 1/100", description: "", price: "300" },
    { name: "Кролик в чесночно-сметанном соусе 1/100", description: "", price: "300" },
    { name: "Рёбра свиные в винно-медовом соусе 1/150", description: "Свиные рёбра, красное вино, мёд, соевый соус, гранатовый соус", price: "400" },
    { name: "Свинина с двумя видами сыра 1/250", description: "Свинина, моцарелла, пармезан, соус с помидорами", price: "600" },
    { name: "Шашлык из курицы 1/180", description: "", price: "450" },
    { name: "Шашлык из свинины 1/180", description: "", price: "500" },
    { name: "Горшочек от повара 1/300", description: "Вырезка из телятины, сметана, картофельные драники", price: "600" },
    { name: "Стейк из телятины 1/200", description: "", price: "700" },
    { name: "Стейк из свинины 1/200", description: "", price: "550" },
    { name: "Телятина с черносливом и овощами 1/200", description: "", price: "650" },
    { name: "Телятина в сливочно-грибном соусе 1/200", description: "", price: "650" },
  ],
  "fish-sides": [
    { name: "Щука фаршированная 1/100", description: "", price: "200" },
    { name: "Форель под икорным соусом 1/200", description: "Форель, сливки, икра красная", price: "800" },
    { name: "Стейк из сёмги с лимоном 1/100", description: "", price: "700" },
    { name: "Рыба с лимоном и моцареллой 1/130", description: "", price: "450" },
    { name: "Рыба сочная с грибами 1/200", description: "Треска, шампиньоны, моцарелла", price: "450" },
    { name: "Овощной гарнир 1/200", description: "Картофель, салат из капусты, морковь по-корейски, помидор, огурец, болгарский перец", price: "350" },
    { name: "Картофель фри 1/150", description: "", price: "150" },
    { name: "Овощи гриль 1/150", description: "", price: "400" },
    { name: "Картофель пюре, по-деревенски отварной 1/150", description: "", price: "150" },
  ],
  "pancakes": [
    { name: "Блинчики с мясом, курица с сыром 2 шт.", description: "", price: "200" },
    { name: "Блинчики с бананом и шоколадом, сгущёнкой, ореховой пастой 2 шт.", description: "", price: "150" },
  ],
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("cuts")
  const items = menuItems[activeCategory]
  const featured = items.find((item) => item.image)

  return (
    <section id="menu" className="bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span
            className="mb-4 text-sm uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Меню
          </span>
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-wide md:text-5xl">
            Наши блюда
          </h2>
          <div className="h-px w-16 bg-primary" />
        </div>

        {/* Category tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-sm tracking-wider transition-all ${
                activeCategory === cat.id
                  ? "border border-primary bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Featured image */}
          {featured && (
            <div className="relative aspect-[4/3] overflow-hidden lg:row-span-3">
              <Image
                src={featured.image!}
                alt={featured.name}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="font-sans text-xl font-semibold text-white">
                  {featured.name}
                </h3>
                <p
                  className="mt-1 text-sm text-white/70"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {featured.description}
                </p>
              </div>
            </div>
          )}

          {/* Menu items list */}
          <div className="flex flex-col">
            {items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={`flex items-start justify-between gap-4 py-5 ${
                  index < items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-sans text-lg font-semibold">
                    {item.name}
                  </h3>
                  {item.description ? (
                    <p
                      className="mt-1 text-sm leading-relaxed text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 font-sans text-lg font-semibold text-primary">
                  {item.price} &#8381;
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
