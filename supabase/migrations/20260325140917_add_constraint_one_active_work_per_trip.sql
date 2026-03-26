
-- =====================================================
-- Add new constraint one active work per trip
-- =====================================================

CREATE UNIQUE INDEX one_active_work_per_trip
  ON work_sessions (trip_id)
  WHERE status = 'STARTED';