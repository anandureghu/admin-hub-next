-- ===========================================
-- Avatars bucket RLS policies
-- ===========================================

-- SELECT
create policy "avatars: authenticated users can select"
on storage.objects
FOR SELECT 
TO authenticated 
USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
);

-- INSERT (upload)
create policy "avatars: authenticated users can upload"
on storage.objects
for INSERT
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
);

-- UPDATE (rename / replace)
create policy "avatars: authenticated users can update"
on storage.objects
for UPDATE
to authenticated
USING (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
);
