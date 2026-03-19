-- =========================================
-- Trip Dashboard Image Bucket Migration
-- =========================================

-- 1. Create bucket
insert into storage.buckets (id, name, public)
values ('trip_dashboard', 'trip_dashboard', true)
on conflict (id) do update
set public = true;

-- =========================================
-- 2. Policies
-- ===========================================

-- SELECT
create policy "trip_dashboard: select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'trip_dashboard'
);

-- INSERT
create policy "trip_dashboard: insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'trip_dashboard'
);

-- UPDATE
create policy "trip_dashboard: update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'trip_dashboard'
);
