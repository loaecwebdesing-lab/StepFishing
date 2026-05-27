-- StepFishing — Succès : préfixes & couleurs visibles en ligne (classement + chat + profil)
-- Exécuter dans l’éditeur SQL Supabase après supabase-setup.sql

alter table public.leaderboard_stats
    add column if not exists achievement_title_id text,
    add column if not exists achievement_color_id text;

alter table public.global_chat
    add column if not exists achievement_title_id text,
    add column if not exists achievement_color_id text;

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
        cosmetic_id, achievement_title_id, achievement_color_id, updated_at
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
        nullif(sd->>'equippedTitleId', ''),
        nullif(sd->>'equippedColorId', ''),
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
        achievement_title_id = excluded.achievement_title_id,
        achievement_color_id = excluded.achievement_color_id,
        updated_at = now();

    return new;
end;
$$;

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
        'achievement_title_id', coalesce(v_lb.achievement_title_id, nullif(v_save->>'equippedTitleId', '')),
        'achievement_color_id', coalesce(v_lb.achievement_color_id, nullif(v_save->>'equippedColorId', '')),
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

update public.player_saves set updated_at = now();
