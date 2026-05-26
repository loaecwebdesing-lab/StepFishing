-- ============================================================
-- StepFishing — ÉCHANGES : ÉTAPE 2 (fonctions + Realtime)
--
-- 1) D'abord exécute supabase-fish-trades-step1-table.sql
-- 2) Vérifie : select 1 from public.fish_trades limit 1;
-- 3) Puis exécute TOUT ce fichier (étape 2)
--
-- Prérequis : player_saves (comptes) déjà installés
-- ============================================================

-- (Table créée à l'étape 1 — supabase-fish-trades-step1-table.sql)

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
                    'rarity', rname
                );
            end if;
        end loop;
    end loop;
    return best;
end;
$$;

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

-- Realtime (uniquement APRÈS création de la table ci-dessus)
do $$
begin
    alter publication supabase_realtime add table public.fish_trades;
exception
    when duplicate_object then null;
end $$;
