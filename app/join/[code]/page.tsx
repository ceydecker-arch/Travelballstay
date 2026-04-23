'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#1a7a4a' }}
          />
        </div>
      </div>
    )
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div
            className="bg-white rounded-2xl border p-8"
            style={{ borderColor: '#dde8ee' }}
          >
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#0f1f2e' }}>
              Trip not found
            </h1>
            <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
              Check your invite code and try again. Codes are six characters, letters and numbers.
            </p>
            <a
              href="/"
              className="inline-block px-5 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              Back home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16">
        <div
          className="bg-white rounded-2xl border p-8"
          style={{ borderColor: '#dde8ee' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: '#1a7a4a' }}
          >
            You've been invited
          </p>
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#0f1f2e' }}>
            {trip.name}
          </h1>

          {(trip.start_date || trip.end_date) && (
            <p className="text-sm mb-2" style={{ color: '#5a7080' }}>
              📅 {formatDateRange(trip.start_date, trip.end_date)}
            </p>
          )}

          {trip.notes && (
            <pre
              className="text-sm whitespace-pre-wrap font-sans mb-4"
              style={{ color: '#5a7080' }}
            >
              {trip.notes}
            </pre>
          )}

          <div
            className="rounded-xl px-4 py-3 mb-5 text-sm"
            style={{ backgroundColor: '#f5f8fa' }}
          >
            <span style={{ color: '#5a7080' }}>
              {memberCount} {memberCount === 1 ? 'family has' : 'families have'} joined
            </span>
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

          <button
            type="button"
            onClick={handleJoin}
            disabled={joining}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#1a7a4a' }}
          >
            {!userId
              ? 'Sign up to join'
              : alreadyMember
              ? 'View this trip'
              : joining
              ? 'Joining...'
              : 'Join This Trip'}
          </button>

          {!userId && (
            <p className="text-center text-xs mt-4" style={{ color: '#8fa3b2' }}>
              Already have an account?{' '}
              <a
                href={`/signin?redirect=/join/${code}`}
                className="font-semibold"
                style={{ color: '#1a7a4a' }}
              >
                Sign in
              </a>
            </p>
          )}
        </div>
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
