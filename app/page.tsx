import { unstable_noStore } from "next/cache"
import { getContent } from "@/lib/content"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { MenuSection } from "@/components/menu-section"
import { Events } from "@/components/events"
import { Gallery } from "@/components/gallery"
import { Reservation } from "@/components/reservation"
import { Contacts } from "@/components/contacts"
import { Footer } from "@/components/footer"

// Контент из Redis/Blob — всегда актуальный при каждом заходе
export const dynamic = "force-dynamic"

export default async function Home() {
  unstable_noStore()
  const content = await getContent()
  return (
    <main>
      <Navigation />
      <Hero content={content.sections?.hero} />
      <About content={content.sections?.about} />
      <MenuSection menu={content.menu} sectionContent={content.sections?.menu} />
      <Events content={content.sections?.events} />
      <Gallery content={content.sections?.gallery} />
      <Reservation content={content.sections?.reservation} />
      <Contacts content={content.sections?.contacts} />
      <Footer content={content.sections?.footer} />
    </main>
  )
}
