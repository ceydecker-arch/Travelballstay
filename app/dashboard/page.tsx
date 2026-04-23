'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin, Plus, Calendar, Users, ChevronRight } from 'lucide-react'

interface Trip {
  id: string
  name: string
  invite_code: string
  start_date: string | null
  end_date: string | null
  notes: string | null
  created_at: string | null
  tournament: { name: string } | null
  venue: { name: string; city: string; state: string } | null
  member_count: number
}

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return null
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt((start || end) as string)
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/signin'
        return
      }
      setUser(user)

      // RLS ensures we only get trips the user is a member of or created
      const { data, error } = await supabase
        .from('trips')
        .select(`
          id,
          name,
          invite_code,
          start_date,
          end_date,
          notes,
          created_at,
          tournament:tournaments ( name ),
          venue:venues ( name, city, state ),
          trip_members ( count )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading trips:', error)
        setError(error.message)
      } else {
        const normalized: Trip[] = (data || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          invite_code: row.invite_code,
          start_date: row.start_date,
          end_date: row.end_date,
          notes: row.notes,
          created_at: row.created_at,
          tournament: Array.isArray(row.tournament) ? row.tournament[0] : row.tournament,
          venue: Array.isArray(row.venue) ? row.venue[0] : row.venue,
          member_count: row.trip_members?.[0]?.count ?? 0,
        }))
        setTrips(normalized)
      }
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f5f8fa' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#1a7a4a' }}
        />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      {/* Header */}
      <div
        className="bg-white border-b px-4 py-4"
        style={{ borderColor: '#dde8ee' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              <MapPin size={16} color="white" strokeWidth={2.5} />
            </div>
            <span
              className="text-lg font-bold"
              style={{ color: '#1a7a4a' }}
            >
              TravelBallStay
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span
              className="text-sm"
              style={{ color: '#5a7080' }}
            >
              {user?.user_metadata?.full_name || user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: '#0f1f2e' }}
            >
              My Trips
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: '#5a7080' }}
            >
              Manage your tournament trips and team stays
            </p>
          </div>
          <a
            href="/create-trip"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#1a7a4a' }}
          >
            <Plus size={16} />
            Create a Trip
          </a>
        </div>

        {error && (
          <div
            className="rounded-xl p-4 mb-6 text-sm"
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
            }}
          >
            Couldn&apos;t load your trips: {error}
          </div>
        )}

        {trips.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-2xl border-2 border-dashed p-12 text-center"
            style={{ borderColor: '#dde8ee' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#e6f7ee' }}
            >
              <MapPin size={28} style={{ color: '#1a7a4a' }} />
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: '#0f1f2e' }}
            >
              No trips yet
            </h3>
            <p
              className="text-sm mb-6 max-w-sm mx-auto"
              style={{ color: '#5a7080' }}
            >
              Create your first team trip and invite your
              families to join. Everyone stays together.
            </p>
            <a
              href="/create-trip"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              <Plus size={16} />
              Create your first trip
            </a>
          </div>
        ) : (
          /* Trip list */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((trip) => {
              const dateRange = formatDateRange(trip.start_date, trip.end_date)
              return (
                <a
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="group block rounded-2xl bg-white p-6 no-underline transition-all duration-200 hover:-translate-y-1"
                  style={{
                    border: '1px solid #dde8ee',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-lg font-bold mb-1 truncate"
                        style={{ color: '#0f1f2e' }}
                      >
                        {trip.name}
                      </h3>
                      {trip.tournament?.name && (
                        <p className="text-sm truncate" style={{ color: '#1a7a4a', fontWeight: 600 }}>
                          {trip.tournament.name}
                        </p>
                      )}
                    </div>
                    <ChevronRight
                      size={20}
                      className="flex-shrink-0 transition-transform group-hover:translate-x-1"
                      style={{ color: '#8fa3b2' }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    {trip.venue && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#5a7080' }}>
                        <MapPin size={14} style={{ color: '#8fa3b2' }} />
                        <span className="truncate">
                          {trip.venue.name} · {trip.venue.city}, {trip.venue.state}
                        </span>
                      </div>
                    )}
                    {dateRange && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#5a7080' }}>
                        <Calendar size={14} style={{ color: '#8fa3b2' }} />
                        <span>{dateRange}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#5a7080' }}>
                      <Users size={14} style={{ color: '#8fa3b2' }} />
                      <span>
                        {trip.member_count} {trip.member_count === 1 ? 'family' : 'families'}
                      </span>
                    </div>
                  </div>

                  <div
                    className="pt-4 flex items-center justify-between text-xs"
                    style={{ borderTop: '1px solid #f0f4f6', color: '#8fa3b2' }}
                  >
                    <span>
                      Code: <span className="font-mono font-semibold" style={{ color: '#0f1f2e' }}>{trip.invite_code}</span>
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: '#1a7a4a' }}
                    >
                      View trip →
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
