-- Formline: run this entire file once in Supabase Dashboard > SQL Editor > New query.
-- This is designed for the Supabase free plan.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('client', 'architect', 'admin');
create type public.application_status as enum ('draft', 'submitted', 'under_review', 'changes_requested', 'approved', 'rejected', 'suspended');
create type public.consultation_status as enum ('requested', 'accepted', 'declined', 'cancelled', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'client',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.architect_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  studio_name text not null,
  slug text unique,
  city text,
  founded_year integer,
  website text,
  bio text,
  specialty text,
  service_regions text,
  budget_range text,
  availability_note text,
  application_status public.application_status not null default 'draft',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  architect_id uuid not null references public.architect_profiles(id) on delete cascade,
  kind text not null check (kind in ('professional_license', 'identity', 'insurance', 'other')),
  storage_path text not null,
  issuing_body text,
  license_number text,
  expires_at date,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  architect_id uuid not null references public.architect_profiles(id) on delete cascade,
  title text not null,
  location text,
  completed_year integer,
  summary text,
  created_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0
);

create table public.project_briefs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_type text not null,
  location text not null,
  budget_range text,
  timeline text,
  notes text not null,
  created_at timestamptz not null default now()
);

create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.project_briefs(id) on delete cascade,
  architect_id uuid not null references public.architect_profiles(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status public.consultation_status not null default 'requested',
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (brief_id, architect_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null unique references public.consultation_requests(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) <= 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.architect_profiles enable row level security;
alter table public.verification_documents enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_briefs enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;
create function public.owns_consultation(request_id uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.consultation_requests where id = request_id and (client_id = auth.uid() or architect_id = auth.uid()))
$$;

create policy "profiles readable by signed-in users" on public.profiles for select to authenticated using (true);
create policy "users edit their own profile" on public.profiles for update to authenticated using (id = auth.uid());
create policy "architects create own profile" on public.architect_profiles for insert to authenticated with check (id = auth.uid());
create policy "public sees approved architects" on public.architect_profiles for select using (application_status = 'approved' or id = auth.uid() or public.is_admin());
create policy "architect edits own draft" on public.architect_profiles for update to authenticated using (id = auth.uid() or public.is_admin());
create policy "architect controls documents" on public.verification_documents for all to authenticated using (architect_id = auth.uid() or public.is_admin()) with check (architect_id = auth.uid() or public.is_admin());
create policy "public sees approved work" on public.projects for select using (exists (select 1 from public.architect_profiles a where a.id = architect_id and (a.application_status = 'approved' or a.id = auth.uid() or public.is_admin())));
create policy "architect manages own work" on public.projects for all to authenticated using (architect_id = auth.uid() or public.is_admin()) with check (architect_id = auth.uid() or public.is_admin());
create policy "images follow project visibility" on public.project_images for select using (exists (select 1 from public.projects p where p.id = project_id and exists (select 1 from public.architect_profiles a where a.id = p.architect_id and (a.application_status = 'approved' or a.id = auth.uid() or public.is_admin()))));
create policy "architect manages project images" on public.project_images for all to authenticated using (exists (select 1 from public.projects p where p.id = project_id and (p.architect_id = auth.uid() or public.is_admin()))) with check (exists (select 1 from public.projects p where p.id = project_id and (p.architect_id = auth.uid() or public.is_admin())));
create policy "client manages own briefs" on public.project_briefs for all to authenticated using (client_id = auth.uid() or public.is_admin()) with check (client_id = auth.uid() or public.is_admin());
create policy "consultation participants read" on public.consultation_requests for select to authenticated using (client_id = auth.uid() or architect_id = auth.uid() or public.is_admin());
create policy "clients create requests" on public.consultation_requests for insert to authenticated with check (client_id = auth.uid());
create policy "architect responds to requests" on public.consultation_requests for update to authenticated using (architect_id = auth.uid() or public.is_admin());
create policy "participants access conversations" on public.conversations for select to authenticated using (public.owns_consultation(consultation_id) or public.is_admin());
create policy "participants access messages" on public.messages for select to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and (public.owns_consultation(c.consultation_id) or public.is_admin())));
create policy "participants send messages" on public.messages for insert to authenticated with check (sender_id = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and public.owns_consultation(c.consultation_id)));

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, full_name, role) values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), case when new.raw_user_meta_data ->> 'role' = 'architect' then 'architect'::public.user_role else 'client'::public.user_role end); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true), ('verification', 'verification', false) on conflict (id) do nothing;
create policy "architects upload their portfolio" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "architects update their portfolio" on storage.objects for update to authenticated using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "architects delete their portfolio" on storage.objects for delete to authenticated using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "architects upload verification files" on storage.objects for insert to authenticated with check (bucket_id = 'verification' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "architects view own verification files" on storage.objects for select to authenticated using (bucket_id = 'verification' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "architects update own verification files" on storage.objects for update to authenticated using (bucket_id = 'verification' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "architects delete own verification files" on storage.objects for delete to authenticated using (bucket_id = 'verification' and (storage.foldername(name))[1] = auth.uid()::text);
