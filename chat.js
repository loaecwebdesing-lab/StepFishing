/**
 * StepFishing — Chat global (sidebar + Supabase Realtime)
 */
(function () {
    const MAX_MESSAGES = 80;
    const COOLDOWN_MS = 2500;
    let channel = null;
    let lastSentAt = 0;
    let messages = [];

    function getClient() {
        return window.StepFishAuth?.getSupabaseClient?.() || null;
    }

    function canUse() {
        return Boolean(window.StepFishAuth?.isConfigured?.() && getClient());
    }

    function escapeHtml(str) {
        return window.StepFishCosmetics?.escapeHtml
            ? window.StepFishCosmetics.escapeHtml(str)
            : String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    }

    function renderPseudo(pseudo, cosmeticId, titleId, colorId, ornamentId) {
        if (window.StepFishAchievements?.renderPlayerPseudoHTML) {
            return window.StepFishAchievements.renderPlayerPseudoHTML(pseudo, cosmeticId, titleId, colorId, ornamentId);
        }
        if (window.StepFishCosmetics?.renderPseudoHTML) {
            return window.StepFishCosmetics.renderPseudoHTML(pseudo, cosmeticId, ornamentId);
        }
        return escapeHtml(pseudo);
    }

    function scrollChatToBottom() {
        const box = document.getElementById('chat-messages');
        if (box) box.scrollTop = box.scrollHeight;
    }

    function renderMessages() {
        const box = document.getElementById('chat-messages');
        if (!box) return;
        if (!messages.length) {
            box.innerHTML = '<div class="chat-msg system">Chat global — dis bonjour !</div>';
            return;
        }
        box.innerHTML = messages.map(m => {
            const time = new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const pseudoBtn = `<button type="button" class="player-pseudo-link chat-pseudo-link" data-player-pseudo="${escapeHtml(m.pseudo)}" title="Voir le profil">${renderPseudo(m.pseudo, m.cosmetic_id, m.achievement_title_id, m.achievement_color_id, m.ornament_id)}</button>`;
            return `<div class="chat-msg">
                <span class="chat-time">${time}</span>
                ${pseudoBtn} :
                <span class="chat-text">${escapeHtml(m.message)}</span>
            </div>`;
        }).join('');
        scrollChatToBottom();
    }

    function switchSidebarPanel(panelId) {
        document.querySelectorAll('.sidebar-feed-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.panel === panelId);
        });
        const logPanel = document.getElementById('sidebar-panel-log');
        const chatPanel = document.getElementById('sidebar-panel-chat');
        if (logPanel) {
            logPanel.classList.toggle('hidden', panelId !== 'log');
            logPanel.classList.toggle('active', panelId === 'log');
        }
        if (chatPanel) {
            chatPanel.classList.toggle('hidden', panelId !== 'chat');
            chatPanel.classList.toggle('active', panelId === 'chat');
        }
        if (panelId === 'chat') scrollChatToBottom();
    }

    function bindSidebarTabs() {
        document.querySelectorAll('.sidebar-feed-tab').forEach(btn => {
            btn.addEventListener('click', () => switchSidebarPanel(btn.dataset.panel));
        });
    }

    async function loadHistory() {
        const client = getClient();
        if (!client) return;
        const { data, error } = await client
            .from('global_chat')
            .select('pseudo, cosmetic_id, ornament_id, achievement_title_id, achievement_color_id, message, created_at')
            .order('created_at', { ascending: true })
            .limit(MAX_MESSAGES);
        if (error) {
            console.warn('Chat history:', error);
            return;
        }
        messages = data || [];
        renderMessages();
    }

    function subscribeRealtime() {
        const client = getClient();
        if (!client || channel) return;

        channel = client
            .channel('stepfish-global-chat')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'global_chat'
            }, (payload) => {
                const row = payload.new;
                if (!row) return;
                messages.push(row);
                if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
                renderMessages();
            })
            .subscribe();
    }

    async function sendMessage(text) {
        if (!window.StepFishAuth?.isLoggedIn?.()) {
            return { ok: false, msg: 'Connecte-toi pour envoyer un message.' };
        }
        const msg = text.trim().slice(0, 200);
        if (!msg) return { ok: false, msg: 'Message vide.' };
        if (Date.now() - lastSentAt < COOLDOWN_MS) {
            return { ok: false, msg: 'Attends un peu avant de renvoyer.' };
        }

        const client = getClient();
        const userId = window.StepFishAuth.getUserId?.();
        if (!client || !userId) return { ok: false, msg: 'Serveur indisponible.' };

        const cosmeticId = window.StepFishCosmetics?.getEquippedStyleId?.()
            || window.StepFishCosmetics?.getEquippedId?.()
            || 'default';
        const ornamentId = window.StepFishCosmetics?.getEquippedOrnamentId?.() || null;
        const achIds = window.StepFishAchievements?.getDisplayIds?.(true) || {};
        const row = {
            user_id: userId,
            pseudo: window.StepFishAuth.getPseudo(),
            cosmetic_id: cosmeticId,
            achievement_title_id: achIds.titleId || null,
            achievement_color_id: achIds.colorId || null,
            message: msg
        };
        if (ornamentId) row.ornament_id = ornamentId;
        const { error } = await client.from('global_chat').insert(row);

        if (error) {
            console.warn('Chat send:', error);
            const hint = (error.message || '').includes('global_chat')
                ? 'Exécute le SQL chat dans supabase-setup.sql et active Realtime.'
                : error.message;
            return { ok: false, msg: hint || 'Envoi impossible.' };
        }

        lastSentAt = Date.now();
        window.StepFishAchievements?.onChatSent?.();
        return { ok: true };
    }

    function bindUI() {
        bindSidebarTabs();
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const status = document.getElementById('chat-status');

        if (form && input) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!canUse()) {
                    if (status) status.textContent = 'Chat hors ligne.';
                    return;
                }
                const r = await sendMessage(input.value);
                if (r.ok) {
                    input.value = '';
                    if (status) status.textContent = '';
                    switchSidebarPanel('chat');
                } else if (status) {
                    status.textContent = r.msg;
                }
            });
        }
    }

    async function start() {
        bindUI();
        if (!canUse()) return;
        await loadHistory();
        subscribeRealtime();
        refreshAuthState();
    }

    function refreshAuthState() {
        const input = document.getElementById('chat-input');
        if (input) {
            input.disabled = !window.StepFishAuth?.isLoggedIn?.();
            input.placeholder = window.StepFishAuth?.isLoggedIn?.()
                ? 'Écrire un message…'
                : 'Connecte-toi pour parler';
        }
    }

    window.StepFishChat = { start, refreshAuthState, sendMessage, switchSidebarPanel };
})();
