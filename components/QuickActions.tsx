import { Trophy, Users } from 'lucide-react'
export default function QuickActions() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: '#0f1f2e' }}
          >
            Everything You Need for Tournament Travel
          </h2>
          <p
            className="text-lg mt-3 max-w-2xl mx-auto"
            style={{ color: '#5a7080' }}
          >
            Whether you are searching for your next event or
            organizing your team — we have you covered.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 — Create a Team Trip (featured) */}
          <a
            href="#team-trips"
            className="group relative rounded-2xl p-8 overflow-hidden no-underline block transition-all duration-200 hover:-translate-y-1"
            style={{
              backgroundColor: '#0f1f2e',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(26,122,74,0.2)' }}
            >
              <Users size={28} color="#1a7a4a" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Keep Your Entire Team Together
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              See exactly where every family is staying, stay
              close to the fields, and avoid splitting across
              multiple hotels all weekend.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'See where every family is staying',
                'Stay close to the tournament fields',
                'Avoid splitting across multiple hotels',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#1a7a4a' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p
              className="text-sm mb-6"
              style={{ color: '#f59e0b', fontWeight: 500 }}
            >
              Don&apos;t let your team scatter across town.
            </p>
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-150 group-hover:opacity-90"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              Create a Team Trip
              <span>→</span>
            </div>
          </a>
          {/* Card 2 — Explore Tournaments */}
          <a
            href="#tournaments"
            className="group relative rounded-2xl p-8 overflow-hidden no-underline block transition-all duration-200 hover:-translate-y-1"
            style={{
              backgroundColor: '#f5f8fa',
              border: '1px solid #dde8ee',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: '#e6f7ee' }}
            >
              <Trophy size={28} color="#1a7a4a" strokeWidth={2} />
            </div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: '#0f1f2e' }}
            >
              Explore Tournaments
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: '#5a7080' }}
            >
              Find your event and see the best places to stay
              fast. Search by tournament, venue, or city and
              view nearby hotels and rentals ranked by drive
              time to the fields.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                'Search by tournament, venue, or city',
                'View nearby hotels and rentals',
                'Stay close to the fields',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: '#4a5e6d' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#1a7a4a' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150 border-2 group-hover:bg-green-50"
              style={{
                borderColor: '#1a7a4a',
                color: '#1a7a4a',
              }}
            >
              Explore Tournaments
              <span>→</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
