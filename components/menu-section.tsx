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
  { name: string; portion?: string; description: string; price: string; image?: string }[]
> = {
  "cuts": [
    { name: "Сырная нарезка", portion: "1/200", description: "Пармезан, Маасдам, Чечил, Президент, грецкий орех, мёд", price: "850", image: "/images/menu/cuts-01-syrnaya.jpg" },
    { name: "Мясная нарезка", portion: "1/200", description: "Буженина, язык, карбонат, сырокопчёная колбаса", price: "800", image: "/images/menu/cuts-02-myasnaya.jpg" },
    { name: "Рыбная нарезка", portion: "1/200", description: "Форель, сёмга, лимон", price: "800", image: "/images/menu/cuts-03-rybnaya.jpg" },
    { name: "Карпаччо из лосося", portion: "1/180", description: "Тонко нарезанный слабосолёный лосось, каперсы, руккола, оливковое масло", price: "800", image: "/images/menu/cuts-04-karpachcho.jpg" },
    { name: "Овощная нарезка", portion: "1/500", description: "Помидоры, огурцы, перец болгарский, зелень", price: "450", image: "/images/menu/cuts-05-ovoschnaya.jpg" },
    { name: "Разносол", portion: "1/300", description: "Капуста солёная, корейская морковь, корнишоны, помидоры, маслины, оливки", price: "450", image: "/images/menu/cuts-06-raznosol.jpg" },
    { name: "Дори с лакомкой", portion: "1/200 (5 шт.)", description: "Хрустящие кусочки рыбы дори в панировке", price: "400", image: "/images/menu/cuts-07-dori.jpg" },
    { name: "Шампиньоны фаршированные", portion: "1/100", description: "Шляпки шампиньонов с начинкой из сыра и зелени", price: "100", image: "/images/menu/cuts-08-shampiniony.jpg" },
    { name: "Баклажаны фаршированные", portion: "1/200 (5 шт.)", description: "Сыр, грецкий орех, овощи", price: "500", image: "/images/menu/cuts-09-baklazhany.jpg" },
    { name: "Бутерброд с икрой", portion: "1 шт.", description: "Белый хлеб, сливочное масло, красная икра", price: "200", image: "/images/menu/cuts-10-buterbrod.jpg" },
    { name: "Брускетты с сёмгой и креветками", portion: "1 шт.", description: "Гренки с нежной сёмгой и креветками", price: "200", image: "/images/menu/cuts-11-brusketty-semga.jpg" },
    { name: "Брускетты с вялеными помидорами", portion: "1 шт.", description: "Хрустящие гренки с вялеными томатами и зеленью", price: "100", image: "/images/menu/cuts-12-brusketty-tomaty.jpg" },
    { name: "Заливное из языка", portion: "1/100", description: "Нежный язык в прозрачном желе с зеленью", price: "250", image: "/images/menu/cuts-13-zalivnoe.jpg" },
    { name: "Заливное из языка", portion: "6 порций", description: "Заливное из языка на компанию", price: "1300", image: "/images/menu/cuts-14-zalivnoe-6por.jpg" },
  ],
  "salads": [
    { name: "Салат «Шапка Мономаха»", portion: "1/200", description: "Куриное мясо, картофель, гранат, орех, яйцо, сыр, майонез", price: "450", image: "/images/menu/salad-01-shapka.jpg" },
    { name: "Салат «Дамский»", portion: "1/200", description: "Куриное мясо, ананас, майонез, зелень", price: "400", image: "/images/menu/salad-02-damskiy.jpg" },
    { name: "Салат «Цезарь»", portion: "1/250", description: "Куриное филе, лист салата, пармезан, черри, соус", price: "550", image: "/images/menu/salad-03-cezar.jpg" },
    { name: "Салат «Цезарь» с креветками", portion: "1/250", description: "Креветки, лист салата, пармезан, черри, соус", price: "750", image: "/images/menu/salad-04-cezar-krevetki.jpg" },
    { name: "Салат «Джаз»", portion: "1/200", description: "Говядина, перец болгарский, маринованный лук", price: "450", image: "/images/menu/salad-05-jazz.jpg" },
    { name: "Салат мясной", portion: "1/200", description: "Говядина, картофель, солёный огурец, морковь, майонез", price: "400", image: "/images/menu/salad-06-myasnoy.jpg" },
    { name: "Салат «Корель»", portion: "1/200", description: "Говядина, корейская морковь, грибы, огурец маринованный, лук порей, майонез", price: "450", image: "/images/menu/salad-07-korel.jpg" },
    { name: "Салат «Пикантный»", portion: "1/200", description: "Копчёная курица, яйцо, корейская морковь, сыр, грибы, майонез", price: "450", image: "/images/menu/salad-08-pikantniy.jpg" },
    { name: "Салат «Греческий»", portion: "1/200", description: "Огурец, помидор, перец болгарский, маслины, брынза, оливковое масло", price: "350", image: "/images/menu/salad-09-grecheskiy.jpg" },
    { name: "Салат «Лесная сказка»", portion: "1/200", description: "Куриное филе, шампиньоны, яйцо, грецкий орех, зелень, горошек, майонез", price: "450", image: "/images/menu/salad-10-lesnaya-skazka.jpg" },
    { name: "Салат «Нежный»", portion: "1/200", description: "Язык, яйцо, огурец свежий, сыр, зелень, майонез", price: "600", image: "/images/menu/salad-11-nezhniy.jpg" },
    { name: "Салат «Говядина с рукколой»", portion: "1/250", description: "Говядина, черри, маринованный лук, руккола, соус с оливковым маслом", price: "500", image: "/images/menu/salad-12-govyadina-rukkola.jpg" },
    { name: "Салат «Перепелиное гнездо»", portion: "1/250", description: "Салат микс, кальмары, шампиньоны, перепелиное яйцо, соус", price: "600", image: "/images/menu/salad-13-perepelinoe-gnezdo.jpg" },
    { name: "Салат «Морской коктейль»", portion: "1/200", description: "Кальмары, мидии, морские гребешки, сёмга слабосолёная, сливочный соус, лист салата", price: "650", image: "/images/menu/salad-14-morskoy-kokteyl.jpg" },
    { name: "Салат «Дары моря»", portion: "1/200", description: "Филе хоки, кальмары, крабовое мясо, яйцо, горошек, майонез", price: "450", image: "/images/menu/salad-15-dary-morya.jpg" },
    { name: "Салат со шпинатом, сыром моцареллой и черри", portion: "1/200", description: "Шпинат, моцарелла, помидоры черри, соус", price: "400", image: "/images/menu/salad-16-shpinat-motsarella.jpg" },
    { name: "Салат «Грецкий язык»", portion: "1/200", description: "Язык, грибы, грецкий орех, майонез", price: "600", image: "/images/menu/salad-17-gretskiy-yazyk.jpg" },
  ],
  "hot-appetizers": [
    { name: "Жюльен из курицы и грибов", portion: "1/120", description: "Куриное филе, грибы, лук, сливки, сметана, сыр", price: "250", image: "/images/menu/hot-01-julien-kurica.jpg" },
    { name: "Жюльен из языка и грибов", portion: "1/120", description: "Язык, грибы, сливки, сметана, сыр", price: "400", image: "/images/menu/hot-02-julien-yazyk.jpg" },
    { name: "Куриное филе фаршированное ананасом и сыром", portion: "1/200", description: "Нежное филе с начинкой из ананаса и сыра", price: "500", image: "/images/menu/hot-03-file-ananas-syr.jpg" },
    { name: "Куриные рулеты фаршированные", portion: "1/200", description: "Рулетики из куриного филе с начинкой", price: "300", image: "/images/menu/hot-04-kurinye-ruletki.jpg" },
  ],
  "meat": [
    { name: "Куриные ножки фаршированные грибами и овощами", portion: "1/200", description: "Ножки с начинкой из грибов и овощей", price: "500", image: "/images/menu/meat-01-kurinye-nozhki.jpg" },
    { name: "Рулька свиная", portion: "1/100", description: "Традиционная запечённая свиная рулька", price: "300", image: "/images/menu/meat-02-rulka-svinaya.jpg" },
    { name: "Отбивная с грибами", portion: "1/200", description: "Свинина, шампиньоны, моцарелла", price: "500", image: "/images/menu/meat-03-otbivnaya-gribami.jpg" },
    { name: "Мясо по-французски", portion: "1/200", description: "Свинина, помидор, сыр, майонез", price: "450", image: "/images/menu/meat-04-myaso-frantsuzski.jpg" },
    { name: "Буженина запечённая с овощами", portion: "1/150", description: "Свинина, перец болгарский, баклажан, помидор", price: "400", image: "/images/menu/meat-05-buzhenina-ovoschi.jpg" },
    { name: "Мясо на дранниках «Джаз»", portion: "1/200", description: "Свинина, драники, сметана, сыр", price: "700", image: "/images/menu/meat-06-draniki-dzhaz.jpg" },
    { name: "Свинина запечённая с ананасом", portion: "1/200", description: "Свинина, ананас, сыр, майонез", price: "500", image: "/images/menu/meat-07-svinina-ananas.jpg" },
    { name: "Стейк из свинины на кости", portion: "1/200", description: "Сочный стейк на кости", price: "650", image: "/images/menu/meat-08-steyk-svinina-kost.jpg" },
    { name: "Утка фаршированная апельсином", portion: "1/100", description: "Утка с апельсиновой начинкой и цитрусовым соусом", price: "300", image: "/images/menu/meat-09-utka-apelsin.jpg" },
    { name: "Кролик в чесночно-сметанном соусе", portion: "1/100", description: "Нежное мясо кролика в сметанном соусе с чесноком", price: "300", image: "/images/menu/meat-10-krolik-smetana.jpg" },
    { name: "Рёбра свиные в винно-медовом соусе", portion: "1/150", description: "Свиные рёбра, красное вино, мёд, соевый соус, гранатовый соус", price: "400", image: "/images/menu/meat-11-rebra-vino-med.jpg" },
    { name: "Свинина с двумя видами сыра", portion: "1/250", description: "Свинина, моцарелла, пармезан, соус с помидорами", price: "600", image: "/images/menu/meat-12-svinina-dva-syra.jpg" },
    { name: "Шашлык из курицы", portion: "1/180", description: "Маринованная курица на гриле", price: "450", image: "/images/menu/meat-13-shashlik-kurica.jpg" },
    { name: "Шашлык из свинины", portion: "1/180", description: "Свинина на гриле", price: "500", image: "/images/menu/meat-14-shashlik-svinina.jpg" },
    { name: "Горшочек от повара", portion: "1/300", description: "Вырезка из телятины, сметана, картофельные драники", price: "600", image: "/images/menu/meat-15-gorshochek-povar.jpg" },
    { name: "Стейк из телятины", portion: "1/200", description: "Нежный стейк из телятины", price: "700", image: "/images/menu/meat-16-steyk-telyatina.jpg" },
    { name: "Стейк из свинины", portion: "1/200", description: "Сочный стейк из свиной вырезки", price: "550", image: "/images/menu/meat-17-steyk-svinina.jpg" },
    { name: "Телятина с черносливом и овощами", portion: "1/200", description: "Томлёная телятина с черносливом и овощами", price: "650", image: "/images/menu/meat-18-telyatina-chernosliv.jpg" },
    { name: "Телятина в сливочно-грибном соусе", portion: "1/200", description: "Телятина в сливочном соусе с грибами", price: "650", image: "/images/menu/meat-19-telyatina-gribnoy-sous.jpg" },
  ],
  "fish-sides": [
    { name: "Щука фаршированная", portion: "1/100", description: "Щука с начинкой, запечённая в духовке", price: "200", image: "/images/menu/fish-01-shchuka.jpg" },
    { name: "Форель под икорным соусом", portion: "1/200", description: "Форель, сливки, икра красная", price: "800", image: "/images/menu/fish-02-forel-ikra.jpg" },
    { name: "Стейк из сёмги с лимоном", portion: "1/100", description: "Стейк из сёмги с лимонным соком", price: "700", image: "/images/menu/fish-03-steyk-semga.jpg" },
    { name: "Рыба с лимоном и моцареллой", portion: "1/130", description: "Рыбное филе с лимоном и сыром моцарелла", price: "450", image: "/images/menu/fish-04-ryba-motsarella.jpg" },
    { name: "Рыба сочная с грибами", portion: "1/200", description: "Треска, шампиньоны, моцарелла", price: "450", image: "/images/menu/fish-05-ryba-gribami.jpg" },
    { name: "Овощной гарнир", portion: "1/200", description: "Картофель, салат из капусты, морковь по-корейски, помидор, огурец, болгарский перец", price: "350", image: "/images/menu/fish-06-ovoschnoy-garnir.jpg" },
    { name: "Картофель фри", portion: "1/150", description: "Хрустящий картофель фри", price: "150", image: "/images/menu/fish-07-kartofel-fri.jpg" },
    { name: "Овощи гриль", portion: "1/150", description: "Сезонные овощи на гриле", price: "400", image: "/images/menu/fish-08-ovoschi-gril.jpg" },
    { name: "Картофель пюре, по-деревенски отварной", portion: "1/150", description: "Нежное пюре или отварной картофель", price: "150", image: "/images/menu/fish-09-kartofel-pyure.jpg" },
  ],
  "pancakes": [
    { name: "Блинчики с мясом, курица с сыром", portion: "2 шт.", description: "Тонкие блинчики с курицей и сыром", price: "200", image: "/images/menu/pancake-01-myaso-syr.jpg" },
    { name: "Блинчики с бананом и шоколадом", portion: "2 шт.", description: "С сгущёнкой и ореховой пастой", price: "150", image: "/images/menu/pancake-02-banan-shokolad.jpg" },
  ],
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("cuts")
  const items = menuItems[activeCategory]

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

        {/* Menu cards — 2 columns */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-t-2xl bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground/40">
                    <span
                      className="px-2 text-center text-sm uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {item.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col border-t border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans text-base font-semibold leading-tight text-foreground">
                    {item.name}
                  </h3>
                  {item.portion ? (
                    <span
                      className="shrink-0 text-xs font-medium text-muted-foreground"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {item.portion}
                    </span>
                  ) : null}
                </div>
                {item.description ? (
                  <p
                    className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {item.description}
                  </p>
                ) : null}
                <div className="my-3 h-px w-full bg-muted-foreground/20" />
                <p className="font-sans text-xl font-bold text-primary">
                  {item.price} &#8381;
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <p className="mt-12 text-center text-sm text-muted-foreground" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Не является офертой. Стоимость и внешний вид блюд могут отличаться. Узнавайте подробности в кафе.
      </p>
    </section>
  )
}
