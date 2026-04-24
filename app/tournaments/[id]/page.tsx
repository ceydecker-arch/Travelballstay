'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  MapPin,
  Calendar,
  Trophy,
  ArrowLeft,
  Plus,
  ChevronRight,
  Star,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Skeleton } from '@/components/Skeleton'

interface VenueRef {
  id: string
  name: string | null
  city: string | null
  state: string | null
  field_count: number | null
  description: string | null
  sports: string[] | null
  gradient: string | null
  badge: string | null
  nearby_stays: string | null
}

interface Tournament {
  id: string
  name: string
  sport: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  organization_id: string | null
  tournament_venues: Array<{
    is_primary: boolean | null
    venues: VenueRef | null
  }>
  organizations: { name: string | null } | null
}

const BRAND_GRADIENTS = [
  'linear-gradient(135deg, #1f4d38 0%, #2D6A4F 50%, #15331f 100%)',
  'linear-gradient(135deg, #1a3a5c 0%, #2a6496 50%, #0f2840 100%)',
  'linear-gradient(135deg, #7b3f00 0%, #c47a1e 50%, #5c2e00 100%)',
]

export default function TournamentDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tournament, setTournament] = useState<Tournament | null>(null)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    async function load() {
      // Try enriched query first; fall back to the bare tournament if any
      // optional FK relation (like organizations) is missing on the row.
      const enriched = await supabase
        .from('tournaments')
        .select(
          `id, name, sport, start_date, end_date, description, organization_id,
           tournament_venues(is_primary, venues(id, name, city, state, field_count, description, sports, gradient, badge, nearby_stays)),
           organizations:organization_id(name)`
        )
        .eq('id', id)
        .maybeSingle()

      let data: any = enriched.data
      let err: any = enriched.error

      if (err || !data) {
        const bare = await supabase
          .from('tournaments')
          .select(
            `id, name, sport, start_date, end_date, description, organization_id,
             tournament_venues(is_primary, venues(id, name, city, state, field_count, description, sports, gradient, badge, nearby_stays))`
          )
          .eq('id', id)
          .maybeSingle()
        data = bare.data
        err = bare.error
      }

      if (err || !data) {
        setError(err?.message || 'Tournament not found')
        setLoading(false)
        return
      }
      setTournament(data as Tournament)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <div
          style={{
            height: '4px',
            background:
              'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
          }}
        />
        <Navbar />
        <section
          className="px-4 py-14 lg:py-20"
          style={{ backgroundColor: '#0f1f2e' }}
        >
          <div className="max-w-5xl mx-auto space-y-4">
            <Skeleton width={100} height={20} style={{ opacity: 0.3 }} />
            <Skeleton width="70%" height={44} style={{ opacity: 0.25 }} />
            <Skeleton width="40%" height={20} style={{ opacity: 0.2 }} />
          </div>
        </section>
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <Skeleton width="100%" height={180} />
          <Skeleton width="100%" height={180} />
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: '#0f1f2e' }}
          >
            Tournament not found
          </h1>
          <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
            {error || "We couldn't load this tournament. It may have been removed."}
          </p>
          <a
            href="/tournaments"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{
              background:
                'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
            }}
          >
            <ArrowLeft size={14} /> Back to tournaments
          </a>
        </div>
      </div>
    )
  }

  const venues = (tournament.tournament_venues || [])
    .filter((tv) => !!tv.venues)
    .sort(
      (a, b) =>
        Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))
    )

  const primary = venues.find((v) => v.is_primary) || venues[0]
  const primaryVenue = primary?.venues || null

  const dates =
    tournament.start_date && tournament.end_date
      ? `${formatDate(tournament.start_date)} – ${formatDate(tournament.end_date)}`
      : tournament.start_date
      ? formatDate(tournament.start_date)
      : null

  const gradient = BRAND_GRADIENTS[0]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <div
        style={{
          height: '4px',
          background:
            'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
        }}
      />
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 py-14 lg:py-20"
        style={{ background: gradient }}
      >
        <div
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #2D6A4F 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <a
            href="/tournaments"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-6"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <ArrowLeft size={12} /> All Tournaments
          </a>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tournament.sport && (
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(245,158,11,0.2)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              >
                {tournament.sport}
              </span>
            )}
            {tournament.organizations?.name && (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {tournament.organizations.name}
              </span>
            )}
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            {tournament.name}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
            {primaryVenue?.city && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <MapPin size={16} style={{ color: '#f59e0b' }} />
                <span>
                  {[primaryVenue.city, primaryVenue.state]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
            {dates && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <Calendar size={16} style={{ color: '#f59e0b' }} />
                <span>{dates}</span>
              </div>
            )}
            {primaryVenue?.field_count && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <Trophy size={16} style={{ color: '#f59e0b' }} />
                <span>
                  {primaryVenue.field_count}{' '}
                  {primaryVenue.field_count === 1 ? 'field' : 'fields'}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`/create-trip?tournament=${tournament.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-px"
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f1f2e',
                boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Create a Team Trip
            </a>
            <a
              href="/tournaments"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
              style={{
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Browse other tournaments
            </a>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {tournament.description && (
          <section>
            <div
              className="mb-4"
              style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
            >
              <h2 className="text-xl font-bold" style={{ color: '#0f1f2e' }}>
                About this event
              </h2>
            </div>
            <p
              className="text-base leading-relaxed"
              style={{ color: '#4a5e6d' }}
            >
              {tournament.description}
            </p>
          </section>
        )}

        {/* Venues */}
        <section>
          <div
            className="mb-4"
            style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
          >
            <h2 className="text-xl font-bold" style={{ color: '#0f1f2e' }}>
              {venues.length > 1
                ? `${venues.length} venues`
                : 'Venue'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#5a7080' }}>
              {venues.length > 1
                ? 'Games may be played across multiple complexes.'
                : 'Where the games are played.'}
            </p>
          </div>

          {venues.length === 0 ? (
            <div
              className="rounded-2xl border-2 border-dashed p-10 text-center"
              style={{ borderColor: '#dde8ee', backgroundColor: 'white' }}
            >
              <p className="text-sm" style={{ color: '#5a7080' }}>
                Venue details aren&apos;t available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {venues.map((tv) => {
                const v = tv.venues!
                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    style={{
                      borderColor: '#dde8ee',
                      borderLeft: tv.is_primary
                        ? '4px solid #f59e0b'
                        : '4px solid #2D6A4F',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className="text-base font-bold"
                          style={{ color: '#0f1f2e' }}
                        >
                          {v.name}
                        </h3>
                        {tv.is_primary && (
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                            style={{
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                            }}
                          >
                            <Star size={10} /> Primary
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs flex items-center gap-1"
                        style={{ color: '#5a7080' }}
                      >
                        <MapPin size={11} />
                        {[v.city, v.state].filter(Boolean).join(', ')}
                        {v.field_count ? ` · ${v.field_count} fields` : ''}
                      </p>
                      {v.description && (
                        <p
                          className="text-sm mt-2 line-clamp-2"
                          style={{ color: '#4a5e6d' }}
                        >
                          {v.description}
                        </p>
                      )}
                    </div>
                    <a
                      href={`/create-trip?tournament=${tournament.id}&venue=${v.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 transition-all hover:-translate-y-px"
                      style={{
                        background:
                          'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(45,106,79,0.35)',
                      }}
                    >
                      Plan Stay
                      <ChevronRight size={14} />
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Team CTA */}
        <section
          className="relative overflow-hidden rounded-3xl p-8 lg:p-12 text-center"
          style={{ backgroundColor: '#0f1f2e' }}
        >
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10"
            style={{
              background:
                'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <h3
              className="text-2xl lg:text-3xl font-extrabold mb-3 text-white"
            >
              Ready to plan your team&apos;s stay?
            </h3>
            <p
              className="text-base max-w-lg mx-auto mb-6 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Create a trip and invite your families. Everyone can book near the
              fields and keep the team together.
            </p>
            <a
              href={`/create-trip?tournament=${tournament.id}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-px"
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f1f2e',
                boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Your Team Trip
            </a>
          </div>
        </section>
      </div>
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
