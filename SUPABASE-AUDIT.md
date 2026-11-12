# Regalien Supabase Integration Audit

## Current architecture

- The repository is a Vite + React + TypeScript frontend, not a Next.js application.
- Browser access uses `src/lib/supabase.ts` with the configured publishable key.
- `server/supabase.ts` is an SSR client factory, but this Vite project has no active server route or middleware that invokes it.
- `src/context/AppContext.tsx` loads public data and authenticated admin data from Supabase.
- `src/lib/database.types.ts` represents the repository migration contract.
- `src/data/initialData.ts` retains verified local project media as an offline/empty-state fallback; it is not a substitute for successful database reads.

## Current integration status

- Public reads query `projects`, `faqs`, `testimonials`, and `business_settings`.
- Authenticated admin reads query all supported content/customer tables and the optional `tasks` table independently.
- Inquiry and appointment submissions write to Supabase.
- Admin CRUD uses authenticated Supabase writes and relies on deployed RLS policies.
- Project media remains filesystem-backed under `public/`; Storage upload is not configured.
- Email notification and calendar behavior remain local previews/URL generation, not persisted server operations.
- Errors now distinguish missing schema/columns, RLS/permission failures, and connection failures.

## Database-backed surfaces required

- Public published project listing, galleries, and project detail metadata.
- Public published FAQs and approved/published testimonials.
- Public inquiry submission.
- Public appointment submission.
- Authorized admin project, FAQ, testimonial, inquiry, and appointment management.
- Actual dashboard counts and business settings.
- Storage upload for authorized project media, if the existing database/storage schema supports it.

## Known compatibility constraints

- The repository contains reviewable migrations under `supabase/migrations/`; they are not executed automatically.
- Existing Supabase tables, columns, RLS policies, RPCs, and storage buckets must still be verified in the target project before applying optional migrations.
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_STORAGE_BUCKET` are the browser/server configuration names.
- The supplied public media remains filesystem-backed under `public/`; this audit does not treat those assets as database records or replace them with invented URLs.
- The Vite SPA has Supabase Auth/session state and verifies administrator authorization through the existing role table/RPC. Server-side route protection requires an active deployed server runtime or Edge Function.
- Project uploads use the configured `project-media` bucket and persist returned public URLs in the project's `gallery`; the bucket and policies still require manual migration application.

## Security observations

- No service-role credential is present in the repository.
- Admin authorization in the browser is paired with the `is_regalien_admin()` database helper and RLS policies from the reviewable migrations; those migrations must be applied before production admin writes are enabled.
- Browser localStorage is not suitable for private customer records or protected administration.
- The publishable Supabase key may be used in the browser only with restrictive RLS and validated public write policies.
