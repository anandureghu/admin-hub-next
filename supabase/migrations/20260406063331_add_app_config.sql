-- ==========================================
-- Create enum for update mode
-- ==========================================

CREATE TYPE app_update_mode AS ENUM (
  'NONE',       -- No update required
  'WARNING',    -- Show warning but allow app usage
  'FORCE'       -- Block app until update
);

-- ==========================================
-- Create app_config table
-- ==========================================

CREATE TABLE app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Version Control
  min_supported_version text NOT NULL DEFAULT '1.0.0',
  latest_version text NOT NULL DEFAULT '1.0.0',

  -- Update behavior
  update_mode app_update_mode NOT NULL DEFAULT 'NONE',

  -- Messages
  warning_message text DEFAULT 'A new update is available.',
  force_message text DEFAULT 'This version is no longer supported. Please update the app.',

  -- APK Download URL
  apk_url text,

  -- Maintenance Mode (optional but highly recommended)
  maintenance_mode boolean DEFAULT false,
  maintenance_message text DEFAULT 'App is under maintenance. Please try again later.',

  -- Active config
  is_active boolean DEFAULT true,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==========================================
-- Insert Default Config Row
-- ==========================================

INSERT INTO app_config (
  min_supported_version,
  latest_version,
  update_mode
)
VALUES (
  '1.0.0',
  '1.0.0',
  'NONE'
);

-- ==========================================
-- Trigger for updated_at
-- ==========================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger app_config_updated_at
  before update on app_config
  for each row execute function update_updated_at();

-- ==========================================
-- Unique index for only one active config
-- ==========================================

create unique index only_one_active_config 
  on app_config (is_active) 
  where is_active = true;