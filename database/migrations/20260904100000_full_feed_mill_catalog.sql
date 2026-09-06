-- Comprehensive demonstration catalog for a full-service feed mill engineering company.
-- Product names are generic equipment classes; no manufacturer affiliation is implied.
with catalog as (
  select * from jsonb_to_recordset($catalog$
  [
    {"title":"Vibratory Intake Pre-Cleaner","slug":"vibratory-intake-pre-cleaner","summary":"High-capacity removal of oversize and fine impurities before storage or processing.","description":"A robust pre-cleaning stage for grain and raw-material intake. Screen configuration, aspiration interface, capacity, and structural arrangement are selected from the incoming material and line duty.","category_slug":"feed-mill-machinery","sku":"ARM-CLN-VP","image":"/images/industrial/hammer-mill.png","alt":"Industrial vibratory intake pre-cleaner"},
    {"title":"Drum & Magnet Cleaning Line","slug":"drum-magnet-cleaning-line","summary":"Coordinated scalping and ferrous-metal separation for raw-material protection.","description":"An intake protection package combining drum screening and magnetic separation to reduce foreign-material risk before conveying, grinding, or storage.","category_slug":"feed-mill-machinery","sku":"ARM-CLN-DM","image":"/images/industrial/hero-feed-mill.png","alt":"Feed mill cleaning and magnetic separation line"},
    {"title":"Heavy-Duty Hammer Mill","slug":"heavy-duty-hammer-mill","summary":"Industrial grinding platform configured for feed ingredients and required particle profile.","description":"A heavy-duty hammer mill package with feeder, magnet interface, aspiration connection, drive, and safety provisions. Screen, rotor, and motor selection follow material and throughput data.","category_slug":"feed-mill-machinery","sku":"ARM-HM-HD","image":"/images/industrial/hammer-mill.png","alt":"Heavy-duty feed mill hammer mill"},
    {"title":"Fine Grinding Pulverizer","slug":"fine-grinding-pulverizer","summary":"Fine particle-size reduction for specialized feed and process applications.","description":"A fine-grinding system configured around ingredient characteristics, target particle distribution, temperature management, and downstream process requirements.","category_slug":"feed-mill-machinery","sku":"ARM-FG-PV","image":"/images/industrial/hammer-mill.png","alt":"Industrial fine grinding pulverizer"},
    {"title":"Multi-Stage Steam Conditioner","slug":"multi-stage-steam-conditioner","summary":"Controlled thermal conditioning ahead of the pellet press.","description":"A multi-stage conditioning package for controlled retention, steam contact, and recipe-specific preparation before pelleting. Instrumentation and controls are defined with the line.","category_slug":"feed-mill-machinery","sku":"ARM-CD-MS","image":"/images/industrial/ring-die-pellet-mill.png","alt":"Multi-stage steam conditioner"},
    {"title":"Pellet Crumbler System","slug":"pellet-crumbler-system","summary":"Adjustable reduction of cooled pellets into consistent crumble feed.","description":"A roller crumbler system with bypass, gap adjustment, and downstream screening interface for controlled crumble production.","category_slug":"feed-mill-machinery","sku":"ARM-CR-RL","image":"/images/industrial/ring-die-pellet-mill.png","alt":"Industrial pellet crumbler system"},
    {"title":"Counterflow Pellet Cooler","slug":"counterflow-pellet-cooler","summary":"Efficient cooling and stabilization of pellets after production.","description":"A counterflow cooling package sized to pellet throughput, inlet condition, ambient environment, and discharge requirements, with fan and air-system interfaces.","category_slug":"feed-mill-machinery","sku":"ARM-CL-CF","image":"/images/industrial/cooler-screener.png","alt":"Counterflow pellet cooler"},
    {"title":"Rotary Feed Screener","slug":"rotary-feed-screener","summary":"Separation of fines and oversize material before finished-product handling.","description":"A rotary screening stage configured for pellets or crumbles, with screen selection, bypass, aspiration, and recycle interfaces defined for the process.","category_slug":"feed-mill-machinery","sku":"ARM-SC-RT","image":"/images/industrial/cooler-screener.png","alt":"Rotary finished feed screener"},
    {"title":"Automatic Bagging & Palletizing Line","slug":"automatic-bagging-palletizing-line","summary":"Integrated weighing, bag closing, conveying, and pallet preparation.","description":"A finished-feed packing line configured for bag type, target weight, throughput, closure method, conveying, coding, and pallet-handling requirements.","category_slug":"material-handling","sku":"ARM-PKG-AP","image":"/images/industrial/hero-feed-mill.png","alt":"Automatic feed bagging and palletizing line"},
    {"title":"Heavy-Duty Bucket Elevator","slug":"heavy-duty-bucket-elevator","summary":"Vertical bulk-material transfer for intake, process, and finished-feed sections.","description":"A bucket elevator package selected for material, lift height, capacity, duty cycle, inlet arrangement, discharge, monitoring, and explosion-risk controls where applicable.","category_slug":"material-handling","sku":"ARM-BE-HD","image":"/images/industrial/silo-conveyor-system.png","alt":"Heavy-duty bucket elevator"},
    {"title":"Enclosed Chain Conveyor","slug":"enclosed-chain-conveyor","summary":"Low-speed horizontal conveying for grain, meal, and finished feed.","description":"An enclosed drag-chain conveying system engineered for route, capacity, material, loading points, discharge points, wear protection, and maintenance access.","category_slug":"material-handling","sku":"ARM-CC-EN","image":"/images/industrial/silo-conveyor-system.png","alt":"Enclosed industrial chain conveyor"},
    {"title":"Tubular Screw Conveyor","slug":"tubular-screw-conveyor","summary":"Compact controlled transfer and dosing across mill process sections.","description":"A screw conveying package specified for material behavior, required capacity, incline, length, inlet loading, discharge, and cleanout needs.","category_slug":"material-handling","sku":"ARM-SC-TB","image":"/images/industrial/batching-mixing-system.png","alt":"Tubular screw conveyor"},
    {"title":"Pneumatic Ingredient Transfer System","slug":"pneumatic-ingredient-transfer-system","summary":"Closed transfer of powders and minor ingredients between process stages.","description":"A pneumatic transfer solution developed around product behavior, route, pickup and discharge points, filtration, conveying regime, and controls.","category_slug":"material-handling","sku":"ARM-PT-SYS","image":"/images/industrial/batching-mixing-system.png","alt":"Pneumatic ingredient transfer system"},
    {"title":"Silo Aeration & Level Monitoring Package","slug":"silo-aeration-level-monitoring-package","summary":"Storage-condition support with aeration, temperature, and level visibility.","description":"A coordinated storage monitoring package covering level measurement, temperature inputs, aeration interfaces, alarms, and integration with the plant control system.","category_slug":"silo-storage","sku":"ARM-SILO-MON","image":"/images/industrial/silo-conveyor-system.png","alt":"Silo aeration and level monitoring package"},
    {"title":"Multi-Way Rotary Distributor","slug":"multi-way-rotary-distributor","summary":"Automated routing of bulk material to bins, silos, or process lines.","description":"A rotary distribution unit configured for outlet count, material, capacity, position feedback, sealing, wear protection, and plant-control integration.","category_slug":"material-handling","sku":"ARM-RD-MW","image":"/images/industrial/silo-conveyor-system.png","alt":"Multi-way rotary distributor"},
    {"title":"Industrial Steam Boiler Package","slug":"industrial-steam-boiler-package","summary":"Complete steam-generation package for conditioning and plant utilities.","description":"A boiler and steam-distribution scope developed from process demand, fuel, water condition, operating pressure, redundancy, controls, and local compliance requirements.","category_slug":"industrial-components","sku":"ARM-BLR-PKG","image":"/images/industrial/steam-boiler-package.png","alt":"Industrial steam boiler package"},
    {"title":"Standby Generator & ATS Package","slug":"standby-generator-ats-package","summary":"Coordinated standby power with automatic transfer for critical plant loads.","description":"A generator and automatic transfer package specified from load study, starting duty, essential circuits, fuel strategy, acoustic requirements, and electrical interfaces.","category_slug":"electrical-automation","sku":"ARM-GEN-ATS","image":"/images/industrial/steam-boiler-package.png","alt":"Industrial standby generator and ATS package"},
    {"title":"Central Dust Collection System","slug":"central-dust-collection-system","summary":"Plant-wide aspiration and dust control for cleaner, safer material handling.","description":"A central aspiration package covering pickup points, duct routing, filtration, fan duty, discharge, controls, and maintainable access, subject to process and safety review.","category_slug":"industrial-components","sku":"ARM-DC-CEN","image":"/images/industrial/hero-feed-mill.png","alt":"Central feed mill dust collection system"},
    {"title":"Pellet Mill Ring Die & Roller Set","slug":"pellet-mill-ring-die-roller-set","summary":"Application-matched wear components for pellet press performance and reliability.","description":"Ring dies, roller shells, shafts, and related wear parts matched from machine details, drawing, sample, or verified dimensions. Final specification is confirmed before quotation.","category_slug":"spare-wear-parts","sku":"ARM-SP-PMR","image":"/images/industrial/ring-die-pellet-mill.png","alt":"Pellet mill ring die and roller set"},
    {"title":"Critical Gearbox & Bearing Package","slug":"critical-gearbox-bearing-package","summary":"Matched drive-train spares for planned maintenance and breakdown recovery.","description":"A verified spare package for gearboxes, bearings, seals, couplings, and associated drive components, identified against installed equipment and operating duty.","category_slug":"spare-wear-parts","sku":"ARM-SP-GBB","image":"/images/industrial/hammer-mill.png","alt":"Industrial gearbox and bearing spare package"},
    {"title":"PLC, HMI & SCADA Upgrade Package","slug":"plc-hmi-scada-upgrade-package","summary":"Modernized plant control, visualization, alarms, recipes, and reporting.","description":"A control modernization scope for legacy or fragmented systems, developed from installed I/O, process sequence, panel condition, networking, data, and commissioning constraints.","category_slug":"electrical-automation","sku":"ARM-CTL-UPG","image":"/images/industrial/batching-mixing-system.png","alt":"PLC HMI and SCADA control upgrade"},
    {"title":"Feed Mill Laboratory Starter Suite","slug":"feed-mill-laboratory-starter-suite","summary":"Core sample preparation and quality-control equipment for mill operations.","description":"A practical laboratory equipment package selected around incoming-material checks, process monitoring, finished-feed evaluation, methods, and operator workflow.","category_slug":"industrial-components","sku":"ARM-LAB-SET","image":"/images/industrial/cooler-screener.png","alt":"Feed mill quality control laboratory equipment"}
  ]
  $catalog$::jsonb) as x(
    title text, slug text, summary text, description text, category_slug text,
    sku text, image text, alt text
  )
)
insert into products (
  title, slug, summary, description, category_id, category_slug, sku,
  images, specifications, documents, availability, featured, published,
  seo_title, seo_description
)
select
  catalog.title,
  catalog.slug,
  catalog.summary,
  catalog.description,
  categories.id,
  catalog.category_slug,
  catalog.sku,
  jsonb_build_array(jsonb_build_object(
    'id', gen_random_uuid()::text,
    'url', catalog.image,
    'alt', catalog.alt,
    'sortOrder', 0
  )),
  jsonb_build_array(
    jsonb_build_object('id', gen_random_uuid()::text, 'group', 'Configuration', 'label', 'Capacity', 'value', 'Project specified', 'sortOrder', 0),
    jsonb_build_object('id', gen_random_uuid()::text, 'group', 'Delivery', 'label', 'Integration', 'value', 'Engineering support available', 'sortOrder', 1)
  ),
  '[]'::jsonb,
  'made_to_order'::product_availability,
  false,
  true,
  catalog.title,
  catalog.summary
from catalog
join categories on categories.slug = catalog.category_slug
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
  published = excluded.published,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = now();
