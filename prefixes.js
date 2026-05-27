/** Listes de mots de préfixe par rareté (tirage aléatoire à la pêche). */
(function () {
    window.STEPFISH_PREFIX_WORDS = {
        'Commun': [
            'Terne', 'Fade', 'Banal', 'Gris', 'Mou', 'Lent', 'Usé', 'Fatigué', 'Fragile', 'Timide', 'Petit', 'Maigre',
            'Boueux', 'Pâle', 'Fissuré', 'Ridé', 'Fripé', 'Humide', 'Tremblant', 'Délavé', 'Endormi', 'Rugueux', 'Creux',
            'Tordu', 'Plat', 'Gluant', 'Éteint', 'Flasque', 'Vacillant', 'Chétif', 'Fané', 'Égaré', 'Plié', 'Cassant',
            'Morne', 'Brumeux', 'Sali', 'Craquelé', 'Écrasé', 'Givré', 'Brisé', 'Noueux', 'Hésitant', 'Craintif', 'Fuyant',
            'Immobile', 'Ralenti', 'Souillé', 'Sans-éclat', 'Jaunâtre', 'Pataud', 'Défraîchi', 'Poreux', 'Flottant',
            'Apathique', 'Difforme', 'Ramolli', 'Vide', 'Inodore', 'Dégarni', 'Affaibli', 'Grisâtre', 'Silencieux', 'Simple',
            'Discret', 'Sombre', 'Ordinaire', 'Calme', 'Vieux', 'Poussiéreux', 'Crochu', 'Écaillé', 'Faiblard', 'Terrestre',
            'Maussade', 'Vacarmeux', 'Décoloré', 'Froid', 'Miteux', 'Boursouflé', 'Mousseux', 'Glacé', 'Lourd', 'Piquant',
            'Fangeux', 'Épuisant', 'Rassis', 'Épais', 'Trouble', 'Lâche', 'Durci', 'Affaissé', 'Mince', 'Maladif', 'Fumé',
            'Bruni', 'Inquiet', 'Poussé', 'Dégoulinant', 'Marécageux'
        ],
        'Peu Commun': [
            'Spiralé', 'Aquatique', 'Bondisseur', 'Nacré', 'Fumé', 'Frisé', 'Filant', 'Cuivré', 'Souple', 'Ciselant',
            'Vibrant', 'Dorsal', 'Ténébreux', 'Ondulant', 'Lustrant', 'Dorloté', 'Virevoltant', 'Miroitant', 'Agilefin',
            'Mariné', 'Remuant', 'Ruisselant', 'Furtin', 'Frémissant', 'Torsionnel', 'Perlé', 'Fulgurant', 'Ruselin', 'Coquin',
            'Trépidant', 'Vaporeux', 'Chatoyant', 'Ailé', 'Bronzé', 'Émeraude', 'Coriandré', 'Voltigeur', 'Scintilleux',
            'Fougueux', 'Gracieux', 'Turquoise', 'Vortexé', 'Fluorescent', 'Caréné', 'Rapidos', 'Chantant', 'Baroudeur',
            'Tonic', 'Volté'
        ],
        'Rare': [
            'Arrogant', 'Noble', 'Cruel', 'Mystérieux', 'Fier', 'Violent', 'Dominant', 'Glacial', 'Électrique', 'Fantomatique',
            'Venimeux', 'Féroce', 'Sinistre', 'Traqueur', 'Malveillant', 'Hurleur', 'Vorace', 'Carnassier', 'Balafré', 'Rageur',
            'Mordant', 'Brutal', 'Requiem', 'Corrompu', 'Impérial', 'Redoutable', 'Élégant', 'Sanguinaire', 'Brûlant', 'Obsidien',
            'Enragé', 'Tranchant', 'Rugissant', 'Acéré', 'Indomptable', 'Toxique', 'Furieux', 'Rôdeur', 'Spectral', 'Glorieux',
            'Hivernal', 'Tempérant', 'Faucheur', 'Céruléen', 'Écarlate', 'Roncier', 'Daguefin', 'Corallique', 'Cendré', 'Fanatique',
            'Destructeur', 'Ombrelame', 'Nécrosé', 'Férocien', 'Harponneur', 'Écumeur', 'Déchirant', 'Électrisé', 'Corrompant',
            'Foudroyé', 'Violacé', 'Argenté', 'Tridenté', 'Cruor', 'Ténébré', 'Pilleur', 'Rougeflot', 'Spectreur', 'Trépassé',
            'Nocturne', 'Inflexible', 'Tempétueux', 'Perçant', 'Dérangeant', 'Sauvageon', 'Infernal', 'Maudit', 'Cruelien',
            'Ravageur', 'Assaillant', 'Ombreux', 'Pyrique', 'Épine-Noire', 'Ravageant', 'Tyrannique', 'Rongeur', 'Chasseur',
            'Maléfique', 'Rancunier', 'Cinglant', 'Obscurant', 'Feral', 'Ronflant', 'Démentiel', 'Hostile', 'Dévorant', 'Corrosif'
        ],
        'Épique': [
            'Titanesque', 'Ancestral', 'Colossal', 'Déchaîné', 'Infernal', 'Spectral', 'Éternel', 'Abyssal', 'Royal',
            'Cataclysmique', 'Runique', 'Maudit', 'Flamboyant', 'Démoniaque', 'Invincible', 'Céleste', 'Primordial', 'Ravageur',
            'Cyclonique', 'Gargantuesque', 'Temporel', 'Dévastateur', 'Fulgurant', 'Tyrannique', 'Souverain', 'Incandescent',
            'Chiméral', 'Volcanique', 'Léviathanique', 'Maelströmique', 'Chaosbringer', 'Warbringer', 'Démiurgique', 'Dominus',
            'Tonitruant', 'Dévoreur', 'Astrolithique', 'Mythor', 'Armagédonien', 'Voidbringer', 'Impitoyable', 'Colossien',
            'Primordien', 'Foudremort', 'Brasiérien', 'Spectrancien', 'Obsidial', 'Monstral', 'Cyclopéen', 'Dreadnox', 'Titanforge',
            'Éclipse-Noire', 'Ruinique', 'Éternombre', 'Courroucé', 'Déflagré', 'Runeforge', 'Déchaînax', 'Catastrophique', 'Trôneur',
            'Saccageur', 'Brasierfuneste', 'Célestombre', 'Dracoryx', 'Immensal', 'Cataclysmal', 'Infernacier', 'Abyssombral',
            'Tyrannor', 'Gargantor', 'Volcanor', 'Tempestien', 'Fléau', 'Crépitant', 'Runesang', 'Failleux', 'Nébuleux',
            'Ouraganique', 'Colérique', 'Mythal', 'Fureur-Ancienne', 'Rupturien', 'Déferlant', 'Désintégrant', 'Éruptif', 'Sismique',
            'Déchaînor', 'Ruinemonde', 'Apocalyptique', 'Ombracier', 'Titanique', 'Fracasseur', 'Draconien', 'Brasier-Roi',
            'Déferlame', 'Dominateur-Suprême'
        ],
        'Légendaire': [
            'Draconique', 'Solaire', 'Lunaire', 'Sacré', 'Immortel', 'Astral', 'Suprême', 'Arcane', 'Millénaire', 'Triomphant',
            'Éveillé', 'Mythologique', 'Doré', 'Crépusculaire', 'Illimité', 'Oracle', 'Héroïque', 'Magistral', 'Monarque',
            'Couronné', 'Stellaris', 'Imperator', 'Divinastre', 'Luminarque', 'Reliquien', 'Célestia', 'Héliomancien', 'Sanctuarien',
            'Éclipseur', 'Sélénite', 'Parangon', 'Chronarque', 'Solsticeur', 'Lumindor', 'Valkor', 'Grandiose', 'Astérion',
            'Dragoncœur', 'Sacroflamme', 'Auréolien', 'Triomphateur', 'Suzerain', 'Astromancien', 'Arcadia', 'Dominarium', 'Léonin',
            'Éon-Roi', 'Équinoxe', 'Millénarche', 'Zenithor', 'Ombrétoile', 'Roi-Ancestral', 'Solaris', 'Noctis', 'Dracoïde',
            'Éternarque', 'Couronneciel', 'Oracle-Roi', 'Monarcal', 'Hyperboréen', 'Radiancia', 'Sanctifié', 'Cendréternel',
            'Valkyrien', 'Sacrétoile', 'Mytharion', 'Crépusol', 'Hérodian', 'Archangeux', 'Célestforge', 'Astrolégendaire',
            'Divinroyal', 'Sanctissime', 'Solarique', 'Étoiléternel', 'Majestique', 'Empyréal', 'Royaliste', 'Luminex',
            'Draco-Sacré', 'Hégémonique', 'Aurorel', 'Mythéon', 'Glorifié', 'Relique-Ancienne', 'Solennel', 'Astrocouronné',
            'Éternis', 'Primarque', 'Surnaturel', 'Exalté', 'Éthéré', 'Légionnaire', 'Couronnor', 'Astrodivin'
        ],
        'Mythique': [
            'Cosmique', 'Transcendant', 'Chimérique', 'Nébulaire', 'Omniscient', 'Dimensionnel', 'Absolu', 'Stellaire', 'Originel',
            'Inaltérable', 'Galactique', 'Éonique', 'Entropique', 'Éthérique', 'Néantique', 'Multiversel', 'Quantumique', 'Omniarque',
            'Nexusial', 'Étherion', 'Cosmoforge', 'Infinitaire', 'Chronofaille', 'Paradoxon', 'Astralys', 'Hypernova', 'Chimérion',
            'Abyssarque', 'Galaxion', 'Voidaris', 'Astrax', 'Warpion', 'Absolarium', 'Nébuleon', 'Supraxis', 'Astrovore', 'Infinitron',
            'Universel', 'Hyperion', 'Zenithium', 'Éternium', 'Obscurium', 'Cosmophage', 'Omniscion', 'Nébularche', 'Cataclyxor',
            'Néantor', 'Éclipsion', 'Stellaforge', 'Cosmiqueur', 'Protoforge', 'Oménium', 'Pandémonium', 'Chaosiel', 'Primoforge',
            'Métaréel', 'Monolitheux', 'Faillemonde', 'Chtonar', 'Proto-divin', 'Omniroyal', 'Équinoxial', 'Chronique',
            'Hyperdimensionnel', 'Métaphysique', 'Astronomique', 'Cosmoroyal', 'Éthercœur', 'Omniétoile', 'Supracosmique', 'Paradoxal',
            'Interstellaire', 'Supraéternel', 'Nébulithique', 'Dimensionnaire', 'Réalité-Brisée', 'Hyperastral', 'Cosmocréateur',
            'Universarium', 'Voidcéleste', 'Exocosmique', 'Astromythique', 'Priméther', 'Nébulochronique', 'Hyperréel', 'Astral-Infini',
            'Mythocéleste', 'Omnidimensionnel', 'Étherforge', 'Stellacore', 'Cosmoprime', 'Hypermythique', 'Infinium', 'Absolutique',
            'Réalité-Zéro', 'Omniquantique'
        ],
        'Divin': [
            'Divin', 'Séraphique', 'Omnipotent', 'Paradisiaque', 'Sanctifié', 'Ultime', 'Élyséen', 'Alpha', 'Oméga', 'Dieu-Roi',
            'Infini', 'Luminescent', 'Primogène', 'Panthéonique', 'Archangélique', 'Omniversal', 'Exalté', 'Ascendant', 'Radiant',
            'Trinitaire', 'Solennel', 'Épiphanique', 'Édenique', 'Dieu-Ancien', 'Paradivin', 'Omnicéleste', 'Absolutium', 'Élysion',
            'Divinex', 'Hyperange', 'Sanctum', 'Priméon', 'Infiniciel', 'Panthéor', 'Ultiméon', 'Harmonia', 'Sacrum', 'Divinarche',
            'Omniforge', 'Éveil Sacré', 'Immaculé', 'Arcangéon', 'Pantokrator', 'Hyperdivin', 'Sanctéon', 'Auréalis', 'Supraéon',
            'Omni-Lumineux', 'Archonique', 'Célestor', 'Roi-Céleste', 'Cosmodivin', 'Divinecore', 'Trône-Céleste', 'Solarius Prime',
            'Alpha Divin', 'Radiance Suprême', 'Astra-Divin', 'Lumière Éternelle', 'Absolarche', 'Célesturion', 'Dieu-Stellaire',
            'Éternel Suprême', 'Grand Séraphin', 'Proto-Dieu', 'Célestion', 'Supralumineux', 'Hypercéleste', 'Panthéonien', 'Divinator',
            'Omniréal', 'Omniflux', 'Divinarium', 'Sanctissime', 'Étoile Divine', 'Omniéveil', 'Absoludivin', 'Hyperélyséen',
            'Éternisacré', 'Célestéon', 'Omniastre', 'Supracéleste', 'Aurodivin', 'Zenith Divin', 'Primordial Sacré', 'Divin Absolu',
            'Dieu-Originel', 'Omniscellé', 'Radiance Éternelle', 'Sacrodivin', 'Omniharmonique', 'Transcendantal Sacré', 'Lumiarcange',
            'Éternocéleste', 'Paradisium', 'Supraultime'
        ]
    };
})();
