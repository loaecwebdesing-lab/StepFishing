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
        currentZone: 'lac'
    };

    let supabase = null;
    let session = null;
    let guestMode = false;
    let pseudo = 'Pêcheur Anonyme';
    let readyResolve = null;

    function getConfig() {
        return window.STEPFISH_CONFIG || {};
    }

    function isConfigured() {
        const cfg = getConfig();
        return Boolean(
            cfg.supabaseUrl &&
            cfg.supabaseAnonKey &&
            !cfg.supabaseUrl.includes('YOUR_PROJECT') &&
            !cfg.supabaseAnonKey.includes('YOUR_ANON')
        );
    }

    async function loadSupabase() {
        if (window.supabase?.createClient) return;
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Impossible de charger Supabase'));
            document.head.appendChild(script);
        });
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
        const el = document.getElementById('user-pseudo');
        if (el) el.textContent = pseudo;
        const rank = document.getElementById('user-rank');
        if (rank) {
            if (session) rank.textContent = 'Compte en ligne';
            else if (guestMode) rank.textContent = 'Invité · local';
            else rank.textContent = 'Novice';
        }
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) logoutBtn.classList.toggle('hidden', !session);
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

    async function fetchCloudSave(userId) {
        const { data, error } = await supabase
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
        if (!supabase || !session) return;
        const payload = saveData || (typeof window.getSavePayload === 'function' ? window.getSavePayload() : DEFAULT_SAVE);
        const { error } = await supabase.from('player_saves').upsert({
            id: session.user.id,
            pseudo,
            save_data: payload,
            updated_at: new Date().toISOString()
        });
        if (error) console.warn('Sauvegarde cloud échouée', error.message);
    }

    async function login(email, password) {
        setAuthMessage('Connexion…');
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await applySession(data.user, true);
        setAuthMessage('Connecté !');
    }

    async function register(pseudoInput, email, password) {
        const cleanPseudo = pseudoInput.trim();
        if (cleanPseudo.length < 3) throw new Error('Pseudo : 3 caractères minimum');
        if (cleanPseudo.length > 20) throw new Error('Pseudo : 20 caractères maximum');
        if (!/^[a-zA-Z0-9_\-\sàâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ]+$/u.test(cleanPseudo)) {
            throw new Error('Pseudo : lettres, chiffres, espaces, _ et - uniquement');
        }

        setAuthMessage('Création du compte…');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { pseudo: cleanPseudo } }
        });
        if (error) throw error;
        if (!data.user) throw new Error('Inscription impossible');

        pseudo = cleanPseudo;
        session = data.user;
        guestMode = false;

        const initialSave = mergeLocalIntoSave(null);
        const { error: saveError } = await supabase.from('player_saves').insert({
            id: data.user.id,
            pseudo: cleanPseudo,
            save_data: initialSave
        });
        if (saveError) {
            if (saveError.code === '23505') throw new Error('Ce pseudo est déjà pris');
            throw saveError;
        }

        if (typeof window.applySaveData === 'function') window.applySaveData(initialSave);
        updatePseudoDisplay();

        if (data.session) {
            hideAuthScreen();
            setAuthMessage('');
        } else {
            setAuthMessage('Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.', false);
            switchAuthTab('login');
            session = null;
        }
    }

    async function logout() {
        if (supabase) await supabase.auth.signOut();
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
        document.getElementById('auth-panel-login')?.classList.toggle('hidden', tab !== 'login');
        document.getElementById('auth-panel-register')?.classList.toggle('hidden', tab !== 'register');
        setAuthMessage('');
    }

    function bindAuthUI() {
        document.querySelectorAll('.auth-tab').forEach(btn => {
            btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
        });

        document.getElementById('auth-form-login')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            try {
                await login(email, password);
                if (readyResolve) { readyResolve(); readyResolve = null; }
            } catch (err) {
                setAuthMessage(err.message || 'Connexion impossible', true);
            }
        });

        document.getElementById('auth-form-register')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pseudoInput = document.getElementById('register-pseudo').value;
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-password-confirm').value;
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
                setAuthMessage(err.message || 'Inscription impossible', true);
            }
        });

        document.getElementById('btn-auth-guest')?.addEventListener('click', enterGuestMode);
    }

    async function init() {
        bindAuthUI();

        if (!isConfigured()) {
            console.warn('StepFishing : Supabase non configuré — mode local uniquement');
            enterGuestMode();
            return;
        }

        try {
            await loadSupabase();
            const cfg = getConfig();
            supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                await applySession(data.session.user);
                return;
            }
        } catch (e) {
            console.warn('Auth indisponible', e);
            setAuthMessage('Serveur indisponible — mode invité possible', true);
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
        updatePseudoDisplay
    };
})();
