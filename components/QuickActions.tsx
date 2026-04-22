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
          {/* Card 1 — Explore Tournaments */}
          <a
            href="#tournaments"
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
              <Trophy size={28} color="#1a7a4a" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Explore Tournaments
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.6)' }}
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
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-150 group-hover:opacity-90"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              Explore Tournaments
              <span>→</span>
            </div>
          </a>
          {/* Card 2 — Create a Team Trip */}
          <a
            href="#team-trips"
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
              <Users size={28} color="#1a7a4a" strokeWidth={2} />
            </div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: '#0f1f2e' }}
            >
              Create a Team Trip
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: '#5a7080' }}
            >
              Keep your entire team organized in one place.
              Invite parents and players, see where everyone
              is staying, and keep your team close and
              connected all weekend.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                'Invite parents and players instantly',
                'See where everyone is staying',
                'Keep your team close and connected',
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
              Create a Trip
              <span>→</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
