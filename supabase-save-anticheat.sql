-- StepFishing — Validation serveur des sauvegardes (anti-triche cloud)
-- Supabase → SQL Editor → Run (après supabase-setup.sql)

create or replace function public.sanitize_save_data(sd jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
    out jsonb;
    money numeric;
    total_score numeric;
    keys integer;
    fishes integer;
    streak integer;
begin
    sd := coalesce(sd, '{}'::jsonb);
    total_score := greatest(0, least(coalesce((sd->>'totalScore')::numeric, 0), 999999999));
    money := greatest(0, least(coalesce((sd->>'money')::numeric, 0), 50000000));
    keys := greatest(0, least(coalesce((sd->>'keys')::integer, 0), 9999));
    fishes := greatest(0, least(coalesce((sd->>'totalFishesCaught')::integer, 0), 999999));
    streak := greatest(0, least(coalesce((sd->>'commonStreakBest')::integer, 0), 99999));

    out := sd
        || jsonb_build_object(
            'totalScore', total_score,
            'money', money,
            'maxMoney', greatest(coalesce((sd->>'maxMoney')::numeric, 0), money),
            'keys', keys,
            'totalFishesCaught', fishes,
            'commonStreakBest', streak,
            'commonStreakCurrent', greatest(0, least(coalesce((sd->>'commonStreakCurrent')::integer, 0), streak))
        );

    if out->>'currentZone' is not null
        and out->>'currentZone' not in ('lac', 'ocean', 'abyss', 'bonta') then
        out := out || jsonb_build_object('currentZone', 'lac');
    end if;

    return out;
end;
$$;

create or replace function public.clamp_player_save_on_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    new.save_data := public.sanitize_save_data(new.save_data);
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists clamp_player_save_before_write on public.player_saves;
create trigger clamp_player_save_before_write
    before insert or update on public.player_saves
    for each row execute function public.clamp_player_save_on_write();

-- Re-sanitizer les sauvegardes existantes
update public.player_saves
set save_data = public.sanitize_save_data(save_data), updated_at = now();
