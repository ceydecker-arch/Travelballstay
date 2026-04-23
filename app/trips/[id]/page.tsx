'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Copy, Check, Share2, MapPin } from 'lucide-react'
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

      const { data: tripData, error: tripErr } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .maybeSingle()

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
    try {
      await navigator.clipboard.writeText(`${origin}/join/${trip.invite_code}`)
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
            style={{ borderColor: '#1a7a4a' }}
          />
        </div>
      </div>
    )
  }

  if (!trip) return null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <Navbar />

      {/* Hero */}
      <section className="px-4 py-12 lg:py-16" style={{ backgroundColor: '#0f1f2e' }}>
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3"
          >
            {trip.name}
          </h1>
          {(trip.start_date || trip.end_date) && (
            <p
              className="text-base mb-2"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              📅 {formatDateRange(trip.start_date, trip.end_date)}
            </p>
          )}
          {trip.notes && (
            <pre
              className="text-sm whitespace-pre-wrap font-sans mb-6"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {trip.notes}
            </pre>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-1"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                  style={{ color: '#f59e0b' }}
                >
                  Invite your team
                </p>
                <p className="text-xl font-bold tracking-[0.2em] text-white">
                  {trip.invite_code}
                </p>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#1a7a4a', color: 'white' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button
              type="button"
              onClick={copyShareLink}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#f59e0b', color: '#0f1f2e' }}
            >
              <Share2 size={16} />
              {shareCopied ? 'Link copied' : 'Share link'}
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="flex gap-2 mb-6 border-b"
          style={{ borderColor: '#dde8ee' }}
        >
          <TabButton current={tab} value="team" onClick={() => setTab('team')}>
            Team ({members.length})
          </TabButton>
          <TabButton current={tab} value="stays" onClick={() => setTab('stays')}>
            Stays ({stays.length})
          </TabButton>
          <TabButton current={tab} value="map" onClick={() => setTab('map')}>
            Map
          </TabButton>
        </div>

        {tab === 'team' && (
          <TeamTab members={members} />
        )}

        {tab === 'stays' && (
          <StaysTab stays={stays} tripId={trip.id} />
        )}

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
      className="px-4 py-2.5 text-sm font-semibold transition-colors -mb-px border-b-2"
      style={{
        color: active ? '#1a7a4a' : '#5a7080',
        borderColor: active ? '#1a7a4a' : 'transparent',
      }}
    >
      {children}
    </button>
  )
}

function TeamTab({ members }: { members: MemberRow[] }) {
  if (members.length === 0) {
    return (
      <EmptyState
        title="No families have joined yet"
        message="Share your invite code or link to get your team on the trip."
      />
    )
  }
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#dde8ee' }}>
      {members.map((m, i) => (
        <div
          key={m.id}
          className="flex items-center justify-between px-5 py-4"
          style={{
            borderTop: i === 0 ? 'none' : '1px solid #eef2f5',
          }}
        >
          <div>
            <p className="font-semibold" style={{ color: '#0f1f2e' }}>
              {m.profiles?.full_name || m.profiles?.email || 'Family'}
            </p>
            <p className="text-xs" style={{ color: '#8fa3b2' }}>
              Joined {formatDate(m.joined_at)}
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: m.role === 'organizer' ? '#fef3c7' : '#e6f7ee',
              color: m.role === 'organizer' ? '#92400e' : '#1a7a4a',
            }}
          >
            {m.role === 'organizer' ? 'Organizer' : 'Member'}
          </span>
        </div>
      ))}
    </div>
  )
}

function StaysTab({ stays, tripId }: { stays: StayRow[]; tripId: string }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <a
          href={`/trips/${tripId}/mark-stay`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#1a7a4a' }}
        >
          Mark your stay
        </a>
      </div>
      {stays.length === 0 ? (
        <EmptyState
          title="No stays marked yet"
          message="Be the first to share where your family is staying so teammates can book nearby."
        />
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#dde8ee' }}>
          {stays.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-5 py-4 gap-4"
              style={{
                borderTop: i === 0 ? 'none' : '1px solid #eef2f5',
              }}
            >
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ color: '#0f1f2e' }}>
                  {s.profiles?.full_name || s.profiles?.email || 'Family'}
                </p>
                <p className="text-sm truncate" style={{ color: '#5a7080' }}>
                  {s.property_name || 'Stay location not named'}
                </p>
                {s.address && (
                  <p className="text-xs truncate" style={{ color: '#8fa3b2' }}>
                    {s.address}
                  </p>
                )}
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: s.booking_status === 'booked' ? '#e6f7ee' : '#fff7ed',
                  color: s.booking_status === 'booked' ? '#1a7a4a' : '#c2410c',
                }}
              >
                {s.booking_status === 'booked' ? 'Booked' : 'Interested'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MapPlaceholder() {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{ backgroundColor: '#1a7a4a', color: 'white' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <MapPin size={28} color="white" />
      </div>
      <h3 className="text-xl font-bold mb-2">Team map coming soon</h3>
      <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
        See where your whole team is staying on one map.
      </p>
    </div>
  )
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div
      className="rounded-2xl border-2 border-dashed p-10 text-center"
      style={{ borderColor: '#dde8ee' }}
    >
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
