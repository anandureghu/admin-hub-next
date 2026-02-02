--- =========================================
--- Create vehicle image bucket if not exists
--- =========================================

insert into storage.buckets (id, name, public)
values ('vehicles', 'vehicles', true)
on conflict do nothing;
