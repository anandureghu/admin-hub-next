-- ==========================================
-- Add status column to work_sessions
-- ==========================================

ALTER TABLE work_sessions
ADD COLUMN status text
CHECK (status IN ('STARTED', 'ENDED'))
DEFAULT 'STARTED';
