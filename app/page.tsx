import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import QuickActions from '@/components/QuickActions'
import HowItWorks from '@/components/HowItWorks'
import TeamMapFeature from '@/components/TeamMapFeature'
import FeaturedDestinations from '@/components/FeaturedDestinations'
import Benefits from '@/components/Benefits'
import EmailSignup from '@/components/EmailSignup'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <QuickActions />
      <HowItWorks />
      <TeamMapFeature />
      <FeaturedDestinations />
      <Benefits />
      <EmailSignup />
      <Footer />
    </main>
  )
}
