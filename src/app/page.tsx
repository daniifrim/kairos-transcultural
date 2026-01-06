import {
  Navbar,
  Hero,
  VideoSection,
  KairosCourse,
  Experience,
  Impact,
  PracticalDetails,
  ImageCarousel,
  Organizers,
  FAQ,
  Footer,
} from '@/components/landing'
import { getActiveCohortStats } from '@/lib/actions'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const { confirmedCount, capacity, isFull } = await getActiveCohortStats()

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero
        confirmedCount={confirmedCount}
        capacity={capacity}
        isFull={isFull}
      />
      <VideoSection />
      <KairosCourse />
      <Experience />
      <Impact />
      <PracticalDetails />
      <ImageCarousel />
      <Organizers />
      <FAQ />
      <Footer />
    </main>
  )
}
