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
    { name: 'Divin', folder: 'divin', color: '#4B00 queL_S', difficulty: 15, points: 150, speed: 15, class: 'rarity-6', minPrice: 2500, maxPrice: 10000 }
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

const CRATE_WEIGHTS = { 'Rare': 50, 'Épique': 30, 'Légendaire': 15, 'Mythique': 4, 'Divin': 1 };

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

const MUTATIONS = [
    { name: "Normal", chance: 0.7, multiplier: 1, filter: 'none', color: 'transparent', effect: 'none' },
    { name: "Albinos", chance: 0.15, multiplier: 2, filter: 'brightness(2) saturate(0)', color: '#ffffff', effect: 'glow' },
    { name: "Enflammé", chance: 0.07, multiplier: 5, filter: 'contrast(1.5) saturate(3) hue-rotate(-20deg)', color: '#ff4500', effect: 'fire' },
    { name: "Angélique", chance: 0.04, multiplier: 10, filter: 'brightness(1.2) saturate(0.8)', color: '#fffacd', effect: 'aura' },
    { name: "Néon", chance: 0.03, multiplier: 15, filter: 'hue-rotate(90deg) saturate(5) brightness(1.2)', color: '#00ff00', effect: 'neon' },
    { name: "Abyssal", chance: 0.01, multiplier: 50, filter: 'brightness(0.5) hue-rotate(250deg) saturate(2)', color: '#4b0082', effect: 'void' }
];

function safeParse(key, defaultValue) {
    const data = localStorage.getItem(key);
    try { return data ? JSON.parse(data) : defaultValue; } catch (e) { return defaultValue; }
}

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
    currentZone: 'lac'
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
    score: getEl('current-score'), walletBalance: getEl('wallet-balance'), walletGame: getEl('wallet-game'), userLevel: getEl('user-level'), userPrestige: getEl('user-prestige'), combo: getEl('combo-count'), comboDisplay: getEl('combo-display'), timer: getEl('time-left'), ocean: getEl('ocean'), biteIndicator: getEl('bite-indicator'), reelContainer: getEl('reel-container'), fishTarget: getEl('fish-target'), playerCursor: getEl('player-cursor'), progressFill: getEl('progress-fill'), fishName: getEl('fish-name-display'), fishVisual: getEl('fish-visual'), gameLog: getEl('game-log'), aqViewport: getEl('aquarium-viewport'), fishLayer: getEl('fish-layer'), aqTitle: getEl('aq-title'), aqSlots: getEl('aq-slots'), aqLock: getEl('aq-lock-screen'), aqCost: getEl('aq-cost'), modalFishVisual: getEl('modal-fish-visual'), modalFishName: getEl('modal-fish-name'), modalFishRarity: getEl('modal-fish-rarity'), modalFishPrice: getEl('modal-fish-price'), profLevel: getEl('prof-level'), profPrestige: getEl('prof-prestige'), profFishes: getEl('prof-fishes'), profMaxMoney: getEl('prof-max-money'), profTotalScore: getEl('prof-total-score'), catchTitle: getEl('catch-title'), catchText: getEl('catch-text'), catchVisual: getEl('catch-visual')
};

function calculateFishValue(rarityIdx) {
    const rarity = RARITIES[rarityIdx];
    return parseFloat((Math.random() * (rarity.maxPrice - rarity.minPrice) + rarity.minPrice).toFixed(2));
}

function updateMoneyDisplay() {
    const formatted = state.money.toLocaleString('en-US', {minimumFractionDigits: 2});
    if(elements.walletBalance) elements.walletBalance.innerText = formatted;
    if(elements.walletGame) elements.walletGame.innerText = formatted;
    localStorage.setItem('stepFishingMoney', state.money);
    if(state.money > state.maxMoney) { state.maxMoney = state.money; localStorage.setItem('stepFishingMaxMoney', state.maxMoney); }
}

function updateDayNightCycle() {
    const layers = ['bg-day', 'bg-dawn', 'bg-night'];
    const currentEl = document.getElementById(layers[state.currentCycle]);
    if(currentEl) currentEl.classList.remove('active');
    state.currentCycle = (state.currentCycle + 1) % layers.length;
    const nextEl = document.getElementById(layers[state.currentCycle]);
    if(nextEl) nextEl.classList.add('active');
}

function updateProgression() {
    state.level = Math.floor(Math.pow(state.totalScore / 10, 0.7)) + 1;
    state.prestige = Math.floor(state.level / 100);
    if(elements.userLevel) elements.userLevel.innerText = state.level;
    if(elements.userPrestige) elements.userPrestige.innerText = state.prestige;
    localStorage.setItem('stepFishingTotalScore', state.totalScore);
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
    const scaleRanges = [[0.7, 1.1], [0.8, 1.2], [0.8, 1.5], [0.9, 1.8], [1.0, 2.0], [1.2, 2.2], [1.5, 3.0]];

    fishes.forEach((fish, index) => {
        const fDiv = document.createElement('div');
        fDiv.classList.add('aq-fish');
        const rIdx = RARITIES.findIndex(r => r.class === fish.class);
        const range = scaleRanges[rIdx] || [0.8, 1.2];
        const randomScale = Math.random() * (range[1] - range[0]) + range[0];
        const finalWidth = Math.round(80 * randomScale);
        fDiv.innerHTML = `<img src="${fish.img}" class="aq-fish-img" style="width: ${finalWidth}px">`;
        fDiv.style.left = Math.random() * 90 + '%';
        fDiv.style.top = Math.random() * 90 + '%';
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
    localStorage.setItem('stepFishingInventory', JSON.stringify(state.inventory));
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
                    data.target = { x: Math.random() * 90, y: Math.random() * 90 };
                    data.speed = 0.005 + Math.random() * 0.01;
                }
                const curX = parseFloat(fish.style.left) || 0;
                const curY = parseFloat(fish.style.top) || 0;
                const newX = curX + (data.target.x - curX) * data.speed;
                const newY = curY + (data.target.y - curY) * data.speed;
                fish.style.left = newX + '%';
                fish.style.top = newY + '%';
                fish.style.transform = `scaleX(${newX > curX ? -1 : 1})`;
                if (Math.abs(newX - data.target.x) < 1) data.target = { x: Math.random() * 90, y: Math.random() * 90 };
                fish.dataset.fishData = JSON.stringify(data);

                // --- SYSTÈME DE PARTICULES ---
                // On ne crée des particules que si le poisson a une mutation spéciale
                const mutData = MUTATIONS.find(m => m.name === JSON.parse(fish.dataset.fishData || "{}").mutation); // Erreur potentielle ici, correction ci-dessous
            });
        } catch (e) { console.error(e); }
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}


function openFishModal(index, aqId) {
    const fish = state.inventory[aqId][index];
    if(!fish) return;
    elements.modalFishVisual.innerHTML = `<img src="${fish.img}" width="120">`;
    elements.modalFishName.innerText = fish.name;
    elements.modalFishName.className = `rarity-text ${fish.class}`;
    const rarityInfo = RARITIES.find(r => r.class === fish.class);
    elements.modalFishRarity.innerText = rarityInfo ? rarityInfo.name : 'Inconnu';
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
    localStorage.setItem('stepFishingInventory', JSON.stringify(state.inventory));
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
    localStorage.setItem('stepFishingInventory', JSON.stringify(state.inventory));
    renderAquarium();
    showScreen('inventory');
}

function buyAquarium() {
    const cost = AQ_CONFIGS[state.currentAqIndex].cost;
    if (state.money >= cost) {
        state.money -= cost;
        state.unlockedAquariums.push(state.currentAqIndex);
        localStorage.setItem('stepFishingUnlocked', JSON.stringify(state.unlockedAquariums));
        updateMoneyDisplay();
        renderAquarium();
    } else { alert("Pas assez d'argent !"); }
}

function spawnOsuTarget() {
    if (state.currentPhase !== 'SIGHTING') return;
    if (!elements.ocean) return; // Sécurité : si l'océan n'est pas trouvé, on arrête pour éviter le crash

    const target = document.createElement('div');
    target.classList.add('osu-target');
    
    // Calcul sécurisé de la position
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
    const currentRod = ALL_RODS.find(r => r.id === state.equippedRod) || ALL_RODS[0];
    const zone = ZONE_DATA.find(z => z.id === state.currentZone);
    const activeZone = zone || ZONE_DATA[0]; 
    let maxRarityAllowed = 0;
    if (state.combo >= 12) maxRarityAllowed = 6; else if (state.combo >= 10) maxRarityAllowed = 5;
    else if (state.combo >= 8) maxRarityAllowed = 4; else if (state.combo >= 6) maxRarityAllowed = 3;
    else if (state.combo >= 4) maxRarityAllowed = 2; else if (state.combo >= 2) maxRarityAllowed = 1;
    maxRarityAllowed += currentRod.luck; 
    if (maxRarityAllowed > 6) maxRarityAllowed = 6;
    let totalWeight = 0;
    let weights = [];
    for (let i = 0; i < RARITIES.length; i++) {
        if (i <= maxRarityAllowed) {
            let weight = RARITY_WEIGHTS[i];
            if (i >= 3) weight *= (1 + currentRod.luck * 0.2); 
            weights.push(weight);
            totalWeight += weight;
        } else { weights.push(0); }
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
        const commonFishes = activeZone.library['commun'];
        const randomCommon = commonFishes[Math.floor(Math.random() * commonFishes.length)];
        selectedImg = `assets/fish/commun/${randomCommon}`;
        fishSpecies = randomCommon.replace('.png', '').replace('_', ' ');
        rIdx = 0; 
        rData = RARITIES[0]; 
    }
    const randMut = Math.random();
    let cumulativeChance = 0;
    let mutation = MUTATIONS[0];
    for (let m of MUTATIONS) {
        cumulativeChance += m.chance;
        if (randMut <= cumulativeChance) { mutation = m; break; }
    }
    state.currentFish = { 
        ...rData, id: rIdx, 
        name: generateProceduralName(rData.name, fishSpecies), 
        img: selectedImg, 
        value: calculateFishValue(rIdx) * mutation.multiplier, 
        mutation: mutation.name
    };
    setPhase('REELING');
}

function startReelGame() {
    const currentRod = ALL_RODS.find(r => r.id === state.equippedRod) || ALL_RODS[0];
    state.reelProgress = 20; 
    state.fishPos = 150; 
    state.fishTargetY = Math.random() * 250;
    
    if(elements.progressFill) elements.progressFill.style.width = '20%';
    if(elements.fishName) {
        elements.fishName.innerText = state.currentFish.name;
        elements.fishName.className = `rarity-text ${state.currentFish.class}`;
    }
    if(elements.fishVisual) elements.fishVisual.innerHTML = `<img src="${state.currentFish.img}" width="80">`;
    if(elements.fishTarget) elements.fishTarget.style.backgroundColor = state.currentFish.color;
    
    let gracePeriod = 500;
    const startTime = Date.now();
    
    const reelInterval = setInterval(() => {
        // SECURITE CRUCIALE : Si on n'est plus en phase de remontée, on tue l'intervalle immédiatement
        if (state.currentPhase !== 'REELING') { 
            clearInterval(reelInterval); 
            return; 
        }
        
        try {
            const diff = state.fishTargetY - state.fishPos;
            const erraticFactor = (state.currentFish.difficulty / 10) * 0.2;
            state.fishPos += diff * (0.1 + Math.random() * erraticFactor);
            
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
                catchFish(true); 
            } else if (state.reelProgress <= 0) { 
                clearInterval(reelInterval); 
                catchFish(false); 
            }
        } catch (e) {
            console.error("Erreur loop mini-jeu : ", e);
            clearInterval(reelInterval);
        }
    }, 30);
}



function catchFish(success) {
    if (success) {
        state.score += state.currentFish.points;
        state.totalScore += state.currentFish.points;
        state.totalFishesCaught++;
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
        localStorage.setItem('stepFishingInventory', JSON.stringify(state.inventory));
        localStorage.setItem('stepFishingTotalCaught', state.totalFishesCaught);
        if (state.currentFish.id >= 4) addLog(`🌟 INCROYABLE ! ${state.currentFish.name} capturé !`, 'epic');
        else addLog(`Vous avez pêché un ${state.currentFish.name}.`);
        elements.catchTitle.innerText = "SUCCÈS !";
        elements.catchText.innerText = `Vous avez capturé un ${state.currentFish.name} !`;
        elements.catchVisual.innerHTML = `<img src="${state.currentFish.img}" width="150">`;
        showScreen('catch-modal');
        if (!state.discoveredFishes.includes(state.currentFish.img)) {
            state.discoveredFishes.push(state.currentFish.img);
            localStorage.setItem('stepFishingDiscovered', JSON.stringify(state.discoveredFishes));
            showDiscoveryToast(state.currentFish.name, state.currentFish.name, state.currentFish.mutation);
        }
    } else {
        elements.catchTitle.innerText = "ÉCHEC...";
        elements.catchText.innerText = `Le ${state.currentFish.name} s'est échappé...`;
        elements.catchVisual.innerHTML = "";
        showScreen('catch-modal');
        addLog(`Le ${state.currentFish.name || 'poisson'} a filé...`, 'system');
    }
    updateProgression();
    elements.score.innerText = state.score;
}

function setPhase(phase) {
    state.currentPhase = phase;
    
    // Nettoyage sécurisé des indicateurs
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


function startGame() {
    state.gameActive = true; 
    state.score = 0; 
    
    // Sécurité pour la canne équipée
    const currentRod = ALL_RODS.find(r => r.id === state.equippedRod) || ALL_RODS[0];
    
    state.timeLeft = 30 + currentRod.time;
    elements.score.innerText = state.score; 
    elements.timer.innerText = state.timeLeft;
    
    showScreen('game'); 
    
    // LE SECRET : On attend 100ms que l'écran soit actif avant de lancer la phase SIGHTING
    setTimeout(() => {
        setPhase('SIGHTING');
        addLog("Ligne lancée... Bonne chance !");
    }, 100);

    if (!window.gameInterval) {
        windowPInterval = setInterval(() => {
            state.timeLeft--; 
            elements.timer.innerText = state.timeLeft;
            if (state.timeLeft <= 0) { 
                clearInterval(window.gameInterval); 
                window.gameInterval = null; 
                endGame(); 
            }
        }, 1000);
    }
}

function endGame() {
    state.gameActive = false; 
    if(elements.finalScore) elements.finalScore.innerText = state.score;
    if (state.score > state.highScore) { 
        state.highScore = state.score; 
        localStorage.setItem('stepFishingHighScore', state.highScore); 
    }
    showScreen('gameOver');
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    let target = document.getElementById(screenName) || document.getElementById('screen-' + screenName);
    if (target) target.classList.add('active');
}

function generateProceduralName(rarityName, speciesName) {
    const prefixes = FISH_DATA.prefixes[rarityName];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${speciesName}`;
}

function showDiscoveryToast(fishName, rarity, mutation) {
    const toast = document.getElementById('discovery-toast');
    const text = document.getElementById('toast-text');
    if(!toast || !text) return;
    text.innerHTML = `FÉLICITATIONS ! <br> <span style="color:var(--wood-gold)">${fishName}</span> [${rarity}] <br> <small>Mutation: ${mutation}</small>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
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
        localStorage.setItem('stepFishingOwnedRods', JSON.stringify(state.ownedRods));
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
    localStorage.setItem('stepFishingEquippedRod', state.equippedRod);
    renderEquipment();
    
    const rod = ALL_RODS.find(r => r.id === id);
    addLog(`Matériel changé : ${rod ? rod.name : 'Canne'} équipée.`);
    
    // MISE À JOUR VISUELLE DE LA CANNE SUR L'ÉCRAN
    if(document.getElementById('fishing-rod-container')) {
        document.getElementById('fishing-rod-container').innerHTML = drawFishingRod();
    }
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

function drawFishingRod() { 
    // On cherche la canne équipée dans la liste complète
    const currentRod = ALL_RODS.find(r => r.id === state.equippedRod) || ALL_RODS[0];
    
    // On utilise l'image de la canne équipée
    return `<img src="${currentRod.img}" class="fishing-rod-img">`; 
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
        updateZoneBackgrounds();
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
    bind('btn-crate', () => showScreen('crate'));

    // --- BOUTONS RETOUR & MODALS ---
    bind('btn-back-menu', () => showScreen('menu'));
    bind('btn-back-menu-shop', () => showScreen('menu'));
    bind('btn-back-menu-eq', () => showScreen('menu'));
    bind('btn-back-menu-index', () => showScreen('menu'));
    bind('btn-back-menu-map', () => showScreen('menu'));
    bind('btn-close-fish', () => showScreen('inventory'));
    bind('btn-close-profile', () => showScreen('menu'));
    bind('btn-close-catch', () => showScreen('menu'));
    bind('user-pseudo', openProfile);
    bind('btn-buy-aq', buyAquarium);
    bind('btn-open-crate', openCrate);
    bind('btn-back-menu-crate', () => showScreen('menu'));

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
    if(document.getElementById('fishing-rod-container')) {
        document.getElementById('fishing-rod-container').innerHTML = drawFishingRod();
    }
}

function openCrate() {
    if (state.money < 50000) {
        addLog("Pas assez d'argent pour ouvrir un coffre !", "system");
        return;
    }

    state.money -= 50000;
    updateMoneyDisplay();

    const crateList = document.getElementById('crate-list');
    crateList.style.transition = 'none';
    crateList.style.transform = 'translateX(0)';
    crateList.innerHTML = '';

    // 1. On génère 50 cannes au hasard pour le défilement
    const itemsToSpawn = 50;
    let winningRod = null;

    for (let i = 0; i < itemsToSpawn; i++) {
        // Tirage au sort basé sur les poids
        let roll = Math.random() * 100;
        let cumulative = 0;
        let selectedRarity = 'Rare';

        for (const [rarity, weight] of Object.entries(CRATE_WEIGHTS)) {
            cumulative += weight;
            if (roll <= cumulative) {
                selectedRarity = rarity;
                break;
            }
        }

        // On filtre les cannes de cette rareté
        const possibleRods = CRATE_RODS.filter(r => r.rarity === selectedRarity);
        const rod = possibleRods[Math.floor(Math.random() * possibleRods.length)];
        
        if (i === 45) winningRod = rod; // Le 46ème item est celui qu'on gagne

        const itemDiv = document.createElement('div');
        itemDiv.className = 'crate-item';
        itemDiv.style.borderColor = rod.color;
        itemDiv.innerHTML = `
            <img src="${rod.img}">
            <div class="rarity-tag" style="color:${rod.color}">${rod.rarity}</div>
        `;
        crateList.appendChild(itemDiv);
    }

    // 2. Lancer l'animation
    setTimeout(() => {
        crateList.style.transition = 'transform 5s cubic-bezier(0.15, 0, 0.05, 1)';
        // On calcule la position pour que l'item 45 soit au centre
        const itemWidth = 160; // 140px + 20px margin
        const centerOffset = (800 / 2) - (itemWidth / 2);
        const finalPosition = (45 * itemWidth) - centerOffset;
        
        crateList.style.transform = `translateX(-${finalPosition}px)`;
    }, 50);

    // 3. Attribuer la récompense après l'animation
    setTimeout(() => {
        addLog(`FÉLICITATIONS ! Vous avez obtenu : ${winningRod.name} !`, 'epic');
        
        // Ajouter la canne aux possessions du joueur
        if (!state.ownedRods.includes(winningRod.id)) {
            state.ownedRods.push(winningRod.id);
            localStorage.setItem('stepFishingOwnedRods', JSON.stringify(state.ownedRods));
        }
        
        // Optionnel : L'équiper directement
        state.equippedRod = winningRod.id;
        localStorage.setItem('stepFishingEquippedRod', state.equippedRod);
        
        alert(`🎉 BRAVO ! Vous avez débloqué : ${winningRod.name} (${winningRod.rarity})`);
    }, 5200);

    
}

setInterval(updateDayNightCycle, 180000);
init();
