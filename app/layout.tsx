import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://travelballstay.com'
const SITE_NAME = 'TravelBallStay'
const OG_IMAGE = `${SITE_URL}/og-image.png`
const TITLE = 'TravelBallStay — Where Teams Stay Together'
const DESCRIPTION =
  'The only platform built for youth travel sport families. Find hotels near the fields, coordinate with your team, and plan smarter tournament weekends.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'travel baseball, youth sports travel, tournament hotels, team trip planning, travel ball, softball tournaments, baseball tournament lodging',
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'TravelBallStay — Where Teams Stay Together',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
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
