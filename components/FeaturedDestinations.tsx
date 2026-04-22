const destinations = [
  {
    city: 'Cooperstown, NY',
    description:
      "Every 12U player's bucket list. 22 grass fields, the Baseball Hall of Fame, and memories that last a lifetime. Plan your trip early — weeks fill fast.",
    sports: ['⚾ Baseball'],
    accent: '#1a7a4a',
  },
  {
    city: 'Pigeon Forge, TN',
    description:
      'Turn tournament weekend into a family vacation. Baseball in the shadow of the Smoky Mountains with Dollywood, great restaurants, and something for everyone.',
    sports: ['⚾ Baseball', '🥎 Softball'],
    accent: '#f59e0b',
  },
  {
    city: 'Myrtle Beach, SC',
    description:
      'Beach tournaments all season long. Stay minutes from the fields and the ocean. One of the most family-friendly tournament destinations in the country.',
    sports: ['⚾ Baseball', '⚽ Soccer', '🏐 Volleyball'],
    accent: '#2a7fc4',
  },
  {
    city: 'Jupiter, FL',
    description:
      'Home of the WWBA World Championship — the most scouted amateur baseball event on earth. Where future pros get their shot in front of 700+ MLB scouts.',
    sports: ['⚾ Baseball'],
    accent: '#1a7a4a',
  },
  {
    city: 'Marietta, GA',
    description:
      "The capital of youth baseball. Home of Perfect Game's Southeast hub and East Cobb Baseball Complex — 35+ weeks of elite events every year.",
    sports: ['⚾ Baseball', '🥎 Softball'],
    accent: '#f59e0b',
  },
  {
    city: 'Surprise, AZ',
    description:
      'Where USA Baseball holds its National Team Championships. Play on the same fields as the Royals and Rangers — and enjoy perfect Arizona weather.',
    sports: ['⚾ Baseball'],
    accent: '#2a7fc4',
  },
]

export default function FeaturedDestinations() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#f5f8fa' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="section-title">Popular tournament destinations</h2>
          <p className="section-subtitle">The cities families travel to most</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest) => (
            <a
              key={dest.city}
              href="#"
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 no-underline"
              style={{ textDecoration: 'none' }}
            >
              {/* Colored top accent bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: dest.accent }} />

              <div className="p-6">
                {/* City */}
                <h3
                  className="text-lg font-bold mb-2 transition-colors group-hover:text-green-700"
                  style={{ color: '#0f1f2e' }}
                >
                  📍 {dest.city}
                </h3>

                {/* Description */}
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#5a7080' }}>
                  {dest.description}
                </p>

                {/* Sport tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {dest.sports.map((sport) => (
                    <span
                      key={sport}
                      className="inline-block text-xs font-medium px-2.5 py-1 rounded-full border"
                      style={{
                        borderColor: '#dde8ee',
                        color: '#4a5e6d',
                        backgroundColor: '#f5f8fa',
                      }}
                    >
                      {sport}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <span
                  className="text-sm font-semibold flex items-center gap-1 transition-all duration-150 group-hover:gap-2"
                  style={{ color: dest.accent }}
                >
                  View trips →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
