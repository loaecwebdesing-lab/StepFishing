/**
 * StepFishing — Succès & récompenses (préfixes + couleurs pseudo)
 */
(function () {
    const TITLE_REWARDS = {
        title_novice: { label: 'Novice', text: '[Novice]', class: 'ach-title-novice' },
        title_angler: { label: 'Pêcheur', text: '[Pêcheur]', class: 'ach-title-angler' },
        title_master: { label: 'Maître', text: '[Maître]', class: 'ach-title-master' },
        title_legend: { label: 'Légende', text: '[Légende]', class: 'ach-title-legend ach-title-blink' },
        title_myth: { label: 'Mythique', text: '[Mythique]', class: 'ach-title-myth ach-title-pulse' },
        title_divine: { label: 'Divin', text: '[Divin]', class: 'ach-title-divine' },
        title_rich: { label: 'Riche', text: '[Riche]', class: 'ach-title-rich' },
        title_prestige: { label: 'Prestige', text: '[Prestige]', class: 'ach-title-prestige' },
        title_elite: { label: 'Élite', text: '[Élite]', class: 'ach-title-elite ach-title-blink' },
        title_explorer: { label: 'Explorateur', text: '[Explorateur]', class: 'ach-title-explorer' },
        title_abyss: { label: 'Abyssal', text: '[Abyssal]', class: 'ach-title-abyss' },
        title_collector: { label: 'Collectionneur', text: '[Collectionneur]', class: 'ach-title-collector' },
        title_hunter: { label: 'Chasseur', text: '[Chasseur]', class: 'ach-title-hunter' },
        title_trader: { label: 'Marchand', text: '[Marchand]', class: 'ach-title-trader' },
        title_precise: { label: 'Précis', text: '[Précis]', class: 'ach-title-precise' },
        title_champion: { label: 'Champion', text: '[Champion]', class: 'ach-title-champion ach-title-blink' },
        title_trophy: { label: 'Trophée', text: '[Trophée]', class: 'ach-title-trophy' },
        title_deep: { label: 'Abyssal', text: '[Profondeur]', class: 'ach-title-deep' },
        title_storm: { label: 'Tempête', text: '[Tempête]', class: 'ach-title-storm ach-title-pulse' },
        title_naturalist: { label: 'Naturaliste', text: '[Naturaliste]', class: 'ach-title-naturalist' },
        title_tycoon: { label: 'Magnat', text: '[Magnat]', class: 'ach-title-tycoon ach-title-blink' },
        title_sage: { label: 'Sage', text: '[Sage]', class: 'ach-title-sage' },
        title_curator: { label: 'Conservateur', text: '[Conservateur]', class: 'ach-title-curator' },
        title_merchant: { label: 'Marchand', text: '[Marchand Pro]', class: 'ach-title-merchant' },
        title_reflex: { label: 'Réflexe', text: '[Réflexe]', class: 'ach-title-reflex ach-title-blink' },
        title_broker: { label: 'Courtier', text: '[Courtier]', class: 'ach-title-broker' },
        title_whale: { label: 'Baleine', text: '[Baleine]', class: 'ach-title-whale ach-title-blink' },
        title_eccumeur: { label: 'Écumeur', text: '[Écumeur]', class: 'ach-title-eccumeur ach-title-blink', pseudoDofus: true }
    };

    const COLOR_REWARDS = {
        color_blue: { label: 'Bleu pêcheur', class: 'ach-color-blue' },
        color_purple: { label: 'Violet', class: 'ach-color-purple' },
        color_green: { label: 'Vert', class: 'ach-color-green' },
        color_gold: { label: 'Or', class: 'ach-color-gold' },
        color_indigo: { label: 'Indigo', class: 'ach-color-indigo' },
        color_cyan: { label: 'Cyan', class: 'ach-color-cyan' },
        color_silver: { label: 'Argent', class: 'ach-color-silver' },
        color_coral: { label: 'Corail', class: 'ach-color-coral' }
    };

    const CATEGORIES = [
        { id: 'peche', label: 'Pêche', icon: '🎣', order: 1 },
        { id: 'coll', label: 'Collection & Index', icon: '📖', order: 2 },
        { id: 'dofus', label: '6 Dofus', icon: '💎', order: 3 },
        { id: 'eco', label: 'Économie', icon: '💰', order: 4 },
        { id: 'prog', label: 'Progression', icon: '⭐', order: 5 },
        { id: 'social', label: 'Social', icon: '💬', order: 6 }
    ];

    let activeAchFilter = 'all';

    const ACHIEVEMENTS = [
        { id: 'first_catch', name: 'Première prise', desc: 'Capturer ton premier poisson.', cat: 'peche', icon: '🎣', cond: { type: 'catches', n: 1 }, rewards: [{ type: 'title', id: 'title_novice' }] },
        { id: 'catches_50', name: 'Pêcheur actif', desc: 'Capturer 50 poissons.', cat: 'peche', icon: '🐟', cond: { type: 'catches', n: 50 }, rewards: [{ type: 'color', id: 'color_blue' }] },
        { id: 'catches_250', name: 'Habitué du lac', desc: 'Capturer 250 poissons.', cat: 'peche', icon: '🌊', cond: { type: 'catches', n: 250 }, rewards: [{ type: 'title', id: 'title_angler' }] },
        { id: 'catches_1000', name: 'Légende vivante', desc: 'Capturer 1 000 poissons.', cat: 'peche', icon: '👑', cond: { type: 'catches', n: 1000 }, rewards: [{ type: 'title', id: 'title_master' }] },
        { id: 'first_epic', name: 'Épique !', desc: 'Capturer un poisson Épique.', cat: 'peche', icon: '💜', cond: { type: 'rarity', r: 3, n: 1 }, rewards: [{ type: 'color', id: 'color_purple' }] },
        { id: 'epics_30', name: 'Chasseur d\'épiques', desc: 'Capturer 30 Épiques.', cat: 'peche', icon: '✨', cond: { type: 'rarity', r: 3, n: 30 }, rewards: [{ type: 'money', n: 5000 }] },
        { id: 'first_legend', name: 'Légendaire', desc: 'Capturer un Légendaire.', cat: 'peche', icon: '🟠', cond: { type: 'rarity', r: 4, n: 1 }, rewards: [{ type: 'title', id: 'title_legend' }] },
        { id: 'legends_15', name: 'Roi des légendes', desc: 'Capturer 15 Légendaires.', cat: 'peche', icon: '🔥', cond: { type: 'rarity', r: 4, n: 15 }, rewards: [{ type: 'keys', n: 2 }] },
        { id: 'first_mythic', name: 'Mythe réel', desc: 'Capturer un Mythique.', cat: 'peche', icon: '🔴', cond: { type: 'rarity', r: 5, n: 1 }, rewards: [{ type: 'title', id: 'title_myth' }] },
        { id: 'first_divine', name: 'Touché par les dieux', desc: 'Capturer un Divin.', cat: 'peche', icon: '🟣', cond: { type: 'rarity', r: 6, n: 1 }, rewards: [{ type: 'title', id: 'title_divine' }] },
        { id: 'money_50k', name: 'Économe prospère', desc: 'Posséder 50 000 $ au total.', cat: 'eco', icon: '💵', cond: { type: 'max_money', n: 50000 }, rewards: [{ type: 'color', id: 'color_green' }] },
        { id: 'money_500k', name: 'Fortuné', desc: 'Posséder 500 000 $ au total.', cat: 'eco', icon: '💰', cond: { type: 'max_money', n: 500000 }, rewards: [{ type: 'title', id: 'title_rich' }] },
        { id: 'money_2m', name: 'Millionnaire', desc: 'Posséder 2 000 000 $ au total.', cat: 'eco', icon: '🏦', cond: { type: 'max_money', n: 2000000 }, rewards: [{ type: 'color', id: 'color_gold' }] },
        { id: 'level_30', name: 'En progression', desc: 'Atteindre le niveau 30.', cat: 'prog', icon: '⭐', cond: { type: 'level', n: 30 }, rewards: [{ type: 'money', n: 2500 }] },
        { id: 'level_75', name: 'Vétéran', desc: 'Atteindre le niveau 75.', cat: 'prog', icon: '🌟', cond: { type: 'level', n: 75 }, rewards: [{ type: 'color', id: 'color_indigo' }] },
        { id: 'prestige_1', name: 'Renouveau', desc: 'Atteindre le prestige 1.', cat: 'prog', icon: '🏆', cond: { type: 'prestige', n: 1 }, rewards: [{ type: 'title', id: 'title_prestige' }] },
        { id: 'prestige_4', name: 'Sommet', desc: 'Atteindre le prestige 4.', cat: 'prog', icon: '💎', cond: { type: 'prestige', n: 4 }, rewards: [{ type: 'title', id: 'title_elite' }] },
        { id: 'index_lac', name: 'Index du lac', desc: 'Découvrir toutes les espèces du lac (hors myt./div.).', cat: 'coll', icon: '📖', cond: { type: 'zone_lac' }, rewards: [{ type: 'title', id: 'title_explorer' }] },
        { id: 'index_ocean', name: 'Haute mer complète', desc: 'Découvrir toutes les espèces océan requises.', cat: 'coll', icon: '🌊', cond: { type: 'zone_ocean' }, rewards: [{ type: 'color', id: 'color_cyan' }] },
        { id: 'index_abyss', name: 'Maître de l\'abysse', desc: 'Découvrir toutes les espèces abysse requises.', cat: 'coll', icon: '🌑', cond: { type: 'zone_abyss' }, rewards: [{ type: 'title', id: 'title_abyss' }] },
        { id: 'index_bonta', name: 'Écumeur de Bonta', desc: 'Compléter à 100 % le FishIndex de Bonta.', cat: 'coll', icon: '🏰', cond: { type: 'zone_bonta' }, rewards: [{ type: 'title', id: 'title_eccumeur' }] },
        { id: 'index_complete', name: 'FishIndex 100 %', desc: 'Découvrir chaque espèce du jeu.', cat: 'coll', icon: '📚', cond: { type: 'all_fish' }, rewards: [{ type: 'title', id: 'title_collector' }, { type: 'color', id: 'color_gold' }] },
        { id: 'rod_promax', name: 'Équipement pro', desc: 'Posséder la Canne ProMax.', cat: 'prog', icon: '🛠️', cond: { type: 'rod', id: 5 }, rewards: [{ type: 'money', n: 10000 }] },
        { id: 'rod_excalibur', name: 'Excalibur', desc: 'Posséder l\'Excalibur des Mers.', cat: 'prog', icon: '⚔️', cond: { type: 'rod', id: 14 }, rewards: [{ type: 'title', id: 'title_champion' }] },
        { id: 'crate_first', name: 'Premier coffre', desc: 'Ouvrir une caisse mystère.', cat: 'peche', icon: '📦', cond: { type: 'crates', n: 1 }, rewards: [{ type: 'keys', n: 1 }] },
        { id: 'crates_20', name: 'Pilleur de coffres', desc: 'Ouvrir 20 caisses.', cat: 'peche', icon: '🗝️', cond: { type: 'crates', n: 20 }, rewards: [{ type: 'title', id: 'title_hunter' }] },
        { id: 'keys_15', name: 'Collectionneur de clés', desc: 'Trouver 15 clés en pêchant.', cat: 'peche', icon: '🔑', cond: { type: 'keys_found', n: 15 }, rewards: [{ type: 'keys', n: 3 }] },
        { id: 'chat_25', name: 'Bavard', desc: 'Envoyer 25 messages dans le chat.', cat: 'social', icon: '💬', cond: { type: 'chat', n: 25 }, rewards: [{ type: 'color', id: 'color_cyan' }] },
        { id: 'trade_3', name: 'Négociant', desc: 'Réussir 3 échanges de poissons.', cat: 'social', icon: '🔄', cond: { type: 'trades', n: 3 }, rewards: [{ type: 'title', id: 'title_trader' }] },
        { id: 'combo_8', name: 'Précision osu', desc: 'Atteindre un combo de 8.', cat: 'peche', icon: '🎯', cond: { type: 'combo', n: 8 }, rewards: [{ type: 'title', id: 'title_precise' }] },
        { id: 'best_fish_1000', name: 'Prise de rêve', desc: 'Capturer un poisson valant 1 000 $+.', cat: 'peche', icon: '💎', cond: { type: 'best_fish', n: 1000 }, rewards: [{ type: 'title', id: 'title_trophy' }] },
        { id: 'catches_5000', name: 'Océan infini', desc: 'Capturer 5 000 poissons.', cat: 'peche', icon: '🌐', cond: { type: 'catches', n: 5000 }, rewards: [{ type: 'title', id: 'title_deep' }] },
        { id: 'myths_5', name: 'Chasseur de tempêtes', desc: 'Capturer 5 Mythiques.', cat: 'peche', icon: '⛈️', cond: { type: 'rarity', r: 5, n: 5 }, rewards: [{ type: 'title', id: 'title_storm' }] },
        { id: 'combo_15', name: 'Réflexes d\'acier', desc: 'Atteindre un combo de 15.', cat: 'peche', icon: '⚡', cond: { type: 'combo', n: 15 }, rewards: [{ type: 'title', id: 'title_reflex' }] },
        { id: 'best_fish_10k', name: 'Monstre des mers', desc: 'Capturer un poisson valant 10 000 $+.', cat: 'peche', icon: '🐋', cond: { type: 'best_fish', n: 10000 }, rewards: [{ type: 'title', id: 'title_whale' }] },
        { id: 'discovered_50', name: 'Naturaliste', desc: 'Découvrir 50 espèces différentes.', cat: 'coll', icon: '🔬', cond: { type: 'discovered', n: 50 }, rewards: [{ type: 'title', id: 'title_naturalist' }] },
        { id: 'money_10m', name: 'Magnat', desc: 'Posséder 10 000 000 $ au total.', cat: 'eco', icon: '🏛️', cond: { type: 'max_money', n: 10000000 }, rewards: [{ type: 'title', id: 'title_tycoon' }] },
        { id: 'fish_sold_500', name: 'Grossiste', desc: 'Vendre 500 poissons au total.', cat: 'eco', icon: '🏪', cond: { type: 'fish_sold', n: 500 }, rewards: [{ type: 'title', id: 'title_merchant' }] },
        { id: 'aquariums_5', name: 'Conservateur', desc: 'Débloquer les 5 aquariums.', cat: 'eco', icon: '🐠', cond: { type: 'aquariums', n: 5 }, rewards: [{ type: 'title', id: 'title_curator' }] },
        { id: 'level_100', name: 'Sage des mers', desc: 'Atteindre le niveau 100.', cat: 'prog', icon: '🧙', cond: { type: 'level', n: 100 }, rewards: [{ type: 'title', id: 'title_sage' }] },
        { id: 'trades_10', name: 'Courtier expert', desc: 'Réussir 10 échanges.', cat: 'social', icon: '🤝', cond: { type: 'trades', n: 10 }, rewards: [{ type: 'title', id: 'title_broker' }] },
        { id: 'dofus_emeraude', name: 'Dofus Émeraude', desc: 'Pêcher le Dofus Émeraude (1/100) — toutes les zones.', cat: 'dofus', icon: '💚', cond: { type: 'dofus', id: 'emeraude' }, rewards: [] },
        { id: 'dofus_ebene', name: 'Dofus Ébène', desc: 'Pêcher le Dofus Ébène (1/100) — toutes les zones.', cat: 'dofus', icon: '🖤', cond: { type: 'dofus', id: 'ebene' }, rewards: [] },
        { id: 'dofus_ocre', name: 'Dofus Ocre', desc: 'Pêcher le Dofus Ocre (1/100) — toutes les zones.', cat: 'dofus', icon: '🧡', cond: { type: 'dofus', id: 'ocre' }, rewards: [] },
        { id: 'dofus_turquoise', name: 'Dofus Turquoise', desc: 'Trouver le Dofus Turquoise dans une bourse ou un coffre (1/10).', cat: 'dofus', icon: '🩵', cond: { type: 'dofus', id: 'turquoise' }, rewards: [] },
        { id: 'dofus_pourpre', name: 'Dofus Pourpre', desc: 'Trouver le Dofus Pourpre dans une bourse ou un coffre (1/10).', cat: 'dofus', icon: '💜', cond: { type: 'dofus', id: 'pourpre' }, rewards: [] },
        { id: 'dofus_ivoire', name: 'Dofus Ivoire', desc: 'Trouver le Dofus Ivoire dans une bourse ou un coffre (1/10).', cat: 'dofus', icon: '🤍', cond: { type: 'dofus', id: 'ivoire' }, rewards: [] },
        { id: 'dofus_bonta', name: 'Porte de Bonta', desc: 'Réunir les 6 Dofus + niveau 150 pour accéder à Bonta.', cat: 'dofus', icon: '🏰', cond: { type: 'all_dofus' }, rewards: [] }
    ];

    const achById = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

    let stateBridge = null;

    function registerStateBridge(bridge) {
        stateBridge = bridge;
    }

    function getState() {
        return stateBridge?.getState?.() || null;
    }

    function persistGameState() {
        if (stateBridge?.persist) stateBridge.persist();
        else if (typeof persistGame === 'function') persistGame();
    }

    function defaultStats() {
        return {
            rarityCounts: { 3: 0, 4: 0, 5: 0, 6: 0 },
            cratesOpened: 0,
            keysFound: 0,
            chatSent: 0,
            tradesDone: 0,
            totalSold: 0,
            fishSold: 0,
            maxCombo: 0
        };
    }

    function syncOwnedRewardsFromUnlocks(s) {
        if (!s || !Array.isArray(s.unlockedAchievements)) return;
        ACHIEVEMENTS.forEach(ach => {
            if (!s.unlockedAchievements.includes(ach.id)) return;
            (ach.rewards || []).forEach(r => {
                if (r.type === 'title' && TITLE_REWARDS[r.id] && !s.ownedTitleIds.includes(r.id)) {
                    s.ownedTitleIds.push(r.id);
                } else if (r.type === 'color' && COLOR_REWARDS[r.id] && !s.ownedColorIds.includes(r.id)) {
                    s.ownedColorIds.push(r.id);
                }
            });
        });
    }

    function ensureAchievementState(s) {
        if (!s) return;
        if (!Array.isArray(s.unlockedAchievements)) s.unlockedAchievements = [];
        if (!Array.isArray(s.ownedTitleIds)) s.ownedTitleIds = [];
        if (!Array.isArray(s.ownedColorIds)) s.ownedColorIds = [];
        if (!s.equippedTitleId) s.equippedTitleId = null;
        if (!s.equippedColorId) s.equippedColorId = null;
        if (!s.achievementStats || typeof s.achievementStats !== 'object') {
            s.achievementStats = defaultStats();
        }
        const st = s.achievementStats;
        if (!st.rarityCounts) st.rarityCounts = { 3: 0, 4: 0, 5: 0, 6: 0 };
        ['cratesOpened', 'keysFound', 'chatSent', 'tradesDone', 'totalSold', 'fishSold', 'maxCombo'].forEach(k => {
            if (typeof st[k] !== 'number') st[k] = 0;
        });
        syncOwnedRewardsFromUnlocks(s);
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getProgress(ach, s) {
        const st = s.achievementStats || defaultStats();
        const c = ach.cond;
        switch (c.type) {
            case 'catches': return { cur: s.totalFishesCaught || 0, max: c.n };
            case 'rarity': return { cur: st.rarityCounts[c.r] || 0, max: c.n };
            case 'max_money': return { cur: Math.max(s.money || 0, s.maxMoney || 0), max: c.n };
            case 'level': return { cur: s.level || 1, max: c.n };
            case 'prestige': return { cur: s.prestige || 0, max: c.n };
            case 'zone_lac': {
                const meta = window.StepFishGameMeta;
                const ok = meta?.hasDiscoveredAllLacFish?.() ? 1 : 0;
                const tot = meta?.getLacFishCount?.() || 1;
                const cur = meta?.getDiscoveredLacCount?.() || 0;
                return { cur: ok ? tot : cur, max: tot };
            }
            case 'zone_ocean': {
                const meta = window.StepFishGameMeta;
                const tot = meta?.getOceanFishCountForAbyss?.() || 1;
                const cur = meta?.getDiscoveredOceanCountForAbyss?.() || 0;
                const ok = meta?.hasDiscoveredAllOceanFish?.();
                return { cur: ok ? tot : cur, max: tot };
            }
            case 'zone_abyss': {
                const meta = window.StepFishGameMeta;
                const tot = meta?.getAbyssFishCount?.() || 1;
                const cur = meta?.getDiscoveredAbyssCount?.() || 0;
                const ok = meta?.hasDiscoveredAllAbyssFish?.();
                return { cur: ok ? tot : cur, max: tot };
            }
            case 'zone_bonta': {
                const meta = window.StepFishGameMeta;
                const tot = meta?.getBontaFishCount?.() || 1;
                const cur = meta?.getDiscoveredBontaCount?.() || 0;
                const ok = meta?.hasDiscoveredAllBontaFish?.();
                return { cur: ok ? tot : cur, max: tot };
            }
            case 'all_fish': {
                const meta = window.StepFishGameMeta;
                const tot = meta?.getAllFishSpeciesCount?.() || 1;
                const cur = meta?.hasDiscoveredAllFishInGame?.() ? tot : (meta?.getDiscoveredSpeciesCount?.() || 0);
                return { cur, max: tot };
            }
            case 'rod': return { cur: (s.ownedRods || []).includes(c.id) ? 1 : 0, max: 1 };
            case 'crates': return { cur: st.cratesOpened, max: c.n };
            case 'keys_found': return { cur: st.keysFound, max: c.n };
            case 'chat': return { cur: st.chatSent, max: c.n };
            case 'trades': return { cur: st.tradesDone, max: c.n };
            case 'combo': return { cur: st.maxCombo, max: c.n };
            case 'best_fish': return { cur: s.bestFish?.value || 0, max: c.n };
            case 'aquariums': return { cur: (s.unlockedAquariums || [0]).length, max: c.n };
            case 'fish_sold': return { cur: st.fishSold, max: c.n };
            case 'total_sold': return { cur: st.totalSold, max: c.n };
            case 'discovered': {
                const cur = window.StepFishGameMeta?.getDiscoveredSpeciesCount?.() || 0;
                return { cur, max: c.n };
            }
            case 'owned_rods': return { cur: (s.ownedRods || []).length, max: c.n };
            case 'dofus': {
                const owned = Array.isArray(s.collectedDofus) && s.collectedDofus.includes(c.id);
                return { cur: owned ? 1 : 0, max: 1 };
            }
            case 'all_dofus': {
                const total = window.STEPFISH_DOFUS?.count || 6;
                const cur = Array.isArray(s.collectedDofus) ? s.collectedDofus.length : 0;
                return { cur: Math.min(cur, total), max: total };
            }
            default: return { cur: 0, max: 1 };
        }
    }

    function isComplete(ach, s) {
        const p = getProgress(ach, s);
        return p.cur >= p.max;
    }

    function grantReward(reward, s) {
        if (!reward || !s) return;
        if (reward.type === 'title' && TITLE_REWARDS[reward.id]) {
            if (!s.ownedTitleIds.includes(reward.id)) s.ownedTitleIds.push(reward.id);
        } else if (reward.type === 'color' && COLOR_REWARDS[reward.id]) {
            if (!s.ownedColorIds.includes(reward.id)) s.ownedColorIds.push(reward.id);
        } else if (reward.type === 'money' && reward.n) {
            s.money = (parseFloat(s.money) || 0) + reward.n;
            if (s.money > (s.maxMoney || 0)) s.maxMoney = s.money;
            if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
        } else if (reward.type === 'keys' && reward.n) {
            s.keys = (parseInt(s.keys, 10) || 0) + reward.n;
            if (typeof updateKeysDisplay === 'function') updateKeysDisplay();
        }
    }

    function unlockAchievement(achId) {
        const s = getState();
        const ach = achById[achId];
        if (!s || !ach || s.unlockedAchievements.includes(achId)) return false;
        s.unlockedAchievements.push(achId);
        (ach.rewards || []).forEach(r => grantReward(r, s));
        if (typeof addLog === 'function') {
            addLog(`🏅 Succès débloqué : ${ach.name}`, 'epic');
        }
        persistGameState();
        refreshPseudoDisplays();
        const toast = document.getElementById('discovery-toast');
        const toastText = document.getElementById('toast-text');
        if (toast && toastText) {
            toastText.textContent = `🏅 Succès : ${ach.name}`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3200);
        }
        return true;
    }

    function checkAll() {
        const s = getState();
        if (!s) return;
        ensureAchievementState(s);
        let any = false;
        ACHIEVEMENTS.forEach(ach => {
            if (!s.unlockedAchievements.includes(ach.id) && isComplete(ach, s)) {
                unlockAchievement(ach.id);
                any = true;
            }
        });
        if (any) renderScreen();
    }

    function getEccumeurDofusImg() {
        return window.STEPFISH_DOFUS?.byId?.emeraude?.img || 'assets/dofus/Emeraude.png';
    }

    function renderTitleHTML(titleId) {
        const t = TITLE_REWARDS[titleId];
        if (!t) return '';
        return `<span class="ach-player-title ${t.class}">${escapeHtml(t.text)}</span>`;
    }

    function wrapPseudoWithEccumeurDofus(innerHtml) {
        const img = getEccumeurDofusImg();
        return `<span class="ach-pseudo-with-dofus">${innerHtml}<img src="${escapeHtml(img)}" class="ach-pseudo-dofus-badge" width="18" height="18" alt="" title="Écumeur de Bonta"></span>`;
    }

    function renderPseudoInnerHTML(pseudo, cosmeticId, colorId) {
        if (colorId && COLOR_REWARDS[colorId]) {
            const c = COLOR_REWARDS[colorId];
            return `<span class="ach-pseudo-color ${c.class}"><span class="ach-pseudo-text">${escapeHtml(pseudo)}</span></span>`;
        }
        if (window.StepFishCosmetics?.renderPseudoHTML) {
            return window.StepFishCosmetics.renderPseudoHTML(pseudo, cosmeticId || 'default');
        }
        return `<span class="ach-pseudo-plain">${escapeHtml(pseudo)}</span>`;
    }

    function renderPlayerPseudoHTML(pseudo, cosmeticId, titleId, colorId) {
        const titleHtml = titleId ? renderTitleHTML(titleId) : '';
        let inner = renderPseudoInnerHTML(pseudo, cosmeticId, colorId);
        if (titleId === 'title_eccumeur' && TITLE_REWARDS.title_eccumeur?.pseudoDofus) {
            inner = wrapPseudoWithEccumeurDofus(inner);
        }
        return `<span class="player-pseudo-full">${titleHtml}${inner}</span>`;
    }

    function getDisplayIds(forSelf) {
        const s = getState();
        if (!forSelf || !s) return { titleId: null, colorId: null, cosmeticId: 'default' };
        return {
            titleId: s.equippedTitleId || null,
            colorId: s.equippedColorId || null,
            cosmeticId: window.StepFishCosmetics?.getEquippedId?.() || s.equippedCosmetic || 'default'
        };
    }

    function refreshPseudoDisplays() {
        const pseudo = window.StepFishAuth?.getPseudo?.() || document.getElementById('user-pseudo')?.textContent || 'Pêcheur';
        const { titleId, colorId, cosmeticId } = getDisplayIds(true);
        const html = renderPlayerPseudoHTML(pseudo, cosmeticId, titleId, colorId);
        const userEl = document.getElementById('user-pseudo');
        if (userEl) userEl.innerHTML = html;
        const prof = document.getElementById('prof-pseudo-display');
        if (prof) prof.innerHTML = html;
    }

    function renderRewardTags(ach) {
        return (ach.rewards || []).map(r => {
            if (r.type === 'title' && TITLE_REWARDS[r.id]) {
                return `<span class="ach-reward-tag ach-reward-title">${escapeHtml(TITLE_REWARDS[r.id].label)}</span>`;
            }
            if (r.type === 'color' && COLOR_REWARDS[r.id]) {
                return `<span class="ach-reward-tag ach-reward-color">${escapeHtml(COLOR_REWARDS[r.id].label)}</span>`;
            }
            if (r.type === 'money') return `<span class="ach-reward-tag">+${Number(r.n).toLocaleString('fr-FR')} $</span>`;
            if (r.type === 'keys') return `<span class="ach-reward-tag">+${r.n} 🔑</span>`;
            if (ach.cat === 'dofus') return '<span class="ach-reward-tag ach-reward-dofus">Collection</span>';
            return '';
        }).join('');
    }

    function getDofusIconHtml(ach) {
        const id = ach.cond?.type === 'dofus' ? ach.cond.id : null;
        const def = id && window.STEPFISH_DOFUS?.byId?.[id];
        if (def) {
            return `<img src="${def.img}" class="ach-dofus-thumb" alt="" width="40" height="40">`;
        }
        if (ach.cond?.type === 'all_dofus') {
            return '<span class="ach-dofus-six" aria-hidden="true">💎×6</span>';
        }
        return ach.icon;
    }

    function filterAchievements(filter, unlocked) {
        return ACHIEVEMENTS.filter(ach => {
            if (filter === 'done') return unlocked.includes(ach.id);
            if (filter === 'todo') return !unlocked.includes(ach.id);
            if (filter !== 'all') return ach.cat === filter;
            return true;
        });
    }

    function renderCardHtml(ach, s, unlocked) {
        const done = unlocked.includes(ach.id);
        const p = getProgress(ach, s);
        const pct = Math.min(100, Math.round((p.cur / Math.max(p.max, 1)) * 100));
        let action = '';
        if (done) {
            const rewards = ach.rewards || [];
            const titleRs = rewards.filter(r => r.type === 'title');
            const colorRs = rewards.filter(r => r.type === 'color');
            titleRs.forEach(titleR => {
                if (s.ownedTitleIds.includes(titleR.id)) {
                    const eq = s.equippedTitleId === titleR.id;
                    action += `<button type="button" class="ach-equip-btn${eq ? ' equipped' : ''}" data-equip-title="${titleR.id}">${eq ? 'Préfixe équipé' : 'Équiper préfixe'}</button>`;
                }
            });
            colorRs.forEach(colorR => {
                if (s.ownedColorIds.includes(colorR.id)) {
                    const eq = s.equippedColorId === colorR.id;
                    action += `<button type="button" class="ach-equip-btn${eq ? ' equipped' : ''}" data-equip-color="${colorR.id}">${eq ? 'Couleur équipée' : 'Équiper couleur'}</button>`;
                }
            });
            if (!titleRs.length && !colorRs.length) action = '<span class="ach-done-tag">✓ Trophée obtenu</span>';
        } else {
            action = `<div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${pct}%"></div></div><span class="ach-progress-text">${formatProgress(p, ach)}</span>`;
        }
        const iconContent = ach.cat === 'dofus' ? getDofusIconHtml(ach) : ach.icon;
        return `<article class="ach-card${done ? ' ach-card-done' : ''}${ach.cat === 'dofus' ? ' ach-card-dofus' : ''}" data-id="${ach.id}" data-cat="${ach.cat}">
            <div class="ach-card-top">
                <span class="ach-card-icon">${iconContent}</span>
                ${done ? '<span class="ach-card-badge">✓</span>' : ''}
            </div>
            <h3>${escapeHtml(ach.name)}</h3>
            <p class="ach-card-desc">${escapeHtml(ach.desc)}</p>
            <div class="ach-rewards">${renderRewardTags(ach)}</div>
            <div class="ach-card-footer">${action}</div>
        </article>`;
    }

    function bindEquipButtons(root) {
        if (!root) return;
        root.querySelectorAll('[data-equip-title]').forEach(btn => {
            btn.addEventListener('click', () => equipTitle(btn.dataset.equipTitle));
        });
        root.querySelectorAll('[data-equip-color]').forEach(btn => {
            btn.addEventListener('click', () => equipColor(btn.dataset.equipColor));
        });
    }

    function renderScreen() {
        const grid = document.getElementById('achievements-grid');
        const summary = document.getElementById('achievements-summary');
        if (!grid) return;

        const s = getState();
        ensureAchievementState(s);
        const unlocked = s?.unlockedAchievements || [];
        const total = ACHIEVEMENTS.length;
        const filter = activeAchFilter;

        const globalPct = total ? Math.round((unlocked.length / total) * 100) : 0;
        const globalPctEl = document.getElementById('achievements-global-pct');
        if (globalPctEl) globalPctEl.textContent = `${globalPct}%`;

        if (summary) {
            summary.textContent = `${unlocked.length} / ${total} trophées débloqués`;
        }

        const legend = document.getElementById('achievements-legend');
        if (legend) {
            legend.innerHTML = CATEGORIES.map(cat => {
                const items = ACHIEVEMENTS.filter(a => a.cat === cat.id);
                const done = items.filter(a => unlocked.includes(a.id)).length;
                const pct = items.length ? Math.round((done / items.length) * 100) : 0;
                return `<span class="ach-legend-item ach-legend-${cat.id}"><span class="ach-legend-icon">${cat.icon}</span><span class="ach-legend-label">${escapeHtml(cat.label)}</span><strong>${done}/${items.length}</strong><span class="ach-legend-pct">${pct}%</span></span>`;
            }).join('');
        }

        document.querySelectorAll('.ach-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });

        const list = filterAchievements(filter, unlocked);

        function renderSection(cat, items, showHead = true) {
            if (!items.length) return '';
            const doneInCat = items.filter(a => unlocked.includes(a.id)).length;
            const sectionPct = Math.round((doneInCat / items.length) * 100);
            const head = showHead ? `<header class="ach-section-head">
                <h2 class="ach-section-title"><span class="ach-section-icon">${cat.icon}</span> ${escapeHtml(cat.label)}</h2>
                <span class="ach-section-meta">${doneInCat} / ${items.length} · ${sectionPct}%</span>
            </header>
            <div class="ach-section-bar"><div class="ach-section-bar-fill" style="width:${sectionPct}%"></div></div>` : '';
            return `<section class="ach-section ach-section-${cat.id}" data-cat="${cat.id}">
                ${head}
                <div class="ach-section-grid">${items.map(ach => renderCardHtml(ach, s, unlocked)).join('')}</div>
            </section>`;
        }

        if (filter === 'all') {
            grid.className = 'achievements-grid achievements-grid-sectioned';
            grid.innerHTML = CATEGORIES.map(cat => renderSection(cat, list.filter(a => a.cat === cat.id))).join('');
        } else if (filter === 'done' || filter === 'todo') {
            grid.className = 'achievements-grid achievements-grid-flat';
            grid.innerHTML = list.length
                ? list.map(ach => renderCardHtml(ach, s, unlocked)).join('')
                : `<p class="ach-empty-msg">${filter === 'done' ? 'Aucun trophée débloqué pour l\'instant.' : 'Tous les succès sont débloqués — bravo !'}</p>`;
        } else {
            const cat = CATEGORIES.find(c => c.id === filter) || { id: filter, icon: '🏅', label: 'Succès' };
            grid.className = 'achievements-grid achievements-grid-sectioned';
            grid.innerHTML = list.length
                ? renderSection(cat, list)
                : '<p class="ach-empty-msg">Aucun succès dans cette catégorie.</p>';
        }

        bindEquipButtons(grid);
    }

    function setActiveFilter(filter) {
        activeAchFilter = filter || 'all';
        renderScreen();
    }

    function formatProgress(p, ach) {
        if (['max_money', 'best_fish', 'total_sold'].includes(ach.cond.type)) {
            return `${Number(p.cur).toLocaleString('fr-FR')} / ${Number(p.max).toLocaleString('fr-FR')}`;
        }
        return `${p.cur} / ${p.max}`;
    }

    function equipTitle(id) {
        const s = getState();
        if (!s || !TITLE_REWARDS[id] || !s.ownedTitleIds.includes(id)) return;
        s.equippedTitleId = s.equippedTitleId === id ? null : id;
        persistAndRefresh();
    }

    function equipColor(id) {
        const s = getState();
        if (!s || !COLOR_REWARDS[id] || !s.ownedColorIds.includes(id)) return;
        s.equippedColorId = s.equippedColorId === id ? null : id;
        persistAndRefresh();
    }

    function persistAndRefresh() {
        persistGameState();
        refreshPseudoDisplays();
        renderScreen();
    }

    function loadFromSave(data) {
        const s = getState();
        if (!s) return;
        s.unlockedAchievements = Array.isArray(data?.unlockedAchievements) ? data.unlockedAchievements : [];
        s.ownedTitleIds = Array.isArray(data?.ownedTitleIds) ? data.ownedTitleIds : [];
        s.ownedColorIds = Array.isArray(data?.ownedColorIds) ? data.ownedColorIds : [];
        s.equippedTitleId = data?.equippedTitleId || null;
        s.equippedColorId = data?.equippedColorId || null;
        s.achievementStats = data?.achievementStats || defaultStats();
        ensureAchievementState(s);
        checkAll();
        refreshPseudoDisplays();
    }

    function onFishCaught(fish) {
        const s = getState();
        if (!s || !fish || fish.isKey || fish.isTreasureBox || fish.isDofus) return;
        ensureAchievementState(s);
        const r = fish.id ?? fish.rarity;
        if (r >= 3 && r <= 6) {
            s.achievementStats.rarityCounts[r] = (s.achievementStats.rarityCounts[r] || 0) + 1;
        }
        checkAll();
    }

    function onKeyFound() {
        const s = getState();
        if (!s) return;
        ensureAchievementState(s);
        s.achievementStats.keysFound++;
        checkAll();
    }

    function onCrateOpened() {
        const s = getState();
        if (!s) return;
        ensureAchievementState(s);
        s.achievementStats.cratesOpened++;
        checkAll();
    }

    function onChatSent() {
        const s = getState();
        if (!s) return;
        ensureAchievementState(s);
        s.achievementStats.chatSent++;
        checkAll();
    }

    function onTradeDone() {
        const s = getState();
        if (!s) return;
        ensureAchievementState(s);
        s.achievementStats.tradesDone++;
        checkAll();
    }

    function onComboUpdate(combo) {
        const s = getState();
        if (!s) return;
        ensureAchievementState(s);
        if (combo > s.achievementStats.maxCombo) s.achievementStats.maxCombo = combo;
        checkAll();
    }

    function onFishSold(count, gain) {
        const s = getState();
        if (!s) return;
        ensureAchievementState(s);
        s.achievementStats.fishSold += count;
        s.achievementStats.totalSold += gain;
        checkAll();
    }

    function open() {
        if (typeof showScreen === 'function') showScreen('achievements');
        renderScreen();
    }

    function init() {
        const s = getState();
        ensureAchievementState(s);
        document.querySelectorAll('.ach-tab').forEach(tab => {
            tab.addEventListener('click', () => setActiveFilter(tab.dataset.filter));
        });
        checkAll();
    }

    window.StepFishAchievements = {
        ACHIEVEMENTS,
        TITLE_REWARDS,
        COLOR_REWARDS,
        registerStateBridge,
        init,
        loadFromSave,
        open,
        renderScreen,
        checkAll,
        refreshPseudoDisplays,
        renderPlayerPseudoHTML,
        getDisplayIds,
        onFishCaught,
        onKeyFound,
        onCrateOpened,
        onChatSent,
        onTradeDone,
        onComboUpdate,
        onFishSold,
        equipTitle,
        equipColor,
        escapeHtml
    };
})();
