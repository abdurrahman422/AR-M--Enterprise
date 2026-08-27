-- Seed structural categories and part-identification requests.
-- No products, brands, clients, or performance claims.

insert into categories (id, title, slug, summary, description, sort_order, featured, published)
values
  ('8f0a1b2c-0001-4000-8000-000000000001', 'Feed Mill Machinery', 'feed-mill-machinery', 'Processing machinery used in feed mill plants.', 'Primary and secondary process equipment for feed mill operations.', 1, false, true),
  ('8f0a1b2c-0001-4000-8000-000000000002', 'Spare & Wear Parts', 'spare-wear-parts', 'Replacement and wear components for mill equipment.', 'Spare and wear parts specified against mill equipment, not as a public price list.', 2, false, true),
  ('8f0a1b2c-0001-4000-8000-000000000003', 'Electrical & Automation', 'electrical-automation', 'Electrical, control, and automation components.', 'Control, sensing, and electrical items used in mill and industrial systems.', 3, false, true),
  ('8f0a1b2c-0001-4000-8000-000000000004', 'Material Handling', 'material-handling', 'Conveying and bulk-material movement equipment.', 'Equipment and components for moving raw materials, intermediates, and finished feed.', 4, false, true),
  ('8f0a1b2c-0001-4000-8000-000000000005', 'Silo & Storage', 'silo-storage', 'Storage, silo, and related plant infrastructure.', 'Silo, hopper, and storage equipment used in feed and industrial plants.', 5, false, true),
  ('8f0a1b2c-0001-4000-8000-000000000006', 'Industrial Components', 'industrial-components', 'General industrial components used across mill systems.', 'Cross-cutting industrial components that support mill engineering work.', 6, false, true)
on conflict (id) do nothing;

create table if not exists identify_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'identify',
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  message text not null,
  mill_location text,
  photo_url text,
  photo_name text,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists identify_requests_set_updated_at on identify_requests;
create trigger identify_requests_set_updated_at before update on identify_requests for each row execute function set_updated_at();

alter table identify_requests enable row level security;
