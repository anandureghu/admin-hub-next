-- =====================================================
-- Add new constraint one work per trip
-- =====================================================

CREATE UNIQUE INDEX one_active_work_per_trip
  ON work_sessions (trip_id)
  WHERE status = 'STARTED';