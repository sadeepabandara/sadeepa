-- ============================================================
-- Project detail fields + cover images
-- Run in Supabase Dashboard → SQL Editor. Safe to re-run.
-- ============================================================

alter table public.projects add column if not exists image      text;
alter table public.projects add column if not exists url        text;
alter table public.projects add column if not exists category   text;
alter table public.projects add column if not exists overview   text;
alter table public.projects add column if not exists challenge  text;
alter table public.projects add column if not exists solution   text;
alter table public.projects add column if not exists role       text;
alter table public.projects add column if not exists client     text;
alter table public.projects add column if not exists github_url text;
alter table public.projects add column if not exists images     text[];

-- Point each project at its generated cover image (files live in /public/projects).
-- Matches on title; adjust the ilike patterns if your titles differ.
update public.projects set image = '/projects/sadeepa-portfolio.jpg'          where title ilike '%portfolio%'          and (image is null or image = '');
update public.projects set image = '/projects/spendwix.jpg'                   where title ilike '%spendwix%'           and (image is null or image = '');
update public.projects set image = '/projects/frames.jpg'                     where title ilike '%frames%'             and (image is null or image = '');
update public.projects set image = '/projects/melbourne-open-playground.jpg'  where title ilike '%open playground%'    and (image is null or image = '');
update public.projects set image = '/projects/zippy-delivery.jpg'             where title ilike '%zippy%'              and (image is null or image = '');

-- The detail text itself (overview / challenge / solution / role / client)
-- is filled in automatically from lib/projectContent.ts when a column is empty,
-- and you can edit any of it per project in Admin → Projects.
