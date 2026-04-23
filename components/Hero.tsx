'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0f1f2e' }}
    >
      {/* Background image */}
      <Image
        src="/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center">

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 text-white">
            Travel Ball Weekends Are Chaos.
            <br />
            <span style={{ color: '#f59e0b' }}>We Fix That.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-white">
            Find your tournament, book team-friendly stays, and keep everyone
            together — without the stress.
          </p>

          {/* Sport tiles */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { icon: '⚾', label: 'Baseball', color: '#1a7a4a', bg: 'rgba(26,122,74,0.25)', border: 'rgba(26,122,74,0.5)' },
              { icon: '🥎', label: 'Softball', color: '#ec4899', bg: 'rgba(236,72,153,0.25)', border: 'rgba(236,72,153,0.5)' },
              { icon: '⚽', label: 'Soccer', color: '#2a7fc4', bg: 'rgba(42,127,196,0.25)', border: 'rgba(42,127,196,0.5)' },
              { icon: '🏀', label: 'Basketball', color: '#f97316', bg: 'rgba(249,115,22,0.25)', border: 'rgba(249,115,22,0.5)' },
              { icon: '🏐', label: 'Volleyball', color: '#9333ea', bg: 'rgba(147,51,234,0.25)', border: 'rgba(147,51,234,0.5)' },
              { icon: '📣', label: 'Cheer', color: '#f59e0b', bg: 'rgba(245,158,11,0.25)', border: 'rgba(245,158,11,0.5)' },
              { icon: '➕', label: 'More', color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)' },
            ].map((sport) => (
              <div
                key={sport.label}
                className="flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  backgroundColor: sport.bg,
                  border: `1px solid ${sport.border}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ fontSize: '24px', lineHeight: 1 }}>{sport.icon}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'white',
                    letterSpacing: '0.03em',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {sport.label}
                </span>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#8fa3b2' }}
              />
              <input
                type="text"
                placeholder="Search by tournament, venue, field name, or city..."
                className="w-full pl-11 pr-4 py-4 rounded-xl border bg-white text-sm font-medium outline-none transition-all duration-150"
                style={{
                  borderColor: '#dde8ee',
                  color: '#0f1f2e',
                  boxShadow: '0 0 24px rgba(255,255,255,0.25)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1a7a4a'
                  e.target.style.boxShadow =
                    '0 0 0 3px rgba(26,122,74,0.25), 0 0 24px rgba(255,255,255,0.25)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#dde8ee'
                  e.target.style.boxShadow = '0 0 24px rgba(255,255,255,0.25)'
                }}
              />
            </div>
            <button
              type="button"
              className="flex-shrink-0 px-6 py-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              Search
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#tournaments"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              Explore Tournaments
            </a>
            <a
              href="#team-trips"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150 active:scale-95 text-white"
              style={{
                borderColor: '#ffffff',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Create a Trip
            </a>
          </div>

          <p
            className="text-sm mt-4 font-medium"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Teams that don&apos;t plan early get split across multiple hotels.
          </p>

        </div>
      </div>
    </section>
  )
}
