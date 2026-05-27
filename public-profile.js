/**
 * StepFishing — Profil joueur public (clic pseudo chat / classement)
 */
(function () {
    const AQ_CONFIGS = [
        { name: 'Bac Classique', bg: 'assets/aquariums/aq0.png' },
        { name: 'Lagon Corail', bg: 'assets/aquariums/aq1.png' },
        { name: 'Abysse Noir', bg: 'assets/aquariums/aq2.png' },
        { name: "Palais d'Or", bg: 'assets/aquariums/aq3.png' },
        { name: 'Nébuleuse', bg: 'assets/aquariums/aq4.png' }
    ];
    const AQ_SLOTS = 15;

    let currentProfile = null;
    let currentAqIndex = 0;
    let loading = false;

    function getClient() {
        return window.StepFishAuth?.getSupabaseClient?.() || null;
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatMoney(value) {
        return Number(value || 0).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' $';
    }

    function getHelpers() {
        return window.StepFishGameTrade || {};
    }

    function getMutationData(name) {
        const h = getHelpers();
        if (h.getMutationData) return h.getMutationData(name);
        return { name: name || 'Normal', effect: 'none', color: 'transparent' };
    }

    function formatFishWeight(kg) {
        const h = getHelpers();
        if (h.formatFishWeight) return h.formatFishWeight(kg);
        return `${Number(kg || 0).toFixed(2)} kg`;
    }

    function getFishWeightKg(fish) {
        const h = getHelpers();
        if (h.getFishWeightKg) return h.getFishWeightKg(fish);
        return Number(fish?.weight) || 1;
    }

    function aquariumFishWidthPx(kg) {
        const w = Math.min(120, Math.max(36, 28 + (Number(kg) || 1) * 4));
        return Math.round(w);
    }

    function getRarityLabel(fish) {
        if (fish?.rarity) return fish.rarity;
        const cls = fish?.class || '';
        const map = {
            'rarity-0': 'Commun', 'rarity-1': 'Peu Commun', 'rarity-2': 'Rare',
            'rarity-3': 'Épique', 'rarity-4': 'Légendaire', 'rarity-5': 'Mythique', 'rarity-6': 'Divin'
        };
        return map[cls] || 'Poisson';
    }

    function buildFishThumbHTML(fish) {
        if (!fish?.img) return '<span class="pp-fish-placeholder">🐟</span>';
        const mut = escapeHtml(fish.mutation || 'Normal');
        const w = aquariumFishWidthPx(getFishWeightKg(fish));
        return `<span class="pp-fish-thumb" data-mutation="${mut}">
            <img src="${escapeHtml(fish.img)}" alt="" loading="lazy" style="width:${w}px">
        </span>`;
    }

    function renderPseudoHeader(pseudo, cosmeticId) {
        const el = document.getElementById('pp-pseudo-header');
        if (!el) return;
        if (window.StepFishCosmetics?.renderPseudoHTML) {
            el.innerHTML = window.StepFishCosmetics.renderPseudoHTML(pseudo, cosmeticId || 'default');
        } else {
            el.textContent = pseudo;
        }
    }

    function setStatus(text, isError) {
        const el = document.getElementById('pp-status');
        if (!el) return;
        el.textContent = text || '';
        el.className = 'pp-status' + (isError ? ' pp-status-error' : text ? ' pp-status-ok' : '');
    }

    function showModal(view) {
        const modal = document.getElementById('public-profile-modal');
        if (!modal) return;
        modal.classList.add('active');
        document.getElementById('pp-stats-view')?.classList.toggle('hidden', view !== 'stats');
        document.getElementById('pp-aq-view')?.classList.toggle('hidden', view !== 'aq');
    }

    function closeModal() {
        document.getElementById('public-profile-modal')?.classList.remove('active');
        currentProfile = null;
    }

    function normalizeUnlocked(raw) {
        const ids = [...new Set(
            (Array.isArray(raw) ? raw : [0]).map(n => parseInt(n, 10)).filter(n => !isNaN(n) && n >= 0 && n < AQ_CONFIGS.length)
        )];
        if (!ids.includes(0)) ids.unshift(0);
        return ids.sort((a, b) => a - b);
    }

    function renderBestFish(bf) {
        const box = document.getElementById('pp-best-fish');
        if (!box) return;
        if (!bf?.name || !(bf.value > 0)) {
            box.innerHTML = '<p class="pp-muted">Aucun record enregistré.</p>';
            return;
        }
        box.innerHTML = `<div class="pp-best-fish-card">
            ${buildFishThumbHTML(bf)}
            <div class="pp-best-fish-meta">
                <strong class="rarity-text ${escapeHtml(bf.class || '')}">${escapeHtml(bf.name)}</strong>
                <span>${escapeHtml(bf.mutation || 'Normal')} · ${formatMoney(bf.value)}</span>
            </div>
        </div>`;
    }

    function renderStatsView() {
        const p = currentProfile;
        if (!p) return;
        renderPseudoHeader(p.pseudo, p.cosmetic_id);
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        set('pp-level', `Niv. ${p.level} · P${p.prestige}`);
        set('pp-money', formatMoney(p.money));
        set('pp-max-money', formatMoney(p.max_money));
        set('pp-fishes', String(p.fishes_caught || 0));
        set('pp-discovered', String(p.discovered_count || 0));
        set('pp-xp', String(Math.floor(p.total_score || 0)));
        renderBestFish(p.best_fish);
        setStatus('');
    }

    function getInventory() {
        const inv = currentProfile?.inventory;
        return inv && typeof inv === 'object' ? inv : {};
    }

    function renderAquariumView() {
        const p = currentProfile;
        if (!p) return;
        const unlocked = normalizeUnlocked(p.unlocked_aquariums);
        if (!unlocked.includes(currentAqIndex)) {
            currentAqIndex = unlocked[0] ?? 0;
        }
        const cfg = AQ_CONFIGS[currentAqIndex];
        const inv = getInventory();
        const aqId = `aq${currentAqIndex}`;
        const fishes = Array.isArray(inv[aqId]) ? inv[aqId] : [];
        const isUnlocked = unlocked.includes(currentAqIndex);

        const title = document.getElementById('pp-aq-title');
        const slots = document.getElementById('pp-aq-slots');
        const grid = document.getElementById('pp-aq-fish-grid');
        const bg = document.getElementById('pp-aq-preview');
        const lock = document.getElementById('pp-aq-locked');

        if (title) title.textContent = cfg?.name || 'Aquarium';
        if (bg && cfg) {
            bg.style.backgroundImage = `url('${cfg.bg}')`;
        }
        if (slots) slots.textContent = isUnlocked ? `${fishes.length} / ${AQ_SLOTS} poissons` : 'Aquarium non débloqué';
        if (lock) lock.classList.toggle('hidden', isUnlocked);
        if (!grid) return;

        if (!isUnlocked) {
            grid.innerHTML = '';
            return;
        }

        if (!fishes.length) {
            grid.innerHTML = '<p class="pp-muted pp-aq-empty">Ce bac est vide.</p>';
            return;
        }

        grid.innerHTML = fishes.map(fish => {
            const mut = getMutationData(fish.mutation);
            const pMult = fish.prefixMult > 0 ? fish.prefixMult : 1;
            const pNote = fish.prefixTier ? ` · Préfixe ${escapeHtml(fish.prefixTier)} (×${pMult})` : '';
            const locked = fish.locked ? ' · 🔒' : '';
            return `<article class="pp-aq-fish-card${mut.effect !== 'none' ? ` mut-${mut.effect}` : ''}" data-mutation="${escapeHtml(mut.name)}">
                ${fish.locked ? '<span class="pp-aq-lock">🔒</span>' : ''}
                ${buildFishThumbHTML(fish)}
                <strong class="rarity-text ${escapeHtml(fish.class || '')}">${escapeHtml(fish.name || 'Poisson')}</strong>
                <span class="pp-aq-fish-meta">${escapeHtml(getRarityLabel(fish))}${pNote}<br>${escapeHtml(mut.name)} · ${formatFishWeight(getFishWeightKg(fish))}${locked}</span>
                <span class="pp-aq-fish-val">${formatMoney(fish.value)}</span>
            </article>`;
        }).join('');
    }

    function showStatsView() {
        showModal('stats');
        renderStatsView();
    }

    function showAquariumView() {
        const owner = document.getElementById('pp-aq-owner');
        if (owner && currentProfile) {
            owner.textContent = `Aquariums de ${currentProfile.pseudo}`;
        }
        showModal('aq');
        renderAquariumView();
    }

    async function fetchProfile(pseudo) {
        const client = getClient();
        if (!client) {
            throw new Error('Serveur indisponible — connecte-toi en ligne.');
        }
        const { data, error } = await client.rpc('get_public_player_profile', {
            p_pseudo: pseudo.trim()
        });
        if (error) {
            const hint = (error.message || '').includes('get_public_player_profile')
                ? 'Exécute supabase-public-profile.sql dans Supabase.'
                : error.message;
            throw new Error(hint || 'Profil introuvable.');
        }
        if (!data) throw new Error('Joueur introuvable ou sans sauvegarde en ligne.');
        return data;
    }

    async function open(pseudo) {
        const name = (pseudo || '').trim();
        if (!name) return;
        if (loading) return;

        if (!window.StepFishAuth?.isConfigured?.()) {
            alert('Profils joueurs disponibles uniquement en mode en ligne.');
            return;
        }

        loading = true;
        setStatus('Chargement du profil…');
        showModal('stats');
        document.getElementById('public-profile-modal')?.classList.add('active');

        try {
            currentProfile = await fetchProfile(name);
            currentAqIndex = 0;
            showStatsView();
        } catch (e) {
            console.warn('Public profile:', e);
            setStatus(e.message || 'Erreur', true);
            currentProfile = null;
        } finally {
            loading = false;
        }
    }

    function bindClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.player-pseudo-link');
            if (!link) return;
            e.preventDefault();
            e.stopPropagation();
            const pseudo = link.dataset.playerPseudo;
            if (pseudo) open(pseudo);
        });
    }

    function bindUI() {
        document.getElementById('btn-pp-close')?.addEventListener('click', closeModal);
        document.getElementById('btn-pp-close-aq')?.addEventListener('click', closeModal);
        document.getElementById('public-profile-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'public-profile-overlay') closeModal();
        });
        document.getElementById('btn-pp-view-aquariums')?.addEventListener('click', () => {
            if (!currentProfile) return;
            showAquariumView();
        });
        document.getElementById('btn-pp-back-stats')?.addEventListener('click', showStatsView);
        document.getElementById('btn-pp-aq-prev')?.addEventListener('click', () => {
            if (!currentProfile) return;
            const unlocked = normalizeUnlocked(currentProfile.unlocked_aquariums);
            let idx = unlocked.indexOf(currentAqIndex);
            idx = idx <= 0 ? unlocked.length - 1 : idx - 1;
            currentAqIndex = unlocked[idx] ?? 0;
            renderAquariumView();
        });
        document.getElementById('btn-pp-aq-next')?.addEventListener('click', () => {
            if (!currentProfile) return;
            const unlocked = normalizeUnlocked(currentProfile.unlocked_aquariums);
            let idx = unlocked.indexOf(currentAqIndex);
            idx = idx < 0 || idx >= unlocked.length - 1 ? 0 : idx + 1;
            currentAqIndex = unlocked[idx] ?? 0;
            renderAquariumView();
        });
    }

    function init() {
        bindClicks();
        bindUI();
    }

    window.StepFishPublicProfile = { init, open, close: closeModal };
})();
