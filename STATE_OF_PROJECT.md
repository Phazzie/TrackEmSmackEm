# State of the Project (for handoff)

This file is the handoff snapshot for the Track Em Smack Em repo so another AI (or human) can pick up quickly.

## Conventional elements of a good state-of-project message
- Executive summary of what exists and what works.
- Inventory of features delivered vs. missing.
- How to run the app locally.
- Environment variables and secrets needed.
- Test status and known failures.
- Key risks and blockers.
- Open questions that still need decisions.
- Repo layout and important paths.
- Next steps with clear priorities.

## Unconventional (but useful) elements
- “If you only have 30 minutes” checklist.
- Assumptions we made without proof.
- What would surprise a new contributor.
- Decisions that are easy to undo vs. expensive to undo.
- Known shortcuts taken to unblock progress.
- How to verify key flows quickly (smoke steps).
- Things that looked small but are traps.

## State of the Project (implemented)

### Executive summary
A SvelteKit app is scaffolded and wired for a single-user casino referral tracker. The UI supports people, monthly codes, per-person usage tracking, and an export endpoint. Storage defaults to in-memory seeded data; Supabase is wired via an adapter but not tested. Auth is a passcode gate using signed cookies. The app follows Seam Driven Development with contracts, fixtures, mocks, adapters, tests, and probes.

### Feature inventory
- ✅ People list + create person form.
- ✅ Person detail with monthly checklist, used toggles, and optional result amount.
- ✅ Codes list + create code form with category.
- ✅ Code detail showing used vs not used.
- ✅ Export endpoint (CSV/JSON).
- ✅ Passcode gate with signed cookie.
- ✅ PWA manifest + icon.
- ✅ Seam Driven Development assets (contracts, fixtures, mocks, adapters, tests, probes, verify script).
- ❌ Supabase setup + data seeding (schema only).
- ❌ Supabase adapter probes/tests (requires credentials + data).
- ❌ Playwright/browser tests (removed to reduce dependency footprint).

### Repository layout (important paths)
- `contracts/` — Zod schemas for storage + auth.
- `fixtures/` — sample + fault fixtures for storage and auth.
- `probes/` — Supabase probe (requires env).
- `src/lib/adapters/` — memory + Supabase storage, passcode auth.
- `src/lib/mocks/` — fixture-backed mocks.
- `src/lib/reporting/` — totals + usage utilities.
- `src/routes/` — SvelteKit UI routes.
- `supabase/schema.sql` — database schema.

### Files still to create (to finish MVP cleanly)
Required:
- `.env` (local only, not committed) — set `APP_PASSCODE`, `APP_SESSION_SECRET`, `STORAGE_MODE`, etc.
- `supabase/seed.sql` — seed data so probes and demo data work without manual inserts.
- `src/routes/logout/+server.ts` — clear `trackem_session` cookie and redirect to `/login`.
- `tests/integration/app-flow.test.ts` — minimal end-to-end test to cover create person, create code, set assignment, and export.

Optional (if chosen later):
- `supabase/rls.sql` — Row Level Security policies if you move beyond single-user.
- `supabase/indexes.sql` — additional indexes if query volume grows.

### Coding styles and conventions (must-follow)
- Seam Driven Development order: Contract → Probe → Fixture → Mock → Test → Adapter.
- Every seam has `fixtures/<seam>/sample.json` and `fixtures/<seam>/fault.json`.
- Mocks must load fixtures from disk (no hardcoded fake data).
- Adapters: no `fs.*Sync`, no `process.cwd()`, no `child_process`, no importing other adapters.
- No `as any` / `as unknown as` in `src/`.
- No top-level `let` in non-test files.
- Use `.js` extension in TypeScript imports for runtime ESM compatibility.
- Keep server logic in SvelteKit `+page.server.ts` / `+server.ts`; avoid `localStorage` in shared code.

### How to run locally
```bash
cd casino-referral-tracker
npm install --cache .npm-cache
npm run dev
```

### Environment variables
Required for auth:
- `APP_PASSCODE`
- `APP_SESSION_SECRET`

Optional:
- `APP_SESSION_TTL_DAYS` (default 30)
- `APP_USER_ID` (default owner)
- `STORAGE_MODE` (`memory` or `supabase`, default memory)
- `STORAGE_SEED` (`sample` or `empty`, default sample)

Supabase mode:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Probe-only:
- `PROBE_MONTH`

### Test status
- Not run. `npm install` failed earlier due to Node engine mismatch.
- The current Node version is v23.8.0; SvelteKit tooling expects ^20.19 or ^22.12 or >=24.
- `.npmrc` was changed to `engine-strict=false`, but install was not re-run after user declined approval.

### Known risks and blockers
- Supabase requires schema creation and data seeding before probes or adapters can be validated.
- Auth is a passcode gate; if env vars are missing, the login page will fail (but the app will be open).
- No offline sync logic; PWA is installable but assumes online for Supabase mode.

### Assumptions (unverified)
- Single-user usage and no role separation.
- Month format `YYYY-MM` is sufficient for reporting.
- Result amount is optional and numeric; totals sum only used assignments.

### Shortcuts taken
- Removed browser test tooling from the scaffold to minimize install burden.
- Default storage is memory with a sample fixture to show UI without setup.

### “If you only have 30 minutes” checklist
1) Fix Node version to an accepted range (20.19, 22.12, or >=24).
2) Run `npm install --cache .npm-cache`.
3) Run `npm test` to validate fixtures + adapters.
4) Decide if you want `STORAGE_MODE=memory` or `supabase`.

### Smoke verification (manual)
- `/login` → enter passcode → redirect to `/people`.
- Add a person, then click into their detail page.
- Add a code, then mark it used with a result amount.
- Visit `/codes/:id` and confirm used vs unused lists.
- Download `/export/data?month=YYYY-MM&format=csv`.

### Decisions that are costly to undo
- Supabase schema choices and column names.
- Auth style (passcode vs magic link).

### Decisions that are easy to undo
- UI theme and layout.
- Default storage seed.

### Open questions
- Should passcode auth remain or move to magic-link auth later?
- Should Supabase Row Level Security be enforced?
- Is offline behavior required for PWA use?

### Next steps (priority order)
1) Install dependencies with a supported Node version and run tests.
2) Create Supabase project and apply `supabase/schema.sql`.
3) Decide on auth (passcode vs magic-link).
4) Wire Supabase env vars and validate probes.
5) Add lightweight integration tests for core flows.
