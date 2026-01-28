# Casino Referral Tracker

Separate Project Notice: This folder is a separate project from the MCP collaboration server. It is colocated here only for convenience and can be moved to its own repository at any time.

## Overview
A web app for tracking people, monthly casino bonus codes, and per-person usage. It supports a person view (checklist of monthly codes) and a code view (who has and has not used a code). It is intended to be installed on Android as a web app (PWA).

## Hosting and Backend
- Hosting: Vercel.
- Backend: SvelteKit server routes/actions.
- Database: hosted database required (Vercel is stateless). Recommended: Supabase Postgres.

## Process
This project follows Seam Driven Development. See `docs/SDD_MASTER_GUIDE.md` and `docs/AGENT_SOP.md`.

## Quick Start
```bash
cd casino-referral-tracker
npm install --cache .npm-cache
npm run dev
```

## Environment Variables
Set these in `.env` or in Vercel project settings:

- `APP_PASSCODE` (required for auth)
- `APP_SESSION_SECRET` (required, long random string)
- `APP_SESSION_TTL_DAYS` (optional, default `30`)
- `APP_USER_ID` (optional, default `owner`)
- `STORAGE_MODE` (`memory` or `supabase`, default `memory`)
- `STORAGE_SEED` (`sample` or `empty`, default `sample`)
- `SUPABASE_URL` (required for `supabase` mode)
- `SUPABASE_SERVICE_ROLE_KEY` (required for `supabase` mode)

Probe-only:
- `PROBE_MONTH` (required for `npm run probes`)

## Supabase Schema
Use `supabase/schema.sql` to set up tables.

## Decisions So Far
- Framework: SvelteKit.
- Hosting: Vercel.
- Delivery: PWA for Android installation.
- Core entities: People, Codes (by month), and per-person code status.
- Code categories: points, wheel spin, scratch card, slot tournament.
- Auth: passcode gate (single-user).
- Month format: `YYYY-MM`.
- Code uniqueness: unique per month.

## Hidden Assumptions
- Single primary user.
- Manual data entry (no casino integrations).
- Low data volume.
- Email storage is acceptable.
- PWA is sufficient for mobile use.

## Open Questions
- Whether to switch auth to magic-link later.
- Whether to enforce row-level security in Supabase.
- Whether offline support is needed beyond PWA install.

## Recommendations
1) Keep `STORAGE_MODE=memory` for local-only use, switch to `supabase` for shared access.
2) Rotate `APP_SESSION_SECRET` if the passcode is ever shared.
3) Run `npm run probes` after Supabase is seeded to refresh fixtures.
4) Add a scheduled export habit for data backup.
