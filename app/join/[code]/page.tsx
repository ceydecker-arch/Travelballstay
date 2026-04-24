'use client'

import { useEffect, useRef, useState } from 'react'
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

  // Guard so a late-arriving auth event doesn't trigger a second auto-join.
  const autoJoinRanRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()

    // Insert the user into trip_members and send them to the trip page.
    // If they're already a member (race / double-fire), just redirect.
    async function performAutoJoin(tripData: Trip, uid: string) {
      if (autoJoinRanRef.current) return
      autoJoinRanRef.current = true

      // Creator → straight to trip.
      if (tripData.created_by === uid) {
        window.location.href = `/trips/${tripData.id}`
        return
      }

      // Already a member → straight to trip.
      const { data: existing } = await supabase
        .from('trip_members')
        .select('id')
        .eq('trip_id', tripData.id)
        .eq('profile_id', uid)
        .maybeSingle()
      if (existing) {
        window.location.href = `/trips/${tripData.id}`
        return
      }

      // Otherwise, auto-add them as a member and redirect.
      const { error: memberErr } = await supabase.from('trip_members').insert({
        trip_id: tripData.id,
        profile_id: uid,
        role: 'member',
      })
      if (memberErr) {
        console.error('Auto-join error:', memberErr)
        // If the insert failed, fall back to showing the preview + button
        // so the user can at least try manually. Release the guard.
        autoJoinRanRef.current = false
        setError('Could not join automatically. Tap the button below to try again.')
        setAlreadyMember(false)
        return
      }
      window.location.href = `/trips/${tripData.id}`
    }

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      // Use a SECURITY DEFINER RPC so anonymous users and non-members can
      // preview the trip (RLS on `trips` otherwise blocks this read).
      const { data: tripRows, error: tripErr } = await supabase
        .rpc('get_trip_by_invite', { _code: code })

      const tripData =
        Array.isArray(tripRows) && tripRows.length > 0 ? tripRows[0] : null

      if (tripErr || !tripData) {
        console.error('Trip lookup failed:', tripErr)
        setNotFound(true)
        setLoading(false)
        return
      }

      setTrip(tripData as Trip)
      setMemberCount(Number((tripData as any).member_count) || 0)

      // If they're already signed in, we don't make them click Join — we do
      // the right thing automatically and send them to the trip page.
      if (user) {
        await performAutoJoin(tripData as Trip, user.id)
        return
      }

      setLoading(false)
    }
    load()

    // If the session arrives after the initial mount (cookies from the
    // /auth/callback redirect can take a beat to hydrate on the client),
    // catch it so we still auto-join without any extra click.
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUid = session?.user?.id ?? null
      setUserId((prev) => (prev === newUid ? prev : newUid))

      if (newUid && !autoJoinRanRef.current) {
        // Trip data may have loaded already — grab the latest by reading state
        // via a fresh RPC call so we don't depend on stale closures.
        const { data: tripRows } = await supabase
          .rpc('get_trip_by_invite', { _code: code })
        const latestTrip =
          Array.isArray(tripRows) && tripRows.length > 0
            ? (tripRows[0] as Trip)
            : null
        if (latestTrip) await performAutoJoin(latestTrip, newUid)
      }
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [code])

  const handleJoin = async () => {
    setError('')
    if (!trip) return

    // Re-check auth at click time. If the user just confirmed their email,
    // the initial getUser() may have race-conditioned with cookie hydration
    // and left `userId` null in state even though the session is now valid.
    const supabase = createClient()
    const { data: { user: liveUser } } = await supabase.auth.getUser()
    const activeUid = liveUser?.id ?? userId

    if (!activeUid) {
      window.location.href = `/signup?redirect=/join/${code}`
      return
    }

    if (alreadyMember) {
      window.location.href = `/trips/${trip.id}`
      return
    }

    setJoining(true)

    // Defensive: if the user is actually already a member but the initial
    // check didn't find them (e.g. they were signed out during load), don't
    // hard-fail on a unique constraint. Check once more before insert.
    const { data: existingMember } = await supabase
      .from('trip_members')
      .select('id')
      .eq('trip_id', trip.id)
      .eq('profile_id', activeUid)
      .maybeSingle()
    if (existingMember) {
      window.location.href = `/trips/${trip.id}`
      return
    }

    const { error: memberErr } = await supabase.from('trip_members').insert({
      trip_id: trip.id,
      profile_id: activeUid,
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

            {userId ? (
              // Signed in but still on this page → auto-join is running or
              // has failed. Keep a manual button as a safety net.
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
            ) : (
              // Not signed in → give them two clear paths: create account
              // (primary for new users) or sign in (existing users).
              <div className="space-y-3">
                <a
                  href={`/signup?redirect=/join/${code}`}
                  className="block w-full text-center py-4 rounded-xl text-base font-bold transition-all hover:-translate-y-px no-underline"
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#0f1f2e',
                    boxShadow: '0 4px 20px rgba(245,158,11,0.5)',
                  }}
                >
                  Create Free Account & Join →
                </a>
                <a
                  href={`/signin?redirect=/join/${code}`}
                  className="block w-full text-center py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-px no-underline"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  Already have an account? Sign in
                </a>
                <p
                  className="text-center text-xs"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Takes 30 seconds. You&apos;ll land straight on the trip page.
                </p>
              </div>
            )}
          </div>
        </div>

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
