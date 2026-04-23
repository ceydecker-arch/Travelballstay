'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { MapPin, Check } from 'lucide-react'

export default function SignUpPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f5f8fa' }} />}>
      <SignUpInner />
    </Suspense>
  )
}

function SignUpInner() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirect') || '/dashboard'

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
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: callbackUrl,
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

  const focusStyles = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = '#2D6A4F'
      e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.15)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = '#dde8ee'
      e.target.style.boxShadow = 'none'
    },
  }

  const benefits = [
    'Free to join — always',
    'Create a trip in under 2 minutes',
    'Invite your whole team instantly',
  ]

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      {/* Amber accent bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '4px',
          background: 'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
        }}
      />

      <div className="flex min-h-screen">
        {/* Left panel — desktop only */}
        <div
          className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
          style={{ backgroundColor: '#0f1f2e' }}
        >
          {/* Subtle decorative glow */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #2D6A4F 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
          />

          {/* Logo top-left */}
          <a href="/" className="relative z-10 flex items-center gap-2 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              <MapPin size={18} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span style={{ color: 'white' }}>Travel</span>
              <span style={{ color: '#2D6A4F' }}>Ball</span>
              <span style={{ color: '#f59e0b' }}>Stay</span>
            </span>
          </a>

          {/* Center content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-5 text-white">
              Keep Your Team Together.
            </h2>
            <p
              className="text-lg mb-10 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Join thousands of travel sport families planning smarter tournament weekends.
            </p>

            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(45,106,79,0.2)' }}
                  >
                    <Check size={14} style={{ color: '#3a8c64' }} strokeWidth={3} />
                  </div>
                  <span className="text-base text-white">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom tagline */}
          <p
            className="relative z-10 text-sm font-semibold tracking-wide"
            style={{ color: 'rgba(245,158,11,0.6)' }}
          >
            Where teams stay together.
          </p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <a href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                <MapPin size={20} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                <span style={{ color: '#0f1f2e' }}>Travel</span>
                <span style={{ color: '#2D6A4F' }}>Ball</span>
                <span style={{ color: '#f59e0b' }}>Stay</span>
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
                    <Check size={28} style={{ color: '#2D6A4F' }} strokeWidth={3} />
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
                    href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
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
                        {...focusStyles}
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
                        {...focusStyles}
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
                        {...focusStyles}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:opacity-95 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                        boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
                      }}
                    >
                      {loading ? 'Creating account...' : 'Create account →'}
                    </button>
                  </form>

                  <p
                    className="text-center text-sm mt-6"
                    style={{ color: '#5a7080' }}
                  >
                    Already have an account?{' '}
                    <a
                      href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
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
      </div>
    </div>
  )
}
