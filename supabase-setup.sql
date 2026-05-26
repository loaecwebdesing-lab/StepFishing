-- Exécuter dans Supabase → SQL Editor (une seule fois)

create table if not exists public.player_saves (
    id uuid primary key references auth.users (id) on delete cascade,
    pseudo text not null,
    save_data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

create unique index if not exists player_saves_pseudo_key on public.player_saves (lower(pseudo));

alter table public.player_saves enable row level security;

create policy "Lecture propre sauvegarde"
    on public.player_saves for select
    using (auth.uid() = id);

create policy "Insertion propre sauvegarde"
    on public.player_saves for insert
    with check (auth.uid() = id);

create policy "Mise à jour propre sauvegarde"
    on public.player_saves for update
    using (auth.uid() = id);
