# TravelBallStay — Product Roadmap

Last updated: April 23, 2026

---

## Where we are

**Phase 1 — Foundation (complete)**
Homepage, inner pages, auth, invite flow, brand system, Supabase schema, seed tournament data.

---

## Phase 2B — Make existing pages fully functional

The pages exist but some features are still placeholders. These need to actually work against real Supabase data.

1. Tournament search — search and filter results working with real data
2. Trip detail — Team tab — show real members who joined
3. Trip detail — Stays tab — show real family stay data
4. Mark your stay — save to Supabase and update trip
5. Join trip flow — invite code works end to end
6. Dashboard — show real trips the user created

---

## Phase 3 — The Team Map

The core differentiator. Real Google Maps with live family pins.

1. Get Google Maps API key set up
2. Build the map component
3. Show tournament venue as main pin
4. Show family stay pins color-coded by status
5. Real-time updates when a family marks their stay
6. Tap a pin to see family name and property

---

## Phase 4 — Lodging Results

Families find where to stay near the fields.

1. Build lodging search results page
2. Hotels and rentals ranked by distance to venue
3. Filter by amenities — pool, kitchen, breakfast
4. Affiliate links to Airbnb and Hotels.com
5. "Mark as interested" and "Mark as booked" from results

---

## Phase 5 — Notifications + Polish

Makes the app sticky and keeps families engaged.

1. Email notifications via Resend
   - "Your teammate just booked at Hampton Inn"
   - Trip invite emails
2. Nearby places — restaurants, grocery, urgent care
3. Google Places API integration
4. Mobile PWA optimization
5. Real testimonials section

---

## Phase 6 — Growth + Monetization

Once real families are using it.

1. Team Pro plan — $9.99/month
2. Stripe payments
3. Tournament organizer accounts
4. SEO pages for every city and tournament
5. Analytics with PostHog

---

## Open dependencies / blockers

- **GoDaddy DNS** — website builder needs to be unpublished to regain DNS control. Required for Vercel custom domain polish, Resend domain verification, and email deliverability on `@travelballstay.com`.
- **Resend SMTP** — currently on Supabase's built-in mailer with ~3-4/hour rate limit. Custom SMTP via Resend will lift this to 100/day on the free tier (immediate, no DNS required) and unlimited once domain is verified.
- **Google Maps API key** — needed before Phase 3 can start.
- **Google Places API key** — needed for Phase 5 nearby-places work.
