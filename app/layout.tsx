import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TravelBallStay — Tournament Travel, Finally Figured Out',
  description:
    'Find hotels near the fields, see where your teammates are staying, and keep your whole team coordinated. Built for every youth travel sport.',
  keywords: 'travel baseball, youth sports travel, tournament hotels, team trip planning, travel ball',
  openGraph: {
    title: 'TravelBallStay — Tournament Travel, Finally Figured Out',
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
