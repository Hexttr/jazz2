import { getContent } from "@/lib/content"
import { siteContacts } from "@/lib/site-contacts"
import { SplashScreen } from "@/components/splash-screen"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { MenuSection } from "@/components/menu-section"
import { Events } from "@/components/events"
import { Gallery } from "@/components/gallery"
import { Reservation } from "@/components/reservation"
import { Contacts } from "@/components/contacts"
import { Footer } from "@/components/footer"

// ISR: кэш 5 мин. При сохранении в админке revalidatePath("/") инвалидирует кэш.
export const revalidate = 300

export default async function Home() {
  const content = await getContent()
  const contacts = siteContacts(content.sections?.contacts)
  return (
    <main>
      <SplashScreen />
      <Navigation phone={contacts.phones[0]} />
      <Hero content={content.sections?.hero} />
      <About content={content.sections?.about} />
      <MenuSection menu={content.menu} sectionContent={content.sections?.menu} />
      <Events content={content.sections?.events} />
      <Gallery content={content.sections?.gallery} />
      <Reservation content={content.sections?.reservation} />
      <Contacts content={content.sections?.contacts} />
      <Footer content={content.sections?.footer} contacts={content.sections?.contacts} />
    </main>
  )
}
