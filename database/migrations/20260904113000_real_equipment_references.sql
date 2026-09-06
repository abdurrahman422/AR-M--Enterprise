-- Replace concept artwork with real manufacturer product photography and attach source references.
-- Descriptions are original summaries of the linked official manufacturer material.
with real_media(category_slug, image_url, image_alt, source_title, source_url) as (
  values
    ('feed-mill-machinery', 'https://dam.buhlergroup.com/rendition/e6bfec51ccb44b788fafe58b5a32e375/-FPNG-TwebProduct_1x1-S800x800', 'Real high-capacity feed pellet mill', 'Bühler — Kubex T pellet mill', 'https://www.buhlergroup.com/global/en/products/kubex_t_pellet_mill.html'),
    ('material-handling', 'https://dam.buhlergroup.com/rendition/f8c715199e93407daa5a290207a6af17/-FJPG-TwebProduct_1x1-S800x800', 'Real industrial feed processing equipment', 'Bühler — feed pelleting equipment', 'https://www.buhlergroup.com/global/en/product-families/Pellet-mills.html'),
    ('silo-storage', 'https://dam.buhlergroup.com/rendition/f8c715199e93407daa5a290207a6af17/-FJPG-TwebProduct_1x1-S800x800', 'Real industrial feed plant equipment', 'ANDRITZ — animal feed processing', 'https://www.andritz.com/feed-and-biofuel-en/industries/animal-feed'),
    ('electrical-automation', 'https://dam.buhlergroup.com/rendition/53dd446768dd4c9ab2112cb9326132e1/-FPNG-TwebProduct_1x1-S800x800', 'Real feed grinding equipment with industrial controls', 'Bühler — Vertica hammer mill', 'https://www.buhlergroup.com/global/en/products/vertica_verticalhammermill.html'),
    ('industrial-components', 'https://dam.buhlergroup.com/rendition/792df6211b48475cbc0ec70ce66c5424/-FPNG-TwebProduct_1x1-S800x800', 'Real countercurrent feed cooler', 'Bühler — countercurrent cooler', 'https://www.buhlergroup.com/global/en/products/cooler.html'),
    ('spare-wear-parts', 'https://dam.buhlergroup.com/rendition/d1017ffcbbd149a9b8cc75a6b551e896/-FPNG-TwebProduct_1x1-S800x800', 'Real industrial feed cracker and wear components', 'Bühler — DFZL cracker', 'https://www.buhlergroup.com/global/en/products/cracker.html')
)
update products p
set images = jsonb_build_array(jsonb_build_object('id', gen_random_uuid()::text, 'url', m.image_url, 'alt', m.image_alt, 'sortOrder', 0)),
    documents = jsonb_build_array(jsonb_build_object('id', gen_random_uuid()::text, 'title', m.source_title, 'url', m.source_url, 'fileType', 'Official reference')),
    updated_at = now()
from real_media m
where p.category_slug = m.category_slug and p.published = true;

update products set
  title = 'Kubex T Reference Pellet Mill',
  brand = 'Bühler', model = 'Kubex T 7 Series',
  summary = 'Direct-drive pelleting architecture for high-capacity poultry and livestock feed.',
  description = 'A real-world reference for high-capacity animal-feed pelleting. The direct-drive arrangement removes the conventional transmission, while recipe flexibility, accessible wear parts and automated roller-gap control support demanding production. Published capacity depends on the selected model and recipe; final supply is engineered and quoted against plant data.',
  images = '[{"id":"kubex-real","url":"https://dam.buhlergroup.com/rendition/e6bfec51ccb44b788fafe58b5a32e375/-FPNG-TwebProduct_1x1-S800x800","alt":"Bühler Kubex T 7 Series pellet mill — real manufacturer image","sortOrder":0}]'::jsonb,
  specifications = '[{"id":"kubex-cap","group":"Performance","label":"Published maximum","value":"Up to 80","unit":"t/h","sortOrder":0},{"id":"kubex-drive","group":"Drive","label":"Architecture","value":"Direct drive","sortOrder":1},{"id":"kubex-use","group":"Application","label":"Feed types","value":"Poultry and livestock recipes","sortOrder":2}]'::jsonb,
  documents = '[{"id":"kubex-source","title":"Official technical reference — Bühler","url":"https://www.buhlergroup.com/global/en/products/kubex_t_pellet_mill.html","fileType":"Official reference"}]'::jsonb,
  updated_at = now()
where slug = 'high-capacity-ring-die-pellet-mill';

update products set
  title = 'Vertica Reference Hammer Mill', brand = 'Bühler', model = 'Vertica',
  summary = 'Compact vertical grinding with integrated air circulation and fast process access.',
  description = 'A real equipment reference for feed, grain and biomass grinding. Its vertical configuration avoids a separate external aspiration system, reduces the installed footprint and opens the grinding chamber for inspection and cleaning. Final grinding duty, screen and throughput must be validated from the ingredient and target particle profile.',
  images = '[{"id":"vertica-real","url":"https://dam.buhlergroup.com/rendition/53dd446768dd4c9ab2112cb9326132e1/-FPNG-TwebProduct_1x1-S800x800","alt":"Bühler Vertica vertical hammer mill — real manufacturer image","sortOrder":0}]'::jsonb,
  specifications = '[{"id":"vertica-energy","group":"Efficiency","label":"Published saving","value":"Up to 25%","sortOrder":0},{"id":"vertica-air","group":"Process","label":"Aspiration","value":"Integrated air circulation","sortOrder":1}]'::jsonb,
  documents = '[{"id":"vertica-source","title":"Official technical reference — Bühler","url":"https://www.buhlergroup.com/global/en/products/vertica_verticalhammermill.html","fileType":"Official reference"}]'::jsonb,
  updated_at = now()
where slug = 'heavy-duty-hammer-mill';

update products set
  title = 'Countercurrent Pellet Cooler', brand = 'Bühler', model = 'AHL series reference',
  summary = 'Gentle, even countercurrent cooling before safe storage and transport.',
  description = 'A real equipment reference for cooling hot pellets after the press. Countercurrent airflow lowers product temperature while configurable discharge systems help limit breakage and residue. Air volume, bed depth and discharge arrangement are selected against throughput, pellet condition and ambient conditions.',
  images = '[{"id":"cooler-real","url":"https://dam.buhlergroup.com/rendition/792df6211b48475cbc0ec70ce66c5424/-FPNG-TwebProduct_1x1-S800x800","alt":"Bühler countercurrent pellet cooler — real manufacturer image","sortOrder":0}]'::jsonb,
  specifications = '[{"id":"cooler-temp","group":"Performance","label":"Published outlet target","value":"5–10","unit":"°C above ambient","sortOrder":0},{"id":"cooler-flow","group":"Process","label":"Airflow","value":"Countercurrent","sortOrder":1}]'::jsonb,
  documents = '[{"id":"cooler-source","title":"Official technical reference — Bühler","url":"https://www.buhlergroup.com/global/en/products/cooler.html","fileType":"Official reference"}]'::jsonb,
  updated_at = now()
where slug = 'counterflow-pellet-cooler';

update products set
  title = 'DFZL Reference Crumbler', brand = 'Bühler', model = 'DFZL',
  summary = 'Flexible roller crumbling and cracking for feed and grain process lines.',
  description = 'A real equipment reference for controlled pellet crumbling and grain cracking. Adjustable feeding distributes material across the roller length, while modular crushing stages and roller options adapt the machine to different structures. The final configuration is selected from throughput and particle-size targets.',
  images = '[{"id":"dfzl-real","url":"https://dam.buhlergroup.com/rendition/d1017ffcbbd149a9b8cc75a6b551e896/-FPNG-TwebProduct_1x1-S800x800","alt":"Bühler DFZL cracker — real manufacturer image","sortOrder":0}]'::jsonb,
  documents = '[{"id":"dfzl-source","title":"Official technical reference — Bühler","url":"https://www.buhlergroup.com/global/en/products/cracker.html","fileType":"Official reference"}]'::jsonb,
  updated_at = now()
where slug = 'pellet-crumbler-system';
