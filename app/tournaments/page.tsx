'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { US_STATES, SPORTS } from '@/lib/states'
import { Search, MapPin, Calendar, Trophy } from 'lucide-react'
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
  gradient?: string | null
  badge?: string | null
}

const BRAND_GRADIENTS = [
  'linear-gradient(135deg, #1f4d38 0%, #2D6A4F 50%, #15331f 100%)',
  'linear-gradient(135deg, #1a3a5c 0%, #2a6496 50%, #0f2840 100%)',
  'linear-gradient(135deg, #7b3f00 0%, #c47a1e 50%, #5c2e00 100%)',
]

export default function TournamentsPage() {
  const [results, setResults] = useState<ResultCard[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState('All Sports')
  const [state, setState] = useState('All States')

  // Track whether the zero-results is because of filters or an empty DB so we
  // can show the venue fallback only in the "no filters yet" case.
  const [usedVenueFallback, setUsedVenueFallback] = useState(false)

  // Debounce the live refetch so we don't hammer Supabase on every keystroke.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      runSearch(query, sport, state)
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sport, state])

  async function runSearch(q: string, sportFilter: string, stateFilter: string) {
    setLoading(true)
    const supabase = createClient()

    const hasStateFilter = stateFilter !== 'All States'
    const hasSportFilter = sportFilter !== 'All Sports'
    const hasQuery = q.trim().length > 0

    // Use inner join when filtering by state so the query can reach into
    // tournament_venues.venues.state. Otherwise a plain left-join is fine.
    const venueSelect = hasStateFilter
      ? 'tournament_venues!inner(is_primary, venues!inner(id, name, city, state))'
      : 'tournament_venues(is_primary, venues(id, name, city, state))'

    let tq = supabase
      .from('tournaments')
      .select(`id, name, sport, start_date, end_date, ${venueSelect}`)
      .order('start_date', { ascending: true })
      .limit(200)

    if (hasSportFilter) {
      // Sport values in DB may be stored with different casing; ilike is safer.
      tq = tq.ilike('sport', `%${sportFilter}%`)
    }
    if (hasQuery) {
      tq = tq.ilike('name', `%${q.trim()}%`)
    }
    if (hasStateFilter) {
      tq = tq.eq('tournament_venues.venues.state', stateFilter)
    }

    const { data: tournaments, error: tErr } = await tq

    if (tErr) {
      console.error('Error fetching tournaments:', tErr)
    }

    const tournamentResults: ResultCard[] = (
      (tournaments as unknown as TournamentRow[]) || []
    )
      // When a state filter is applied with !inner, tournaments without a
      // matching venue are dropped; no extra client-side work needed. But keep
      // a defensive check for rows with zero venues.
      .filter((t) =>
        hasStateFilter ? (t.tournament_venues?.length || 0) > 0 : true
      )
      .map((t, i) => {
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
          subtitle: venue ? `${venue.name}` : 'Venue TBD',
          city: venue?.city || '',
          state: venue?.state || '',
          sport: t.sport,
          dates,
          source: 'tournament' as const,
          gradient: BRAND_GRADIENTS[i % BRAND_GRADIENTS.length],
        }
      })

    if (tournamentResults.length > 0) {
      setResults(tournamentResults)
      setUsedVenueFallback(false)
      setLoading(false)
      return
    }

    // Zero tournament results.
    // If any filter is active, show the "no results, clear filters" empty
    // state rather than silently swapping in a venue list.
    if (hasQuery || hasSportFilter || hasStateFilter) {
      setResults([])
      setUsedVenueFallback(false)
      setLoading(false)
      return
    }

    // No filters, no tournaments — fall back to venues so the page isn't blank.
    let vq = supabase.from('venues').select('*').limit(24)
    if (hasStateFilter) vq = vq.eq('state', stateFilter)
    const { data: venues, error: vErr } = await vq

    if (vErr) {
      console.error('Error fetching venues:', vErr)
      setResults([])
      setUsedVenueFallback(false)
      setLoading(false)
      return
    }

    const venueResults: ResultCard[] = ((venues as Venue[]) || []).map((v, i) => ({
      id: v.id,
      title: v.name,
      subtitle: v.description || 'Tournament venue',
      city: v.city,
      state: v.state,
      sport: v.sports && v.sports.length > 0 ? v.sports[0] : null,
      dates: v.season,
      source: 'venue' as const,
      gradient: v.gradient || BRAND_GRADIENTS[i % BRAND_GRADIENTS.length],
      badge: v.badge,
    }))

    setResults(venueResults)
    setUsedVenueFallback(true)
    setLoading(false)
  }

  const filterActive =
    query.trim().length > 0 || sport !== 'All Sports' || state !== 'All States'

  // Results already come filtered from the server; no additional client-side
  // narrowing needed. Keeping a pass-through useMemo for future additions.
  const filtered = useMemo(() => results, [results])

  const clearFilters = () => {
    setQuery('')
    setSport('All Sports')
    setState('All States')
  }

  return (
    <div style={{ backgroundColor: '#f5f8fa' }} className="min-h-screen">
      <Navbar />

      {/* Hero — dark navy */}
      <section
        className="relative px-4 py-16 lg:py-20 overflow-hidden"
        style={{ backgroundColor: '#0f1f2e' }}
      >
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #2D6A4F 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#f59e0b' }}
          >
            Find Your Tournament
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Where Teams Are Playing
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Search real tournaments nationwide and find the best team stays nearby.
          </p>

          {/* Search bar */}
          <div
            className="bg-white rounded-xl p-2 flex items-center gap-2 shadow-xl max-w-2xl mx-auto"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
          >
            <div className="relative flex-1 min-w-0">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#8fa3b2' }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by tournament name..."
                className="w-full pl-11 pr-4 py-3 rounded-lg text-sm outline-none"
                style={{ color: '#0f1f2e' }}
              />
            </div>
            <button
              type="button"
              onClick={() => runSearch(query, sport, state)}
              className="px-6 py-3 rounded-lg text-sm font-bold text-white transition-all whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
              }}
            >
              Search
            </button>
          </div>

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#f59e0b' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
            >
              <option style={{ color: '#0f1f2e' }}>All Sports</option>
              {SPORTS.map((s) => (
                <option key={s} style={{ color: '#0f1f2e' }}>{s}</option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#f59e0b' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
            >
              <option style={{ color: '#0f1f2e' }}>All States</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code} style={{ color: '#0f1f2e' }}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#f59e0b' }}
          >
            {usedVenueFallback ? 'Featured Venues' : 'Tournament Results'}
          </p>
          {!loading && filtered.length > 0 && (
            <p className="text-sm" style={{ color: '#5a7080' }}>
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ backgroundColor: '#e5e7eb', minHeight: '280px' }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center relative overflow-hidden"
            style={{ backgroundColor: '#0f1f2e' }}
          >
            <div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}
              >
                <MapPin size={36} style={{ color: '#f59e0b' }} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                {filterActive ? 'No tournaments match those filters' : 'No tournaments found'}
              </h3>
              <p
                className="text-base mb-8 max-w-md mx-auto"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {filterActive
                  ? 'Try clearing your filters or searching a broader area.'
                  : 'Check back soon — new tournaments are added every week.'}
              </p>
              {filterActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-px"
                  style={{
                    background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                    boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <a
                key={r.id}
                href={
                  r.source === 'tournament'
                    ? `/create-trip?tournament=${r.id}`
                    : `/create-trip?venue=${r.id}`
                }
                className="group block rounded-2xl overflow-hidden no-underline transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: r.gradient || BRAND_GRADIENTS[0],
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  minHeight: '280px',
                }}
              >
                <div className="flex flex-col h-full p-6">
                  <div className="flex items-start justify-between mb-auto">
                    <div>
                      {r.badge && (
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#f59e0b', color: '#0f1f2e' }}
                        >
                          {r.badge}
                        </span>
                      )}
                    </div>
                    {r.sport && (
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        {r.sport}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-h-8" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                      {r.title}
                    </h3>
                    <p
                      className="text-sm mb-3"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      <Trophy size={12} className="inline-block mr-1 -mt-0.5" />
                      {r.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5">
                      {(r.city || r.state) && (
                        <span
                          className="text-xs inline-flex items-center gap-1"
                          style={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          <MapPin size={11} />
                          {[r.city, r.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {r.dates && (
                        <span
                          className="text-xs inline-flex items-center gap-1"
                          style={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          <Calendar size={11} />
                          {r.dates}
                        </span>
                      )}
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
