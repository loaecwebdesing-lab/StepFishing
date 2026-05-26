/**
 * StepFishing — Échanges de poissons entre joueurs (Supabase)
 */
(function () {
    const G = () => window.StepFishGameTrade;
    let channel = null;
    let trades = [];
    let activeTab = 'incoming';
    let pendingAcceptTradeId = null;
    let selectedOfferUid = null;
    let selectedOfferAqId = 'aq0';

    function getClient() {
        return window.StepFishAuth?.getSupabaseClient?.() || null;
    }

    function canUse() {
        return Boolean(window.StepFishAuth?.isConfigured?.() && getClient());
    }

    function isLoggedIn() {
        return window.StepFishAuth?.isLoggedIn?.();
    }

    function getUserId() {
        return window.StepFishAuth?.getUserId?.();
    }

    function escapeHtml(str) {
        return window.StepFishCosmetics?.escapeHtml
            ? window.StepFishCosmetics.escapeHtml(str)
            : String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    }

    function setStatus(text, isError) {
        const el = document.getElementById('trade-status');
        if (!el) return;
        el.textContent = text || '';
        el.className = 'trade-status' + (isError ? ' trade-status-error' : text ? ' trade-status-ok' : '');
    }

    function fishCardHTML(fish, compact) {
        const game = G();
        if (!fish || !game) return '';
        const w = game.getFishWeightKg(fish);
        const visual = game.buildFishVisualHTML(fish, compact ? 56 : 72);
        const mut = game.getMutationData(fish.mutation);
        return `<div class="trade-fish-card ${fish.class || ''}">
            <div class="trade-fish-visual">${visual}</div>
            <div class="trade-fish-meta">
                <strong class="trade-fish-name">${escapeHtml(fish.name)}</strong>
                <span>${escapeHtml(mut.name)} · ${escapeHtml(game.formatFishWeight(w))}</span>
                <span class="trade-fish-value">${Number(fish.value || 0).toFixed(2)} $</span>
            </div>
        </div>`;
    }

    function statusLabel(status) {
        const map = {
            pending: 'En attente',
            accepted: 'Accepté',
            declined: 'Refusé',
            cancelled: 'Annulé'
        };
        return map[status] || status;
    }

    function renderTradeList() {
        const listEl = document.getElementById('trade-list');
        if (!listEl) return;
        const uid = getUserId();
        if (!uid) {
            listEl.innerHTML = '<p class="trade-empty">Connecte-toi pour voir les échanges.</p>';
            return;
        }

        const filtered = trades.filter(t => {
            if (activeTab === 'incoming') return t.to_user_id === uid && t.status === 'pending';
            if (activeTab === 'outgoing') return t.from_user_id === uid && t.status === 'pending';
            return t.status !== 'pending' && (t.from_user_id === uid || t.to_user_id === uid);
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (!filtered.length) {
            listEl.innerHTML = '<p class="trade-empty">Aucun échange dans cette catégorie.</p>';
            return;
        }

        listEl.innerHTML = filtered.map(t => {
            const mine = t.from_user_id === uid;
            const partner = mine ? t.to_pseudo : t.from_pseudo;
            const offered = t.offered_fish || {};
            const counter = t.counter_fish;
            const isPending = t.status === 'pending';
            const canAccept = !mine && isPending && t.to_user_id === uid;
            const canCancel = mine && isPending;
            const canDecline = !mine && isPending && t.to_user_id === uid;

            let actions = '';
            if (canAccept) {
                actions += `<button type="button" class="btn-primary trade-btn-accept" data-id="${t.id}">Accepter (choisir mon poisson)</button>`;
            }
            if (canDecline) {
                actions += `<button type="button" class="btn-secondary trade-btn-decline" data-id="${t.id}">Refuser</button>`;
            }
            if (canCancel) {
                actions += `<button type="button" class="btn-secondary trade-btn-cancel" data-id="${t.id}">Annuler</button>`;
            }

            const counterBlock = counter
                ? `<div class="trade-arrow">⇄</div>${fishCardHTML(counter, true)}`
                : (isPending && canAccept ? '<p class="trade-await">Choisis ton poisson contre celui-ci</p>' : '');

            return `<article class="trade-item trade-status-${t.status}" data-id="${t.id}">
                <header class="trade-item-head">
                    <span class="trade-partner">${mine ? 'Vers' : 'De'} <strong>${escapeHtml(partner)}</strong></span>
                    <span class="trade-badge">${statusLabel(t.status)}</span>
                </header>
                ${t.message ? `<p class="trade-msg">« ${escapeHtml(t.message)} »</p>` : ''}
                <div class="trade-fish-row">
                    ${fishCardHTML(offered, true)}
                    ${counterBlock}
                </div>
                <footer class="trade-item-actions">${actions}</footer>
            </article>`;
        }).join('');

        listEl.querySelectorAll('.trade-btn-accept').forEach(btn => {
            btn.addEventListener('click', () => openAcceptPanel(btn.dataset.id));
        });
        listEl.querySelectorAll('.trade-btn-decline').forEach(btn => {
            btn.addEventListener('click', () => declineTrade(btn.dataset.id));
        });
        listEl.querySelectorAll('.trade-btn-cancel').forEach(btn => {
            btn.addEventListener('click', () => cancelTrade(btn.dataset.id));
        });
    }

    function renderOfferFishPicker() {
        const picker = document.getElementById('trade-offer-picker');
        if (!picker) return;
        const game = G();
        if (!game) return;
        const list = game.listTradeableFish();
        if (!list.length) {
            picker.innerHTML = '<p class="trade-empty">Aucun poisson échangeable (déverrouille ou retire le cadenas).</p>';
            return;
        }
        picker.innerHTML = list.map(({ fish, aqId }) => {
            const sel = fish.uid === selectedOfferUid;
            return `<button type="button" class="trade-pick-fish${sel ? ' selected' : ''}" data-uid="${fish.uid}" data-aq="${aqId}">
                ${fishCardHTML(fish, true)}
            </button>`;
        }).join('');
        picker.querySelectorAll('.trade-pick-fish').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedOfferUid = btn.dataset.uid;
                selectedOfferAqId = btn.dataset.aq || 'aq0';
                renderOfferFishPicker();
            });
        });
    }

    function renderAcceptFishPicker() {
        const picker = document.getElementById('trade-accept-picker');
        const panel = document.getElementById('trade-accept-panel');
        if (!picker || !panel) return;
        const game = G();
        if (!pendingAcceptTradeId || !game) {
            panel.classList.add('hidden');
            return;
        }
        panel.classList.remove('hidden');
        const trade = trades.find(t => t.id === pendingAcceptTradeId);
        const list = game.listTradeableFish();
        if (!trade) {
            panel.classList.add('hidden');
            return;
        }
        document.getElementById('trade-accept-title').textContent =
            `Échanger avec ${trade.from_pseudo}`;
        document.getElementById('trade-accept-offered').innerHTML = fishCardHTML(trade.offered_fish, false);

        if (!list.length) {
            picker.innerHTML = '<p class="trade-empty">Aucun poisson disponible pour contrepartie.</p>';
            return;
        }
        let selectedCounter = null;
        picker.innerHTML = list.map(({ fish, aqId }) =>
            `<button type="button" class="trade-pick-fish trade-pick-counter" data-uid="${fish.uid}" data-aq="${aqId}">
                ${fishCardHTML(fish, true)}
            </button>`
        ).join('');
        picker.querySelectorAll('.trade-pick-counter').forEach(btn => {
            btn.addEventListener('click', () => {
                picker.querySelectorAll('.trade-pick-counter').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedCounter = { uid: btn.dataset.uid, aqId: btn.dataset.aq };
                document.getElementById('btn-trade-confirm-accept').dataset.uid = selectedCounter.uid;
                document.getElementById('btn-trade-confirm-accept').dataset.aq = selectedCounter.aqId;
            });
        });
    }

    function switchTab(tabId) {
        activeTab = tabId;
        document.querySelectorAll('.trade-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        renderTradeList();
    }

    async function loadTrades() {
        const client = getClient();
        const uid = getUserId();
        if (!client || !uid) return;
        const { data, error } = await client
            .from('fish_trades')
            .select('*')
            .or(`from_user_id.eq.${uid},to_user_id.eq.${uid}`)
            .order('created_at', { ascending: false })
            .limit(40);
        if (error) {
            console.warn('Trades load:', error);
            const hint = (error.message || '').includes('fish_trades')
                ? 'Exécute tout le fichier supabase-fish-trades.sql dans Supabase (SQL Editor), pas seulement la ligne Realtime.'
                : error.message;
            setStatus(hint, true);
            return;
        }
        trades = data || [];
        renderTradeList();
        renderAcceptFishPicker();
    }

    async function reloadCloudInventory() {
        const userId = getUserId();
        const game = G();
        if (!userId || !game || !window.StepFishAuth?.fetchCloudSave) return;
        try {
            const row = await window.StepFishAuth.fetchCloudSave(userId);
            if (row?.save_data) {
                game.applySaveData(row.save_data);
                game.refreshInventoryAfterCloudSync();
            }
        } catch (e) {
            console.warn('Reload save after trade', e);
        }
    }

    async function createOffer() {
        if (!isLoggedIn()) {
            setStatus('Connecte-toi pour proposer un échange.', true);
            return;
        }
        const pseudoInput = document.getElementById('trade-target-pseudo');
        const msgInput = document.getElementById('trade-offer-message');
        const target = pseudoInput?.value?.trim();
        if (!target) {
            setStatus('Indique le pseudo du joueur.', true);
            return;
        }
        if (!selectedOfferUid) {
            setStatus('Sélectionne un poisson à offrir.', true);
            return;
        }
        if (target.toLowerCase() === (window.StepFishAuth.getPseudo() || '').toLowerCase()) {
            setStatus('Tu ne peux pas échanger avec toi-même.', true);
            return;
        }

        setStatus('Envoi de l\'offre…');
        const client = getClient();
        const { data, error } = await client.rpc('create_fish_trade', {
            p_to_pseudo: target,
            p_offered_fish_uid: selectedOfferUid,
            p_offered_aq_id: selectedOfferAqId,
            p_message: msgInput?.value?.trim() || null
        });
        if (error) {
            setStatus(error.message || 'Impossible de créer l\'offre.', true);
            return;
        }
        setStatus('Offre envoyée !');
        if (msgInput) msgInput.value = '';
        if (pseudoInput) pseudoInput.value = '';
        selectedOfferUid = null;
        renderOfferFishPicker();
        await loadTrades();
        switchTab('outgoing');
        G()?.addLog?.(`📤 Offre d'échange envoyée à ${target}.`, 'epic');
        if (window.StepFishChat?.sendMessage) {
            await window.StepFishChat.sendMessage(`📤 J'ai proposé un échange de poisson à ${target} !`);
        }
    }

    function openAcceptPanel(tradeId) {
        pendingAcceptTradeId = tradeId;
        renderAcceptFishPicker();
        document.getElementById('trade-accept-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function closeAcceptPanel() {
        pendingAcceptTradeId = null;
        document.getElementById('trade-accept-panel')?.classList.add('hidden');
    }

    async function acceptTrade() {
        const btn = document.getElementById('btn-trade-confirm-accept');
        const uid = btn?.dataset?.uid;
        const aqId = btn?.dataset?.aq || 'aq0';
        if (!pendingAcceptTradeId || !uid) {
            setStatus('Choisis ton poisson pour finaliser l\'échange.', true);
            return;
        }
        setStatus('Échange en cours…');
        const client = getClient();
        const { error } = await client.rpc('accept_fish_trade', {
            p_trade_id: pendingAcceptTradeId,
            p_counter_fish_uid: uid,
            p_counter_aq_id: aqId
        });
        if (error) {
            setStatus(error.message || 'Échange refusé par le serveur.', true);
            return;
        }
        setStatus('Échange réussi !');
        closeAcceptPanel();
        await reloadCloudInventory();
        await loadTrades();
        G()?.addLog?.('✅ Échange de poissons terminé !', 'epic');
    }

    async function declineTrade(tradeId) {
        const client = getClient();
        const { error } = await client.rpc('decline_fish_trade', { p_trade_id: tradeId });
        if (error) {
            setStatus(error.message, true);
            return;
        }
        setStatus('Offre refusée.');
        await loadTrades();
    }

    async function cancelTrade(tradeId) {
        const client = getClient();
        const { error } = await client.rpc('cancel_fish_trade', { p_trade_id: tradeId });
        if (error) {
            setStatus(error.message, true);
            return;
        }
        setStatus('Offre annulée.');
        await loadTrades();
    }

    function subscribeRealtime() {
        const client = getClient();
        const uid = getUserId();
        if (!client || !uid || channel) return;

        channel = client
            .channel('stepfish-trades-' + uid)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'fish_trades'
            }, (payload) => {
                const row = payload.new || payload.old;
                if (!row) return;
                if (row.from_user_id !== uid && row.to_user_id !== uid) return;
                loadTrades();
                if (payload.eventType === 'INSERT' && row.to_user_id === uid && row.status === 'pending') {
                    G()?.addLog?.(`📥 Nouvelle offre d'échange de ${row.from_pseudo} !`, 'epic');
                    setStatus(`Nouvelle offre de ${row.from_pseudo}`);
                }
                if (payload.eventType === 'UPDATE' && row.status === 'accepted') {
                    if (row.from_user_id === uid || row.to_user_id === uid) {
                        reloadCloudInventory();
                    }
                }
            })
            .subscribe();
    }

    function bindUI() {
        document.querySelectorAll('.trade-tab').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
        document.getElementById('btn-trade-send-offer')?.addEventListener('click', createOffer);
        document.getElementById('btn-trade-confirm-accept')?.addEventListener('click', acceptTrade);
        document.getElementById('btn-trade-cancel-accept')?.addEventListener('click', closeAcceptPanel);
        document.getElementById('btn-trade-refresh')?.addEventListener('click', () => {
            setStatus('Actualisation…');
            loadTrades().then(() => setStatus(''));
        });
    }

    function refreshAuthState() {
        const needsLogin = !isLoggedIn();
        document.getElementById('trade-guest-block')?.classList.toggle('hidden', !needsLogin);
        document.getElementById('trade-main-content')?.classList.toggle('hidden', needsLogin);
        if (needsLogin) {
            setStatus('Compte en ligne requis pour les échanges.');
        }
    }

    async function open() {
        const game = G();
        if (game?.showScreen) game.showScreen('trades');
        else document.getElementById('screen-trades')?.classList.add('active');
        refreshAuthState();
        if (!isLoggedIn()) return;
        renderOfferFishPicker();
        await loadTrades();
        subscribeRealtime();
    }

    function openWithFish(uid, aqId) {
        selectedOfferUid = uid;
        selectedOfferAqId = aqId || 'aq0';
        open().then(() => {
            renderOfferFishPicker();
            document.getElementById('trade-create-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    async function start() {
        bindUI();
        refreshAuthState();
        if (!canUse()) return;
        if (isLoggedIn()) {
            await loadTrades();
            subscribeRealtime();
        }
    }

    window.StepFishTrade = {
        start,
        open,
        openWithFish,
        refreshAuthState,
        loadTrades
    };
})();
