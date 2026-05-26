-- ============================================================
-- StepFishing — Installation complète Supabase
-- Supabase → SQL Editor → coller tout → Run
-- Réexécutable : ne plante pas si déjà installé
-- ============================================================

-- --- Sauvegardes joueurs ---
create table if not exists public.player_saves (
    id uuid primary key references auth.users (id) on delete cascade,
    pseudo text not null,
    save_data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

create unique index if not exists player_saves_pseudo_key on public.player_saves (lower(pseudo));

alter table public.player_saves enable row level security;

drop policy if exists "Lecture propre sauvegarde" on public.player_saves;
create policy "Lecture propre sauvegarde"
    on public.player_saves for select
    using (auth.uid() = id);

drop policy if exists "Insertion propre sauvegarde" on public.player_saves;
create policy "Insertion propre sauvegarde"
    on public.player_saves for insert
    with check (auth.uid() = id);

drop policy if exists "Mise à jour propre sauvegarde" on public.player_saves;
create policy "Mise à jour propre sauvegarde"
    on public.player_saves for update
    using (auth.uid() = id);

-- Profil auto à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.player_saves (id, pseudo, save_data)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'pseudo', split_part(new.email, '@', 1)),
        '{}'::jsonb
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- --- Classement (leaderboard) ---
create table if not exists public.leaderboard_stats (
    id uuid primary key references auth.users (id) on delete cascade,
    pseudo text not null,
    money numeric not null default 0,
    total_score numeric not null default 0,
    level integer not null default 1,
    prestige integer not null default 0,
    fishes_caught integer not null default 0,
    best_fish_value numeric not null default 0,
    best_fish_name text not null default '',
    best_fish_rarity text not null default '',
    cosmetic_id text not null default 'default',
    updated_at timestamptz not null default now()
);

alter table public.leaderboard_stats add column if not exists cosmetic_id text not null default 'default';

create index if not exists leaderboard_money_idx on public.leaderboard_stats (money desc);
create index if not exists leaderboard_level_idx on public.leaderboard_stats (prestige desc, level desc, total_score desc);
create index if not exists leaderboard_fishes_idx on public.leaderboard_stats (fishes_caught desc);
create index if not exists leaderboard_best_fish_idx on public.leaderboard_stats (best_fish_value desc);

alter table public.leaderboard_stats enable row level security;

drop policy if exists "Lecture classement publique" on public.leaderboard_stats;
create policy "Lecture classement publique"
    on public.leaderboard_stats for select
    using (true);

drop policy if exists "Insertion stats classement" on public.leaderboard_stats;
create policy "Insertion stats classement"
    on public.leaderboard_stats for insert
    with check (auth.uid() = id);

drop policy if exists "Mise à jour stats classement" on public.leaderboard_stats;
create policy "Mise à jour stats classement"
    on public.leaderboard_stats for update
    using (auth.uid() = id);

-- Sync classement à chaque sauvegarde
create or replace function public.sync_leaderboard_from_save()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    sd jsonb;
    ts numeric;
    lvl integer;
    pr integer;
    bf jsonb;
begin
    sd := coalesce(new.save_data, '{}'::jsonb);
    ts := coalesce((sd->>'totalScore')::numeric, 0);
    lvl := floor(power(ts / 10.0, 0.7))::integer + 1;
    pr := floor(lvl / 100)::integer;
    bf := sd->'bestFish';

    insert into public.leaderboard_stats (
        id, pseudo, money, total_score, level, prestige,
        fishes_caught, best_fish_value, best_fish_name, best_fish_rarity,
        cosmetic_id, updated_at
    ) values (
        new.id,
        new.pseudo,
        coalesce((sd->>'money')::numeric, 0),
        ts,
        lvl,
        pr,
        coalesce((sd->>'totalFishesCaught')::integer, 0),
        coalesce((bf->>'value')::numeric, 0),
        coalesce(bf->>'name', ''),
        coalesce(bf->>'rarity', ''),
        coalesce(sd->>'equippedCosmetic', 'default'),
        now()
    )
    on conflict (id) do update set
        pseudo = excluded.pseudo,
        money = excluded.money,
        total_score = excluded.total_score,
        level = excluded.level,
        prestige = excluded.prestige,
        fishes_caught = excluded.fishes_caught,
        best_fish_value = excluded.best_fish_value,
        best_fish_name = excluded.best_fish_name,
        best_fish_rarity = excluded.best_fish_rarity,
        cosmetic_id = excluded.cosmetic_id,
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists sync_leaderboard_on_save on public.player_saves;
create trigger sync_leaderboard_on_save
    after insert or update on public.player_saves
    for each row execute function public.sync_leaderboard_from_save();

-- Remplir / mettre à jour le classement pour tous les comptes existants
update public.player_saves set updated_at = now();

-- --- Chat global ---
create table if not exists public.global_chat (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users (id) on delete cascade,
    pseudo text not null,
    cosmetic_id text not null default 'default',
    message text not null check (char_length(message) between 1 and 200),
    created_at timestamptz not null default now()
);

create index if not exists global_chat_created_idx on public.global_chat (created_at desc);

alter table public.global_chat enable row level security;

drop policy if exists "Lecture chat publique" on public.global_chat;
create policy "Lecture chat publique"
    on public.global_chat for select
    using (true);

drop policy if exists "Envoi chat authentifié" on public.global_chat;
create policy "Envoi chat authentifié"
    on public.global_chat for insert
    with check (auth.uid() = user_id);

-- Activer le chat en temps réel (Realtime) — à exécuter dans SQL Editor :
alter publication supabase_realtime add table public.global_chat;

