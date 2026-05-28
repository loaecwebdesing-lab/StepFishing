/**
 * StepFishing — Boutique cosmétiques (styles + ornements pseudo, cumulables)
 */
(function () {
    const FREE_STYLE_IDS = ['default'];
    const FREE_ORNAMENT_IDS = ['ornement1'];

    const ORNAMENT_CATALOG = [
        {
            id: 'ornement1',
            name: 'Ornement I',
            desc: 'Cadre décoratif · s\'étire avec la longueur du pseudo',
            price: 0,
            tier: '',
            img: 'assets/ornements/Ornement1.png'
        }
    ];

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

    const styleById = Object.fromEntries(COSMETIC_CATALOG.map(c => [c.id, c]));
    const ornamentById = Object.fromEntries(ORNAMENT_CATALOG.map(o => [o.id, o]));
    const catalogById = { ...styleById, ...ornamentById };

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

    function isOrnamentId(id) {
        return Boolean(id && ornamentById[id]);
    }

    function isStyleId(id) {
        return Boolean(id && styleById[id]);
    }

    function normalizeOwnedStyles(list) {
        const owned = Array.isArray(list) ? [...list] : [];
        FREE_STYLE_IDS.forEach(id => {
            if (!owned.includes(id)) owned.push(id);
        });
        return owned.filter(id => isStyleId(id));
    }

    function normalizeOwnedOrnaments(list) {
        const owned = Array.isArray(list) ? [...list] : [];
        FREE_ORNAMENT_IDS.forEach(id => {
            if (!owned.includes(id)) owned.push(id);
        });
        return owned.filter(id => isOrnamentId(id));
    }

    function migrateLegacyOrnamentEquip(s) {
        if (isOrnamentId(s.equippedCosmetic)) {
            if (!s.equippedOrnament) s.equippedOrnament = s.equippedCosmetic;
            s.equippedCosmetic = 'default';
        }
        if (Array.isArray(s.ownedCosmetics)) {
            s.ownedCosmetics = s.ownedCosmetics.filter(id => !isOrnamentId(id));
        }
    }

    function loadFromSave(data) {
        const s = getState();
        if (!s) return;
        s.ownedCosmetics = normalizeOwnedStyles(data?.ownedCosmetics);
        s.ownedOrnaments = normalizeOwnedOrnaments(data?.ownedOrnaments);
        s.equippedCosmetic = isStyleId(data?.equippedCosmetic) ? data.equippedCosmetic : 'default';
        s.equippedOrnament = isOrnamentId(data?.equippedOrnament) ? data.equippedOrnament : null;
        migrateLegacyOrnamentEquip(s);
        if (!s.ownedCosmetics.includes(s.equippedCosmetic)) {
            s.equippedCosmetic = 'default';
        }
        if (s.equippedOrnament && !s.ownedOrnaments.includes(s.equippedOrnament)) {
            s.equippedOrnament = null;
        }
        refreshPseudoDisplays();
    }

    function getEquippedStyleId() {
        const s = getState();
        const id = s?.equippedCosmetic || 'default';
        return isStyleId(id) ? id : 'default';
    }

    function getEquippedOrnamentId() {
        const s = getState();
        const id = s?.equippedOrnament || null;
        return isOrnamentId(id) ? id : null;
    }

    /** @deprecated Utiliser getEquippedStyleId */
    function getEquippedId() {
        return getEquippedStyleId();
    }

    function getCosmeticClass(id) {
        const cid = isStyleId(id) ? id : 'default';
        return 'cos-pseudo cos-pseudo-' + cid;
    }

    function renderStyleInnerHTML(pseudo, cosmeticId) {
        const styleId = isStyleId(cosmeticId) ? cosmeticId : 'default';
        const particles = styleId !== 'default'
            ? `<span class="cos-particles cos-particles-${styleId}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>`
            : '';
        return `<span class="${getCosmeticClass(styleId)} cos-pseudo-wrap">${particles}<span class="cos-pseudo-text">${escapeHtml(pseudo)}</span></span>`;
    }

    function wrapWithOrnament(innerHtml, ornamentId, variant) {
        const orn = ornamentById[ornamentId];
        if (!orn || !innerHtml) return innerHtml;
        const stackClass = variant === 'stack' ? ' cos-pseudo-ornament-inner--stack' : '';
        return `<span class="cos-pseudo-ornament-wrap cos-pseudo-ornament-${escapeHtml(orn.id)}" data-ornament="1">
            <img src="${escapeHtml(orn.img)}" class="cos-ornament-frame" alt="" aria-hidden="true">
            <span class="cos-pseudo-ornament-inner${stackClass}">${innerHtml}</span>
        </span>`;
    }

    function renderPseudoHTML(pseudo, cosmeticId, ornamentId) {
        const styleId = isStyleId(cosmeticId) ? cosmeticId : getEquippedStyleId();
        const ornId = ornamentId !== undefined ? ornamentId : getEquippedOrnamentId();
        const inner = renderStyleInnerHTML(pseudo, styleId);
        return wrapWithOrnament(inner, ornId) || inner;
    }

    function applyToElement(el, pseudo, cosmeticId, ornamentId) {
        if (!el) return;
        el.innerHTML = renderPseudoHTML(pseudo, cosmeticId, ornamentId);
    }

    function refreshPseudoDisplays() {
        if (window.StepFishAchievements?.refreshPseudoDisplays) {
            window.StepFishAchievements.refreshPseudoDisplays();
            return;
        }
        const pseudo = window.StepFishAuth?.getPseudo?.() || 'Pêcheur';
        applyToElement(
            document.getElementById('user-pseudo'),
            pseudo,
            getEquippedStyleId(),
            getEquippedOrnamentId()
        );
        const prof = document.getElementById('prof-pseudo-display');
        if (prof) applyToElement(prof, pseudo, getEquippedStyleId(), getEquippedOrnamentId());
    }

    function formatPrice(n) {
        return Number(n).toLocaleString('fr-FR') + ' $';
    }

    function buyStyle(cosmeticId) {
        const s = getState();
        const item = styleById[cosmeticId];
        if (!s || !item) return { ok: false, msg: 'Style introuvable.' };
        if (!window.StepFishAuth?.isLoggedIn?.()) {
            return { ok: false, msg: 'Connecte-toi pour acheter des cosmétiques.' };
        }
        s.ownedCosmetics = normalizeOwnedStyles(s.ownedCosmetics);
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

    function buyOrnament(ornamentId) {
        const s = getState();
        const item = ornamentById[ornamentId];
        if (!s || !item) return { ok: false, msg: 'Ornement introuvable.' };
        if (!window.StepFishAuth?.isLoggedIn?.()) {
            return { ok: false, msg: 'Connecte-toi pour acheter des ornements.' };
        }
        s.ownedOrnaments = normalizeOwnedOrnaments(s.ownedOrnaments);
        if (s.ownedOrnaments.includes(ornamentId)) {
            return { ok: false, msg: 'Tu possèdes déjà cet ornement.' };
        }
        if (s.money < item.price) {
            return { ok: false, msg: `Il te manque ${formatPrice(item.price - s.money)}.` };
        }
        s.money -= item.price;
        s.ownedOrnaments.push(ornamentId);
        if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
        persistGameState();
        return { ok: true, msg: `${item.name} acheté !` };
    }

    function equipStyle(cosmeticId) {
        const s = getState();
        if (!s || !isStyleId(cosmeticId)) return { ok: false, msg: 'Style introuvable.' };
        s.ownedCosmetics = normalizeOwnedStyles(s.ownedCosmetics);
        if (!s.ownedCosmetics.includes(cosmeticId)) {
            return { ok: false, msg: 'Achète ce style d\'abord.' };
        }
        s.equippedCosmetic = cosmeticId;
        persistGameState();
        refreshPseudoDisplays();
        return { ok: true, msg: `${styleById[cosmeticId].name} équipé !` };
    }

    function equipOrnament(ornamentId) {
        const s = getState();
        if (!s || !isOrnamentId(ornamentId)) return { ok: false, msg: 'Ornement introuvable.' };
        s.ownedOrnaments = normalizeOwnedOrnaments(s.ownedOrnaments);
        if (!s.ownedOrnaments.includes(ornamentId)) {
            return { ok: false, msg: 'Achète cet ornement d\'abord.' };
        }
        const wasEquipped = s.equippedOrnament === ornamentId;
        s.equippedOrnament = wasEquipped ? null : ornamentId;
        persistGameState();
        refreshPseudoDisplays();
        return {
            ok: true,
            msg: wasEquipped ? `${ornamentById[ornamentId].name} retiré.` : `${ornamentById[ornamentId].name} équipé !`
        };
    }

    function renderCardHtml(item, kind, owned, equippedStyle, equippedOrnament, loggedIn) {
        const has = owned.includes(item.id);
        const isStyle = kind === 'style';
        const isEquipped = isStyle
            ? equippedStyle === item.id
            : equippedOrnament === item.id;
        let action = '';
        if (item.price === 0) {
            if (isStyle) {
                action = isEquipped
                    ? '<span class="cos-card-tag equipped">Style équipé</span>'
                    : `<button type="button" class="cos-card-btn" data-equip-style="${item.id}">Équiper style</button>`;
            } else {
                action = isEquipped
                    ? `<button type="button" class="cos-card-btn equipped" data-equip-ornament="${item.id}">Retirer ornement</button>`
                    : `<button type="button" class="cos-card-btn" data-equip-ornament="${item.id}">Équiper ornement</button>`;
            }
        } else if (!loggedIn) {
            action = '<span class="cos-card-tag locked">Compte requis</span>';
        } else if (has) {
            if (isStyle) {
                action = isEquipped
                    ? '<span class="cos-card-tag equipped">Style équipé</span>'
                    : `<button type="button" class="cos-card-btn" data-equip-style="${item.id}">Équiper style</button>`;
            } else {
                action = isEquipped
                    ? `<button type="button" class="cos-card-btn equipped" data-equip-ornament="${item.id}">Retirer ornement</button>`
                    : `<button type="button" class="cos-card-btn" data-equip-ornament="${item.id}">Équiper ornement</button>`;
            }
        } else {
            const buyAttr = isStyle ? 'data-buy-style' : 'data-buy-ornament';
            action = `<button type="button" class="cos-card-btn buy" ${buyAttr}="${item.id}">${formatPrice(item.price)}</button>`;
        }

        const tierBadge = item.tier
            ? `<span class="cos-tier cos-tier-${item.tier.toLowerCase().replace('é', 'e')}">${item.tier}</span>`
            : '';

        const previewStyle = isStyle ? item.id : equippedStyle;
        const previewOrnament = isStyle ? equippedOrnament : item.id;

        return `<article class="cos-card${item.price >= 2000000 ? ' cos-card-premium' : ''}${!isStyle ? ' cos-card-ornament' : ''}">
            ${tierBadge}
            <div class="cos-preview">${renderPseudoHTML('Aperçu', previewStyle, previewOrnament)}</div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.desc)}</p>
            ${action}
        </article>`;
    }

    function bindShopButtons(root, status) {
        if (!root) return;
        root.querySelectorAll('[data-buy-style]').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = buyStyle(btn.dataset.buyStyle);
                if (status) {
                    status.textContent = r.msg;
                    status.className = 'cosmetics-status' + (r.ok ? ' ok' : ' err');
                }
                if (r.ok) renderShop();
            });
        });
        root.querySelectorAll('[data-buy-ornament]').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = buyOrnament(btn.dataset.buyOrnament);
                if (status) {
                    status.textContent = r.msg;
                    status.className = 'cosmetics-status' + (r.ok ? ' ok' : ' err');
                }
                if (r.ok) renderShop();
            });
        });
        root.querySelectorAll('[data-equip-style]').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = equipStyle(btn.dataset.equipStyle);
                if (status) {
                    status.textContent = r.msg;
                    status.className = 'cosmetics-status' + (r.ok ? ' ok' : ' err');
                }
                if (r.ok) renderShop();
            });
        });
        root.querySelectorAll('[data-equip-ornament]').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = equipOrnament(btn.dataset.equipOrnament);
                if (status) {
                    status.textContent = r.msg;
                    status.className = 'cosmetics-status' + (r.ok ? ' ok' : ' err');
                }
                if (r.ok) renderShop();
            });
        });
    }

    function renderShop() {
        const grid = document.getElementById('cosmetics-grid');
        const ornGrid = document.getElementById('ornaments-grid');
        const status = document.getElementById('cosmetics-status');
        if (!grid) return;

        const s = getState();
        const ownedStyles = normalizeOwnedStyles(s?.ownedCosmetics);
        const ownedOrnaments = normalizeOwnedOrnaments(s?.ownedOrnaments);
        const equippedStyle = getEquippedStyleId();
        const equippedOrnament = getEquippedOrnamentId();
        const loggedIn = window.StepFishAuth?.isLoggedIn?.();

        grid.innerHTML = COSMETIC_CATALOG.map(item =>
            renderCardHtml(item, 'style', ownedStyles, equippedStyle, equippedOrnament, loggedIn)
        ).join('');

        if (ornGrid) {
            ornGrid.innerHTML = ORNAMENT_CATALOG.map(item =>
                renderCardHtml(item, 'ornament', ownedOrnaments, equippedStyle, equippedOrnament, loggedIn)
            ).join('');
        }

        bindShopButtons(grid, status);
        if (ornGrid) bindShopButtons(ornGrid, status);
    }

    function open() {
        if (typeof showScreen === 'function') showScreen('cosmetics');
        renderShop();
    }

    function init() {
        const s = getState();
        if (!s) return;
        if (!s.ownedCosmetics) s.ownedCosmetics = ['default'];
        if (!s.ownedOrnaments) s.ownedOrnaments = [];
        if (!s.equippedCosmetic) s.equippedCosmetic = 'default';
        if (s.equippedOrnament === undefined) s.equippedOrnament = null;
        migrateLegacyOrnamentEquip(s);
        s.ownedCosmetics = normalizeOwnedStyles(s.ownedCosmetics);
        s.ownedOrnaments = normalizeOwnedOrnaments(s.ownedOrnaments);
    }

    window.StepFishCosmetics = {
        catalog: COSMETIC_CATALOG,
        ornamentCatalog: ORNAMENT_CATALOG,
        registerStateBridge,
        init,
        loadFromSave,
        open,
        renderShop,
        buy: buyStyle,
        buyStyle,
        buyOrnament,
        equip: equipStyle,
        equipStyle,
        equipOrnament,
        getEquippedId,
        getEquippedStyleId,
        getEquippedOrnamentId,
        renderPseudoHTML,
        renderStyleInnerHTML,
        wrapWithOrnament,
        applyToElement,
        refreshPseudoDisplays,
        escapeHtml,
        isOrnamentId,
        isStyleId
    };
})();
