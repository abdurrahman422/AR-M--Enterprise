# AR&M Enterprise Launch Guide

## Required environment

Copy `.env.example` to `.env.local` and set real values. Do not commit `.env.local`.

- `NEXT_PUBLIC_SITE_URL`: canonical production URL.
- `DATA_DRIVER`: use `neon` for production persistence.
- `DATABASE_URL`: Neon PostgreSQL connection string for all database CRUD and inquiries.
- `AUTH_SECRET`: random secret of at least 32 characters.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: initial admin credentials. Use a secret manager in deployment.
- `RESEND_API_KEY`, `INQUIRY_NOTIFY_EMAIL`, and `EMAIL_FROM`: optional email notifications. Leave unset to disable delivery; the app reports that email is not configured.
- `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_ADDRESS`, and social URL variables: set only verified company details.

## Neon database setup

1. Create a Neon database and set `DATABASE_URL` in the deployment environment.
2. Run the SQL files in `supabase/migrations` in filename order against Neon. They contain PostgreSQL schema and seed SQL; Storage-specific statements are conditional and can be skipped on Neon.
3. Set `DATA_DRIVER=neon`. All database reads and writes use the server-only `DATABASE_URL`.
4. Create the admin credentials in the deployment environment before opening `/admin/login`.

## Optional Supabase Storage

File uploads remain Supabase-backed in this phase. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to keep upload functionality enabled. These credentials are not used for database access.

## Build and deploy

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run start
```

Set all environment variables in the hosting provider, deploy the production build, then verify the canonical URL, sitemap, public forms, media upload, admin login, and inquiry inbox. Admin routes use `noindex` metadata and are protected by the signed HTTP-only session cookie.

## External blockers

Real company contact details, Neon `DATABASE_URL`, admin credentials, optional Supabase Storage credentials, and email provider credentials must be supplied by the business owner. The repository intentionally leaves unknown business claims and contact values blank.
