-- AR&M Enterprise content and inquiry schema
-- PostgreSQL / Supabase. No public product prices.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_availability') then
    create type product_availability as enum (
      'available',
      'made_to_order',
      'limited',
      'discontinued',
      'contact'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'inquiry_status') then
    create type inquiry_status as enum (
      'new',
      'in_review',
      'quoted',
      'closed',
      'archived'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'resource_type') then
    create type resource_type as enum (
      'article',
      'brochure',
      'datasheet',
      'whitepaper',
      'video',
      'other'
    );
  end if;
end
$$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  parent_id uuid references categories(id) on delete set null,
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  category_id uuid references categories(id) on delete set null,
  category_slug text,
  brand text,
  model text,
  sku text unique,
  images jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  availability product_availability not null default 'contact',
  featured boolean not null default false,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists solutions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  location text,
  completed_on text,
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  type resource_type not null default 'other',
  url text,
  featured boolean not null default false,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  attribution text not null,
  role text,
  organization text,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  role text not null,
  bio text not null default '',
  image jsonb,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'quote',
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  message text not null,
  product_slug text,
  product_title text,
  quantity text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consultation_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'consultation',
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  message text not null,
  topic text,
  preferred_timing text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'service',
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  message text not null,
  service_type text,
  mill_location text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_idx on products (published, featured);
create index if not exists products_category_slug_idx on products (category_slug);
create index if not exists categories_published_idx on categories (published);
create index if not exists services_published_idx on services (published);
create index if not exists solutions_published_idx on solutions (published);
create index if not exists projects_published_idx on projects (published);
create index if not exists resources_published_idx on resources (published);

drop trigger if exists categories_set_updated_at on categories;
create trigger categories_set_updated_at before update on categories for each row execute function set_updated_at();
drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at before update on products for each row execute function set_updated_at();
drop trigger if exists services_set_updated_at on services;
create trigger services_set_updated_at before update on services for each row execute function set_updated_at();
drop trigger if exists solutions_set_updated_at on solutions;
create trigger solutions_set_updated_at before update on solutions for each row execute function set_updated_at();
drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at before update on projects for each row execute function set_updated_at();
drop trigger if exists resources_set_updated_at on resources;
create trigger resources_set_updated_at before update on resources for each row execute function set_updated_at();
drop trigger if exists testimonials_set_updated_at on testimonials;
create trigger testimonials_set_updated_at before update on testimonials for each row execute function set_updated_at();
drop trigger if exists team_members_set_updated_at on team_members;
create trigger team_members_set_updated_at before update on team_members for each row execute function set_updated_at();
drop trigger if exists quote_requests_set_updated_at on quote_requests;
create trigger quote_requests_set_updated_at before update on quote_requests for each row execute function set_updated_at();
drop trigger if exists consultation_requests_set_updated_at on consultation_requests;
create trigger consultation_requests_set_updated_at before update on consultation_requests for each row execute function set_updated_at();
drop trigger if exists service_requests_set_updated_at on service_requests;
create trigger service_requests_set_updated_at before update on service_requests for each row execute function set_updated_at();

-- Database access is server-only through DATABASE_URL. Neon does not provide
-- Supabase's anon/authenticated roles, so the old Supabase RLS policies are
-- intentionally not part of the Neon schema path.
