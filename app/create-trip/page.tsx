'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { US_STATES, SPORTS } from '@/lib/states'
import { Copy, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

export default function CreateTripPage() {
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

    const { data: trip, error: tripErr } = await supabase
      .from('trips')
      .insert({
        name: tripName.trim(),
        invite_code: inviteCode,
        start_date: startDate,
        end_date: endDate,
        notes: notePayload,
        created_by: userId,
      })
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
          style={{ borderColor: '#1a7a4a' }}
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
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: '#0f1f2e' }}>
            Create a Team Trip
          </h1>
          <p className="text-base" style={{ color: '#5a7080' }}>
            Set up your tournament trip and invite your team to join.
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: '#dde8ee' }}
        >
          {/* Invite code box */}
          <div
            className="rounded-xl px-4 py-4 mb-6 flex items-center justify-between"
            style={{ backgroundColor: '#e6f7ee', border: '1px solid #bfe5cf' }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#1a7a4a' }}>
                Your invite code
              </p>
              <p className="text-2xl font-bold tracking-[0.2em]" style={{ color: '#0f1f2e' }}>
                {inviteCode}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#1a7a4a', color: 'white' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

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
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Trip name *
              </label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g. Cooperstown 2025 — 12U Tigers"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#1a7a4a')}
                onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Sport *
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white"
                style={inputStyle}
              >
                {SPORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
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
                onFocus={(e) => (e.target.style.borderColor = '#1a7a4a')}
                onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
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
                  onFocus={(e) => (e.target.style.borderColor = '#1a7a4a')}
                  onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white"
                  style={inputStyle}
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
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                  Start date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                  End date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Any notes for your team..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-y"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#1a7a4a')}
                onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              {submitting ? 'Creating trip...' : 'Create Trip'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
