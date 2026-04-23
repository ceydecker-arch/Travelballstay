'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { US_STATES, SPORTS } from '@/lib/states'
import { Search } from 'lucide-react'
import Navbar from '@/components/Navbar'

interface Venue {
  id: string
  name: string
  city: string
  state: string
  field_count: number | null
  description: string | null
  gradient: string | null
  badge: string | null
  sports: string[] | null
  nearby_stays: string | null
  season: string | null
}

interface TournamentRow {
  id: string
  name: string
  sport: string | null
  start_date: string | null
  end_date: string | null
  tournament_venues: Array<{
    is_primary: boolean | null
    venues: {
      id: string
      name: string
      city: string
      state: string
    } | null
  }>
}

interface ResultCard {
  id: string
  title: string
  subtitle: string
  city: string
  state: string
  sport: string | null
  dates: string | null
  source: 'tournament' | 'venue'
}

export default function TournamentsPage() {
  const [results, setResults] = useState<ResultCard[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState('All Sports')
  const [state, setState] = useState('All States')

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      // Try tournaments first
      const { data: tournaments, error: tErr } = await supabase
        .from('tournaments')
        .select(
          'id, name, sport, start_date, end_date, tournament_venues(is_primary, venues(id, name, city, state))'
        )
        .order('start_date', { ascending: true })
        .limit(50)

      if (tErr) {
        console.error('Error fetching tournaments:', tErr)
      }

      const tournamentResults: ResultCard[] = (
        (tournaments as unknown as TournamentRow[]) || []
      )
        .map((t) => {
          const primary =
            t.tournament_venues?.find((tv) => tv.is_primary) ||
            t.tournament_venues?.[0]
          const venue = primary?.venues
          const dates =
            t.start_date && t.end_date
              ? formatDateRange(t.start_date, t.end_date)
              : t.start_date
              ? formatDate(t.start_date)
              : null
          return {
            id: t.id,
            title: t.name,
            subtitle: venue ? `${venue.name} · ${venue.city}, ${venue.state}` : 'Venue TBD',
            city: venue?.city || '',
            state: venue?.state || '',
            sport: t.sport,
            dates,
            source: 'tournament' as const,
          }
        })

      if (tournamentResults.length > 0) {
        setResults(tournamentResults)
        setLoading(false)
        return
      }

      // Fallback to venues
      const { data: venues, error: vErr } = await supabase
        .from('venues')
        .select('*')
        .limit(24)

      if (vErr) {
        console.error('Error fetching venues:', vErr)
        setResults([])
        setLoading(false)
        return
      }

      const venueResults: ResultCard[] = ((venues as Venue[]) || []).map((v) => ({
        id: v.id,
        title: v.name,
        subtitle: v.description || 'Tournament venue',
        city: v.city,
        state: v.state,
        sport: v.sports && v.sports.length > 0 ? v.sports[0] : null,
        dates: v.season,
        source: 'venue' as const,
      }))

      setResults(venueResults)
      setLoading(false)
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return results.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q) && !r.city.toLowerCase().includes(q)) {
        return false
      }
      if (sport !== 'All Sports') {
        const rSport = (r.sport || '').toLowerCase()
        if (!rSport.includes(sport.toLowerCase())) return false
      }
      if (state !== 'All States') {
        if (r.state !== state) return false
      }
      return true
    })
  }, [results, query, sport, state])

  return (
    <div style={{ backgroundColor: '#f5f8fa' }} className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="px-4 py-16 lg:py-20"
        style={{ backgroundColor: '#0f1f2e' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Find Your Tournament
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            Search thousands of youth travel sports tournaments nationwide.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div
          className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3"
          style={{ borderColor: '#dde8ee' }}
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#8fa3b2' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or city..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
              onFocus={(e) => (e.target.style.borderColor = '#2D6A4F')}
              onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
            />
          </div>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="px-4 py-3 rounded-xl border text-sm outline-none bg-white"
            style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
          >
            <option>All Sports</option>
            {SPORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="px-4 py-3 rounded-xl border text-sm outline-none bg-white"
            style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
          >
            <option>All States</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#2D6A4F' }}
          >
            Search
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ backgroundColor: '#e5e7eb', minHeight: '220px' }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center rounded-2xl border-2 border-dashed py-16"
            style={{ borderColor: '#dde8ee' }}
          >
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: '#0f1f2e' }}
            >
              No tournaments found
            </h3>
            <p className="text-sm" style={{ color: '#5a7080' }}>
              Try a different search or clear your filters.
            </p>
          </div>
        ) : (
          <>
            <p
              className="text-sm mb-5"
              style={{ color: '#5a7080' }}
            >
              Showing {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border p-6 flex flex-col"
                  style={{ borderColor: '#dde8ee' }}
                >
                  {r.sport && (
                    <span
                      className="self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                      style={{
                        backgroundColor: '#e8f5ee',
                        color: '#2D6A4F',
                      }}
                    >
                      {r.sport}
                    </span>
                  )}
                  <h3
                    className="text-lg font-bold leading-tight mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    {r.title}
                  </h3>
                  <p
                    className="text-sm mb-1"
                    style={{ color: '#5a7080' }}
                  >
                    {r.subtitle}
                  </p>
                  {(r.city || r.state) && (
                    <p className="text-xs mb-3" style={{ color: '#8fa3b2' }}>
                      📍 {[r.city, r.state].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {r.dates && (
                    <p className="text-xs mb-4" style={{ color: '#8fa3b2' }}>
                      📅 {r.dates}
                    </p>
                  )}
                  <a
                    href="#"
                    className="mt-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 self-start"
                    style={{ backgroundColor: '#2D6A4F' }}
                  >
                    View Stays →
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatDateRange(start: string, end: string) {
  return `${formatDate(start)} – ${formatDate(end)}`
}
