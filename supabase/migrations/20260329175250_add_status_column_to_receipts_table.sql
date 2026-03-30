-- ==========================================
-- Create enum safely
-- ==========================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'receipt_status'
  ) THEN
    CREATE TYPE receipt_status AS ENUM (
      'PENDING',
      'VERIFIED',
      'REJECTED'
    );
  END IF;
END $$;


-- ==========================================
-- Add column safely
-- ==========================================

ALTER TABLE receipts
ADD COLUMN IF NOT EXISTS status receipt_status
DEFAULT 'PENDING';


-- ==========================================
-- Update existing rows
-- ==========================================

UPDATE receipts
SET status = 'PENDING'
WHERE status IS NULL;


-- ==========================================
-- Add index
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_receipts_status
ON receipts(status);