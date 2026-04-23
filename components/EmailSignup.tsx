'use client'

import { useState } from 'react'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#2D6A4F' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
          Get Early Access — Keep Your Team Together.
        </h2>

        <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Join families who are done letting their team get scattered across hotels every tournament weekend.
        </p>

        <div className="flex flex-col gap-2 max-w-xs mx-auto mb-6 text-left">
          {[
            'Free early access when we launch',
            'First to know about new tournaments in your area',
            'No spam — one email when we are ready',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: 'rgba(111,219,169,0.2)', color: '#6fdba9' }}
              >
                ✓
              </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3.5 rounded-xl text-sm font-medium outline-none bg-white"
              style={{ color: '#0f1f2e' }}
            />
            <button
              type="submit"
              className="flex-shrink-0 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95"
              style={{ backgroundColor: '#0f1f2e', color: 'white' }}
            >
              Join the waitlist
            </button>
          </form>
        ) : (
          <div
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl text-white font-semibold"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-xl">✓</span>
            You&apos;re on the list! We&apos;ll be in touch soon.
          </div>
        )}

        <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          No spam. Just updates. Unsubscribe anytime.
        </p>

      </div>
    </section>
  )
}
