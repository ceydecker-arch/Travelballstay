'use client'

import { Search } from 'lucide-react'

const sports = [
  { icon: '⚾', label: 'Baseball' },
  { icon: '🥎', label: 'Softball' },
  { icon: '⚽', label: 'Soccer' },
  { icon: '🏀', label: 'Basketball' },
  { icon: '🏐', label: 'Volleyball' },
  { icon: '📣', label: 'Cheer' },
  { icon: '➕', label: 'More' },
]

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      {/* Geometric background pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute top-0 right-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#1a7a4a"
                strokeWidth="0.5"
                strokeOpacity="0.15"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Soft green blob top right */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: '#1a7a4a', filter: 'blur(80px)' }}
        />
        {/* Amber blob bottom left */}
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: '#f59e0b', filter: 'blur(60px)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border"
            style={{
              backgroundColor: '#e6f7ee',
              borderColor: '#b8e8cf',
              color: '#1a7a4a',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#1a7a4a' }} />
            Now in early access — join the waitlist
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6"
            style={{ color: '#0f1f2e' }}
          >
            Tournament Travel,{' '}
            <span style={{ color: '#1a7a4a' }}>Finally Figured Out.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: '#4a5e6d' }}
          >
            Find hotels near the fields, see where your teammates are staying,
            and keep your whole team coordinated — all in one place. Built for
            every travel sport.
          </p>

          {/* Sport pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {sports.map((sport) => (
              <span
                key={sport.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border bg-white"
                style={{ borderColor: '#dde8ee', color: '#3a5060' }}
              >
                <span>{sport.icon}</span>
                {sport.label}
              </span>
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
                placeholder="Search by tournament name or city..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-white text-sm font-medium outline-none transition-all duration-150 focus:ring-2"
                style={{
                  borderColor: '#dde8ee',
                  color: '#0f1f2e',
                  boxShadow: '0 1px 4px rgba(15,31,46,0.06)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1a7a4a'
                  e.target.style.boxShadow = '0 0 0 3px rgba(26,122,74,0.12)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#dde8ee'
                  e.target.style.boxShadow = '0 1px 4px rgba(15,31,46,0.06)'
                }}
              />
            </div>
            <button
              className="flex-shrink-0 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              Find Trips
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#tournaments"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              Explore Tournaments
            </a>
            <a
              href="#team-trips"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150 hover:bg-green-50 active:scale-95"
              style={{ borderColor: '#1a7a4a', color: '#1a7a4a' }}
            >
              Plan a Team Trip
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm" style={{ color: '#8fa3b2' }}>
            Joined by{' '}
            <span className="font-semibold" style={{ color: '#1a7a4a' }}>
              2,400+ families
            </span>{' '}
            from across the country
          </p>
        </div>
      </div>
    </section>
  )
}
