-- Ornements pseudo (cumulables avec le style cosmetic_id)
alter table public.global_chat add column if not exists ornament_id text;
alter table public.leaderboard_stats add column if not exists ornament_id text;

-- Met à jour le trigger leaderboard si vous utilisez supabase-achievements.sql :
-- ajoutez ornament_id = nullif(sd->>'equippedOrnament', '') dans l'insert/update.
