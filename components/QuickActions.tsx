import { Trophy, MapPin, Building2, Users } from 'lucide-react'

const actions = [
  {
    icon: Trophy,
    title: 'Find Tournaments',
    description: 'Search upcoming tournaments by sport, city, or date',
    href: '#tournaments',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    icon: MapPin,
    title: 'Browse Venues',
    description: 'Explore fields and sports complexes near your event',
    href: '#venues',
    color: '#1a7a4a',
    bg: '#e6f7ee',
  },
  {
    icon: Building2,
    title: 'Find Hotels',
    description: 'See lodging ranked by drive time to the tournament fields',
    href: '#hotels',
    color: '#2a7fc4',
    bg: '#e4f0fb',
  },
  {
    icon: Users,
    title: 'Plan a Team Trip',
    description: 'Create a shared trip page your whole team can join',
    href: '#team-trips',
    color: '#9333ea',
    bg: '#f3e8ff',
  },
]

export default function QuickActions() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="section-title">What do you need today?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <a
                key={action.title}
                href={action.href}
                className="group card flex flex-col gap-4 cursor-pointer no-underline"
                style={{ textDecoration: 'none' }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: action.bg }}
                >
                  <Icon size={22} style={{ color: action.color }} strokeWidth={2} />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-base font-semibold mb-1.5 transition-colors duration-150 group-hover:text-green-700"
                    style={{ color: '#0f1f2e' }}
                  >
                    {action.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a7080' }}>
                    {action.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div
                  className="mt-auto text-sm font-semibold flex items-center gap-1 transition-all duration-150 group-hover:gap-2"
                  style={{ color: action.color }}
                >
                  Get started
                  <span>→</span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
