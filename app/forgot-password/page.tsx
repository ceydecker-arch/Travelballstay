'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin, ArrowLeft, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
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

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: '#f5f8fa' }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '4px',
          background: 'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
        }}
      />

      <div className="max-w-md mx-auto px-4 py-16">
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
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

        <div
          className="bg-white rounded-2xl p-8 shadow-sm border"
          style={{ borderColor: '#dde8ee' }}
        >
          {sent ? (
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
                If an account exists for <strong>{email}</strong>, we sent you a
                link to reset your password.
              </p>
              <a
                href="/signin"
                className="inline-flex items-center gap-1 mt-6 text-sm font-semibold"
                style={{ color: '#2D6A4F' }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </a>
            </div>
          ) : (
            <>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: '#0f1f2e' }}
              >
                Reset your password
              </h1>
              <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
                Enter your email and we&apos;ll send you a link to choose a new
                password.
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

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:opacity-95 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                    boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
                  }}
                >
                  {loading ? 'Sending...' : 'Send reset link →'}
                </button>
              </form>

              <p
                className="text-center text-sm mt-6"
                style={{ color: '#5a7080' }}
              >
                Remembered it?{' '}
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
      </div>
    </div>
  )
}
