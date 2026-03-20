-- =========================================
-- Add trip images
-- =========================================

alter table trips
add column start_image text,
add column end_image text;