-- ==========================================
-- Add device_id column to users
-- ==========================================

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS device_id TEXT NULL;