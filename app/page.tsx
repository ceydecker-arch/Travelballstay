import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PainSection from '@/components/PainSection'
import QuickActions from '@/components/QuickActions'
import HowItWorks from '@/components/HowItWorks'
import TeamMapFeature from '@/components/TeamMapFeature'
import FeaturedDestinations from '@/components/FeaturedDestinations'
import Benefits from '@/components/Benefits'
import TrustSection from '@/components/TrustSection'
import FinalCTA from '@/components/FinalCTA'
import EmailSignup from '@/components/EmailSignup'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainSection />
      <QuickActions />
      <HowItWorks />
      <TeamMapFeature />
      <FeaturedDestinations />
      <Benefits />
      <TrustSection />
      <FinalCTA />
      <EmailSignup />
      <Footer />
    </main>
  )
}
