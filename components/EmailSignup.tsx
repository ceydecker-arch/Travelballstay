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
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#1a7a4a' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
          Get Early Access — It&apos;s Free.
        </h2>

        <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Be among the first families to plan smarter tournament weekends with TravelBallStay.
        </p>

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
