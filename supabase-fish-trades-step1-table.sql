-- ÉTAPE 1 — Créer la table (lance UNIQUEMENT ce fichier, puis vérifie)
-- Supabase → SQL Editor → Run

create table if not exists public.fish_trades (
    id uuid primary key default gen_random_uuid(),
    from_user_id uuid not null references auth.users (id) on delete cascade,
    to_user_id uuid not null references auth.users (id) on delete cascade,
    from_pseudo text not null,
    to_pseudo text not null,
    status text not null default 'pending'
        check (status in ('pending', 'accepted', 'declined', 'cancelled')),
    offered_fish jsonb not null,
    offered_fish_uid text not null,
    offered_aq_id text not null default 'aq0',
    counter_fish jsonb,
    counter_fish_uid text,
    counter_aq_id text,
    message text check (message is null or char_length(message) <= 120),
    created_at timestamptz not null default now(),
    resolved_at timestamptz,
    constraint fish_trades_no_self check (from_user_id <> to_user_id)
);

create index if not exists fish_trades_to_pending_idx
    on public.fish_trades (to_user_id, status, created_at desc);
create index if not exists fish_trades_from_idx
    on public.fish_trades (from_user_id, created_at desc);

alter table public.fish_trades enable row level security;

drop policy if exists "Lecture échanges participants" on public.fish_trades;
create policy "Lecture échanges participants"
    on public.fish_trades for select
    using (auth.uid() in (from_user_id, to_user_id));

drop policy if exists "Insertion échange expéditeur" on public.fish_trades;
create policy "Insertion échange expéditeur"
    on public.fish_trades for insert
    with check (auth.uid() = from_user_id);
