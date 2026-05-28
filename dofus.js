/**
 * StepFishing — Les 6 Dofus (déblocage zone Bonta)
 * Pêche : Émeraude, Ébène, Ocre · Coffres/bourses : Turquoise, Pourpre, Ivoire
 */
(function () {
    const DOFUS_LIST = [
        { id: 'emeraude', name: 'Émeraude', img: 'assets/dofus/Emeraude.png', source: 'fish', color: '#4CAF50' },
        { id: 'ebene', name: 'Ébène', img: 'assets/dofus/Ebene.png', source: 'fish', color: '#424242' },
        { id: 'ocre', name: 'Ocre', img: 'assets/dofus/Ocre.png', source: 'fish', color: '#FF9800' },
        { id: 'turquoise', name: 'Turquoise', img: 'assets/dofus/Turquoise.png', source: 'treasure', color: '#00BCD4' },
        { id: 'pourpre', name: 'Pourpre', img: 'assets/dofus/Pourpre.png', source: 'treasure', color: '#9C27B0' },
        { id: 'ivoire', name: 'Ivoire', img: 'assets/dofus/Ivoire.png', source: 'treasure', color: '#FFF8E1' }
    ];

    const byId = Object.fromEntries(DOFUS_LIST.map(d => [d.id, d]));

    window.STEPFISH_DOFUS = {
        all: DOFUS_LIST,
        fishable: DOFUS_LIST.filter(d => d.source === 'fish'),
        treasure: DOFUS_LIST.filter(d => d.source === 'treasure'),
        byId,
        count: DOFUS_LIST.length
    };
})();
