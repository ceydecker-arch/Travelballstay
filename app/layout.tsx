import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TravelBallStay — Where Teams Stay Together',
  description:
    'Find hotels near the fields, coordinate with your team, and plan smarter tournament weekends. Built for every travel sport family.',
  keywords: 'travel baseball, youth sports travel, tournament hotels, team trip planning, travel ball',
  openGraph: {
    title: 'TravelBallStay — Where Teams Stay Together',
    description:
      'The only platform built specifically for youth travel sports families. Find lodging near the fields and coordinate with your team.',
    url: 'https://travelballstay.com',
    siteName: 'TravelBallStay',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
