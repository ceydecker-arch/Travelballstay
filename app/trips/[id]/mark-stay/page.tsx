'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

interface ExistingStay {
  id: string
  property_name: string | null
  address: string | null
  booking_status: string | null
  check_in: string | null
  check_out: string | null
  notes: string | null
}

export default function MarkStayPage() {
  const params = useParams<{ id: string }>()
  const tripId = params?.id

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [existingStayId, setExistingStayId] = useState<string | null>(null)
  const [tripName, setTripName] = useState('')

  const [propertyName, setPropertyName] = useState('')
  const [address, setAddress] = useState('')
  const [bookingStatus, setBookingStatus] = useState<'interested' | 'booked'>('booked')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/signin'
        return
      }
      setUserId(user.id)
      setCheckingAuth(false)

      if (!tripId) {
        setLoading(false)
        return
      }

      // Check trip membership
      const { data: member } = await supabase
        .from('trip_members')
        .select('id')
        .eq('trip_id', tripId)
        .eq('profile_id', user.id)
        .maybeSingle()

      // Load trip name for display
      const { data: trip } = await supabase
        .from('trips')
        .select('id, name, created_by')
        .eq('id', tripId)
        .maybeSingle()

      if (!trip) {
        window.location.href = '/dashboard'
        return
      }
      setTripName(trip.name)

      const isOrganizer = trip.created_by === user.id
      if (!member && !isOrganizer) {
        setError('You need to join this trip before marking a stay.')
        setLoading(false)
        return
      }

      // Load existing stay if any
      const { data: stay } = await supabase
        .from('family_stays')
        .select('id, property_name, address, booking_status, check_in, check_out, notes')
        .eq('trip_id', tripId)
        .eq('profile_id', user.id)
        .maybeSingle()

      if (stay) {
        const s = stay as ExistingStay
        setExistingStayId(s.id)
        setPropertyName(s.property_name || '')
        setAddress(s.address || '')
        setBookingStatus((s.booking_status === 'interested' ? 'interested' : 'booked'))
        setCheckIn(s.check_in || '')
        setCheckOut(s.check_out || '')
        setNotes(s.notes || '')
      }

      setLoading(false)
    }
    load()
  }, [tripId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!propertyName.trim() || !address.trim()) {
      setError('Please enter the property name and address.')
      return
    }
    if (checkIn && checkOut && new Date(checkOut) < new Date(checkIn)) {
      setError('Check-out date must be after check-in.')
      return
    }
    if (!userId || !tripId) {
      setError('Missing user or trip context.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()

    const payload = {
      trip_id: tripId,
      profile_id: userId,
      property_name: propertyName.trim(),
      address: address.trim(),
      booking_status: bookingStatus,
      check_in: checkIn || null,
      check_out: checkOut || null,
      notes: notes.trim() || null,
    }

    let err
    if (existingStayId) {
      const res = await supabase
        .from('family_stays')
        .update(payload)
        .eq('id', existingStayId)
      err = res.error
    } else {
      const res = await supabase.from('family_stays').insert(payload)
      err = res.error
    }

    if (err) {
      console.error('Error saving stay:', err)
      setError(err.message || 'Could not save your stay. Please try again.')
      setSubmitting(false)
      return
    }

    window.location.href = `/trips/${tripId}`
  }

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
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

  const inputStyle: React.CSSProperties = {
    borderColor: '#dde8ee',
    color: '#0f1f2e',
  }
  const labelStyle: React.CSSProperties = { color: '#0f1f2e' }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: '#2D6A4F' }}
          >
            {tripName}
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: '#0f1f2e' }}>
            {existingStayId ? 'Update your stay' : 'Mark your stay'}
          </h1>
          <p className="text-sm" style={{ color: '#5a7080' }}>
            Tell your teammates where your family is staying so everyone can stay close.
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: '#dde8ee' }}
        >
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
                Property name *
              </label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Hampton Inn Cooperstown"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#2D6A4F')}
                onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#2D6A4F')}
                onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                Booking status *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <RadioCard
                  selected={bookingStatus === 'interested'}
                  onClick={() => setBookingStatus('interested')}
                  title="Interested"
                  subtitle="Looking at this option"
                />
                <RadioCard
                  selected={bookingStatus === 'booked'}
                  onClick={() => setBookingStatus('booked')}
                  title="Booked"
                  subtitle="Confirmed reservation"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
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
                rows={3}
                placeholder="Any details your team should know..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-y"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#2D6A4F')}
                onBlur={(e) => (e.target.style.borderColor = '#dde8ee')}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              {submitting
                ? 'Saving...'
                : existingStayId
                ? 'Update My Stay'
                : 'Save My Stay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function RadioCard({
  selected,
  onClick,
  title,
  subtitle,
}: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-4 rounded-xl border-2 transition-all"
      style={{
        borderColor: selected ? '#2D6A4F' : '#dde8ee',
        backgroundColor: selected ? '#e8f5ee' : 'white',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: selected ? '#2D6A4F' : '#dde8ee',
          }}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2D6A4F' }} />
          )}
        </div>
        <p className="font-semibold text-sm" style={{ color: '#0f1f2e' }}>
          {title}
        </p>
      </div>
      <p className="text-xs ml-6" style={{ color: '#5a7080' }}>
        {subtitle}
      </p>
    </button>
  )
}
