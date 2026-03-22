-- =========================================
-- Add trip current location
-- =========================================

alter table trips
add current_location geography(point, 4326);