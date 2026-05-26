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
                if (!row.best_fish_value || row.best_fish_value <= 0) {
                    return '—';
                }
                return `${row.best_fish_name || 'Poisson'} · ${formatMoney(row.best_fish_value)}${row.best_fish_rarity ? ' · ' + row.best_fish_rarity : ''}`;
            default:
                return '';
        }
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

    function renderPseudoCell(pseudo, cosmeticId) {
        if (window.StepFishCosmetics?.renderPseudoHTML) {
            return window.StepFishCosmetics.renderPseudoHTML(pseudo, resolveCosmeticId(cosmeticId));
        }
        return `<span class="lb-pseudo-plain">${escapeHtml(pseudo)}</span>`;
    }

    function renderList(rows) {
        const list = document.getElementById('lb-list');
        if (!list) return;

        if (!rows.length) {
            list.innerHTML = '<li class="lb-empty">Aucun joueur classé pour le moment.</li>';
            return;
        }

        const myPseudo = getMyPseudo();
        list.innerHTML = rows.map((row, index) => {
            const rank = index + 1;
            const isMe = myPseudo && row.pseudo === myPseudo;
            const cosId = resolveCosmeticId(row.cosmetic_id);
            const hasFx = cosId !== 'default';
            return `<li class="lb-row${isMe ? ' lb-row-me' : ''}${hasFx ? ' lb-row-cos' : ''}">
                <span class="lb-rank">${medalForRank(rank)}</span>
                <span class="lb-pseudo">${renderPseudoCell(row.pseudo, cosId)}</span>
                <span class="lb-value">${escapeHtml(formatValue(row, activeCategory))}</span>
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
            .select('pseudo, money, level, prestige, total_score, fishes_caught, best_fish_value, best_fish_name, best_fish_rarity, cosmetic_id')
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
