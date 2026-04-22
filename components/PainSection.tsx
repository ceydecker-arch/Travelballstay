'use client'
import { MessageSquare, MapPin, Clock, Navigation } from 'lucide-react'
const pains = [
  {
    icon: MessageSquare,
    text: 'Endless group texts trying to coordinate where everyone is staying',
  },
  {
    icon: MapPin,
    text: 'Parents booked in different hotels spread across the city',
  },
  {
    icon: Navigation,
    text: 'Long drives between your hotel and the fields at 6am',
  },
  {
    icon: Clock,
    text: 'Hours spent searching Airbnb, Google Maps, and booking sites',
  },
]
export default function PainSection() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#0f1f2e' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4"
          >
            Tournament weekends are already hard enough.
          </h2>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Sound familiar?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {pains.map((pain, index) => {
            const Icon = pain.icon
            return (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl p-5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(229,57,53,0.15)' }}
                >
                  <Icon size={20} color="#ef5350" strokeWidth={2} />
                </div>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {pain.text}
                </p>
              </div>
            )
          })}
        </div>
        <div className="text-center">
          <div
            className="inline-block rounded-2xl px-8 py-5"
            style={{
              backgroundColor: 'rgba(26,122,74,0.15)',
              border: '1px solid rgba(26,122,74,0.3)',
            }}
          >
            <p
              className="text-xl sm:text-2xl font-bold text-white"
            >
              There&apos;s a better way to do it.
            </p>
            <p
              className="text-base mt-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              TravelBallStay keeps your whole team organized
              in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
