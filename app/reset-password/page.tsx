'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MapPin, Check } from 'lucide-react'

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // The user arrives here only after auth/callback exchanged the recovery
  // code and set the session. If there's no session, they shouldn't be here.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthorized(!!user)
      setChecking(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    // Redirect after a beat so the user sees the confirmation.
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1500)
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

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f5f8fa' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#2D6A4F' }}
        />
      </div>
    )
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
          {!authorized ? (
            <div className="text-center">
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: '#0f1f2e' }}
              >
                Link expired
              </h1>
              <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
                This password reset link is no longer valid. Request a new one.
              </p>
              <a
                href="/forgot-password"
                className="inline-block py-3 px-5 rounded-xl text-sm font-bold text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                }}
              >
                Get a new reset link
              </a>
            </div>
          ) : success ? (
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
                Password updated
              </h2>
              <p style={{ color: '#5a7080' }}>
                Taking you to your dashboard…
              </p>
            </div>
          ) : (
            <>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: '#0f1f2e' }}
              >
                Choose a new password
              </h1>
              <p className="text-sm mb-6" style={{ color: '#5a7080' }}>
                Pick something you&apos;ll remember — at least 8 characters.
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
                    New password
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
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: '#0f1f2e' }}
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your new password"
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
                    background:
                      'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                    boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
                  }}
                >
                  {loading ? 'Updating...' : 'Update password →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
