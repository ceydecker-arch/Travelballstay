'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import {
  Shield,
  Trophy,
  MapPin,
  ChevronRight,
  Users,
  Building2,
  ArrowLeft,
} from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'

interface Counts {
  tournaments: number
  venues: number
  organizations: number
  users: number
}

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [counts, setCounts] = useState<Counts | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/signin?redirect=/admin'
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()
      if (!profile?.is_admin) {
        setAllowed(false)
        setLoading(false)
        return
      }
      setAllowed(true)

      const [t, v, o, u] = await Promise.all([
        supabase.from('tournaments').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('organizations').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])
      setCounts({
        tournaments: t.count || 0,
        venues: v.count || 0,
        organizations: o.count || 0,
        users: u.count || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
          <Skeleton width={200} height={32} />
          <Skeleton width={100} height={18} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={100} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: '#fef3c7' }}
          >
            <Shield size={28} style={{ color: '#f59e0b' }} />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#0f1f2e' }}
          >
            Admin access only
          </h1>
          <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
            This area is restricted to TravelBallStay admins.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{
              background:
                'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="flex items-center gap-3 mb-8"
          style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <Shield size={18} style={{ color: '#f59e0b' }} />
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#f59e0b' }}
              >
                Admin Panel
              </p>
            </div>
            <h1
              className="text-3xl font-extrabold mt-1"
              style={{ color: '#0f1f2e' }}
            >
              Manage Content
            </h1>
          </div>
        </div>

        {/* Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <CountCard
            icon={<Trophy size={18} />}
            label="Tournaments"
            value={counts?.tournaments ?? 0}
            accent="#2D6A4F"
          />
          <CountCard
            icon={<MapPin size={18} />}
            label="Venues"
            value={counts?.venues ?? 0}
            accent="#f59e0b"
          />
          <CountCard
            icon={<Building2 size={18} />}
            label="Organizations"
            value={counts?.organizations ?? 0}
            accent="#0f1f2e"
          />
          <CountCard
            icon={<Users size={18} />}
            label="Users"
            value={counts?.users ?? 0}
            accent="#2D6A4F"
          />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminCard
            href="/admin/tournaments"
            icon={<Trophy size={22} />}
            title="Tournaments"
            desc="Add, edit, and delete tournaments. Link them to venues."
            accent="#2D6A4F"
          />
          <AdminCard
            href="/admin/venues"
            icon={<MapPin size={22} />}
            title="Venues"
            desc="Manage fields and complexes where games are played."
            accent="#f59e0b"
          />
        </div>
      </div>
    </div>
  )
}

function CountCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent: string
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border"
      style={{ borderColor: '#dde8ee', borderTop: `3px solid ${accent}` }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: accent }}>
        {icon}
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#8fa3b2' }}
        >
          {label}
        </p>
      </div>
      <p
        className="text-3xl font-extrabold"
        style={{ color: '#0f1f2e' }}
      >
        {value}
      </p>
    </div>
  )
}

function AdminCard({
  href,
  icon,
  title,
  desc,
  accent,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
  accent: string
}) {
  return (
    <a
      href={href}
      className="group block rounded-2xl bg-white p-6 no-underline transition-all hover:-translate-y-1"
      style={{
        border: '1px solid #dde8ee',
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {icon}
        </div>
        <ChevronRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
          style={{ color: '#8fa3b2' }}
        />
      </div>
      <h3
        className="text-lg font-bold mb-1"
        style={{ color: '#0f1f2e' }}
      >
        {title}
      </h3>
      <p className="text-sm" style={{ color: '#5a7080' }}>
        {desc}
      </p>
    </a>
  )
}
