/**
 * StepFishing — Boutique cosmétiques (styles de pseudo)
 */
(function () {
    const COSMETIC_CATALOG = [
        { id: 'default', name: 'Classique', desc: 'Style par défaut', price: 0 },
        { id: 'ember', name: 'Flammes rouges', desc: 'Rouge ardent avec effet flammes', price: 10000 },
        { id: 'ocean', name: 'Bleu océan', desc: 'Bleu profond ondulant', price: 35000 },
        { id: 'violet', name: 'Violet royal', desc: 'Violet lumineux', price: 80000 },
        { id: 'shadow', name: 'Ombre noire', desc: 'Noir avec lueur violette', price: 200000 },
        { id: 'astral', name: 'Astral', desc: 'Violet & noir clignotant', price: 500000 },
        { id: 'neon', name: 'Néon cyan', desc: 'Cyan électrique pulsant', price: 1000000 },
        { id: 'gold', name: 'Or divin', desc: 'Or brillant animé', price: 1500000 },
        { id: 'cosmic', name: 'Cosmique', desc: 'Arc-en-ciel cosmique ultime', price: 2000000 }
    ];

    const catalogById = Object.fromEntries(COSMETIC_CATALOG.map(c => [c.id, c]));

    function getState() {
        return typeof window.__stepfishGetState === 'function' ? window.__stepfishGetState() : null;
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
        return `<span class="${getCosmeticClass(cid)}">${escapeHtml(pseudo)}</span>`;
    }

    function applyToElement(el, pseudo, cosmeticId) {
        if (!el) return;
        el.innerHTML = renderPseudoHTML(pseudo, cosmeticId);
    }

    function refreshPseudoDisplays() {
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
        if (typeof persistGame === 'function') persistGame();
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

            return `<article class="cos-card">
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
