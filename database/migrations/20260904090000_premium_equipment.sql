-- High-value equipment catalog. Commercial pricing remains quote-only.
update products
set published = false, featured = false, updated_at = now()
where slug = 'ser';

insert into products (
  id, title, slug, summary, description, category_id, category_slug, sku,
  images, specifications, documents, availability, featured, published,
  seo_title, seo_description
)
values
(
  '9a410001-1000-4000-8000-000000000001',
  'High-Capacity Ring Die Pellet Mill',
  'high-capacity-ring-die-pellet-mill',
  'Heavy-duty pelletizing platform for high-throughput feed production lines.',
  'A high-capacity ring die pellet mill engineered as the core of an industrial feed production line. Final motor, die, conditioning, and line-integration specifications are selected against the required formula, output, and utility conditions.',
  (select id from categories where slug = 'feed-mill-machinery'),
  'feed-mill-machinery', 'ARM-PM-HD',
  '[{"id":"pm-img-1","url":"/images/industrial/ring-die-pellet-mill.png","alt":"High-capacity ring die pellet mill","sortOrder":0}]'::jsonb,
  '[{"id":"pm-spec-1","group":"Configuration","label":"Drive","value":"Project specified","sortOrder":0},{"id":"pm-spec-2","group":"Process","label":"Conditioning","value":"Single or multi-stage","sortOrder":1}]'::jsonb,
  '[]'::jsonb, 'made_to_order', true, true,
  'High-Capacity Ring Die Pellet Mill',
  'Industrial ring die pellet mill configured for high-throughput feed production. Specification and quotation on request.'
),
(
  '9a410001-1000-4000-8000-000000000002',
  'Automated Batching & Dosing System',
  'automated-batching-dosing-system',
  'Integrated weighing, dosing, and control for repeatable production batches.',
  'An automated batching and dosing architecture for major and minor ingredients, designed around recipe complexity, bin arrangement, accuracy requirements, and the existing control environment.',
  (select id from categories where slug = 'electrical-automation'),
  'electrical-automation', 'ARM-BD-AUTO',
  '[{"id":"bd-img-1","url":"/images/industrial/batching-mixing-system.png","alt":"Automated batching and dosing system","sortOrder":0}]'::jsonb,
  '[{"id":"bd-spec-1","group":"Controls","label":"Operation","value":"PLC-based automation","sortOrder":0},{"id":"bd-spec-2","group":"Integration","label":"Recipes","value":"Project configured","sortOrder":1}]'::jsonb,
  '[]'::jsonb, 'made_to_order', true, true,
  'Automated Feed Mill Batching & Dosing System',
  'Integrated batching, weighing, dosing, and PLC control system for industrial feed mills.'
),
(
  '9a410001-1000-4000-8000-000000000003',
  'Twin-Shaft Paddle Mixer System',
  'twin-shaft-paddle-mixer-system',
  'Industrial mixing platform for rapid, consistent batch preparation.',
  'A twin-shaft paddle mixer system supplied as part of a coordinated batching and mixing section. Vessel volume, discharge arrangement, liquid addition, access, and controls are engineered to the application.',
  (select id from categories where slug = 'feed-mill-machinery'),
  'feed-mill-machinery', 'ARM-MX-TS',
  '[{"id":"mx-img-1","url":"/images/industrial/batching-mixing-system.png","alt":"Twin-shaft paddle mixer system","sortOrder":0}]'::jsonb,
  '[{"id":"mx-spec-1","group":"Configuration","label":"Mixer type","value":"Twin-shaft paddle","sortOrder":0},{"id":"mx-spec-2","group":"Options","label":"Liquid addition","value":"Available","sortOrder":1}]'::jsonb,
  '[]'::jsonb, 'made_to_order', true, true,
  'Twin-Shaft Paddle Mixer for Feed Mills',
  'Industrial twin-shaft paddle mixer system configured for feed mill batching applications.'
),
(
  '9a410001-1000-4000-8000-000000000004',
  'Complete Grain Silo & Conveyor System',
  'complete-grain-silo-conveyor-system',
  'Large-scale bulk storage with engineered intake, transfer, and discharge.',
  'A complete grain storage package combining silos, intake, enclosed conveying, aeration interfaces, level monitoring, and controlled discharge. Capacity and civil interfaces are developed from site and material data.',
  (select id from categories where slug = 'silo-storage'),
  'silo-storage', 'ARM-SILO-SYS',
  '[{"id":"silo-img-1","url":"/images/industrial/silo-conveyor-system.png","alt":"Complete grain silo and conveyor system","sortOrder":0}]'::jsonb,
  '[{"id":"silo-spec-1","group":"Scope","label":"Storage capacity","value":"Project specified","sortOrder":0},{"id":"silo-spec-2","group":"Handling","label":"Conveying route","value":"Engineered to site","sortOrder":1}]'::jsonb,
  '[]'::jsonb, 'made_to_order', true, true,
  'Complete Grain Silo and Conveyor System',
  'Engineered grain silos, intake, conveying, monitoring, and discharge for industrial feed plants.'
),
(
  '9a410001-1000-4000-8000-000000000005',
  'Turnkey Feed Mill Processing Line',
  'turnkey-feed-mill-processing-line',
  'Integrated process equipment package from intake through finished feed handling.',
  'A coordinated feed mill processing line covering intake, grinding, batching, mixing, pelleting, cooling, screening, and finished-product handling. The final scope is engineered from product mix, capacity, automation, utilities, and site constraints.',
  (select id from categories where slug = 'feed-mill-machinery'),
  'feed-mill-machinery', 'ARM-LINE-TK',
  '[{"id":"line-img-1","url":"/images/industrial/hero-feed-mill.png","alt":"Turnkey automated feed mill processing line","sortOrder":0}]'::jsonb,
  '[{"id":"line-spec-1","group":"Engineering","label":"Process scope","value":"End-to-end","sortOrder":0},{"id":"line-spec-2","group":"Delivery","label":"Commissioning","value":"Available","sortOrder":1}]'::jsonb,
  '[]'::jsonb, 'made_to_order', true, true,
  'Turnkey Feed Mill Processing Line',
  'Integrated industrial feed mill line engineered from intake through finished-feed handling.'
),
(
  '9a410001-1000-4000-8000-000000000006',
  'Central Plant Automation & MCC Suite',
  'central-plant-automation-mcc-suite',
  'Plant-wide control, motor management, sequencing, and operating visibility.',
  'A central automation and motor-control package for coordinated feed mill operation. Panel architecture, PLC and HMI scope, motor control, interlocks, field interfaces, and commissioning are defined against the plant.',
  (select id from categories where slug = 'electrical-automation'),
  'electrical-automation', 'ARM-AUTO-MCC',
  '[{"id":"mcc-img-1","url":"/images/industrial/batching-mixing-system.png","alt":"Central plant automation and motor control suite","sortOrder":0}]'::jsonb,
  '[{"id":"mcc-spec-1","group":"Controls","label":"Architecture","value":"PLC and HMI","sortOrder":0},{"id":"mcc-spec-2","group":"Electrical","label":"Motor control","value":"Project specified","sortOrder":1}]'::jsonb,
  '[]'::jsonb, 'made_to_order', true, true,
  'Feed Mill Plant Automation and MCC Suite',
  'Plant-wide PLC, HMI, motor control, sequencing, and commissioning for industrial feed mills.'
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  category_id = excluded.category_id,
  category_slug = excluded.category_slug,
  sku = excluded.sku,
  images = excluded.images,
  specifications = excluded.specifications,
  availability = excluded.availability,
  featured = excluded.featured,
  published = excluded.published,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = now();
