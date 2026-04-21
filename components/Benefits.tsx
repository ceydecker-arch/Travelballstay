import { Clock, MapPin, Users, Heart } from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    title: 'Stop searching 4 apps',
    description:
      'Hotels, venues, tournaments, and team coordination — all in one place instead of spread across texts, Airbnb, Google Maps, and Facebook.',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    icon: MapPin,
    title: 'Stay near the fields',
    description:
      'Every search is anchored to your tournament facility, not the city center. No more 45-minute drives to morning games.',
    color: '#1a7a4a',
    bg: '#e6f7ee',
  },
  {
    icon: Users,
    title: 'Keep your team together',
    description:
      'The team map shows where every family is staying. Coordinate carpools and stay close without the group text chaos.',
    color: '#2a7fc4',
    bg: '#e4f0fb',
  },
  {
    icon: Heart,
    title: 'Find everything nearby',
    description:
      'Restaurants, grocery stores, urgent care, coffee, and batting cages — all surfaced near your tournament complex, not downtown.',
    color: '#e11d48',
    bg: '#ffe4e6',
  },
]

export default function Benefits() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#f5f8fa' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="section-title">Built for travel sport families</h2>
          <p className="section-subtitle">Everything you need, nothing you don&apos;t</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="card flex gap-5 items-start"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: benefit.bg }}
                >
                  <Icon size={22} style={{ color: benefit.color }} strokeWidth={2} />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: '#0f1f2e' }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a7080' }}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
