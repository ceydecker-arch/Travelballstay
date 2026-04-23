import { Clock, MapPin, Users, Heart } from 'lucide-react'

const benefits = [
  {
    icon: Users,
    title: 'Stay Together',
    description:
      'No more splitting your team across different hotels. TravelBallStay keeps every family on the same page — and in the same area.',
    color: '#2a7fc4',
    bg: '#e4f0fb',
  },
  {
    icon: MapPin,
    title: 'Stay Close to the Fields',
    description:
      'Cut down on driving and stress. Every search is anchored to your tournament facility so you are never stuck with a 45-minute drive to a 6am game.',
    color: '#2D6A4F',
    bg: '#e8f5ee',
  },
  {
    icon: Clock,
    title: 'Save Time Planning',
    description:
      'No more back-and-forth coordination. One link, one page, one place where your whole team can see everything they need.',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    icon: Heart,
    title: 'Enjoy the Weekend',
    description:
      'More time for memories, less time managing logistics. Let TravelBallStay handle the planning so you can focus on the game.',
    color: '#e11d48',
    bg: '#ffe4e6',
  },
]

export default function Benefits() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#f5f8fa' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="section-title">Why Families Love TravelBallStay</h2>
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
