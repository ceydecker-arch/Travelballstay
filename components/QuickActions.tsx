import { Trophy, MapPin, Building2, Users } from 'lucide-react'

const actions = [
  {
    icon: Trophy,
    number: '01',
    title: 'Find Tournaments',
    description: 'Search upcoming tournaments by sport, city, or date',
    href: '#tournaments',
    color: '#1a7a4a',
    iconBg: '#e6f7ee',
  },
  {
    icon: MapPin,
    number: '02',
    title: 'Browse Venues',
    description: 'Explore fields and sports complexes near your event',
    href: '#venues',
    color: '#2a7fc4',
    iconBg: '#e4f0fb',
  },
  {
    icon: Building2,
    number: '03',
    title: 'Find Hotels',
    description: 'See lodging ranked by drive time to the tournament fields',
    href: '#hotels',
    color: '#f59e0b',
    iconBg: '#fef3c7',
  },
  {
    icon: Users,
    number: '04',
    title: 'Plan a Team Trip',
    description: 'Create a shared trip page your whole team can join',
    href: '#team-trips',
    color: '#9333ea',
    iconBg: '#f3e8ff',
  },
]

// Convert hex color to rgba with given alpha
function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function QuickActions() {
  return (
    <section
      className="py-16 lg:py-20"
      style={{
        backgroundColor: '#f5f8fa',
        borderTop: '4px solid #1a7a4a',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ color: '#0f1f2e' }}
          >
            Everything you need for tournament weekend.
          </h2>
          <div
            className="mx-auto mt-4"
            style={{
              width: '60px',
              height: '4px',
              backgroundColor: '#1a7a4a',
              borderRadius: '2px',
            }}
            aria-hidden="true"
          />
          <p
            className="mt-5 text-lg"
            style={{ color: '#5a7080' }}
          >
            Search, plan, coordinate, and stay — all in one place.
          </p>
        </div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '20px' }}
        >
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <a
                key={action.title}
                href={action.href}
                className="quick-action-card group relative overflow-hidden flex flex-col cursor-pointer no-underline transition-all duration-200"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '28px',
                  textDecoration: 'none',
                }}
              >
                {/* Top color bar */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: '4px',
                    backgroundColor: action.color,
                  }}
                  aria-hidden="true"
                />

                {/* Large faded number */}
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    top: '12px',
                    right: '20px',
                    fontSize: '64px',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: hexToRgba(action.color, 0.06),
                  }}
                  aria-hidden="true"
                >
                  {action.number}
                </div>

                {/* Icon */}
                <div
                  className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: action.iconBg,
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={24} style={{ color: action.color }} strokeWidth={2.25} />
                </div>

                {/* Text */}
                <div className="relative">
                  <h3
                    className="text-base font-semibold mb-1.5"
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
                  className="quick-action-arrow relative mt-5 text-sm font-semibold inline-flex items-center"
                  style={{ color: action.color }}
                >
                  Get started
                  <span
                    className="quick-action-arrow-icon inline-block transition-transform duration-200"
                    style={{ marginLeft: '6px' }}
                  >
                    →
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
