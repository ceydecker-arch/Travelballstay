'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin, Plus } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/signin'
      } else {
        setUser(user)
        setLoading(false)
      }
    })
  }, [])

  if (loading) {
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      {/* Header */}
      <div
        className="bg-white border-b px-4 py-4"
        style={{ borderColor: '#dde8ee' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              <MapPin size={16} color="white" strokeWidth={2.5} />
            </div>
            <span
              className="text-lg font-bold"
              style={{ color: '#1a7a4a' }}
            >
              TravelBallStay
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span
              className="text-sm"
              style={{ color: '#5a7080' }}
            >
              {user?.user_metadata?.full_name || user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: '#0f1f2e' }}
            >
              My Trips
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: '#5a7080' }}
            >
              Manage your tournament trips and team stays
            </p>
          </div>
          <a
            href="/create-trip"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#1a7a4a' }}
          >
            <Plus size={16} />
            Create a Trip
          </a>
        </div>

        {/* Empty state */}
        <div
          className="rounded-2xl border-2 border-dashed p-12 text-center"
          style={{ borderColor: '#dde8ee' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#e6f7ee' }}
          >
            <MapPin size={28} style={{ color: '#1a7a4a' }} />
          </div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: '#0f1f2e' }}
          >
            No trips yet
          </h3>
          <p
            className="text-sm mb-6 max-w-sm mx-auto"
            style={{ color: '#5a7080' }}
          >
            Create your first team trip and invite your
            families to join. Everyone stays together.
          </p>
          <a
            href="/create-trip"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#1a7a4a' }}
          >
            <Plus size={16} />
            Create your first trip
          </a>
        </div>
      </div>
    </div>
  )
}
