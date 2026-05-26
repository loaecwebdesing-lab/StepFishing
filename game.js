/**
 * STEPFISHING - Pro Edition
 * Version: 13.0.3 (Corrected Order)
 */

const RARITY_WEIGHTS = [100, 40, 15, 5, 2, 1, 0.5];

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
const CRATE_RODS = [
    { id: 10, name: "Canne Astral", rarity: 'Rare', luck: 10, speed: 2.0, time: 20, img: "assets/rods/astral.png", color: '#2196F3', moneyBuff: 2 },
    { id: 11, name: "Canne Solaire", rarity: 'Épique', luck: 15, speed: 2.5, time: 30, img: "assets/rods/solaire.png", color: '#FFD700', moneyBuff: 3 },
    { id: 12, name: "Canne Nécro", rarity: 'Légendaire', luck: 25, speed: 3.0, time: 40, img: "assets/rods/necro.png", color: '#9C27B0', moneyBuff: 5 },
    { id: 13, name: "Canne du Chaos", rarity: 'Mythique', luck: 40, speed: 4.0, time: 60, img: "assets/rods/chaos.png", color: '#F44336', moneyBuff: 10 },
    { id: 14, name: "L'Excalibur des Mers", rarity: 'Divin', luck: 100, speed: 6.0, time: 120, img: "assets/rods/excalibur.png", color: '#4B0082', moneyBuff: 25 },
];

// 3. MAINTENANT on peut fusionner les deux (car les deux existent déjà)
const ALL_RODS = [...ROD_DATA, ...CRATE_RODS];

const KEY_CATCH_CHANCE = 1 / 150;

const CRATE_MONEY_LOOT = [
    { type: 'money', amount: 100, weight: 420, label: '100 $', color: '#BDBDBD' },
    { type: 'money', amount: 1000, weight: 230, label: '1 000 $', color: '#4CAF50' },
    { type: 'money', amount: 5000, weight: 90, label: '5 000 $', color: '#2196F3' },
    { type: 'money', amount: 10000, weight: 35, label: '10 000 $', color: '#FF9800' }
];

const CRATE_ROD_POOL_WEIGHT = 22;
const CRATE_ROD_WEIGHTS = { 'Rare': 45, 'Épique': 28, 'Légendaire': 15, 'Mythique': 8, 'Divin': 4 };

const AUDIO_VOLUME = 0.35;
const AUDIO_FILES = {
    ambi: 'assets/Ambi.mp3',
    splash: 'assets/Splash.mp3',
    chest: 'assets/Chest.mp3',
    button: 'assets/Button.mp3'
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

function initSfxPool(key, src, size) {
    if (sfxPools[key]?.length) return;
    sfxPools[key] = [];
    for (let i = 0; i < size; i++) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = AUDIO_VOLUME;
        audio.load();
        sfxPools[key].push(audio);
    }
}

function playBufferSrc(src) {
    const buffer = audioBuffers[src];
    if (!buffer) return false;
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = AUDIO_VOLUME;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
    return true;
}

function playSfxHtml(key) {
    const pool = sfxPools[key];
    if (!pool?.length) return;
    const sound = pool.find(a => a.paused || a.ended) || pool[0];
    sound.currentTime = 0;
    sound.volume = AUDIO_VOLUME;
    sound.play().catch(() => {});
}

function playButtonSound() {
    if (!playBufferSrc(AUDIO_FILES.button)) playSfxHtml('button');
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
    music.volume = AUDIO_VOLUME;
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
    initSfxPool('button', AUDIO_FILES.button, 4);
    initSfxPool('splash', AUDIO_FILES.splash, 2);
    initSfxPool('chest', AUDIO_FILES.chest, 2);
    startBackgroundMusic();
}

const KEY_FISH = {
    isKey: true,
    id: -1,
    name: 'Clé Mystérieuse',
    img: '',
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
            'commun': ['Carasin.png', 'Rosette.png', 'Vandoise.png', 'Ecrevise.png', 'Ablette.png', 'GobieSauteur.png', 'Carpe.png', 'Perche.png', 'Truite.png', 'Barbeau.png', 'Breme.png', 'Tanche.png', 'Goujon.png', 'Rotengle.png', 'Black_Bass.png', 'Gardon.png', 'Crapet.png'],
            'peu_commun': ['Loche.png', 'Pseudorasboa.png', 'Epinoche.png', 'Anguille.png', 'Brochet.png', 'Apron.png', 'Omble.png'], 
            'rare': ['Carpe_Koi.png', 'Piranha.png', 'Channa.png', 'Oscar.png', 'Hotu.png', 'Axolotl.png', 'AxolotlA.png'], 
            'epique': ['Silure.png', 'SnakeHead.png', 'Bichir.png', 'AxolotlB.png'], 
            'legendaire': ['Arapaima.png', 'GarAligator.png', 'AxolotlG.png'], 'mythique': [], 'divin': []
        }
    },
    { 
        id: 'ocean', 
        name: 'Haute Mer', 
        bgDay: 'assets/ocean_day.png', 
        bgDawn: 'assets/ocean_dawn.png', 
        bgNight: 'assets/ocean_night.png',
        library: {
            'commun': [],
            'peu_commun': [], 
            'rare': [], 
            'epique': [], 
            'legendaire': [], 'mythique': [], 'divin': []
        }
    }
];

const FISH_DATA = {
    prefixes: { 'Commun': ['Petit', 'Svelte', 'Maigrichon', 'Apathique', 'Faible', 'Grincheux', 'Fatigué', 'Rachitique', 'Déprimé', 'Timide', 'Skinny'], 'Peu Commun': ['Vif', 'Curieux', 'Enjoué', 'Frétillant', 'Mignon', 'Glouton', 'Rapide', 'Présentable'], 'Rare': ['Brillant', 'Joli', 'Beau', 'Séduisant', 'Luisant', 'Jovial', 'Adorable', 'Musclé', 'Etonant'], 'Épique': ['Souverain', 'Ancien', 'Admirable', 'Elegant', 'Enorme', 'Croustillant', 'Scintillant', 'Délicieux', 'Glorieux'], 'Légendaire': ['Colossal', 'Éternel', 'Monumental', 'Sublime', 'Maxi'], 'Mythique': ['Céleste', 'Primordial', 'Intouchable', 'Inébranlable', 'Interdit', 'Immortel', 'Béni'], 'Divin': ['Cosmique', 'Omnipotant', 'Dieu', 'Stélaire', 'Intergalactique'] }
};

const MUTATION_ROLL_CHANCE = 1 / 15;

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

function rollMutation() {
    if (Math.random() >= MUTATION_ROLL_CHANCE) return MUTATIONS[0];
    return pickWeightedMutation(MUTATIONS.filter(m => m.name !== 'Normal'));
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
        bestFish: state.bestFish || null
    };
}

function persistGameLocal() {
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
    state.ownedRods = data.ownedRods || [0];
    state.equippedRod = parseInt(data.equippedRod, 10) || 0;
    state.discoveredFishes = data.discoveredFishes || [];
    state.keys = parseInt(data.keys, 10) || 0;
    state.currentZone = data.currentZone || 'lac';
    state.bestFish = data.bestFish || null;
    if (!state.bestFish?.value) {
        const derived = findBestFishInInventory(state.inventory);
        if (derived) state.bestFish = derived;
    }
    persistGameLocal();
    updateMoneyDisplay();
    updateKeysDisplay();
    updateProgression();
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
    keys: parseInt(localStorage.getItem('stepFishingKeys')) || 0
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
                    class: fish.class || '',
                    rarity: getRarityNameFromClass(fish.class)
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
        class: fish.class,
        rarity: getRarityNameFromClass(fish.class)
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
    if (crateKeys) crateKeys.innerText = `🔑 Clés : ${state.keys}`;
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
let dayNightTimer = null;

function syncDayNightBackgrounds() {
    TIME_CYCLES.forEach((cycle, i) => {
        const el = document.getElementById(cycle.id);
        if (el) el.classList.toggle('active', i === state.currentCycle);
    });
}

function updateDayNightCycle() {
    const nextCycle = (state.currentCycle + 1) % TIME_CYCLES.length;
    const currentEl = document.getElementById(TIME_CYCLES[state.currentCycle].id);
    const nextEl = document.getElementById(TIME_CYCLES[nextCycle].id);
    if (nextEl) nextEl.classList.add('active');
    if (currentEl && currentEl !== nextEl) currentEl.classList.remove('active');
    state.currentCycle = nextCycle;
}

function startAutoDayNightCycle() {
    if (dayNightTimer) clearInterval(dayNightTimer);
    syncDayNightBackgrounds();
    dayNightTimer = setInterval(updateDayNightCycle, CYCLE_DURATION_MS);
}

function updateProgression() {
    state.level = computeLevelFromScore(state.totalScore);
    state.prestige = computePrestigeFromLevel(state.level);
    if(elements.userLevel) elements.userLevel.innerText = state.level;
    if(elements.userPrestige) elements.userPrestige.innerText = state.prestige;
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

function getMutationData(mutationName) {
    return MUTATIONS.find(m => m.name === mutationName) || MUTATIONS[0];
}

function buildFishVisualHTML(fish, width) {
    if (fish.isKey) {
        return `<div class="fish-visual-wrap key-catch-visual" style="width:${width}px;height:${width}px;display:flex;align-items:center;justify-content:center;font-size:${Math.round(width * 0.55)}px">🔑</div>`;
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
    const aqId = `aq${state.currentAqIndex}`;
    const config = AQ_CONFIGS[state.currentAqIndex];
    
    if(!elements.aqTitle) return;
    
    elements.aqTitle.innerText = config.name;
    
    const aqContainer = document.getElementById('aquarium-container');
    if (aqContainer) {
        aqContainer.style.backgroundImage = `url('${config.bg}')`;
        // ON FORCE ICI LE REMPLISSAGE POUR ÉVITER LE CONTOUR BUGGÉ
        aqContainer.style.backgroundSize = 'cover';
        aqContainer.style.backgroundPosition = 'center';
        aqContainer.style.backgroundRepeat = 'no-repeat';
    }
    // ... (le reste de la fonction reste identique)

    elements.aqLock.classList.add('hidden');
    elements.fishLayer.innerHTML = '';
    const fishes = state.inventory[aqId] || [];
    elements.aqSlots.innerText = `Slots: ${fishes.length}/15`;
    const scaleRanges = [[0.7, 1.0], [0.75, 1.05], [0.8, 1.15], [0.85, 1.25], [0.9, 1.35], [1.0, 1.5], [1.1, 1.65]];

    fishes.forEach((fish, index) => {
        const fDiv = document.createElement('div');
        const mutation = getMutationData(fish.mutation);
        fDiv.classList.add('aq-fish');
        if (mutation.effect !== 'none') fDiv.classList.add(`mut-${mutation.effect}`);
        fDiv.dataset.mutation = mutation.name;
        fDiv.style.setProperty('--mut-color', mutation.color);
        let rIdx = typeof fish.id === 'number' ? fish.id : RARITIES.findIndex(r => r.class === fish.class);
        if (rIdx < 0) rIdx = 0;
        const range = scaleRanges[rIdx] || [0.8, 1.1];
        const randomScale = Math.random() * (range[1] - range[0]) + range[0];
        const finalWidth = Math.min(130, Math.round(65 * randomScale));
        fDiv.innerHTML = `<img src="${fish.img}" class="aq-fish-img" style="width:${finalWidth}px">`;
        fDiv.style.left = Math.random() * 80 + 5 + '%';
        fDiv.style.top = Math.random() * 75 + 5 + '%';
        fDiv.dataset.fishData = JSON.stringify({ target: null, speed: 0 });
        fDiv.addEventListener('click', (e) => { e.stopPropagation(); openFishModal(index, aqId); });
        elements.fishLayer.appendChild(fDiv);
    });
}

function sellAllFromAq() {
    const aqId = `aq${state.currentAqIndex}`;
    const fishes = state.inventory[aqId] || [];
    if (fishes.length === 0) {
        addLog("Le bac est déjà vide !", "system");
        return;
    }
    let totalGain = 0;
    fishes.forEach(fish => { totalGain += fish.value; });
    state.money += totalGain;
    state.inventory[aqId] = [];
    persistGame();
    updateMoneyDisplay();
    renderAquarium();
    addLog(`Vendu tout le bac ! Gain : ${totalGain.toLocaleString('en-US', {minimumFractionDigits: 2})} $`, 'epic');
}

function renderMap() {
    const mapGrid = document.getElementById('map-zones');
    if(!mapGrid) return;
    mapGrid.innerHTML = '';
    ZONE_DATA.forEach(zone => {
        const card = document.createElement('div');
        card.className = `zone-card ${state.currentZone === zone.id ? 'active' : ''}`;
        card.innerHTML = `<h3>${zone.name}</h3><p>Découvrez les espèces de cette région</p>`;
        card.onclick = () => {
            state.currentZone = zone.id;
            persistGame();
            updateZoneBackgrounds();
            renderMap();
            showScreen('menu');
            addLog(`Vous avez voyagé vers : ${zone.name}`);
        };
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
    elements.modalFishVisual.innerHTML = buildFishVisualHTML(fish, 165);
    elements.modalFishName.innerText = fish.name;
    elements.modalFishName.className = `rarity-text ${fish.class}`;
    const rarityInfo = RARITIES.find(r => r.class === fish.class);
    const mutation = getMutationData(fish.mutation);
    elements.modalFishRarity.innerText = `${rarityInfo ? rarityInfo.name : 'Inconnu'} · Mutation : ${mutation.name}`;
    elements.modalFishPrice.innerText = fish.value + " $";
    const btnSell = document.getElementById('btn-sell-fish');
    const btnMove = document.getElementById('btn-move-fish');
    if(btnSell) btnSell.onclick = () => { sellFishFromAq(index, aqId); showScreen('inventory'); };
    if(btnMove) btnMove.onclick = () => { moveFishFromAq(index, aqId); };
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
    if (!state.unlockedAquariums.includes(targetAqIndex)) {
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
    const cost = AQ_CONFIGS[state.currentAqIndex].cost;
    if (state.money >= cost) {
        state.money -= cost;
        state.unlockedAquariums.push(state.currentAqIndex);
        persistGame();
        updateMoneyDisplay();
        renderAquarium();
    } else { alert("Pas assez d'argent !"); }
}

function spawnOsuTarget() {
    if (state.currentPhase !== 'SIGHTING') return;
    if (!elements.ocean) return;

    const target = document.createElement('div');
    target.classList.add('osu-target');
    
    const oceanWidth = elements.ocean.clientWidth;
    const oceanHeight = elements.ocean.clientHeight;
    
    target.style.left = Math.random() * (oceanWidth - 80) + 10 + 'px';
    target.style.top = Math.random() * (oceanHeight - 80) + 10 + 'px';
    
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
        addLog('Une clé mystérieuse mord à l\'hameçon !', 'epic');
        return;
    }

    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    const zone = ZONE_DATA.find(z => z.id === state.currentZone);
    const activeZone = zone || ZONE_DATA[0];
    let maxRarityAllowed = 0;
    if (state.combo >= 12) maxRarityAllowed = 6;
    else if (state.combo >= 10) maxRarityAllowed = 5;
    else if (state.combo >= 8) maxRarityAllowed = 4;
    else if (state.combo >= 6) maxRarityAllowed = 3;
    else if (state.combo >= 4) maxRarityAllowed = 2;
    else if (state.combo >= 2) maxRarityAllowed = 1;
    maxRarityAllowed += currentRod.luck;
    if (maxRarityAllowed > 6) maxRarityAllowed = 6;

    let totalWeight = 0;
    const weights = [];
    for (let i = 0; i < RARITIES.length; i++) {
        if (i <= maxRarityAllowed) {
            let weight = RARITY_WEIGHTS[i];
            if (i >= 3) weight *= (1 + currentRod.luck * 0.2);
            weights.push(weight);
            totalWeight += weight;
        } else {
            weights.push(0);
        }
    }

    let randomRoll = Math.random() * totalWeight;
    let rIdx = 0;
    let currentSum = 0;
    for (let i = 0; i < weights.length; i++) {
        currentSum += weights[i];
        if (randomRoll <= currentSum) { rIdx = i; break; }
    }

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
    state.currentFish = {
        ...rData,
        id: rIdx,
        name: generateProceduralName(rData.name, fishSpecies),
        img: selectedImg,
        value: calculateFishValue(rIdx) * mutation.multiplier,
        mutation: mutation.name
    };
    setPhase('REELING');
}

function startReelGame() {
    const currentRod = ALL_RODS.find(r => r.id === Number(state.equippedRod)) || ALL_RODS[0];
    state.reelProgress = 20;
    state.fishPos = 150;
    state.fishTargetY = Math.random() * 250;

    if(elements.progressFill) elements.progressFill.style.width = '20%';
    if(elements.fishName) {
        elements.fishName.innerText = state.currentFish.name;
        elements.fishName.className = `rarity-text ${state.currentFish.class}`;
    }
    if(elements.fishVisual) elements.fishVisual.innerHTML = buildFishVisualHTML(state.currentFish, 80);
    if(elements.fishTarget) {
        elements.fishTarget.style.backgroundColor = state.currentFish.color;
        elements.fishTarget.style.height = '50px';
    }

    const gracePeriod = 500;
    const startTime = Date.now();
    const difficulty = state.currentFish?.difficulty || 2;
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
        elements.catchText.innerText = 'Vous avez pêché une clé mystérieuse ! Utilisez-la pour ouvrir le coffre.';
        elements.catchVisual.innerHTML = buildFishVisualHTML(state.currentFish, 150);
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
        let placed = false;
        for (let i = 0; i < AQ_CONFIGS.length; i++) {
            const aqId = `aq${i}`;
            if (!state.inventory[aqId]) state.inventory[aqId] = [];
            if (state.inventory[aqId].length < 15 && state.unlockedAquariums.includes(i)) {
                state.inventory[aqId].push({ ...state.currentFish });
                placed = true; break;
            }
        }
        if (!placed) addLog("Aquariums pleins ! Poisson perdu.", "system");
        persistGame();
        if (state.currentFish.id >= 4) addLog(`🌟 INCROYABLE ! ${state.currentFish.name} capturé !`, 'epic');
        else addLog(`Vous avez pêché un ${state.currentFish.name}.`);
        elements.catchTitle.innerText = "SUCCÈS !";
        elements.catchText.innerText = `Vous avez capturé un ${state.currentFish.name} !`;
        elements.catchVisual.innerHTML = buildFishVisualHTML(state.currentFish, 150);
        showScreen('catch-modal');
        if (!state.discoveredFishes.includes(state.currentFish.img)) {
            state.discoveredFishes.push(state.currentFish.img);
            persistGame();
            showDiscoveryToast(state.currentFish.name, state.currentFish.name, state.currentFish.mutation);
        }
    } else {
        if (state.currentFish?.isKey) {
            elements.catchTitle.innerText = 'CLÉ PERDUE...';
            elements.catchText.innerText = 'La clé mystérieuse s\'est échappée...';
        } else {
            elements.catchTitle.innerText = "ÉCHEC...";
            elements.catchText.innerText = `Le ${state.currentFish.name} s'est échappé...`;
        }
        elements.catchVisual.innerHTML = state.currentFish?.isKey ? buildFishVisualHTML(state.currentFish, 150) : "";
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
    clearGameTimer();
    state.gameActive = true; 
    state.score = 0; 
    
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
}

function generateProceduralName(rarityName, speciesName) {
    const prefixes = FISH_DATA.prefixes[rarityName];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${speciesName}`;
}

function rollRandomMutation() {
    return pickWeightedMutation(MUTATIONS.filter(m => m.name !== 'Normal'));
}

function createRandomMutatedFish(zoneId = state.currentZone) {
    const zone = ZONE_DATA.find(z => z.id === zoneId) || ZONE_DATA[0];
    const weights = RARITY_WEIGHTS.map((w, i) => {
        const folder = RARITIES[i].folder;
        return (zone.library[folder] || []).length > 0 ? w : 0;
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let rIdx = 0;
    for (let i = 0; i < weights.length; i++) {
        roll -= weights[i];
        if (roll <= 0) { rIdx = i; break; }
    }
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
    return {
        ...rData,
        id: rIdx,
        name: generateProceduralName(rData.name, fishSpecies),
        img: `assets/fish/${rData.folder}/${randomFishFile}`,
        value: parseFloat((calculateFishValue(rIdx) * mutation.multiplier).toFixed(2)),
        mutation: mutation.name
    };
}

/** Console : giveRandomMutatedFish(5) */
function giveRandomMutatedFish(count = 1, aqIndex = state.currentAqIndex) {
    const aqId = `aq${aqIndex}`;
    if (!state.inventory[aqId]) state.inventory[aqId] = [];
    const added = [];
    for (let i = 0; i < count; i++) {
        if (state.inventory[aqId].length >= 15) break;
        added.push(createRandomMutatedFish());
        state.inventory[aqId].push(added[added.length - 1]);
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

function getRodDisplayImage(rod) {
    if (rod.id >= 10) return 'assets/rods/rod5.png';
    return rod.img;
}

function updateFishingRodDisplay() {
    const container = document.getElementById('fishing-rod-container');
    if (container) container.innerHTML = drawFishingRod();
}

function drawFishingRod() {
    const currentRod = getEquippedRodData();
    const img = getRodDisplayImage(currentRod);
    return `<img src="${img}" class="fishing-rod-img" alt="${currentRod.name}">`;
}


function init() {
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
    bind('btn-crate', () => { updateKeysDisplay(); showScreen('crate'); });

    // --- BOUTONS RETOUR & MODALS ---
    bind('btn-back-menu', goToMenu);
    bind('btn-back-menu-shop', goToMenu);
    bind('btn-back-menu-eq', goToMenu);
    bind('btn-back-menu-index', goToMenu);
    bind('btn-back-menu-map', goToMenu);
    bind('btn-back-menu-lb', goToMenu);
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
        const itemWidth = 160;
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
    setupAudio();
    preloadAllAudio();
    if (window.StepFishAuth) await StepFishAuth.init();
    await decodeAudioFile(AUDIO_FILES.button);
    decodeAudioFile(AUDIO_FILES.splash);
    decodeAudioFile(AUDIO_FILES.chest);
    init();
    if (window.StepFishAuth) StepFishAuth.updatePseudoDisplay();
    if (window.StepFishLeaderboard) StepFishLeaderboard.init();
}

boot();
