'use client'
const destinations = [
  {
    id: 1,
    name: 'Cooperstown Dreams Park',
    city: 'Cooperstown, NY',
    description: 'Every 12U player\'s bucket list. 22 grass fields and memories that last a lifetime.',
    fields: '22 fields',
    stays: '40+ nearby stays',
    season: 'June – August',
    sports: ['⚾ Baseball'],
    gradient: 'linear-gradient(135deg, #0f4c2a 0%, #1a7a4a 50%, #0d3d20 100%)',
    badge: 'Most Popular',
  },
  {
    id: 2,
    name: 'Ripken Experience — Pigeon Forge',
    city: 'Pigeon Forge, TN',
    description: 'Baseball meets the Smoky Mountains. Turn tournament weekend into a family vacation.',
    fields: '6 fields',
    stays: '60+ nearby stays',
    season: 'April – October',
    sports: ['⚾ Baseball', '🥎 Softball'],
    gradient: 'linear-gradient(135deg, #1a3a5c 0%, #2a6496 50%, #0f2840 100%)',
    badge: null,
  },
  {
    id: 3,
    name: 'Ripken Experience — Myrtle Beach',
    city: 'Myrtle Beach, SC',
    description: 'Beach tournaments all season. Stay minutes from the fields and the ocean.',
    fields: '9 fields',
    stays: '80+ nearby stays',
    season: 'March – October',
    sports: ['⚾ Baseball', '⚽ Soccer'],
    gradient: 'linear-gradient(135deg, #0a3d62 0%, #1e6fa3 50%, #062a47 100%)',
    badge: 'Family Favorite',
  },
  {
    id: 4,
    name: 'Roger Dean Complex',
    city: 'Jupiter, FL',
    description: 'The most scouted amateur baseball event on earth. Where future pros get discovered.',
    fields: '13 fields',
    stays: '70+ nearby stays',
    season: 'Fall events',
    sports: ['⚾ Baseball'],
    gradient: 'linear-gradient(135deg, #7b3f00 0%, #c47a1e 50%, #5c2e00 100%)',
    badge: 'Elite Showcase',
  },
  {
    id: 5,
    name: 'East Cobb Complex',
    city: 'Marietta, GA',
    description: 'The capital of youth baseball. 35+ weeks of elite Perfect Game events every year.',
    fields: '11 fields',
    stays: '50+ nearby stays',
    season: 'Year round',
    sports: ['⚾ Baseball', '🥎 Softball'],
    gradient: 'linear-gradient(135deg, #1a4a1a 0%, #2d7a2d 50%, #0f300f 100%)',
    badge: null,
  },
  {
    id: 6,
    name: 'Surprise Stadium',
    city: 'Surprise, AZ',
    description: 'USA Baseball National Championships. Play on the same fields as MLB Spring Training.',
    fields: '13 fields',
    stays: '45+ nearby stays',
    season: 'Spring / Summer',
    sports: ['⚾ Baseball'],
    gradient: 'linear-gradient(135deg, #4a2800 0%, #8b5a1a 50%, #3a1e00 100%)',
    badge: null,
  },
]
export default function FeaturedDestinations() {
  return (
    <section
      className="py-16 lg:py-20"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#1a7a4a' }}
          >
            Find your next tournament
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: '#0f1f2e' }}
          >
            Where Teams Are Playing Right Now
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: '#5a7080' }}
          >
            Browse popular tournaments and instantly find
            the best places for your team to stay.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {destinations.map((dest) => (
            <a
              key={dest.id}
              href="#"
              className="group block no-underline rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{
                background: dest.gradient,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                minHeight: '320px',
              }}
            >
              <div className="flex flex-col h-full p-6">
                {/* Top row — badge left, sports right */}
                <div className="flex items-start justify-between mb-auto">
                  <div>
                    {dest.badge && (
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: '#f59e0b',
                          color: '#0f1f2e',
                        }}
                      >
                        {dest.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {dest.sports.map((sport) => (
                      <span
                        key={sport}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Spacer */}
                <div className="flex-1 min-h-8" />
                {/* Bottom content */}
                <div>
                  <h3
                    className="text-xl font-bold text-white mb-1 leading-tight"
                  >
                    {dest.name}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    📍 {dest.city}
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    {dest.description}
                  </p>
                  {/* Stats */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      🏟️ {dest.fields}
                    </span>
                    <span
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >·</span>
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      🏨 {dest.stays}
                    </span>
                    <span
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >·</span>
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      📅 {dest.season}
                    </span>
                  </div>
                  {/* CTA Button */}
                  <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 group-hover:gap-3"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    View Stays →
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        {/* View All CTA */}
        <div className="text-center">
          <a
            href="#tournaments"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-150 hover:opacity-90"
            style={{ backgroundColor: '#0f1f2e' }}
          >
            View All Tournaments →
          </a>
          <p
            className="text-sm mt-3"
            style={{ color: '#8fa3b2' }}
          >
            New tournaments added every week
          </p>
        </div>
      </div>
    </section>
  )
}
