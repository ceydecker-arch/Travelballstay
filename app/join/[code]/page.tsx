'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { MapPin, Users, Calendar, Trophy } from 'lucide-react'
import Navbar from '@/components/Navbar'

interface Trip {
  id: string
  name: string
  invite_code: string
  start_date: string | null
  end_date: string | null
  notes: string | null
  created_by: string | null
}

function extractField(notes: string | null, field: string): string | null {
  if (!notes) return null
  const re = new RegExp(`${field}\\s*:\\s*(.+)`, 'i')
  const match = notes.match(re)
  return match ? match[1].trim().split('\n')[0] : null
}

export default function JoinTripPage() {
  const params = useParams<{ code: string }>()
  const code = (params?.code || '').toUpperCase()

  const [loading, setLoading] = useState(true)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [memberCount, setMemberCount] = useState(0)
  const [alreadyMember, setAlreadyMember] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const { data: tripData, error: tripErr } = await supabase
        .from('trips')
        .select('*')
        .eq('invite_code', code)
        .maybeSingle()

      if (tripErr || !tripData) {
        console.error('Trip lookup failed:', tripErr)
        setNotFound(true)
        setLoading(false)
        return
      }

      setTrip(tripData as Trip)

      const { count } = await supabase
        .from('trip_members')
        .select('id', { count: 'exact', head: true })
        .eq('trip_id', tripData.id)
      setMemberCount(count || 0)

      if (user) {
        // Trip creator: skip the invite page entirely, send them home.
        if ((tripData as Trip).created_by === user.id) {
          window.location.href = `/trips/${tripData.id}`
          return
        }

        // Already a member? Mark so the button click just navigates rather than re-inserts.
        const { data: existing } = await supabase
          .from('trip_members')
          .select('id')
          .eq('trip_id', tripData.id)
          .eq('profile_id', user.id)
          .maybeSingle()
        if (existing) setAlreadyMember(true)
      }

      setLoading(false)
    }
    load()
  }, [code])

  const handleJoin = async () => {
    setError('')
    if (!trip) return

    if (!userId) {
      window.location.href = `/signup?redirect=/join/${code}`
      return
    }

    if (alreadyMember) {
      window.location.href = `/trips/${trip.id}`
      return
    }

    setJoining(true)
    const supabase = createClient()
    const { error: memberErr } = await supabase.from('trip_members').insert({
      trip_id: trip.id,
      profile_id: userId,
      role: 'member',
    })

    if (memberErr) {
      console.error('Error joining trip:', memberErr)
      setError(memberErr.message || 'Could not join this trip. Please try again.')
      setJoining(false)
      return
    }

    window.location.href = `/trips/${trip.id}`
  }

  // Amber accent bar (reused at top of every state)
  const AmberBar = () => (
    <div
      style={{
        height: '4px',
        background: 'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
      }}
    />
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <AmberBar />
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#2D6A4F' }}
          />
        </div>
      </div>
    )
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <AmberBar />
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div
            className="bg-white rounded-3xl border p-10 shadow-sm"
            style={{ borderColor: '#dde8ee' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#fef3c7' }}
            >
              <MapPin size={28} color="#f59e0b" />
            </div>
            <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#0f1f2e' }}>
              Trip not found
            </h1>
            <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
              Check your invite code and try again. Codes are six characters, letters and numbers.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
              }}
            >
              Back home
            </a>
          </div>
        </div>
      </div>
    )
  }

  const sport = extractField(trip.notes, 'Sport')
  const tournament = extractField(trip.notes, 'Tournament')
  const location = extractField(trip.notes, 'Location')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <AmberBar />
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-12 lg:py-16">
        {/* Invite label above card */}
        <div className="text-center mb-6">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
            style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1px solid rgba(245,158,11,0.3)',
            }}
          >
            You&apos;ve been invited
          </span>
        </div>

        {/* Trip preview card */}
        <div
          className="relative overflow-hidden rounded-3xl shadow-lg"
          style={{ backgroundColor: '#0f1f2e' }}
        >
          {/* Decorative glows */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #2D6A4F 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
          />

          <div className="relative z-10 p-8 lg:p-10">
            {/* Green map pin circle */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 4px 20px rgba(45,106,79,0.5)',
              }}
            >
              <MapPin size={28} color="white" strokeWidth={2.5} />
            </div>

            {sport && (
              <div className="text-center mb-3">
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.15)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  {sport}
                </span>
              </div>
            )}

            <h1 className="text-3xl lg:text-4xl font-extrabold text-center tracking-tight text-white mb-3">
              {trip.name}
            </h1>

            {tournament && (
              <p
                className="text-sm text-center mb-4 font-medium"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {tournament}
              </p>
            )}

            <div className="flex flex-col items-center gap-2 mb-6">
              {location && (
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <MapPin size={14} style={{ color: '#f59e0b' }} />
                  <span>{location}</span>
                </div>
              )}
              {(trip.start_date || trip.end_date) && (
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Calendar size={14} style={{ color: '#f59e0b' }} />
                  <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Users size={14} style={{ color: '#f59e0b' }} />
                  <p className="text-2xl font-extrabold" style={{ color: '#f59e0b' }}>
                    {memberCount}
                  </p>
                </div>
                <p
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {memberCount === 1 ? 'Family joined' : 'Families joined'}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Trophy size={14} style={{ color: '#f59e0b' }} />
                  <p className="text-2xl font-extrabold" style={{ color: '#f59e0b' }}>
                    {sport || '—'}
                  </p>
                </div>
                <p
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Sport
                </p>
              </div>
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 mb-4 text-sm"
                style={{
                  backgroundColor: 'rgba(220,38,38,0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(220,38,38,0.3)',
                }}
              >
                {error}
              </div>
            )}

            {/* Amber Join button */}
            <button
              type="button"
              onClick={handleJoin}
              disabled={joining}
              className="w-full py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f1f2e',
                boxShadow: '0 4px 20px rgba(245,158,11,0.5)',
              }}
            >
              {joining ? 'Joining...' : 'Join This Trip →'}
            </button>
            {!userId && !alreadyMember && (
              <p
                className="text-center text-xs mt-3"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                You&apos;ll create a free account first — takes 30 seconds.
              </p>
            )}
          </div>
        </div>

        {/* Not-logged-in helper below card */}
        {!userId && (
          <p className="text-center text-sm mt-6" style={{ color: '#5a7080' }}>
            Already have an account?{' '}
            <a
              href={`/signin?redirect=/join/${code}`}
              className="font-bold"
              style={{ color: '#2D6A4F' }}
            >
              Sign in
            </a>
          </p>
        )}

        {/* Trust tagline */}
        <p
          className="text-center text-xs mt-8 font-semibold tracking-wide"
          style={{ color: '#8fa3b2' }}
        >
          Where teams stay together.
        </p>
      </div>
    </div>
  )
}

function formatDate(iso: string | null) {
  if (!iso) return ''
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

function formatDateRange(start: string | null, end: string | null) {
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`
  if (start) return formatDate(start)
  if (end) return formatDate(end)
  return ''
}
