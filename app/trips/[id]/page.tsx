'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Copy, Check, Share2, MapPin, Calendar, Users, Home, Plus } from 'lucide-react'
import Navbar from '@/components/Navbar'

interface Trip {
  id: string
  name: string
  invite_code: string
  start_date: string | null
  end_date: string | null
  notes: string | null
  created_by: string | null
  tournament_id: string | null
  venue_id: string | null
  tournaments: {
    id: string
    name: string | null
    sport: string | null
  } | null
  venues: {
    id: string
    name: string | null
    city: string | null
    state: string | null
  } | null
}

interface MemberRow {
  id: string
  role: string | null
  joined_at: string | null
  profile_id: string | null
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

interface StayRow {
  id: string
  profile_id: string | null
  property_name: string | null
  address: string | null
  booking_status: string | null
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

type Tab = 'team' | 'stays' | 'map'

function extractField(notes: string | null, field: string): string | null {
  if (!notes) return null
  const re = new RegExp(`${field}\\s*:\\s*(.+)`, 'i')
  const match = notes.match(re)
  return match ? match[1].trim().split('\n')[0] : null
}

export default function TripDetailPage() {
  const params = useParams<{ id: string }>()
  const tripId = params?.id

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loading, setLoading] = useState(true)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [stays, setStays] = useState<StayRow[]>([])
  const [tab, setTab] = useState<Tab>('team')
  const [copied, setCopied] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        window.location.href = '/signin'
        return
      }
      setCheckingAuth(false)

      if (!tripId) {
        setLoading(false)
        return
      }

      // Try the enriched query first (joins require FK columns + RLS on
      // tournaments/venues to be public-readable, which they are).
      let tripData: any = null
      let tripErr: any = null
      {
        const enriched = await supabase
          .from('trips')
          .select(
            `*,
             tournaments:tournament_id (id, name, sport),
             venues:venue_id (id, name, city, state)`
          )
          .eq('id', tripId)
          .maybeSingle()
        tripData = enriched.data
        tripErr = enriched.error
      }

      // If the join fails for any reason (e.g. old schema without FK columns
      // in preview deploys), fall back to a plain select so we don't hard-fail.
      if (tripErr || !tripData) {
        const fallback = await supabase
          .from('trips')
          .select('*')
          .eq('id', tripId)
          .maybeSingle()
        tripData = fallback.data
        tripErr = fallback.error
      }

      if (tripErr || !tripData) {
        console.error('Trip not found:', tripErr)
        window.location.href = '/dashboard'
        return
      }
      setTrip(tripData as Trip)

      const { data: memberData } = await supabase
        .from('trip_members')
        .select('id, role, joined_at, profile_id, profiles(full_name, email)')
        .eq('trip_id', tripId)
      setMembers((memberData as unknown as MemberRow[]) || [])

      const { data: stayData } = await supabase
        .from('family_stays')
        .select('id, profile_id, property_name, address, booking_status, profiles(full_name, email)')
        .eq('trip_id', tripId)
      setStays((stayData as unknown as StayRow[]) || [])

      setLoading(false)
    })
  }, [tripId])

  const copyCode = async () => {
    if (!trip) return
    try {
      await navigator.clipboard.writeText(trip.invite_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const copyShareLink = async () => {
    if (!trip) return
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://travelballstay.com'
    const shareUrl = `${origin}/join/${trip.invite_code}`
    const shareText = `Join our team trip on TravelBallStay — "${trip.name}". Tap the link to RSVP and see where everyone is staying.`

    // Try native share sheet first (iOS/Android, desktop Safari/Chrome)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Join ${trip.name} on TravelBallStay`,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (err: any) {
        // AbortError = user dismissed share sheet. Don't fall back.
        if (err?.name === 'AbortError') return
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 1500)
    } catch {}
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

  if (!trip) return null

  // Prefer FK-joined data when present; fall back to notes regex for legacy
  // trips created before the FK columns were populated.
  const sport = trip.tournaments?.sport || extractField(trip.notes, 'Sport')
  const tournament =
    trip.tournaments?.name ||
    trip.venues?.name ||
    extractField(trip.notes, 'Tournament')
  const location =
    trip.venues?.city && trip.venues?.state
      ? `${trip.venues.city}, ${trip.venues.state}`
      : extractField(trip.notes, 'Location')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      {/* Amber accent bar */}
      <div
        style={{
          height: '4px',
          background: 'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
        }}
      />

      <Navbar />

      {/* Trip Header */}
      <section
        className="relative overflow-hidden px-4 py-14 lg:py-20"
        style={{ backgroundColor: '#0f1f2e' }}
      >
        {/* Decorative glows */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2D6A4F 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          {sport && (
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{
                backgroundColor: 'rgba(245,158,11,0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.3)',
              }}
            >
              {sport}
            </span>
          )}

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            {trip.name}
          </h1>

          {tournament && (
            <p
              className="text-base lg:text-lg mb-3 font-medium"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {tournament}
            </p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
            {location && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <MapPin size={16} style={{ color: '#f59e0b' }} />
                <span>{location}</span>
              </div>
            )}
            {(trip.start_date || trip.end_date) && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                <Calendar size={16} style={{ color: '#f59e0b' }} />
                <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
              </div>
            )}
          </div>

          {/* Prominent invite code box */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(245,158,11,0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex-1">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: '#f59e0b' }}
              >
                Your Team Invite Code
              </p>
              <p
                className="text-3xl lg:text-4xl font-extrabold text-white tracking-[0.25em]"
                style={{ fontFamily: 'monospace' }}
              >
                {trip.invite_code}
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                Share this code with your team so families can join the trip.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={copyCode}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-px"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#0f1f2e',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                style={{
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <Share2 size={16} />
                {shareCopied ? 'Link copied' : 'Share Link'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="flex gap-1 mb-8 border-b"
          style={{ borderColor: '#dde8ee' }}
        >
          <TabButton current={tab} value="team" onClick={() => setTab('team')}>
            <Users size={16} />
            Team ({members.length})
          </TabButton>
          <TabButton current={tab} value="stays" onClick={() => setTab('stays')}>
            <Home size={16} />
            Stays ({stays.length})
          </TabButton>
          <TabButton current={tab} value="map" onClick={() => setTab('map')}>
            <MapPin size={16} />
            Map
          </TabButton>
        </div>

        {tab === 'team' && <TeamTab members={members} />}
        {tab === 'stays' && <StaysTab stays={stays} tripId={trip.id} />}
        {tab === 'map' && <MapPlaceholder />}
      </section>
    </div>
  )
}

function TabButton({
  current,
  value,
  onClick,
  children,
}: {
  current: Tab
  value: Tab
  onClick: () => void
  children: React.ReactNode
}) {
  const active = current === value
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors -mb-px border-b-2"
      style={{
        color: active ? '#2D6A4F' : '#5a7080',
        borderColor: active ? '#2D6A4F' : 'transparent',
      }}
    >
      {children}
    </button>
  )
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
  }
  if (email) return email[0]?.toUpperCase() || '?'
  return '?'
}

function TeamTab({ members }: { members: MemberRow[] }) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} color="#f59e0b" />}
        title="No families have joined yet"
        message="Share your invite code or link to get your team on the trip."
      />
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {members.map((m) => {
        const name = m.profiles?.full_name || m.profiles?.email || 'Family'
        const initials = getInitials(m.profiles?.full_name, m.profiles?.email)
        const isOrganizer = m.role === 'organizer'
        return (
          <div
            key={m.id}
            className="bg-white rounded-2xl p-5 border flex items-center gap-4 transition-all hover:shadow-sm"
            style={{ borderColor: '#dde8ee' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-base"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
              }}
            >
              {initials.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: '#0f1f2e' }}>
                {name}
              </p>
              <p className="text-xs" style={{ color: '#8fa3b2' }}>
                Joined {formatDate(m.joined_at)}
              </p>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0"
              style={{
                backgroundColor: isOrganizer ? '#fef3c7' : '#e8f5ee',
                color: isOrganizer ? '#92400e' : '#2D6A4F',
              }}
            >
              {isOrganizer ? 'Organizer' : 'Member'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function StaysTab({ stays, tripId }: { stays: StayRow[]; tripId: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#0f1f2e' }}>
            Where everyone is staying
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>
            Book near your teammates and keep the team together.
          </p>
        </div>
        <a
          href={`/trips/${tripId}/mark-stay`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-px flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
            boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
          }}
        >
          <Plus size={16} />
          Mark your stay
        </a>
      </div>
      {stays.length === 0 ? (
        <EmptyState
          icon={<Home size={28} color="#f59e0b" />}
          title="No stays marked yet"
          message="Be the first to share where your family is staying so teammates can book nearby."
        />
      ) : (
        <div className="space-y-3">
          {stays.map((s) => {
            const isBooked = s.booking_status === 'booked'
            const name = s.profiles?.full_name || s.profiles?.email || 'Family'
            const initials = getInitials(s.profiles?.full_name, s.profiles?.email)
            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-sm"
                style={{
                  borderColor: '#dde8ee',
                  borderLeft: `4px solid ${isBooked ? '#2D6A4F' : '#f59e0b'}`,
                }}
              >
                <div className="flex items-center gap-4 p-5">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                    style={{
                      background: isBooked
                        ? 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)'
                        : 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    }}
                  >
                    {initials.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: '#0f1f2e' }}>
                      {name}
                    </p>
                    <p className="text-sm font-medium truncate" style={{ color: '#2D6A4F' }}>
                      {s.property_name || 'Stay location not named'}
                    </p>
                    {s.address && (
                      <p className="text-xs flex items-center gap-1 mt-0.5 truncate" style={{ color: '#8fa3b2' }}>
                        <MapPin size={11} />
                        <span className="truncate">{s.address}</span>
                      </p>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: isBooked ? '#e8f5ee' : '#fef3c7',
                      color: isBooked ? '#2D6A4F' : '#92400e',
                    }}
                  >
                    {isBooked ? '✓ Booked' : 'Interested'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MapPlaceholder() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-center"
      style={{ backgroundColor: '#0f1f2e' }}
    >
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #2D6A4F 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />
      <div className="relative z-10">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            backgroundColor: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
          }}
        >
          <MapPin size={36} color="#f59e0b" strokeWidth={2} />
        </div>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
          style={{
            backgroundColor: 'rgba(245,158,11,0.15)',
            color: '#f59e0b',
          }}
        >
          Coming Soon
        </span>
        <h3 className="text-2xl lg:text-3xl font-extrabold mb-3 text-white">
          Team Map View
        </h3>
        <p
          className="text-base max-w-md mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          See every family&apos;s stay pinned on one map, so you can book close and keep the team together.
        </p>
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode
  title: string
  message: string
}) {
  return (
    <div
      className="rounded-2xl border-2 border-dashed p-12 text-center bg-white"
      style={{ borderColor: '#dde8ee' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#fef3c7' }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: '#0f1f2e' }}>
        {title}
      </h3>
      <p className="text-sm max-w-sm mx-auto" style={{ color: '#5a7080' }}>
        {message}
      </p>
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
