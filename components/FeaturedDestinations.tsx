'use client'
import { MapPin, Building2, Calendar, Users } from 'lucide-react'
const destinations = [
  {
    id: 1,
    name: 'Cooperstown Dreams Park',
    city: 'Cooperstown',
    state: 'NY',
    description: "Every 12U player's bucket list. 22 grass fields and memories that last a lifetime.",
    fields: '22 fields',
    stays: '40+ nearby stays',
    season: 'June – August',
    sports: ['⚾ Baseball'],
    gradient: 'linear-gradient(135deg, #0f4c2a 0%, #1a7a4a 50%, #0d3d20 100%)',
    badge: 'Most Popular',
    featured: true,
    teams: '180+ teams planned trips here',
  },
  {
    id: 2,
    name: 'Ripken Experience — Pigeon Forge',
    city: 'Pigeon Forge',
    state: 'TN',
    description: 'Baseball meets the Smoky Mountains. Turn tournament weekend into a family vacation.',
    fields: '6 fields',
    stays: '60+ nearby stays',
    season: 'April – October',
    sports: ['⚾ Baseball', '🥎 Softball'],
    gradient: 'linear-gradient(135deg, #1a3a5c 0%, #2a6496 50%, #0f2840 100%)',
    badge: null,
    featured: false,
    teams: '94 teams planned trips here',
  },
  {
    id: 3,
    name: 'Ripken Experience — Myrtle Beach',
    city: 'Myrtle Beach',
    state: 'SC',
    description: 'Beach tournaments all season. Stay minutes from the fields and the ocean.',
    fields: '9 fields',
    stays: '80+ nearby stays',
    season: 'March – October',
    sports: ['⚾ Baseball', '⚽ Soccer'],
    gradient: 'linear-gradient(135deg, #0a3d62 0%, #1e6fa3 50%, #062a47 100%)',
    badge: 'Family Favorite',
    featured: false,
    teams: '112 teams planned trips here',
  },
  {
    id: 4,
    name: 'Roger Dean Complex',
    city: 'Jupiter',
    state: 'FL',
    description: 'The most scouted amateur baseball event on earth. Where future pros get discovered.',
    fields: '13 fields',
    stays: '70+ nearby stays',
    season: 'Fall events',
    sports: ['⚾ Baseball'],
    gradient: 'linear-gradient(135deg, #7b3f00 0%, #c47a1e 50%, #5c2e00 100%)',
    badge: 'Elite Showcase',
    featured: false,
    teams: '67 teams planned trips here',
  },
  {
    id: 5,
    name: 'East Cobb Complex',
    city: 'Marietta',
    state: 'GA',
    description: 'The capital of youth baseball. 35+ weeks of elite Perfect Game events every year.',
    fields: '11 fields',
    stays: '50+ nearby stays',
    season: 'Year round',
    sports: ['⚾ Baseball', '🥎 Softball'],
    gradient: 'linear-gradient(135deg, #1a4a1a 0%, #2d7a2d 50%, #0f300f 100%)',
    badge: null,
    featured: false,
    teams: '143 teams planned trips here',
  },
  {
    id: 6,
    name: 'Surprise Stadium',
    city: 'Surprise',
    state: 'AZ',
    description: 'USA Baseball National Championships. Play on the same fields as MLB Spring Training.',
    fields: '13 fields',
    stays: '45+ nearby stays',
    season: 'Spring / Summer',
    sports: ['⚾ Baseball'],
    gradient: 'linear-gradient(135deg, #4a2800 0%, #8b5a1a 50%, #3a1e00 100%)',
    badge: null,
    featured: false,
    teams: '58 teams planned trips here',
  },
]
export default function FeaturedDestinations() {
  return (
    <section
      className="py-16 lg:py-20"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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
        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {destinations.map((dest) => (
            <a
              key={dest.id}
              href="#"
              className="group relative rounded-2xl overflow-hidden no-underline block transition-all duration-300 hover:-translate-y-2"
              style={{
                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                minHeight: dest.featured ? '320px' : '280px',
              }}
            >
              {/* Gradient background */}
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{ background: dest.gradient }}
              />
              {/* Dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)',
                }}
              />
              {/* Badge */}
              {dest.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: dest.featured
                        ? '#f59e0b'
                        : 'rgba(255,255,255,0.2)',
                      color: dest.featured ? '#0f1f2e' : 'white',
                      backdropFilter: 'blur(8px)',
                      border: dest.featured
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {dest.badge}
                  </span>
                </div>
              )}
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                {/* Sport tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {dest.sports.map((sport) => (
                    <span
                      key={sport}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                {/* Venue name + location */}
                <h3 className="text-xl font-bold text-white mb-1">
                  {dest.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin
                    size={13}
                    color="rgba(255,255,255,0.7)"
                    strokeWidth={2}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {dest.city}, {dest.state}
                  </span>
                </div>
                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {dest.description}
                </p>
                {/* Stats row */}
                <div className="flex flex-wrap gap-3 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Building2
                      size={13}
                      color="rgba(255,255,255,0.6)"
                      strokeWidth={2}
                    />
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {dest.fields}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2
                      size={13}
                      color="rgba(255,255,255,0.6)"
                      strokeWidth={2}
                    />
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {dest.stays}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar
                      size={13}
                      color="rgba(255,255,255,0.6)"
                      strokeWidth={2}
                    />
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {dest.season}
                    </span>
                  </div>
                </div>
                {/* Teams stat */}
                <div className="flex items-center gap-1.5 mb-4">
                  <Users
                    size={13}
                    color="#1a7a4a"
                    strokeWidth={2}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: '#6fdba9' }}
                  >
                    {dest.teams}
                  </span>
                </div>
                {/* CTA Button */}
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 group-hover:gap-3 w-fit"
                  style={{
                    backgroundColor: 'rgba(26,122,74,0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(26,122,74,0.5)',
                  }}
                >
                  View Stays
                  <span>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {/* View All CTA */}
        <div className="text-center">
          <a
            href="#tournaments"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#0f1f2e' }}
          >
            View All Tournaments
            <span>→</span>
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
