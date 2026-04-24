# Supabase Patterns for TravelBallStay

## Always Use These Clients
Browser/client components:
```ts
import { createClient } from '@/lib/supabase'
const supabase = createClient()
```

Server components:
```ts
import { createServerSupabaseClient } from '@/lib/supabase-server'
const supabase = await createServerSupabaseClient()
```

## Auth Patterns
Check auth in client component:
```ts
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/signin' }
```

## Standard Query Pattern
```ts
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)

if (error) {
  console.error('Error:', error)
  // Show user friendly error message
  // Never show raw error to user
}
```

## Join Pattern
```ts
const { data } = await supabase
  .from('trips')
  .select(`
    *,
    trip_members (
      id,
      profile_id,
      role,
      profiles (full_name, email)
    ),
    family_stays (*)
  `)
  .eq('id', tripId)
  .single()
```

## RLS Rules To Remember
- trips: user must be created_by or trip_member
- trip_members: user must be profile_id
- family_stays: user must be profile_id
- venues/tournaments/organizations: public read
- profiles: user reads/updates own only

## Error Handling Rule
Always wrap in try/catch or check error object.
Never show Supabase error messages directly to user.
Show friendly messages like:
"Something went wrong. Please try again."

## Never Do This
Never use the service role key in frontend code.
Never expose credentials in committed files.
Always use .env.local for credentials.
