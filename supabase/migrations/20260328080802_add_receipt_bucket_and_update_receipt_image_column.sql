-- =========================================
-- Receipt Image Bucket Migration
-- =========================================

-- 1. Create bucket
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do update
set public = true;

-- =========================================
-- 2. Policies
-- ===========================================

-- SELECT
create policy "receipts: select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'receipts'
);

-- INSERT
create policy "receipts: insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'receipts'
);

-- UPDATE
create policy "receipts: update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'receipts'
);

-- =========================================
-- 3. Rename column
-- =========================================
alter table receipts
rename column receipt_url to image_url;