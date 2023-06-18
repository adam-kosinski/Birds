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
const birdsong_nonbird_question = "<span class='font-large'>What fella is singing?</span><br>Select one below or write its name";
const visual_id_question = "What bird is this?";
const visual_id_question_family = "What family is this bird from?";
const visual_id_question_order = "What order is this bird from?";
const visual_id_nonbird_question = "What fella is this?";


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
        description: "Can you tell a falcon from a hawk? I bet you can. Maybe.",
        photo: "images/preset_bird_orders_america.jpg",
        mode: "visual_id",
        place_id: 97394,    //north america
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
    /*
    "North America Families (Passeriformes)": {
        description: "",
        photo: "",
        mode: "visual_id",
        place_id: 97394,    //north america
        taxa: []
    },
    "North America Families (Non-Passeriformes)": {
        description: "",
        photo: "",
        mode: "visual_id",
        place_id: 97394,    //north america
        taxa: []
    },
    "North America Families (All)": {
        description: "",
        photo: "",
        mode: "visual_id",
        place_id: 97394,    //north america
        taxa: []
    },
    */
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
    },
    "Sparrows (NC)": {
        description: "Get your magnifying glass out for these because you're going to need it.",
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
    }
}

//southern cricket is ok
//little grass maybe not