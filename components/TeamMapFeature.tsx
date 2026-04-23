import { Check } from 'lucide-react'

const benefits = [
  'See all teammates on one map',
  'Color-coded booking status',
  'Updates in real time as families book',
  'Works for hotels and rental houses',
]

const familyPins = [
  { name: 'Johnson family', top: '28%', left: '52%', status: 'booked', initials: 'JF' },
  { name: 'Martinez family', top: '45%', left: '68%', status: 'booked', initials: 'MF' },
  { name: 'Thompson family', top: '60%', left: '38%', status: 'interested', initials: 'TF' },
  { name: 'Garcia family', top: '35%', left: '28%', status: 'booked', initials: 'GF' },
  { name: 'Lee family', top: '70%', left: '62%', status: 'interested', initials: 'LF' },
]

export default function TeamMapFeature() {
  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text content */}
          <div>
            {/* Label pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-5 border"
              style={{ backgroundColor: '#e6f7ee', borderColor: '#b8e8cf', color: '#1a7a4a' }}
            >
              <span className="text-base">📍</span>
              The Team Map
            </div>

            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 leading-tight"
              style={{ color: '#0f1f2e' }}
            >
              See where your whole team is staying.
            </h2>

            <p className="text-lg leading-relaxed mb-8" style={{ color: '#5a7080' }}>
              See exactly where every family is staying — all in one place.
              When families mark where they booked, they show up as pins on the team map —
              color coded by booking status. Blue means booked. Yellow means interested.
              See at a glance who is near the fields and who still needs to book.
            </p>

            {/* Benefit checklist */}
            <ul className="space-y-3 mb-10">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#e6f7ee' }}
                  >
                    <Check size={12} style={{ color: '#1a7a4a' }} strokeWidth={3} />
                  </div>
                  <span className="text-base font-medium" style={{ color: '#0f1f2e' }}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="/create-trip"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#1a7a4a' }}
            >
              See how it works
              <span>→</span>
            </a>
          </div>

          {/* Right — CSS map mockup */}
          <div className="relative">
            {/* Map container */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl border"
              style={{
                borderColor: '#dde8ee',
                height: '420px',
                background: 'linear-gradient(135deg, #e8f0f8 0%, #d4e4f0 50%, #e0ecd8 100%)',
              }}
            >
              {/* Map grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f1f2e" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapgrid)" />
              </svg>

              {/* Mock roads */}
              <div className="absolute inset-0">
                <div className="absolute bg-white opacity-60" style={{ top: '48%', left: 0, right: 0, height: '10px', borderRadius: '2px' }} />
                <div className="absolute bg-white opacity-60" style={{ left: '42%', top: 0, bottom: 0, width: '10px', borderRadius: '2px' }} />
                <div className="absolute bg-white opacity-40" style={{ top: '28%', left: '15%', right: '20%', height: '6px', transform: 'rotate(-8deg)', borderRadius: '2px' }} />
              </div>

              {/* Tournament facility pin — prominent */}
              <div
                className="absolute z-20 flex flex-col items-center"
                style={{ top: '50%', left: '44%', transform: 'translate(-50%, -100%)' }}
              >
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg mb-1 whitespace-nowrap"
                  style={{ backgroundColor: '#1a7a4a' }}
                >
                  🏟️ Tournament Fields
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: '#1a7a4a' }}
                />
              </div>

              {/* Family pins */}
              {familyPins.map((pin) => (
                <div
                  key={pin.name}
                  className="absolute z-10 group flex flex-col items-center cursor-pointer"
                  style={{ top: pin.top, left: pin.left, transform: 'translate(-50%, -100%)' }}
                >
                  {/* Tooltip on hover */}
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 px-2 py-1 rounded-md text-xs font-semibold text-white mb-1 whitespace-nowrap shadow"
                    style={{ backgroundColor: '#0f1f2e' }}
                  >
                    {pin.name}
                  </div>
                  <div
                    className="w-9 h-9 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: pin.status === 'booked' ? '#2a7fc4' : '#f59e0b',
                    }}
                  >
                    {pin.initials}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div
                className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-md border"
                style={{ borderColor: '#dde8ee' }}
              >
                <p className="text-xs font-bold mb-2" style={{ color: '#0f1f2e' }}>
                  Booking status
                </p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2a7fc4' }} />
                    <span className="text-xs" style={{ color: '#5a7080' }}>Booked (3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                    <span className="text-xs" style={{ color: '#5a7080' }}>Interested (2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1a7a4a' }} />
                    <span className="text-xs" style={{ color: '#5a7080' }}>Fields</span>
                  </div>
                </div>
              </div>

              {/* Team count badge */}
              <div
                className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 shadow-md border text-center"
                style={{ borderColor: '#dde8ee' }}
              >
                <p className="text-lg font-bold" style={{ color: '#1a7a4a' }}>5/8</p>
                <p className="text-xs" style={{ color: '#5a7080' }}>families placed</p>
              </div>
            </div>

            {/* Floating card below map */}
            <div
              className="absolute -bottom-5 -right-4 bg-white rounded-xl px-4 py-3 shadow-lg border hidden lg:block"
              style={{ borderColor: '#dde8ee' }}
            >
              <p className="text-xs font-semibold" style={{ color: '#1a7a4a' }}>
                ✓ Johnson family just booked!
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#8fa3b2' }}>
                Hampton Inn · 4 min from fields
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
