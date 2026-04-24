'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Mail, Check, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/signin?redirect=/profile'
        return
      }

      setUserId(user.id)
      setEmail(user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, created_at')
        .eq('id', user.id)
        .maybeSingle()

      if (profile) {
        setFullName(profile.full_name || user.user_metadata?.full_name || '')
        setCreatedAt(profile.created_at)
      } else {
        setFullName(user.user_metadata?.full_name || '')
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setError('')
    setSaving(true)

    const supabase = createClient()

    // Update profiles row
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({ id: userId, full_name: fullName, email }, { onConflict: 'id' })

    if (profileErr) {
      setError(profileErr.message)
      setSaving(false)
      return
    }

    // Also update auth user metadata so the navbar picks up the change
    await supabase.auth.updateUser({ data: { full_name: fullName } })

    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 2000)
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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#2D6A4F' }}
          />
        </div>
      </div>
    )
  }

  const initials =
    (fullName.trim().split(/\s+/)[0]?.[0] || email[0] || '?').toUpperCase() +
    (fullName.trim().split(/\s+/)[1]?.[0] || '').toUpperCase()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f8fa' }}>
      <div
        style={{
          height: '4px',
          background: 'linear-gradient(to right, #2D6A4F, #f59e0b, #2D6A4F)',
        }}
      />

      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold mb-6"
          style={{ color: '#2D6A4F' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </a>

        <div
          className="mb-8"
          style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}
        >
          <h1 className="text-3xl font-extrabold" style={{ color: '#0f1f2e' }}>
            Your Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5a7080' }}>
            Manage how your name appears to your team.
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-8 border"
          style={{ borderColor: '#dde8ee' }}
        >
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 4px 14px rgba(45,106,79,0.35)',
              }}
            >
              {initials || '?'}
            </div>
            <div className="min-w-0">
              <p
                className="text-lg font-bold truncate"
                style={{ color: '#0f1f2e' }}
              >
                {fullName || email.split('@')[0]}
              </p>
              <p className="text-sm truncate" style={{ color: '#5a7080' }}>
                {email}
              </p>
              {createdAt && (
                <p className="text-xs mt-1" style={{ color: '#8fa3b2' }}>
                  Member since{' '}
                  {new Date(createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

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

          {success && (
            <div
              className="rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2"
              style={{
                backgroundColor: '#e8f5ee',
                color: '#1f4d38',
                border: '1px solid #a8d5be',
              }}
            >
              <Check size={16} /> Profile saved.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                style={{ color: '#0f1f2e' }}
              >
                <User size={14} /> Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: '#dde8ee', color: '#0f1f2e' }}
                {...focusStyles}
              />
              <p className="text-xs mt-1.5" style={{ color: '#8fa3b2' }}>
                This is what your team will see.
              </p>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                style={{ color: '#0f1f2e' }}
              >
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{
                  borderColor: '#dde8ee',
                  color: '#8fa3b2',
                  backgroundColor: '#f5f8fa',
                  cursor: 'not-allowed',
                }}
              />
              <p className="text-xs mt-1.5" style={{ color: '#8fa3b2' }}>
                Email changes aren&apos;t supported yet. Contact support if you
                need to update it.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:opacity-95 hover:-translate-y-px disabled:opacity-50"
              style={{
                background:
                  'linear-gradient(135deg, #2D6A4F 0%, #3a8c64 100%)',
                boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
              }}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Account actions */}
        <div
          className="bg-white rounded-2xl p-6 border mt-6"
          style={{ borderColor: '#dde8ee' }}
        >
          <h2 className="text-base font-bold mb-3" style={{ color: '#0f1f2e' }}>
            Account
          </h2>
          <a
            href="/forgot-password"
            className="inline-block text-sm font-semibold"
            style={{ color: '#2D6A4F' }}
          >
            Change password →
          </a>
        </div>
      </div>
    </div>
  )
}
