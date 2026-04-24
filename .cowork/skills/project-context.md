# TravelBallStay Project Context

## What This Is
Youth travel sports tournament coordination platform.
Helps families find tournaments, book team stays,
and coordinate where everyone is staying via a team map.

## Live URLs
Production: https://www.travelballstay.com
Local dev: http://localhost:3000

## Tech Stack
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase (database + auth)
- Vercel (hosting)
- GitHub: github.com/ceydecker-arch/Travelballstay

## Project Location
C:\Users\ceyde\Travelballstay

## Supabase
URL: https://akztsfvgvwymyphekoxh.supabase.co
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrenRzZnZndnd5bXlwaGVrb3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjQ5NzQsImV4cCI6MjA5MjU0MDk3NH0.FrXNuczfsxcqLeajP57GhOVK_qfGxCGBgcxsoOCx1KQ
Browser client: lib/supabase.ts
Server client: lib/supabase-server.ts

## Database Tables
- organizations (id, name, abbreviation, website)
- venues (id, name, city, state, field_count,
  description, gradient, badge, sports[],
  nearby_stays, season, address, latitude,
  longitude, zip, website)
- tournaments (id, name, organization_id, sport,
  age_groups[], start_date, end_date,
  entry_fee, website)
- tournament_venues (tournament_id, venue_id, is_primary)
- profiles (id, full_name, email, avatar_url)
- trips (id, name, tournament_id, venue_id,
  created_by, invite_code, start_date,
  end_date, notes)
- trip_members (id, trip_id, profile_id, role)
- family_stays (id, trip_id, profile_id,
  property_name, address, latitude, longitude,
  booking_status, check_in, check_out, notes)
- lodging_options (id, venue_id, name, type,
  address, latitude, longitude, price_per_night,
  rating, amenities[], affiliate_url)

## Current Build Status
COMPLETE:
- Homepage all sections
- Sign up / Sign in pages
- Dashboard page
- Create trip page
- Trip detail page
- Join trip page
- Mark your stay page
- Tournament search page
- Supabase connection
- Auth system

IN PROGRESS:
- Phase 2B — making all pages fully functional
- Team map (Phase 3)
- Lodging results (Phase 4)

NOT STARTED:
- Google Maps integration
- Email notifications (Resend)
- Nearby places
- Stripe payments
