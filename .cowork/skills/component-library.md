# TravelBallStay Component Library

## Existing Components
Location: C:\Users\ceyde\Travelballstay\components\

Navbar.tsx
- Sticky top nav
- Three color logo
- Auth state aware (shows My Trips/Sign Out when logged in)
- Mobile hamburger menu
- Import: `import Navbar from '@/components/Navbar'`
- Usage: `<Navbar />` at top of every page

Hero.tsx — Homepage hero only
Benefits.tsx — Homepage benefits section
EmailSignup.tsx — Homepage email capture
FeaturedDestinations.tsx — Pulls venues from Supabase
FinalCTA.tsx — Homepage final CTA
Footer.tsx — Homepage footer
HowItWorks.tsx — Homepage how it works
PainSection.tsx — Homepage consequence section
QuickActions.tsx — Homepage two card section
TeamMapFeature.tsx — Homepage map mockup section
TrustSection.tsx — Homepage trust/stats section

## Rules
1. Always use Navbar.tsx on every page
2. Never recreate existing components
3. New reusable components go in /components
4. Page-specific components can be inline in page file
5. Always check this list before building something new
