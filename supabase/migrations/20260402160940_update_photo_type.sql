-- 1. Create the custom ENUM type
CREATE TYPE public.vehicle_photo_type AS ENUM (
  'START_FRONT', 
  'START_BACK', 
  'START_LEFT', 
  'START_RIGHT', 
  'END_FRONT', 
  'END_BACK', 
  'END_LEFT', 
  'END_RIGHT',
  'KM_METER' -- Included based on your table definition but omitted from your prompt list
);

-- 2. Remove the old CHECK constraint (so we can change the column type)
ALTER TABLE public.vehicle_photos 
DROP CONSTRAINT IF EXISTS vehicle_photos_photo_type_check;

-- 3. Alter the column to use the new ENUM type
-- We use 'USING photo_type::public.vehicle_photo_type' to cast existing text to the enum
ALTER TABLE public.vehicle_photos 
ALTER COLUMN photo_type TYPE public.vehicle_photo_type 
USING photo_type::public.vehicle_photo_type;

-- 4. (Optional) Set a default if needed
-- ALTER TABLE public.vehicle_photos ALTER COLUMN photo_type SET DEFAULT 'START_FRONT';