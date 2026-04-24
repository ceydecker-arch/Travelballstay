'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin, Plus, Calendar, Users, ChevronRight, Trophy, Search } from 'lucide-react'
import { TripCardSkeleton, Skeleton } from '@/components/Skeleton'

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

function extractSport(notes: string | null): string | null {
  if (!notes) return null
  const match = notes.match(/Sport:\s*([^\n]+)/i)
  return match?.[1]?.trim() || null
}

function extractLocation(notes: string | null): string | null {
  if (!notes) return null
  const match = notes.match(/Location:\s*([^\n]+)/i)
  return match?.[1]?.trim() || null
}

function extractTournament(notes: string | null): string | null {
  if (!notes) return null
  const match = notes.match(/Tournament:\s*([^\n]+)/i)
  return match?.[1]?.trim() || null
}

const GREETINGS = [
  'Huddle up,',
  'Back in the dugout,',
  'Game face on,',
  "Let's rally the team,",
  'Ready for the next road trip,',
  'Tournament-bound,',
  'Welcome back to the lineup,',
  'Pack the car,',
  'Bases loaded,',
  'First pitch is calling,',
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [greeting, setGreeting] = useState(GREETINGS[0])
  const [tournamentCount, setTournamentCount] = useState<number | null>(null)
  const [venueCount, setVenueCount] = useState<number | null>(null)
  const [venueStateCount, setVenueStateCount] = useState<number | null>(null)

  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
  }, [])

  // Fetch live counts for the Quick Actions cards
  useEffect(() => {
    const supabase = createClient()
    async function loadCounts() {
      const [{ count: tCount }, { count: vCount }, { data: vStates }] = await Promise.all([
        supabase.from('tournaments').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('state'),
      ])
      if (typeof tCount === 'number') setTournamentCount(tCount)
      if (typeof vCount === 'number') setVenueCount(vCount)
      if (Array.isArray(vStates)) {
        const distinct = new Set(
          vStates.map((r: any) => r?.state).filter((s: any) => !!s)
        )
        setVenueStateCount(distinct.size)
      }
    }
    loadCounts()
  }, [])

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/signin'
        return
      }
      setUser(user)

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

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        {/* Dark header placeholder to match real page */}
        <div
          className="relative"
          style={{
            backgroundColor: '#0f1f2e',
            borderBottom: '2px solid #f59e0b',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                <MapPin size={18} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                <span style={{ color: 'white' }}>Travel</span>
                <span style={{ color: '#2D6A4F' }}>Ball</span>
                <span style={{ color: '#f59e0b' }}>Stay</span>
              </span>
            </div>
            <Skeleton width={120} height={40} rounded={12} />
          </div>
        </div>

        {/* Welcome placeholder */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-3">
            <Skeleton width={140} height={12} />
            <Skeleton width={220} height={32} />
          </div>
        </div>

        {/* Trip cards placeholder */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton width={200} height={20} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TripCardSkeleton />
            <TripCardSkeleton />
          </div>
        </div>
      </div>
    )
  }

  const displayName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'there'

  const fullName = user?.user_metadata?.full_name || user?.email || 'Welcome'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      {/* Top header bar — dark navy with amber bottom border */}
      <div
        className="relative"
        style={{
          backgroundColor: '#0f1f2e',
          borderBottom: '2px solid #f59e0b',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              <MapPin size={18} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span style={{ color: 'white' }}>Travel</span>
              <span style={{ color: '#2D6A4F' }}>Ball</span>
              <span style={{ color: '#f59e0b' }}>Stay</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline text-sm"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {fullName}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold px-3 py-2 rounded-lg transition-colors hidden sm:inline-block"
              style={{
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Sign out
            </button>
            <a
              href="/create-trip"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
              }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create a Trip</span>
              <span className="sm:hidden">New</span>
            </a>
          </div>
        </div>
      </div>

      {/* Welcome section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#f59e0b' }}
            >
              {greeting}
            </p>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: '#0f1f2e' }}
            >
              {displayName}
            </h1>
            <div
              className="mt-3"
              style={{
                width: '40px',
                height: '3px',
                backgroundColor: '#f59e0b',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Stats card */}
          <div
            className="rounded-2xl px-6 py-4 flex items-center gap-4"
            style={{
              backgroundColor: '#f5f8fa',
              border: '1px solid #dde8ee',
            }}
          >
            <div className="text-center">
              <p
                className="text-3xl font-extrabold leading-none"
                style={{ color: '#2D6A4F' }}
              >
                {trips.length}
              </p>
              <p
                className="text-xs mt-1 uppercase tracking-widest"
                style={{ color: '#8fa3b2' }}
              >
                My Trips
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section title */}
        <div
          className="mb-6"
          style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
        >
          <h2
            className="text-xl font-bold"
            style={{ color: '#0f1f2e' }}
          >
            My Tournament Trips
          </h2>
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
          /* Navy empty state */
          <div
            className="rounded-2xl p-12 text-center relative overflow-hidden mb-10"
            style={{ backgroundColor: '#0f1f2e' }}
          >
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}
              >
                <MapPin size={36} style={{ color: '#f59e0b' }} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">No trips yet</h3>
              <p
                className="text-base mb-8 max-w-md mx-auto"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Create your first team trip and invite your families to join. Everyone stays together.
              </p>
              <a
                href="/create-trip"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-px"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#0f1f2e',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Create Your First Trip →
              </a>
            </div>
          </div>
        ) : (
          /* Trip cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {trips.map((trip) => {
              const dateRange = formatDateRange(trip.start_date, trip.end_date)
              const sport = extractSport(trip.notes)
              const noteTournament = extractTournament(trip.notes)
              const noteLocation = extractLocation(trip.notes)
              const tournamentName = trip.tournament?.name || noteTournament
              const locationLine = trip.venue
                ? `${trip.venue.name} · ${trip.venue.city}, ${trip.venue.state}`
                : noteLocation
              return (
                <a
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="group block rounded-2xl bg-white p-6 no-underline transition-all duration-200 hover:-translate-y-1"
                  style={{
                    borderLeft: '4px solid #2D6A4F',
                    border: '1px solid #dde8ee',
                    borderLeftWidth: '4px',
                    borderLeftColor: '#2D6A4F',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Top row: name + sport tag */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-lg font-bold mb-1 truncate"
                        style={{ color: '#0f1f2e' }}
                      >
                        {trip.name}
                      </h3>
                      {tournamentName && (
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: '#2D6A4F' }}
                        >
                          {tournamentName}
                        </p>
                      )}
                    </div>
                    {sport && (
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex-shrink-0"
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#f59e0b',
                        }}
                      >
                        {sport}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-5">
                    {locationLine && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#5a7080' }}>
                        <MapPin size={14} style={{ color: '#8fa3b2' }} />
                        <span className="truncate">{locationLine}</span>
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

                  {/* Bottom row: code + CTA */}
                  <div
                    className="pt-4 flex items-center justify-between gap-3"
                    style={{ borderTop: '1px solid #f0f4f6' }}
                  >
                    <span
                      className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: '#e8f5ee',
                        color: '#2D6A4F',
                      }}
                    >
                      Code: {trip.invite_code}
                    </span>
                    <span
                      className="text-sm font-bold inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                      style={{ color: '#2D6A4F' }}
                    >
                      View Trip
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* Quick actions row */}
        <div
          className="mb-6"
          style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
        >
          <h2 className="text-xl font-bold" style={{ color: '#0f1f2e' }}>
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/tournaments"
            className="group block rounded-2xl bg-white p-5 no-underline transition-all duration-200 hover:-translate-y-1"
            style={{
              border: '1px solid #dde8ee',
              borderTop: '3px solid #2D6A4F',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#e8f5ee' }}
                >
                  <Search size={20} style={{ color: '#2D6A4F' }} />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#0f1f2e' }}>
                  Find Tournaments
                </h3>
                <p className="text-xs mt-1" style={{ color: '#5a7080' }}>
                  {tournamentCount !== null
                    ? `Search ${tournamentCount}+ events nationwide`
                    : 'Search events nationwide'}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
                style={{ color: '#8fa3b2' }}
              />
            </div>
          </a>

          <a
            href="/create-trip"
            className="group block rounded-2xl bg-white p-5 no-underline transition-all duration-200 hover:-translate-y-1"
            style={{
              border: '1px solid #dde8ee',
              borderTop: '3px solid #f59e0b',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#fef3c7' }}
                >
                  <Plus size={20} style={{ color: '#f59e0b' }} />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#0f1f2e' }}>
                  Create a Trip
                </h3>
                <p className="text-xs mt-1" style={{ color: '#5a7080' }}>
                  Organize your team&apos;s stay
                </p>
              </div>
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
                style={{ color: '#8fa3b2' }}
              />
            </div>
          </a>

          <a
            href="/tournaments"
            className="group block rounded-2xl bg-white p-5 no-underline transition-all duration-200 hover:-translate-y-1"
            style={{
              border: '1px solid #dde8ee',
              borderTop: '3px solid #0f1f2e',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: 'rgba(15,31,46,0.08)' }}
                >
                  <Trophy size={20} style={{ color: '#0f1f2e' }} />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#0f1f2e' }}>
                  Browse Venues
                </h3>
                <p className="text-xs mt-1" style={{ color: '#5a7080' }}>
                  {venueCount !== null && venueStateCount !== null
                    ? `${venueCount} complexes across ${venueStateCount} states`
                    : venueCount !== null
                    ? `${venueCount} complexes nationwide`
                    : 'Browse complexes nationwide'}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
                style={{ color: '#8fa3b2' }}
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
