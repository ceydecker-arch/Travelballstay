export default function FinalCTA() {
  return (
    <section
      className="py-16 lg:py-20"
      style={{ backgroundColor: '#0f1f2e' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
        >
          Stop Stressing About Tournament Travel.
        </h2>
        <p
          className="text-lg mb-10"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          Your next tournament weekend just got easier.
          Find your tournament, discover the best stays,
          and keep your whole team together — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tournaments"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#1a7a4a' }}
          >
            Explore Tournaments →
          </a>
          <a
            href="#team-trips"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150 hover:bg-white hover:text-gray-900 active:scale-95"
            style={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
            }}
          >
            Create a Team Trip
          </a>
        </div>
        <p
          className="text-sm mt-8"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Free to use. No credit card required.
        </p>
      </div>
    </section>
  )
}
