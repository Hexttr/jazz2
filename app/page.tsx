import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { MenuSection } from "@/components/menu-section"
import { Events } from "@/components/events"
import { Gallery } from "@/components/gallery"
import { Reservation } from "@/components/reservation"
import { Contacts } from "@/components/contacts"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <About />
      <MenuSection />
      <Events />
      <Gallery />
      <Reservation />
      <Contacts />
      <Footer />
    </main>
  )
}
