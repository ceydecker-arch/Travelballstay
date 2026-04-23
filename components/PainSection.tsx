'use client'
const consequences = [
  {
    text: 'Families end up booked in different hotels across town',
  },
  {
    text: 'Teams get scattered — nobody is staying in the same area',
  },
  {
    text: 'Long drives to the fields at 6am because your hotel is too far',
  },
  {
    text: 'Nobody knows where anyone else is staying until it\'s too late',
  },
]
export default function PainSection() {
  return (
    <section
      className="py-16 lg:py-20"
      style={{ backgroundColor: '#0f1f2e' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4"
          >
            What Happens Without a Plan
          </h2>
          <p
            className="text-lg"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Sound familiar?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {consequences.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl p-5"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'rgba(229,57,53,0.15)' }}
              >
                <span style={{ color: '#ef5350', fontSize: '18px' }}>✕</span>
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <div
            className="inline-block rounded-2xl px-8 py-5"
            style={{
              backgroundColor: 'rgba(45,106,79,0.15)',
              border: '1px solid rgba(45,106,79,0.3)',
            }}
          >
            <p className="text-xl sm:text-2xl font-bold text-white">
              TravelBallStay fixes that.
            </p>
            <p
              className="text-base mt-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Keep your entire team together —
              close to the fields, all weekend long.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
