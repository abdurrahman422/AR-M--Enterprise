alter table solutions add column if not exists problem text not null default '';
alter table solutions add column if not exists approach text not null default '';
alter table solutions add column if not exists deliverables jsonb not null default '[]'::jsonb;

alter table projects add column if not exists category text;
alter table projects add column if not exists client_name text;
alter table projects add column if not exists scope text;
alter table projects add column if not exists service_ids jsonb not null default '[]'::jsonb;
alter table projects add column if not exists results text;

alter table quote_requests add column if not exists requirement text;
alter table quote_requests add column if not exists file_url text;
alter table quote_requests add column if not exists file_name text;
alter table consultation_requests add column if not exists requirement text;
alter table consultation_requests add column if not exists file_url text;
alter table consultation_requests add column if not exists file_name text;
alter table service_requests add column if not exists requirement text;
alter table service_requests add column if not exists file_url text;
alter table service_requests add column if not exists file_name text;
alter table identify_requests add column if not exists requirement text;
alter table identify_requests add column if not exists file_url text;
alter table identify_requests add column if not exists file_name text;

insert into services (id, title, slug, summary, description, sort_order, featured, published)
values
  ('8f0a1b2c-0002-4000-8000-000000000003', 'Preventive Maintenance', 'preventive-maintenance', 'Planned inspection and maintenance support for mill equipment.', 'Preventive maintenance is scoped against the installed equipment, operating conditions, and the mill’s maintenance calendar. Commercial terms are issued on request.', 3, false, true),
  ('8f0a1b2c-0002-4000-8000-000000000004', 'Breakdown & Technical Support', 'breakdown-technical-support', 'Technical support for equipment faults and unplanned stoppages.', 'Breakdown and technical support covers fault diagnosis, spare matching, and recovery guidance. Response method and site attendance are agreed per request.', 4, false, true),
  ('8f0a1b2c-0002-4000-8000-000000000005', 'Retrofit & Upgrades', 'retrofit-upgrades', 'Equipment and process upgrades on existing mill lines.', 'Retrofit and upgrade work is defined against the current plant, available space, and the intended process change. Scope and commercial terms follow a site or drawing review.', 5, false, true),
  ('8f0a1b2c-0002-4000-8000-000000000006', 'Automation & Control', 'automation-control', 'Control, sensing, and automation support for mill systems.', 'Automation and control work covers panels, sensing, sequencing, and related electrical items as specified for the mill. Integration scope is confirmed before quotation.', 6, false, true),
  ('8f0a1b2c-0002-4000-8000-000000000007', 'Silo & Storage Solutions', 'silo-storage-solutions', 'Silo, hopper, and bulk-storage engineering support.', 'Silo and storage support covers hoppers, silos, and related conveying interfaces. Design and supply scope depends on product, capacity, and site constraints.', 7, false, true),
  ('8f0a1b2c-0002-4000-8000-000000000008', 'Boiler & Steam Systems', 'boiler-steam-systems', 'Steam-generation and distribution support for mill utilities.', 'Boiler and steam-system work is specified against utility demand, fuel, and plant layout. Scope is confirmed through engineering review, not a standard package price.', 8, false, true),
  ('8f0a1b2c-0002-4000-8000-000000000009', 'Generator & Power Systems', 'generator-power-systems', 'Standby and plant power equipment support.', 'Generator and power-system support covers specification and integration of plant power equipment. Electrical interface and load data are required before quotation.', 9, false, true),
  ('8f0a1b2c-0002-4000-8000-00000000000a', 'Technical Consultancy', 'technical-consultancy', 'Independent engineering review for process, plant, and equipment decisions.', 'Technical consultancy is scoped to the question at hand: process, layout, equipment selection, or recovery. Engagements start with a consultation request.', 10, false, true)
on conflict (id) do nothing;

insert into solutions (id, title, slug, summary, description, problem, approach, deliverables, sort_order, featured, published)
values
  (
    '8f0a1b2c-0003-4000-8000-000000000001',
    'New Feed Mill Setup',
    'new-feed-mill-setup',
    'From process intent to an engineered plant path for a new mill.',
    'A structured path covering layout, equipment specification, installation, and commissioning for a new feed mill.',
    'A new mill needs process arrangement, equipment selection, and a commissioning sequence before production can start.',
    'Review capacity intent, process flow, equipment specification, and installation sequencing with the project team.',
    '["Process and layout input","Equipment specification support","Installation and commissioning plan","Quote-based commercial terms"]'::jsonb,
    1, false, true
  ),
  (
    '8f0a1b2c-0003-4000-8000-000000000002',
    'Plant Upgrade & Expansion',
    'plant-upgrade-expansion',
    'Upgrade or expand an existing mill without inventing a greenfield plant.',
    'Upgrade and expansion work is fitted to the current mill, available space, and the intended process change.',
    'An operating mill needs more capacity, a process change, or replacement of constrained equipment while remaining in production.',
    'Assess the existing line, bottlenecks, and available space, then specify retrofit or expansion work against that baseline.',
    '["Plant assessment notes","Upgrade or expansion specification","Installation interface plan","Quote-based commercial terms"]'::jsonb,
    2, false, true
  ),
  (
    '8f0a1b2c-0003-4000-8000-000000000003',
    'Feed Mill Automation',
    'feed-mill-automation',
    'Control and automation specified against the actual mill process.',
    'Automation is scoped to the process, existing panels, and the control outcomes required by the mill.',
    'Manual or fragmented control limits consistent operation, tracing, or safe sequencing of mill equipment.',
    'Map the current process and electrical condition, then specify sensing, sequencing, and control work that fits the plant.',
    '["Control-scope definition","Sensing and panel specification support","Integration notes for existing equipment","Quote-based commercial terms"]'::jsonb,
    3, false, true
  ),
  (
    '8f0a1b2c-0003-4000-8000-000000000004',
    'Plant Optimization',
    'plant-optimization',
    'Engineering review of process, equipment, and operating constraints.',
    'Optimization work starts from the current mill condition. No performance percentages are claimed without verified data.',
    'The mill is running, but process flow, equipment condition, or utilities limit stable output.',
    'Review process, equipment, and operating data provided by the mill, then recommend targeted changes.',
    '["Findings from the review","Recommended process or equipment changes","Prioritized next steps","Quote-based commercial terms"]'::jsonb,
    4, false, true
  ),
  (
    '8f0a1b2c-0003-4000-8000-000000000005',
    'Spare Parts & Technical Support',
    'spare-parts-technical-support',
    'Identify, specify, and quote parts against mill equipment — without public prices.',
    'Spare and technical-support work matches parts and advice to the installed equipment. Listings never show public prices.',
    'A mill needs the correct spare or wear part and technical confirmation before ordering.',
    'Identify the part from marking, drawing, photo, or mill context, then quote the specified item.',
    '["Part identification support","Specification against the mill equipment","Quote on request","Optional technical follow-up"]'::jsonb,
    5, false, true
  ),
  (
    '8f0a1b2c-0003-4000-8000-000000000006',
    'Troubleshooting & Recovery',
    'troubleshooting-recovery',
    'Diagnose faults and plan recovery for mill equipment and process.',
    'Troubleshooting is scoped to the reported fault, available data, and site access. Recovery steps are agreed before work starts.',
    'Equipment or process has stopped or is unstable, and the mill needs a structured path back to operation.',
    'Collect fault data, markings, and operating context, then diagnose and propose recovery work.',
    '["Fault diagnosis notes","Recommended recovery steps","Spare or service specification if required","Quote-based commercial terms"]'::jsonb,
    6, false, true
  )
on conflict (id) do nothing;
