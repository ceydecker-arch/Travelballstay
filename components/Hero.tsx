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

          {/* Sport indicators — clean uppercase amber */}
          <div
            className="w-full text-center mb-10"
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f59e0b',
                textTransform: 'uppercase',
              }}
            >
              Baseball
            </span>
            <span style={{ color: '#f59e0b', margin: '0 10px', opacity: 0.5, fontSize: '11px' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f59e0b',
                textTransform: 'uppercase',
              }}
            >
              Softball
            </span>
            <span style={{ color: '#f59e0b', margin: '0 10px', opacity: 0.5, fontSize: '11px' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f59e0b',
                textTransform: 'uppercase',
              }}
            >
              Soccer
            </span>
            <span style={{ color: '#f59e0b', margin: '0 10px', opacity: 0.5, fontSize: '11px' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f59e0b',
                textTransform: 'uppercase',
              }}
            >
              Basketball
            </span>
            <span style={{ color: '#f59e0b', margin: '0 10px', opacity: 0.5, fontSize: '11px' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f59e0b',
                textTransform: 'uppercase',
              }}
            >
              Volleyball
            </span>
            <span style={{ color: '#f59e0b', margin: '0 10px', opacity: 0.5, fontSize: '11px' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f59e0b',
                textTransform: 'uppercase',
              }}
            >
              Cheer
            </span>
            <span style={{ color: '#f59e0b', margin: '0 10px', opacity: 0.5, fontSize: '11px' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#f59e0b',
                textTransform: 'uppercase',
              }}
            >
              + More
            </span>
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
                  e.target.style.borderColor = '#2D6A4F'
                  e.target.style.boxShadow =
                    '0 0 0 3px rgba(45,106,79,0.25), 0 0 24px rgba(255,255,255,0.25)'
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
              style={{ backgroundColor: '#2D6A4F' }}
            >
              Search
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/tournaments"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              Explore Tournaments
            </a>
            <a
              href="/create-trip"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold transition-all duration-150 hover:-translate-y-px active:scale-95"
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f1f2e',
                boxShadow: '0 4px 20px rgba(245,158,11,0.5)',
              }}
            >
              Create a Trip →
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
