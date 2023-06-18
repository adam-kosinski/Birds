const max_avoid_copyright_attempts = 5;

const default_per_page = 200;
const initial_per_page = 5;

const max_fetch_attempts = 15; //how many times to attempt fetching to meet threshold, before quit
const birdsong_popular_attempts = 3; //how many times to attempt fetching popular observations before reverting to popular or not popular
const visual_id_popular_attempts = 1;
let taxon_obs_threshold = 20; //number of observations we'd like to have for each taxon, will stop when reach this

const max_taxon_bag_copies = 5; //number of times a taxon can be in the taxon bag, min is 1
const correct_remove_copies = 1; //number of copies to remove from taxon_bag if the user got a question on this taxon right
const incorrect_add_copies = 2; //same, but number to add if incorrect, for both the guess and what it actually is
const skipped_add_copies = 1; //number to add if no guess, for what it actually is

const autocomplete_delay = 1000; //ms after user stops typing, to update the autocomplete
const n_autocomplete_results = 5;

const place_style = {     //for place geometry
    "color": "orange"
}

const top_n_selected = 16; //for place selection

function getInfoURL(taxon_obj) {
    if (taxon_obj.rank == "species") return "https://www.allaboutbirds.org/guide/" + taxon_obj.preferred_common_name.replaceAll(" ", "_") + (mode == "birdsong" ? "/sounds" : "/id");
    return taxon_obj.wikipedia_url;
}

const birdsong_question = "<span class='font-large'>What bird is singing?</span><br>Select a bird or write its name";
const birdsong_question_family = "<span class='font-large'>What family is the bird from?</span><br>Select a family or write its name";
const birdsong_question_order = "<span class='font-large'>What order is the bird from?</span><br>Select an order or write its name";
const visual_id_question = "What bird is this?";
const visual_id_question_family = "What family is this bird from?";
const visual_id_question_order = "What order is this bird from?";


const presets = {
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
    "Bird Orders (North America)": {
        description: "",
        photo: "images/preset_bird_orders_america.jpg",
        mode: "visual_id",
        place_id: 97304,    //north america
        info_url_format: "https://en.wikipedia.org/wiki/[scientific]",
        rank: "order",
        birdsong_question: "<span class='font-large'>What order is the bird in?</span><br>Select a bird order or write its name",
        visual_id_question: "What order is this bird in?",
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
            67569,    //Flamingos
            20715    //Trogons and Quetzals
        ]
    },
    "Bird Orders (Global)": {
        description: "How well do you know your bird orders? Test out your knowledge with birds from all over the world!",
        photo: "images/preset_bird_orders.jpg",
        mode: "visual_id",
        info_url_format: "https://en.wikipedia.org/wiki/[scientific]",
        rank: "order",
        birdsong_question: "<span class='font-large'>What bird order is the bird in?</span><br>Select a bird order or write its name",
        visual_id_question: "What order is this bird in?",
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
    "Bird Families (Passeriformes)": {
        description: "",
        photo: "",
        mode: "visual_id",
        taxa: []
    },
    "Bird Families (Non-Passeriformes)": {
        description: "",
        photo: "",
        mode: "visual_id",
        taxa: []
    },
    "Bird Families (All)": {
        description: "",
        photo: "",
        mode: "visual_id",
        taxa: [
            6912,    //Ducks, Geese, and Swans
            4929,    //Herons, Egrets, and Bitterns
            5067,    //Hawks, Eagles, and Kites
            559248,    //New World Sparrows
            2715,    //Pigeons and Doves
            7823,    //Crows, Jays, and Magpies
            9079,    //Finches, Euphonias, and Allies
            4342,    //Gulls, Terns, and Skimmers
            15977,    //Thrushes
            17599,    //Woodpeckers
            11989,    //New World Blackbirds and Orioles
            71349,    //New World Warblers
            980017,    //Tyrant Flycatchers
            3835,    //Sandpipers and Allies
            13547,    //Tits, Chickadees, and Titmice
            71305,    //Cardinals and Allies
            12704,    //Old World Flycatchers and Chats
            5562,    //Hummingbirds
            154,    //Rails, Gallinules, and Coots
            13685,    //Old World Sparrows
            11853,    //Swallows and Martins
            4783,    //Plovers and Lapwings
            574,    //Pheasants, Grouse, and Allies
            4262,    //Cormorants and Shags
            59911,    //Mockingbirds and Thrashers
            4637,    //Falcons and Caracaras
            14841,    //Starlings
            71369,    //Tanagers and Allies
            19728,    //Typical Owls
            15964    //Wrens
        ]
    },
    "Tricky Trillers": {
        description: "That's a pine warbler right? Or wait, maybe a chipping sparrow? Or a junco... hmm, tricky. See <a target='_blank' href='https://apassionforbirds.wordpress.com/2015/02/21/tricky-trillers/'>here</a> for some ID tips.",
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
    }
}