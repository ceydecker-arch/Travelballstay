'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#1a7a4a' }}
          >
            <MapPin size={20} color="white" strokeWidth={2.5} />
          </div>
          <span
            className="text-2xl font-bold"
            style={{ color: '#1a7a4a' }}
          >
            TravelBallStay
          </span>
        </a>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-8 shadow-sm border"
          style={{ borderColor: '#dde8ee' }}
        >
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#0f1f2e' }}
          >
            Welcome back
          </h1>
          <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
            Sign in to manage your team trips.
          </p>

          {error && (
            <div
              className="rounded-xl px-4 py-3 mb-4 text-sm"
              style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#0f1f2e' }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
                onFocus={(e) => e.target.style.borderColor = '#1a7a4a'}
                onBlur={(e) => e.target.style.borderColor = '#dde8ee'}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-medium"
                  style={{ color: '#0f1f2e' }}
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-medium"
                  style={{ color: '#1a7a4a' }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
                onFocus={(e) => e.target.style.borderColor = '#1a7a4a'}
                onBlur={(e) => e.target.style.borderColor = '#dde8ee'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: '#5a7080' }}
          >
            Don&apos;t have an account?{' '}
            <a
              href="/signup"
              className="font-semibold"
              style={{ color: '#1a7a4a' }}
            >
              Sign up free
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
