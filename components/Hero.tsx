'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'

const sports = [
  {
    icon: '⚾',
    label: 'Baseball',
    bg: 'rgba(26, 122, 74, 0.25)',
    border: 'rgba(26, 122, 74, 0.5)',
    hoverBg: 'rgba(26, 122, 74, 0.4)',
  },
  {
    icon: '🥎',
    label: 'Softball',
    bg: 'rgba(236, 72, 153, 0.25)',
    border: 'rgba(236, 72, 153, 0.5)',
    hoverBg: 'rgba(236, 72, 153, 0.4)',
  },
  {
    icon: '⚽',
    label: 'Soccer',
    bg: 'rgba(42, 127, 196, 0.25)',
    border: 'rgba(42, 127, 196, 0.5)',
    hoverBg: 'rgba(42, 127, 196, 0.4)',
  },
  {
    icon: '🏀',
    label: 'Basketball',
    bg: 'rgba(249, 115, 22, 0.25)',
    border: 'rgba(249, 115, 22, 0.5)',
    hoverBg: 'rgba(249, 115, 22, 0.4)',
  },
  {
    icon: '🏐',
    label: 'Volleyball',
    bg: 'rgba(147, 51, 234, 0.25)',
    border: 'rgba(147, 51, 234, 0.5)',
    hoverBg: 'rgba(147, 51, 234, 0.4)',
  },
  {
    icon: '📣',
    label: 'Cheer',
    bg: 'rgba(245, 158, 11, 0.25)',
    border: 'rgba(245, 158, 11, 0.5)',
    hoverBg: 'rgba(245, 158, 11, 0.4)',
  },
  {
    icon: '➕',
    label: 'More Sports',
    bg: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.3)',
    hoverBg: 'rgba(255, 255, 255, 0.2)',
  },
]

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
            Tournament Travel,
            <br />
            <span style={{ color: '#f59e0b' }}>Finally Figured Out.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-white">
            Find hotels near the fields, see where your teammates are staying,
            and keep your whole team organized — all in one place. Built for
            baseball, softball, soccer, basketball, volleyball, cheer, and every
            travel sport your family loves.
          </p>

          {/* Sport pills */}
          <div className="mb-10">
            <p
              className="text-xs font-medium tracking-wider uppercase mb-3"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Available for:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {sports.map((sport, index) => (
                <span
                  key={sport.label}
                  className="sport-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white backdrop-blur-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.08]"
                  style={{
                    backgroundColor: sport.bg,
                    border: `1px solid ${sport.border}`,
                    animationDelay: `${index * 75}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = sport.hoverBg
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = sport.bg
                  }}
                >
                  <span className="text-base">{sport.icon}</span>
                  {sport.label}
                </span>
              ))}
            </div>
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
              Find Trips
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

          {/* Social proof */}
          <p
            className="mt-8 text-sm"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Trusted by travel sport families in 40+ states
          </p>
        </div>
      </div>
    </section>
  )
}
