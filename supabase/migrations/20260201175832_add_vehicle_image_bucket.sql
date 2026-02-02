--- =========================================
--- Create vehicle image bucket if not exists
--- =========================================

insert into storage.buckets (id, name, public)
values ('vehicles', 'vehicles', true)
<<<<<<< HEAD
on conflict (id) do update
set public = true;
=======
on conflict do nothing;
>>>>>>> 2a3b06b (feat: Implement vehicle image upload and display functionality for vehicles, including a new Supabase storage bucket and UI for image management.)
