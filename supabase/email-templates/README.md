# Supabase email templates

Paste these into your Supabase dashboard under:
**Authentication → Email Templates**

Each file in this folder maps to one of the built-in templates.

| File | Supabase template | When it fires |
| --- | --- | --- |
| `confirm-signup.html` | **Confirm signup** | New account sign-up |
| `magic-link.html` | **Magic Link** | Passwordless sign-in link |
| `reset-password.html` | **Reset Password** | "Forgot password" flow |
| `invite-user.html` | **Invite user** | Admin-invited users |
| `change-email.html` | **Change Email Address** | Email-change confirmation |

## Template variables used

Supabase exposes Go template variables you can use inside the HTML.
The most important ones:

- `{{ .ConfirmationURL }}` — the link the user clicks (already includes the token)
- `{{ .Token }}` — the 6-digit OTP code (for Email OTP templates)
- `{{ .SiteURL }}` — from **Project Settings → Auth**
- `{{ .Email }}` — the recipient address

## Subject lines

Use the "Subject" field in Supabase for each template:

- Confirm signup: **Confirm your TravelBallStay account**
- Magic Link: **Your TravelBallStay sign-in link**
- Reset Password: **Reset your TravelBallStay password**
- Invite user: **You're invited to join TravelBallStay**
- Change Email: **Confirm your new TravelBallStay email**

## Testing

After pasting, click **Send test email** in the dashboard — or trigger a
real sign-up / password reset from the app. Make sure the confirmation
URL still points at `/auth/callback` so cookies are set server-side.
