alter table services add column if not exists sort_order integer not null default 0;
alter table solutions add column if not exists sort_order integer not null default 0;
alter table projects add column if not exists sort_order integer not null default 0;

insert into services (id, title, slug, summary, description, sort_order, featured, published)
values
  (
    '8f0a1b2c-0002-4000-8000-000000000001',
    'Engineering & Plant Design',
    'engineering-plant-design',
    'Process, layout, and plant-design support for feed mill projects.',
    'Engineering and plant-design work covering process arrangement, equipment specification, and mill layout. Scope is defined per project through a consultation or service request.',
    1,
    false,
    true
  ),
  (
    '8f0a1b2c-0002-4000-8000-000000000002',
    'Installation & Commissioning',
    'installation-commissioning',
    'Installation and commissioning support for mill equipment and systems.',
    'Installation and commissioning support for plant equipment and related systems. Work is scoped against the mill, equipment list, and site conditions — not as a public price package.',
    2,
    false,
    true
  )
on conflict (id) do nothing;
