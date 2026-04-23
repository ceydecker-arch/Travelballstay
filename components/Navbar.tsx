'use client'

import { useEffect, useState } from 'react'
import { Menu, X, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const navLinks = [
  { label: 'Tournaments', href: '/tournaments' },
  { label: 'Venues', href: '/tournaments' },
  { label: 'Hotels', href: '/tournaments' },
  { label: 'Team Trips', href: '/dashboard' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="/" className="group flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-8 h-8 md:w-[38px] md:h-[38px] rounded-[10px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 2px 8px rgba(45,106,79,0.4)',
              }}
            >
              <MapPin
                className="w-4 h-4 md:w-5 md:h-5"
                color="white"
                strokeWidth={2.5}
              />
            </div>
            <span
              className="text-lg md:text-2xl tracking-tight"
              style={{ fontWeight: 800 }}
            >
              <span style={{ color: '#0f1f2e' }}>Travel</span>
              <span style={{ color: '#2D6A4F' }}>Ball</span>
              <span style={{ color: '#f59e0b' }}>Stay</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150 hover:text-green-700"
                style={{ color: '#4a5e6d' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 hover:bg-green-50"
                  style={{ color: '#2D6A4F' }}
                >
                  My Trips
                </a>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 transition-all duration-150 hover:bg-gray-50"
                  style={{ color: '#4a5e6d' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/signin"
                  className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 transition-all duration-150 hover:border-green-300 hover:bg-green-50"
                  style={{ color: '#2D6A4F' }}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all duration-150 hover:opacity-90"
                  style={{ backgroundColor: '#2D6A4F' }}
                >
                  Get Started
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 transition-colors"
                  style={{ color: '#2D6A4F' }}
                >
                  My Trips
                </a>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/signin"
                  className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: '#2D6A4F' }}
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
