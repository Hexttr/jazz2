"use client"

import { useState } from "react"
import Image from "next/image"

const categories = [
  { id: "appetizers", label: "Закуски" },
  { id: "main", label: "Основные блюда" },
  { id: "desserts", label: "Десерты" },
  { id: "drinks", label: "Напитки" },
  { id: "cocktails", label: "Коктейли" },
]

const menuItems: Record<
  string,
  { name: string; description: string; price: string; image?: string }[]
> = {
  appetizers: [
    {
      name: "Брускетта с томатами",
      description: "Хрустящий хлеб, томаты черри, моцарелла, базилик, бальзамик",
      price: "490",
      image: "/images/dish-1.jpg",
    },
    {
      name: "Тартар из тунца",
      description: "Свежий тунец, авокадо, соевый соус, кунжут, микрозелень",
      price: "890",
    },
    {
      name: "Карпаччо из говядины",
      description: "Тонко нарезанная мраморная говядина, руккола, пармезан, каперсы",
      price: "750",
    },
    {
      name: "Сырная тарелка",
      description: "Ассорти из 5 видов сыра с мёдом, орехами и виноградом",
      price: "1 200",
    },
    {
      name: "Оливки маринованные",
      description: "Микс средиземноморских оливок с травами и чесноком",
      price: "390",
    },
    {
      name: "Хумус с питой",
      description: "Домашний хумус, тёплая пита, оливковое масло, паприка",
      price: "450",
    },
  ],
  main: [
    {
      name: "Стейк Рибай",
      description: "Мраморная говядина, овощи гриль, соус демиглас, 300г",
      price: "2 400",
      image: "/images/dish-2.jpg",
    },
    {
      name: "Паста с морепродуктами",
      description: "Спагетти, креветки, мидии, кальмары, томатный соус, базилик",
      price: "1 100",
    },
    {
      name: "Утиная грудка",
      description: "Томлёная утка, пюре из батата, вишнёвый соус, микрозелень",
      price: "1 650",
    },
    {
      name: "Ризотто с белыми грибами",
      description: "Рис арборио, белые грибы, пармезан, трюфельное масло",
      price: "950",
    },
    {
      name: "Лосось на гриле",
      description: "Филе лосося, спаржа, голландский соус, лимон",
      price: "1 350",
    },
    {
      name: "Бургер JAZZ",
      description: "Мраморная говядина, чеддер, бекон, карамелизированный лук, картофель фри",
      price: "890",
    },
  ],
  desserts: [
    {
      name: "Шоколадный фондан",
      description: "Тёплый шоколадный кекс с жидкой начинкой, ванильное мороженое",
      price: "590",
      image: "/images/dish-3.jpg",
    },
    {
      name: "Тирамису классический",
      description: "Маскарпоне, савоярди, эспрессо, какао",
      price: "520",
    },
    {
      name: "Крем-брюле",
      description: "Классический французский десерт с карамельной корочкой",
      price: "450",
    },
    {
      name: "Чизкейк Нью-Йорк",
      description: "Сливочный чизкейк с ягодным соусом",
      price: "490",
    },
  ],
  drinks: [
    {
      name: "Эспрессо",
      description: "Классический итальянский эспрессо, 30 мл",
      price: "200",
    },
    {
      name: "Капучино",
      description: "Двойной эспрессо, вспененное молоко, 250 мл",
      price: "320",
    },
    {
      name: "Свежевыжатый сок",
      description: "Апельсин, грейпфрут, яблоко или морковь, 300 мл",
      price: "350",
    },
    {
      name: "Чай листовой",
      description: "Коллекция премиальных чаёв из Китая, Индии и Японии",
      price: "390",
    },
    {
      name: "Лимонад домашний",
      description: "Классический, имбирный или лавандовый, 400 мл",
      price: "380",
    },
  ],
  cocktails: [
    {
      name: "Old Fashioned",
      description: "Бурбон, ангостура, сахарный сироп, апельсиновая цедра",
      price: "750",
      image: "/images/cocktail.jpg",
    },
    {
      name: "Jazz Sour",
      description: "Авторский коктейль: виски, лимонный сок, сироп маракуйи, яичный белок",
      price: "690",
    },
    {
      name: "Negroni",
      description: "Джин, кампари, красный вермут, долька апельсина",
      price: "720",
    },
    {
      name: "Espresso Martini",
      description: "Водка, кофейный ликёр, свежий эспрессо",
      price: "680",
    },
    {
      name: "Aperol Spritz",
      description: "Апероль, просекко, содовая, долька апельсина",
      price: "650",
    },
    {
      name: "Smoky Blues",
      description: "Авторский: мескаль, блю кюрасао, лайм, дымная подача",
      price: "850",
    },
  ],
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("appetizers")
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
                key={item.name}
                className={`flex items-start justify-between gap-4 py-5 ${
                  index < items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-sans text-lg font-semibold">
                    {item.name}
                  </h3>
                  <p
                    className="mt-1 text-sm leading-relaxed text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {item.description}
                  </p>
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
