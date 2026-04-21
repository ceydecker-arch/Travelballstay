const sports = [
  { icon: '⚾', label: 'Baseball' },
  { icon: '🥎', label: 'Softball' },
  { icon: '⚽', label: 'Soccer' },
  { icon: '🏀', label: 'Basketball' },
  { icon: '🏐', label: 'Volleyball' },
  { icon: '📣', label: 'Cheerleading' },
  { icon: '🏈', label: 'Football' },
  { icon: '🤼', label: 'Wrestling' },
  { icon: '🎾', label: 'Tennis' },
  { icon: '🏒', label: 'Hockey' },
  { icon: '🥍', label: 'Lacrosse' },
  { icon: '➕', label: 'More Coming' },
]

export default function SportsCovered() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="section-title">Built for every travel sport</h2>
          <p className="section-subtitle">
            Started with travel baseball. Built for every sport.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {sports.map((sport) => (
            <div
              key={sport.label}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-green-200 cursor-pointer"
            >
              <span className="text-3xl leading-none">{sport.icon}</span>
              <span
                className="text-xs font-semibold text-center leading-tight transition-colors group-hover:text-green-700"
                style={{ color: '#4a5e6d' }}
              >
                {sport.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
