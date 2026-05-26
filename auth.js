/**
 * StepFishing — Comptes & sauvegarde cloud (Supabase)
 */
(function () {
    const DEFAULT_SAVE = {
        totalScore: 0,
        money: 0,
        maxMoney: 0,
        totalFishesCaught: 0,
        highScore: 0,
        inventory: { aq0: [] },
        unlockedAquariums: [0],
        ownedRods: [0],
        equippedRod: 0,
        discoveredFishes: [],
        keys: 0,
        currentZone: 'lac',
        bestFish: null,
        ownedCosmetics: ['default'],
        equippedCosmetic: 'default'
    };

    let supabaseClient = null;
    let session = null;
    let guestMode = false;
    let pseudo = 'Pêcheur Anonyme';
    let readyResolve = null;

    function getConfig() {
        return window.STEPFISH_CONFIG || {};
    }

    function isConfigured() {
        const cfg = getConfig();
        const key = cfg.supabaseAnonKey || '';
        return Boolean(
            cfg.supabaseUrl &&
            key &&
            !cfg.supabaseUrl.includes('YOUR_PROJECT') &&
            !key.includes('YOUR_ANON') &&
            !key.includes('COLLE_ICI') &&
            key.length > 80
        );
    }

    async function validateApiKey() {
        const cfg = getConfig();
        const res = await fetch(`${cfg.supabaseUrl}/auth/v1/health`, {
            headers: { apikey: cfg.supabaseAnonKey }
        });
        if (!res.ok) {
            throw new Error('Clé Supabase invalide — recopie la clé anon (eyJ...) depuis le dashboard.');
        }
    }

    async function loadSupabase() {
        if (window.supabase?.createClient) return;
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/dist/umd/supabase.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Impossible de charger Supabase'));
            document.head.appendChild(script);
        });
    }

    function setAuthStatus(text, ok) {
        const el = document.getElementById('auth-status');
        if (!el) return;
        el.textContent = text || '';
        el.className = 'auth-status' + (ok ? ' ok' : ok === false ? ' err' : '');
    }

    function setAuthMessage(text, isError) {
        const el = document.getElementById('auth-message');
        if (!el) return;
        el.textContent = text || '';
        el.className = 'auth-message' + (isError ? ' auth-message-error' : text ? ' auth-message-success' : '');
    }

    function showAuthScreen() {
        const auth = document.getElementById('screen-auth');
        const menu = document.getElementById('screen-menu');
        if (auth) auth.classList.add('active');
        if (menu) menu.classList.remove('active');
        document.body.classList.add('auth-pending');
    }

    function hideAuthScreen() {
        const auth = document.getElementById('screen-auth');
        const menu = document.getElementById('screen-menu');
        if (auth) auth.classList.remove('active');
        if (menu) menu.classList.add('active');
        document.body.classList.remove('auth-pending');
    }

    function updatePseudoDisplay() {
        if (window.StepFishCosmetics?.refreshPseudoDisplays) {
            window.StepFishCosmetics.refreshPseudoDisplays();
        } else {
            const el = document.getElementById('user-pseudo');
            if (el) el.textContent = pseudo;
        }
        if (window.StepFishChat?.refreshAuthState) window.StepFishChat.refreshAuthState();
        const rank = document.getElementById('user-rank');
        if (rank) {
            if (session) rank.textContent = 'Compte en ligne';
            else if (guestMode) rank.textContent = 'Invité · local';
            else rank.textContent = 'Novice';
        }
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) logoutBtn.classList.toggle('hidden', !session);
    }

    function getUserId() {
        return session?.id || session?.user?.id || null;
    }

    function formatAuthError(err) {
        const msg = (err?.message || '').toLowerCase();
        const code = err?.code || '';
        if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
            return 'Compte non confirmé — dans Supabase : Authentication → Users → supprime cet utilisateur et réinscris-toi.';
        }
        if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
            return 'Email ou mot de passe incorrect. Pas encore de compte ? Utilise l\'onglet Inscription (pas Connexion).';
        }
        if (code === 'weak_password' || msg.includes('weak password')) {
            return 'Mot de passe trop faible — minimum 6 caractères (8+ recommandé).';
        }
        if (code === 'signup_disabled' || msg.includes('signup disabled')) {
            return 'Les inscriptions sont désactivées dans Supabase (Authentication → Providers).';
        }
        if (code === 'user_already_registered' || msg.includes('already registered') || msg.includes('already been registered')) {
            return 'Cet email est déjà utilisé — connecte-toi ou utilise un autre email.';
        }
        if (msg.includes('apikey') || msg.includes('invalid api key') || msg.includes('jwt')) {
            return 'Clé Supabase invalide — utilise la clé anon (eyJ...) dans config.js, pas la clé secret.';
        }
        if (code === '42501' || msg.includes('row-level security')) {
            return 'Erreur base de données — exécute supabase-setup.sql (trigger inclus) dans Supabase.';
        }
        console.error('StepFish Auth:', err);
        return err?.message || 'Erreur de connexion';
    }

    function mergeLocalIntoSave(saveData) {
        if (typeof window.getLocalSavePayload === 'function') {
            const local = window.getLocalSavePayload();
            const hasLocalProgress =
                (local.totalScore || 0) > 0 ||
                (local.money || 0) > 0 ||
                (local.totalFishesCaught || 0) > 0 ||
                (local.inventory?.aq0?.length || 0) > 0;
            if (hasLocalProgress && (!saveData || !saveData.totalScore)) {
                return { ...DEFAULT_SAVE, ...local };
            }
        }
        return { ...DEFAULT_SAVE, ...saveData };
    }

    async function authRequest(path, body) {
        const cfg = getConfig();
        const res = await fetch(`${cfg.supabaseUrl}/auth/v1${path}`, {
            method: 'POST',
            headers: {
                apikey: cfg.supabaseAnonKey,
                Authorization: `Bearer ${cfg.supabaseAnonKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) {
            const err = new Error(json.msg || json.message || json.error_description || 'Erreur auth');
            err.code = json.error_code || json.code;
            throw err;
        }
        return json;
    }

    async function applyAuthSession(authJson) {
        if (!supabaseClient || !authJson.access_token) return;
        await supabaseClient.auth.setSession({
            access_token: authJson.access_token,
            refresh_token: authJson.refresh_token
        });
    }

    async function authSignIn(email, password) {
        const json = await authRequest('/token?grant_type=password', { email, password });
        await applyAuthSession(json);
        return json.user;
    }

    async function authSignUp(email, password, pseudoName) {
        const json = await authRequest('/signup', {
            email,
            password,
            data: { pseudo: pseudoName }
        });
        await applyAuthSession(json);
        return json;
    }

    async function fetchCloudSave(userId) {
        const { data, error } = await supabaseClient
            .from('player_saves')
            .select('save_data, pseudo')
            .eq('id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    }

    async function applySession(user, skipReady) {
        session = user;
        guestMode = false;
        pseudo = user.user_metadata?.pseudo || user.email?.split('@')[0] || 'Pêcheur';

        let row = null;
        try {
            row = await fetchCloudSave(user.id);
        } catch (e) {
            console.warn('Chargement cloud impossible', e);
        }

        if (row?.pseudo) pseudo = row.pseudo;
        const save = mergeLocalIntoSave(row?.save_data);
        if (typeof window.applySaveData === 'function') {
            window.applySaveData(save);
        }
        if (!row) {
            await saveToCloud(save);
        } else if (typeof window.getLocalSavePayload === 'function') {
            const local = window.getLocalSavePayload();
            if ((local.totalScore || 0) > (row.save_data?.totalScore || 0)) {
                await saveToCloud(local);
                if (typeof window.applySaveData === 'function') window.applySaveData(local);
            }
        }

        updatePseudoDisplay();
        hideAuthScreen();
        if (!skipReady && readyResolve) {
            readyResolve();
            readyResolve = null;
        }
    }

    async function saveToCloud(saveData) {
        if (!supabaseClient || !getUserId()) return;
        const payload = saveData || (typeof window.getSavePayload === 'function' ? window.getSavePayload() : DEFAULT_SAVE);
        const { error } = await supabaseClient.from('player_saves').upsert({
            id: getUserId(),
            pseudo,
            save_data: payload,
            updated_at: new Date().toISOString()
        });
        if (error) console.warn('Sauvegarde cloud échouée', error.message);
    }

    async function login(email, password) {
        setAuthMessage('Connexion…');
        const normalizedEmail = email.trim().toLowerCase();
        const user = await authSignIn(normalizedEmail, password);
        await applySession(user, true);
        setAuthMessage('Connecté !');
    }

    async function register(pseudoInput, email, password) {
        const cleanPseudo = pseudoInput.trim();
        const normalizedEmail = email.trim().toLowerCase();
        if (cleanPseudo.length < 3) throw new Error('Pseudo : 3 caractères minimum');
        if (cleanPseudo.length > 20) throw new Error('Pseudo : 20 caractères maximum');
        if (!/^[a-zA-Z0-9_\-\sàâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ]+$/u.test(cleanPseudo)) {
            throw new Error('Pseudo : lettres, chiffres, espaces, _ et - uniquement');
        }

        setAuthMessage('Création du compte…');
        const json = await authSignUp(normalizedEmail, password, cleanPseudo);
        if (!json.user) throw new Error('Inscription impossible');

        if ((json.user.identities || []).length === 0) {
            throw new Error('Cet email est déjà utilisé — connecte-toi.');
        }

        pseudo = cleanPseudo;
        let user = json.user;
        if (!json.access_token) {
            user = await authSignIn(normalizedEmail, password);
        }
        await applySession(user, true);
        setAuthMessage(`Compte créé — bienvenue ${pseudo} !`, false);
    }

    async function logout() {
        if (supabaseClient) await supabaseClient.auth.signOut();
        session = null;
        guestMode = false;
        pseudo = 'Pêcheur Anonyme';
        updatePseudoDisplay();
        showAuthScreen();
        setAuthMessage('Déconnecté.');
    }

    function enterGuestMode() {
        guestMode = true;
        session = null;
        pseudo = localStorage.getItem('stepFishingPseudo') || 'Pêcheur Invité';
        updatePseudoDisplay();
        hideAuthScreen();
        if (readyResolve) {
            readyResolve();
            readyResolve = null;
        }
    }

    function switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.getElementById('auth-form-login')?.classList.toggle('hidden', tab !== 'login');
        document.getElementById('auth-form-register')?.classList.toggle('hidden', tab !== 'register');
        setAuthMessage('');
    }

    function bindAuthUI() {
        document.querySelectorAll('.auth-tab').forEach(btn => {
            btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
        });

        document.querySelectorAll('.auth-show-pwd').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById(btn.dataset.target);
                if (!input) return;
                input.type = input.type === 'password' ? 'text' : 'password';
            });
        });

        document.getElementById('auth-form-login')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const password = document.getElementById('login-password').value.trim();
            try {
                await login(email, password);
                if (readyResolve) { readyResolve(); readyResolve = null; }
            } catch (err) {
                console.error('Login failed:', err);
                setAuthMessage(formatAuthError(err), true);
            }
        });

        document.getElementById('auth-form-register')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pseudoInput = document.getElementById('register-pseudo').value;
            const email = document.getElementById('register-email').value.trim().toLowerCase();
            const password = document.getElementById('register-password').value.trim();
            const confirm = document.getElementById('register-password-confirm').value.trim();
            if (password !== confirm) {
                setAuthMessage('Les mots de passe ne correspondent pas', true);
                return;
            }
            if (password.length < 6) {
                setAuthMessage('Mot de passe : 6 caractères minimum', true);
                return;
            }
            try {
                await register(pseudoInput, email, password);
                if (readyResolve) { readyResolve(); readyResolve = null; }
            } catch (err) {
                setAuthMessage(formatAuthError(err), true);
            }
        });

        document.getElementById('btn-auth-guest')?.addEventListener('click', enterGuestMode);
    }

    async function init() {
        bindAuthUI();

        if (!isConfigured()) {
            console.warn('StepFishing : Supabase non configuré — mode local uniquement');
            setAuthStatus('Config Supabase manquante', false);
            enterGuestMode();
            return;
        }

        try {
            await loadSupabase();
            const cfg = getConfig();
            await validateApiKey();
            setAuthStatus('Serveur connecté ✓', true);
            supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });

            const { data } = await supabaseClient.auth.getSession();
            if (data.session?.user) {
                await applySession(data.session.user);
                return;
            }
        } catch (e) {
            console.warn('Auth indisponible', e);
            setAuthStatus('Serveur injoignable', false);
            setAuthMessage(formatAuthError(e) || 'Serveur indisponible — mode invité possible', true);
        }

        showAuthScreen();
    }

    window.StepFishAuth = {
        init() {
            return new Promise((resolve) => {
                readyResolve = resolve;
                init();
            });
        },
        isLoggedIn: () => Boolean(session),
        isGuest: () => guestMode,
        isConfigured,
        getPseudo: () => pseudo,
        saveToCloud,
        logout,
        updatePseudoDisplay,
        getSupabaseClient: () => supabaseClient,
        getUserId
    };
})();
