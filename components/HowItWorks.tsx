import { Search, Hotel, Map } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Enter your tournament',
    description:
      'Search by tournament name or paste the facility address. We pin the fields on the map so everything is anchored to where you actually play.',
  },
  {
    number: '02',
    icon: Hotel,
    title: 'Find the best place to stay',
    description:
      'Browse hotels and rentals ranked by drive time to the fields — not the city center. Filter by pool, kitchen, breakfast, parking, and more.',
  },
  {
    number: '03',
    icon: Map,
    title: 'Your team stays together',
    description:
      'When families mark where they booked, they appear on the team map. See exactly where your teammates are staying and coordinate before you arrive.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#f5f8fa' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <h2 className="section-title">How TravelBallStay works</h2>
          <p className="section-subtitle">Three steps to a stress-free tournament weekend</p>
        </div>

        <div className="relative">
          {/* Dashed connecting line — desktop only */}
          <div
            className="hidden lg:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
            style={{
              backgroundImage: 'repeating-linear-gradient(to right, #1a7a4a 0, #1a7a4a 8px, transparent 8px, transparent 20px)',
              opacity: 0.3,
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">

                  {/* Step number + icon */}
                  <div className="relative mb-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: '#e6f7ee', border: '1px solid #b8e8cf' }}
                    >
                      <Icon size={32} style={{ color: '#1a7a4a' }} strokeWidth={1.5} />
                    </div>
                    <span
                      className="absolute -top-3 -right-3 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white shadow"
                      style={{ backgroundColor: '#1a7a4a' }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: '#0f1f2e' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: '#5a7080' }}>
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
