'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { US_STATES, SPORTS } from '@/lib/states'
import { Copy, Check, MapPin } from 'lucide-react'
import Navbar from '@/components/Navbar'

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

function CreateTripPageInner() {
  const searchParams = useSearchParams()
  const tournamentIdParam = searchParams.get('tournament')
  const venueIdParam = searchParams.get('venue')

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const [tripName, setTripName] = useState('')
  const [sport, setSport] = useState(SPORTS[0])
  const [tournamentName, setTournamentName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [copied, setCopied] = useState(false)

  // FK IDs we'll save on the trip row if we have them
  const [tournamentId, setTournamentId] = useState<string | null>(null)
  const [venueId, setVenueId] = useState<string | null>(null)
  const [prefillLabel, setPrefillLabel] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/signin'
      } else {
        setUserId(user.id)
        setCheckingAuth(false)
      }
    })
    setInviteCode(generateInviteCode())
  }, [])

  // Prefill form when ?tournament=<id> or ?venue=<id> is present
  useEffect(() => {
    async function prefillFromTournament(id: string) {
      const supabase = createClient()
      const { data, error: pfErr } = await supabase
        .from('tournaments')
        .select(
          `id, name, sport, start_date, end_date,
           tournament_venues(is_primary, venues(id, name, city, state))`
        )
        .eq('id', id)
        .single()

      if (pfErr || !data) {
        console.error('Prefill tournament error:', pfErr)
        return
      }

      const t: any = data
      const primary =
        (t.tournament_venues || []).find((tv: any) => tv.is_primary) ||
        (t.tournament_venues || [])[0]
      const venue = primary?.venues

      setTournamentId(t.id)
      if (venue?.id) setVenueId(venue.id)

      setTournamentName(t.name || '')
      if (t.sport && SPORTS.includes(t.sport)) setSport(t.sport)
      if (t.start_date) setStartDate(t.start_date)
      if (t.end_date) setEndDate(t.end_date)
      if (venue?.city) setCity(venue.city)
      if (venue?.state) setState(venue.state)

      // Suggest a trip name the user can edit
      const year = t.start_date ? new Date(t.start_date).getFullYear() : ''
      setTripName(year ? `${t.name} ${year} — My Team` : `${t.name} — My Team`)
      setPrefillLabel(`Prefilled from tournament: ${t.name}`)
    }

    async function prefillFromVenue(id: string) {
      const supabase = createClient()
      const { data, error: pfErr } = await supabase
        .from('venues')
        .select('id, name, city, state, sports')
        .eq('id', id)
        .single()

      if (pfErr || !data) {
        console.error('Prefill venue error:', pfErr)
        return
      }

      setVenueId(data.id)
      setTournamentName(data.name || '')
      if (data.city) setCity(data.city)
      if (data.state) setState(data.state)
      if (data.sports && data.sports.length > 0) {
        const match = SPORTS.find(
          (s) => s.toLowerCase() === String(data.sports[0]).toLowerCase()
        )
        if (match) setSport(match)
      }
      setTripName(`${data.name} — My Team`)
      setPrefillLabel(`Prefilled from venue: ${data.name}`)
    }

    if (tournamentIdParam) {
      prefillFromTournament(tournamentIdParam)
    } else if (venueIdParam) {
      prefillFromVenue(venueIdParam)
    }
  }, [tournamentIdParam, venueIdParam])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!tripName.trim() || !tournamentName.trim() || !city.trim() || !state || !startDate || !endDate) {
      setError('Please fill in all required fields.')
      return
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date.')
      return
    }
    if (!userId) {
      setError('You must be signed in to create a trip.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()

    const notePayload = [
      `Sport: ${sport}`,
      `Tournament: ${tournamentName}`,
      `Location: ${city}, ${state}`,
      notes.trim() ? `\n${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    const insertPayload: Record<string, any> = {
      name: tripName.trim(),
      invite_code: inviteCode,
      start_date: startDate,
      end_date: endDate,
      notes: notePayload,
      created_by: userId,
    }
    // Only set FK columns when we have them so we don't clobber with null
    if (tournamentId) insertPayload.tournament_id = tournamentId
    if (venueId) insertPayload.venue_id = venueId

    const { data: trip, error: tripErr } = await supabase
      .from('trips')
      .insert(insertPayload)
      .select('id')
      .single()

    if (tripErr || !trip) {
      console.error('Error creating trip:', tripErr)
      setError(tripErr?.message || 'Could not create trip. Please try again.')
      setSubmitting(false)
      return
    }

    const { error: memberErr } = await supabase.from('trip_members').insert({
      trip_id: trip.id,
      profile_id: userId,
      role: 'organizer',
    })

    if (memberErr) {
      console.error('Error adding creator as member:', memberErr)
      // Non-fatal — trip was created. Continue to the trip page.
    }

    window.location.href = `/trips/${trip.id}`
  }

  if (checkingAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f5f8fa' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#2D6A4F' }}
        />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    borderColor: '#dde8ee',
    color: '#0f1f2e',
  }
  const labelStyle: React.CSSProperties = {
    color: '#0f1f2e',
    fontWeight: 600,
  }
  const focusStyles = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = '#2D6A4F'
      e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.15)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = '#dde8ee'
      e.target.style.boxShadow = 'none'
    },
  }

  const sectionHeader = (label: string) => (
    <h3
      className="text-xs font-bold uppercase tracking-widest mb-4 mt-2"
      style={{ color: '#2D6A4F' }}
    >
      {label}
    </h3>
  )

  const steps = [
    { num: 1, title: 'Fill out your trip details', text: 'Tournament, location, and dates.' },
    { num: 2, title: 'Share your invite code with families', text: 'Send the 6-character code to your team.' },
    { num: 3, title: 'Everyone joins and marks their stay', text: 'See who booked and who still needs to.' },
  ]

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#f5f8fa' }}>
      {/* Amber accent bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{
          height: '4px',
          background: 'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
        }}
      />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: '#f59e0b' }}
          >
            Trip Planner
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#0f1f2e' }}>
            Create a Team Trip
          </h1>
          <p className="text-base" style={{ color: '#5a7080' }}>
            Set up your tournament trip and invite your team to join.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Left column — Form (60%) */}
          <div className="lg:col-span-3">
            <div
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
              style={{
                borderTop: '4px solid #2D6A4F',
                border: '1px solid #dde8ee',
                borderTopWidth: '4px',
                borderTopColor: '#2D6A4F',
              }}
            >
              {/* Prominent invite code box */}
              <div
                className="rounded-xl p-5 mb-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0f1f2e 0%, #1a2d3d 100%)',
                }}
              >
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
                />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: '#f59e0b' }}
                    >
                      Your Team Invite Code
                    </p>
                    <p
                      className="text-3xl font-extrabold tracking-[0.2em] text-white font-mono truncate"
                    >
                      {inviteCode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: '#f59e0b', color: '#0f1f2e' }}
                  >
                    {copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} strokeWidth={2.5} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {prefillLabel && (
                <div
                  className="rounded-xl px-4 py-3 mb-4 text-xs font-semibold"
                  style={{
                    backgroundColor: '#e8f5ee',
                    color: '#1f4d38',
                    border: '1px solid #a8d5be',
                  }}
                >
                  {prefillLabel}
                </div>
              )}

              {error && (
                <div
                  className="rounded-xl px-4 py-3 mb-4 text-sm"
                  style={{
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {sectionHeader('Trip Details')}
                <div>
                  <label className="block text-sm mb-1.5" style={labelStyle}>
                    Trip name *
                  </label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="e.g. Cooperstown 2026 — 12U Tigers"
                    required
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={inputStyle}
                    {...focusStyles}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1.5" style={labelStyle}>
                    Sport *
                  </label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white transition-all"
                    style={inputStyle}
                    {...focusStyles}
                  >
                    {SPORTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1.5" style={labelStyle}>
                    Tournament / venue name *
                  </label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    placeholder="e.g. Cooperstown Dreams Park"
                    required
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={inputStyle}
                    {...focusStyles}
                  />
                </div>

                <div className="pt-2">{sectionHeader('Location & Dates')}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1.5" style={labelStyle}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cooperstown"
                      required
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={inputStyle}
                      {...focusStyles}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={labelStyle}>
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white transition-all"
                      style={inputStyle}
                      {...focusStyles}
                    >
                      <option value="">Select a state</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1.5" style={labelStyle}>
                      Start date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={inputStyle}
                      {...focusStyles}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={labelStyle}>
                      End date *
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={inputStyle}
                      {...focusStyles}
                    />
                  </div>
                </div>

                <div className="pt-2">{sectionHeader('Additional Info')}</div>

                <div>
                  <label className="block text-sm mb-1.5" style={labelStyle}>
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Any notes for your team..."
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-y"
                    style={inputStyle}
                    {...focusStyles}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl text-base font-bold text-white transition-all duration-150 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                    boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
                  }}
                >
                  {submitting ? 'Creating trip...' : 'Create Trip & Get Invite Code →'}
                </button>
              </form>
            </div>
          </div>

          {/* Right column — Info panel (40%) */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sm:p-7 sticky top-6 relative overflow-hidden"
              style={{ backgroundColor: '#0f1f2e' }}
            >
              <div
                className="absolute -top-16 -right-16 w-60 h-60 rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={20} style={{ color: '#f59e0b' }} />
                  <h3 className="text-xl font-bold text-white">How it works</h3>
                </div>

                <div className="space-y-5 mb-6">
                  {steps.map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{
                          backgroundColor: '#f59e0b',
                          color: '#0f1f2e',
                        }}
                      >
                        {step.num}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white mb-0.5">
                          {step.title}
                        </p>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Amber bordered call-out */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    border: '1px solid rgba(245,158,11,0.4)',
                    backgroundColor: 'rgba(245,158,11,0.08)',
                  }}
                >
                  <p className="text-sm leading-relaxed text-white">
                    Your whole team will be able to see where everyone is staying on the team map.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateTripPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#f5f8fa' }}
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#2D6A4F' }}
          />
        </div>
      }
    >
      <CreateTripPageInner />
    </Suspense>
  )
}
