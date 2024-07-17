const DEFAULT_PER_PAGE = 200;
const INITIAL_PER_PAGE = 5;

const MAX_FETCH_ATTEMPTS = 15; //how many times to attempt fetching to meet threshold, before quit
const BIRDSONG_POPULAR_ATTEMPTS = 3; //how many times to attempt fetching popular observations before reverting to popular or not popular
const VISUAL_ID_POPULAR_ATTEMPTS = 1;
const N_OBS_PER_TAXON = 20; //number of observations we'd like to have for each taxon, will stop when reach this

const MAX_PREFERRED_AUDIO_DURATION = 15; //seconds, if the next observation's sound is longer, try to pick a different next one
const MAX_SHORT_AUDIO_RETRIES = 3; //max number of tries to pick a shorter audio (to limit requests / possible infinite looping)
const TIME_TO_REPLENISH_A_SHORT_AUDIO_RETRY = 1000; //ms, retries replenish over time

const MAX_TAXON_BAG_COPIES = 11; //number of times a taxon can be in the taxon bag, min is 1
const START_TAXON_BAG_COPIES = 7; //may add fewer copies for taxa that the user is very proficient at - see game.js, initGame()
const CORRECT_REMOVE_COPIES = 2; //number of copies to remove from taxon_bag if the user got a question on this taxon right
const INCORRECT_ADD_COPIES = 3; //number of copies to add if incorrect, for both the guess and what it actually is
const NO_GUESS_ADD_COPIES = 0; //number of copies to add to bag if no guess - 0 seems okay, since some recordings/images are v bad
// note that how the taxon bag works affects the progress bar:
// the progress bar is keeping track of how many fewer times the taxon appears in the taxon bag than when we started
// so if you get several wrong, you have to get several right to get the # copies back under START_TAXON_BAG_COPIES
// so probably don't set MAX_TAXON_BAG_COPIES too high, or this will never get back down enough

const AUTOCOMPLETE_DELAY = 1000; //ms after user stops typing, to update the autocomplete
const N_AUTOCOMPLETE_RESULTS = 5;

const PLACE_STYLE = {     //for location geometry
    "color": "orange"
}
const TOP_N_SELECTED = 16; //for location selection

const FUNNY_BIRD_LEAVE_DELAY = 8000; //ms
function getFunnyBirdDelay() {
    return 60000 + 60000 * Math.random();
}

const SQUIRREL_PROBABILITY = 0.02   //hee hee :)

const MAX_BIRD_IMAGE_ZOOM_FACTOR = 6;

const N_ANSWERS_TO_STORE = 10;
// we store recent proficiency in local storage (if setting checked), this is how far back to remember
// - affects stability of proficiency measurement
// - also, when starting out, we assume that this many previous questions were all answered incorrectly
//   (so the user has to build up from 0 proficiency), so this affects how fast that can happen

const RECOMMENDED_SUBSET_SIZES = [16, 8, 4]; // needs to be descending
const HOURS_SINCE_REVIEWED_THRESHOLD = 24; // if time since reviewed is greater than this, species needs review
const FRACTION_RESERVED_FOR_REVIEW = 0.25; // this fraction of recommended subsets will consist of species needing review



function getInfoURL(taxon_obj) {
    if (taxon_obj.ancestor_ids.includes(3) && taxon_obj.rank === "species") {
        return "https://www.allaboutbirds.org/guide/" + taxon_obj.preferred_common_name.replaceAll(" ", "_").replaceAll("'", "") + (mode === "birdsong" ? "/sounds" : "/id");
    }
    //Amphibians and Reptiles
    if ((taxon_obj.ancestor_ids.includes(20978) || taxon_obj.ancestor_ids.includes(26036)) && taxon_obj.rank_level <= 10) {  // rank level 10 is species, 5 is subspecies
        if (taxon_obj.id === 73887) return "https://herpsofnc.org/corn-snake/";  // herps of nc has a typo for the scientific name for corn snakes
        if (taxon_obj.id === 788326) return "https://herpsofnc.org/eastern-ribbon-snake/"; // herps of nc has a typo for eastern ribbon snake too
        if (taxon_obj.id === 27389) return "https://herpsofnc.org/worm-snake/";  // for some reason there is a "Worm Snake Test" result with less info that comes up first in search results, go to correct one
        if (taxon_obj.id === 39830) return "https://herpsofnc.org/river-cooter/"; // florida cooter comes up first for river cooter, which is confusing
        if (taxon_obj.id === 39782) return "https://herpsofnc.org/yellow-bellied-slider/"; // same, florida cooter comes up first
        return "https://herpsofnc.org/?s=" + taxon_obj.name.split(" ").slice(0, 2).join("+");  // only include genus and species, not subspecies (can mess up search)
    }
    //Insect orders
    let bugguide_mapping = {
        // insect orders
        47157: 57,    //Butterflies and Moths
        47208: 60,    //Beetles
        47201: 59,    //Ants, Bees, Wasps, and Sawflies
        47744: 63,    //True Bugs, Hoppers, Aphids, and allies
        47822: 55,    //Flies
        47792: 191,    //Dragonflies and Damselflies
        47651: 73,    //Grasshoppers, Crickets, and Katydids
        48112: 342391,    //Mantises
        48763: 61,    //Antlions, Lacewings, and Allies
        81769: 342386,    //Cockroaches and Termites
        62164: 5233,    //Caddisflies
        48011: 78,    //Mayflies
        47198: 74,    //Stick Insects
        47793: 2709,    //Earwigs
        83187: 67,    //Barklice, Booklice, and Parasitic Lice
        47504: 76,    //Stoneflies
        47864: 233428,    //Alderflies, Dobsonflies, and Fishflies
        49369: 56,    //Scorpionflies, Hangingflies, and Allies
        48301: 79,    //Silverfishes

        // dragonflies and damselflies
        84549: 603,    //Common Whitetail
        61495: 577,    //Eastern Pondhawk
        59774: 598,    //Blue Dasher
        84481: 601,    //Ebony Jewelwing
        104586: 576,    //Great Blue Skimmer
        103498: 604,    //Fragile Forktail
        104580: 2650,    //Slaty Skimmer
        47934: 586,    //Widow Skimmer
        59776: 8058,    //Eastern Amberwing
        47975: 2642,    //Blue-fronted Dancer
        // 103927: 27364,    //Blue Corporal  - wikipedia better
        94575: 14911,    //Blue-tipped Dancer
        94545: 584,    //Variable Dancer
        50147: 2591,    //Halloween Pennant
        100034: 2584,    //Swamp Darner
        63160: 595,    //Calico Pennant
        100212: 10646,    //Common Baskettail
        68229: 3828,    //Carolina Saddlebags
        520958: 3148,    //Lancet Clubtail
        67731: 585,    //Common Green Darner
        // 94557: 2640,    //Powdered Dancer  - wikipedia better
        104575: 600,    //Spangled Skimmer
        96907: 594,    //Banded Pennant
        520951: 17841,    //Ashy Clubtail
        110625: 573,    //Common Sanddragon
        99897: 596,    //Familiar Bluet
        103494: 597,    //Citrine Forktail
        99609: 6388,    //Black-shouldered Spinyleg
        94571: 2641,    //Blue-ringed Dancer
        99924: 583,    //Orange Bluet
        99283: 589,    //Stream Cruiser
        100403: 590,    //Little Blue Dragonlet
        // 102006: 17837,    //Dragonhunter  - wikipedia better
        104585: 4085,    //Painted Skimmer
        // 108344: 8933    //Wandering Glider  - wikipedia better
    }
    if (taxon_obj.id in bugguide_mapping) {
        return "https://bugguide.net/node/view/" + bugguide_mapping[taxon_obj.id];
    }

    //Fungi - mushroomexpert.com
    //check if fungus and not lichen since the iNaturalist fungi taxon includes lichens
    let not_on_mushroom_expert = [144013];
    if (taxon_obj.ancestor_ids.includes(47170) && !taxon_obj.ancestor_ids.includes(54743) && taxon_obj.rank === "species" && !not_on_mushroom_expert.includes(taxon_obj.id)) {
        if (taxon_obj.id === 1238700) return "https://www.mushroomexpert.com/Armillaria_tabescens.html";
        if (taxon_obj.id === 972793) return "https://www.mushroomexpert.com/lycoperdon_pyriforme.html";
        if (taxon_obj.id === 786918) return "https://www.mushroomexpert.com/lenzites_betulina.html";
        if (taxon_obj.id === 352462) return "https://www.mushroomexpert.com/strobilomyces_floccopus.html";
        return "https://www.mushroomexpert.com/" + taxon_obj.name.toLowerCase().replaceAll(" ", "_") + ".html"
    }

    //Bryophytes
    //Use ohiomosslichen.org for mosses, good pictures, simple, and comprehensive
    //illinoiswildflowers.info is more detailed for some mosses but less comprehensive, and maybe a bit of an info dump
    if (taxon_obj.ancestor_ids.includes(311249) && taxon_obj.rank === "species") {
        if (taxon_obj.id === 1138520) return "https://ohiomosslichen.org/moss-anomodon-attenuatus/";
        if (taxon_obj.id === 164650) return "https://ohiomosslichen.org/moss-leucobryum-glaucum/"; //other species of same genus, v similar and article mentions how to tell apart
        if (taxon_obj.id === 1278022) return "https://ohiomosslichen.org/moss-hypnum-imponens/";
        return "https://ohiomosslichen.org/moss-" + taxon_obj.name.toLowerCase().replaceAll(" ", "-");
    }

    //Wikipedia is standard default
    if (taxon_obj.wikipedia_url) return taxon_obj.wikipedia_url;

    //Deal with name changes / weird taxa that haven't been synchronized with wikipedia in the iNaturalist database
    if (taxon_obj.id === 1363728) return "https://en.wikipedia.org/wiki/Grouper";
    if (taxon_obj.id === 1359791) return "https://en.wikipedia.org/wiki/Anthiinae";

    //Final default is the iNaturalist page for this taxon, which must exist
    return "https://www.inaturalist.org/taxa/" + taxon_obj.id;
}


function getQuestionHTML(mode, taxon_obj, is_squirrel_intruder = false) {
    const rank = taxon_obj.rank;
    let is_bird = taxon_obj.ancestor_ids.includes(3);
    if (is_squirrel_intruder) is_bird = true; // definitely a bird ;)
    const is_animal = taxon_obj.ancestor_ids.includes(1);
    const entity_name = is_bird ? "bird " : (is_animal ? "animal " : ""); //appending a space if not blank to make questions work out

    if (mode === "birdsong") {
        if (taxon_obj.rank_level <= 10) { // species, subspecies, etc.
            return `<span class='font-large'>What ${entity_name}is singing?</span><br>Select one below or write its name`;
        }
        else {
            const rank_article = /a|e|i|o|u/.test(rank[0].toLowerCase()) ? "an" : "a";
            return `<span class='font-large'>What ${rank} is this ${entity_name}from?</span><br>Select ${rank_article} ${rank} or write its name`
        }
    }
    else if (mode === "visual_id") {
        if (taxon_obj.rank_level <= 10) { // species, subspecies, etc.
            return `What ${entity_name}is this?`
        }
        else {
            return `What ${rank} is this ${entity_name}from?`;
        }
    }
}


/*
For generating preset lists from list_taxa
console.log(list_taxa.map(obj => `${obj.id},   //${obj.preferred_common_name}\n`).join(""))
*/


const PRESETS = {
    "Backyard Birds (Southeast US)": {
        description: "Your best birdy friends! Well, if you live in the southeast US at least.",
        photo: "images/preset_backyard.png",
        taxa: [
            9083,    //Northern Cardinal
            144814,    //Carolina Chickadee
            7513,    //Carolina Wren
            13632,    //Tufted Titmouse
            8021,    //American Crow
            18205,    //Red-bellied Woodpecker
            9424,    //Eastern Towhee
            12727,    //American Robin
            14886,    //Northern Mockingbird
            8229,    //Blue Jay
            792988,    //Downy Woodpecker
            3454,    //Mourning Dove
            12942,    //Eastern Bluebird
            145310,    //American Goldfinch
            199840,    //House Finch
            9135,    //Chipping Sparrow
            14801,    //White-breasted Nuthatch
            17008,    //Eastern Phoebe
            14850,    //European Starling
            18236,    //Northern Flicker
            9744,    //Red-winged Blackbird
            10227,    //Indigo Bunting
            9602,    //Common Grackle
            14995,    //Gray Catbird
            9184,    //White-throated Sparrow
            10094,    //Dark-eyed Junco
            145245,    //Yellow-rumped Warbler
            1289388,    //Ruby-crowned Kinglet
            9100,    //Song Sparrow
            145244,    //Pine Warbler
            14825,    //Brown-headed Nuthatch
            13858,    //House Sparrow
            14898,    //Brown Thrasher
            19893    //Barred Owl
        ]
    },

    // "Waterfowl Tribes (North America)": {
    //     description: "Sploosh. Quack. Honk.",
    //     photo: "",
    //     mode: "visual_id",
    //     place_id: 97394,    //north america
    //     taxa: [
    //         6890,   //whistling ducks
    //         6913,   //swans
    //         7006,   //grey geese
    //         7086,   //black geese
    //         7120,   //muscovy duck
    //     ]
    // },
    "Tricky Trillers": {
        description: "That's a pine warbler right? Or wait, maybe a chipping sparrow? Or a junco... hmm, tricky. See <a class='default-link-style' target='_blank' href='https://apassionforbirds.wordpress.com/2015/02/21/tricky-trillers/'>here</a> for some ID tips.",
        photo: "images/preset_trillers.jpg",
        mode: "birdsong",
        taxa: [
            9096,   //swamp sparrow
            145242,  //palm warbler
            145244, //pine warbler
            979757, //orange crowned warbler
            10094,  //dark eyed junco
            9135,   //chipping sparrow
            72912  //worm eating warbler
        ]
    },
    "Robin-Like Songs": {
        description: "What do you mean, that's not a robin?",
        photo: "images/preset_robinlike.jpg",
        mode: "birdsong",
        taxa: [
            12727,  //american robin
            9921,   //scarlet tanager
            10271,  //rose breasted grosbeak
            891704, //red eyed vireo
            11935   //tree swallow
        ]
    },
    "Finicky Finchy Friends (East/Central US)": {
        description: "They all sound the same, prove me wrong.",
        photo: "images/preset_finnicky_finches.jpg",
        mode: "birdsong",
        taxa: [
            17394,  //warbling vireo
            199840, //house finch
            199841, //purple finch
            145310, //american goldfinch
            73155,  //blue grosbeak
            10227,   //indigo bunting
            145304  //pine siskin
        ]
    },
    "Common Warblers (East/Central US)": {
        description: "Tweet tweet!",
        photo: "images/preset_warblers.jpg",
        mode: "birdsong",
        taxa: [
            10286,    //Black-and-white Warbler
            10247,    //American Redstart
            145238,    //Yellow Warbler
            145244,     //Pine Warbler
            145242,    //Palm Warbler
            145239,    //Chestnut-sided Warbler
            145245,    //Yellow-rumped Warbler
            62550,    //Ovenbird
            9721,    //Common Yellowthroat
            145229,    //Hooded Warbler
            145246,    //Yellow-throated Warbler
            10729,      //Prothonotary Warbler
            145233,    //Northern Parula
            145249,    //Prairie Warbler
            199916,     //Black-throated Blue Warbler
            145258,    //Black-throated Green Warbler
            73148,       //Louisiana waterthrush
            73553,    //Blue-winged Warbler
            145231,     //Cape May Warbler
            145235,     //Magnolia Warbler
            145240     //Blackpoll Warbler
        ]
    },
    "Sparrows (NC)": {
        description: "Get your high-powered binoculars out for these because you're going to need them.",
        photo: "images/preset_nc_sparrows.jpg",
        mode: "visual_id",
        taxa: [
            13858,    //House Sparrow
            9100,    //Song Sparrow
            9135,    //Chipping Sparrow
            9096,    //Swamp Sparrow
            9176,    //White-crowned Sparrow
            9184,    //White-throated Sparrow
            9981,    //Savannah Sparrow
            9152,   //Field Sparrow
            9092,    //Lincoln's Sparrow
            7294,    //Horned Lark
            9156,    //Fox Sparrow
            13732,    //American Pipit
            474210,    //American Tree Sparrow
            73172,    //Bachman's Sparrow
            10676,    //Dickcissel
            793286,    //Nelson's Sparrow
            793285,    //Henslow's Sparrow
            10139,    //Grasshopper Sparrow
            10168    //Vesper Sparrow
        ]
    },
    "Woodpeckers (East/Central US)": {
        description: "Peck peck... peck peck peck.",
        photo: "images/preset_woodpeckers.jpg",
        mode: "birdsong",
        taxa: [
            792988,    //Downy Woodpecker
            18205,    //Red-bellied Woodpecker
            18236,    //Northern Flicker
            17855,    //Pileated Woodpecker
            18463,    //Yellow-bellied Sapsucker
            18204,    //Red-headed Woodpecker
            792990,    //Hairy Woodpecker
            792993    //Red-cockaded Woodpecker
        ]
    },
    "Bird Orders (North America)": {
        description: "Can you tell a falcon from a hawk? I bet you can. Maybe.",
        photo: "images/preset_bird_orders_america.jpg",
        mode: "visual_id",
        place_id: 97394,    //north america
        taxa: [
            67562,    //Loons
            67563,    //Grebes
            67565,    //Tubenoses
            67566,    //Pelicans, Herons, Ibises, and Allies
            71268,    //Gannets, Cormorants, and Allies
            3726,    //Storks
            67569,    //Flamingos
            6888,    //Waterfowl
            559244,    //New World Vultures
            71261,    //Hawks, Eagles, Kites, and Allies
            67570,    //Falcons and Caracaras
            573,    //Landfowl
            4,    //Cranes, Rails, and Allies
            67561,    //Shorebirds and Allies
            2708,    //Pigeons and Doves
            18874,    //Parrots
            1623,    //Cuckoos
            19350,    //Owls
            67573,    //Nightjars, Swifts, Hummingbirds, and Allies
            20715,    //Trogons and Quetzals
            2114,    //Kingfishers and Allies
            17550,    //Woodpeckers, Barbets, and Allies
            7251    //Perching Birds
        ]
    },
    "Bird Orders (Global)": {
        description: "Test out your knowledge on bird orders with birds from all over the world!",
        photo: "images/preset_bird_orders.jpg",
        mode: "visual_id",
        taxa: [
            7251,    //Perching Birds
            6888,    //Waterfowl
            67561,    //Shorebirds and Allies
            67566,    //Pelicans, Herons, Ibises, and Allies
            71261,    //Hawks, Eagles, Kites, and Allies
            2708,    //Pigeons and Doves
            17550,    //Woodpeckers, Barbets, and Allies
            67573,    //Nightjars, Swifts, Hummingbirds, and Allies
            4,    //Cranes, Rails, and Allies
            573,    //Landfowl
            71268,    //Gannets, Cormorants, and Allies
            18874,    //Parrots
            67570,    //Falcons and Caracaras
            19350,    //Owls
            2114,    //Kingfishers and Allies
            559244,    //New World Vultures
            67563,    //Grebes
            1623,    //Cuckoos
            3726,    //Storks
            67565,    //Tubenoses
            67562,    //Loons
            525653,    //Hornbills and Hoopoes
            67569,    //Flamingos
            20715,    //Trogons and Quetzals
            67564,    //Penguins
            71264,    //Jacamars and Puffbirds
            71266,    //Bustards
            20487,    //Ostriches
            793433,    //Turacos
            367702,    //Cassowaries and Emu
            20530,    //Tinamous
            3686,    //Mousebirds
            470156,    //Sandgrouse
            367701,    //Rheas
            67567,    //Tropicbirds
            508251,    //Hoatzins
            71262,    //Seriemas
            71263,    //Kagu and Sunbittern
            367703,    //Kiwis
            71265,    //Mesites
            525652    //Cuckoo-Rollers
        ]
    },
    "North America Families (Passeriformes)": {
        description: "We be perching, yes we do.",
        photo: "images/preset_families_passeriformes.jpg",
        mode: "visual_id",
        place_id: 97394,    //north america
        taxa: [
            980017,    //Tyrant Flycatchers
            7284,    //Larks
            11853,    //Swallows and Martins
            7823,    //Crows, Jays, and Magpies
            13547,    //Tits, Chickadees, and Titmice
            71362,    //Penduline-Tits
            7264,    //Long-tailed Tits
            14799,    //Nuthatches
            7448,    //Treecreepers
            71355,    //Gnatcatchers
            15964,    //Wrens
            7640,    //Dippers
            15050,  //Sylviid Warblers and Parrotbills, aka Old world warblers, kinglets, gnatcatchers
            180354,   //Kinglets
            200982,   //Leaf Warblers
            12704,    //Old World Flycatchers and Chats
            15977,    //Thrushes
            59911,    //Mockingbirds and Thrashers
            71339,    //Wagtails and Pipits
            7423,    //Waxwings
            367708,    //Silky-flycatchers
            71351,      //Olive Warbler
            12015,    //Shrikes
            14841,    //Starlings
            17354,    //Vireos, Shrike-Babblers, and Erpornis
            71349,    //New World Warblers
            559263,   //Yellow-breasted Chat
            // 71369,    //Tanagers and Allies
            71305,    //Cardinals and Allies
            11989,    //New World Blackbirds and Orioles
            200991,   //Longspurs and Snow Buntings
            559248,   //New World Sparrows
            9079,    //Finches, Euphonias, and Allies
            13685    //Old World Sparrows
        ]
    },
    "North America Families (Non-Passeriformes)": {
        description: "Do perching birds intimidate you? Try these families instead! Not that they're any easier...",
        photo: "images/preset_families_non_passeriformes.jpg",
        mode: "visual_id",
        place_id: 97394,    //north america
        taxa: [
            4619,    //Loons
            4203,    //Grebes
            67526,    //Albatrosses
            4020,    //Shearwaters and Petrels
            71326,    //Northern Storm-Petrels
            793435,   //Southern Storm Petrels
            // 4312,    //Tropicbirds
            3784,    //Boobies and Gannets
            4323,    //Pelicans
            4262,    //Cormorants and Shags
            5059,    //Darters
            4628,    //Frigatebirds
            4929,    //Herons, Egrets, and Bitterns
            3727,    //Ibises and Spoonbills
            4730,    //Storks
            4255,    //Flamingos
            6912,    //Ducks, Geese, and Swans
            71306,    //New World Vultures
            5067,    //Hawks, Eagles, and Kites
            200958, //Osprey
            4637,    //Falcons and Caracaras
            2043,    //Guans, Chachalacas, and Curassows
            574,    //Pheasants, Grouse, and Allies
            1278,   //New World Quails
            154,    //Rails, Gallinules, and Coots
            5,    //Limpkins
            23,    //Cranes
            4783,    //Plovers and Lapwings
            71325,    //Oystercatchers
            71361,    //Stilts and Avocets
            4574,    //Jacanas
            3835,    //Sandpipers and Allies
            4342,    //Gulls, Terns, and Skimmers
            71367,   //Skuas and Jaegers
            71295,    //Auks, Murres, Guillemots, and Puffins
            2715,    //Pigeons and Doves
            18875,    //New World and African Parrots
            1627,    //Cuckoos
            20413,    //Barn-Owls
            19728,    //Typical Owls
            19376,    //Nightjars and Nighthawks
            6544,    //Swifts
            5562,    //Hummingbirds
            20716,    //Trogons
            2314,    //Kingfishers
            17599    //Woodpeckers
        ]
        // All About Birds North America families doesn't mention:
        // Tropicbirds (fairly rare), commenting out
        // Flamingos (well)
        // Jacanas (mexico and tropics)
        // Tanagers (Thraupidae, massive family, mexico and tropics). Only two main ones according to audobon, commenting out
    },
    "North America Families (All)": {
        description: "Show off your bird skills!",
        photo: "images/preset_families_all.jpg",
        mode: "visual_id",
        place_id: 97394,    //north america
        taxa: [] //concatenated at bottom of config file
    },
    "Common Frog and Toad Sounds (NC)": {
        description: "Don't mind us, we're definitely birds, uh... ribbit.",
        photo: "images/preset_frogs_toads.jpg",
        mode: "birdsong",
        taxa: [
            23930,    //Cope's Gray Treefrog
            24268,    //Spring Peeper
            24263,    //Upland Chorus Frog
            23969,    //Green Treefrog
            24230,    //Northern Cricket Frog
            25078,    //Eastern Narrow-mouthed Toad
            65982,    //Green Frog
            65979,    //American Bullfrog
            23873,    //Squirrel Treefrog
            60341,    //Southern Leopard Frog
            64968,    //American Toad
            24233,    //Southern Cricket Frog
            24262,    //Little Grass Frog
            64977,    //Fowler's Toad
            23872,    //Pine Woods Tree Frog
            66002    //Pickerel Frog
        ]
    },
    "Salamanders of the NC Piedmont": {
        description: "If the frogs can be here we can too.",
        photo: "images/preset_salamanders.jpeg",
        mode: "visual_id",
        taxa: [
            26736,    //Marbled Salamander
            27093,    //Southern Two-lined Salamander
            27188,    //White-spotted Slimy Salamander
            27805,    //Eastern Newt
            26790,    //Spotted Salamander
            27420,    //Northern Dusky Salamander
            27186,    //Eastern Red-backed Salamander
            27107,    //Three-lined Salamander
            27486,    //Red Salamander
            27652,    //Four-toed Salamander
            27095    //Chamberlain's Dwarf Salamander
        ]
    },
    "Snakes of the NC Piedmont": {
        description: "If those wriggly salamanders can be here we can too.",
        photo: "images/preset_snakes.jpg",
        mode: "visual_id",
        place_id: "7,30,43", // virginia, north carolina, south carolina - to exclude subspecies that are far away that might look different
        taxa: [
            28562,    //DeKay's Brownsnake
            59644,    //Eastern Ratsnake
            29306,    //Northern Watersnake (N. sipedon sipedon)
            912622,    //Eastern Copperhead
            27389,    //Eastern Worm Snake (C. amoenus amoenus)
            29200,    //Rough Greensnake
            27149,    //Northern Black Racer (Coluber constrictor constrictor)
            28559,    //Northern Redbelly Snake (S. occipitomaculata occipitomacculata)
            28102,    //Rough Earthsnake
            28365,    //Eastern Garter Snake (T. sirtalis sirtalis)
            26575,    //ring-necked snake
            29813,    //Eastern Kingsnake
            29328,    //Plain-bellied Watersnake
            28850,    //Queensnake
            28109,    //Smooth Earthsnake (V. valeriae valeriae)
            1304769,    //Mole Kingsnake
            29925,    //Eastern Hognose Snake
            28516,    //Southeastern Crowned Snake
            30746,    //Timber Rattlesnake
            73887,    //Corn Snake
            29304,    //Brown Watersnake
            788326,    //Eastern Ribbon Snake (T. saurita saurita)
            27377,    //Northern Scarletsnake (C. coccinea copei)
            29793,    //Scarlet Kingsnake
            515419,   //Eastern Milksnake
            904170    //Northern Cottonmouth
        ]
    },
    "Turtles (NC)": {
        description: "Can you pass this testudinal test? We shell see.",
        photo: "images/preset_turtles.jpg",
        mode: "visual_id",
        taxa: [
            39814,   //Common Box Turtle
            39682,   //Common Snapping Turtle
            39775,   //Eastern Painted Turtle (C picta picta)
            39782,   //Pond Slider
            39830,   //River Cooter
            39826,   //Northern Red-bellied Cooter
            1367318,   //Coastal Plain Cooter
            39713,   //Eastern Mud Turtle
            39703,   //Eastern Musk Turtle
            39753,   //Striped Mud Turtle
            50000,   //Spotted Turtle
            39836,   //Diamondback Terrapin
            39762,   //Chicken Turtle

            39556,   //Spiny Softshell
            
            39665,   //Loggerhead Sea Turtle
            39659,   //Green Sea Turtle
            73844,   //Kemp's Ridley Sea Turtle
            39677,   //Leatherback Sea Turtle
            39672,   //Hawksbill Sea Turtle
        ]
    },
    "Insect Orders (NC)": {
        description: "Honestly at this point, why not learn insects too. Tips <a class='default-link-style' target='_blank' href='https://bugguide.net/'>here</a>.",
        photo: "images/preset_insects.jpg",
        mode: "visual_id",
        place_id: 30,   // north carolina
        taxa: [
            47157,    //Butterflies and Moths
            47208,    //Beetles
            47201,    //Ants, Bees, Wasps, and Sawflies
            47744,    //True Bugs, Hoppers, Aphids, and allies
            47822,    //Flies
            47792,    //Dragonflies and Damselflies
            47651,    //Grasshoppers, Crickets, and Katydids
            48112,    //Mantises
            48763,    //Antlions, Lacewings, and Allies
            81769,    //Cockroaches and Termites
            62164,    //Caddisflies
            48011,    //Mayflies
            47198,    //Stick Insects
            47793,    //Earwigs
            83187,    //Barklice, Booklice, and Parasitic Lice
            47504,    //Stoneflies
            47864,    //Alderflies, Dobsonflies, and Fishflies
            49369,    //Scorpionflies, Hangingflies, and Allies
            48301    //Silverfishes
        ]
    },
    "Dragonflies and Damselflies (NC)": {
        description: "Ah, dragons, damsels, knights in shining armor, how romantic... oh wait these are the insects.",
        photo: "images/preset_odonata.jpg",
        mode: "visual_id",
        taxa: [
            84549,   //Common Whitetail
            61495,   //Eastern Pondhawk
            59774,   //Blue Dasher
            84481,   //Ebony Jewelwing
            104586,   //Great Blue Skimmer
            103498,   //Fragile Forktail
            104580,   //Slaty Skimmer
            47934,   //Widow Skimmer
            59776,   //Eastern Amberwing
            47975,   //Blue-fronted Dancer
            103927,   //Blue Corporal
            94575,   //Blue-tipped Dancer
            94545,   //Variable Dancer
            50147,   //Halloween Pennant
            100034,   //Swamp Darner
            63160,   //Calico Pennant
            100212,   //Common Baskettail
            68229,   //Carolina Saddlebags
            520958,   //Lancet Clubtail
            67731,   //Common Green Darner
            94557,   //Powdered Dancer
            104575,   //Spangled Skimmer
            96907,   //Banded Pennant
            520951,   //Ashy Clubtail
            110625,   //Common Sanddragon
            99897,   //Familiar Bluet
            103494,   //Citrine Forktail
            99609,   //Black-shouldered Spinyleg
            94571,   //Blue-ringed Dancer
            99924,   //Orange Bluet
            99283,   //Stream Cruiser
            100403,   //Little Blue Dragonlet
            102006,   //Dragonhunter
            104585,   //Painted Skimmer
            108344   //Wandering Glider
        ]
    },
    "Fish Families of the Great Barrier Reef": {
        description: "Sploosh. I sense something fishy... <a class='default-link-style' target='_blank' href='https://fishesofaustralia.net.au/key/family'>Here</a> is a key to help you out.",
        photo: "images/preset_great_barrier_reef.jpg",
        mode: "visual_id",
        place_id: 131021,   //great barrier reef
        taxa: [
            49284,    //Wrasses and Parrotfishes    n_obs: 6797
            48313,    //Damselfishes    n_obs: 5565
            47318,    //Butterflyfishes    n_obs: 3615
            1363728,    //Groupers    n_obs: 1929
            47295,    //Snappers    n_obs: 1886
            47619,    //Surgeonfishes, Tangs, and Unicornfishes    n_obs: 1775
            84096,    //Rabbitfishes    n_obs: 994
            47237,    //Angelfishes    n_obs: 905
            49263,    //Grunts    n_obs: 789
            47308,    //Gobies    n_obs: 724
            55207,    //Emperor Breams    n_obs: 670
            47232,    //Jacks    n_obs: 644
            49612,    //Triggerfishes    n_obs: 591
            51095,    //Threadfin Breams    n_obs: 580
            118620,    //Goatfishes    n_obs: 504
            49390,    //Combtooth Blennies    n_obs: 498
            49266,    //Pufferfishes    n_obs: 484
            49317,    //Spadefishes    n_obs: 421
            49423,    //Sandperches    n_obs: 280
            47285,    //Scorpionfishes    n_obs: 244
            83291,    //Moorish Idols    n_obs: 230
            47580,    //Hawkfishes    n_obs: 209
            47264,    //Barracudas    n_obs: 205
            85594,    //Cardinalfishes    n_obs: 204
            47313,    //Morays    n_obs: 200
            49628,    //Squirrelfishes and Soldierfishes    n_obs: 189
            47529,    //Boxfishes    n_obs: 170
            47244,    //Trumpetfishes    n_obs: 127
            47176,    //Filefishes    n_obs: 120
            1359791,    //Anthiases    n_obs: 115
            49410,    //Lizardfishes    n_obs: 113
            49688,    //Sea Chubs    n_obs: 108
            47249,    //Cornetfishes    n_obs: 88
            49106,    //Pipefishes, Seahorses, and Seadragons    n_obs: 84
            47266,    //Mackerels, Tunas, and Bonitos    n_obs: 82
            54661,    //Mullets    n_obs: 78
            85894,    //Wormfishes and Dartfishes    n_obs: 73
            86099,    //Grunters    n_obs: 65
            82142,    //Dottybacks    n_obs: 63
            48842,    //Remoras    n_obs: 55
            49270,    //Porcupinefishes    n_obs: 45
            47355,    //Lates Perches    n_obs: 43
            86057,    //Scats    n_obs: 41
            86105,    //Archerfishes    n_obs: 37
            52461,    //Needlefishes    n_obs: 34
            64483    //Roundheads    n_obs: 32
        ]
    },
    "Common Piedmont Fungi and Lichens (NC)": {
        description: "Okay these aren't even animals. But are cool.",
        photo: "images/preset_mushrooms.jpg",
        mode: "visual_id",
        taxa: [
            1238700,    //Ringless Honey Mushroom
            54134,    //turkey-tail
            1125679,    //shaggy-stalked bolete
            143393,    //Red Chanterelle
            120951,    //indigo milk cap
            204589,    //Jackson's slender Caesar
            49158,    //lion's-mane mushroom
            500030,    //False Caesar's Mushroom
            121687,    //juniper-apple rust
            972793,    //Pear-shaped Puffball
            125738,    //Black-staining Polypore
            487301,    //White-pored Chicken of the Woods
            125743,    //Ravenel's stinkhorn
            144013,    //Honeydew Eater
            787944,    //oak bracket
            126831,    //Eastern American jack-o'-lantern
            786918,    //Gilled Polypore
            54573,    //splitgill mushroom
            121176,    //Bushy beard lichen
            84271,    //devil's dipstick
            58709,    //devil's urn
            48494,    //Oyster Mushroom
            196842,    //crowded parchment
            117308,    //green-spored parasol
            352462,    //Old-man-of-the-woods
            334704,    //crown-tipped coral fungus
            793759,    //Wrinkly Stinkhorn
            117943,    //common greenshield lichen
            85398,    //flowerpot parasol
            48443,    //common puffball
            48529,      //witch's butter, less common but super cool looking
            155091    //powdered ruffle lichen, 3rd most common lichen in NC piedmont and looks similar to greenshield lichen
        ]
    },
    "Common Piedmont Mosses (NC)": {
        description: "So floofy!",
        photo: "images/preset_mosses.jpg",
        mode: "visual_id",
        taxa: [
            159499,    //Bryoandersonia illecebra
            169738,    //Thuidium delicatulum
            154195,    //Physcomitrium pyriforme
            320575,    //Bartramia pomiformis
            128029,    //Entodon seductrix
            120000,    //Funaria hygrometrica
            122658,    //Leucobryum glaucum
            163550,    //Hedwigia ciliata
            123134,    //Dicranum scoparium
            161971,    //Ditrichum pallidum
            141535,    //Plagiomnium cuspidatum
            56156,    //Atrichum angustatum
            123390,    //Bryum argenteum
            125668,    //Climacium americanum
            1138520,    //Pseudanomodon attenuatus
            68293,    //Polytrichum commune
            164650,    //Leucobryum albidum
            164653,    //Leucodon julaceus
            1278022,    //Callicladium imponens
            167808,    //Rhodobryum ontariense
            169216      //Sphagnum lescurii, less common but here to represent the iconic Sphagnum genus
        ]
    }
}


PRESETS['North America Families (All)'].taxa = PRESETS['North America Families (Non-Passeriformes)'].taxa.concat(PRESETS['North America Families (Passeriformes)'].taxa);