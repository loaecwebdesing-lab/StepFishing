/**
 * StepFishing — Classement multijoueur (Supabase)
 */
(function () {
    const LIMIT = 50;

    const CATEGORIES = [
        {
            id: 'money',
            label: '💰 Argent',
            orders: [{ column: 'money', ascending: false }]
        },
        {
            id: 'level',
            label: '⭐ Niveau',
            orders: [
                { column: 'prestige', ascending: false },
                { column: 'level', ascending: false },
                { column: 'total_score', ascending: false }
            ]
        },
        {
            id: 'fishes',
            label: '🐟 Captures',
            orders: [{ column: 'fishes_caught', ascending: false }]
        },
        {
            id: 'best_fish',
            label: '🏆 Meilleur poisson',
            orders: [{ column: 'best_fish_value', ascending: false }]
        },
        {
            id: 'common_streak',
            label: '📉 Série Commun',
            orders: [{ column: 'best_common_streak', ascending: false }]
        }
    ];

    let activeCategory = 'money';
    let loading = false;

    function getClient() {
        return window.StepFishAuth?.getSupabaseClient?.() || null;
    }

    function isAvailable() {
        return Boolean(window.StepFishAuth?.isConfigured?.() && getClient());
    }

    function getMyPseudo() {
        if (!window.StepFishAuth?.isLoggedIn?.()) return null;
        return window.StepFishAuth.getPseudo();
    }

    function setStatus(text, isError) {
        const el = document.getElementById('lb-status');
        if (!el) return;
        el.textContent = text || '';
        el.className = 'lb-status' + (isError ? ' lb-status-error' : text ? ' lb-status-ok' : '');
    }

    function formatMoney(value) {
        return Number(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' $';
    }

    function formatValue(row, categoryId) {
        switch (categoryId) {
            case 'money':
                return formatMoney(row.money);
            case 'level':
                return `Niv. ${row.level} · P${row.prestige}`;
            case 'fishes':
                return `${row.fishes_caught} poisson${row.fishes_caught > 1 ? 's' : ''}`;
            case 'best_fish':
                return '';
            case 'common_streak': {
                let n = row.best_common_streak || 0;
                const myPseudo = getMyPseudo();
                if (myPseudo && row.pseudo === myPseudo) {
                    const local = window.__stepfishGetState?.()?.commonStreakBest;
                    if (typeof local === 'number' && local > n) n = local;
                }
                return n > 0
                    ? `${n} commun${n > 1 ? 's' : ''} d'affilée`
                    : '—';
            }
            default:
                return '';
        }
    }

    function bestFishDataForRow(row, myPseudo) {
        if (myPseudo && row.pseudo === myPseudo) {
            const local = window.__stepfishGetState?.()?.bestFish;
            if (local?.name) {
                return {
                    name: local.name,
                    value: local.value ?? row.best_fish_value,
                    img: local.img || row.best_fish_img || '',
                    mutation: local.mutation || row.best_fish_mutation || 'Normal',
                    class: local.class || row.best_fish_class || ''
                };
            }
        }
        if (!row.best_fish_value || row.best_fish_value <= 0) return null;
        return {
            name: row.best_fish_name || 'Poisson',
            value: row.best_fish_value,
            img: row.best_fish_img || '',
            mutation: row.best_fish_mutation || 'Normal',
            class: row.best_fish_class || ''
        };
    }

    function renderFishThumb(bf) {
        const mut = escapeHtml(bf.mutation || 'Normal');
        if (bf.img) {
            return `<span class="lb-fish-thumb" data-mutation="${mut}">
                <img src="${escapeHtml(bf.img)}" class="lb-best-fish-img" alt="" loading="lazy" width="52" height="52">
            </span>`;
        }
        return '<span class="lb-fish-thumb lb-fish-thumb-placeholder" aria-hidden="true">🐟</span>';
    }

    function renderBestFishCell(row, myPseudo) {
        const bf = bestFishDataForRow(row, myPseudo);
        if (!bf) return '<span class="lb-best-fish-empty">—</span>';

        const mutLabel = escapeHtml(bf.mutation || 'Normal');
        const nameClass = escapeHtml(bf.class || '');
        return `<span class="lb-best-fish-wrap">
            <span class="lb-best-fish-head">
                ${renderFishThumb(bf)}
                <strong class="lb-best-fish-name rarity-text ${nameClass}">${escapeHtml(bf.name)}</strong>
            </span>
            <span class="lb-best-fish-mut">${mutLabel}</span>
            <span class="lb-best-fish-val">${formatMoney(bf.value)}</span>
        </span>`;
    }

    function medalForRank(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    }

    function renderTabs() {
        const container = document.getElementById('lb-tabs');
        if (!container) return;
        container.innerHTML = '';
        CATEGORIES.forEach(cat => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'lb-tab' + (cat.id === activeCategory ? ' active' : '');
            btn.textContent = cat.label;
            btn.addEventListener('click', () => {
                if (activeCategory === cat.id || loading) return;
                activeCategory = cat.id;
                renderTabs();
                loadLeaderboard();
            });
            container.appendChild(btn);
        });
    }

    function resolveCosmeticId(id) {
        const catalog = window.StepFishCosmetics?.catalog || [];
        const valid = new Set(catalog.map(c => c.id));
        return id && valid.has(id) ? id : 'default';
    }

    /** DB parfois en retard : pour ta ligne, utilise le style équipé en local. */
    function cosmeticIdForRow(row, myPseudo) {
        let id = row.cosmetic_id;
        if (myPseudo && row.pseudo === myPseudo) {
            const local = window.StepFishCosmetics?.getEquippedId?.()
                || window.__stepfishGetState?.()?.equippedCosmetic;
            if (local && local !== 'default') id = local;
        }
        return resolveCosmeticId(id);
    }

    function achievementIdsForRow(row, myPseudo) {
        let titleId = row.achievement_title_id || null;
        let colorId = row.achievement_color_id || null;
        if (myPseudo && row.pseudo === myPseudo) {
            const s = window.__stepfishGetState?.();
            if (s) {
                titleId = s.equippedTitleId || titleId;
                colorId = s.equippedColorId || colorId;
            }
        }
        return { titleId: titleId || null, colorId: colorId || null };
    }

    function renderPseudoCell(pseudo, cosmeticId, titleId, colorId) {
        let inner;
        if (window.StepFishAchievements?.renderPlayerPseudoHTML) {
            inner = window.StepFishAchievements.renderPlayerPseudoHTML(
                pseudo,
                resolveCosmeticId(cosmeticId),
                titleId,
                colorId
            );
        } else if (window.StepFishCosmetics?.renderPseudoHTML) {
            inner = window.StepFishCosmetics.renderPseudoHTML(pseudo, resolveCosmeticId(cosmeticId));
        } else {
            inner = `<span class="lb-pseudo-plain">${escapeHtml(pseudo)}</span>`;
        }
        return `<button type="button" class="player-pseudo-link lb-pseudo-link" data-player-pseudo="${escapeHtml(pseudo)}" title="Voir le profil de ${escapeHtml(pseudo)}">${inner}</button>`;
    }

    function renderList(rows) {
        const list = document.getElementById('lb-list');
        if (!list) return;

        const isBestFish = activeCategory === 'best_fish';
        list.classList.toggle('lb-cat-best-fish', isBestFish);

        if (!rows.length) {
            list.innerHTML = '<li class="lb-empty">Aucun joueur classé pour le moment.</li>';
            return;
        }

        const myPseudo = getMyPseudo();
        list.innerHTML = rows.map((row, index) => {
            const rank = index + 1;
            const isMe = myPseudo && row.pseudo === myPseudo;
            const cosId = cosmeticIdForRow(row, myPseudo);
            const ach = achievementIdsForRow(row, myPseudo);
            const hasFx = cosId !== 'default';
            const valueCell = isBestFish
                ? renderBestFishCell(row, myPseudo)
                : escapeHtml(formatValue(row, activeCategory));
            return `<li class="lb-row${isMe ? ' lb-row-me' : ''}${hasFx ? ' lb-row-cos' : ''}${isBestFish ? ' lb-row-best-fish' : ''}">
                <span class="lb-rank">${medalForRank(rank)}</span>
                <span class="lb-pseudo">${renderPseudoCell(row.pseudo, cosId, ach.titleId, ach.colorId)}</span>
                <span class="lb-value${isBestFish ? ' lb-value-best-fish' : ''}">${valueCell}</span>
            </li>`;
        }).join('');
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function loadLeaderboard() {
        if (!isAvailable()) {
            setStatus('Classement indisponible — connecte-toi au serveur en ligne.', true);
            renderList([]);
            return;
        }

        const cat = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
        const client = getClient();
        loading = true;
        setStatus('Chargement…');

        let query = client
            .from('leaderboard_stats')
            .select('pseudo, money, level, prestige, total_score, fishes_caught, best_fish_value, best_fish_name, best_fish_rarity, best_fish_img, best_fish_mutation, best_fish_class, best_common_streak, cosmetic_id, achievement_title_id, achievement_color_id')
            .limit(LIMIT);

        cat.orders.forEach((order, i) => {
            query = i === 0
                ? query.order(order.column, { ascending: order.ascending })
                : query.order(order.column, { ascending: order.ascending });
        });

        const { data, error } = await query;
        loading = false;

        if (error) {
            console.warn('Leaderboard:', error);
            const hint = (error.message || '').includes('leaderboard_stats')
                ? 'Exécute la partie « Classement » de supabase-setup.sql dans Supabase.'
                : error.message;
            setStatus(hint || 'Impossible de charger le classement.', true);
            renderList([]);
            return;
        }

        const rows = (data || []).filter(r => r.pseudo);
        renderList(rows);
        setStatus(`${rows.length} joueur${rows.length > 1 ? 's' : ''} · mis à jour en direct`);
    }

    function open() {
        if (typeof showScreen === 'function') showScreen('leaderboard');
        renderTabs();
        loadLeaderboard();
    }

    function init() {
        const refreshBtn = document.getElementById('btn-lb-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (!loading) loadLeaderboard();
            });
        }
        renderTabs();
    }

    window.StepFishLeaderboard = {
        init,
        open,
        refresh: loadLeaderboard,
        isAvailable
    };
})();
