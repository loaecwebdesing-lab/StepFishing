-- StepFishing — Profil public (stats + aquariums) par pseudo
-- Supabase → SQL Editor → Run (après supabase-setup.sql)

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
