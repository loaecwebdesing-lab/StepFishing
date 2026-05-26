/**
 * STEPFISHING - Pro Edition
 * Version: 13.0.3 (Corrected Order)
 */

/** Poids de tirage par rareté (Mythique / Divin très bas) */
const RARITY_WEIGHTS = [88, 40, 17, 6, 1.4, 0.04, 0.008];

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
const ROD_DATA = [
    { id: 0, name: "Canne en Bambou", cost: 0, luck: 0, speed: 1, time: 0, img: "assets/rods/rod0.png", moneyBuff: 1 },
    { id: 1, name: "Canne Fine", cost: 500, luck: 1, speed: 1.2, time: 5, img: "assets/rods/rod1.png", moneyBuff: 1 },
    { id: 2, name: "Canne en Aluminium", cost: 2500, luck: 2, speed: 1.5, time: 10, img: "assets/rods/rod2.png", moneyBuff: 1 },
    { id: 3, name: "Canne en Carbone", cost: 10000, luck: 4, speed: 2.0, time: 15, img: "assets/rods/rod3.png", moneyBuff: 1.1 },
    { id: 4, name: "Canne Pro", cost: 50000, luck: 7, speed: 2.5, time: 20, img: "assets/rods/rod4.png", moneyBuff: 1.2 },
    { id: 5, name: "Canne ProMax", cost: 100000, luck: 8, speed: 2.9, time: 25, img: "assets/rods/rod5.png", moneyBuff: 1.5 }
];

// 2. Ensuite on définit les cannes des coffres
const ROD_IMG_V = 'v=2';
const CRATE_RODS = [
    { id: 10, name: "Canne Astral", rarity: 'Rare', luck: 10, speed: 2.0, time: 20, img: "assets/rods/astral.png?" + ROD_IMG_V, color: '#2196F3', moneyBuff: 2 },
    { id: 11, name: "Canne Solaire", rarity: 'Épique', luck: 15, speed: 2.5, time: 30, img: "assets/rods/solaire.png?" + ROD_IMG_V, color: '#FFD700', moneyBuff: 3 },
    { id: 12, name: "Canne Nécro", rarity: 'Légendaire', luck: 25, speed: 3.0, time: 40, img: "assets/rods/necro.png?" + ROD_IMG_V, color: '#9C27B0', moneyBuff: 5 },
    { id: 13, name: "Canne du Chaos", rarity: 'Mythique', luck: 40, speed: 4.0, time: 60, img: "assets/rods/chaos.png?" + ROD_IMG_V, color: '#F44336', moneyBuff: 10 },
    { id: 14, name: "L'Excalibur des Mers", rarity: 'Divin', luck: 100, speed: 6.0, time: 120, img: "assets/rods/excalibur.png?" + ROD_IMG_V, color: '#4B0082', moneyBuff: 25 },
];

// 3. MAINTENANT on peut fusionner les deux (car les deux existent déjà)
const ALL_RODS = [...ROD_DATA, ...CRATE_RODS];

const KEY_CATCH_CHANCE = 1 / 150;
const KEY_IMG = 'assets/Key.png?v=1';

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
const AUDIO_FILES = {
    ambi: 'assets/Ambi.mp3',
    splash: 'assets/Splash.mp3',
    chest: 'assets/Chest.mp3',
    button: 'assets/Button.mp3?v=2'
};

let audioCtx = null;
const audioBuffers = {};
const sfxPools = {};
let bgMusicEl = null;
let lastButtonSfxAt = 0;
function getBgMusic() {
    if (!bgMusicEl) {
        bgMusicEl = window.__stepfishBgMusic || document.getElementById('bg-music');
    }
    return bgMusicEl;
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

function initSfxPool(key, src, size, volume = SFX_VOLUME) {
    if (sfxPools[key]?.length) return;
    sfxPools[key] = [];
    for (let i = 0; i < size; i++) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = volume;
        audio.load();
        sfxPools[key].push(audio);
    }
}

function playBufferSrc(src, volume = SFX_VOLUME) {
    const buffer = audioBuffers[src];
    if (!buffer) return false;
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
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
    sound.volume = volume;
    sound.play().catch(() => {});
}

function playButtonSound() {
    if (!playBufferSrc(AUDIO_FILES.button, BUTTON_VOLUME)) playSfxHtml('button', BUTTON_VOLUME);
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
    music.muted = false;
    music.volume = MUSIC_VOLUME;
    music.play().catch(() => {});
}

function setupAudio() {
    document.addEventListener('pointerdown', (e) => {
        startBackgroundMusic();
        const btn = e.target.closest('button');
        if (!btn || btn.id === 'btn-open-crate') return;
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

const ZONE_DATA = [
    // ... (ton code de zones reste identique)

    { 
        id: 'lac', 
        name: 'Lac Calme', 
        bgDay: 'assets/background_day.png', 
        bgDawn: 'assets/background_dawn.png', 
        bgNight: 'assets/background_night.png',
        library: {
            'commun': ['Carasin.png', 'Rosette.png', 'Vandoise.png', 'Ecrevise.png', 'Ablette.png', 'GobieSauteur.png', 'Carpe.png', 'Perche.png', 'Truite.png', 'Barbeau.png', 'Breme.png', 'Tanche.png', 'Goujon.png', 'Rotengle.png', 'Black_Bass.png', 'Gardon.png', 'Crapet.png', 'Spirlin.png','Coregone.png','Huchon.png','Bouviere.png','Blageon.png'],
            'peu_commun': ['Loche.png', 'Pseudorasboa.png', 'Epinoche.png', 'Anguille.png', 'Brochet.png', 'Apron.png', 'Omble.png', 'Lamproie.png','Tilapia.png'], 
            'rare': ['Carpe_Koi.png', 'Piranha.png', 'Channa.png', 'Oscar.png', 'Hotu.png', 'Axolotl.png', 'AxolotlA.png','Pleco.png','Corydoras.png','Rasboa.png'], 
            'epique': ['Silure.png', 'SnakeHead.png', 'Bichir.png', 'AxolotlB.png','Pangasius.png','FlapJack.png'], 
            'legendaire': ['Arapaima.png', 'GarAligator.png', 'AxolotlG.png','Arowana.png','ArowanaR.png'], 'mythique': ['Esturgeon.png'], 'divin': ['Silencius.png']
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
            'commun': ['Merou.png', 'Labre.png', 'Chirurgien.png', 'Vivaneau.png', 'Sardine.png', 'Maquereau.png', 'Mulet.png', 'LieuJaune.png', 'Anchois.png', 'Rougeais.png','Liche.png','Pagre.png','Tacaud.png'],
            'peu_commun': ['PoissonClown.png', 'PoissonLion.png', 'Bar.png', 'Sole.png', 'Dorade.png','SaintPierre.png','Napoleon.png'], 
            'rare': ['Baracuda.png', 'Thon.png','Turbot.png','Papillon.png'], 
            'epique': ['Espadon.png', 'MahiMahi.png','Poulpi.png','PoissonGlobe.png'], 
            'legendaire': ['Raiemanta.png'], 'mythique': ['Krakenor.png', 'Chronos.png'], 'divin': ['Abysellion.png']
        }
    }
];

const FISH_DATA = {
    prefixes: { 'Commun': ['Petit', 'Svelte', 'Maigrichon', 'Apathique', 'Faible', 'Grincheux', 'Fatigué', 'Rachitique', 'Déprimé', 'Timide', 'Skinny'], 'Peu Commun': ['Vif', 'Curieux', 'Enjoué', 'Frétillant', 'Mignon', 'Glouton', 'Rapide', 'Présentable'], 'Rare': ['Brillant', 'Joli', 'Beau', 'Séduisant', 'Luisant', 'Jovial', 'Adorable', 'Musclé', 'Etonant'], 'Épique': ['Souverain', 'Ancien', 'Admirable', 'Elegant', 'Enorme', 'Croustillant', 'Scintillant', 'Délicieux', 'Glorieux'], 'Légendaire': ['Colossal', 'Éternel', 'Monumental', 'Sublime', 'Maxi', 'Raciste'], 'Mythique': ['Céleste', 'Primordial', 'Intouchable', 'Inébranlable', 'Interdit', 'Immortel', 'Béni'], 'Divin': ['Cosmique', 'Omnipotant', 'Dieu', 'Stélaire', 'Intergalactique'] }
};

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

/**
 * Répartition par rareté selon la luck de la canne (combo ignoré).
 * Ex. luck 0 ~84 % commun, luck 2 (alu) ~70 %, luck 7 ~35 %, luck 25+ beaucoup de hautes raretés.
 */
function getRarityWeightsForLuck(luck) {
    const l = Math.min(Math.max(0, luck), 100);
    const communPct = Math.max(0.26, 0.84 - l * 0.07);
    const rest = 1 - communPct;
    return [
        communPct * 100,
        rest * 38,
        rest * 22,
        rest * 14,
        rest * 9,
        rest * 0.35,
        rest * 0.06
    ];
}

/** Tirage d'une espèce dans la zone : poids par canne + anti-répétition (combo ignoré). */
function pickFishFromZone(zone, luck = 0) {
    const tierWeights = getRarityWeightsForLuck(luck);
    const pool = [];

    for (let r = 0; r < RARITIES.length; r++) {
        const folder = RARITIES[r].folder;
        const files = zone.library[folder] || [];
        if (!files.length) continue;
        const each = tierWeights[r] / files.length;
        files.forEach(file => {
            pool.push({ rIdx: r, file, folder, weight: each });
        });
    }

    if (!pool.length) {
        const fallback = (zone.library.commun || ['Carpe.png'])[0];
        return { rIdx: 0, file: fallback, folder: 'commun' };
    }

    let candidates = pool;
    const recent = state.recentCatchSpecies || [];
    if (recent.length && pool.length > 4) {
        const last = recent[recent.length - 1];
        const withoutLast = pool.filter(p => p.file !== last);
        if (withoutLast.length) candidates = withoutLast;
        if (recent.length >= 2 && withoutLast.length > 6) {
            const last2 = new Set(recent.slice(-2));
            const without2 = pool.filter(p => !last2.has(p.file));
            if (without2.length) candidates = without2;
        }
    }

    let total = candidates.reduce((s, p) => s + p.weight, 0);
    let roll = Math.random() * total;
    let sum = 0;
    let pick = candidates[0];
    for (const p of candidates) {
        sum += p.weight;
        if (roll <= sum) {
            pick = p;
            break;
        }
    }

    const rIdx = pick.rIdx;

    if (!state.recentCatchSpecies) state.recentCatchSpecies = [];
    state.recentCatchSpecies.push(pick.file);
    if (state.recentCatchSpecies.length > 8) state.recentCatchSpecies.shift();

    return { rIdx, file: pick.file, folder: pick.folder };
}

function rollFishRarityIndex(luck = 0) {
    const zone = ZONE_DATA.find(z => z.id === state.currentZone) || ZONE_DATA[0];
    return pickFishFromZone(zone, luck).rIdx;
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
        equippedCosmetic: state.equippedCosmetic || 'default'
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
    if (!state.bestFish?.value) {
        const derived = findBestFishInInventory(state.inventory);
        if (derived) state.bestFish = derived;
    }
    ensureFishUidsInInventory();
    persistGameLocal();
    updateMoneyDisplay();
    updateKeysDisplay();
    updateProgression();
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
    ownedRods: safeParse('stepFishingOwnedRods', [0]), 
    equippedRod: parseInt(localStorage.getItem('stepFishingEquippedRod')) || 0,
    discoveredFishes: safeParse('stepFishingDiscovered', []),
    bestFish: safeParse('stepFishingBestFish', null),
    currentZone: localStorage.getItem('stepFishingCurrentZone') || 'lac',
    keys: parseInt(localStorage.getItem('stepFishingKeys')) || 0,
    ownedCosmetics: safeParse('stepFishingOwnedCosmetics', ['default']),
    equippedCosmetic: localStorage.getItem('stepFishingEquippedCosmetic') || 'default',
    recentCatchSpecies: []
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
        map: getEl('screen-map')
    },
    score: getEl('current-score'), walletBalance: getEl('wallet-balance'), walletGame: getEl('wallet-game'), keysBalance: getEl('keys-balance'), userLevel: getEl('user-level'), userPrestige: getEl('user-prestige'), combo: getEl('combo-count'), comboDisplay: getEl('combo-display'), timer: getEl('time-left'), ocean: getEl('ocean'), biteIndicator: getEl('bite-indicator'), reelContainer: getEl('reel-container'), fishTarget: getEl('fish-target'), playerCursor: getEl('player-cursor'), progressFill: getEl('progress-fill'), fishName: getEl('fish-name-display'), fishVisual: getEl('fish-visual'), gameLog: getEl('game-log'), aqViewport: getEl('aquarium-viewport'), fishLayer: getEl('fish-layer'), aqTitle: getEl('aq-title'), aqSlots: getEl('aq-slots'), aqLock: getEl('aq-lock-screen'), aqCost: getEl('aq-cost'), modalFishVisual: getEl('modal-fish-visual'), modalFishName: getEl('modal-fish-name'), modalFishRarity: getEl('modal-fish-rarity'), modalFishPrice: getEl('modal-fish-price'), profLevel: getEl('prof-level'), profPrestige: getEl('prof-prestige'), profFishes: getEl('prof-fishes'), profMaxMoney: getEl('prof-max-money'), profTotalScore: getEl('prof-total-score'), catchTitle: getEl('catch-title'), catchText: getEl('catch-text'), catchVisual: getEl('catch-visual')
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

function computeLevelFromScore(totalScore) {
    return Math.floor(Math.pow((totalScore || 0) / 10, 0.7)) + 1;
}

function computePrestigeFromLevel(level) {
    return Math.floor((level || 1) / 100);
}

function getZoneMinLevel(zone) {
    return zone?.minLevel || 1;
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

function isZoneUnlocked(zone) {
    if (!zone) return false;
    if (state.level < getZoneMinLevel(zone)) return false;
    if (zone.id === 'ocean') return hasDiscoveredAllLacFish();
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
    state.equippedRod = loot.rod.id;
    persistGame();
    updateFishingRodDisplay();
    alert(`🎉 BRAVO ! Canne débloquée : ${loot.rod.name} (${loot.rod.rarity})`);
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
    ensureValidZone();
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
    return Boolean(fish && !fish.isKey && !isFishLocked(fish) && fish.uid);
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
        if (state.inventory[aqId].length < 15) {
            state.inventory[aqId].push(ensureFishUid({ ...fish, locked: Boolean(fish.locked) }));
            return { placed: true, aqIndex: i, aqId };
        }
    }
    return { placed: false };
}

function getMutationData(mutationName) {
    return MUTATIONS.find(m => m.name === mutationName) || MUTATIONS[0];
}

function renderCatchReveal(fish) {
    const nameEl = document.getElementById('catch-fish-name');
    const rarityEl = document.getElementById('catch-fish-rarity');
    const visual = elements.catchVisual;
    if (!fish) {
        if (nameEl) { nameEl.textContent = ''; nameEl.className = 'rarity-text catch-fish-name'; }
        if (rarityEl) rarityEl.textContent = '';
        if (visual) { visual.innerHTML = ''; visual.style.removeProperty('--catch-glow'); }
        return;
    }
    const baseSize = fish.isKey ? 150 : aquariumFishWidthPx(fish.weight) + 22;
    const size = baseSize * 2;
    if (visual) {
        visual.innerHTML = buildFishVisualHTML(fish, size);
        visual.style.setProperty('--catch-glow', fish.color || '#ffffff');
    }
    if (nameEl) {
        nameEl.textContent = fish.name;
        nameEl.className = `rarity-text catch-fish-name ${fish.class || 'rarity-0'}`;
    }
    if (rarityEl) {
        if (fish.isKey) {
            rarityEl.textContent = 'Clé mystérieuse';
            rarityEl.style.color = fish.color || '#ffca28';
        } else {
            const mutation = getMutationData(fish.mutation);
            rarityEl.textContent = `${getRarityNameFromClass(fish.class)} · ${formatFishWeight(fish.weight)} · ${mutation.name}`;
            rarityEl.style.color = fish.color || '';
        }
    }
}

function clearCatchReveal() {
    renderCatchReveal(null);
}

function buildFishVisualHTML(fish, width) {
    if (fish.isKey) {
        const img = fish.img || KEY_IMG;
        const size = Math.round(width * 0.88);
        return `<div class="fish-visual-wrap key-catch-visual" style="width:${width}px;height:${width}px;">
            <img src="${img}" class="key-catch-img" style="width:${size}px;height:${size}px" alt="Clé mystérieuse">
        </div>`;
    }
    const mutation = getMutationData(fish.mutation);
    return `<div class="fish-visual-wrap" data-mutation="${mutation.name}">
        <img src="${fish.img}" class="fish-mut-img" style="width:${width}px" alt="${fish.name}">
    </div>`;
}

function spawnFishParticle(fishEl) {
    const mutationName = fishEl.dataset.mutation;
    if (!mutationName || mutationName === 'Normal') return;
    if (Math.random() > 0.04) return;

    const mut = getMutationData(mutationName);
    const layer = elements.fishLayer;
    if (!layer) return;

    const fishRect = fishEl.getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.className = `fish-particle particle-${mut.effect}`;
    particle.style.background = mut.color;
    particle.style.left = (fishRect.left - layerRect.left + fishRect.width * (0.3 + Math.random() * 0.4)) + 'px';
    particle.style.top = (fishRect.top - layerRect.top + fishRect.height * (0.3 + Math.random() * 0.4)) + 'px';
    layer.appendChild(particle);
    setTimeout(() => particle.remove(), 800);
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
    if (elements.aqSlots) elements.aqSlots.innerText = `Slots: ${fishes.length}/15`;
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

function sellAllFromAq() {
    const aqId = `aq${state.currentAqIndex}`;
    const fishes = state.inventory[aqId] || [];
    if (fishes.length === 0) {
        addLog("Le bac est déjà vide !", "system");
        return;
    }
    const kept = [];
    let totalGain = 0;
    let soldCount = 0;
    fishes.forEach(fish => {
        if (isFishLocked(fish)) {
            kept.push(fish);
        } else {
            totalGain += fish.value || 0;
            soldCount++;
        }
    });
    if (soldCount === 0) {
        addLog('Aucun poisson vendu : tous sont verrouillés 🔒', 'system');
        return;
    }
    state.money += totalGain;
    state.inventory[aqId] = kept;
    persistGame();
    updateMoneyDisplay();
    renderAquarium();
    const lockedNote = kept.length ? ` · ${kept.length} verrouillé(s) conservé(s)` : '';
    addLog(`Vendu ${soldCount} poisson(s) : ${totalGain.toLocaleString('en-US', { minimumFractionDigits: 2 })} $${lockedNote}`, 'epic');
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
    elements.modalFishRarity.innerText = `${rarityInfo ? rarityInfo.name : 'Inconnu'} · ${formatFishWeight(weightKg)} · Mutation : ${mutation.name}`;
    elements.modalFishPrice.innerText = fish.value + " $";
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
    if (state.inventory[targetAqId].length >= 15) {
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
    const targetSize = 70;
    const marginX = Math.max(48, Math.round(oceanWidth * 0.14));
    const marginY = Math.max(48, Math.round(oceanHeight * 0.16));
    const usableW = Math.max(0, oceanWidth - marginX * 2 - targetSize);
    const usableH = Math.max(0, oceanHeight - marginY * 2 - targetSize);

    target.style.left = (marginX + Math.random() * usableW) + 'px';
    target.style.top = (marginY + Math.random() * usableH) + 'px';
    
    target.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        state.combo++; 
        elements.combo.innerText = state.combo;
        target.remove(); 
        spawnOsuTarget();
        if (state.combo >= 5) setPhase('BITE');
    });
    
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

    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    const zone = ZONE_DATA.find(z => z.id === state.currentZone);
    const activeZone = zone || ZONE_DATA[0];
    const pick = pickFishFromZone(activeZone, currentRod.luck || 0);
    const rIdx = pick.rIdx;
    const rData = RARITIES[rIdx];
    const randomFishFile = pick.file;
    const selectedImg = `assets/fish/${pick.folder}/${randomFishFile}`;
    const fishSpecies = randomFishFile.replace('.png', '').replace(/_/g, ' ');

    const mutation = rollMutation();
    const weight = rollFishWeight(rIdx);
    state.currentFish = ensureFishUid({
        ...rData,
        id: rIdx,
        name: generateProceduralName(rData.name, fishSpecies),
        img: selectedImg,
        weight,
        value: calculateFishValue(rIdx) * mutation.multiplier,
        mutation: mutation.name
    });
    setPhase('REELING');
}

function startReelGame() {
    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    state.reelProgress = 20;
    state.fishPos = 150;
    state.fishTargetY = Math.random() * 250;

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

            if (Math.abs(diff) < 10) state.fishTargetY = Math.random() * 250;
            if(elements.fishTarget) elements.fishTarget.style.top = state.fishPos + 'px';

            const isInside = state.playerPos >= state.fishPos && state.playerPos <= (state.fishPos + 50);

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
    if (success && state.currentFish?.isKey) {
        state.keys++;
        updateKeysDisplay();
        state.score += state.currentFish.points;
        state.totalScore += state.currentFish.points;
        elements.catchTitle.innerText = 'CLÉ TROUVÉE !';
        elements.catchText.innerText = 'Utilisez-la pour ouvrir le coffre mystère.';
        renderCatchReveal(state.currentFish);
        showScreen('catch-modal');
        addLog('🔑 Clé mystérieuse récupérée !', 'epic');
        updateProgression();
        elements.score.innerText = state.score;
        stopFishingSession();
        return;
    }

    if (success) {
        state.score += state.currentFish.points;
        state.totalScore += state.currentFish.points;
        state.totalFishesCaught++;
        updateBestFishRecord(state.currentFish);
        const placement = placeFishInAquarium(state.currentFish);
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
        showScreen('catch-modal');
        if (!state.discoveredFishes.includes(state.currentFish.img)) {
            state.discoveredFishes.push(state.currentFish.img);
            persistGame();
            showDiscoveryToast(state.currentFish.name, state.currentFish.name, state.currentFish.mutation);
            if (hasDiscoveredAllLacFish() && state.level >= 10) {
                addLog('🌊 Haute Mer débloquée ! Toutes les espèces du Lac requises sont dans ton FishIndex.', 'epic');
            }
        }
    } else {
        if (state.currentFish?.isKey) {
            elements.catchTitle.innerText = 'CLÉ PERDUE...';
            elements.catchText.innerText = 'La clé mystérieuse s\'est échappée...';
        } else {
            elements.catchTitle.innerText = "ÉCHEC...";
            elements.catchText.innerText = `Le ${state.currentFish.name} s'est échappé...`;
        }
        clearCatchReveal();
        showScreen('catch-modal');
        addLog(state.currentFish?.isKey ? 'La clé mystérieuse a filé...' : `Le ${state.currentFish.name || 'poisson'} a filé...`, 'system');
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
    state.recentCatchSpecies = []; 
    
    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    
    state.timeLeft = 30 + currentRod.time;
    elements.score.innerText = state.score; 
    elements.timer.innerText = state.timeLeft;
    
    showScreen('game');
    updateFishingRodDisplay();
    
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

function generateProceduralName(rarityName, speciesName) {
    const prefixes = FISH_DATA.prefixes[rarityName];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${speciesName} ${prefix}`;
}

function rollRandomMutation() {
    return pickWeightedMutation(MUTATIONS.filter(m => m.name !== 'Normal'));
}

function createRandomMutatedFish(zoneId = state.currentZone) {
    const zone = ZONE_DATA.find(z => z.id === zoneId) || ZONE_DATA[0];
    const rod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    const pick = pickFishFromZone(zone, rod.luck || 0);
    const rIdx = pick.rIdx;
    const rData = RARITIES[rIdx];
    const randomFishFile = pick.file;
    const fishSpecies = randomFishFile.replace('.png', '').replace(/_/g, ' ');
    const mutation = rollRandomMutation();
    const weight = rollFishWeight(rIdx);
    return ensureFishUid({
        ...rData,
        id: rIdx,
        name: generateProceduralName(rData.name, fishSpecies),
        img: `assets/fish/${rData.folder}/${randomFishFile}`,
        weight,
        value: parseFloat((calculateFishValue(rIdx) * mutation.multiplier).toFixed(2)),
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
        item.innerHTML = `<span style="font-family: 'Neko One', cursive;">${rod.name}</span>`;
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.innerText = state.equippedRod === id ? 'Équipé' : 'Équiper';
        btn.onclick = () => equipRod(id);
        item.appendChild(btn);
        list.appendChild(item);
    });
}


function equipRod(id) {
    state.equippedRod = id;
    persistGame();
    renderEquipment();
    
    const rod = ALL_RODS.find(r => r.id === id);
    addLog(`Matériel changé : ${rod ? rod.name : 'Canne'} équipée.`);
    updateFishingRodDisplay();
}


function renderIndex(selectedRarityFolder = 'commun') {
    const grid = document.getElementById('index-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const allFishes = {};
    ZONE_DATA.forEach(zone => {
        const folderFishes = zone.library[selectedRarityFolder] || [];
        folderFishes.forEach(f => {
            if(!allFishes[f]) allFishes[f] = f;
        });
    });
    Object.values(allFishes).forEach(fileName => {
        const imgPath = `assets/fish/${selectedRarityFolder}/${fileName}`;
        const isUnlocked = state.discoveredFishes.includes(imgPath);
        const speciesName = fileName.replace('.png', '').replace('_', ' ');
        const slot = document.createElement('div');
        slot.className = `fish-slot ${isUnlocked ? 'unlocked' : 'locked'}`;
        slot.innerHTML = `<img src="${imgPath}"><span>${isUnlocked ? speciesName : '???'}</span>`;
        grid.appendChild(slot);
    });
}

function setupIndexTabs() {
    const tabsContainer = document.getElementById('index-tabs');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';
    RARITIES.forEach(rarity => {
        const tab = document.createElement('div');
        tab.className = 'index-tab';
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
    const id = Number(state.equippedRod);
    const owned = state.ownedRods.map(Number);
    const rod = ALL_RODS.find(r => r.id === id);
    if (!rod || !owned.includes(id)) return ALL_RODS[0];
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
    bind('user-pseudo', openProfile);
    bind('btn-buy-aq', buyAquarium);
    bind('btn-open-crate', openCrate);
    bind('btn-back-menu-crate', goToMenu);

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

    // --- INPUTS SOURIS ---
        window.addEventListener('mousemove', (e) => {
        const bar = document.getElementById('reel-bar');
        if(!bar) return;

        const rect = bar.getBoundingClientRect();
        // On calcule la position exacte de la souris à l'intérieur de la barre noire
        let relativeY = e.clientY - rect.top;
        
        // On bloque la valeur entre 0 et 300 (la hauteur de la barre)
        state.playerPos = Math.max(0, Math.min(300, relativeY));

        if (state.currentPhase === 'REELING') {
            if(elements.playerCursor) {
                elements.playerCursor.style.top = state.playerPos + 'px';
            }
        }
    });

        // GESTION DU CLIC "MORDU" (SÉCURISÉE)
    window.addEventListener('mousedown', (e) => {
        if (state.currentPhase === 'BITE') {
            // On vérifie qu'on ne clique pas sur un bouton du menu
            if (e.target.tagName !== 'BUTTON') {
                triggerCatch();
            }
        }
    });

    // AJOUT : On permet aussi de cliquer DIRECTEMENT sur l'indicateur "Mordu"
    if(elements.biteIndicator) {
        elements.biteIndicator.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Évite de déclencher deux fois le clic
            triggerCatch();
        });
    }


    // Canne à pêche
    updateFishingRodDisplay();
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
    if (window.StepFishChat) StepFishChat.start();
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
    applySaveData,
    refreshInventoryAfterCloudSync,
    addLog,
    renderAquarium,
    showScreen
};

boot();
