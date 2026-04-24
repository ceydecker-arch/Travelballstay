'use client'

import { useEffect, useRef } from 'react'

export interface StayPin {
  id: string
  lat: number
  lng: number
  familyName: string
  propertyName: string | null
  booked: boolean
}

export interface VenuePin {
  id: string
  lat: number
  lng: number
  name: string
  venueType?: 'venue'
}

interface TeamMapProps {
  stays: StayPin[]
  venue?: VenuePin | null
  height?: number | string
}

/**
 * Client-only Leaflet map. Centers on the venue if present, otherwise on the
 * stays, otherwise on a default US view. No API key required — uses
 * OpenStreetMap tiles.
 */
export default function TeamMap({
  stays,
  venue,
  height = 420,
}: TeamMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!mapRef.current || mapInstanceRef.current) return

      // Leaflet reads `window`, so only import in the browser.
      const L = (await import('leaflet')).default

      // Inject the default Leaflet stylesheet once per session so we don't
      // have to touch the global CSS setup. It's a tiny file.
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        link.integrity =
          'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        link.crossOrigin = ''
        document.head.appendChild(link)
      }

      if (cancelled || !mapRef.current) return

      // Default center: continental US
      let center: [number, number] = [39.8283, -98.5795]
      let zoom = 4

      if (venue) {
        center = [venue.lat, venue.lng]
        zoom = 12
      } else if (stays.length > 0) {
        const avg = stays.reduce(
          (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
          { lat: 0, lng: 0 }
        )
        center = [avg.lat / stays.length, avg.lng / stays.length]
        zoom = 11
      }

      const map = L.map(mapRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      })

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }
      ).addTo(map)

      // Custom pin markers using divIcon so we can style with inline CSS.
      const makeIcon = (color: string, label: string) =>
        L.divIcon({
          className: '',
          html: `<div style="
            width: 34px; height: 34px; border-radius: 50%;
            background: ${color};
            color: white;
            display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 13px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            border: 3px solid white;
          ">${label}</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        })

      const bounds: Array<[number, number]> = []

      if (venue) {
        const marker = L.marker([venue.lat, venue.lng], {
          icon: makeIcon('#f59e0b', '⚾'),
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'DM Sans', sans-serif;">
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b;">Venue</div>
              <div style="font-size: 14px; font-weight: 700; color: #0f1f2e; margin-top: 2px;">${escapeHtml(venue.name)}</div>
            </div>`
          )
        marker.openPopup()
        bounds.push([venue.lat, venue.lng])
      }

      stays.forEach((s) => {
        const initials =
          (s.familyName.trim().split(/\s+/)[0]?.[0] || '?').toUpperCase()
        const color = s.booked ? '#2D6A4F' : '#3a8c64'
        L.marker([s.lat, s.lng], { icon: makeIcon(color, initials) })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'DM Sans', sans-serif;">
              <div style="font-size: 14px; font-weight: 700; color: #0f1f2e;">${escapeHtml(s.familyName)}</div>
              ${s.propertyName ? `<div style="font-size: 12px; color: #2D6A4F; margin-top: 2px;">${escapeHtml(s.propertyName)}</div>` : ''}
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${s.booked ? '#2D6A4F' : '#92400e'}; margin-top: 4px;">${s.booked ? '✓ Booked' : 'Interested'}</div>
            </div>`
          )
        bounds.push([s.lat, s.lng])
      })

      if (bounds.length > 1) {
        map.fitBounds(bounds as any, { padding: [40, 40], maxZoom: 14 })
      }

      mapInstanceRef.current = map
    }

    init()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={mapRef}
      style={{
        height,
        width: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #dde8ee',
      }}
    />
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
