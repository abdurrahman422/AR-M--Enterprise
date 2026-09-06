create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  requirement text,
  message text not null,
  file_url text,
  file_name text,
  product_slug text,
  product_title text,
  quantity text,
  topic text,
  preferred_timing text,
  service_type text,
  mill_location text,
  photo_url text,
  photo_name text,
  status text not null default 'new',
  priority text not null default 'normal',
  notes jsonb not null default '[]'::jsonb,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_kind_status_idx on inquiries (kind, status, created_at desc);

drop trigger if exists inquiries_set_updated_at on inquiries;
create trigger inquiries_set_updated_at before update on inquiries for each row execute function set_updated_at();

create table if not exists site_settings (
  id text primary key default 'default',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into site_settings (id, payload) values ('default', '{}'::jsonb) on conflict (id) do nothing;

-- Inquiries and settings are accessed only by server actions through DATABASE_URL.

alter table resources add column if not exists sort_order integer not null default 0;
alter table testimonials add column if not exists sort_order integer not null default 0;
