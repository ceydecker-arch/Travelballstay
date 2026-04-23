export default function TrustSection() {
  return (
    <section
      className="py-14 lg:py-16"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border"
          style={{
            backgroundColor: '#e8f5ee',
            borderColor: '#a8d5be',
            color: '#2D6A4F',
          }}
        >
          Built for travel sport families
        </div>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-6"
          style={{ color: '#0f1f2e' }}
        >
          Built for Travel Ball Families. By People Who Get It.
        </h2>
        <p
          className="text-lg leading-relaxed mb-8"
          style={{ color: '#5a7080' }}
        >
          We know what it feels like when your team gets
          scattered across three different hotels. We built
          this so that never happens again.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              number: '39+',
              label: 'Major tournament venues in our database',
            },
            {
              number: '12',
              label: 'States covered at launch',
            },
            {
              number: '1',
              label: 'Place to plan your entire tournament weekend',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: '#f5f8fa',
                border: '1px solid #dde8ee',
              }}
            >
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: '#2D6A4F' }}
              >
                {stat.number}
              </div>
              <div
                className="text-sm leading-relaxed"
                style={{ color: '#5a7080' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
