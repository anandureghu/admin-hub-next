--- =========================================
--- Create avatar image bucket if not exists
--- =========================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set public = true;
