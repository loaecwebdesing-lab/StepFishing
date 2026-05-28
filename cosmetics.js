/**
 * StepFishing — Boutique cosmétiques (styles de pseudo)
 */
(function () {
    const COSMETIC_CATALOG = [
        { id: 'default', name: 'Classique', desc: 'Simple et sobre', price: 0, tier: '' },
        { id: 'ember', name: 'Flammes rouges', desc: 'Braises qui montent · texte qui tremble', price: 10000, tier: '' },
        { id: 'ocean', name: 'Bleu océan', desc: 'Bulles · soulignement ondulé', price: 35000, tier: '' },
        { id: 'violet', name: 'Violet royal', desc: 'Italique · losanges scintillants', price: 80000, tier: '' },
        { id: 'shadow', name: 'Ombre noire', desc: 'Fumée latérale · glitch violet', price: 200000, tier: '' },
        { id: 'astral', name: 'Astral', desc: 'Clignotement violet/noir · étoiles', price: 500000, tier: 'Rare' },
        { id: 'neon', name: 'Néon cyan', desc: 'Stroboscope · éclairs carrés', price: 1000000, tier: 'Épique' },
        { id: 'gold', name: 'Or divin', desc: 'Relief métal · poussière qui tombe', price: 1500000, tier: 'Épique' },
        { id: 'cosmic', name: 'Cosmique', desc: 'Arc-en-ciel horizontal · pastilles', price: 2000000, tier: 'Légendaire' },
        { id: 'phoenix', name: 'Phénix', desc: 'Texte incliné · étincelles qui explosent', price: 3500000, tier: 'Légendaire' },
        { id: 'abyss', name: 'Abysse', desc: 'Bleu abyssal · particules aspirées', price: 5000000, tier: 'Mythique' },
        { id: 'diamond', name: 'Diamant', desc: 'Glace · cristaux en facettes', price: 7500000, tier: 'Mythique' },
        { id: 'solar', name: 'Solaire', desc: 'Rayons de soleil · pulsation dorée', price: 10000000, tier: 'Divin' },
        { id: 'deity', name: 'Divinité', desc: 'Halo rose-or · orbite lente', price: 15000000, tier: 'Divin' },
        { id: 'infinity', name: 'Infini', desc: 'Dégradé vertical · orbites multicolores', price: 20000000, tier: 'Ultime' }
    ];

    const catalogById = Object.fromEntries(COSMETIC_CATALOG.map(c => [c.id, c]));

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

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function normalizeOwned(list) {
        const owned = Array.isArray(list) ? [...list] : ['default'];
        if (!owned.includes('default')) owned.unshift('default');
        return owned;
    }

    function loadFromSave(data) {
        const s = getState();
        if (!s) return;
        s.ownedCosmetics = normalizeOwned(data?.ownedCosmetics);
        s.equippedCosmetic = catalogById[data?.equippedCosmetic] ? data.equippedCosmetic : 'default';
        if (!s.ownedCosmetics.includes(s.equippedCosmetic)) {
            s.equippedCosmetic = 'default';
        }
        refreshPseudoDisplays();
    }

    function getEquippedId() {
        const s = getState();
        return s?.equippedCosmetic || 'default';
    }

    function getCosmeticClass(id) {
        const cid = catalogById[id] ? id : 'default';
        return 'cos-pseudo cos-pseudo-' + cid;
    }

    function renderPseudoHTML(pseudo, cosmeticId) {
        const cid = catalogById[cosmeticId] ? cosmeticId : 'default';
        const particles = cid !== 'default'
            ? `<span class="cos-particles cos-particles-${cid}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>`
            : '';
        return `<span class="${getCosmeticClass(cid)} cos-pseudo-wrap">${particles}<span class="cos-pseudo-text">${escapeHtml(pseudo)}</span></span>`;
    }

    function applyToElement(el, pseudo, cosmeticId) {
        if (!el) return;
        el.innerHTML = renderPseudoHTML(pseudo, cosmeticId);
    }

    function refreshPseudoDisplays() {
        if (window.StepFishAchievements?.refreshPseudoDisplays) {
            window.StepFishAchievements.refreshPseudoDisplays();
            return;
        }
        const pseudo = window.StepFishAuth?.getPseudo?.() || 'Pêcheur';
        const cid = getEquippedId();
        applyToElement(document.getElementById('user-pseudo'), pseudo, cid);
        const prof = document.getElementById('prof-pseudo-display');
        if (prof) applyToElement(prof, pseudo, cid);
    }

    function formatPrice(n) {
        return Number(n).toLocaleString('fr-FR') + ' $';
    }

    function buy(cosmeticId) {
        const s = getState();
        const item = catalogById[cosmeticId];
        if (!s || !item) return { ok: false, msg: 'Style introuvable.' };
        if (!window.StepFishAuth?.isLoggedIn?.()) {
            return { ok: false, msg: 'Connecte-toi pour acheter des cosmétiques.' };
        }
        s.ownedCosmetics = normalizeOwned(s.ownedCosmetics);
        if (s.ownedCosmetics.includes(cosmeticId)) {
            return { ok: false, msg: 'Tu possèdes déjà ce style.' };
        }
        if (s.money < item.price) {
            return { ok: false, msg: `Il te manque ${formatPrice(item.price - s.money)}.` };
        }
        s.money -= item.price;
        s.ownedCosmetics.push(cosmeticId);
        if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
        persistGameState();
        return { ok: true, msg: `${item.name} acheté !` };
    }

    function equip(cosmeticId) {
        const s = getState();
        if (!s || !catalogById[cosmeticId]) return { ok: false, msg: 'Style introuvable.' };
        s.ownedCosmetics = normalizeOwned(s.ownedCosmetics);
        if (!s.ownedCosmetics.includes(cosmeticId)) {
            return { ok: false, msg: 'Achète ce style d\'abord.' };
        }
        s.equippedCosmetic = cosmeticId;
        if (typeof persistGame === 'function') persistGame();
        refreshPseudoDisplays();
        return { ok: true, msg: `${catalogById[cosmeticId].name} équipé !` };
    }

    function renderShop() {
        const grid = document.getElementById('cosmetics-grid');
        const status = document.getElementById('cosmetics-status');
        if (!grid) return;

        const s = getState();
        const owned = normalizeOwned(s?.ownedCosmetics);
        const equipped = getEquippedId();
        const loggedIn = window.StepFishAuth?.isLoggedIn?.();

        grid.innerHTML = COSMETIC_CATALOG.map(item => {
            const has = owned.includes(item.id);
            const isEquipped = equipped === item.id;
            let action = '';
            if (item.price === 0) {
                action = isEquipped
                    ? '<span class="cos-card-tag equipped">Équipé</span>'
                    : `<button type="button" class="cos-card-btn" data-equip="${item.id}">Équiper</button>`;
            } else if (!loggedIn) {
                action = '<span class="cos-card-tag locked">Compte requis</span>';
            } else if (has) {
                action = isEquipped
                    ? '<span class="cos-card-tag equipped">Équipé</span>'
                    : `<button type="button" class="cos-card-btn" data-equip="${item.id}">Équiper</button>`;
            } else {
                action = `<button type="button" class="cos-card-btn buy" data-buy="${item.id}">${formatPrice(item.price)}</button>`;
            }

            const tierBadge = item.tier
                ? `<span class="cos-tier cos-tier-${item.tier.toLowerCase().replace('é', 'e')}">${item.tier}</span>`
                : '';

            return `<article class="cos-card${item.price >= 2000000 ? ' cos-card-premium' : ''}">
                ${tierBadge}
                <div class="cos-preview">${renderPseudoHTML('Aperçu', item.id)}</div>
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.desc)}</p>
                ${action}
            </article>`;
        }).join('');

        grid.querySelectorAll('[data-buy]').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = buy(btn.dataset.buy);
                if (status) {
                    status.textContent = r.msg;
                    status.className = 'cosmetics-status' + (r.ok ? ' ok' : ' err');
                }
                if (r.ok) renderShop();
            });
        });

        grid.querySelectorAll('[data-equip]').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = equip(btn.dataset.equip);
                if (status) {
                    status.textContent = r.msg;
                    status.className = 'cosmetics-status' + (r.ok ? ' ok' : ' err');
                }
                if (r.ok) renderShop();
            });
        });
    }

    function open() {
        if (typeof showScreen === 'function') showScreen('cosmetics');
        renderShop();
    }

    function init() {
        const s = getState();
        if (s && !s.ownedCosmetics) {
            s.ownedCosmetics = ['default'];
            s.equippedCosmetic = 'default';
        }
    }

    window.StepFishCosmetics = {
        catalog: COSMETIC_CATALOG,
        registerStateBridge,
        init,
        loadFromSave,
        open,
        renderShop,
        buy,
        equip,
        getEquippedId,
        renderPseudoHTML,
        applyToElement,
        refreshPseudoDisplays,
        escapeHtml
    };
})();
