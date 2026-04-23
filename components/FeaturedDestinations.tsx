'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
interface Venue {
  id: string
  name: string
  city: string
  state: string
  field_count: number
  description: string
  gradient: string
  badge: string | null
  sports: string[]
  nearby_stays: string
  season: string
}
export default function FeaturedDestinations() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchVenues() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .limit(6)
      if (error) {
        console.error('Error fetching venues:', error)
      } else {
        setVenues(data || [])
      }
      setLoading(false)
    }
    fetchVenues()
  }, [])
  if (loading) {
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map((i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{
                  backgroundColor: '#e5e7eb',
                  minHeight: '320px',
                }}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }
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
          {venues.map((venue) => (
            <a
              key={venue.id}
              href="#"
              className="group block no-underline rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{
                background: venue.gradient,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                minHeight: '320px',
              }}
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-start justify-between mb-auto">
                  <div>
                    {venue.badge && (
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: '#f59e0b',
                          color: '#0f1f2e',
                        }}
                      >
                        {venue.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {venue.sports?.map((sport) => (
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
                <div className="flex-1 min-h-8" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                    {venue.name}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    📍 {venue.city}, {venue.state}
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    {venue.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      🏟️ {venue.field_count} fields
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      🏨 {venue.nearby_stays}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      📅 {venue.season}
                    </span>
                  </div>
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
