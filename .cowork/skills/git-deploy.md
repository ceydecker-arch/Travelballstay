# Git and Deployment Rules

## Repository
GitHub: github.com/ceydecker-arch/Travelballstay
Branch: main
Auto-deploys to Vercel on every push to main

## Commit Format
```
git add .
git commit -m "Brief description of what changed"
git push origin main
```

## Commit Message Examples
- "Phase 2B — trip flow fully functional"
- "Tournament search — real data filtering"
- "Team map — Google Maps with family pins"
- "Bug fix — trip members infinite recursion"

## When To Commit
After each completed feature or phase
After fixing a bug
After a design update
NOT after every single file change

## Critical Rules
NEVER commit .env.local
NEVER commit node_modules
NEVER push API keys or credentials
Always verify .gitignore has .env.local before pushing

## Environment Variables
These must be set in Vercel dashboard manually:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_GOOGLE_MAPS_KEY (when added)

After adding new env vars to Vercel:
Always trigger a redeploy from Vercel dashboard
