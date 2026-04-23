'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Home, Check, Heart, MapPin, Calendar, ArrowLeft } from 'lucide-react'
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

      const { data: member } = await supabase
        .from('trip_members')
        .select('id')
        .eq('trip_id', tripId)
        .eq('profile_id', user.id)
        .maybeSingle()

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
        setBookingStatus(s.booking_status === 'interested' ? 'interested' : 'booked')
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
      const res = await supabase.from('family_stays').update(payload).eq('id', existingStayId)
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

  const AmberBar = () => (
    <div
      style={{
        height: '4px',
        background: 'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
      }}
    />
  )

  if (checkingAuth || loading) {
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

  const focusStyles = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = '#2D6A4F'
      e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.15)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = '#dde8ee'
      e.target.style.boxShadow = 'none'
    },
  }

  const inputStyle: React.CSSProperties = {
    borderColor: '#dde8ee',
    color: '#0f1f2e',
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <AmberBar />
      <Navbar />

      {/* Navy header */}
      <section
        className="relative overflow-hidden px-4 py-10 lg:py-14"
        style={{ backgroundColor: '#0f1f2e' }}
      >
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2D6A4F 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <a
            href={`/trips/${tripId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold mb-5 transition-opacity hover:opacity-80"
            style={{ color: '#f59e0b' }}
          >
            <ArrowLeft size={16} />
            Back to {tripName || 'trip'}
          </a>

          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: 'rgba(245,158,11,0.15)',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.3)',
            }}
          >
            {existingStayId ? 'Update Stay' : 'Mark Your Stay'}
          </span>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            {existingStayId ? 'Update your family stay' : 'Where is your family staying?'}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Tell your teammates where you&apos;re staying so everyone can book nearby and keep the team together.
          </p>
        </div>
      </section>

      {/* Form card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm"
          style={{
            borderColor: '#dde8ee',
            borderTop: '4px solid #2D6A4F',
          }}
        >
          {error && (
            <div
              className="rounded-xl px-4 py-3 mb-5 text-sm"
              style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status — radio cards first */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: '#f59e0b' }}
              >
                Your Booking Status
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <RadioCard
                  selected={bookingStatus === 'interested'}
                  onClick={() => setBookingStatus('interested')}
                  icon={<Heart size={20} />}
                  title="Interested"
                  subtitle="Looking at this option"
                  accentColor="#f59e0b"
                  bgColor="#fef3c7"
                  textColor="#92400e"
                />
                <RadioCard
                  selected={bookingStatus === 'booked'}
                  onClick={() => setBookingStatus('booked')}
                  icon={<Check size={20} />}
                  title="Booked"
                  subtitle="Confirmed reservation"
                  accentColor="#2D6A4F"
                  bgColor="#e8f5ee"
                  textColor="#2D6A4F"
                />
              </div>
            </div>

            {/* Property details */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: '#f59e0b' }}
              >
                Stay Details
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    className="flex items-center gap-1.5 text-sm font-medium mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    <Home size={14} style={{ color: '#2D6A4F' }} />
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
                    {...focusStyles}
                  />
                </div>

                <div>
                  <label
                    className="flex items-center gap-1.5 text-sm font-medium mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    <MapPin size={14} style={{ color: '#2D6A4F' }} />
                    Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full address or city"
                    required
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={inputStyle}
                    {...focusStyles}
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: '#f59e0b' }}
              >
                Check-in / Check-out
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="flex items-center gap-1.5 text-sm font-medium mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    <Calendar size={14} style={{ color: '#2D6A4F' }} />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={inputStyle}
                    {...focusStyles}
                  />
                </div>
                <div>
                  <label
                    className="flex items-center gap-1.5 text-sm font-medium mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    <Calendar size={14} style={{ color: '#2D6A4F' }} />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={inputStyle}
                    {...focusStyles}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: '#f59e0b' }}
              >
                Additional Info
              </p>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#0f1f2e' }}
              >
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any details your team should know..."
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-y"
                style={inputStyle}
                {...focusStyles}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl text-base font-bold text-white transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
              }}
            >
              {submitting
                ? 'Saving...'
                : existingStayId
                ? 'Update My Stay →'
                : 'Save My Stay →'}
            </button>
          </form>
        </div>

        <p
          className="text-center text-xs mt-6 font-semibold tracking-wide"
          style={{ color: '#8fa3b2' }}
        >
          Where teams stay together.
        </p>
      </div>
    </div>
  )
}

function RadioCard({
  selected,
  onClick,
  icon,
  title,
  subtitle,
  accentColor,
  bgColor,
  textColor,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
  accentColor: string
  bgColor: string
  textColor: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-5 rounded-2xl border-2 transition-all hover:-translate-y-px"
      style={{
        borderColor: selected ? accentColor : '#dde8ee',
        backgroundColor: selected ? bgColor : 'white',
        boxShadow: selected ? `0 4px 14px ${accentColor}33` : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: selected ? accentColor : bgColor,
            color: selected ? 'white' : textColor,
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-base" style={{ color: '#0f1f2e' }}>
              {title}
            </p>
            {selected && (
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <Check size={10} color="white" strokeWidth={4} />
              </div>
            )}
          </div>
          <p className="text-xs" style={{ color: '#5a7080' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </button>
  )
}
