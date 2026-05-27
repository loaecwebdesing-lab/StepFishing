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
    best_common_streak integer not null default 0,
    cosmetic_id text not null default 'default',
    updated_at timestamptz not null default now()
);

alter table public.leaderboard_stats add column if not exists cosmetic_id text not null default 'default';
alter table public.leaderboard_stats add column if not exists best_fish_img text not null default '';
alter table public.leaderboard_stats add column if not exists best_fish_mutation text not null default '';
alter table public.leaderboard_stats add column if not exists best_fish_class text not null default '';
alter table public.leaderboard_stats add column if not exists best_common_streak integer not null default 0;

create index if not exists leaderboard_money_idx on public.leaderboard_stats (money desc);
create index if not exists leaderboard_level_idx on public.leaderboard_stats (prestige desc, level desc, total_score desc);
create index if not exists leaderboard_fishes_idx on public.leaderboard_stats (fishes_caught desc);
create index if not exists leaderboard_best_fish_idx on public.leaderboard_stats (best_fish_value desc);
create index if not exists leaderboard_common_streak_idx on public.leaderboard_stats (best_common_streak desc);

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
        best_fish_img, best_fish_mutation, best_fish_class,
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
        coalesce(bf->>'img', ''),
        coalesce(bf->>'mutation', 'Normal'),
        coalesce(bf->>'class', ''),
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
        best_fish_img = excluded.best_fish_img,
        best_fish_mutation = excluded.best_fish_mutation,
        best_fish_class = excluded.best_fish_class,
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

-- Realtime chat (ignore si déjà activé — sinon le script s'arrêtait avant les échanges)
do $$
begin
    alter publication supabase_realtime add table public.global_chat;
exception
    when duplicate_object then null;
end $$;

-- --- Échanges de poissons entre joueurs ---
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

-- Recherche pseudo (id uniquement, pas la sauvegarde)
create or replace function public.lookup_player_for_trade(p_pseudo text)
returns table (player_id uuid, pseudo text)
language sql
security definer
stable
set search_path = public
as $$
    select id, pseudo
    from public.player_saves
    where lower(pseudo) = lower(trim(p_pseudo))
    limit 1;
$$;

revoke all on function public.lookup_player_for_trade(text) from public;
grant execute on function public.lookup_player_for_trade(text) to authenticated;

-- Helpers inventaire JSONB (save_data.inventory)
create or replace function public.sf_get_fish_by_uid(p_inventory jsonb, p_uid text)
returns jsonb
language plpgsql
immutable
as $$
declare
    aq_keys text[] := array['aq0','aq1','aq2','aq3','aq4'];
    k text;
    arr jsonb;
    i int;
    elem jsonb;
begin
    if p_uid is null or p_uid = '' then return null; end if;
    foreach k in array aq_keys loop
        arr := coalesce(p_inventory -> k, '[]'::jsonb);
        for i in 0 .. greatest(jsonb_array_length(arr) - 1, -1) loop
            elem := arr -> i;
            if elem ->> 'uid' = p_uid then
                return elem;
            end if;
        end loop;
    end loop;
    return null;
end;
$$;

create or replace function public.sf_fish_tradeable(fish jsonb)
returns boolean
language sql
immutable
as $$
    select fish is not null
        and coalesce(fish ->> 'isKey', 'false') <> 'true'
        and coalesce((fish ->> 'locked')::boolean, false) = false
        and coalesce(fish ->> 'uid', '') <> '';
$$;

create or replace function public.sf_extract_fish_by_uid(p_inventory jsonb, p_uid text)
returns jsonb
language plpgsql
as $$
declare
    aq_keys text[] := array['aq0','aq1','aq2','aq3','aq4'];
    k text;
    arr jsonb;
    i int;
    elem jsonb;
    new_arr jsonb;
    new_inv jsonb := coalesce(p_inventory, '{}'::jsonb);
    out_fish jsonb;
begin
    if p_uid is null or p_uid = '' then
        return jsonb_build_object('inventory', new_inv, 'fish', null, 'aq_id', null);
    end if;
    foreach k in array aq_keys loop
        arr := coalesce(new_inv -> k, '[]'::jsonb);
        new_arr := '[]'::jsonb;
        out_fish := null;
        for i in 0 .. greatest(jsonb_array_length(arr) - 1, -1) loop
            elem := arr -> i;
            if elem ->> 'uid' = p_uid then
                out_fish := elem;
            else
                new_arr := new_arr || jsonb_build_array(elem);
            end if;
        end loop;
        if out_fish is not null then
            new_inv := jsonb_set(new_inv, array[k], new_arr, true);
            return jsonb_build_object('inventory', new_inv, 'fish', out_fish, 'aq_id', k);
        end if;
    end loop;
    return jsonb_build_object('inventory', new_inv, 'fish', null, 'aq_id', null);
end;
$$;

create or replace function public.sf_place_fish_in_inventory(
    p_inventory jsonb,
    p_unlocked jsonb,
    p_fish jsonb
)
returns jsonb
language plpgsql
as $$
declare
    aq_keys text[] := array['aq0','aq1','aq2','aq3','aq4'];
    k text;
    idx int;
    arr jsonb;
    new_inv jsonb := coalesce(p_inventory, '{}'::jsonb);
    unlocked int[];
    u int;
begin
    if p_fish is null then
        return jsonb_build_object('inventory', new_inv, 'placed', false);
    end if;
    select coalesce(array_agg((val)::int), array[0]::int[])
    into unlocked
    from jsonb_array_elements_text(coalesce(p_unlocked, '[0]'::jsonb)) as t(val);

    foreach k in array aq_keys loop
        idx := substring(k from 3)::int;
        if not (idx = any (unlocked)) then continue; end if;
        arr := coalesce(new_inv -> k, '[]'::jsonb);
        if jsonb_array_length(arr) >= 15 then continue; end if;
        arr := arr || jsonb_build_array(p_fish);
        new_inv := jsonb_set(new_inv, array[k], arr, true);
        return jsonb_build_object('inventory', new_inv, 'placed', true);
    end loop;
    return jsonb_build_object('inventory', new_inv, 'placed', false);
end;
$$;

create or replace function public.sf_recompute_best_fish(p_inventory jsonb)
returns jsonb
language plpgsql
as $$
declare
    aq_keys text[] := array['aq0','aq1','aq2','aq3','aq4'];
    k text;
    arr jsonb;
    i int;
    elem jsonb;
    best jsonb := null;
    v numeric;
    best_v numeric := -1;
    rname text;
begin
    foreach k in array aq_keys loop
        arr := coalesce(p_inventory -> k, '[]'::jsonb);
        for i in 0 .. greatest(jsonb_array_length(arr) - 1, -1) loop
            elem := arr -> i;
            if coalesce(elem ->> 'isKey', 'false') = 'true' then continue; end if;
            v := coalesce((elem ->> 'value')::numeric, 0);
            if v > best_v then
                best_v := v;
                rname := coalesce(elem ->> 'name', '');
                best := jsonb_build_object(
                    'name', rname,
                    'value', v,
                    'weight', elem -> 'weight',
                    'class', coalesce(elem ->> 'class', ''),
                    'rarity', rname,
                    'img', coalesce(elem ->> 'img', ''),
                    'mutation', coalesce(elem ->> 'mutation', 'Normal')
                );
            end if;
        end loop;
    end loop;
    return best;
end;
$$;

-- Créer une offre (le poisson reste dans l'aquarium jusqu'à acceptation)
create or replace function public.create_fish_trade(
    p_to_pseudo text,
    p_offered_fish_uid text,
    p_offered_aq_id text default 'aq0',
    p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_from uuid := auth.uid();
    v_to uuid;
    v_to_pseudo text;
    v_from_pseudo text;
    v_save jsonb;
    v_inv jsonb;
    v_fish jsonb;
    v_trade_id uuid;
    v_msg text;
begin
    if v_from is null then
        raise exception 'Connexion requise';
    end if;
    if coalesce(trim(p_to_pseudo), '') = '' then
        raise exception 'Pseudo destinataire invalide';
    end if;
    if coalesce(p_offered_fish_uid, '') = '' then
        raise exception 'Poisson invalide';
    end if;

    select player_id, pseudo into v_to, v_to_pseudo
    from public.lookup_player_for_trade(p_to_pseudo);
    if v_to is null then
        raise exception 'Joueur introuvable';
    end if;
    if v_to = v_from then
        raise exception 'Tu ne peux pas échanger avec toi-même';
    end if;

    select pseudo, save_data into v_from_pseudo, v_save
    from public.player_saves where id = v_from;
    if v_save is null then
        raise exception 'Sauvegarde introuvable';
    end if;

    v_inv := coalesce(v_save -> 'inventory', '{}'::jsonb);
    v_fish := public.sf_get_fish_by_uid(v_inv, p_offered_fish_uid);
    if not public.sf_fish_tradeable(v_fish) then
        raise exception 'Ce poisson ne peut pas être échangé (verrouillé, clé ou sans identifiant)';
    end if;

    if exists (
        select 1 from public.fish_trades
        where status = 'pending'
          and from_user_id = v_from
          and offered_fish_uid = p_offered_fish_uid
    ) then
        raise exception 'Une offre est déjà en attente pour ce poisson';
    end if;

    v_msg := nullif(trim(coalesce(p_message, '')), '');
    if v_msg is not null and char_length(v_msg) > 120 then
        v_msg := left(v_msg, 120);
    end if;

    insert into public.fish_trades (
        from_user_id, to_user_id, from_pseudo, to_pseudo,
        offered_fish, offered_fish_uid, offered_aq_id, message
    ) values (
        v_from, v_to, coalesce(v_from_pseudo, 'Pêcheur'), v_to_pseudo,
        v_fish, p_offered_fish_uid, coalesce(nullif(p_offered_aq_id, ''), 'aq0'), v_msg
    )
    returning id into v_trade_id;

    return v_trade_id;
end;
$$;

revoke all on function public.create_fish_trade(text, text, text, text) from public;
grant execute on function public.create_fish_trade(text, text, text, text) to authenticated;

-- Accepter : échange 1 pour 1 (contre-poisson du destinataire)
create or replace function public.accept_fish_trade(
    p_trade_id uuid,
    p_counter_fish_uid text,
    p_counter_aq_id text default 'aq0'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_trade public.fish_trades%rowtype;
    v_from_save jsonb;
    v_to_save jsonb;
    v_from_inv jsonb;
    v_to_inv jsonb;
    v_extract jsonb;
    v_offered jsonb;
    v_counter jsonb;
    v_unlocked jsonb;
    v_place jsonb;
    v_best jsonb;
begin
    if v_uid is null then raise exception 'Connexion requise'; end if;

    select * into v_trade from public.fish_trades where id = p_trade_id for update;
    if not found then raise exception 'Échange introuvable'; end if;
    if v_trade.status <> 'pending' then raise exception 'Cet échange n''est plus en attente'; end if;
    if v_trade.to_user_id <> v_uid then raise exception 'Seul le destinataire peut accepter'; end if;
    if coalesce(p_counter_fish_uid, '') = '' then raise exception 'Choisis un poisson à échanger'; end if;

    select save_data into v_from_save from public.player_saves where id = v_trade.from_user_id for update;
    select save_data into v_to_save from public.player_saves where id = v_trade.to_user_id for update;
    if v_from_save is null or v_to_save is null then raise exception 'Sauvegarde joueur introuvable'; end if;

    v_from_inv := coalesce(v_from_save -> 'inventory', '{}'::jsonb);
    v_to_inv := coalesce(v_to_save -> 'inventory', '{}'::jsonb);

    v_extract := public.sf_extract_fish_by_uid(v_from_inv, v_trade.offered_fish_uid);
    v_offered := v_extract -> 'fish';
    v_from_inv := v_extract -> 'inventory';
    if v_offered is null then
        raise exception 'Le poisson proposé n''est plus dans l''aquarium de l''expéditeur';
    end if;

    v_extract := public.sf_extract_fish_by_uid(v_to_inv, p_counter_fish_uid);
    v_counter := v_extract -> 'fish';
    v_to_inv := v_extract -> 'inventory';
    if v_counter is null or not public.sf_fish_tradeable(v_counter) then
        raise exception 'Ton poisson d''échange est invalide ou indisponible';
    end if;

    v_unlocked := coalesce(v_to_save -> 'unlockedAquariums', '[0]'::jsonb);
    v_place := public.sf_place_fish_in_inventory(v_to_inv, v_unlocked, v_offered);
    if not (v_place ->> 'placed')::boolean then
        raise exception 'Ton aquarium est plein — libère une place avant d''accepter';
    end if;
    v_to_inv := v_place -> 'inventory';

    v_unlocked := coalesce(v_from_save -> 'unlockedAquariums', '[0]'::jsonb);
    v_place := public.sf_place_fish_in_inventory(v_from_inv, v_unlocked, v_counter);
    if not (v_place ->> 'placed')::boolean then
        raise exception 'L''aquarium de l''expéditeur est plein';
    end if;
    v_from_inv := v_place -> 'inventory';

    v_from_save := jsonb_set(v_from_save, '{inventory}', v_from_inv, true);
    v_to_save := jsonb_set(v_to_save, '{inventory}', v_to_inv, true);

    v_best := public.sf_recompute_best_fish(v_from_inv);
    if v_best is not null then
        v_from_save := jsonb_set(v_from_save, '{bestFish}', v_best, true);
    end if;
    v_best := public.sf_recompute_best_fish(v_to_inv);
    if v_best is not null then
        v_to_save := jsonb_set(v_to_save, '{bestFish}', v_best, true);
    end if;

    update public.player_saves set save_data = v_from_save, updated_at = now() where id = v_trade.from_user_id;
    update public.player_saves set save_data = v_to_save, updated_at = now() where id = v_trade.to_user_id;

    update public.fish_trades set
        status = 'accepted',
        counter_fish = v_counter,
        counter_fish_uid = p_counter_fish_uid,
        counter_aq_id = coalesce(nullif(p_counter_aq_id, ''), 'aq0'),
        resolved_at = now()
    where id = p_trade_id;

    return jsonb_build_object('ok', true, 'trade_id', p_trade_id);
end;
$$;

revoke all on function public.accept_fish_trade(uuid, text, text) from public;
grant execute on function public.accept_fish_trade(uuid, text, text) to authenticated;

create or replace function public.decline_fish_trade(p_trade_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_uid uuid := auth.uid();
begin
    if v_uid is null then raise exception 'Connexion requise'; end if;
    update public.fish_trades
    set status = 'declined', resolved_at = now()
    where id = p_trade_id and to_user_id = v_uid and status = 'pending';
    if not found then raise exception 'Échange introuvable ou déjà traité'; end if;
end;
$$;

revoke all on function public.decline_fish_trade(uuid) from public;
grant execute on function public.decline_fish_trade(uuid) to authenticated;

create or replace function public.cancel_fish_trade(p_trade_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_uid uuid := auth.uid();
begin
    if v_uid is null then raise exception 'Connexion requise'; end if;
    update public.fish_trades
    set status = 'cancelled', resolved_at = now()
    where id = p_trade_id and from_user_id = v_uid and status = 'pending';
    if not found then raise exception 'Échange introuvable ou déjà traité'; end if;
end;
$$;

revoke all on function public.cancel_fish_trade(uuid) from public;
grant execute on function public.cancel_fish_trade(uuid) to authenticated;

-- Realtime échanges (après création de fish_trades — ou utiliser supabase-fish-trades.sql)
do $$
begin
    alter publication supabase_realtime add table public.fish_trades;
exception
    when duplicate_object then null;
end $$;

-- --- Profil public (clic pseudo chat / classement) ---
create or replace function public.get_public_player_profile(p_pseudo text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_ps public.player_saves%rowtype;
    v_lb public.leaderboard_stats%rowtype;
    v_save jsonb;
    v_discovered integer;
begin
    if p_pseudo is null or trim(p_pseudo) = '' then
        return null;
    end if;

    select * into v_ps
    from public.player_saves
    where lower(pseudo) = lower(trim(p_pseudo))
    limit 1;

    if not found then
        return null;
    end if;

    select * into v_lb from public.leaderboard_stats where id = v_ps.id;
    v_save := coalesce(v_ps.save_data, '{}'::jsonb);
    v_discovered := coalesce(jsonb_array_length(v_save->'discoveredFishes'), 0);

    return jsonb_build_object(
        'pseudo', v_ps.pseudo,
        'money', coalesce(v_lb.money, (v_save->>'money')::numeric, 0),
        'max_money', coalesce((v_save->>'maxMoney')::numeric, 0),
        'level', coalesce(v_lb.level, 1),
        'prestige', coalesce(v_lb.prestige, 0),
        'total_score', coalesce(v_lb.total_score, (v_save->>'totalScore')::numeric, 0),
        'fishes_caught', coalesce(v_lb.fishes_caught, (v_save->>'totalFishesCaught')::integer, 0),
        'discovered_count', v_discovered,
        'cosmetic_id', coalesce(v_lb.cosmetic_id, v_save->>'equippedCosmetic', 'default'),
        'best_fish', jsonb_build_object(
            'name', coalesce(v_lb.best_fish_name, v_save->'bestFish'->>'name', ''),
            'value', coalesce(v_lb.best_fish_value, (v_save->'bestFish'->>'value')::numeric, 0),
            'img', coalesce(v_lb.best_fish_img, v_save->'bestFish'->>'img', ''),
            'mutation', coalesce(v_lb.best_fish_mutation, v_save->'bestFish'->>'mutation', 'Normal'),
            'class', coalesce(v_lb.best_fish_class, v_save->'bestFish'->>'class', ''),
            'rarity', coalesce(v_lb.best_fish_rarity, v_save->'bestFish'->>'rarity', '')
        ),
        'inventory', coalesce(v_save->'inventory', '{}'::jsonb),
        'unlocked_aquariums', coalesce(v_save->'unlockedAquariums', '[0]'::jsonb)
    );
end;
$$;

revoke all on function public.get_public_player_profile(text) from public;
grant execute on function public.get_public_player_profile(text) to anon, authenticated;

