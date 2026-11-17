# Afterglow

Afterglow is a multi-event memory platform. This repository implements the
first milestone: the responsive Afterglow Studio foundation, Supabase
administrator authentication, and owner-isolated event management.

## Requirements

- Node.js 20.9 or later
- npm
- A Supabase project

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and apply these migrations in order using the
   Supabase SQL editor or Supabase CLI:

   - [`001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)
   - [`002_guest_event_access.sql`](./supabase/migrations/002_guest_event_access.sql)

3. Copy `.env.example` to `.env.local` and set:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

4. Create the first administrator in **Supabase Dashboard → Authentication →
   Users**. Public sign-up is intentionally not part of this milestone.

5. Start the app:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) for the guest experience.
Use **Studio sign in** in the footer to open the administrator workspace.

## Deployment configuration

Set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in your hosting provider's environment
settings before deploying. These publishable values are intended to be used by
the app; database access must still be protected by the configured row-level
security policies. Keep `.env.local` out of GitHub. Never put a Supabase
secret/service-role key in client code or a `NEXT_PUBLIC_` variable.

## Security notes

- Supabase Auth sessions are stored in HTTP-only server-managed cookies.
- Event management reads and writes are protected by row-level security; each
  administrator can only access events they own. Public event cards and event
  access checks use narrowly scoped database functions; guest galleries require
  an event-specific code.
- Event creation and its access-token hash are inserted in one database
  transaction. Only the SHA-256 hash is stored.
- Anonymous database grants are revoked for the milestone's tables. Guests
  will use authorized server endpoints in a later milestone.
- Do not add a Supabase service-role key to client code or public environment
  variables.

## Current milestone

Included: admin sign-in/sign-out, dashboard, multi-event creation and editing,
event status/archive, guest participation settings, configurable retention,
public event discovery, and event-specific guest-code gating. The photo/video
gallery at `/e/preview` remains a mobile-first design preview using local sample
photography.

Not included yet: persisted media storage/uploads, durable likes, guest
messages, realtime updates, or retention cleanup jobs. Files selected in the
gallery stay in the browser and are not uploaded.

Run the available checks with:

```bash
npm run lint
npm run build
```
