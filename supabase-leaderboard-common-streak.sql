-- StepFishing — Classement : plus longue série de Communs d'affilée
-- Supabase → SQL Editor → Run (après supabase-setup.sql et supabase-achievements.sql)

alter table public.leaderboard_stats
    add column if not exists best_common_streak integer not null default 0;

create index if not exists leaderboard_common_streak_idx
    on public.leaderboard_stats (best_common_streak desc);

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
        best_common_streak,
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
        coalesce((sd->>'commonStreakBest')::integer, 0),
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
        best_common_streak = excluded.best_common_streak,
        cosmetic_id = excluded.cosmetic_id,
        achievement_title_id = excluded.achievement_title_id,
        achievement_color_id = excluded.achievement_color_id,
        updated_at = now();

    return new;
end;
$$;

-- Resynchroniser le classement
update public.player_saves set updated_at = now();
