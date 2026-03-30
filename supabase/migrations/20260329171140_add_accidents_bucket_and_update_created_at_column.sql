-- =========================================
-- Accidents Image Bucket Migration
-- =========================================

-- 1. Create bucket
insert into storage.buckets (id, name, public)
values ('accidents', 'accidents', true)
on conflict (id) do update
set public = true;

-- =========================================
-- 2. Policies
-- ===========================================

-- SELECT
create policy "accidents: select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'accidents'
);

-- INSERT
create policy "accidents: insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'accidents'
);

-- UPDATE
create policy "accidents: update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'accidents'
);

-- =========================================
-- 3. Rename column
-- =========================================
alter table accident_reports
rename column reported_at to created_at;