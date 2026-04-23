'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
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
            style={{ backgroundColor: '#2D6A4F' }}
          >
            <MapPin size={20} color="white" strokeWidth={2.5} />
          </div>
          <span
            className="text-2xl font-bold"
            style={{ color: '#2D6A4F' }}
          >
            TravelBallStay
          </span>
        </a>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-8 shadow-sm border"
          style={{ borderColor: '#dde8ee' }}
        >
          {success ? (
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#e8f5ee' }}
              >
                <span className="text-3xl">✓</span>
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: '#0f1f2e' }}
              >
                Check your email
              </h2>
              <p style={{ color: '#5a7080' }}>
                We sent a confirmation link to{' '}
                <strong>{email}</strong>.
                Click it to activate your account.
              </p>
              <a
                href="/signin"
                className="inline-block mt-6 text-sm font-semibold"
                style={{ color: '#2D6A4F' }}
              >
                Back to Sign In
              </a>
            </div>
          ) : (
            <>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: '#0f1f2e' }}
              >
                Create your account
              </h1>
              <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
                Free to join. Keep your team together.
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

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
                    onFocus={(e) => e.target.style.borderColor = '#2D6A4F'}
                    onBlur={(e) => e.target.style.borderColor = '#dde8ee'}
                  />
                </div>

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
                    onFocus={(e) => e.target.style.borderColor = '#2D6A4F'}
                    onBlur={(e) => e.target.style.borderColor = '#dde8ee'}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
                    onFocus={(e) => e.target.style.borderColor = '#2D6A4F'}
                    onBlur={(e) => e.target.style.borderColor = '#dde8ee'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#2D6A4F' }}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <p
                className="text-center text-sm mt-6"
                style={{ color: '#5a7080' }}
              >
                Already have an account?{' '}
                <a
                  href="/signin"
                  className="font-semibold"
                  style={{ color: '#2D6A4F' }}
                >
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: '#8fa3b2' }}
        >
          By signing up you agree to our Terms of Service
          and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
