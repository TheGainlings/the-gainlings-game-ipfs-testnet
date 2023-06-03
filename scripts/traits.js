let _possibleTraits = [];
let _traitPossibilities = [];
var _traitEffects = {};
let _traitTypeNames = ["Armour", "Boots", "Helmet", "Shield", "Weapon", "Aura"];


FillTraits();
FillEffects();


function FillTraits() {
    _possibleTraits[0] = ["None", "SwimWear", "Toga", "TornTop", "Leather", "Chainmail", "Firechain", "Ninja", "LifeJacket", "Golden", "Fatbelly", "Jedi", "Nun Top", "Sixpack", "Target"];
    _possibleTraits[1] = ["Grass", "Leatherette", "Sneakers", "Fine", "Fire", "Diving", "Socks", "Winged", "Electric", "Heals", "Cowboy", "Hover", "Rockets", "Rollers", "Sandals"];
    _possibleTraits[2] = ["Trucker", "Propeller", "PaperBoat", "Witch", "Viking", "Headphones", "Sweatband", "Ninjamask", "DirtyTrucker", "Spartan", "Bloody", "Feather", "Sombrero", "Gasmask", "Hockeymask"];
    _possibleTraits[3] = ["Rusty Buckler", "Light Buckler", "Hardened Buckler", "Plain Square", "Gold Square", "Legion Square", "Weighted Heater", "Gold Studded Heater", "Liquid Studded Heater", "Solid Gold Heater", "Blank Face", "Butterknife", "Storm Plate", "Thunderbolt", "Trophy"];
    _possibleTraits[4] = ["Scissors", "Luxury Pistol", "Longsword", "Laser", "Golfbat", "Dog Leash", "Rocket Launcher", "Chainsaw", "Calculator", "Bubblegun", "Hammer", "Lasso", "Light Saber", "Molotov", "Scoped Pistol"];
    _possibleTraits[5] = ["Aqua", "Blood", "Cute", "Dark", "Earth", "Gold", "Heaven", "Nature", "Psychic", "Sweet", "Angel", "Orc", "Paladin", "Werewolf", "Wizards"];

    _traitPossibilities[0] = [125, 245, 355, 460, 560, 650, 730, 800, 860, 910, 950, 975, 990, 996, 1000]; // 12.5% / 12% / 11% / 10.5% / 10% / 9% / 8% / 7% / 6% / 5% / 4% / 2.5% / 1.5% / 0.6% / 0.4%
    _traitPossibilities[1] = [125, 245, 355, 460, 560, 650, 730, 800, 860, 910, 950, 975, 990, 996, 1000];
    _traitPossibilities[2] = [125, 245, 355, 460, 560, 650, 730, 800, 860, 910, 950, 975, 990, 996, 1000];
    _traitPossibilities[3] = [125, 245, 355, 460, 560, 650, 730, 800, 860, 910, 950, 975, 990, 996, 1000];
    _traitPossibilities[4] = [125, 245, 355, 460, 560, 650, 730, 800, 860, 910, 950, 975, 990, 996, 1000];
    _traitPossibilities[5] = [67, 134, 201, 268, 335, 402, 469, 536, 603, 670, 737, 804, 871, 938, 1000]; //6.7% each
}
function FillEffects() {

    //Armour
    _traitEffects["None"] = [(0), (5), (0)];
    _traitEffects["SwimWear"] = [(0), (10), (100)];
    _traitEffects["Toga"] = [(0), (25), (250)];
    _traitEffects["TornTop"] = [(0), (40), (300)];
    _traitEffects["Leather"] = [(0), (50), (250)];
    _traitEffects["Chainmail"] = [(0), (55), (250)];
    _traitEffects["Firechain"] = [(0), (60), (350)];
    _traitEffects["Ninja"] = [(0), (60), (180)];
    _traitEffects["LifeJacket"] = [(0), (75), (250)];
    _traitEffects["Golden"] = [(0), (100), (800)];
    _traitEffects["Fatbelly"] = [(0), (80), (700)];
    _traitEffects["Jedi"] = [(0), (80), (600)];
    _traitEffects["Nun Top"] = [(0), (100), (500)];
    _traitEffects["Sixpack"] = [(50), (20), (100)];
    _traitEffects["Target"] = [(50), (0), (10)];

    //Boots
    _traitEffects["Grass"] = [(0), (5), (100)];
    _traitEffects["Leatherette"] = [(0), (5), (80)];
    _traitEffects["Sneakers"] = [(0), (8), (85)];
    _traitEffects["Fine"] = [(0), (8), (75)];
    _traitEffects["Fire"] = [(10), (10), (125)];
    _traitEffects["Diving"] = [(0), (10), (100)];
    _traitEffects["Socks"] = [(0), (12), (125)];
    _traitEffects["Winged"] = [(0), (12), (60)];
    _traitEffects["Electric"] = [(15), (14), (200)];
    _traitEffects["Heals"] = [(0), (14), (125)];
    _traitEffects["Cowboy"] = [(0), (16), (150)];
    _traitEffects["Hover"] = [(0), (16), (80)];
    _traitEffects["Rockets"] = [(0), (20), (80)];
    _traitEffects["Rollers"] = [(0), (25), (150)];
    _traitEffects["Sandals"] = [(0), (25), (125)];

    //Helmet
    _traitEffects["Trucker"] = [(0), (25), (250)];
    _traitEffects["Propeller"] = [(0), (10), (50)];
    _traitEffects["PaperBoat"] = [(0), (30), (200)];
    _traitEffects["Witch"] = [(0), (35), (200)];
    _traitEffects["Viking"] = [(10), (40), (350)];
    _traitEffects["Headphones"] = [(0), (45), (250)];
    _traitEffects["Sweatband"] = [(0), (30), (125)];
    _traitEffects["Ninjamask"] = [(0), (35), (125)];
    _traitEffects["DirtyTrucker"] = [(0), (50), (350)];
    _traitEffects["Spartan"] = [(0), (75), (400)];
    _traitEffects["Bloody"] = [(0), (50), (250)];
    _traitEffects["Feather"] = [(0), (20), (80)];
    _traitEffects["Sombrero"] = [(0), (30), (125)];
    _traitEffects["Gasmask"] = [(0), (75), (180)];
    _traitEffects["Hockeymask"] = [(0), (75), (150)];

    //Shield
    _traitEffects["Rusty Buckler"] = [(0), (25), (900)];
    _traitEffects["Light Buckler"] = [(0), (25), (800)];
    _traitEffects["Hardened Buckler"] = [(0), (30), (900)];
    _traitEffects["Plain Square"] = [(0), (40), (800)];
    _traitEffects["Gold Square"] = [(0), (50), (1000)];
    _traitEffects["Legion Square"] = [(0), (45), (800)];
    _traitEffects["Weighted Heater"] = [(0), (45), (700)];
    _traitEffects["Gold Studded Heater"] = [(0), (60), (1100)];
    _traitEffects["Liquid Studded Heater"] = [(0), (50), (800)];
    _traitEffects["Solid Gold Heater"] = [(0), (75), (1200)];
    _traitEffects["Blank Face"] = [(0), (55), (700)];
    _traitEffects["Butterknife"] = [(40), (0), (300)];
    _traitEffects["Storm Plate"] = [(0), (75), (900)];
    _traitEffects["Thunderbolt"] = [(25), (50), (1000)];
    _traitEffects["Trophy"] = [(50), (25), (800)];


    //Weapon
    _traitEffects["Scissors"] = [(200), (0), (500)];
    _traitEffects["Luxury Pistol"] = [(320), (0), (900)];
    _traitEffects["Longsword"] = [(350), (0), (500)];
    _traitEffects["Laser"] = [(300), (0), (700)];
    _traitEffects["Golfbat"] = [(250), (0), (900)];
    _traitEffects["Dog Leash"] = [(250), (0), (700)];
    _traitEffects["Rocket Launcher"] = [(450), (0), (500)];
    _traitEffects["Chainsaw"] = [(400), (0), (1100)];
    _traitEffects["Calculator"] = [(380), (0), (800)];
    _traitEffects["Bubblegun"] = [(400), (0), (700)];
    _traitEffects["Hammer"] = [(500), (0), (1600)];
    _traitEffects["Lasso"] = [(420), (0), (700)];
    _traitEffects["Light Saber"] = [(420), (0), (600)];
    _traitEffects["Molotov"] = [(450), (0), (800)];
    _traitEffects["Scoped Pistol"] = [(480), (0), (600)];

    //Background
    _traitEffects["Aqua"] = [(0), (0), (0)];
    _traitEffects["Blood"] = [(0), (0), (0)];
    _traitEffects["Cute"] = [(0), (0), (0)];
    _traitEffects["Dark"] = [(0), (0), (0)];
    _traitEffects["Earth"] = [(0), (0), (0)];
    _traitEffects["Gold"] = [(0), (0), (0)];
    _traitEffects["Heaven"] = [(0), (0), (0)];
    _traitEffects["Nature"] = [(0), (0), (0)];
    _traitEffects["Psychic"] = [(0), (0), (0)];
    _traitEffects["Sweet"] = [(0), (0), (0)];
    _traitEffects["Angel"] = [(0), (0), (0)];
    _traitEffects["Orc"] = [(0), (0), (0)];
    _traitEffects["Paladin"] = [(0), (0), (0)];
    _traitEffects["Werewolf"] = [(0), (0), (0)];
    _traitEffects["Wizards"] = [(0), (0), (0)];

}
function buildTraitsFromSeed(numbers) {
    let gTraits = [];
    let randoms = splitRandom(numbers);
    for (var i = 0; i < _traitTypeNames.length; i++) {
        let trait = getRandomTraitTimeSave(randoms[i], i);
        gTraits[i] = trait;
    }
    return gTraits;
}
function splitRandom(numbers) {
    numbers = BigInt(numbers.toString());
    var a = BigInt("999");
    return [
        numbers % a,
        (numbers / a) % a,
        (numbers / a / a) % a,
        (numbers / a / a / a) % a,
        (numbers / a / a / a / a) % a,
        (numbers / a / a / a / a / a) % a
    ];
}
function getRandomTraitTimeSave(random, traitTypeNr) {
    let trait = "";
    let possibleTraits = _possibleTraits[traitTypeNr];
    let possibilities = _traitPossibilities[traitTypeNr];
    let control = true;

    for (i = 0; i < possibleTraits.length; i++) {
        if (random < possibilities[i] && control) {
            trait = possibleTraits[i];
            control = false;
        }
    }
    return trait;
}
function getAttackFromTraits(metadata) {
    let attack = 1000; //TODO make basevalue public in contract
    //console.log(metadata);
    metadata.forEach(traitName => {
        var traitModifiers = _traitEffects[traitName.toString()];
        attack += traitModifiers[0];

    })
    return attack;
}
function getDefenseFromTraits(metadata) {
    let defense = 250;//TODO make basevalue public in contract
    metadata.forEach(traitName => {
        var traitModifiers = _traitEffects[traitName];
        defense += traitModifiers[1];
    })
    return defense;
}
function getWeightFromTraits(metadata) {
    let weight = 3600;//TODO make basevalue public in contract
    metadata.forEach(traitName => {
        var traitModifiers = _traitEffects[traitName];
        weight += traitModifiers[2];
    })
    return weight;
}
function getAttributeAttack(attributeName) {
    return _traitEffects[attributeName][0];
}
function getAttributeDefense(attributeName) {
    return _traitEffects[attributeName][1];
}
function getAttributeWeight(attributeName) {
    return _traitEffects[attributeName][2];
}
function getAuraStrength(auraName) {
    let indexOfAura = _possibleTraits[5].indexOf(auraName);
    let strengthIndex = indexOfAura + 1 > 14 ? 0 : indexOfAura + 1;
    return _possibleTraits[5][strengthIndex];
}
function getAuraWeakness(auraName) {
    let indexOfAura = _possibleTraits[5].indexOf(auraName);
    let strengthIndex = indexOfAura - 1 < 0 ? 14 : indexOfAura - 1;
    return _possibleTraits[5][strengthIndex];
}
function getAttributesForTrait(traitName) {
    var effect = _traitEffects[traitName];
    let attributes = {};
    attributes.attack = effect[0];
    attributes.defense = effect[1];
    attributes.weight = effect[2];
    return attributes;
}
function getShortName(traitName) {
    if (traitName == "Solid Gold Heater") {
        return "S.G.Heater";
    }
    else if (traitName == "Rusty Buckler") {
        return "R. Buckler";
    }
    else if (traitName == "Light Buckler") {
        return "L. Buckler";
    }
    else if (traitName == "Hardened Buckler") {
        return "H. Buckler";
    }
    else if (traitName == "Plain Square") {
        return "P. Square";
    }
    else if (traitName == "Gold Square") {
        return "Gld Square";
    }
    else if (traitName == "Weighted Heater") {
        return "W. Heater";
    }
    else if (traitName == "Gold Studded Heater") {
        return "G.S.Heater";
    }
    else if (traitName == "Liquid Studded Heater") {
        return "L.S.Heater";
    }
    else if (traitName == "Rocket Launcher") {
        return "R. Launcher";
    }
    else if (traitName == "Luxury Pistol") {
        return "L. Pistol";
    }
    else if (traitName == "Legion Square") {
        return "Legion Sq.";
    }
    return traitName;
}

