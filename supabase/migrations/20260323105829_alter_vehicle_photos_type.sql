-- =====================================================
-- Drop the inline check constraint dynamically
-- =====================================================
DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'vehicle_photos'::regclass
  AND contype = 'c';
  
  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE vehicle_photos DROP CONSTRAINT ' || quote_ident(constraint_name);
  END IF;
END $$;

-- =====================================================
-- Drop the Column
-- =====================================================
ALTER TABLE vehicle_photos
ALTER COLUMN photo_type DROP NOT NULL;

-- =====================================================
-- Update exising rows
-- =====================================================

UPDATE vehicle_photos SET photo_type = 'START_FRONT' WHERE photo_type = 'FRONT';
UPDATE vehicle_photos SET photo_type = 'START_BACK'  WHERE photo_type = 'BACK';
UPDATE vehicle_photos SET photo_type = 'START_LEFT'  WHERE photo_type = 'LEFT';
UPDATE vehicle_photos SET photo_type = 'START_RIGHT' WHERE photo_type = 'RIGHT';

-- =====================================================
-- Recreate the photo_type column
-- =====================================================

ALTER TABLE vehicle_photos
ALTER COLUMN photo_type TYPE text;

-- =====================================================
-- Add new constraint
-- =====================================================

ALTER TABLE vehicle_photos
ADD CONSTRAINT vehicle_photos_photo_type_check
CHECK (
  photo_type IN (
    'START_FRONT',
    'START_BACK',
    'START_LEFT',
    'START_RIGHT',
    'END_FRONT',
    'END_BACK',
    'END_LEFT',
    'END_RIGHT',
    'KM_METER'
  )
);

-- =====================================================
-- Restore NOT NULL
-- =====================================================

ALTER TABLE vehicle_photos
ALTER COLUMN photo_type SET NOT NULL;