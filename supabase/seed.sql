-- ============================================================
-- Seed: the current 12 vehicles (published) + one primary image each.
-- Prices are REAL pesos, mileage is REAL km (the site converts internally).
-- Image URLs point at the existing /img assets so the site looks exactly like
-- it does now; when you upload real photos in the admin, they replace these.
-- Guarded: only runs when the vehicles table is empty (safe to re-run).
-- Run AFTER schema.sql.
-- ============================================================
do $$
begin
  if (select count(*) from public.vehicles) = 0 then

    insert into public.vehicles
      (brand, model, year, mileage, price, price_on_request, condition, certified,
       exterior_color, interior_color, hp, drivetrain, engine, featured, status) values
      ('Ferrari',     '296 GTB',       2024,  1995, 22224300, false, 'New',       true,  'Rosso',  'Nero',  819, 'RWD', '3.0L V6 Hybrid',        true,  'published'),
      ('Lamborghini', 'Huracán EVO',   2023,  6259, 23512500, false, 'Pre-Owned', true,  'Giallo', 'Nero',  631, 'AWD', '5.2L V10',              false, 'published'),
      ('Ferrari',     '296 GTS',       2024,  1030,        0, true,  'New',       true,  'Nero',   'Rosso', 819, 'RWD', '3.0L V6 Hybrid',        false, 'published'),
      ('Ferrari',     'SF90 Stradale', 2022,  9847, 31293000, false, 'Pre-Owned', true,  'Rosso',  'Nero',  986, 'AWD', '4.0L V8 Hybrid',        false, 'published'),
      ('Porsche',     '911 Turbo S',   2023,  8383, 15669300, false, 'Pre-Owned', true,  'Grigio', 'Nero',  640, 'AWD', '3.8L Flat-6',           false, 'published'),
      ('Lamborghini', 'Aventador SVJ', 2021,  8013, 34086000, false, 'Pre-Owned', true,  'Giallo', 'Nero',  759, 'AWD', '6.5L V12',              true,  'published'),
      ('McLaren',     '720S',          2022,  6227, 20406000, false, 'Pre-Owned', true,  'Nero',   'Rosso', 710, 'RWD', '4.0L V8 Twin-Turbo',    false, 'published'),
      ('Ferrari',     'Roma',          2023,  6404, 13959300, false, 'Pre-Owned', false, 'Bianco', 'Crema', 612, 'RWD', '3.9L V8',               false, 'published'),
      ('Porsche',     'Taycan Turbo',  2022, 13596, 11286000, false, 'Pre-Owned', true,  'Grigio', 'Nero',  671, 'AWD', 'Dual Electric Motor',   false, 'published'),
      ('McLaren',     'Artura',        2024,  1255, 16501500, false, 'New',       true,  'Nero',   'Cuoio', 671, 'RWD', '3.0L V6 Hybrid',        true,  'published'),
      ('Lamborghini', 'Huracán STO',   2023,  3234,        0, true,  'Pre-Owned', true,  'Nero',   'Rosso', 631, 'RWD', '5.2L V10',              false, 'published'),
      ('Ferrari',     'Portofino M',   2023,  5342, 13167000, false, 'Pre-Owned', false, 'Bianco', 'Blu',   612, 'RWD', '3.9L V8',               false, 'published');

    -- Primary image per vehicle (existing /img assets)
    insert into public.vehicle_images (vehicle_id, image_url, is_primary, sort_order)
    select id, url, true, 0 from public.vehicles v
    join (values
      ('Ferrari',     '296 GTB',       'img/296%20GTB.jpeg'),
      ('Lamborghini', 'Huracán EVO',   'img/Hurac%C3%A1n%20EVO.jpeg'),
      ('Ferrari',     '296 GTS',       'img/gettyimages-1277770032-612x612.jpg'),
      ('Ferrari',     'SF90 Stradale', 'img/gettyimages-157330801-612x612.jpg'),
      ('Porsche',     '911 Turbo S',   'img/911%20Turbo.jpeg'),
      ('Lamborghini', 'Aventador SVJ', 'img/Aventador%20SVJ.jpeg'),
      ('McLaren',     '720S',          'img/gettyimages-182185108-612x612.jpg'),
      ('Ferrari',     'Roma',          'img/gettyimages-1277770032-612x612.jpg'),
      ('Porsche',     'Taycan Turbo',  'img/gettyimages-157330801-612x612.jpg'),
      ('McLaren',     'Artura',        'img/gettyimages-157333521-612x612.jpg'),
      ('Lamborghini', 'Huracán STO',   'img/Hurac%C3%A1n%20STO.jpeg'),
      ('Ferrari',     'Portofino M',   'img/gettyimages-182185108-612x612.jpg')
    ) as m(brand, model, url) on v.brand = m.brand and v.model = m.model;

  end if;
end $$;
