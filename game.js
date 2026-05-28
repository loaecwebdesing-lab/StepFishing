/**
 * STEPFISHING - Pro Edition
 * Version: 13.0.3 (Corrected Order)
 */

/** Poids de tirage Commun → Épique (Lég./Myth./Divin = catchRates canne) */
const RARITY_WEIGHTS = [58, 26, 26, 12, 0.98, 0.028, 0.005];
/** Cible canne bambou : ~1 légendaire / 140 (× LEGENDARY_CATCH_MULT sur toutes les cannes) */
const LEGENDARY_CATCH_MULT = 1.8;
const LEGENDARY_CHANCE_BAMBOO_PCT = 0.4;

const RARITIES = [
    { name: 'Commun', folder: 'commun', color: '#BDBDBD', difficulty: 2, points: 1, speed: 2, class: 'rarity-0', minPrice: 0.1, maxPrice: 1 },
    { name: 'Peu Commun', folder: 'peu_commun', color: '#4CAF50', difficulty: 4, points: 3, speed: 3, class: 'rarity-1', minPrice: 1, maxPrice: 5 },
    { name: 'Rare', folder: 'rare', color: '#2196F3', difficulty: 6, points: 7, speed: 5, class: 'rarity-2', minPrice: 5, maxPrice: 25 },
    { name: 'Épique', folder: 'epique', color: '#9C27B0', difficulty: 8, points: 15, speed: 7, class: 'rarity-3', minPrice: 25, maxPrice: 150 },
    { name: 'Légendaire', folder: 'legendaire', color: '#FF9800', difficulty: 10, points: 30, speed: 9, class: 'rarity-4', minPrice: 150, maxPrice: 600 },
    { name: 'Mythique', folder: 'mythique', color: '#F44336', difficulty: 12, points: 60, speed: 12, class: 'rarity-5', minPrice: 600, maxPrice: 2500 },
    { name: 'Divin', folder: 'divin', color: '#4B0082', difficulty: 15, points: 150, speed: 15, class: 'rarity-6', minPrice: 2500, maxPrice: 10000 }
];

// 1. D'abord on définit les cannes du shop
/** Chances de pêche en % (Légendaire / Mythique / Divin) — toutes cannes peuvent les obtenir. */
const ROD_DATA = [
    { id: 0, name: "Canne en Bambou", cost: 0, luck: 0, speed: 1, time: 0, img: "assets/rods/rod0.png", moneyBuff: 1, catchRates: { legendaire: 0.4, mythique: 0.003, divin: 0.0008 } },
    { id: 1, name: "Canne Fine", cost: 500, luck: 1, speed: 1.2, time: 5, img: "assets/rods/rod1.png", moneyBuff: 1, catchRates: { legendaire: 0.065, mythique: 0.008, divin: 0.0015 } },
    { id: 2, name: "Canne en Aluminium", cost: 2500, luck: 2, speed: 1.5, time: 10, img: "assets/rods/rod2.png", moneyBuff: 1, catchRates: { legendaire: 0.12, mythique: 0.025, divin: 0.004 } },
    { id: 3, name: "Canne en Carbone", cost: 10000, luck: 4, speed: 2.0, time: 15, img: "assets/rods/rod3.png", moneyBuff: 1.1, catchRates: { legendaire: 0.43, mythique: 0.08, divin: 0.006 } },
    { id: 4, name: "Canne Pro", cost: 50000, luck: 7, speed: 2.5, time: 20, img: "assets/rods/rod4.png", moneyBuff: 1.2, catchRates: { legendaire: 0.52, mythique: 0.10, divin: 0.012 } },
    { id: 5, name: "Canne ProMax", cost: 100000, luck: 8, speed: 2.9, time: 25, img: "assets/rods/rod5.png", moneyBuff: 1.5, catchRates: { legendaire: 0.62, mythique: 0.12, divin: 0.015 } }
];

// 2. Ensuite on définit les cannes des coffres
const ROD_IMG_V = 'v=2';
const CRATE_RODS = [
    { id: 10, name: "Canne Astral", rarity: 'Rare', luck: 9, speed: 2.0, time: 20, img: "assets/rods/astral.png?" + ROD_IMG_V, color: '#2196F3', moneyBuff: 2, minPrestige: 1, catchRates: { legendaire: 0.68, mythique: 0.14, divin: 0.025 } },
    { id: 11, name: "Canne Solaire", rarity: 'Épique', luck: 13, speed: 2.5, time: 30, img: "assets/rods/solaire.png?" + ROD_IMG_V, color: '#FFD700', moneyBuff: 3, minPrestige: 1, catchRates: { legendaire: 0.86, mythique: 0.20, divin: 0.05 } },
    { id: 12, name: "Canne Nécro", rarity: 'Légendaire', luck: 22, speed: 3.0, time: 40, img: "assets/rods/necro.png?" + ROD_IMG_V, color: '#9C27B0', moneyBuff: 5, minPrestige: 2, catchRates: { legendaire: 1.17, mythique: 0.30, divin: 0.12 } },
    { id: 13, name: "Canne du Chaos", rarity: 'Mythique', luck: 35, speed: 4.0, time: 60, img: "assets/rods/chaos.png?" + ROD_IMG_V, color: '#F44336', moneyBuff: 10, minPrestige: 2, catchRates: { legendaire: 1.42, mythique: 0.45, divin: 0.28 } },
    { id: 14, name: "L'Excalibur des Mers", rarity: 'Divin', luck: 88, speed: 6.0, time: 120, img: "assets/rods/excalibur.png?" + ROD_IMG_V, color: '#4B0082', moneyBuff: 25, minPrestige: 4, catchRates: { legendaire: 1.85, mythique: 0.75, divin: 0.68 } },
];

// 3. MAINTENANT on peut fusionner les deux (car les deux existent déjà)
const ALL_RODS = [...ROD_DATA, ...CRATE_RODS];

const KEY_CATCH_CHANCE = 1 / 150;
const KEY_IMG = 'assets/Key.png?v=1';
const CHEST_IMG = 'assets/chest.png';

/** Coffres / bourses pêchables : ouverture directe en mini-jeu roll (argent uniquement). */
const TREASURE_BOXES = [
    {
        id: 'bourse',
        name: 'Bourse',
        catchChance: 1 / 75,
        img: 'assets/Bourse.png',
        color: '#8BC34A',
        difficulty: 5,
        points: 18,
        loot: [
            { amount: 1, weight: 700, label: '1 $', color: '#BDBDBD' },
            { amount: 10, weight: 200, label: '10 $', color: '#4CAF50' },
            { amount: 20, weight: 80, label: '20 $', color: '#2196F3' },
            { amount: 50, weight: 20, label: '50 $', color: '#FF9800' }
        ]
    },
    {
        id: 'coffre_leger',
        name: 'Coffre léger',
        catchChance: 1 / 125,
        keyBonusChance: 0.05,
        img: 'assets/PetitCoffre.png',
        color: '#03A9F4',
        difficulty: 7,
        points: 28,
        loot: [
            { amount: 10, weight: 450, label: '10 $', color: '#BDBDBD' },
            { amount: 20, weight: 300, label: '20 $', color: '#4CAF50' },
            { amount: 50, weight: 180, label: '50 $', color: '#2196F3' },
            { amount: 100, weight: 70, label: '100 $', color: '#FF9800' }
        ]
    },
    {
        id: 'coffre_moyen',
        name: 'Coffre moyen',
        catchChance: 1 / 270,
        keyBonusChance: 0.10,
        img: 'assets/CoffreMoyen.png',
        color: '#9C27B0',
        difficulty: 9,
        points: 40,
        baseLoot: [
            { amount: 10, weight: 200, label: '10 $', color: '#BDBDBD' },
            { amount: 20, weight: 180, label: '20 $', color: '#4CAF50' },
            { amount: 50, weight: 150, label: '50 $', color: '#2196F3' },
            { amount: 100, weight: 120, label: '100 $', color: '#03A9F4' },
            { amount: 150, weight: 80, label: '150 $', color: '#FF9800' },
            { amount: 200, weight: 50, label: '200 $', color: '#E91E63' }
        ],
        multipliers: [
            { mult: 0.1, weight: 220, label: '×0,1', color: '#9E9E9E' },
            { mult: 0.2, weight: 180, label: '×0,2', color: '#BDBDBD' },
            { mult: 0.5, weight: 160, label: '×0,5', color: '#4CAF50' },
            { mult: 1, weight: 140, label: '×1', color: '#2196F3' },
            { mult: 2, weight: 100, label: '×2', color: '#FF9800' },
            { mult: 3, weight: 60, label: '×3', color: '#E91E63' },
            { mult: 5, weight: 30, label: '×5', color: '#9C27B0' }
        ]
    }
];
const TREASURE_BOX_BY_ID = Object.fromEntries(TREASURE_BOXES.map(b => [b.id, b]));

const CRATE_MONEY_LOOT = [
    { type: 'money', amount: 100, weight: 420, label: '100 $', color: '#BDBDBD' },
    { type: 'money', amount: 1000, weight: 230, label: '1 000 $', color: '#4CAF50' },
    { type: 'money', amount: 5000, weight: 90, label: '5 000 $', color: '#2196F3' },
    { type: 'money', amount: 10000, weight: 35, label: '10 000 $', color: '#FF9800' }
];

const CRATE_ROD_POOL_WEIGHT = 22;
const CRATE_ROD_WEIGHTS = { 'Rare': 45, 'Épique': 28, 'Légendaire': 15, 'Mythique': 8, 'Divin': 4 };

const MUSIC_VOLUME = 0.2;
const BUTTON_VOLUME = 0.9;
const SFX_VOLUME = 0.35;
const VOLUME_STORAGE_KEY = 'stepfish_master_volume';
const DEFAULT_MASTER_VOLUME = 1;

function loadMasterVolume() {
    try {
        const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (raw === null) return DEFAULT_MASTER_VOLUME;
        const v = parseFloat(raw);
        if (!Number.isFinite(v)) return DEFAULT_MASTER_VOLUME;
        return Math.max(0, Math.min(1, v));
    } catch {
        return DEFAULT_MASTER_VOLUME;
    }
}

function saveMasterVolume() {
    try {
        localStorage.setItem(VOLUME_STORAGE_KEY, String(masterVolume));
    } catch { /* ignore */ }
}

let masterVolume = loadMasterVolume();
let volumeMuted = false;
let masterVolumeBeforeMute = DEFAULT_MASTER_VOLUME;

function getScaledMusicVolume() {
    if (volumeMuted || masterVolume <= 0) return 0;
    return MUSIC_VOLUME * masterVolume;
}

function getScaledSfxVolume(base = SFX_VOLUME) {
    if (volumeMuted || masterVolume <= 0) return 0;
    return base * masterVolume;
}

const BG_MUSIC_TRACKS = [
    'assets/Ambi.mp3',
    'assets/Ambi2.mp3',
    'assets/Ambi3.mp3',
    'assets/Ambi4.mp3'
];
const AUDIO_FILES = {
    splash: 'assets/Splash.mp3',
    chest: 'assets/Chest.mp3',
    button: 'assets/Button.mp3?v=2'
};

let audioCtx = null;
const audioBuffers = {};
const sfxPools = {};
let bgMusicEl = null;
let lastButtonSfxAt = 0;
const sfxBaseVolumes = {};
/** Max. de fois la même piste peut enchaîner avant d’être forcée à changer (pas 6× d’affilée). */
const BG_MUSIC_MAX_SAME_STREAK = 5;
let bgMusicCurrentTrack = null;
let bgMusicSameStreak = 1;
let bgMusicEndedBound = false;

function getBgMusicTrackList() {
    return window.__stepfishBgTracks || BG_MUSIC_TRACKS;
}

function pickRandomBgMusicTrack() {
    const tracks = getBgMusicTrackList();
    if (!tracks.length) return 'assets/Ambi.mp3';
    return tracks[Math.floor(Math.random() * tracks.length)];
}

function resolveTrackPathFromAudioSrc(src) {
    const tracks = getBgMusicTrackList();
    if (!src) return null;
    for (const t of tracks) {
        const file = t.split('/').pop();
        if (src.includes(file) || src.endsWith(t)) return t;
    }
    return null;
}

function pickNextBgMusicTrack(previousTrack, sameStreak) {
    const tracks = getBgMusicTrackList();
    if (!tracks.length) return 'assets/Ambi.mp3';
    if (tracks.length === 1) return tracks[0];
    const mustChange = previousTrack && sameStreak >= BG_MUSIC_MAX_SAME_STREAK;
    if (mustChange) {
        const others = tracks.filter((t) => t !== previousTrack);
        return others[Math.floor(Math.random() * others.length)];
    }
    return tracks[Math.floor(Math.random() * tracks.length)];
}

function onBgMusicEnded() {
    const music = getBgMusic();
    if (!music) return;
    const next = pickNextBgMusicTrack(bgMusicCurrentTrack, bgMusicSameStreak);
    if (next === bgMusicCurrentTrack) bgMusicSameStreak++;
    else bgMusicSameStreak = 1;
    bgMusicCurrentTrack = next;
    music.src = next;
    music.load();
    music.muted = volumeMuted || masterVolume <= 0;
    music.volume = getScaledMusicVolume();
    music.play().catch(() => {});
}

window.__stepfishOnBgMusicEnded = onBgMusicEnded;

function bindBgMusicEndedHandler(music) {
    if (!music || bgMusicEndedBound) return;
    music.loop = false;
    music.addEventListener('ended', onBgMusicEnded);
    bgMusicEndedBound = true;
}

function initBackgroundMusic() {
    if (!window.__stepfishBgMusic) {
        const track = pickRandomBgMusicTrack();
        const music = new Audio(track);
        music.loop = false;
        music.preload = 'auto';
        music.playsInline = true;
        window.__stepfishBgMusic = music;
        bgMusicCurrentTrack = track;
        bgMusicSameStreak = 1;
    }
    bgMusicEl = window.__stepfishBgMusic;
    bindBgMusicEndedHandler(bgMusicEl);
    if (!bgMusicCurrentTrack) {
        bgMusicCurrentTrack = resolveTrackPathFromAudioSrc(bgMusicEl.src) || pickRandomBgMusicTrack();
        bgMusicSameStreak = 1;
    }
    return bgMusicEl;
}

function getBgMusic() {
    return initBackgroundMusic();
}

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function decodeAudioFile(src) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            if (xhr.status && xhr.status !== 200 && xhr.status !== 0) {
                resolve();
                return;
            }
            getAudioContext().decodeAudioData(xhr.response)
                .then(decoded => { audioBuffers[src] = decoded; })
                .catch(() => {})
                .finally(resolve);
        };
        xhr.onerror = () => resolve();
        xhr.send();
    });
}

function initSfxPool(key, src, size, baseVolume = SFX_VOLUME) {
    sfxBaseVolumes[key] = baseVolume;
    if (sfxPools[key]?.length) {
        applySfxPoolVolumes();
        return;
    }
    sfxPools[key] = [];
    for (let i = 0; i < size; i++) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = getScaledSfxVolume(baseVolume);
        audio.load();
        sfxPools[key].push(audio);
    }
}

function applySfxPoolVolumes() {
    Object.keys(sfxPools).forEach((key) => {
        const vol = getScaledSfxVolume(sfxBaseVolumes[key] ?? SFX_VOLUME);
        sfxPools[key].forEach((audio) => { audio.volume = vol; });
    });
}

function applyMasterVolume() {
    const music = getBgMusic();
    if (music) {
        music.muted = volumeMuted || masterVolume <= 0;
        music.volume = getScaledMusicVolume();
    }
    applySfxPoolVolumes();
    updateVolumeBarUI();
}

function setMasterVolumeFromPct(pct) {
    masterVolume = Math.max(0, Math.min(1, pct / 100));
    volumeMuted = masterVolume <= 0;
    if (masterVolume > 0) masterVolumeBeforeMute = masterVolume;
    saveMasterVolume();
    applyMasterVolume();
}

function playBufferSrc(src, volume = SFX_VOLUME) {
    const buffer = audioBuffers[src];
    if (!buffer) return false;
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = getScaledSfxVolume(volume);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
    return true;
}

function playSfxHtml(key, volume = SFX_VOLUME) {
    const pool = sfxPools[key];
    if (!pool?.length) return;
    const sound = pool.find(a => a.paused || a.ended) || pool[0];
    sound.currentTime = 0;
    sound.volume = getScaledSfxVolume(volume);
    sound.play().catch(() => {});
}

function playButtonSound() {
    const vol = BUTTON_VOLUME;
    if (!playBufferSrc(AUDIO_FILES.button, vol)) playSfxHtml('button', vol);
}

function playSplashSound() {
    if (!playBufferSrc(AUDIO_FILES.splash)) playSfxHtml('splash');
}

function playChestSound() {
    if (!playBufferSrc(AUDIO_FILES.chest)) playSfxHtml('chest');
}

function startBackgroundMusic() {
    const music = getBgMusic();
    if (!music) return;
    music.muted = volumeMuted || masterVolume <= 0;
    music.volume = getScaledMusicVolume();
    music.play().catch(() => {});
}

function updateVolumeBarUI() {
    const slider = document.getElementById('volume-slider');
    const muteBtn = document.getElementById('btn-volume-mute');
    const pctEl = document.getElementById('volume-pct');
    const pct = volumeMuted ? 0 : Math.round(masterVolume * 100);
    if (slider) slider.value = String(pct);
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (muteBtn) {
        muteBtn.textContent = pct === 0 ? '🔇' : pct < 45 ? '🔉' : '🔊';
        muteBtn.title = pct === 0
            ? 'Activer le son — survoler pour régler'
            : 'Couper le son — survoler pour régler';
        muteBtn.setAttribute('aria-label', muteBtn.title);
    }
}

function setupVolumeControl() {
    const slider = document.getElementById('volume-slider');
    const muteBtn = document.getElementById('btn-volume-mute');
    const downBtn = document.getElementById('btn-volume-down');
    const upBtn = document.getElementById('btn-volume-up');
    if (!slider) return;

    volumeMuted = masterVolume <= 0;
    updateVolumeBarUI();
    applyMasterVolume();

    slider.addEventListener('input', () => {
        setMasterVolumeFromPct(Number(slider.value));
    });

    muteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (volumeMuted || masterVolume <= 0) {
            volumeMuted = false;
            masterVolume = masterVolumeBeforeMute > 0 ? masterVolumeBeforeMute : 0.5;
        } else {
            masterVolumeBeforeMute = masterVolume;
            volumeMuted = true;
            masterVolume = 0;
        }
        saveMasterVolume();
        applyMasterVolume();
    });

    downBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setMasterVolumeFromPct(Math.max(0, Math.round(masterVolume * 100) - 10));
    });

    upBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setMasterVolumeFromPct(Math.min(100, Math.round(masterVolume * 100) + 10));
    });

    const dock = document.getElementById('volume-bar');
    if (dock) {
        let closeTimer = null;
        const openDock = () => {
            clearTimeout(closeTimer);
            dock.classList.add('is-open');
        };
        const scheduleCloseDock = () => {
            closeTimer = setTimeout(() => dock.classList.remove('is-open'), 300);
        };
        dock.addEventListener('pointerenter', openDock);
        dock.addEventListener('pointerleave', scheduleCloseDock);
        dock.addEventListener('focusin', openDock);
        dock.addEventListener('focusout', (e) => {
            if (!dock.contains(e.relatedTarget)) scheduleCloseDock();
        });
    }
}

function setupAudio() {
    setupVolumeControl();
    document.addEventListener('pointerdown', (e) => {
        startBackgroundMusic();
        const btn = e.target.closest('button');
        if (!btn || btn.id === 'btn-open-crate' || btn.closest('#volume-bar')) return;
        const now = performance.now();
        if (now - lastButtonSfxAt < 40) return;
        lastButtonSfxAt = now;
        playButtonSound();
    }, true);
}

function preloadAllAudio() {
    getAudioContext();
    initSfxPool('button', AUDIO_FILES.button, 4, BUTTON_VOLUME);
    initSfxPool('splash', AUDIO_FILES.splash, 2);
    initSfxPool('chest', AUDIO_FILES.chest, 2);
    startBackgroundMusic();
}

const KEY_FISH = {
    isKey: true,
    id: -1,
    name: 'Clé Mystérieuse',
    img: KEY_IMG,
    points: 25,
    color: '#ffca28',
    difficulty: 6,
    class: 'rarity-3',
    value: 0,
    mutation: 'Normal'
};

function rollTreasureBoxCatch() {
    if (Math.random() < TREASURE_BOXES[2].catchChance) return TREASURE_BOXES[2];
    if (Math.random() < TREASURE_BOXES[1].catchChance) return TREASURE_BOXES[1];
    if (Math.random() < TREASURE_BOXES[0].catchChance) return TREASURE_BOXES[0];
    return null;
}

function makeTreasureCatchFish(box) {
    return {
        isTreasureBox: true,
        boxId: box.id,
        id: -2,
        name: box.name,
        img: box.img,
        points: box.points,
        color: box.color,
        difficulty: box.difficulty,
        class: 'rarity-3',
        value: 0,
        mutation: 'Normal'
    };
}

/** Poissons abyss (hors Mythique / Divin) — base de la zone Bonta. */
const ABYSS_FISH_NO_TOP = {
    commun: ['Alepisore.png', 'CrocoFish.png', 'GrockFish.png'],
    peu_commun: ['LoupAbyssal.png', 'PoissonArcher.png', 'PoissonHachette.png', 'PoissonLampe.png', 'PoissonLicorne.png', 'PoissonOgre.png', 'Tripode.png'],
    rare: ['Chymere.png', 'PoissonScie.png'],
    epique: ['BlobFish.png', 'RequinGriset.png', 'RequnLutin.png', 'Vipere.png'],
    legendaire: ['BaudroieAbyssal.png', 'DiableNoir.png', 'DragonDesMers.png', 'PoissonRuban.png'],
    mythique: [],
    divin: []
};

/** Espèces exclusives Bonta (assets/fish/…/*.webp). */
const BONTA_EXCLUSIVE_FISH = {
    commun: [
        'CarpeDiem.webp', 'CarpeSabloneuse.webp', 'CrabeSouroumi.webp', 'Goujon.webp', 'GoujonKiye.webp',
        'Greuvette.webp', 'Morue.webp', 'Pichon.webp', 'Poisskaille.webp', 'PoissonPané.webp',
        'SardineSombre.webp', 'Truite.webp', 'TruiteAncestrale.webp', 'TruiteBoueuse.webp'
    ],
    peu_commun: [
        'BarRikain.webp', 'BremeGrise.webp', 'Brochet.webp', 'BrochetTupeHallet.webp', 'CrabeSouroumiE.webp',
        'GreuvetteHorreur.webp', 'LotteCrabouillé.webp', 'Perche.webp', 'PoiskailleGivré.webp', 'PoissonIgloo.webp',
        'SardineBrillante.webp', 'Tench.webp'
    ],
    rare: [
        'BarIton.webp', 'Bearded_Cod.webp', 'BremeRoyale.webp', 'ChatonPerche.webp', 'Poisson Humonk.webp',
        'PoissonChaton.webp', 'PoissonTigre.webp', 'RaieBleue.webp', 'RaieFarle.webp'
    ],
    epique: [
        'Anguille.webp', 'Espadoun.webp', 'EspadounQuichoque.webp', 'MarteauFaussile.webp', 'MarteauMarchéLibre.webp',
        'SnappeurMagique.webp', 'TancheHantée.webp'
    ],
    legendaire: ['AnguilleRocheuse.webp', 'Kralamoure.webp', 'Patelle.webp'],
    mythique: ['KralamoureUnique.webp', 'VivaneauEncree.webp'],
    divin: []
};

function mergeFishLibraries(...libs) {
    const folders = ['commun', 'peu_commun', 'rare', 'epique', 'legendaire', 'mythique', 'divin'];
    const out = {};
    folders.forEach(folder => {
        out[folder] = [];
        libs.forEach(lib => {
            (lib?.[folder] || []).forEach(file => out[folder].push(file));
        });
    });
    return out;
}

const ZONE_DATA = [
    { 
        id: 'lac', 
        name: 'Lac Calme', 
        bgDay: 'assets/background_day.png', 
        bgDawn: 'assets/background_dawn.png', 
        bgNight: 'assets/background_night.png',
        library: {
            'commun': ['Carasin.png', 'Rosette.png', 'Vandoise.png', 'Ecrevise.png', 'Ablette.png', 'GobieSauteur.png', 'Carpe.png', 'Perche.png', 'Truite.png', 'Barbeau.png', 'Breme.png', 'Tanche.png', 'Goujon.png', 'Rotengle.png', 'Black_Bass.png', 'Gardon.png', 'Crapet.png', 'Spirlin.png', 'Coregone.png', 'Huchon.png', 'Bouviere.png', 'Blageon.png', 'CarpeMiroir.png', 'Eppinochette.png', 'Lotte.png', 'Nasse.png', 'Tetra.png'],
            'peu_commun': ['Loche.png', 'Pseudorasboa.png', 'Epinoche.png', 'Anguille.png', 'Brochet.png', 'Apron.png', 'Omble.png', 'Lamproie.png', 'Tilapia.png', 'Chichlidé.png', 'Dojo.png', 'Killie.png', 'Melanotaeina.png', 'PoissonCouteau.png'],
            'rare': ['Carpe_Koi.png', 'Piranha.png', 'Channa.png', 'Oscar.png', 'Hotu.png', 'Axolotl.png', 'AxolotlA.png', 'Pleco.png', 'Corydoras.png', 'Rasboa.png', 'Discus.png', 'Lépistolé.png', 'Kiksus.png'],
            'epique': ['Silure.png', 'SnakeHead.png', 'Bichir.png', 'AxolotlB.png', 'Pangasius.png', 'FlapJack.png', 'Skelleton.png', 'Chratica.png'],
            'legendaire': ['Arapaima.png', 'GarAligator.png', 'AxolotlG.png', 'Arowana.png', 'ArowanaR.png', 'ArowanaS.png', 'Yoyonus.png'],
            'mythique': ['Esturgeon.png', 'Nimphonius.png', 'ArowanaChrome.png', 'ArowanaLN.png', 'ArowanaN.png'],
            'divin': ['Silencius.png']
        }
    },
    { 
        id: 'ocean', 
        name: 'Haute Mer', 
        minLevel: 10,
        bgDay: 'assets/ocean_day.png', 
        bgDawn: 'assets/ocean_dawn.png', 
        bgNight: 'assets/ocean_night.png',
        library: {
            'commun': ['Merou.png', 'Labre.png', 'Chirurgien.png', 'Vivaneau.png', 'Sardine.png', 'Maquereau.png', 'Mulet.png', 'LieuJaune.png', 'Anchois.png', 'Rougeais.png', 'Liche.png', 'Pagre.png', 'Tacaud.png', 'Aglefin.png', 'Atherine.png', 'Cabillaud.png', 'Chapon.png', 'Girelle.png', 'Perca.png', 'Sprat.png', 'Vielle.png'],
            'peu_commun': ['PoissonClown.png', 'PoissonLion.png', 'Bar.png', 'Sole.png', 'Dorade.png', 'SaintPierre.png', 'Napoleon.png', 'Albacore.png', 'Baliste.png', 'Carangue.png', 'Denti.png', 'Orphie.png', 'PoissonHache.png', 'Sar.png', 'Seriole.png', 'Trachinote.png'],
            'rare': ['Baracuda.png', 'Thon.png', 'Turbot.png', 'Papillon.png'],
            'epique': ['Espadon.png', 'MahiMahi.png', 'Poulpi.png', 'PoissonGlobe.png'],
            'legendaire': ['Raiemanta.png', 'Mako.png', 'Voilier.png', 'Hippocampe.png'],
            'mythique': ['Krakenor.png', 'Chronos.png'],
            'divin': ['Abysellion.png']
        }
    },
    {
        id: 'bonta',
        name: 'Bonta',
        minLevel: 150,
        /* Remplacer par assets/bonta_day.png, bonta_dawn.png, bonta_night.png quand prêts */
        bgDay: 'assets/abyss_day.png',
        bgDawn: 'assets/abyss_dawn.png',
        bgNight: 'assets/abyss_night.png',
        library: mergeFishLibraries(ABYSS_FISH_NO_TOP, BONTA_EXCLUSIVE_FISH)
    },
    {
        id: 'abyss',
        name: 'Abysse',
        minLevel: 100,
        bgDay: 'assets/abyss_day.png',
        bgDawn: 'assets/abyss_dawn.png',
        bgNight: 'assets/abyss_night.png',
        library: {
            ...ABYSS_FISH_NO_TOP,
            mythique: [],
            divin: []
        }
    }
];

/** Multiplicateur de valeur de base selon la zone. */
const ZONE_FISH_VALUE_MULT = { bonta: 1.35, abyss: 1.5 };

const FISH_DATA = {
    prefixes: window.STEPFISH_PREFIX_WORDS || {
        'Commun': ['Petit'], 'Peu Commun': ['Vif'], 'Rare': ['Brillant'], 'Épique': ['Souverain'],
        'Légendaire': ['Colossal'], 'Mythique': ['Céleste'], 'Divin': ['Cosmique']
    }
};

/** Bonus forts (préfixe Légendaire et au-dessus). */
const PREFIX_BOOST_MULT = [1.5, 2.0, 3.0]; // index 0 = tier 4 Légendaire, 1 = Mythique, 2 = Divin

/** Bonus progressif quand le préfixe est un peu plus rare que le poisson (ex. Peu commun + Rare → ×1,1). */
function getPrefixBoostMult(fishRarityIdx, prefixIdx) {
    if (prefixIdx >= 4) return PREFIX_BOOST_MULT[prefixIdx - 4] ?? 1.5;
    const gap = prefixIdx - fishRarityIdx;
    if (gap <= 1) return 1.1;
    if (gap === 2) return 1.15;
    return 1.2;
}

/** Malus adoucis quand le préfixe est moins rare que le poisson (écart 1 → ×0,9). */
function getPrefixDebuffMult(fishRarityIdx, prefixIdx) {
    const gap = fishRarityIdx - prefixIdx;
    if (gap <= 1) return 0.9;
    return Math.max(0.8, 0.9 - (gap - 1) * 0.02);
}

/** Poids de tirage : ligne = rareté du poisson, colonne = tier du préfixe (Table 2). */
const PREFIX_ROLL_WEIGHTS = [
    [4000, 1200, 350, 80, 25, 8, 1],
    [600, 3500, 900, 200, 50, 12, 2],
    [120, 500, 3200, 700, 150, 30, 4],
    [40, 150, 450, 2800, 600, 80, 8],
    [15, 50, 120, 400, 2500, 350, 15],
    [8, 20, 45, 100, 300, 2200, 40],
    [25, 40, 60, 90, 120, 200, 1800]
];

function rollPrefixTierIndex(fishRarityIdx) {
    const row = PREFIX_ROLL_WEIGHTS[fishRarityIdx] || PREFIX_ROLL_WEIGHTS[0];
    const total = row.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < row.length; i++) {
        roll -= row[i];
        if (roll <= 0) return i;
    }
    return 0;
}

/** Préfixe même tier = ×1 ; plus rare = bonus ; moins rare = malus adouci. */
function getPrefixValueMult(fishRarityIdx, prefixIdx) {
    if (prefixIdx === fishRarityIdx) return 1;
    if (prefixIdx < fishRarityIdx) return getPrefixDebuffMult(fishRarityIdx, prefixIdx);
    return getPrefixBoostMult(fishRarityIdx, prefixIdx);
}

function rollFishPrefix(fishRarityIdx) {
    const prefixIdx = rollPrefixTierIndex(fishRarityIdx);
    const tierName = RARITIES[prefixIdx].name;
    const words = FISH_DATA.prefixes[tierName] || FISH_DATA.prefixes['Commun'];
    const prefixWord = words[Math.floor(Math.random() * words.length)];
    return {
        prefixTier: tierName,
        prefixTierClass: RARITIES[prefixIdx].class,
        prefixMult: getPrefixValueMult(fishRarityIdx, prefixIdx),
        prefixWord
    };
}

function getRarityClassFromTierName(tierName) {
    const r = RARITIES.find(x => x.name === tierName);
    return r?.class || 'rarity-0';
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** HTML : seul le nom du tier du préfixe est coloré (rarity-0 … rarity-6). */
function buildPrefixNoteHTML(fish) {
    const pMult = getFishPrefixMult(fish);
    if (fish?.prefixTier) {
        const tierClass = fish.prefixTierClass || getRarityClassFromTierName(fish.prefixTier);
        return ` · Préfixe <span class="prefix-tier-label rarity-text ${tierClass}">${escapeHtml(fish.prefixTier)}</span> (×${pMult})`;
    }
    if (pMult !== 1) return ` · Préfixe (×${pMult})`;
    return '';
}

function getFishPrefixMult(fish) {
    if (typeof fish?.prefixMult === 'number' && fish.prefixMult > 0) return fish.prefixMult;
    return 1;
}

function getZoneFishValueMult(zoneId) {
    return ZONE_FISH_VALUE_MULT[zoneId] || 1;
}

function computeFishSellValue(rarityIdx, mutationMult, prefixMult, zoneId = state.currentZone) {
    const zoneMult = getZoneFishValueMult(zoneId);
    return parseFloat((calculateFishValue(rarityIdx) * zoneMult * mutationMult * prefixMult).toFixed(2));
}

const MUTATION_ROLL_CHANCE = 1 / 15;
const MUTATION_BONUS_BY_CYCLE = { 0: 0, 1: 0.03, 2: 0.05 };

const MUTATIONS = [
    { name: "Normal", multiplier: 1, filter: 'none', color: 'transparent', effect: 'none' },
    { name: "Albinos", weight: 220, multiplier: 2, filter: 'brightness(2) saturate(0)', color: '#ffffff', effect: 'glow' },
    { name: "Glacé", weight: 180, multiplier: 2.5, filter: 'brightness(1.3) saturate(0.6) hue-rotate(180deg)', color: '#aeefff', effect: 'ice' },
    { name: "Doré", weight: 160, multiplier: 3, filter: 'sepia(0.5) saturate(2) brightness(1.2)', color: '#ffd700', effect: 'gold' },
    { name: "Toxique", weight: 100, multiplier: 3.5, filter: 'hue-rotate(80deg) saturate(3) brightness(0.9)', color: '#39ff14', effect: 'toxic' },
    { name: "Corail", weight: 80, multiplier: 4, filter: 'hue-rotate(-30deg) saturate(2.5) brightness(1.1)', color: '#ff6b9d', effect: 'coral' },
    { name: "Enflammé", weight: 70, multiplier: 5, filter: 'contrast(1.5) saturate(3) hue-rotate(-20deg)', color: '#ff4500', effect: 'fire' },
    { name: "Spectral", weight: 60, multiplier: 6, filter: 'brightness(1.6) saturate(0.2) contrast(0.9)', color: '#e0e8ff', effect: 'ghost' },
    { name: "Sombre", weight: 50, multiplier: 7, filter: 'brightness(0.25) contrast(1.5) saturate(0)', color: '#1a1a2e', effect: 'shadow' },
    { name: "Électrique", weight: 40, multiplier: 8, filter: 'brightness(1.4) saturate(2) hue-rotate(200deg)', color: '#00bfff', effect: 'electric' },
    { name: "Angélique", weight: 30, multiplier: 10, filter: 'brightness(1.2) saturate(0.8)', color: '#fffacd', effect: 'aura' },
    { name: "Arc-en-ciel", weight: 22, multiplier: 12, filter: 'saturate(2) brightness(1.15)', color: '#ff00ff', effect: 'rainbow' },
    { name: "Cristallin", weight: 18, multiplier: 18, filter: 'brightness(1.5) saturate(0.5) contrast(1.2)', color: '#e0ffff', effect: 'crystal' },
    { name: "Néon", weight: 14, multiplier: 15, filter: 'hue-rotate(90deg) saturate(5) brightness(1.2)', color: '#00ff00', effect: 'neon' },
    { name: "Abyssal", weight: 5, multiplier: 50, filter: 'brightness(0.5) hue-rotate(250deg) saturate(2)', color: '#4b0082', effect: 'void' },
    { name: "Cosmique", weight: 3, multiplier: 100, filter: 'brightness(0.85) hue-rotate(270deg) saturate(1.5)', color: '#9370db', effect: 'cosmic' }
];

function pickWeightedMutation(pool) {
    const total = pool.reduce((sum, m) => sum + m.weight, 0);
    let roll = Math.random() * total;
    for (const m of pool) {
        if (roll < m.weight) return m;
        roll -= m.weight;
    }
    return pool[pool.length - 1];
}

function getMutationRollChance() {
    const bonus = MUTATION_BONUS_BY_CYCLE[state.currentCycle] || 0;
    return Math.min(MUTATION_ROLL_CHANCE + bonus, 1);
}

function rollMutation() {
    if (Math.random() >= getMutationRollChance()) return MUTATIONS[0];
    return pickWeightedMutation(MUTATIONS.filter(m => m.name !== 'Normal'));
}

function getRodCatchRates(rod) {
    const luck = Math.min(Math.max(0, rod?.luck ?? 0), 100);
    const defaults = {
        legendaire: LEGENDARY_CHANCE_BAMBOO_PCT * (1 + luck * 0.16),
        mythique: 0.003 * (1 + luck * 0.075),
        divin: 0.0008 * (1 + luck * 0.06)
    };
    const r = rod?.catchRates || {};
    return {
        legendaire: Math.max(0, (r.legendaire ?? defaults.legendaire) * LEGENDARY_CATCH_MULT),
        mythique: Math.max(0, r.mythique ?? defaults.mythique),
        divin: Math.max(0, r.divin ?? defaults.divin)
    };
}

function formatCatchRatePct(pct) {
    if (pct >= 1) return pct.toFixed(2).replace(/\.?0+$/, '') + '%';
    if (pct >= 0.1) return pct.toFixed(2) + '%';
    return pct.toFixed(3) + '%';
}

function formatFishSellPrice(value) {
    const v = Number(value);
    if (!Number.isFinite(v)) return '0 $';
    return v + ' $';
}

/**
 * Tirage de rareté : d'abord % Lég./Myth./Divin de la canne, sinon pool Commun → Épique (luck = bonus Épique).
 */
function rollFishRarityIndex(rodOrLuck = 0) {
    const rod = typeof rodOrLuck === 'object' && rodOrLuck !== null
        ? rodOrLuck
        : { luck: Number(rodOrLuck) || 0 };
    const luck = Math.min(Math.max(0, rod.luck ?? 0), 100);
    const rates = getRodCatchRates(rod);
    const rollPct = Math.random() * 100;

    if (rollPct < rates.divin) return 6;
    if (rollPct < rates.divin + rates.mythique) return 5;
    if (rollPct < rates.divin + rates.mythique + rates.legendaire) return 4;

    let totalWeight = 0;
    const weights = [];
    for (let i = 0; i <= 3; i++) {
        let w = RARITY_WEIGHTS[i];
        if (i === 2) w *= (1 + luck * 0.045);
        if (i === 3) w *= (1 + luck * 0.095);
        weights.push(w);
        totalWeight += w;
    }

    let roll = Math.random() * totalWeight;
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (roll <= sum) return i;
    }
    return 0;
}

function safeParse(key, defaultValue) {
    const data = localStorage.getItem(key);
    try { return data ? JSON.parse(data) : defaultValue; } catch (e) { return defaultValue; }
}

function getSavePayload() {
    return {
        totalScore: state.totalScore,
        money: state.money,
        maxMoney: state.maxMoney,
        totalFishesCaught: state.totalFishesCaught,
        highScore: state.highScore,
        inventory: state.inventory,
        unlockedAquariums: state.unlockedAquariums,
        ownedRods: state.ownedRods,
        equippedRod: state.equippedRod,
        discoveredFishes: state.discoveredFishes,
        keys: state.keys,
        currentZone: state.currentZone,
        bestFish: state.bestFish || null,
        ownedCosmetics: state.ownedCosmetics || ['default'],
        equippedCosmetic: state.equippedCosmetic || 'default',
        unlockedAchievements: state.unlockedAchievements || [],
        ownedTitleIds: state.ownedTitleIds || [],
        ownedColorIds: state.ownedColorIds || [],
        equippedTitleId: state.equippedTitleId || null,
        equippedColorId: state.equippedColorId || null,
        achievementStats: state.achievementStats || null,
        commonStreakCurrent: state.commonStreakCurrent || 0,
        commonStreakBest: state.commonStreakBest || 0
    };
}

function persistGameLocal() {
    normalizeInventory();
    normalizeUnlockedAquariums();
    localStorage.setItem('stepFishingTotalScore', state.totalScore);
    localStorage.setItem('stepFishingMoney', state.money);
    localStorage.setItem('stepFishingMaxMoney', state.maxMoney);
    localStorage.setItem('stepFishingTotalCaught', state.totalFishesCaught);
    localStorage.setItem('stepFishingHighScore', state.highScore);
    localStorage.setItem('stepFishingInventory', JSON.stringify(state.inventory));
    localStorage.setItem('stepFishingUnlocked', JSON.stringify(state.unlockedAquariums));
    localStorage.setItem('stepFishingOwnedRods', JSON.stringify(state.ownedRods));
    localStorage.setItem('stepFishingEquippedRod', state.equippedRod);
    localStorage.setItem('stepFishingDiscovered', JSON.stringify(state.discoveredFishes));
    localStorage.setItem('stepFishingKeys', state.keys);
    localStorage.setItem('stepFishingCurrentZone', state.currentZone);
    if (state.bestFish) {
        localStorage.setItem('stepFishingBestFish', JSON.stringify(state.bestFish));
    }
    localStorage.setItem('stepFishingOwnedCosmetics', JSON.stringify(state.ownedCosmetics || ['default']));
    localStorage.setItem('stepFishingEquippedCosmetic', state.equippedCosmetic || 'default');
    localStorage.setItem('stepFishingAchievements', JSON.stringify(state.unlockedAchievements || []));
    localStorage.setItem('stepFishingAchTitles', JSON.stringify(state.ownedTitleIds || []));
    localStorage.setItem('stepFishingAchColors', JSON.stringify(state.ownedColorIds || []));
    localStorage.setItem('stepFishingEquippedAchTitle', state.equippedTitleId || '');
    localStorage.setItem('stepFishingEquippedAchColor', state.equippedColorId || '');
    localStorage.setItem('stepFishingAchStats', JSON.stringify(state.achievementStats || {}));
    localStorage.setItem('stepFishingCommonStreakCur', String(state.commonStreakCurrent || 0));
    localStorage.setItem('stepFishingCommonStreakBest', String(state.commonStreakBest || 0));
    updateAquariumCapacityHUD();
}

let cloudSaveTimer = null;
function persistGame() {
    persistGameLocal();
    if (window.StepFishAuth?.isLoggedIn()) {
        clearTimeout(cloudSaveTimer);
        cloudSaveTimer = setTimeout(() => StepFishAuth.saveToCloud(getSavePayload()), 1000);
    }
}

function applySaveData(data) {
    if (!data) return;
    state.totalScore = parseFloat(data.totalScore) || 0;
    state.money = parseFloat(data.money) || 0;
    state.maxMoney = parseFloat(data.maxMoney) || 0;
    state.totalFishesCaught = parseInt(data.totalFishesCaught, 10) || 0;
    state.highScore = data.highScore || 0;
    state.inventory = data.inventory || { aq0: [] };
    state.unlockedAquariums = data.unlockedAquariums || [0];
    normalizeInventory();
    normalizeUnlockedAquariums();
    state.ownedRods = data.ownedRods || [0];
    state.equippedRod = parseInt(data.equippedRod, 10) || 0;
    state.discoveredFishes = data.discoveredFishes || [];
    state.keys = parseInt(data.keys, 10) || 0;
    state.currentZone = data.currentZone || 'lac';
    state.bestFish = data.bestFish || null;
    if (window.StepFishCosmetics) {
        window.StepFishCosmetics.loadFromSave(data);
    } else {
        state.ownedCosmetics = Array.isArray(data.ownedCosmetics) ? data.ownedCosmetics : ['default'];
        state.equippedCosmetic = data.equippedCosmetic || 'default';
    }
    if (window.StepFishAchievements) {
        window.StepFishAchievements.loadFromSave(data);
    } else {
        state.unlockedAchievements = Array.isArray(data.unlockedAchievements) ? data.unlockedAchievements : [];
        state.ownedTitleIds = Array.isArray(data.ownedTitleIds) ? data.ownedTitleIds : [];
        state.ownedColorIds = Array.isArray(data.ownedColorIds) ? data.ownedColorIds : [];
        state.equippedTitleId = data.equippedTitleId || null;
        state.equippedColorId = data.equippedColorId || null;
        state.achievementStats = data.achievementStats || null;
    }
    state.commonStreakCurrent = parseInt(data.commonStreakCurrent, 10) || 0;
    state.commonStreakBest = parseInt(data.commonStreakBest, 10) || 0;
    if (!state.bestFish?.value) {
        const derived = findBestFishInInventory(state.inventory);
        if (derived) state.bestFish = derived;
    }
    ensureFishUidsInInventory();
    updateProgression();
    persistGameLocal();
    updateMoneyDisplay();
    updateKeysDisplay();
    ensureValidZone();
    updateZoneBackgrounds();
    updateFishingRodDisplay();
}

window.getSavePayload = getSavePayload;
window.getLocalSavePayload = getSavePayload;
window.applySaveData = applySaveData;

let state = {
    score: 0, 
    totalScore: parseFloat(localStorage.getItem('stepFishingTotalScore')) || 0,
    money: parseFloat(localStorage.getItem('stepFishingMoney')) || 0,
    maxMoney: parseFloat(localStorage.getItem('stepFishingMaxMoney')) || 0,
    totalFishesCaught: parseInt(localStorage.getItem('stepFishingTotalCaught')) || 0,
    level: 1, 
    prestige: 0, 
    timeLeft: 30, 
    gameActive: false, 
    currentPhase: 'MENU',
    currentCycle: 0,
    highScore: localStorage.getItem('stepFishingHighScore') || 0,
    inventory: safeParse('stepFishingInventory', { "aq0": [] }),
    unlockedAquariums: safeParse('stepFishingUnlocked', [0]),
    currentAqIndex: 0,
    combo: 0, 
    reelProgress: 20, 
    fishPos: 100, 
    fishTargetY: 100, 
    playerPos: 100, 
    currentFish: null,
    /** UID du poisson affiché sur l'écran de capture (conservé après stopFishingSession). */
    catchModalFishUid: null,
    ownedRods: safeParse('stepFishingOwnedRods', [0]), 
    equippedRod: parseInt(localStorage.getItem('stepFishingEquippedRod')) || 0,
    discoveredFishes: safeParse('stepFishingDiscovered', []),
    bestFish: safeParse('stepFishingBestFish', null),
    currentZone: localStorage.getItem('stepFishingCurrentZone') || 'lac',
    keys: parseInt(localStorage.getItem('stepFishingKeys')) || 0,
    ownedCosmetics: safeParse('stepFishingOwnedCosmetics', ['default']),
    equippedCosmetic: localStorage.getItem('stepFishingEquippedCosmetic') || 'default',
    unlockedAchievements: safeParse('stepFishingAchievements', []),
    ownedTitleIds: safeParse('stepFishingAchTitles', []),
    ownedColorIds: safeParse('stepFishingAchColors', []),
    equippedTitleId: localStorage.getItem('stepFishingEquippedAchTitle') || null,
    equippedColorId: localStorage.getItem('stepFishingEquippedAchColor') || null,
    achievementStats: safeParse('stepFishingAchStats', null),
    commonStreakCurrent: parseInt(localStorage.getItem('stepFishingCommonStreakCur'), 10) || 0,
    commonStreakBest: parseInt(localStorage.getItem('stepFishingCommonStreakBest'), 10) || 0
};

const getEl = (id) => document.getElementById(id);
const elements = {
    screens: { 
        menu: getEl('screen-menu'), 
        inventory: getEl('screen-inventory'), 
        game: getEl('screen-game'), 
        gameOver: getEl('screen-game-over'), 
        profile: getEl('profile-modal'), 
        fishModal: getEl('fish-modal'), 
        catchModal: getEl('catch-modal'), 
        shop: getEl('screen-shop'), 
        equipment: getEl('screen-equipment'),
        index: getEl('screen-index'),
        map: getEl('screen-map'),
        achievements: getEl('screen-achievements')
    },
    score: getEl('current-score'), walletBalance: getEl('wallet-balance'), walletGame: getEl('wallet-game'), keysBalance: getEl('keys-balance'), userLevel: getEl('user-level'), userPrestige: getEl('user-prestige'), combo: getEl('combo-count'), comboDisplay: getEl('combo-display'), timer: getEl('time-left'), ocean: getEl('ocean'), biteIndicator: getEl('bite-indicator'), reelContainer: getEl('reel-container'), fishTarget: getEl('fish-target'), playerCursor: getEl('player-cursor'), progressFill: getEl('progress-fill'), fishName: getEl('fish-name-display'), fishVisual: getEl('fish-visual'), gameLog: getEl('game-log'), aqViewport: getEl('aquarium-viewport'), fishLayer: getEl('fish-layer'), aqTitle: getEl('aq-title'), aqSlots: getEl('aq-slots'), aqLock: getEl('aq-lock-screen'), aqCost: getEl('aq-cost'), aqCapacityHud: getEl('aq-capacity-hud'), modalFishVisual: getEl('modal-fish-visual'), modalFishName: getEl('modal-fish-name'), modalFishRarity: getEl('modal-fish-rarity'), modalFishPrice: getEl('modal-fish-price'), profLevel: getEl('prof-level'), profPrestige: getEl('prof-prestige'), profFishes: getEl('prof-fishes'), profMaxMoney: getEl('prof-max-money'), profTotalScore: getEl('prof-total-score'), catchTitle: getEl('catch-title'), catchText: getEl('catch-text'), catchVisual: getEl('catch-visual'), catchFishPrice: getEl('catch-fish-price')
};

function calculateFishValue(rarityIdx) {
    const rarity = RARITIES[rarityIdx];
    return parseFloat((Math.random() * (rarity.maxPrice - rarity.minPrice) + rarity.minPrice).toFixed(2));
}

/** Poids min/max (kg) par indice de rareté */
const FISH_WEIGHT_KG_BY_RARITY = [
    [0.08, 0.50],
    [0.25, 1.40],
    [0.60, 3.50],
    [1.50, 7.00],
    [4.00, 12.00],
    [8.00, 18.00],
    [12.00, 25.00]
];

const AQ_WEIGHT_MIN_KG = 0.08;
const AQ_WEIGHT_MAX_KG = 15;
const AQ_FISH_MIN_PX = 32;
const AQ_FISH_MAX_PX = 128;

function rollFishWeight(rarityIdx) {
    const [min, max] = FISH_WEIGHT_KG_BY_RARITY[rarityIdx] || FISH_WEIGHT_KG_BY_RARITY[0];
    return parseFloat((min + Math.random() * (max - min)).toFixed(2));
}

function formatFishWeight(kg) {
    return Number(kg || 0).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' kg';
}

function getFishRarityIndex(fish) {
    if (typeof fish?.id === 'number' && fish.id >= 0 && fish.id < RARITIES.length) return fish.id;
    const idx = RARITIES.findIndex(r => r.class === fish?.class);
    return idx >= 0 ? idx : 0;
}

function getFishWeightKg(fish) {
    if (typeof fish?.weight === 'number' && fish.weight > 0) return fish.weight;
    const [min, max] = FISH_WEIGHT_KG_BY_RARITY[getFishRarityIndex(fish)] || FISH_WEIGHT_KG_BY_RARITY[0];
    return parseFloat(((min + max) / 2).toFixed(2));
}

function aquariumFishWidthPx(kg) {
    const w = Math.max(AQ_WEIGHT_MIN_KG, Math.min(AQ_WEIGHT_MAX_KG, kg || AQ_WEIGHT_MIN_KG));
    const t = (Math.log(w) - Math.log(AQ_WEIGHT_MIN_KG)) / (Math.log(AQ_WEIGHT_MAX_KG) - Math.log(AQ_WEIGHT_MIN_KG));
    return Math.round(AQ_FISH_MIN_PX + Math.max(0, Math.min(1, t)) * (AQ_FISH_MAX_PX - AQ_FISH_MIN_PX));
}

function getRarityNameFromClass(className) {
    const r = RARITIES.find(x => x.class === className);
    return r ? r.name : 'Inconnu';
}

/** Poisson « Commun » (rarity-0), hors clé / coffre. */
function isCommonCatchFish(fish) {
    if (!fish || fish.isKey || fish.isTreasureBox) return false;
    return fish.id === 0 || fish.class === 'rarity-0';
}

/** Série de Communs pêchés d'affilée (échec ou autre rareté = reset). */
function recordCommonCatchStreak(fish, success) {
    const prevCur = state.commonStreakCurrent || 0;
    const prevBest = state.commonStreakBest || 0;
    if (!success) {
        state.commonStreakCurrent = 0;
    } else if (isCommonCatchFish(fish)) {
        state.commonStreakCurrent = prevCur + 1;
        if (state.commonStreakCurrent > prevBest) {
            state.commonStreakBest = state.commonStreakCurrent;
        }
    } else {
        state.commonStreakCurrent = 0;
    }
    if (state.commonStreakCurrent !== prevCur || state.commonStreakBest !== prevBest) {
        persistGameLocal();
        if (window.StepFishAuth?.isLoggedIn()) {
            clearTimeout(cloudSaveTimer);
            cloudSaveTimer = setTimeout(() => StepFishAuth.saveToCloud(getSavePayload()), 1000);
        }
    }
}

function computeLevelFromScore(totalScore) {
    return Math.floor(Math.pow((totalScore || 0) / 10, 0.7)) + 1;
}

function computePrestigeFromLevel(level) {
    return Math.floor((level || 1) / 100);
}

function getZoneMinLevel(zone) {
    return zone?.minLevel || 1;
}

function zoneHasCatchableFish(zone) {
    if (!zone?.library) return false;
    return Object.keys(zone.library).some(folder => (zone.library[folder] || []).length > 0);
}

function getZoneFishImagePaths(zoneId) {
    const zone = ZONE_DATA.find(z => z.id === zoneId);
    if (!zone?.library) return [];
    const paths = [];
    Object.keys(zone.library).forEach(folder => {
        (zone.library[folder] || []).forEach(file => {
            paths.push(`assets/fish/${folder}/${file}`);
        });
    });
    return paths;
}

/** Espèces du lac requises pour l'océan (hors Mythique et Divin). */
const LAC_OCEAN_UNLOCK_SKIP = ['mythique', 'divin'];

function getLacFishImagePathsForOceanUnlock() {
    const zone = ZONE_DATA.find(z => z.id === 'lac');
    if (!zone?.library) return [];
    const paths = [];
    Object.keys(zone.library).forEach(folder => {
        if (LAC_OCEAN_UNLOCK_SKIP.includes(folder)) return;
        (zone.library[folder] || []).forEach(file => {
            paths.push(`assets/fish/${folder}/${file}`);
        });
    });
    return paths;
}

function getLacFishCount() {
    return getLacFishImagePathsForOceanUnlock().length;
}

function getDiscoveredLacCount() {
    const required = getLacFishImagePathsForOceanUnlock();
    return required.filter(path => state.discoveredFishes.includes(path)).length;
}

function hasDiscoveredAllLacFish() {
    const required = getLacFishImagePathsForOceanUnlock();
    if (!required.length) return true;
    return required.every(path => state.discoveredFishes.includes(path));
}

/** Espèces de l'océan requises pour l'Abysse (hors Mythique et Divin). */
const OCEAN_ABYSS_UNLOCK_SKIP = ['mythique', 'divin'];

function getOceanFishImagePathsForAbyssUnlock() {
    const zone = ZONE_DATA.find(z => z.id === 'ocean');
    if (!zone?.library) return [];
    const paths = [];
    Object.keys(zone.library).forEach(folder => {
        if (OCEAN_ABYSS_UNLOCK_SKIP.includes(folder)) return;
        (zone.library[folder] || []).forEach(file => {
            paths.push(`assets/fish/${folder}/${file}`);
        });
    });
    return paths;
}

function getOceanFishCountForAbyss() {
    return getOceanFishImagePathsForAbyssUnlock().length;
}

function getDiscoveredOceanCountForAbyss() {
    const required = getOceanFishImagePathsForAbyssUnlock();
    return required.filter(path => state.discoveredFishes.includes(path)).length;
}

function hasDiscoveredAllOceanFish() {
    const required = getOceanFishImagePathsForAbyssUnlock();
    if (!required.length) return true;
    return required.every(path => state.discoveredFishes.includes(path));
}

function getAbyssFishImagePathsForIndex() {
    const zone = ZONE_DATA.find(z => z.id === 'abyss');
    if (!zone?.library) return [];
    const paths = [];
    Object.keys(zone.library).forEach(folder => {
        (zone.library[folder] || []).forEach(file => {
            paths.push(`assets/fish/${folder}/${file}`);
        });
    });
    return paths;
}

function getAbyssFishCount() {
    return getAbyssFishImagePathsForIndex().length;
}

function getDiscoveredAbyssCount() {
    const required = getAbyssFishImagePathsForIndex();
    return required.filter(path => state.discoveredFishes.includes(path)).length;
}

function hasDiscoveredAllAbyssFish() {
    const required = getAbyssFishImagePathsForIndex();
    if (!required.length) return true;
    return required.every(path => state.discoveredFishes.includes(path));
}

function getAllFishImagePathsInGame() {
    const set = new Set();
    ZONE_DATA.forEach(z => {
        getZoneFishImagePaths(z.id).forEach(p => set.add(p));
    });
    return [...set];
}

function getAllFishSpeciesCount() {
    return getAllFishImagePathsInGame().length;
}

function hasDiscoveredAllFishInGame() {
    const all = getAllFishImagePathsInGame();
    if (!all.length) return true;
    return all.every(path => state.discoveredFishes.includes(path));
}

function isZoneUnlocked(zone) {
    if (!zone) return false;
    if (state.level < getZoneMinLevel(zone)) return false;
    if (zone.id === 'ocean') return hasDiscoveredAllLacFish();
    if (zone.id === 'abyss') return hasDiscoveredAllOceanFish();
    return true;
}

function getZoneLockMessage(zone) {
    if (!zone) return '';
    const minLvl = getZoneMinLevel(zone);
    if (state.level < minLvl) {
        return `Niveau ${minLvl} requis · tu es niveau ${state.level}`;
    }
    if (zone.id === 'ocean' && !hasDiscoveredAllLacFish()) {
        const total = getLacFishCount();
        const found = getDiscoveredLacCount();
        return `Niveau 10 OK · Lac : ${found}/${total} espèces (sans Mythique ni Divin)`;
    }
    if (zone.id === 'abyss' && !hasDiscoveredAllOceanFish()) {
        const total = getOceanFishCountForAbyss();
        const found = getDiscoveredOceanCountForAbyss();
        return `Niveau 100 OK · Océan : ${found}/${total} espèces (sans Mythique ni Divin)`;
    }
    return '';
}

function ensureValidZone() {
    const zone = ZONE_DATA.find(z => z.id === state.currentZone);
    if (zone && isZoneUnlocked(zone)) return;
    state.currentZone = 'lac';
    persistGameLocal();
}

function findBestFishInInventory(inventory) {
    let best = null;
    for (const fishes of Object.values(inventory || {})) {
        if (!Array.isArray(fishes)) continue;
        for (const fish of fishes) {
            if (!fish || fish.isKey) continue;
            if (!best || (fish.value || 0) > (best.value || 0)) {
                best = {
                    name: fish.name || 'Poisson',
                    value: fish.value || 0,
                    weight: getFishWeightKg(fish),
                    class: fish.class || '',
                    rarity: getRarityNameFromClass(fish.class),
                    img: fish.img || '',
                    mutation: fish.mutation || 'Normal'
                };
            }
        }
    }
    return best;
}

function updateBestFishRecord(fish) {
    if (!fish || fish.isKey) return;
    const entry = {
        name: fish.name,
        value: fish.value,
        weight: getFishWeightKg(fish),
        class: fish.class,
        rarity: getRarityNameFromClass(fish.class),
        img: fish.img || '',
        mutation: fish.mutation || 'Normal'
    };
    if (!state.bestFish || entry.value > (state.bestFish.value || 0)) {
        state.bestFish = entry;
    }
}

function updateMoneyDisplay() {
    const formatted = state.money.toLocaleString('en-US', {minimumFractionDigits: 2});
    if(elements.walletBalance) elements.walletBalance.innerText = formatted;
    if(elements.walletGame) elements.walletGame.innerText = formatted;
    if(state.money > state.maxMoney) state.maxMoney = state.money;
    persistGame();
}

function updateKeysDisplay() {
    const text = String(state.keys);
    if (elements.keysBalance) elements.keysBalance.innerText = text;
    const crateKeys = document.getElementById('crate-keys-count');
    if (crateKeys) {
        crateKeys.innerHTML = `<img src="${KEY_IMG}" class="key-icon-inline" alt="" width="22" height="22"> Clés : <strong>${state.keys}</strong>`;
    }
    persistGame();
    updateCrateUI();
}

function pickWeightedLoot(pool) {
    const total = pool.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of pool) {
        if (roll < item.weight) return item;
        roll -= item.weight;
    }
    return pool[pool.length - 1];
}

function rollCrateRod() {
    const entries = Object.entries(CRATE_ROD_WEIGHTS);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = Math.random() * total;
    for (const [rarity, weight] of entries) {
        if (roll < weight) {
            const rods = CRATE_RODS.filter(r => r.rarity === rarity);
            const rod = rods[Math.floor(Math.random() * rods.length)];
            return { type: 'rod', rod, label: rod.name, color: rod.color };
        }
        roll -= weight;
    }
    const fallback = CRATE_RODS[0];
    return { type: 'rod', rod: fallback, label: fallback.name, color: fallback.color };
}

function getCrateProbabilities() {
    const moneyTotal = CRATE_MONEY_LOOT.reduce((sum, item) => sum + item.weight, 0);
    const grandTotal = moneyTotal + CRATE_ROD_POOL_WEIGHT;
    const rodWeightSum = Object.values(CRATE_ROD_WEIGHTS).reduce((a, b) => a + b, 0);
    return {
        grandTotal,
        moneyPoolPct: (moneyTotal / grandTotal) * 100,
        rodPoolPct: (CRATE_ROD_POOL_WEIGHT / grandTotal) * 100,
        money: CRATE_MONEY_LOOT.map(item => ({
            label: item.label,
            color: item.color,
            percent: (item.weight / grandTotal) * 100
        })),
        rods: CRATE_RODS.map(rod => ({
            rod,
            percent: (CRATE_ROD_POOL_WEIGHT / grandTotal)
                * ((CRATE_ROD_WEIGHTS[rod.rarity] || 0) / rodWeightSum) * 100
        }))
    };
}

function formatCratePercent(n) {
    if (n >= 10) return n.toFixed(1).replace('.', ',') + ' %';
    if (n >= 1) return n.toFixed(2).replace('.', ',') + ' %';
    return n.toFixed(2).replace('.', ',') + ' %';
}

function renderCrateLootInfo() {
    const el = document.getElementById('crate-loot-info');
    if (!el) return;
    const p = getCrateProbabilities();
    const keyChanceLabel = `1 chance sur ${Math.round(1 / KEY_CATCH_CHANCE)} par poisson pêché`;
    const treasureHints = TREASURE_BOXES.map(b =>
        `${b.name} : 1/${Math.round(1 / b.catchChance)}`
    ).join(' · ');

    const moneyRows = p.money.map(m => `
        <li class="crate-loot-row">
            <span class="crate-loot-name" style="color:${m.color}">${m.label}</span>
            <span class="crate-loot-pct">${formatCratePercent(m.percent)}</span>
        </li>`).join('');

    const rodRows = p.rods.map(({ rod, percent }) => `
        <li class="crate-loot-row crate-loot-row-rod">
            <img src="${rod.img}" alt="" class="crate-loot-thumb" width="28" height="28">
            <span class="crate-loot-name" style="color:${rod.color}">${rod.name}</span>
            <span class="crate-loot-rarity" style="color:${rod.color}">${rod.rarity}</span>
            <span class="crate-loot-pct">${formatCratePercent(percent)}</span>
        </li>`).join('');

    el.innerHTML = `
        <p class="crate-loot-hint">Clé mystère : ${keyChanceLabel}</p>
        <p class="crate-loot-hint">Coffres pêchables : ${treasureHints}</p>
        <div class="crate-loot-cols">
            <section class="crate-loot-section">
                <h3 class="crate-loot-heading">💰 Argent <span class="crate-loot-pool-pct">${formatCratePercent(p.moneyPoolPct)}</span></h3>
                <ul class="crate-loot-list">${moneyRows}</ul>
            </section>
            <section class="crate-loot-section">
                <h3 class="crate-loot-heading">🎣 Cannes exclusives <span class="crate-loot-pool-pct">${formatCratePercent(p.rodPoolPct)}</span></h3>
                <ul class="crate-loot-list crate-loot-list-rods">${rodRows}</ul>
            </section>
        </div>`;
}

function rollCrateLoot() {
    const moneyTotal = CRATE_MONEY_LOOT.reduce((sum, item) => sum + item.weight, 0);
    const grandTotal = moneyTotal + CRATE_ROD_POOL_WEIGHT;
    if (Math.random() * grandTotal >= moneyTotal) return rollCrateRod();
    const moneyLoot = pickWeightedLoot(CRATE_MONEY_LOOT);
    return {
        type: 'money',
        amount: moneyLoot.amount,
        label: moneyLoot.label,
        color: moneyLoot.color
    };
}

function getCrateItemHTML(loot) {
    if (loot.type === 'money') {
        return `<div class="crate-money-display" style="color:${loot.color}">${loot.label}</div>
            <div class="rarity-tag" style="color:${loot.color}">Argent</div>`;
    }
    return `<img src="${loot.rod.img}" alt="${loot.rod.name}">
        <div class="rarity-tag" style="color:${loot.color}">${loot.rod.rarity}</div>`;
}

function getRodMinPrestige(rodId) {
    const crateRod = CRATE_RODS.find(r => r.id === Number(rodId));
    return crateRod?.minPrestige || 0;
}

function canEquipRod(rodId) {
    const minP = getRodMinPrestige(rodId);
    return (state.prestige || 0) >= minP;
}

function ensureValidEquippedRod() {
    if (canEquipRod(state.equippedRod)) return;
    const owned = state.ownedRods.map(Number).filter(id => canEquipRod(id));
    const fallback = owned.length ? Math.max(...owned) : 0;
    if (Number(state.equippedRod) !== fallback) {
        state.equippedRod = fallback;
        updateFishingRodDisplay();
    }
}

function updateCrateUI() {
    const btn = document.getElementById('btn-open-crate');
    if (btn) {
        btn.disabled = state.keys < 1;
        btn.innerText = state.keys < 1 ? 'Pas de clé disponible' : 'Ouvrir le Coffre (1 clé)';
    }
}

function applyCrateReward(loot) {
    if (loot.type === 'money') {
        state.money += loot.amount;
        updateMoneyDisplay();
        addLog(`Coffre : ${loot.label} obtenus !`, 'epic');
        alert(`💰 BRAVO ! Vous avez gagné ${loot.label} !`);
        return;
    }
    addLog(`FÉLICITATIONS ! Canne obtenue : ${loot.rod.name} !`, 'epic');
    if (!state.ownedRods.includes(loot.rod.id)) {
        state.ownedRods.push(loot.rod.id);
    }
    const minP = getRodMinPrestige(loot.rod.id);
    if (canEquipRod(loot.rod.id)) {
        state.equippedRod = loot.rod.id;
        persistGame();
        updateFishingRodDisplay();
        alert(`🎉 BRAVO ! Canne débloquée et équipée : ${loot.rod.name} (${loot.rod.rarity})`);
    } else {
        ensureValidEquippedRod();
        persistGame();
        alert(`🎉 Canne débloquée : ${loot.rod.name} (${loot.rod.rarity})\n🔒 Équipable à partir du prestige ${minP} (actuel : ${state.prestige}).`);
        addLog(`🔒 ${loot.rod.name} : équipable au prestige ${minP}.`, 'system');
    }
}

let isTreasureOpening = false;

function formatTreasureMoney(n) {
    const v = Number(n) || 0;
    if (Number.isInteger(v)) return String(v);
    return v.toFixed(2).replace('.', ',');
}

function buildTreasureReelStrip(pool, winEntry, count = 50, winIndex = 45) {
    const strip = [];
    for (let i = 0; i < count; i++) {
        strip.push(i === winIndex ? winEntry : pickWeightedLoot(pool));
    }
    return strip;
}

function getTreasureReelItemHTML(entry) {
    const tag = entry.tag || 'Argent';
    return `<div class="crate-money-display" style="color:${entry.color}">${entry.label}</div>
        <div class="rarity-tag" style="color:${entry.color}">${tag}</div>`;
}

function runTreasureReelSpin(listEl, strip, winIndex, durationMs) {
    return new Promise(resolve => {
        if (!listEl) {
            resolve();
            return;
        }
        listEl.style.transition = 'none';
        listEl.style.transform = 'translateX(0)';
        listEl.innerHTML = '';
        strip.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'crate-item';
            div.style.borderColor = entry.color;
            div.innerHTML = getTreasureReelItemHTML(entry);
            listEl.appendChild(div);
        });
        setTimeout(() => {
            listEl.style.transition = `transform ${durationMs}ms cubic-bezier(0.15, 0, 0.05, 1)`;
            const itemWidth = 136;
            const viewport = listEl.closest('#treasure-viewport, #crate-viewport');
            const viewportW = viewport?.clientWidth || 720;
            const centerOffset = (viewportW / 2) - (itemWidth / 2);
            listEl.style.transform = `translateX(-${winIndex * itemWidth - centerOffset}px)`;
            setTimeout(resolve, durationMs + 100);
        }, 50);
    });
}

function rollTreasureBonusKey(boxId) {
    const chance = TREASURE_BOX_BY_ID[boxId]?.keyBonusChance;
    return typeof chance === 'number' && chance > 0 && Math.random() < chance;
}

function applyTreasureReward(reward, box) {
    state.money += reward.amount;
    updateMoneyDisplay();

    const wonKey = rollTreasureBonusKey(box.id);
    if (wonKey) {
        state.keys = (parseInt(state.keys, 10) || 0) + 1;
        updateKeysDisplay();
    }

    persistGame();

    const keyLine = wonKey ? '\n🔑 +1 clé mystérieuse !' : '';
    addLog(`📦 ${box.name} : ${reward.detailLabel}${wonKey ? ' + 1 clé mystérieuse' : ''} !`, 'epic');

    const sub = document.getElementById('treasure-roll-subtitle');
    const resultEl = document.getElementById('treasure-roll-result');
    const closeBtn = document.getElementById('btn-treasure-close');
    const phase = document.getElementById('treasure-roll-phase');
    if (sub) sub.textContent = 'Ouverture terminée';
    if (phase) phase.classList.add('hidden');
    if (resultEl) {
        resultEl.innerHTML = `💰 ${reward.detailLabel}${wonKey ? '<br>🔑 +1 clé mystérieuse' : ''}`;
        resultEl.style.color = reward.color || box.color;
        resultEl.classList.remove('hidden');
    }
    if (closeBtn) closeBtn.classList.remove('hidden');
    alert(`💰 ${box.name}\n${reward.detailLabel}${keyLine}`);
}

function finishTreasureRoll(reward, box) {
    applyTreasureReward(reward, box);
    isTreasureOpening = false;
}

async function startTreasureRollMinigame(boxId) {
    if (isTreasureOpening) return;
    const box = TREASURE_BOX_BY_ID[boxId];
    if (!box) return;

    isTreasureOpening = true;
    const title = document.getElementById('treasure-roll-title');
    const sub = document.getElementById('treasure-roll-subtitle');
    const phase = document.getElementById('treasure-roll-phase');
    const resultEl = document.getElementById('treasure-roll-result');
    const closeBtn = document.getElementById('btn-treasure-close');
    const list = document.getElementById('treasure-list');

    const headerImg = document.getElementById('treasure-roll-img');
    if (title) title.textContent = box.name;
    if (headerImg) {
        headerImg.src = box.img;
        headerImg.alt = box.name;
    }
    if (sub) sub.textContent = 'Mini-jeu d\'ouverture…';
    if (phase) phase.classList.add('hidden');
    if (resultEl) {
        resultEl.classList.add('hidden');
        resultEl.textContent = '';
    }
    if (closeBtn) closeBtn.classList.add('hidden');

    showScreen('treasure-roll');
    playChestSound();

    try {
        if (boxId === 'coffre_moyen') {
            const baseWin = pickWeightedLoot(box.baseLoot);
            const baseStrip = buildTreasureReelStrip(box.baseLoot, baseWin).map(e => ({ ...e, tag: 'Base' }));
            if (phase) {
                phase.textContent = 'Tour 1 — Montant de base';
                phase.classList.remove('hidden');
            }
            await runTreasureReelSpin(list, baseStrip, 45, 4200);
            await new Promise(r => setTimeout(r, 700));

            const multWin = pickWeightedLoot(box.multipliers);
            const multStrip = buildTreasureReelStrip(box.multipliers, multWin).map(e => ({ ...e, tag: 'Multi' }));
            if (phase) phase.textContent = 'Tour 2 — Multiplicateur (×0,1 à ×5)';
            await runTreasureReelSpin(list, multStrip, 45, 4200);

            const amount = Math.max(1, Math.round(baseWin.amount * multWin.mult * 100) / 100);
            finishTreasureRoll({
                type: 'money',
                amount,
                label: `${formatTreasureMoney(amount)} $`,
                detailLabel: `${baseWin.label} ${multWin.label} = ${formatTreasureMoney(amount)} $`,
                color: box.color
            }, box);
            return;
        }

        const win = pickWeightedLoot(box.loot);
        const strip = buildTreasureReelStrip(box.loot, win).map(e => ({ ...e, tag: 'Gain' }));
        if (phase) phase.classList.add('hidden');
        await runTreasureReelSpin(list, strip, 45, 5000);
        finishTreasureRoll({
            type: 'money',
            amount: win.amount,
            label: win.label,
            detailLabel: win.label,
            color: win.color
        }, box);
    } catch (e) {
        console.error('Erreur mini-jeu coffre :', e);
        isTreasureOpening = false;
        goToMenu();
    }
}

const TIME_CYCLES = [
    { id: 'bg-day' },
    { id: 'bg-dawn' },
    { id: 'bg-night' }
];
const CYCLE_DURATION_MS = 2.5 * 60 * 1000;
const FULL_DAY_CYCLE_MS = CYCLE_DURATION_MS * TIME_CYCLES.length;
let dayNightTimer = null;
let dayNightResyncTimer = null;

function getGlobalCycleIndex() {
    const elapsed = Date.now() % FULL_DAY_CYCLE_MS;
    return Math.floor(elapsed / CYCLE_DURATION_MS);
}

function getMsUntilNextPhase() {
    const phaseElapsed = Date.now() % FULL_DAY_CYCLE_MS % CYCLE_DURATION_MS;
    return CYCLE_DURATION_MS - phaseElapsed;
}

function applyGlobalTimeCycle() {
    const targetCycle = getGlobalCycleIndex();
    TIME_CYCLES.forEach((cycle, i) => {
        const el = document.getElementById(cycle.id);
        if (el) el.classList.toggle('active', i === targetCycle);
    });
    state.currentCycle = targetCycle;
}

function scheduleGlobalDayNightCycle() {
    clearTimeout(dayNightTimer);
    applyGlobalTimeCycle();
    dayNightTimer = setTimeout(() => scheduleGlobalDayNightCycle(), getMsUntilNextPhase() + 50);
}

function startAutoDayNightCycle() {
    if (dayNightResyncTimer) clearInterval(dayNightResyncTimer);
    scheduleGlobalDayNightCycle();
    if (!window.__stepfishDayNightVisibilityBound) {
        window.__stepfishDayNightVisibilityBound = true;
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                applyGlobalTimeCycle();
                scheduleGlobalDayNightCycle();
            }
        });
    }
    dayNightResyncTimer = setInterval(applyGlobalTimeCycle, 15000);
}

function updateProgression() {
    state.level = computeLevelFromScore(state.totalScore);
    state.prestige = computePrestigeFromLevel(state.level);
    if(elements.userLevel) elements.userLevel.innerText = state.level;
    if(elements.userPrestige) elements.userPrestige.innerText = state.prestige;
    ensureValidEquippedRod();
    ensureValidZone();
    window.StepFishAchievements?.checkAll?.();
    persistGame();
    const xpFill = document.getElementById('xp-bar-fill');
    const xpText = document.getElementById('xp-text');
    if (xpFill && xpText) {
        const currentLvlXP = Math.pow(state.level - 1, 1/0.7) * 10;
        const nextLvlXP = Math.pow(state.level, 1/0.7) * 10;
        const progress = ((state.totalScore - currentLvlXP) / (nextLvlXP - currentLvlXP)) * 100;
        xpFill.style.width = Math.min(100, Math.max(0, progress)) + "%";
        xpText.innerText = `${Math.floor(state.totalScore - currentLvlXP)} / ${Math.floor(nextLvlXP - currentLvlXP)} XP`;
    }
}

function addLog(message, type = 'normal') {
    if(!elements.gameLog) return;
    const log = document.createElement('div');
    log.classList.add('log-msg');
    if (type === 'epic') log.classList.add('epic');
    if (type === 'system') log.classList.add('system');
    log.innerText = message;
    elements.gameLog.appendChild(log);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
}

function openProfile() {
    if(!elements.profLevel) return;
    if (window.StepFishCosmetics?.refreshPseudoDisplays) window.StepFishCosmetics.refreshPseudoDisplays();
    elements.profLevel.innerText = state.level;
    elements.profPrestige.innerText = state.prestige;
    elements.profFishes.innerText = state.totalFishesCaught;
    elements.profMaxMoney.innerText = state.maxMoney.toLocaleString('en-US', {minimumFractionDigits: 2}) + " $";
    elements.profTotalScore.innerText = Math.floor(state.totalScore);
    showScreen('profile-modal'); 
}

const AQ_CONFIGS = [
    { name: "Bac Classique", cost: 0, bg: "assets/aquariums/aq0.png" },
    { name: "Lagon Corail", cost: 150, bg: "assets/aquariums/aq1.png" },
    { name: "Abysse Noir", cost: 1000, bg: "assets/aquariums/aq2.png" },
    { name: "Palais d'Or", cost: 5000, bg: "assets/aquariums/aq3.png" },
    { name: "Nébuleuse", cost: 25000, bg: "assets/aquariums/aq4.png" }
];
const AQ_SLOTS_PER_TANK = 15;

function getAquariumCapacityStats() {
    normalizeInventory();
    const unlocked = normalizeUnlockedAquariums();
    let used = 0;
    let total = 0;
    unlocked.forEach(idx => {
        used += (state.inventory[`aq${idx}`] || []).length;
        total += AQ_SLOTS_PER_TANK;
    });
    return { used, total };
}

function updateAquariumCapacityHUD() {
    const el = elements.aqCapacityHud || document.getElementById('aq-capacity-hud');
    if (!el) return;
    const { used, total } = getAquariumCapacityStats();
    el.textContent = `🐠 ${used}/${total}`;
    el.classList.toggle('aq-capacity-full', total > 0 && used >= total);
}

function newFishUid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'f-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function ensureFishUid(fish) {
    if (!fish || fish.isKey) return fish;
    if (!fish.uid) fish.uid = newFishUid();
    return fish;
}

function ensureFishUidsInInventory() {
    if (!state.inventory || typeof state.inventory !== 'object') return;
    for (let i = 0; i < AQ_CONFIGS.length; i++) {
        const fishes = state.inventory[`aq${i}`];
        if (!Array.isArray(fishes)) continue;
        fishes.forEach(f => ensureFishUid(f));
    }
}

function canTradeFish(fish) {
    return Boolean(fish && !fish.isKey && !fish.isTreasureBox && !isFishLocked(fish) && fish.uid);
}

function findFishByUid(uid) {
    if (!uid) return null;
    normalizeInventory();
    for (let i = 0; i < AQ_CONFIGS.length; i++) {
        const aqId = `aq${i}`;
        const fishes = state.inventory[aqId] || [];
        const index = fishes.findIndex(f => f.uid === uid);
        if (index >= 0) return { fish: fishes[index], index, aqId, aqIndex: i };
    }
    return null;
}

function listTradeableFish() {
    ensureFishUidsInInventory();
    const list = [];
    normalizeInventory();
    for (let i = 0; i < AQ_CONFIGS.length; i++) {
        const aqId = `aq${i}`;
        if (!isAquariumUnlocked(i)) continue;
        (state.inventory[aqId] || []).forEach((fish, index) => {
            if (canTradeFish(fish)) {
                list.push({ fish, index, aqId, aqIndex: i, tankName: AQ_CONFIGS[i].name });
            }
        });
    }
    return list;
}

function normalizeInventory() {
    const inv = state.inventory && typeof state.inventory === 'object' ? state.inventory : {};
    AQ_CONFIGS.forEach((_, i) => {
        const key = `aq${i}`;
        if (!Array.isArray(inv[key])) inv[key] = [];
    });
    state.inventory = inv;
    ensureFishUidsInInventory();
    return inv;
}

function refreshInventoryAfterCloudSync() {
    normalizeInventory();
    updateMoneyDisplay();
    updateAquariumCapacityHUD();
    if (state.currentPhase === 'INVENTORY') {
        renderAquarium();
        animateFish();
    }
}

function normalizeUnlockedAquariums() {
    const raw = Array.isArray(state.unlockedAquariums) ? state.unlockedAquariums : [0];
    const ids = [...new Set(
        raw.map(n => parseInt(n, 10)).filter(n => !isNaN(n) && n >= 0 && n < AQ_CONFIGS.length)
    )];
    if (!ids.includes(0)) ids.unshift(0);
    state.unlockedAquariums = ids.sort((a, b) => a - b);
    return state.unlockedAquariums;
}

function isAquariumUnlocked(index) {
    return normalizeUnlockedAquariums().includes(Number(index));
}

function placeFishInAquarium(fish) {
    normalizeInventory();
    const unlocked = normalizeUnlockedAquariums();
    for (let i = 0; i < AQ_CONFIGS.length; i++) {
        if (!unlocked.includes(i)) continue;
        const aqId = `aq${i}`;
        if (state.inventory[aqId].length < AQ_SLOTS_PER_TANK) {
            state.inventory[aqId].push(ensureFishUid({ ...fish, locked: Boolean(fish.locked) }));
            return { placed: true, aqIndex: i, aqId };
        }
    }
    return { placed: false };
}

function getMutationData(mutationName) {
    return MUTATIONS.find(m => m.name === mutationName) || MUTATIONS[0];
}

/** Taille du poisson à l'écran de capture (= 2× la taille aquarium) */
function getCatchRevealFishSize(fish) {
    if (!fish) return 200;
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
    if (fish.isKey || fish.isTreasureBox) {
        return isMobile ? 200 : 220;
    }
    const aqSize = aquariumFishWidthPx(fish.weight);
    const doubled = (aqSize + 20) * 2;
    return Math.min(isMobile ? 300 : 380, Math.max(140, Math.round(doubled)));
}

function applyCatchRevealSizing(container, sizePx) {
    if (!container || !sizePx) return;
    const px = Math.round(sizePx);
    container.style.setProperty('--catch-fish-size', px + 'px');
    container.querySelectorAll('.fish-visual-wrap').forEach(wrap => {
        wrap.style.width = px + 'px';
        wrap.style.maxWidth = 'none';
        wrap.style.height = 'auto';
    });
    container.querySelectorAll('.fish-mut-img.catch-reveal-img').forEach(img => {
        img.style.width = px + 'px';
        img.style.minWidth = px + 'px';
        img.style.maxWidth = 'none';
        img.style.height = 'auto';
    });
    container.querySelectorAll('.key-catch-img.catch-reveal-img').forEach(img => {
        const k = Math.round(px * 0.88);
        img.style.width = k + 'px';
        img.style.height = k + 'px';
        img.style.minWidth = k + 'px';
        img.style.maxWidth = 'none';
    });
}

function renderCatchReveal(fish) {
    const nameEl = document.getElementById('catch-fish-name');
    const rarityEl = document.getElementById('catch-fish-rarity');
    const priceEl = elements.catchFishPrice;
    const visual = elements.catchVisual;
    if (!fish) {
        if (nameEl) { nameEl.textContent = ''; nameEl.className = 'rarity-text catch-fish-name'; }
        if (rarityEl) rarityEl.textContent = '';
        if (priceEl) { priceEl.innerHTML = ''; priceEl.classList.add('hidden'); }
        if (visual) { visual.innerHTML = ''; visual.style.removeProperty('--catch-glow'); }
        return;
    }
    const size = getCatchRevealFishSize(fish);
    if (visual) {
        visual.innerHTML = buildCatchRevealVisualHTML(fish, size);
        visual.style.setProperty('--catch-glow', fish.color || '#ffffff');
        applyCatchRevealSizing(visual, size);
    }
    if (nameEl) {
        nameEl.textContent = fish.name;
        nameEl.className = `rarity-text catch-fish-name ${fish.class || 'rarity-0'}`;
    }
    if (rarityEl) {
        if (fish.isKey) {
            rarityEl.textContent = 'Clé mystérieuse';
            rarityEl.style.color = fish.color || '#ffca28';
        } else if (fish.isTreasureBox) {
            rarityEl.textContent = 'Coffre pêché — ouverture au remontage';
            rarityEl.style.color = fish.color || '#8BC34A';
        } else {
            const mutation = getMutationData(fish.mutation);
            rarityEl.innerHTML = `${escapeHtml(getRarityNameFromClass(fish.class))}${buildPrefixNoteHTML(fish)} · ${escapeHtml(formatFishWeight(fish.weight))} · ${escapeHtml(mutation.name)}`;
            rarityEl.style.color = fish.color || '';
        }
    }
    if (priceEl) {
        if (fish.isKey || fish.isTreasureBox) {
            priceEl.innerHTML = '';
            priceEl.classList.add('hidden');
        } else {
            priceEl.innerHTML = `Valeur de vente : <strong>${escapeHtml(formatFishSellPrice(fish.value))}</strong>`;
            priceEl.classList.remove('hidden');
        }
    }
}

function clearCatchReveal() {
    renderCatchReveal(null);
    updateCatchLockUI();
}

function getCatchModalFishLocation() {
    const uid = state.catchModalFishUid;
    if (!uid) return null;
    return findFishByUid(uid);
}

function updateCatchLockUI() {
    const btn = document.getElementById('btn-lock-catch');
    if (!btn) return;

    const loc = getCatchModalFishLocation();

    if (!loc) {
        btn.classList.add('hidden');
        return;
    }

    const locked = isFishLocked(loc.fish);
    btn.classList.remove('hidden');
    btn.textContent = locked ? '🔒' : '🔓';
    btn.classList.toggle('catch-lock-icon-locked', locked);
    btn.setAttribute('aria-label', locked ? 'Poisson verrouillé — cliquer pour déverrouiller' : 'Verrouiller ce poisson');
    btn.title = locked
        ? 'Verrouillé — protégé du « Tout vendre »'
        : 'Cliquer pour verrouiller';
}

function toggleLockFromCatchModal() {
    const loc = getCatchModalFishLocation();
    if (!loc) return;
    loc.fish.locked = !loc.fish.locked;
    persistGame();
    updateCatchLockUI();
    addLog(
        loc.fish.locked
            ? `🔒 ${loc.fish.name} protégé du « Tout vendre ».`
            : `🔓 ${loc.fish.name} peut être vendu en masse.`,
        'system'
    );
}

function buildCatchRevealVisualHTML(fish, width) {
    const w = Math.round(width);
    if (fish.isKey || fish.isTreasureBox) {
        const img = fish.img || KEY_IMG;
        const icon = Math.round(w * 0.88);
        const glow = fish.color || '#ffca28';
        const alt = fish.isKey ? 'Clé mystérieuse' : fish.name;
        return `<div class="fish-visual-wrap key-catch-visual treasure-catch-visual catch-reveal-wrap" style="width:${w}px;--catch-glow:${glow}">
            <img src="${img}" class="key-catch-img catch-reveal-img" style="width:${icon}px;height:${icon}px;filter:drop-shadow(0 0 12px ${glow})" alt="${alt}">
        </div>`;
    }
    const mutation = getMutationData(fish.mutation);
    return `<div class="fish-visual-wrap catch-reveal-wrap" data-mutation="${mutation.name}" style="width:${w}px">
        <img src="${fish.img}" class="fish-mut-img catch-reveal-img" style="width:${w}px;height:auto" alt="${fish.name}">
    </div>`;
}

function buildFishVisualHTML(fish, width) {
    if (fish.isKey || fish.isTreasureBox) {
        const img = fish.img || KEY_IMG;
        const size = Math.round(width * 0.88);
        const glow = fish.color || '#ffca28';
        const alt = fish.isKey ? 'Clé mystérieuse' : fish.name;
        return `<div class="fish-visual-wrap key-catch-visual treasure-catch-visual" style="width:${width}px;height:${width}px;--catch-glow:${glow}">
            <img src="${img}" class="key-catch-img" style="width:${size}px;height:${size}px;filter:drop-shadow(0 0 12px ${glow})" alt="${alt}">
        </div>`;
    }
    const mutation = getMutationData(fish.mutation);
    return `<div class="fish-visual-wrap" data-mutation="${mutation.name}">
        <img src="${fish.img}" class="fish-mut-img" style="width:${width}px" alt="${fish.name}">
    </div>`;
}

function spawnFishParticleInLayer(fishEl, layerEl) {
    const mutationName = fishEl.dataset.mutation;
    if (!mutationName || mutationName === 'Normal') return;
    if (Math.random() > 0.04) return;

    const mut = getMutationData(mutationName);
    if (!layerEl) return;

    const fishRect = fishEl.getBoundingClientRect();
    const layerRect = layerEl.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.className = `fish-particle particle-${mut.effect}`;
    particle.style.background = mut.color;
    particle.style.left = (fishRect.left - layerRect.left + fishRect.width * (0.3 + Math.random() * 0.4)) + 'px';
    particle.style.top = (fishRect.top - layerRect.top + fishRect.height * (0.3 + Math.random() * 0.4)) + 'px';
    layerEl.appendChild(particle);
    setTimeout(() => particle.remove(), 800);
}

function spawnFishParticle(fishEl) {
    spawnFishParticleInLayer(fishEl, elements.fishLayer);
}

let _aqPreviewAnimToken = 0;

function renderAquariumFishLayer(layerEl, fishes) {
    if (!layerEl) return;
    layerEl.innerHTML = '';
    const list = Array.isArray(fishes) ? fishes : [];
    list.forEach((fish) => {
        const fDiv = document.createElement('div');
        const mutation = getMutationData(fish.mutation);
        fDiv.classList.add('aq-fish');
        if (mutation.effect !== 'none') fDiv.classList.add(`mut-${mutation.effect}`);
        fDiv.dataset.mutation = mutation.name;
        fDiv.style.setProperty('--mut-color', mutation.color);
        const weightKg = getFishWeightKg(fish);
        const finalWidth = aquariumFishWidthPx(weightKg);
        const locked = Boolean(fish.locked);
        if (locked) fDiv.classList.add('aq-fish-locked');
        const pMult = getFishPrefixMult(fish);
        const pNote = fish.prefixTier ? ` · Préfixe ${fish.prefixTier} (×${pMult})` : '';
        fDiv.title = `${fish.name} · ${getRarityNameFromClass(fish.class)}${pNote} · ${formatFishWeight(weightKg)} · ${mutation.name}${locked ? ' · 🔒' : ''}`;
        fDiv.innerHTML = `${locked ? '<span class="aq-fish-lock-badge" aria-hidden="true">🔒</span>' : ''}<img src="${fish.img}" class="aq-fish-img" style="width:${finalWidth}px" alt="">`;
        fDiv.style.left = Math.random() * 80 + 5 + '%';
        fDiv.style.top = Math.random() * 75 + 5 + '%';
        fDiv.dataset.fishData = JSON.stringify({ target: null, speed: 0 });
        layerEl.appendChild(fDiv);
    });
}

function startAquariumFishAnimation(layerEl) {
    stopAquariumFishAnimation();
    const token = ++_aqPreviewAnimToken;
    const loop = () => {
        if (token !== _aqPreviewAnimToken || !layerEl?.isConnected) return;
        layerEl.querySelectorAll('.aq-fish').forEach(fish => {
            const data = JSON.parse(fish.dataset.fishData || '{"target":null,"speed":0}');
            if (!data.target) {
                data.target = { x: 5 + Math.random() * 80, y: 5 + Math.random() * 75 };
                data.speed = 0.005 + Math.random() * 0.01;
            }
            const curX = parseFloat(fish.style.left) || 0;
            const curY = parseFloat(fish.style.top) || 0;
            const newX = curX + (data.target.x - curX) * data.speed;
            const newY = curY + (data.target.y - curY) * data.speed;
            fish.style.left = newX + '%';
            fish.style.top = newY + '%';
            fish.style.transform = `scaleX(${newX > curX ? -1 : 1})`;
            if (Math.abs(newX - data.target.x) < 1) {
                data.target = { x: 5 + Math.random() * 80, y: 5 + Math.random() * 75 };
            }
            fish.dataset.fishData = JSON.stringify(data);
            spawnFishParticleInLayer(fish, layerEl);
        });
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

function stopAquariumFishAnimation() {
    _aqPreviewAnimToken++;
}

let isAnimating = false;
function renderAquarium() {
    normalizeInventory();
    normalizeUnlockedAquariums();
    const aqIndex = state.currentAqIndex;
    const aqId = `aq${aqIndex}`;
    const config = AQ_CONFIGS[aqIndex];
    const isUnlocked = isAquariumUnlocked(aqIndex);

    if (!elements.aqTitle) return;

    elements.aqTitle.innerText = config.name;

    const aqContainer = document.getElementById('aquarium-container');
    if (aqContainer) {
        aqContainer.style.backgroundImage = `url('${config.bg}')`;
        aqContainer.style.backgroundSize = 'cover';
        aqContainer.style.backgroundPosition = 'center';
        aqContainer.style.backgroundRepeat = 'no-repeat';
    }

    if (elements.aqCost) {
        elements.aqCost.innerText = config.cost.toLocaleString('fr-FR');
    }

    if (!isUnlocked) {
        if (elements.aqLock) elements.aqLock.classList.remove('hidden');
        if (elements.fishLayer) elements.fishLayer.innerHTML = '';
        if (elements.aqSlots) elements.aqSlots.innerText = '🔒 Verrouillé';
        return;
    }

    if (elements.aqLock) elements.aqLock.classList.add('hidden');
    if (!elements.fishLayer) return;
    elements.fishLayer.innerHTML = '';
    const fishes = state.inventory[aqId] || [];
    if (elements.aqSlots) elements.aqSlots.innerText = `Slots: ${fishes.length}/${AQ_SLOTS_PER_TANK}`;
    fishes.forEach((fish, index) => {
        const fDiv = document.createElement('div');
        const mutation = getMutationData(fish.mutation);
        fDiv.classList.add('aq-fish');
        if (mutation.effect !== 'none') fDiv.classList.add(`mut-${mutation.effect}`);
        fDiv.dataset.mutation = mutation.name;
        fDiv.style.setProperty('--mut-color', mutation.color);
        const weightKg = getFishWeightKg(fish);
        const finalWidth = aquariumFishWidthPx(weightKg);
        const locked = Boolean(fish.locked);
        if (locked) fDiv.classList.add('aq-fish-locked');
        fDiv.title = `${fish.name} · ${formatFishWeight(weightKg)}${locked ? ' · 🔒 protégé' : ''}`;
        fDiv.innerHTML = `${locked ? '<span class="aq-fish-lock-badge" aria-hidden="true">🔒</span>' : ''}<img src="${fish.img}" class="aq-fish-img" style="width:${finalWidth}px">`;
        fDiv.style.left = Math.random() * 80 + 5 + '%';
        fDiv.style.top = Math.random() * 75 + 5 + '%';
        fDiv.dataset.fishData = JSON.stringify({ target: null, speed: 0 });
        fDiv.addEventListener('click', (e) => { e.stopPropagation(); openFishModal(index, aqId); });
        elements.fishLayer.appendChild(fDiv);
    });
}

function isFishLocked(fish) {
    return Boolean(fish?.locked);
}

function toggleFishLock(index, aqId) {
    const fish = state.inventory[aqId]?.[index];
    if (!fish) return;
    fish.locked = !fish.locked;
    persistGame();
    renderAquarium();
    openFishModal(index, aqId);
    addLog(fish.locked ? `🔒 ${fish.name} protégé du « Tout vendre ».` : `🔓 ${fish.name} peut être vendu en masse.`, 'system');
}

function sellUnlockedFishFromTank(aqId) {
    const fishes = state.inventory[aqId] || [];
    const kept = [];
    let gain = 0;
    let sold = 0;
    fishes.forEach(fish => {
        if (isFishLocked(fish)) {
            kept.push(fish);
        } else {
            gain += fish.value || 0;
            sold++;
        }
    });
    state.inventory[aqId] = kept;
    return { gain, sold, locked: kept.length };
}

function sellAllFromAq() {
    const aqId = `aq${state.currentAqIndex}`;
    const fishes = state.inventory[aqId] || [];
    if (fishes.length === 0) {
        addLog("Le bac est déjà vide !", "system");
        return;
    }
    const { gain, sold, locked } = sellUnlockedFishFromTank(aqId);
    if (sold === 0) {
        addLog('Aucun poisson vendu : tous sont verrouillés 🔒', 'system');
        return;
    }
    window.StepFishAchievements?.onFishSold?.(sold, gain);
    state.money += gain;
    persistGame();
    updateMoneyDisplay();
    updateAquariumCapacityHUD();
    renderAquarium();
    const lockedNote = locked ? ` · ${locked} verrouillé(s) conservé(s)` : '';
    addLog(`Vendu ${sold} poisson(s) : ${gain.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} $${lockedNote}`, 'epic');
}

/** Vend tous les poissons non verrouillés dans tous les aquariums débloqués. */
function sellAllFromAllAquariums() {
    normalizeInventory();
    const unlocked = normalizeUnlockedAquariums();
    let totalGain = 0;
    let soldCount = 0;
    let lockedKept = 0;
    let hadAnyFish = false;

    unlocked.forEach(idx => {
        const aqId = `aq${idx}`;
        const fishes = state.inventory[aqId] || [];
        if (fishes.length) hadAnyFish = true;
        const { gain, sold, locked } = sellUnlockedFishFromTank(aqId);
        totalGain += gain;
        soldCount += sold;
        lockedKept += locked;
    });

    if (!hadAnyFish) {
        addLog('Aucun poisson dans les aquariums.', 'system');
        return;
    }
    if (soldCount === 0) {
        addLog('Aucun poisson vendu : tout est verrouillé 🔒', 'system');
        return;
    }

    window.StepFishAchievements?.onFishSold?.(soldCount, totalGain);
    state.money += totalGain;
    persistGame();
    updateMoneyDisplay();
    updateAquariumCapacityHUD();
    if (state.currentPhase === 'INVENTORY') {
        renderAquarium();
        animateFish();
    }
    const lockedNote = lockedKept ? ` · ${lockedKept} verrouillé(s) conservé(s)` : '';
    addLog(`Vendu ${soldCount} poisson(s) (tous bacs) : ${totalGain.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} $${lockedNote}`, 'epic');
}

function renderMap() {
    const mapGrid = document.getElementById('map-zones');
    if(!mapGrid) return;
    mapGrid.innerHTML = '';
    ZONE_DATA.forEach(zone => {
        const unlocked = isZoneUnlocked(zone);
        const card = document.createElement('div');
        card.className = `zone-card${state.currentZone === zone.id && unlocked ? ' active' : ''}${unlocked ? '' : ' zone-card-locked'}`;
        if (unlocked) {
            card.innerHTML = `<h3>${zone.name}</h3><p>Découvrez les espèces de cette région</p>`;
            card.onclick = () => {
                state.currentZone = zone.id;
                persistGame();
                updateZoneBackgrounds();
                renderMap();
                showScreen('menu');
                addLog(`Vous avez voyagé vers : ${zone.name}`);
            };
        } else {
            const lockMsg = getZoneLockMessage(zone);
            card.innerHTML = `<h3>🔒 ${zone.name}</h3><p>${lockMsg}</p>`;
        }
        mapGrid.appendChild(card);
    });
}

function updateZoneBackgrounds() {
    const zone = ZONE_DATA.find(z => z.id === state.currentZone);
    if(!zone) return;
    document.getElementById('bg-day').style.backgroundImage = `url('${zone.bgDay}')`;
    document.getElementById('bg-dawn').style.backgroundImage = `url('${zone.bgDawn}')`;
    document.getElementById('bg-night').style.backgroundImage = `url('${zone.bgNight}')`;
}

function animateFish() {
    if (state.currentPhase !== 'INVENTORY') { isAnimating = false; return; }
    if (isAnimating) return;
    isAnimating = true;

    const loop = () => {
        if (state.currentPhase !== 'INVENTORY') { isAnimating = false; return; }
        
        try {
            const fishes = document.querySelectorAll('.aq-fish');
            fishes.forEach(fish => {
                const data = JSON.parse(fish.dataset.fishData || '{"target":null, "speed":0}');
                if (!data.target) {
                    data.target = { x: 5 + Math.random() * 80, y: 5 + Math.random() * 75 };
                    data.speed = 0.005 + Math.random() * 0.01;
                }
                const curX = parseFloat(fish.style.left) || 0;
                const curY = parseFloat(fish.style.top) || 0;
                const newX = curX + (data.target.x - curX) * data.speed;
                const newY = curY + (data.target.y - curY) * data.speed;
                fish.style.left = newX + '%';
                fish.style.top = newY + '%';
                fish.style.transform = `scaleX(${newX > curX ? -1 : 1})`;
                if (Math.abs(newX - data.target.x) < 1) data.target = { x: 5 + Math.random() * 80, y: 5 + Math.random() * 75 };
                fish.dataset.fishData = JSON.stringify(data);
                spawnFishParticle(fish);
            });
        } catch (e) { console.error(e); }
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}


function openFishModal(index, aqId) {
    const fish = state.inventory[aqId][index];
    if(!fish) return;
    const weightKg = getFishWeightKg(fish);
    const locked = isFishLocked(fish);
    elements.modalFishVisual.innerHTML = buildFishVisualHTML(fish, aquariumFishWidthPx(weightKg) + 37);
    elements.modalFishName.innerText = fish.name;
    elements.modalFishName.className = `rarity-text ${fish.class}`;
    const rarityInfo = RARITIES.find(r => r.class === fish.class);
    const mutation = getMutationData(fish.mutation);
    elements.modalFishRarity.innerHTML = `${escapeHtml(rarityInfo ? rarityInfo.name : 'Inconnu')}${buildPrefixNoteHTML(fish)} · ${escapeHtml(formatFishWeight(weightKg))} · Mutation : ${escapeHtml(mutation.name)}`;
    elements.modalFishPrice.innerText = formatFishSellPrice(fish.value);
    const lockHint = document.getElementById('modal-fish-lock-hint');
    if (lockHint) {
        lockHint.textContent = locked
            ? '🔒 Protégé : ce poisson ne sera pas vendu avec « Tout vendre ».'
            : 'Tu peux le verrouiller pour le protéger du « Tout vendre ».';
    }
    const btnLock = document.getElementById('btn-lock-fish');
    const btnSell = document.getElementById('btn-sell-fish');
    const btnMove = document.getElementById('btn-move-fish');
    if (btnLock) {
        btnLock.textContent = locked ? '🔓 Déverrouiller' : '🔒 Verrouiller';
        btnLock.classList.toggle('fish-lock-active', locked);
        btnLock.onclick = () => toggleFishLock(index, aqId);
    }
    if(btnSell) btnSell.onclick = () => { sellFishFromAq(index, aqId); showScreen('inventory'); };
    if(btnMove) btnMove.onclick = () => { moveFishFromAq(index, aqId); };
    const btnTrade = document.getElementById('btn-trade-fish');
    const tradeable = canTradeFish(fish);
    if (btnTrade) {
        btnTrade.classList.toggle('hidden', !window.StepFishAuth?.isLoggedIn?.());
        btnTrade.disabled = !tradeable;
        btnTrade.onclick = () => {
            if (!tradeable) return;
            if (window.StepFishTrade?.openWithFish) {
                window.StepFishTrade.openWithFish(fish.uid, aqId);
            }
        };
    }
    showScreen('fish-modal');
}

function sellFishFromAq(index, aqId) {
    const fish = state.inventory[aqId][index];
    if(!fish) return;
    window.StepFishAchievements?.onFishSold?.(1, fish.value || 0);
    state.money += fish.value;
    state.inventory[aqId].splice(index, 1);
    persistGame();
    updateMoneyDisplay();
    renderAquarium();
}

function moveFishFromAq(index, fromAqId) {
    const fish = state.inventory[fromAqId][index];
    if (!fish) return;
    const input = prompt("Vers quel bac voulez-vous déplacer ce poisson ? (1-5)");
    if (input === null) return;
    const targetAqIndex = parseInt(input) - 1;
    const targetAqId = `aq${targetAqIndex}`;
    if (isNaN(targetAqIndex) || targetAqIndex < 0 || targetAqIndex >= AQ_CONFIGS.length) {
        alert("❌ Numéro de bac invalide !"); return;
    }
    if (!isAquariumUnlocked(targetAqIndex)) {
        alert("❌ Cet aquarium est verrouillé !"); return;
    }
    if (!state.inventory[targetAqId]) state.inventory[targetAqId] = [];
    if (state.inventory[targetAqId].length >= AQ_SLOTS_PER_TANK) {
        alert("❌ L'aquarium est plein !"); return;
    }
    const [movedFish] = state.inventory[fromAqId].splice(index, 1);
    state.inventory[targetAqId].push(movedFish);
    persistGame();
    renderAquarium();
    showScreen('inventory');
}

function buyAquarium() {
    normalizeUnlockedAquariums();
    const idx = state.currentAqIndex;
    if (isAquariumUnlocked(idx)) {
        alert('Cet aquarium est déjà débloqué.');
        return;
    }
    const cost = AQ_CONFIGS[idx].cost;
    if (state.money < cost) {
        alert('Pas assez d\'argent !');
        return;
    }
    state.money -= cost;
    state.unlockedAquariums.push(idx);
    normalizeUnlockedAquariums();
    if (!state.inventory[`aq${idx}`]) state.inventory[`aq${idx}`] = [];
    persistGame();
    updateMoneyDisplay();
    renderAquarium();
    addLog(`${AQ_CONFIGS[idx].name} débloqué !`, 'epic');
}

function spawnOsuTarget() {
    if (state.currentPhase !== 'SIGHTING') return;
    if (!elements.ocean) return;

    const target = document.createElement('div');
    target.classList.add('osu-target');

    const oceanWidth = elements.ocean.clientWidth;
    const oceanHeight = elements.ocean.clientHeight;
    const targetSize = isMobileLayout() ? 58 : 70;
    target.style.width = targetSize + 'px';
    target.style.height = targetSize + 'px';
    const marginX = Math.max(32, Math.round(oceanWidth * 0.1));
    const marginY = Math.max(40, Math.round(oceanHeight * 0.12));
    const usableW = Math.max(0, oceanWidth - marginX * 2 - targetSize);
    const usableH = Math.max(0, oceanHeight - marginY * 2 - targetSize);

    target.style.left = (marginX + Math.random() * usableW) + 'px';
    target.style.top = (marginY + Math.random() * usableH) + 'px';

    const onOsuHit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (state.currentPhase !== 'SIGHTING') return;
        state.combo++;
        window.StepFishAchievements?.onComboUpdate?.(state.combo);
        if (elements.combo) elements.combo.innerText = state.combo;
        target.remove();
        spawnOsuTarget();
        if (state.combo >= 5) setPhase('BITE');
    };
    target.addEventListener('pointerdown', onOsuHit);
    
    elements.ocean.appendChild(target);
    
    setTimeout(() => { 
        if (target.parentNode) { 
            target.remove(); 
            if (state.currentPhase === 'SIGHTING') spawnOsuTarget(); 
        } 
    }, 1200);
}


function triggerCatch() {
    if (Math.random() < KEY_CATCH_CHANCE) {
        state.currentFish = { ...KEY_FISH };
        setPhase('REELING');
        addLog('Quelque chose d\'inhabituel mord à l\'hameçon…', 'epic');
        return;
    }

    const treasureBox = rollTreasureBoxCatch();
    if (treasureBox) {
        state.currentFish = makeTreasureCatchFish(treasureBox);
        setPhase('REELING');
        addLog(`📦 ${treasureBox.name} accroché ! Remontez-le pour l\'ouvrir…`, 'epic');
        return;
    }

    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    const zone = ZONE_DATA.find(z => z.id === state.currentZone);
    const activeZone = zone || ZONE_DATA[0];

    if (!zoneHasCatchableFish(activeZone)) {
        addLog('Aucune espèce à pêcher ici pour le moment.', 'system');
        return;
    }
    const rIdx = rollFishRarityIndex(currentRod);
    let rData = RARITIES[rIdx];
    let possibleFishes = activeZone.library[rData.folder];
    let selectedImg = '';
    let fishSpecies = 'Poisson';
    if (possibleFishes && possibleFishes.length > 0) {
        const randomFishFile = possibleFishes[Math.floor(Math.random() * possibleFishes.length)];
        selectedImg = `assets/fish/${rData.folder}/${randomFishFile}`;
        fishSpecies = randomFishFile.replace('.png', '').replace('_', ' ');
    } else {
        const commonFishes = activeZone.library.commun;
        const randomCommon = commonFishes[Math.floor(Math.random() * commonFishes.length)];
        selectedImg = `assets/fish/commun/${randomCommon}`;
        fishSpecies = randomCommon.replace('.png', '').replace('_', ' ');
        rIdx = 0;
        rData = RARITIES[0];
    }

    const mutation = rollMutation();
    const weight = rollFishWeight(rIdx);
    const naming = generateProceduralName(rIdx, fishSpecies);
    state.currentFish = ensureFishUid({
        ...rData,
        id: rIdx,
        name: naming.name,
        prefixTier: naming.prefixTier,
        prefixTierClass: naming.prefixTierClass,
        prefixMult: naming.prefixMult,
        img: selectedImg,
        weight,
        value: computeFishSellValue(rIdx, mutation.multiplier, naming.prefixMult, state.currentZone),
        mutation: mutation.name
    });
    setPhase('REELING');
}

function startReelGame() {
    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    const metrics = getReelBarMetrics();
    state.reelBarHeight = metrics.height;
    state.fishZoneHeight = metrics.fishH;
    state.reelProgress = 20;
    state.fishPos = Math.max(0, (metrics.height - metrics.fishH) * 0.45);
    state.fishTargetY = Math.random() * Math.max(1, metrics.height - metrics.fishH);
    state.playerPos = metrics.height * 0.5;
    if (elements.playerCursor) elements.playerCursor.style.top = state.playerPos + 'px';

    if(elements.progressFill) elements.progressFill.style.width = '20%';
    const difficulty = state.currentFish?.difficulty || 6;
    if (elements.fishName) {
        elements.fishName.innerHTML = `???<br><span class="fish-weight-tag">Difficulté : ${difficulty}</span>`;
        elements.fishName.className = 'rarity-text reel-mystery-name';
    }
    if (elements.fishVisual) {
        elements.fishVisual.innerHTML = '<div class="reel-mystery-fish" aria-hidden="true">?</div>';
    }
    if (elements.fishTarget) {
        elements.fishTarget.style.backgroundColor = 'rgba(90, 90, 90, 0.92)';
        elements.fishTarget.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.35)';
        elements.fishTarget.style.height = Math.max(36, Math.min(56, 32 + difficulty * 2)) + 'px';
    }

    const gracePeriod = 500;
    const startTime = Date.now();
    const fishLerp = 0.06;
    const erraticFactor = (difficulty / 10) * 0.12;

    const reelInterval = setInterval(() => {
        if (state.currentPhase !== 'REELING') {
            clearInterval(reelInterval);
            return;
        }

        try {
            const diff = state.fishTargetY - state.fishPos;
            state.fishPos += diff * (fishLerp + Math.random() * erraticFactor);

            const barH = state.reelBarHeight || getReelBarMetrics().height;
            const fishH = state.fishZoneHeight || elements.fishTarget?.offsetHeight || 50;
            if (Math.abs(diff) < 10) state.fishTargetY = Math.random() * Math.max(1, barH - fishH);
            if(elements.fishTarget) elements.fishTarget.style.top = state.fishPos + 'px';

            const isInside = state.playerPos >= state.fishPos && state.playerPos <= (state.fishPos + fishH);

            if (isInside) {
                state.reelProgress += (1.2 * (currentRod.speed || 1));
            } else if (Date.now() - startTime > gracePeriod) {
                state.reelProgress -= 0.7;
            }

            state.reelProgress = Math.max(0, Math.min(100, state.reelProgress));
            if(elements.progressFill) elements.progressFill.style.width = state.reelProgress + '%';

            if (state.reelProgress >= 100) {
                clearInterval(reelInterval);
                playSplashSound();
                catchFish(true);
            } else if (state.reelProgress <= 0) {
                clearInterval(reelInterval);
                playSplashSound();
                catchFish(false);
            }
        } catch (e) {
            console.error("Erreur loop mini-jeu : ", e);
            clearInterval(reelInterval);
        }
    }, 30);
}


function catchFish(success) {
    recordCommonCatchStreak(state.currentFish, success);

    if (success && state.currentFish?.isKey) {
        state.keys++;
        window.StepFishAchievements?.onKeyFound?.();
        updateKeysDisplay();
        state.score += state.currentFish.points;
        state.totalScore += state.currentFish.points;
        elements.catchTitle.innerText = 'CLÉ TROUVÉE !';
        elements.catchText.innerText = 'Utilisez-la pour ouvrir le coffre mystère.';
        state.catchModalFishUid = null;
        renderCatchReveal(state.currentFish);
        updateCatchLockUI();
        showScreen('catch-modal');
        addLog('🔑 Clé mystérieuse récupérée !', 'epic');
        updateProgression();
        elements.score.innerText = state.score;
        stopFishingSession();
        return;
    }

    if (success && state.currentFish?.isTreasureBox) {
        const boxId = state.currentFish.boxId;
        const box = TREASURE_BOX_BY_ID[boxId];
        state.score += state.currentFish.points;
        state.totalScore += state.currentFish.points;
        state.totalFishesCaught++;
        updateProgression();
        elements.score.innerText = state.score;
        persistGame();
        addLog(`📦 ${state.currentFish.name} récupéré ! Ouverture…`, 'epic');
        stopFishingSession();
        startTreasureRollMinigame(boxId);
        return;
    }

    if (success) {
        state.score += state.currentFish.points;
        state.totalScore += state.currentFish.points;
        state.totalFishesCaught++;
        updateBestFishRecord(state.currentFish);
        const placement = placeFishInAquarium(state.currentFish);
        state.catchModalFishUid = placement.placed && state.currentFish?.uid ? state.currentFish.uid : null;
        if (!placement.placed) {
            addLog('Aquariums pleins ou verrouillés ! Poisson perdu.', 'system');
        } else if (placement.aqIndex !== state.currentAqIndex) {
            addLog(`Poisson placé dans : ${AQ_CONFIGS[placement.aqIndex].name}`, 'system');
        }
        persistGame();
        if (state.currentFish.id >= 4) addLog(`🌟 INCROYABLE ! ${state.currentFish.name} capturé !`, 'epic');
        else addLog(`Vous avez pêché un ${state.currentFish.name}.`);
        elements.catchTitle.innerText = "SUCCÈS !";
        elements.catchText.innerText = 'Ajouté à votre aquarium !';
        renderCatchReveal(state.currentFish);
        updateCatchLockUI();
        window.StepFishAchievements?.onFishCaught?.(state.currentFish);
        showScreen('catch-modal');
        if (!state.discoveredFishes.includes(state.currentFish.img)) {
            state.discoveredFishes.push(state.currentFish.img);
            persistGame();
            showDiscoveryToast(state.currentFish.name, state.currentFish.name, state.currentFish.mutation);
            if (hasDiscoveredAllLacFish() && state.level >= 10) {
                addLog('🌊 Haute Mer débloquée ! Toutes les espèces du Lac requises sont dans ton FishIndex.', 'epic');
            }
            if (hasDiscoveredAllOceanFish() && state.level >= 100) {
                addLog('🌑 Abysse débloqué ! Toutes les espèces de Haute Mer requises sont dans ton FishIndex.', 'epic');
            }
        }
    } else {
        state.catchModalFishUid = null;
        if (state.currentFish?.isKey) {
            elements.catchTitle.innerText = 'CLÉ PERDUE...';
            elements.catchText.innerText = 'La clé mystérieuse s\'est échappée...';
        } else if (state.currentFish?.isTreasureBox) {
            elements.catchTitle.innerText = 'COFFRE PERDU...';
            elements.catchText.innerText = `${state.currentFish.name} est retombé au fond…`;
        } else {
            elements.catchTitle.innerText = "ÉCHEC...";
            elements.catchText.innerText = `Le ${state.currentFish.name} s'est échappé...`;
        }
        clearCatchReveal();
        updateCatchLockUI();
        showScreen('catch-modal');
        addLog(
            state.currentFish?.isKey ? 'La clé mystérieuse a filé...'
                : state.currentFish?.isTreasureBox ? `${state.currentFish.name} a filé...`
                    : `Le ${state.currentFish.name || 'poisson'} a filé...`,
            'system'
        );
    }
    updateProgression();
    elements.score.innerText = state.score;

    if (state.score > state.highScore) {
        state.highScore = state.score;
        persistGame();
    }
    stopFishingSession();
}

function setPhase(phase) {
    state.currentPhase = phase;
    
    if(elements.biteIndicator) elements.biteIndicator.style.display = 'none';
    if(elements.reelContainer) elements.reelContainer.classList.add('hidden');
    document.querySelectorAll('.osu-target').forEach(t => t.remove());

    if (phase === 'SIGHTING') {
        state.combo = 0; 
        if(elements.combo) elements.combo.innerText = state.combo;
        if(elements.comboDisplay) elements.comboDisplay.classList.remove('hidden');
        spawnOsuTarget();
    } else { 
        if(elements.comboDisplay) elements.comboDisplay.classList.add('hidden'); 
    }

    if (phase === 'BITE') {
        if(elements.biteIndicator) elements.biteIndicator.style.display = 'block';
        addLog("Sensation ! Quelque chose mord !!!", "epic");
    } else if (phase === 'REELING') { 
        if(elements.reelContainer) elements.reelContainer.classList.remove('hidden'); 
        startReelGame(); 
    }
}


function clearGameTimer() {
    if (window.gameInterval) {
        clearInterval(window.gameInterval);
        window.gameInterval = null;
    }
}

function startGame() {
    ensureValidZone();
    updateZoneBackgrounds();
    clearGameTimer();
    state.gameActive = true;
    state.score = 0;
    
    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    
    state.timeLeft = 30 + currentRod.time;
    elements.score.innerText = state.score; 
    elements.timer.innerText = state.timeLeft;
    
    showScreen('game');
    updateFishingRodDisplay();
    const zone = ZONE_DATA.find(z => z.id === state.currentZone);
    if (zone && !zoneHasCatchableFish(zone)) {
        addLog(`${zone.name} : pas encore d'espèces — exploration uniquement.`, 'system');
    }
    
    setTimeout(() => {
        setPhase('SIGHTING');
        addLog("Ligne lancée... Bonne chance !");
    }, 100);

    window.gameInterval = setInterval(() => {
        if (!state.gameActive) return;
        state.timeLeft--; 
        elements.timer.innerText = state.timeLeft;
        if (state.timeLeft <= 0) { 
            clearGameTimer(); 
            endGame(); 
        }
    }, 1000);
}

function stopFishingSession() {
    state.gameActive = false;
    clearGameTimer();
    state.currentPhase = 'MENU';
    state.currentFish = null;
    document.querySelectorAll('.osu-target').forEach(t => t.remove());
    if (elements.reelContainer) elements.reelContainer.classList.add('hidden');
    if (elements.biteIndicator) elements.biteIndicator.style.display = 'none';
}

function goToMenu() {
    state.catchModalFishUid = null;
    stopFishingSession();
    isAnimating = false;
    showScreen('menu');
}

function endGame() {
    stopFishingSession();
    if(elements.finalScore) elements.finalScore.innerText = state.score;
    if (state.score > state.highScore) { 
        state.highScore = state.score; 
        persistGame();
    }
    addLog(`Session terminée — ${state.score} points !`, 'system');
    goToMenu();
}

function isMobileLayout() {
    return window.matchMedia('(max-width: 900px)').matches;
}

function closeMobileSidebar() {
    document.getElementById('sidebar')?.classList.remove('sidebar-open');
    document.getElementById('game-viewport')?.classList.remove('sidebar-open');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
}

function getReelBarMetrics() {
    const bar = document.getElementById('reel-bar');
    if (!bar) return { height: 300, fishH: 50 };
    const fishH = elements.fishTarget?.offsetHeight || 50;
    return { height: bar.clientHeight || 300, fishH };
}

function updateReelPlayerPos(clientY) {
    const bar = document.getElementById('reel-bar');
    if (!bar || state.currentPhase !== 'REELING') return;
    const rect = bar.getBoundingClientRect();
    const { height } = getReelBarMetrics();
    state.reelBarHeight = height;
    state.playerPos = Math.max(0, Math.min(height, clientY - rect.top));
    if (elements.playerCursor) {
        elements.playerCursor.style.top = state.playerPos + 'px';
    }
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const kebab = screenName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const target = document.getElementById(screenName)
        || document.getElementById('screen-' + screenName)
        || document.getElementById('screen-' + kebab);
    if (target) {
        target.classList.add('active');
    } else {
        console.warn('Écran introuvable :', screenName);
        document.getElementById('screen-menu')?.classList.add('active');
    }
    document.body.classList.toggle('mobile-game-active', screenName === 'game');
    if (isMobileLayout()) closeMobileSidebar();
    syncMenuRodBackdrop();
}

function syncMenuRodBackdrop() {
    const backdrop = document.getElementById('menu-rod-backdrop');
    const menu = document.getElementById('screen-menu');
    if (!backdrop) return;
    backdrop.classList.toggle('visible', Boolean(menu?.classList.contains('active')));
    backdrop.setAttribute('aria-hidden', menu?.classList.contains('active') ? 'false' : 'true');
}
window.__stepfishSyncMenuRod = syncMenuRodBackdrop;

function generateProceduralName(fishRarityIdx, speciesName) {
    const rolled = rollFishPrefix(fishRarityIdx);
    return {
        name: `${speciesName} ${rolled.prefixWord}`,
        prefixTier: rolled.prefixTier,
        prefixTierClass: rolled.prefixTierClass,
        prefixMult: rolled.prefixMult
    };
}

function rollRandomMutation() {
    return pickWeightedMutation(MUTATIONS.filter(m => m.name !== 'Normal'));
}

function createRandomMutatedFish(zoneId = state.currentZone) {
    const zone = ZONE_DATA.find(z => z.id === zoneId) || ZONE_DATA[0];
    const rod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    const rIdx = rollFishRarityIndex(rod);
    let rData = RARITIES[rIdx];
    let possibleFishes = zone.library[rData.folder];
    if (!possibleFishes || possibleFishes.length === 0) {
        possibleFishes = zone.library.commun;
        rIdx = 0;
        rData = RARITIES[0];
    }
    const randomFishFile = possibleFishes[Math.floor(Math.random() * possibleFishes.length)];
    const fishSpecies = randomFishFile.replace('.png', '').replace('_', ' ');
    const mutation = rollRandomMutation();
    const weight = rollFishWeight(rIdx);
    const naming = generateProceduralName(rIdx, fishSpecies);
    return ensureFishUid({
        ...rData,
        id: rIdx,
        name: naming.name,
        prefixTier: naming.prefixTier,
        prefixTierClass: naming.prefixTierClass,
        prefixMult: naming.prefixMult,
        img: `assets/fish/${rData.folder}/${randomFishFile}`,
        weight,
        value: computeFishSellValue(rIdx, mutation.multiplier, naming.prefixMult, zoneId),
        mutation: mutation.name
    });
}

/** Console : giveRandomMutatedFish(5) */
function giveRandomMutatedFish(count = 1, aqIndex = state.currentAqIndex) {
    normalizeInventory();
    normalizeUnlockedAquariums();
    const added = [];
    for (let i = 0; i < count; i++) {
        const fish = createRandomMutatedFish();
        const placement = placeFishInAquarium(fish);
        if (!placement.placed) break;
        added.push(fish);
    }
    persistGame();
    if (state.currentPhase === 'INVENTORY' && state.currentAqIndex === aqIndex) {
        renderAquarium();
        animateFish();
    }
    if (added.length > 0) addLog(`🎁 ${added.length} poisson(s) muté(s) ajouté(s) !`, 'epic');
    else addLog("Aquarium plein !", "system");
    console.table(added.map(f => ({ nom: f.name, mutation: f.mutation, valeur: f.value + ' $' })));
    return added;
}

window.giveRandomMutatedFish = giveRandomMutatedFish;

/** Console : giveKeys(3) */
function giveKeys(count = 1) {
    state.keys = (parseInt(state.keys, 10) || 0) + Math.max(1, count);
    updateKeysDisplay();
    persistGame();
    addLog(`🔑 +${count} clé(s) (total : ${state.keys})`, 'epic');
    return state.keys;
}
window.giveKeys = giveKeys;

/** Console : testTreasureBox('bourse') — ouvre le mini-jeu roll directement */
function testTreasureBox(boxId) {
    const id = boxId || 'bourse';
    if (!TREASURE_BOX_BY_ID[id]) {
        console.warn('IDs : bourse | coffre_leger | coffre_moyen');
        return;
    }
    startTreasureRollMinigame(id);
}
window.testTreasureBox = testTreasureBox;

/** Console : testAllTreasureBoxes() — affiche les 3 commandes à lancer une par une */
function testAllTreasureBoxes() {
    TREASURE_BOXES.forEach(box => {
        console.log(`testTreasureBox('${box.id}')  // ${box.name}`);
    });
    addLog('Voir la console (F12) pour tester chaque coffre.', 'system');
}
window.testAllTreasureBoxes = testAllTreasureBoxes;

/**
 * Console : testTreasureFishing('coffre_leger')
 * Simule une capture (osu + remontée) avec le coffre choisi.
 */
function testTreasureFishing(boxId = 'bourse') {
    const box = TREASURE_BOX_BY_ID[boxId];
    if (!box) {
        console.warn('IDs : bourse | coffre_leger | coffre_moyen');
        return;
    }
    if (!state.gameActive) startGame();
    state.currentFish = makeTreasureCatchFish(box);
    setPhase('REELING');
    showScreen('game');
    if (elements.reelContainer) elements.reelContainer.classList.remove('hidden');
    startReelGame();
    addLog(`[TEST] Remontée ${box.name}…`, 'system');
}
window.testTreasureFishing = testTreasureFishing;

/** Console : testKeyFishing() — simule une clé à remonter */
function testKeyFishing() {
    if (!state.gameActive) startGame();
    state.currentFish = { ...KEY_FISH };
    setPhase('REELING');
    showScreen('game');
    if (elements.reelContainer) elements.reelContainer.classList.remove('hidden');
    startReelGame();
    addLog('[TEST] Remontée clé mystérieuse…', 'system');
}
window.testKeyFishing = testKeyFishing;

/** Console : testDevHelp() — liste les commandes de test */
function testDevHelp() {
    const lines = [
        'giveKeys(1)              — ajoute des clés',
        "testTreasureBox('bourse') — mini-jeu roll (direct)",
        "testTreasureFishing('coffre_moyen') — pêche + remontée",
        'testKeyFishing()         — clé + remontée',
        'testAllTreasureBoxes()   — les 3 coffres à la suite',
        'giveRandomMutatedFish(1) — poisson muté dans l\'aquarium'
    ];
    console.log(lines.join('\n'));
    addLog('Commandes de test listées dans la console (F12).', 'system');
    return lines;
}
window.testDevHelp = testDevHelp;

let discoveryToastTimer = null;

function showDiscoveryToast(fishName, rarity, mutation) {
    const toast = document.getElementById('discovery-toast');
    const text = document.getElementById('toast-text');
    if(!toast || !text) return;
    text.innerHTML = `FÉLICITATIONS ! <br> <span style="color:var(--wood-gold)">${fishName}</span> [${rarity}] <br> <small>Mutation: ${mutation}</small>`;
    clearTimeout(discoveryToastTimer);
    toast.classList.remove('show');
    void toast.offsetHeight;
    toast.classList.add('show');
    discoveryToastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}

function renderShop() {
    const grid = document.getElementById('shop-items-grid');
    if (!grid) return;
    grid.innerHTML = ''; 
    ROD_DATA.forEach(rod => {
        const isOwned = state.ownedRods.includes(rod.id);
        const item = document.createElement('div');
        item.className = 'shop-item';
        
        // AJOUT DE L'IMAGE ICI
        item.innerHTML = `
    <img src="${rod.img}" style="width: 150px; height: auto; object-fit: contain; margin-bottom: 15px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5));">
    <h3 style="color: var(--wood-gold); margin: 10px 0;">${rod.name}</h3>
    <div class="stats" style="font-size: 0.9rem; color: #ccc; margin-bottom: 15px;">
        🍀 Luck: +${rod.luck} | ⚡ Speed: x${rod.speed} | ⏱️ +${rod.time}s
    </div>`;
            
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.innerText = isOwned ? 'Possédé' : rod.cost + ' $';
        btn.onclick = () => buyRod(rod.id);
        item.appendChild(btn);
        grid.appendChild(item);
    });
}

function buyRod(id) {
    const rod = ROD_DATA[id];
    if (state.ownedRods.includes(id)) return;
    if (state.money >= rod.cost) {
        state.money -= rod.cost;
        state.ownedRods.push(id);
        persistGame();
        updateMoneyDisplay();
        renderShop();
        addLog(`Achat réussi : ${rod.name} !`);
    } else { alert("Pas assez d'argent !"); }
}

function formatRodStatsHTML(rod) {
    const luck = rod.luck ?? 0;
    const speed = Number(rod.speed || 1);
    const moneyBuff = rod.moneyBuff || 1;
    const rates = getRodCatchRates(rod);
    const lines = [
        `<span>🍀 Luck <strong>${luck}</strong> · bonus rareté <strong>Épique</strong></span>`,
        `<span>🎣 Par prise · <strong>Lég. ${formatCatchRatePct(rates.legendaire)}</strong> · <strong>My. ${formatCatchRatePct(rates.mythique)}</strong> · <strong>Div. ${formatCatchRatePct(rates.divin)}</strong></span>`,
        `<span>⚡ Remontage <strong>×${speed.toFixed(1)}</strong></span>`
    ];
    if (rod.time > 0) {
        lines.push(`<span>⏱ Durée partie <strong>+${rod.time}s</strong> (30s base)</span>`);
    } else {
        lines.push(`<span>⏱ Durée partie <strong>30s</strong></span>`);
    }
    if (moneyBuff > 1) {
        lines.push(`<span>💰 Valeur vente <strong>×${moneyBuff}</strong></span>`);
    }
    if (rod.rarity) {
        lines.push(`<span class="eq-rod-rarity">✨ Canne <strong>${rod.rarity}</strong></span>`);
    }
    return lines.join('');
}

function renderEquipment() {
    const list = document.getElementById('equipment-list');
    if (!list) return;
    list.innerHTML = '';
    state.ownedRods.forEach(id => {
        const rod = ALL_RODS.find(r => r.id === id); // On utilise ALL_RODS ici
        if (!rod) return;
        const item = document.createElement('div');
        item.className = `eq-item ${state.equippedRod === id ? 'equipped' : ''}`;
        item.style.borderColor = rod.color || 'var(--wood-medium)';
        const minP = rod.minPrestige || 0;
        const locked = minP > 0 && !canEquipRod(id);
        const info = document.createElement('div');
        info.className = 'eq-item-info';
        info.innerHTML = `<span class="eq-item-name">${rod.name}</span>
            <div class="eq-item-stats">${formatRodStatsHTML(rod)}</div>${
            locked ? `<small class="eq-prestige-lock">🔒 Prestige ${minP} requis (tu es P${state.prestige})</small>` : ''
        }`;
        item.appendChild(info);
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        if (state.equippedRod === id) {
            btn.innerText = 'Équipé';
        } else if (locked) {
            btn.innerText = `Prestige ${minP}`;
            btn.disabled = true;
        } else {
            btn.innerText = 'Équiper';
        }
        if (!locked) btn.onclick = () => equipRod(id);
        item.appendChild(btn);
        list.appendChild(item);
    });
}


function equipRod(id) {
    if (!canEquipRod(id)) {
        const minP = getRodMinPrestige(id);
        alert(`🔒 Cette canne nécessite le prestige ${minP} (vous êtes prestige ${state.prestige}).`);
        return;
    }
    state.equippedRod = id;
    persistGame();
    renderEquipment();
    const rod = ALL_RODS.find(r => r.id === id);
    addLog(`Matériel changé : ${rod ? rod.name : 'Canne'} équipée.`);
    updateFishingRodDisplay();
}


const FISH_INDEX_ZONE_LEGEND = [
    { id: 'lac', label: 'Lac Calme', className: 'zone-lac' },
    { id: 'ocean', label: 'Haute Mer', className: 'zone-ocean' },
    { id: 'bonta', label: 'Bonta', className: 'zone-bonta' },
    { id: 'abyss', label: 'Abysse', className: 'zone-abyss' }
];

function setupIndexLegend() {
    const legend = document.getElementById('index-legend');
    if (!legend || legend.dataset.ready) return;
    legend.innerHTML = FISH_INDEX_ZONE_LEGEND.map(z =>
        `<span class="index-legend-item ${z.className}"><i aria-hidden="true"></i>${z.label}</span>`
    ).join('');
    legend.dataset.ready = '1';
}

function renderIndex(selectedRarityFolder = 'commun') {
    const grid = document.getElementById('index-grid');
    if (!grid) return;
    grid.innerHTML = '';
    ZONE_DATA.forEach(zone => {
        const folderFishes = zone.library[selectedRarityFolder] || [];
        const zoneClass = `zone-${zone.id}`;
        folderFishes.forEach(fileName => {
            const imgPath = `assets/fish/${selectedRarityFolder}/${fileName}`;
            const isUnlocked = state.discoveredFishes.includes(imgPath);
            const speciesName = fileName.replace('.png', '').replace(/_/g, ' ');
            const slot = document.createElement('div');
            slot.className = `fish-slot ${zoneClass} ${isUnlocked ? 'unlocked' : 'locked'}`;
            slot.title = `${zone.name} · ${isUnlocked ? speciesName : 'Non découvert'}`;
            slot.innerHTML = `<img src="${imgPath}" alt=""><span>${isUnlocked ? speciesName : '???'}</span>`;
            grid.appendChild(slot);
        });
    });
}

function setupIndexTabs() {
    const tabsContainer = document.getElementById('index-tabs');
    if (!tabsContainer) return;
    setupIndexLegend();
    tabsContainer.innerHTML = '';
    RARITIES.forEach((rarity, idx) => {
        const tab = document.createElement('div');
        tab.className = 'index-tab' + (idx === 0 ? ' active' : '');
        tab.innerText = rarity.name;
        tab.onclick = () => {
            document.querySelectorAll('.index-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderIndex(rarity.folder);
        };
        tabsContainer.appendChild(tab);
    });
}

function getEquippedRodData() {
    ensureValidEquippedRod();
    const id = Number(state.equippedRod);
    const owned = state.ownedRods.map(Number);
    const rod = ALL_RODS.find(r => r.id === id);
    if (!rod || !owned.includes(id) || !canEquipRod(id)) return ALL_RODS[0];
    return rod;
}

function updateFishingRodDisplay() {
    const currentRod = getEquippedRodData();
    const gameContainer = document.getElementById('fishing-rod-container');
    const menuBackdrop = document.getElementById('menu-rod-backdrop');
    const imgHtml = `<img src="${currentRod.img}" class="fishing-rod-img" alt="${currentRod.name}">`;
    const menuHtml = `<img src="${currentRod.img}" class="menu-rod-img" alt="">`;
    if (gameContainer) gameContainer.innerHTML = imgHtml;
    if (menuBackdrop) menuBackdrop.innerHTML = menuHtml;
    syncMenuRodBackdrop();
}


function init() {
    normalizeInventory();
    normalizeUnlockedAquariums();
    // Fonction interne pour ajouter des événements sans faire planter le jeu
    const bind = (id, action) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', action);
        } else {
            console.warn(`Alerte : Le bouton ${id} est manquant dans le HTML.`);
        }
    };

    try {
        if(elements.highScore) elements.highScore.innerText = `Meilleur Score : ${state.highScore}`;
        updateMoneyDisplay(); 
        updateProgression();
        updateKeysDisplay();
        updateAquariumCapacityHUD();
        updateZoneBackgrounds();
        startAutoDayNightCycle();
    } catch(e) { 
        console.error("Erreur visuelle init : ", e); 
    }

    // --- BOUTONS MENU ---
    bind('btn-start', startGame);
    bind('btn-restart', startGame);
    bind('btn-inventory', () => {
        state.currentPhase = 'INVENTORY'; 
        showScreen('inventory'); 
        renderAquarium(); 
        animateFish();
    });
    bind('btn-shop', () => { showScreen('shop'); renderShop(); });
    bind('btn-equipment', () => { showScreen('equipment'); renderEquipment(); });
    bind('btn-index', () => { showScreen('index'); setupIndexTabs(); renderIndex('commun'); });
    bind('btn-map', () => { showScreen('map'); renderMap(); });
    bind('btn-leaderboard', () => {
        if (window.StepFishLeaderboard) StepFishLeaderboard.open();
        else showScreen('leaderboard');
    });
    bind('btn-cosmetics', () => {
        if (window.StepFishCosmetics) StepFishCosmetics.open();
    });
    bind('btn-achievements', () => {
        if (window.StepFishAchievements) StepFishAchievements.open();
    });
    bind('btn-back-menu-achievements', goToMenu);
    bind('btn-trades', () => {
        if (window.StepFishTrade) StepFishTrade.open();
        else addLog('Échanges indisponibles.', 'system');
    });
    bind('btn-crate', () => {
        updateKeysDisplay();
        renderCrateLootInfo();
        showScreen('crate');
    });

    // --- BOUTONS RETOUR & MODALS ---
    bind('btn-back-menu', goToMenu);
    bind('btn-back-menu-shop', goToMenu);
    bind('btn-back-menu-eq', goToMenu);
    bind('btn-back-menu-index', goToMenu);
    bind('btn-back-menu-map', goToMenu);
    bind('btn-back-menu-lb', goToMenu);
    bind('btn-back-menu-cosmetics', goToMenu);
    bind('btn-back-menu-trades', goToMenu);
    bind('btn-close-fish', () => showScreen('inventory'));
    bind('btn-close-profile', goToMenu);
    bind('btn-logout', () => {
        if (window.StepFishAuth?.isLoggedIn()) {
            persistGame();
            StepFishAuth.saveToCloud(getSavePayload()).finally(() => StepFishAuth.logout());
        }
    });
    bind('btn-close-catch', goToMenu);
    bind('btn-lock-catch', toggleLockFromCatchModal);
    bind('user-pseudo', openProfile);
    bind('btn-buy-aq', buyAquarium);
    bind('btn-open-crate', openCrate);
    bind('btn-back-menu-crate', goToMenu);
    bind('btn-treasure-close', goToMenu);

    // --- NAVIGATION AQUARIUM ---
    bind('prev-aq', () => {
        state.currentAqIndex--;
        if (state.currentAqIndex < 0) state.currentAqIndex = AQ_CONFIGS.length - 1;
        renderAquarium();
    });
    bind('next-aq', () => {
        state.currentAqIndex++;
        if (state.currentAqIndex >= AQ_CONFIGS.length) state.currentAqIndex = 0;
        renderAquarium();
    });
    bind('btn-sell-all-aq', sellAllFromAq);
    bind('btn-sell-all-global', sellAllFromAllAquariums);

    // --- INPUTS souris / tactile ---
    window.addEventListener('pointermove', (e) => {
        if (state.currentPhase === 'REELING') updateReelPlayerPos(e.clientY);
    });

    const reelBar = document.getElementById('reel-bar');
    if (reelBar) {
        reelBar.addEventListener('pointerdown', (e) => {
            if (state.currentPhase !== 'REELING') return;
            reelBar.setPointerCapture(e.pointerId);
            updateReelPlayerPos(e.clientY);
        });
        reelBar.addEventListener('pointermove', (e) => {
            if (state.currentPhase !== 'REELING') return;
            updateReelPlayerPos(e.clientY);
        });
    }

    function onBiteAction(e) {
        if (state.currentPhase !== 'BITE') return;
        if (e.target.closest('button, a, input, textarea, select, label, #sidebar, .btn-sidebar-toggle')) return;
        triggerCatch();
    }
    window.addEventListener('pointerdown', onBiteAction);

    if (elements.biteIndicator) {
        elements.biteIndicator.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            if (state.currentPhase === 'BITE') triggerCatch();
        });
    }

    initMobileUI();


    // Canne à pêche
    updateFishingRodDisplay();
}

function initMobileUI() {
    const toggle = document.getElementById('btn-sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const viewport = document.getElementById('game-viewport');
    if (!toggle || !sidebar) return;

    const overlay = document.getElementById('sidebar-overlay');

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = sidebar.classList.toggle('sidebar-open');
        viewport?.classList.toggle('sidebar-open', open);
        if (overlay) overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    });

    overlay?.addEventListener('click', closeMobileSidebar);

    document.addEventListener('click', (e) => {
        if (!isMobileLayout() || !sidebar.classList.contains('sidebar-open')) return;
        if (sidebar.contains(e.target) || toggle.contains(e.target)) return;
        closeMobileSidebar();
    });
}

let isCrateOpening = false;

function openCrate() {
    if (isCrateOpening) return;
    if (state.keys < 1) {
        addLog('Vous n\'avez pas de clé ! Pêchez pour en trouver (~1/150).', 'system');
        return;
    }

    state.keys--;
    updateKeysDisplay();
    playChestSound();
    window.StepFishAchievements?.onCrateOpened?.();

    const crateList = document.getElementById('crate-list');
    if (!crateList) return;
    isCrateOpening = true;
    updateCrateUI();

    crateList.style.transition = 'none';
    crateList.style.transform = 'translateX(0)';
    crateList.innerHTML = '';

    const itemsToSpawn = 50;
    const winIndex = 45;
    let winningLoot = null;

    for (let i = 0; i < itemsToSpawn; i++) {
        const loot = rollCrateLoot();
        if (i === winIndex) winningLoot = loot;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'crate-item';
        itemDiv.style.borderColor = loot.color;
        itemDiv.innerHTML = getCrateItemHTML(loot);
        crateList.appendChild(itemDiv);
    }

    if (!winningLoot) winningLoot = rollCrateLoot();

    setTimeout(() => {
        crateList.style.transition = 'transform 5s cubic-bezier(0.15, 0, 0.05, 1)';
        const itemWidth = 136;
        const centerOffset = (800 / 2) - (itemWidth / 2);
        const finalPosition = (winIndex * itemWidth) - centerOffset;
        crateList.style.transform = `translateX(-${finalPosition}px)`;
    }, 50);

    setTimeout(() => {
        applyCrateReward(winningLoot);
        isCrateOpening = false;
        updateCrateUI();
    }, 5200);
}

async function boot() {
    window.__stepfishGetState = () => state;
    masterVolume = loadMasterVolume();
    volumeMuted = masterVolume <= 0;
    setupAudio();
    preloadAllAudio();
    if (window.StepFishAuth) await StepFishAuth.init();
    await decodeAudioFile(AUDIO_FILES.button);
    decodeAudioFile(AUDIO_FILES.splash);
    decodeAudioFile(AUDIO_FILES.chest);
    init();
    if (window.StepFishAuth) StepFishAuth.updatePseudoDisplay();
    if (window.StepFishLeaderboard) StepFishLeaderboard.init();
    if (window.StepFishCosmetics) StepFishCosmetics.init();
    if (window.StepFishAchievements) StepFishAchievements.init();
    if (window.StepFishChat) StepFishChat.start();
    if (window.StepFishPublicProfile) StepFishPublicProfile.init();
    if (window.StepFishTrade) StepFishTrade.start();
}

window.StepFishGameTrade = {
    listTradeableFish,
    findFishByUid,
    canTradeFish,
    buildFishVisualHTML,
    getFishWeightKg,
    formatFishWeight,
    getMutationData,
    getRarityNameFromClass,
    getFishPrefixMult,
    aquariumFishWidthPx,
    applySaveData,
    refreshInventoryAfterCloudSync,
    updateAquariumCapacityHUD,
    addLog,
    renderAquarium,
    showScreen
};

window.StepFishGameMeta = {
    hasDiscoveredAllLacFish: () => hasDiscoveredAllLacFish(),
    hasDiscoveredAllOceanFish: () => hasDiscoveredAllOceanFish(),
    hasDiscoveredAllAbyssFish: () => hasDiscoveredAllAbyssFish(),
    hasDiscoveredAllFishInGame: () => hasDiscoveredAllFishInGame(),
    getLacFishCount: () => getLacFishCount(),
    getDiscoveredLacCount: () => getDiscoveredLacCount(),
    getOceanFishCountForAbyss: () => getOceanFishCountForAbyss(),
    getDiscoveredOceanCountForAbyss: () => getDiscoveredOceanCountForAbyss(),
    getAbyssFishCount: () => getAbyssFishCount(),
    getDiscoveredAbyssCount: () => getDiscoveredAbyssCount(),
    getAllFishSpeciesCount: () => getAllFishSpeciesCount(),
    getDiscoveredSpeciesCount: () => (window.__stepfishGetState?.()?.discoveredFishes || []).length
};

window.StepFishAquariumPreview = {
    renderAquariumFishLayer,
    startAquariumFishAnimation,
    stopAquariumFishAnimation,
    buildFishVisualHTML,
    getFishWeightKg,
    formatFishWeight,
    getMutationData,
    getRarityNameFromClass,
    getFishPrefixMult,
    aquariumFishWidthPx
};

boot();
