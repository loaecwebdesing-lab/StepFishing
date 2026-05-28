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

    function getPreview() {
        return window.StepFishAquariumPreview || window.StepFishGameTrade || {};
    }

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

    function buildFishThumbHTML(fish) {
        const p = getPreview();
        if (!fish?.img) return '<span class="pp-fish-placeholder">🐟</span>';
        const kg = p.getFishWeightKg?.(fish) ?? fish.weight;
        const w = p.fishDisplayWidthPx
            ? p.fishDisplayWidthPx(kg, fish.mutation)
            : (p.aquariumFishWidthPx ? p.aquariumFishWidthPx(kg) : 64);
        const mut = escapeHtml(fish.mutation || 'Normal');
        return `<span class="pp-fish-thumb" data-mutation="${mut}">
            <img src="${escapeHtml(fish.img)}" alt="" loading="lazy" style="width:${w}px">
        </span>`;
    }

    function renderPseudoHeader(pseudo, cosmeticId, titleId, colorId, ornamentId) {
        const el = document.getElementById('pp-pseudo-header');
        if (!el) return;
        const styleId = cosmeticId && window.StepFishCosmetics?.isOrnamentId?.(cosmeticId)
            ? 'default'
            : (cosmeticId || 'default');
        if (window.StepFishAchievements?.renderPlayerPseudoHTML) {
            el.innerHTML = window.StepFishAchievements.renderPlayerPseudoHTML(
                pseudo,
                styleId,
                titleId,
                colorId,
                ornamentId || null
            );
        } else if (window.StepFishCosmetics?.renderPseudoHTML) {
            el.innerHTML = window.StepFishCosmetics.renderPseudoHTML(pseudo, styleId, ornamentId || null);
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

    function stopAquariumAnim() {
        window.StepFishAquariumPreview?.stopAquariumFishAnimation?.();
    }

    function setCardAquariumMode(on) {
        document.querySelector('.pp-card')?.classList.toggle('pp-card-aq', on);
        document.getElementById('public-profile-modal')?.classList.toggle('pp-modal-aq', on);
    }

    function showModal(view) {
        const modal = document.getElementById('public-profile-modal');
        if (!modal) return;
        modal.classList.add('active');
        setCardAquariumMode(view === 'aq');
        document.getElementById('pp-stats-view')?.classList.toggle('hidden', view !== 'stats');
        document.getElementById('pp-aq-view')?.classList.toggle('hidden', view !== 'aq');
        if (view !== 'aq') {
            stopAquariumAnim();
            hideFishInfo();
        }
    }

    function closeModal() {
        stopAquariumAnim();
        setCardAquariumMode(false);
        hideFishInfo();
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
        renderPseudoHeader(p.pseudo, p.cosmetic_id, p.achievement_title_id, p.achievement_color_id, p.ornament_id);
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

    function hideFishInfo() {
        const el = document.getElementById('pp-fish-info');
        if (el) {
            el.classList.add('hidden');
            el.innerHTML = '';
        }
    }

    function showFishInfo(fish) {
        const el = document.getElementById('pp-fish-info');
        const p = getPreview();
        if (!el || !fish) return;
        const weightKg = p.getFishWeightKg ? p.getFishWeightKg(fish) : fish.weight;
        const mut = p.getMutationData ? p.getMutationData(fish.mutation) : { name: fish.mutation || 'Normal' };
        const rarity = p.getRarityNameFromClass ? p.getRarityNameFromClass(fish.class) : 'Poisson';
        const pMult = p.getFishPrefixMult ? p.getFishPrefixMult(fish) : 1;
        const pNote = fish.prefixTier ? ` · Préfixe ${fish.prefixTier} (×${pMult})` : '';
        const visual = p.buildFishVisualHTML
            ? p.buildFishVisualHTML(fish, (p.fishDisplayWidthPx?.(weightKg, fish.mutation) || p.aquariumFishWidthPx?.(weightKg) || 64) + 28)
            : buildFishThumbHTML(fish);

        el.classList.remove('hidden');
        el.innerHTML = `<div class="pp-fish-info-inner">
            <div class="pp-fish-info-visual">${visual}</div>
            <div class="pp-fish-info-text">
                <strong class="rarity-text ${escapeHtml(fish.class || '')}">${escapeHtml(fish.name || 'Poisson')}</strong>
                <span>${escapeHtml(rarity)}${escapeHtml(pNote)} · ${p.formatFishWeight ? p.formatFishWeight(weightKg) : weightKg + ' kg'}</span>
                <span>Mutation : ${escapeHtml(mut.name)} · ${formatMoney(fish.value)}</span>
            </div>
        </div>`;
    }

    function bindPublicFishClicks(layerEl, fishes) {
        if (!layerEl) return;
        layerEl.querySelectorAll('.aq-fish').forEach((node, index) => {
            node.style.cursor = 'pointer';
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                showFishInfo(fishes[index]);
            });
        });
    }

    function renderAquariumView() {
        const p = currentProfile;
        if (!p) return;

        const preview = window.StepFishAquariumPreview;
        if (!preview?.renderAquariumFishLayer) {
            setStatus('Aquarium indisponible — recharge la page.', true);
            return;
        }

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
        const container = document.getElementById('pp-aquarium-container');
        const layer = document.getElementById('pp-fish-layer');
        const lock = document.getElementById('pp-aq-lock-screen');
        const empty = document.getElementById('pp-aq-empty');

        if (title) title.textContent = cfg?.name || 'Aquarium';
        if (slots) {
            slots.textContent = isUnlocked
                ? `Slots: ${fishes.length}/${AQ_SLOTS}`
                : '🔒 Verrouillé';
        }
        if (container && cfg) {
            container.style.backgroundImage = `url('${cfg.bg}')`;
        }
        if (lock) lock.classList.toggle('hidden', isUnlocked);
        if (empty) empty.classList.toggle('hidden', !isUnlocked || fishes.length > 0);

        stopAquariumAnim();
        hideFishInfo();

        if (!layer) return;
        layer.innerHTML = '';

        if (!isUnlocked) return;

        preview.renderAquariumFishLayer(layer, fishes);
        bindPublicFishClicks(layer, fishes);
        preview.startAquariumFishAnimation(layer);
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
        document.getElementById('pp-aquarium-viewport')?.addEventListener('click', (e) => {
            if (e.target.closest('.aq-fish')) return;
            hideFishInfo();
        });
    }

    function init() {
        bindClicks();
        bindUI();
    }

    window.StepFishPublicProfile = { init, open, close: closeModal };
})();
