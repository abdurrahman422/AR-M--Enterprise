-- Customer-requested feed-mill equipment and spares catalog.
-- Product names are grouped by application; each group uses a real equipment photograph
-- and an authoritative technical reference. Final model sizing is confirmed at quotation.
with catalog_groups as (
  select * from jsonb_to_recordset($catalog$
  [
    {"group_id":"receiving","category":"feed-mill-machinery","brand":"Industrial Feed Systems","image":"/images/industrial/hero-feed-mill.png","source":"https://www.andritz.com/feed-and-biofuel-en/industries/animal-feed","description":"Raw-material receiving and cleaning equipment for controlled intake, contaminant removal and dependable mill flow.","items":["Truck unloading / receiving pit","Intake hopper","Bag dumping station","Grain pre-cleaner","Vibrating cleaner","Rotary cleaner","Destoner","Magnetic separator","Drum magnet","Grain sieve"]},
    {"group_id":"transport","category":"silo-storage","brand":"Industrial Conveying Systems","image":"/images/industrial/silo-conveyor-system.png","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Bulk-material conveying equipment selected for product density, capacity, route, lift and duty cycle.","items":["Screw conveyor","Chain / drag conveyor","Belt conveyor","Bucket elevator","Pneumatic conveying system","Rotary distributor","Diverter gate"]},
    {"group_id":"storage","category":"silo-storage","brand":"Industrial Storage Systems","image":"/images/industrial/silo-conveyor-system.png","source":"https://www.andritz.com/resource/blob/503394/bc530b3783b62e5c9fc0d1c140932bc2/fb-1326-gb-modular-standard-solution-data.pdf","description":"Feed-mill storage equipment configured around bulk density, live capacity, discharge geometry and level control.","items":["Raw material silo","Maize / corn silo","Soybean meal bin","Bran / rice polish bin","Ingredient bins","Micro-ingredient bins","Day bins","Finished-feed bins","Hopper","Bulk bag / FIBC unloading station"]},
    {"group_id":"grinding","category":"feed-mill-machinery","brand":"ANDRITZ Reference","image":"/images/products/optimill-hammer-mill.webp","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Grinding-section equipment for controlled particle-size reduction, feeding, aspiration and dust separation.","items":["Hammer mill","Feed grinder / crusher","Roller mill — optional","Hammer mill feeder","Grinding chamber","Aspiration system","Cyclone separator","Grinding dust collector"]},
    {"group_id":"dosing","category":"feed-mill-machinery","brand":"Industrial Batching Systems","image":"/images/products/weighing-system.webp","source":"https://www.andritz.com/feed-and-biofuel-en/industries/animal-feed","description":"Batching and dosing equipment for repeatable ingredient weighing and controlled liquid addition.","items":["Automatic batching system","Batch weighing hopper","Main ingredient dosing system","Micro-dosing system","Load-cell weighing system","Premix dosing machine","Liquid dosing system","Oil dosing system","Molasses dosing system","Water dosing system"]},
    {"group_id":"mixing","category":"feed-mill-machinery","brand":"ANDRITZ Reference","image":"/images/products/optimix-paddle-mixer.webp","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Mixing equipment for homogeneous dry ingredients and controlled liquid incorporation.","items":["Horizontal ribbon mixer","Double-shaft paddle mixer","Vertical mixer — small plant","Mixer discharge gate","Mixer feeding screw","Liquid spraying system"]},
    {"group_id":"pelleting","category":"feed-mill-machinery","brand":"ANDRITZ Reference","image":"/images/products/feedmax-pellet-mill.webp","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Pelleting equipment and tooling for conditioning, compression, die handling and stable pellet production.","items":["Conditioner","Steam conditioner","Pellet mill","Ring-die pellet mill","Pellet mill feeder","Pellet die","Pellet rollers","Die lifting / handling device"]},
    {"group_id":"cooling","category":"feed-mill-machinery","brand":"ANDRITZ Reference","image":"/images/products/counterflow-cooler.webp","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Post-pellet cooling and air-handling equipment designed around throughput, ambient conditions and pellet temperature.","items":["Counter-flow cooler","Cooler fan","Cyclone","Air-lock","Cooling duct"]},
    {"group_id":"crumbling","category":"feed-mill-machinery","brand":"ANDRITZ Reference","image":"/images/products/feed-crumbler.webp","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Precision crumbling equipment for producing controlled starter-feed particle sizes with minimized fines.","items":["Crumbler","Crumbler roller"]},
    {"group_id":"screening","category":"feed-mill-machinery","brand":"ANDRITZ Reference","image":"/images/products/rotary-feed-dresser.webp","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Finished-product screening equipment for separating oversize material and returning fines to the process.","items":["Pellet screener","Vibrating sieve","Rotary sieve","Fines return system"]},
    {"group_id":"main-power","category":"electrical-automation","brand":"Industrial Power Systems","image":"/images/products/library/industrial-control-panel.jpg","source":"https://www.se.com/ww/en/work/products/low-voltage-products-and-systems/","description":"Industrial power-distribution equipment engineered to the approved single-line diagram, fault level and connected load.","items":["HT incoming panel","Transformer","LT panel","Main Distribution Board — MDB","Sub Distribution Board — SDB","MCC — Motor Control Centre","Power Factor Correction / PFI panel","Capacitor bank","ATS panel","AMF panel","Generator control panel","Busbar","Bus coupler","Isolator","MCCB","MCB","ACB","RCCB / ELCB","Fuse","Surge Protection Device"]},
    {"group_id":"motor-control","category":"electrical-automation","brand":"Industrial Motor Control","image":"/images/products/library/siemens-contactor.jpg","source":"https://www.siemens.com/en-us/products/sirius/contactors/","description":"Motor-control and protection equipment selected by motor rating, starting method, supply voltage and coordination class.","items":["VFD / Variable Frequency Drive","Soft starter","Star-delta starter","Magnetic contactor","Overload relay","Motor protection relay","Control relay","Timer relay","Phase failure relay"]},
    {"group_id":"automation","category":"electrical-automation","brand":"Industrial Automation","image":"/images/products/library/siemens-s7-plc.jpg","source":"https://www.siemens.com/global/en/products/automation/systems/industrial/plc/s7-1200.html","description":"Industrial automation hardware and software for batching, sequencing, interlocks, visualization and plant communications.","items":["PLC","HMI touch panel","SCADA computer","Industrial PC","Feed formulation / batching software","PLC I/O modules","Remote I/O","Communication modules","Ethernet switch","Industrial router","Control panel"]},
    {"group_id":"transmission","category":"industrial-components","brand":"SKF Reference","image":"/images/products/library/mechanical-shaft-coupling.jpg","source":"https://www.skf.com/binaries/pub12/Images/0901d1968040841a-Power-Transmission-catalogue-11015-EN_tcm_12-576542.pdf","description":"Bearing and power-transmission component selected from confirmed shaft, load, speed, mounting and environment data.","items":["Bearing","Pillow block bearing","Roller bearing","Bush","Shaft","Coupling","Flexible coupling","Gear coupling","Universal joint","Gearbox","Reduction gearbox","Pulley","V-belt","Timing belt","Chain","Sprocket"]},
    {"group_id":"pellet-parts","category":"spare-wear-parts","brand":"Drawing-Matched Spare","image":"/images/products/library/ring-die-roller.jpg","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Pellet-mill wear or mechanical spare supplied against machine model, drawing, material and operating duty.","items":["Ring die","Flat die — applicable models","Roller shell","Roller bearing","Main shaft","Quill shaft","Safety pin","Scraper","Feed cone","Knife","Die clamp"]},
    {"group_id":"hammer-parts","category":"spare-wear-parts","brand":"Drawing-Matched Spare","image":"/images/industrial/hammer-mill.png","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Hammer-mill wear and rotating spare supplied against rotor dimensions, screen profile, material and machine model.","items":["Hammer blades","Hammer pins","Hammer mill screen","Rotor","Rotor shaft","Wear plate","Screen holder"]},
    {"group_id":"mixer-parts","category":"spare-wear-parts","brand":"Drawing-Matched Spare","image":"/images/industrial/batching-mixing-system.png","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Mixer mechanical spare selected from mixer type, batch capacity, shaft dimensions and material compatibility.","items":["Mixing paddle","Ribbon","Mixer shaft","Shaft seal","Discharge gate","Pneumatic cylinder"]},
    {"group_id":"conveyor-parts","category":"spare-wear-parts","brand":"Drawing-Matched Spare","image":"/images/industrial/silo-conveyor-system.png","source":"https://www.andritz.com/feed-and-biofuel-en/media/brochures","description":"Conveyor and elevator spare supplied against pitch, width, material, fixing pattern and operating capacity.","items":["Screw flight","Conveyor chain","Drag flight","Conveyor roller","Idler roller","Conveyor belt","Bucket elevator belt","Elevator bucket","Elevator bolts"]},
    {"group_id":"pneumatic","category":"industrial-components","brand":"Industrial Pneumatic","image":"/images/products/micro-fluid-system.webp","source":"https://www.festo.com/us/en/c/products/valves-and-valve-terminals/solenoid-valves-id_pim133/","description":"Pneumatic component selected by bore or port size, pressure, flow, voltage and environmental conditions.","items":["Solenoid valve","Pneumatic cylinder","FRL unit","Air filter","Regulator","Lubricator","PU air tube","Pneumatic fitting"]},
    {"group_id":"seals-general","category":"industrial-components","brand":"Industrial MRO","image":"/images/products/library/deep-groove-ball-bearing.jpg","source":"https://www.skf.com/group/products/industrial-seals","description":"General maintenance component supplied to confirmed dimensions, material grade, temperature and service conditions.","items":["Oil seal","Mechanical seal","O-ring","Gasket","Rubber seal","Nut","Bolt","Washer","Circlip","Key / keyway material"]},
    {"group_id":"electrical-spares","category":"electrical-automation","brand":"Industrial Electrical","image":"/images/products/library/electrical-contactor.jpg","source":"https://www.se.com/ww/en/work/products/low-voltage-products-and-systems/","description":"Electrical maintenance spare selected by manufacturer reference, current, voltage, pole configuration and control duty.","items":["Contactor","Relay","Overload relay","MCB","MCCB","Fuse","Push button","Selector switch","Emergency-stop switch","Indicator lamp","VFD cooling fan","PLC power supply","Load cell"]}
  ] $catalog$::jsonb) as g(group_id text, category text, brand text, image text, source text, description text, items jsonb)
), requested_products as (
  select g.*, item.value #>> '{}' as product_name, item.ordinality as item_no
  from catalog_groups g
  cross join lateral jsonb_array_elements(g.items) with ordinality item(value, ordinality)
), prepared as (
  select r.*, 'requested-' || r.group_id || '-' || trim(both '-' from lower(regexp_replace(regexp_replace(r.product_name, '[^a-zA-Z0-9]+', '-', 'g'), '-+', '-', 'g'))) as product_slug
  from requested_products r
)
insert into products (
  title, slug, summary, description, category_id, category_slug, brand, model, sku,
  images, specifications, documents, availability, featured, published, seo_title, seo_description
)
select
  p.product_name,
  p.product_slug,
  p.description,
  p.description || ' Configuration and size are finalized from capacity, duty, existing-machine data and site conditions before quotation.',
  c.id,
  p.category,
  p.brand,
  'Project-specific industrial configuration',
  upper(replace(p.group_id, '-', '')) || '-' || lpad(p.item_no::text, 3, '0'),
  jsonb_build_array(jsonb_build_object('id', p.group_id || '-' || p.item_no, 'url', p.image, 'alt', p.product_name || ' industrial product photograph', 'sortOrder', 0)),
  jsonb_build_array(
    jsonb_build_object('id', p.group_id || '-selection-' || p.item_no, 'group', 'Selection', 'label', 'Sizing', 'value', 'Confirmed against capacity and duty', 'sortOrder', 0),
    jsonb_build_object('id', p.group_id || '-supply-' || p.item_no, 'group', 'Supply', 'label', 'Compatibility', 'value', 'Drawing/model confirmation required', 'sortOrder', 1)
  ),
  jsonb_build_array(jsonb_build_object('id', p.group_id || '-reference-' || p.item_no, 'title', 'Manufacturer / technical reference', 'url', p.source, 'fileType', 'Reference')),
  'contact'::product_availability,
  false,
  true,
  p.product_name || ' | AR&M Enterprise',
  p.description
from prepared p
join categories c on c.slug = p.category
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  category_id = excluded.category_id,
  category_slug = excluded.category_slug,
  brand = excluded.brand,
  model = excluded.model,
  sku = excluded.sku,
  images = excluded.images,
  specifications = excluded.specifications,
  documents = excluded.documents,
  availability = excluded.availability,
  published = true,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = now();

-- Use verified real installation photographs for receiving, conveying and storage families.
update products set images = jsonb_set(images, '{0,url}', '"/images/products/library/feed-receiving-pit.jpg"'::jsonb), updated_at = now()
where slug like 'requested-receiving-%';

update products set images = jsonb_set(images, '{0,url}', '"/images/products/library/bucket-elevator-system.jpg"'::jsonb), updated_at = now()
where slug like 'requested-transport-%' or slug like 'requested-conveyor-parts-%';

update products set images = jsonb_set(images, '{0,url}', '"/images/products/library/grain-silo-system.jpg"'::jsonb), updated_at = now()
where slug like 'requested-storage-%';
