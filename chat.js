/**
 * StepFishing — Chat global (Supabase Realtime)
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

    function renderPseudo(pseudo, cosmeticId) {
        if (window.StepFishCosmetics?.renderPseudoHTML) {
            return window.StepFishCosmetics.renderPseudoHTML(pseudo, cosmeticId);
        }
        return escapeHtml(pseudo);
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
            return `<div class="chat-msg">
                <span class="chat-time">${time}</span>
                ${renderPseudo(m.pseudo, m.cosmetic_id)} :
                <span class="chat-text">${escapeHtml(m.message)}</span>
            </div>`;
        }).join('');
        box.scrollTop = box.scrollHeight;
    }

    async function loadHistory() {
        const client = getClient();
        if (!client) return;
        const { data, error } = await client
            .from('global_chat')
            .select('pseudo, cosmetic_id, message, created_at')
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

        const cosmeticId = window.StepFishCosmetics?.getEquippedId?.() || 'default';
        const { error } = await client.from('global_chat').insert({
            user_id: userId,
            pseudo: window.StepFishAuth.getPseudo(),
            cosmetic_id: cosmeticId,
            message: msg
        });

        if (error) {
            console.warn('Chat send:', error);
            const hint = (error.message || '').includes('global_chat')
                ? 'Exécute le SQL chat dans supabase-setup.sql et active Realtime.'
                : error.message;
            return { ok: false, msg: hint || 'Envoi impossible.' };
        }

        lastSentAt = Date.now();
        return { ok: true };
    }

    function bindUI() {
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const toggle = document.getElementById('chat-toggle');
        const panel = document.getElementById('global-chat');
        const status = document.getElementById('chat-status');

        if (toggle && panel) {
            toggle.addEventListener('click', () => {
                panel.classList.toggle('collapsed');
                toggle.textContent = panel.classList.contains('collapsed') ? '💬' : '▼';
            });
        }

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
                } else if (status) {
                    status.textContent = r.msg;
                }
            });
        }
    }

    async function start() {
        if (!canUse()) return;
        bindUI();
        await loadHistory();
        subscribeRealtime();
        const input = document.getElementById('chat-input');
        if (input) {
            input.placeholder = window.StepFishAuth?.isLoggedIn?.()
                ? 'Écrire un message…'
                : 'Connecte-toi pour parler';
            input.disabled = !window.StepFishAuth?.isLoggedIn?.();
        }
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

    window.StepFishChat = { start, refreshAuthState, sendMessage };
})();
