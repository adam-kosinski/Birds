/*
For getting common species (place id 30 is NC)
https://api.inaturalist.org/v1/observations/species_counts?place_id=30&quality_grade=research&taxon_id=______
Then you can paste it into the console as "data" and do:
console.log(data.results.slice(0,50).map(x => `${x.taxon.id},   //${x.taxon.preferred_common_name}\n`).join(""))

For generating preset lists from list_taxa
console.log(list_taxa.map(obj => `${obj.id},   //${obj.preferred_common_name}\n`).join(""))
*/

const PRESETS = {
  "Backyard Birds (Southeast US)": {
    description:
      "Your best birdy friends! Well, if you live in the southeast US at least.",
    photo: "images/preset_backyard.png",
    taxa: [
      9083, //Northern Cardinal
      144814, //Carolina Chickadee
      7513, //Carolina Wren
      13632, //Tufted Titmouse
      8021, //American Crow
      18205, //Red-bellied Woodpecker
      9424, //Eastern Towhee
      12727, //American Robin
      14886, //Northern Mockingbird
      8229, //Blue Jay
      792988, //Downy Woodpecker
      3454, //Mourning Dove
      12942, //Eastern Bluebird
      145310, //American Goldfinch
      199840, //House Finch
      9135, //Chipping Sparrow
      14801, //White-breasted Nuthatch
      17008, //Eastern Phoebe
      14850, //European Starling
      18236, //Northern Flicker
      9744, //Red-winged Blackbird
      10227, //Indigo Bunting
      9602, //Common Grackle
      14995, //Gray Catbird
      9184, //White-throated Sparrow
      10094, //Dark-eyed Junco
      145245, //Yellow-rumped Warbler
      1289388, //Ruby-crowned Kinglet
      9100, //Song Sparrow
      145244, //Pine Warbler
      14825, //Brown-headed Nuthatch
      13858, //House Sparrow
      14898, //Brown Thrasher
      19893, //Barred Owl
    ],
  },
  "Backyard Bird Calls (Southeast US)": {
    description:
      "Bird calls curated from the Macaulay Library to help you tell all those chip notes apart.",
    mode: "birdsong",
    custom_game_type: "eBird Calls",
    data_source: "ebird_calls",
    photo: "images/preset_backyard_calls.jpg",
    custom_groups: true,
    taxa: [
      [
        // scolding / raspy
        144814, //Carolina Chickadee
        13632, //Tufted Titmouse
        7513, //Carolina Wren
      ],
      [
        // squirrel-like
        14886, //Northern Mockingbird
        14995, //Gray Catbird
        9602, //Common Grackle
        9744, //Red-winged Blackbird
        19893, //Barred Owl
      ],
      [
        // "weeps", "peeks", and barks
        12727, //American Robin
        9100, //Song Sparrow
        18205, //Red-bellied Woodpecker
        18236, //Northern Flicker
        792988, //Downy Woodpecker
      ],
      [
        // clean chip calls
        9083, //Northern Cardinal
        145244, //Pine Warbler
        10227, //Indigo Bunting
        10094, //Dark-eyed Junco
        9135, //Chipping Sparrow
        9184, //White-throated Sparrow
        17008, //Eastern Phoebe
      ],
      [
        // raspier chip calls
        145245, //Yellow-rumped Warbler
        1289388, //Ruby-crowned Kinglet
        12942, //Eastern Bluebird
        14898, //Brown Thrasher
      ],
      [
        // harsh / nasaly
        8021, //American Crow
        8229, //Blue Jay
        14801, //White-breasted Nuthatch
      ],
      [
        // squeaky or finchy
        199840, //House Finch
        145310, //American Goldfinch
        14825, //Brown-headed Nuthatch
        9424, //Eastern Towhee
      ],
      [
        // chirps and wildness
        13858, //House Sparrow
        14850, //European Starling
      ],
    ],
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
    description:
      "That's a pine warbler right? Or wait, maybe a chipping sparrow? Or a junco... hmm, tricky. See <a class='default-link-style' target='_blank' href='https://apassionforbirds.wordpress.com/2015/02/21/tricky-trillers/'>here</a> for some ID tips.",
    photo: "images/preset_trillers.jpg",
    mode: "birdsong",
    taxa: [
      9096, //swamp sparrow
      145242, //palm warbler
      145244, //pine warbler
      979757, //orange crowned warbler
      10094, //dark eyed junco
      9135, //chipping sparrow
      72912, //worm eating warbler
    ],
  },
  "Robin-Like Songs": {
    description: "What do you mean, that's not a robin?",
    photo: "images/preset_robinlike.jpg",
    mode: "birdsong",
    taxa: [
      12727, //american robin
      9921, //scarlet tanager
      9915, //summer tanager
      10271, //rose breasted grosbeak
      891704, //red eyed vireo
      17402, //blue-headed vireo
      11935, //tree swallow
    ],
  },
  "Finicky Finchy Friends (East/Central US)": {
    description: "They all sound the same, prove me wrong.",
    photo: "images/preset_finnicky_finches.jpg",
    mode: "birdsong",
    taxa: [
      17394, //warbling vireo
      199840, //house finch
      199841, //purple finch
      145310, //american goldfinch
      73155, //blue grosbeak
      10227, //indigo bunting
      145304, //pine siskin
    ],
  },
  "Common Warblers (East/Central US)": {
    description: "Tweet tweet!",
    photo: "images/preset_warblers.jpg",
    mode: "birdsong",
    taxa: [
      10286, //Black-and-white Warbler
      10247, //American Redstart
      145238, //Yellow Warbler
      145244, //Pine Warbler
      145242, //Palm Warbler
      145239, //Chestnut-sided Warbler
      145245, //Yellow-rumped Warbler
      62550, //Ovenbird
      9721, //Common Yellowthroat
      145229, //Hooded Warbler
      145246, //Yellow-throated Warbler
      10729, //Prothonotary Warbler
      145233, //Northern Parula
      145249, //Prairie Warbler
      199916, //Black-throated Blue Warbler
      145258, //Black-throated Green Warbler
      73148, //Louisiana waterthrush
      73553, //Blue-winged Warbler
      145231, //Cape May Warbler
      145235, //Magnolia Warbler
      145240, //Blackpoll Warbler
    ],
  },
  "Warbler Field Marks (East US)": {
    description:
      "In this set, the warbler disappears after only a few seconds. Can you spot the field marks to help identify it?",
    photo: "images/preset_warbler_field_marks.jpg",
    mode: "visual_id",
    place_id: 81418, // eastern US, avoid western plumage of yellow rumped warbler
    custom_game_type: "Warbler Field Marks",
    taxa: [
      145245, //Yellow-rumped Warbler
      145242, //Palm Warbler
      9721, //Common Yellowthroat
      145244, //Pine Warbler
      10247, //American Redstart
      10286, //Black-and-white Warbler
      145238, //Yellow Warbler
      145233, //Northern Parula
      62550, //Ovenbird
      145235, //Magnolia Warbler
      145258, //Black-throated Green Warbler
      199916, //Black-throated Blue Warbler
      145239, //Chestnut-sided Warbler
      145231, //Cape May Warbler
      10729, //Prothonotary Warbler
      145249, //Prairie Warbler
      979756, //Tennessee Warbler
      145240, //Blackpoll Warbler
      145246, //Yellow-throated Warbler
      145236, //Bay-breasted Warbler
      145237, //Blackburnian Warbler
      145229, //Hooded Warbler
      979753, //Nashville Warbler
      73149, //Northern Waterthrush
      73148, //Louisiana Waterthrush
      979757, //Orange-crowned Warbler
      145275, //Canada Warbler
      73553, //Blue-winged Warbler
      72912, //Worm-eating Warbler
      145276, //Wilson's Warbler
      145225, //Kentucky Warbler
      9807, //Golden-winged Warbler
      145232, //Cerulean Warbler
      145224, //Mourning Warbler
      10442, //Swainson's Warbler
      10431, //Connecticut Warbler
      145230, //Kirtland's Warbler
    ],
  },
  "Sophie's Favorite Warblers (Calls)": {
    description: "Warble warblery weeble wooble. From the Macaulay Library.",
    photo: "images/preset_warbler_calls.jpg",
    mode: "birdsong",
    data_source: "ebird_calls",
    taxa: [
      145232, //Cerulean Warbler
      10442, //Swainson's Warbler
      73148, //Louisiana Waterthrush
      73149, //Northern Waterthrush
      145237, //Blackburnian Warbler
      145275, //Canada Warbler
      145240, //Blackpoll Warbler
      10247, //American Redstart
      145238, //Yellow Warbler
      10729, //Prothonotary Warbler
      145246, //Yellow-throated Warbler
      72912, //Worm-eating Warbler
      145225, //Kentucky Warbler
      145249, //Prairie Warbler
      145229, //Hooded Warbler
      62550, //Ovenbird
      145231, //Cape May Warbler
      145239, //Chestnut-sided Warbler
      10431, //Connecticut Warbler
      73553, //Blue-winged Warbler
      145224, //Mourning Warbler
      979753, //Nashville Warbler
      145276, //Wilson's Warbler
      145236, //Bay-breasted Warbler
      979757, //Orange-crowned Warbler
      979756, //Tennessee Warbler
      9807, //Golden-winged Warbler
      9721, //Common Yellowthroat
      145233, //Northern Parula
      199916, //Black-throated Blue Warbler
      145242, //Palm Warbler
      145258, //Black-throated Green Warbler
      10286, //Black-and-white Warbler
      145235, //Magnolia Warbler
    ],
  },
  "Sparrows (NC)": {
    description:
      "Get your high-powered binoculars out for these because you're going to need them.",
    photo: "images/preset_nc_sparrows.jpg",
    mode: "visual_id",
    taxa: [
      13858, //House Sparrow
      9100, //Song Sparrow
      9135, //Chipping Sparrow
      9096, //Swamp Sparrow
      9176, //White-crowned Sparrow
      9184, //White-throated Sparrow
      9981, //Savannah Sparrow
      9152, //Field Sparrow
      9092, //Lincoln's Sparrow
      7294, //Horned Lark
      9156, //Fox Sparrow
      13732, //American Pipit
      474210, //American Tree Sparrow
      73172, //Bachman's Sparrow
      10676, //Dickcissel
      793286, //Nelson's Sparrow
      793285, //Henslow's Sparrow
      10139, //Grasshopper Sparrow
      10168, //Vesper Sparrow
    ],
  },
  "Woodpeckers (East/Central US)": {
    description: "Peck peck... peck peck peck.",
    photo: "images/preset_woodpeckers.jpg",
    mode: "birdsong",
    taxa: [
      792988, //Downy Woodpecker
      18205, //Red-bellied Woodpecker
      18236, //Northern Flicker
      17855, //Pileated Woodpecker
      18463, //Yellow-bellied Sapsucker
      18204, //Red-headed Woodpecker
      792990, //Hairy Woodpecker
      792993, //Red-cockaded Woodpecker
    ],
  },
  "Bird Orders (North America)": {
    description: "Can you tell a falcon from a hawk? I bet you can. Maybe.",
    photo: "images/preset_bird_orders_america.jpg",
    mode: "visual_id",
    place_id: 97394, //north america
    taxa: [
      67562, //Loons
      67563, //Grebes
      67565, //Tubenoses
      67566, //Pelicans, Herons, Ibises, and Allies
      71268, //Gannets, Cormorants, and Allies
      3726, //Storks
      67569, //Flamingos
      6888, //Waterfowl
      559244, //New World Vultures
      71261, //Hawks, Eagles, Kites, and Allies
      67570, //Falcons and Caracaras
      573, //Landfowl
      4, //Cranes, Rails, and Allies
      67561, //Shorebirds and Allies
      2708, //Pigeons and Doves
      18874, //Parrots
      1623, //Cuckoos
      19350, //Owls
      67573, //Nightjars, Swifts, Hummingbirds, and Allies
      20715, //Trogons and Quetzals
      2114, //Kingfishers and Allies
      17550, //Woodpeckers, Barbets, and Allies
      7251, //Perching Birds
    ],
  },
  "Bird Orders (Global)": {
    description:
      "Test out your knowledge on bird orders with birds from all over the world!",
    photo: "images/preset_bird_orders.jpg",
    mode: "visual_id",
    taxa: [
      7251, //Perching Birds
      6888, //Waterfowl
      67561, //Shorebirds and Allies
      67566, //Pelicans, Herons, Ibises, and Allies
      71261, //Hawks, Eagles, Kites, and Allies
      2708, //Pigeons and Doves
      17550, //Woodpeckers, Barbets, and Allies
      67573, //Nightjars, Swifts, Hummingbirds, and Allies
      4, //Cranes, Rails, and Allies
      573, //Landfowl
      71268, //Gannets, Cormorants, and Allies
      18874, //Parrots
      67570, //Falcons and Caracaras
      19350, //Owls
      2114, //Kingfishers and Allies
      559244, //New World Vultures
      67563, //Grebes
      1623, //Cuckoos
      3726, //Storks
      67565, //Tubenoses
      67562, //Loons
      525653, //Hornbills and Hoopoes
      67569, //Flamingos
      20715, //Trogons and Quetzals
      67564, //Penguins
      71264, //Jacamars and Puffbirds
      71266, //Bustards
      20487, //Ostriches
      793433, //Turacos
      367702, //Cassowaries and Emu
      20530, //Tinamous
      3686, //Mousebirds
      470156, //Sandgrouse
      367701, //Rheas
      67567, //Tropicbirds
      508251, //Hoatzins
      71262, //Seriemas
      71263, //Kagu and Sunbittern
      367703, //Kiwis
      71265, //Mesites
      525652, //Cuckoo-Rollers
    ],
  },
  "North America Families (Passeriformes)": {
    description: "We be perching, yes we do.",
    photo: "images/preset_families_passeriformes.jpg",
    mode: "visual_id",
    place_id: 97394, //north america
    taxa: [
      980017, //Tyrant Flycatchers
      7284, //Larks
      11853, //Swallows and Martins
      7823, //Crows, Jays, and Magpies
      13547, //Tits, Chickadees, and Titmice
      71362, //Penduline-Tits
      7264, //Long-tailed Tits
      14799, //Nuthatches
      7448, //Treecreepers
      71355, //Gnatcatchers
      15964, //Wrens
      7640, //Dippers
      15050, //Sylviid Warblers and Parrotbills, aka Old world warblers, kinglets, gnatcatchers
      180354, //Kinglets
      200982, //Leaf Warblers
      12704, //Old World Flycatchers and Chats
      15977, //Thrushes
      59911, //Mockingbirds and Thrashers
      71339, //Wagtails and Pipits
      7423, //Waxwings
      367708, //Silky-flycatchers
      71351, //Olive Warbler
      12015, //Shrikes
      14841, //Starlings
      17354, //Vireos, Shrike-Babblers, and Erpornis
      71349, //New World Warblers
      559263, //Yellow-breasted Chat
      // 71369,    //Tanagers and Allies
      71305, //Cardinals and Allies
      11989, //New World Blackbirds and Orioles
      200991, //Longspurs and Snow Buntings
      559248, //New World Sparrows
      9079, //Finches, Euphonias, and Allies
      13685, //Old World Sparrows
    ],
  },
  "North America Families (Non-Passeriformes)": {
    description:
      "Do perching birds intimidate you? Try these families instead! Not that they're any easier...",
    photo: "images/preset_families_non_passeriformes.jpg",
    mode: "visual_id",
    place_id: 97394, //north america
    taxa: [
      4619, //Loons
      4203, //Grebes
      67526, //Albatrosses
      4020, //Shearwaters and Petrels
      71326, //Northern Storm-Petrels
      793435, //Southern Storm Petrels
      // 4312,    //Tropicbirds
      3784, //Boobies and Gannets
      4323, //Pelicans
      4262, //Cormorants and Shags
      5059, //Darters
      4628, //Frigatebirds
      4929, //Herons, Egrets, and Bitterns
      3727, //Ibises and Spoonbills
      4730, //Storks
      4255, //Flamingos
      6912, //Ducks, Geese, and Swans
      71306, //New World Vultures
      5067, //Hawks, Eagles, and Kites
      200958, //Osprey
      4637, //Falcons and Caracaras
      2043, //Guans, Chachalacas, and Curassows
      574, //Pheasants, Grouse, and Allies
      1278, //New World Quails
      154, //Rails, Gallinules, and Coots
      5, //Limpkins
      23, //Cranes
      4783, //Plovers and Lapwings
      71325, //Oystercatchers
      71361, //Stilts and Avocets
      4574, //Jacanas
      3835, //Sandpipers and Allies
      4342, //Gulls, Terns, and Skimmers
      71367, //Skuas and Jaegers
      71295, //Auks, Murres, Guillemots, and Puffins
      2715, //Pigeons and Doves
      18875, //New World and African Parrots
      1627, //Cuckoos
      20413, //Barn-Owls
      19728, //Typical Owls
      19376, //Nightjars and Nighthawks
      6544, //Swifts
      5562, //Hummingbirds
      20716, //Trogons
      2314, //Kingfishers
      17599, //Woodpeckers
    ],
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
    place_id: 97394, //north america
    taxa: [], //concatenated at bottom of config file
  },
  "Common Frog and Toad Sounds (NC)": {
    description: "Don't mind us, we're definitely birds, uh... ribbit.",
    photo: "images/preset_frogs_toads.jpg",
    mode: "birdsong",
    taxa: [
      23930, //Cope's Gray Treefrog
      24268, //Spring Peeper
      24263, //Upland Chorus Frog
      23969, //Green Treefrog
      24230, //Northern Cricket Frog
      25078, //Eastern Narrow-mouthed Toad
      65982, //Green Frog
      65979, //American Bullfrog
      23873, //Squirrel Treefrog
      60341, //Southern Leopard Frog
      64968, //American Toad
      24233, //Southern Cricket Frog
      24262, //Little Grass Frog
      64977, //Fowler's Toad
      23872, //Pine Woods Tree Frog
      66002, //Pickerel Frog
    ],
  },
  "Salamanders of the NC Piedmont": {
    description: "If the frogs can be here we can too.",
    photo: "images/preset_salamanders.jpeg",
    mode: "visual_id",
    taxa: [
      26736, //Marbled Salamander
      27093, //Southern Two-lined Salamander
      27188, //White-spotted Slimy Salamander
      27805, //Eastern Newt
      26790, //Spotted Salamander
      27420, //Northern Dusky Salamander
      27186, //Eastern Red-backed Salamander
      27107, //Three-lined Salamander
      27486, //Red Salamander
      27652, //Four-toed Salamander
      27095, //Chamberlain's Dwarf Salamander
    ],
  },
  "Snakes of the NC Piedmont": {
    description: "If those wriggly salamanders can be here we can too.",
    photo: "images/preset_snakes.jpg",
    mode: "visual_id",
    place_id: "7,30,43", // virginia, north carolina, south carolina - to exclude subspecies that are far away that might look different
    taxa: [
      28562, //DeKay's Brownsnake
      59644, //Eastern Ratsnake
      29306, //Northern Watersnake (N. sipedon sipedon)
      912622, //Eastern Copperhead
      27389, //Eastern Worm Snake (C. amoenus amoenus)
      29200, //Rough Greensnake
      27149, //Northern Black Racer (Coluber constrictor constrictor)
      28559, //Northern Redbelly Snake (S. occipitomaculata occipitomacculata)
      28102, //Rough Earthsnake
      28365, //Eastern Garter Snake (T. sirtalis sirtalis)
      26575, //ring-necked snake
      29813, //Eastern Kingsnake
      29328, //Plain-bellied Watersnake
      28850, //Queensnake
      28109, //Smooth Earthsnake (V. valeriae valeriae)
      1304769, //Mole Kingsnake
      29925, //Eastern Hognose Snake
      28516, //Southeastern Crowned Snake
      30746, //Timber Rattlesnake
      73887, //Corn Snake
      29304, //Brown Watersnake
      788326, //Eastern Ribbon Snake (T. saurita saurita)
      27377, //Northern Scarletsnake (C. coccinea copei)
      29793, //Scarlet Kingsnake
      515419, //Eastern Milksnake
      904170, //Northern Cottonmouth
    ],
  },
  "Turtles (NC)": {
    description: "Can you pass this testudinal test? We shell see.",
    photo: "images/preset_turtles.jpg",
    mode: "visual_id",
    taxa: [
      39814, //Common Box Turtle
      39682, //Common Snapping Turtle
      39775, //Eastern Painted Turtle (C picta picta)
      39782, //Pond Slider
      39830, //River Cooter
      39826, //Northern Red-bellied Cooter
      1367318, //Coastal Plain Cooter
      39713, //Eastern Mud Turtle
      39703, //Eastern Musk Turtle
      39753, //Striped Mud Turtle
      50000, //Spotted Turtle
      39836, //Diamondback Terrapin
      39762, //Chicken Turtle

      39556, //Spiny Softshell

      39665, //Loggerhead Sea Turtle
      39659, //Green Sea Turtle
      73844, //Kemp's Ridley Sea Turtle
      39677, //Leatherback Sea Turtle
      39672, //Hawksbill Sea Turtle
    ],
  },
  "Insect Orders (NC)": {
    description:
      "For all those insect lovers out there. Tips <a class='default-link-style' target='_blank' href='https://bugguide.net/'>here</a>.",
    photo: "images/preset_insects.jpg",
    mode: "visual_id",
    place_id: 30, // north carolina
    taxa: [
      47157, //Butterflies and Moths
      47208, //Beetles
      47201, //Ants, Bees, Wasps, and Sawflies
      47744, //True Bugs, Hoppers, Aphids, and allies
      47822, //Flies
      47792, //Dragonflies and Damselflies
      47651, //Grasshoppers, Crickets, and Katydids
      48112, //Mantises
      48763, //Antlions, Lacewings, and Allies
      81769, //Cockroaches and Termites
      62164, //Caddisflies
      48011, //Mayflies
      47198, //Stick Insects
      47793, //Earwigs
      83187, //Barklice, Booklice, and Parasitic Lice
      47504, //Stoneflies
      47864, //Alderflies, Dobsonflies, and Fishflies
      49369, //Scorpionflies, Hangingflies, and Allies
      48301, //Silverfishes
    ],
  },
  "Dragonflies and Damselflies (NC)": {
    description:
      "Ah, dragons, damsels, knights in shining armor, how romantic... oh wait these are the insects.",
    photo: "images/preset_odonata.jpg",
    mode: "visual_id",
    taxa: [
      84549, //Common Whitetail
      61495, //Eastern Pondhawk
      59774, //Blue Dasher
      84481, //Ebony Jewelwing
      104586, //Great Blue Skimmer
      103498, //Fragile Forktail
      104580, //Slaty Skimmer
      47934, //Widow Skimmer
      59776, //Eastern Amberwing
      47975, //Blue-fronted Dancer
      103927, //Blue Corporal
      94575, //Blue-tipped Dancer
      94545, //Variable Dancer
      50147, //Halloween Pennant
      100034, //Swamp Darner
      63160, //Calico Pennant
      100212, //Common Baskettail
      68229, //Carolina Saddlebags
      520958, //Lancet Clubtail
      67731, //Common Green Darner
      94557, //Powdered Dancer
      104575, //Spangled Skimmer
      96907, //Banded Pennant
      520951, //Ashy Clubtail
      110625, //Common Sanddragon
      99897, //Familiar Bluet
      103494, //Citrine Forktail
      99609, //Black-shouldered Spinyleg
      94571, //Blue-ringed Dancer
      99924, //Orange Bluet
      99283, //Stream Cruiser
      100403, //Little Blue Dragonlet
      102006, //Dragonhunter
      104585, //Painted Skimmer
      108344, //Wandering Glider
    ],
  },
  "Common Butterflies of NC": {
    description: "They're so pretty!",
    photo: "images/preset_butterflies.jpg",
    mode: "visual_id",
    place_id: 30, // NC
    taxa: [
      60551, //Eastern Tiger Swallowtail
      48662, //Monarch
      81559, //Silver-spotted Skipper
      60607, //Red-spotted Admiral
      49972, //Pipevine Swallowtail
      48505, //Common Buckeye
      50340, //Fiery Skipper
      52925, //Pearl Crescent
      58523, //Black Swallowtail
      49150, //Gulf Fritillary
      48549, //American Lady
      58525, //Spicebush Swallowtail
      68244, //Variegated Fritillary
      1081329, //Zabulon Skipper
      48550, //Cloudless Sulphur
      122381, //Eastern Tailed-Blue
      49133, //Red Admiral
      1456562, //Great Spangled Fritillary
      142988, //Clouded Skipper
      1455248, //Huron Sachem
      55626, //Small White
      67439, //Sleepy Orange
      68232, //Palamedes Swallowtail
      58579, //Question Mark
      50931, //Gray Hairstreak
      122281, //Red-banded Hairstreak
      50071, //Horace's Duskywing
      67435, //Long-tailed Skipper
      82792, //Summer Azure
      60752, //Carolina Satyr
      68264, //Hackberry Emperor
      147931, //Ocola Skipper
      62978, //Silvery Checkerspot
      58586, //Viceroy
      83086, //Zebra Swallowtail
      1038408, //Common Checkered-Skipper
      58475, //Juvenal's Duskywing
      54064, //Eastern Comma
      48548, //Painted Lady
      58561, //American Snout
      198812, //Northern Pearly-eye
      58481, //Least Skipper
      58606, //Common Wood-Nymph
      132227, //Appalachian Brown
      58532, //Orange Sulphur
      223532, //Southern Pearly-eye
      58587, //Tawny Emperor
      58603, //Little Wood Satyr
      56832, //Mourning Cloak
      143140, //Eastern Gemmed-Satyr
    ],
  },
  "Common Moths of NC": {
    description: "This group of fascinating fuzzy flappers is sure to be fun!",
    photo: "images/preset_moths.jpg",
    mode: "visual_id",
    place_id: 30, // NC
    taxa: [
      47916, //North American Luna Moth
      211100, //Eastern Tent Caterpillar Moth
      116681, //Ailanthus Webworm Moth
      47919, //Polyphemus Moth
      83090, //Tulip-tree Beauty
      120217, //Banded Tussock Moth
      81590, //Imperial Moth
      127133, //Fall Webworm Moth
      81665, //White-marked Tussock Moth
      48094, //Rosy Maple Moth
      59675, //Isabella Tiger Moth
      63028, //Giant Leopard Moth
      358549, //Snowberry Clearwing
      145659, //American Dagger
      118513, //Green Cloverworm Moth
      61505, //Carolina Sphinx
      53577, //Tulip-tree Silkmoth
      205197, //Curved-toothed Geometer Moth
      82204, //White-dotted Prominent
      52902, //Faint-spotted Palthis Moth
      81663, //Forest Tent Caterpillar Moth
      143615, //Celery Leaftier Moth
      143005, //Bent-lined Carpet
      143518, //Large Maple Spanworm Moth
      60839, //Virginian Tiger Moth
      118503, //Virginia Creeper Sphinx
      81680, //Large Lace-border Moth
      736797, //Lesser Maple Spanworm Moth
      52904, //Elegant Grass-veneer
      82379, //Hummingbird Clearwing
      143181, //Black-bordered Lemon Moth
      127460, //Common Idia Moth
      47914, //Pandorus Sphinx
      122228, //Saddleback Caterpillar Moth
      118927, //Clemens' Grass Tubeworm Moth
      82201, //Baltimore Snout
      143119, //Wedgling Moth
      82279, //Io Moth
      343393, //Yellow-fringed Dolichomia Moth
      84333, //Beautiful Wood-nymph
      60754, //Orange-patched Smoky Moth
      81586, //Regal Moth
      119953, //Painted Lichen Moth
      69737, //Tersa Sphinx
      118531, //Maple Looper Moth
      126397, //Sycamore Tussock Moth
      61240, //Agreeable Tiger Moth
      205233, //Bent-line Gray
      143105, //Common Tan Wave
      228593, //Hebrew Moth
    ],
  },
  "Fish Families of the Great Barrier Reef": {
    description:
      "Sploosh. I sense something fishy... <a class='default-link-style' target='_blank' href='https://fishesofaustralia.net.au/key/family'>Here</a> is a key to help you out.",
    photo: "images/preset_great_barrier_reef.jpg",
    mode: "visual_id",
    place_id: 131021, //great barrier reef
    taxa: [
      49284, //Wrasses and Parrotfishes    n_obs: 6797
      48313, //Damselfishes    n_obs: 5565
      47318, //Butterflyfishes    n_obs: 3615
      1363728, //Groupers    n_obs: 1929
      47295, //Snappers    n_obs: 1886
      47619, //Surgeonfishes, Tangs, and Unicornfishes    n_obs: 1775
      84096, //Rabbitfishes    n_obs: 994
      47237, //Angelfishes    n_obs: 905
      49263, //Grunts    n_obs: 789
      47308, //Gobies    n_obs: 724
      55207, //Emperor Breams    n_obs: 670
      47232, //Jacks    n_obs: 644
      49612, //Triggerfishes    n_obs: 591
      51095, //Threadfin Breams    n_obs: 580
      118620, //Goatfishes    n_obs: 504
      49390, //Combtooth Blennies    n_obs: 498
      49266, //Pufferfishes    n_obs: 484
      49317, //Spadefishes    n_obs: 421
      49423, //Sandperches    n_obs: 280
      47285, //Scorpionfishes    n_obs: 244
      83291, //Moorish Idols    n_obs: 230
      47580, //Hawkfishes    n_obs: 209
      47264, //Barracudas    n_obs: 205
      85594, //Cardinalfishes    n_obs: 204
      47313, //Morays    n_obs: 200
      49628, //Squirrelfishes and Soldierfishes    n_obs: 189
      47529, //Boxfishes    n_obs: 170
      47244, //Trumpetfishes    n_obs: 127
      47176, //Filefishes    n_obs: 120
      1359791, //Anthiases    n_obs: 115
      49410, //Lizardfishes    n_obs: 113
      49688, //Sea Chubs    n_obs: 108
      47249, //Cornetfishes    n_obs: 88
      49106, //Pipefishes, Seahorses, and Seadragons    n_obs: 84
      47266, //Mackerels, Tunas, and Bonitos    n_obs: 82
      54661, //Mullets    n_obs: 78
      85894, //Wormfishes and Dartfishes    n_obs: 73
      86099, //Grunters    n_obs: 65
      82142, //Dottybacks    n_obs: 63
      48842, //Remoras    n_obs: 55
      49270, //Porcupinefishes    n_obs: 45
      47355, //Lates Perches    n_obs: 43
      86057, //Scats    n_obs: 41
      86105, //Archerfishes    n_obs: 37
      52461, //Needlefishes    n_obs: 34
      64483, //Roundheads    n_obs: 32
    ],
  },
  "Common Piedmont Fungi and Lichens (NC)": {
    description: "Okay these aren't even animals. But are cool.",
    photo: "images/preset_mushrooms.jpg",
    mode: "visual_id",
    taxa: [
      1238700, //Ringless Honey Mushroom
      54134, //turkey-tail
      1125679, //shaggy-stalked bolete
      143393, //Red Chanterelle
      120951, //indigo milk cap
      204589, //Jackson's slender Caesar
      49158, //lion's-mane mushroom
      500030, //False Caesar's Mushroom
      121687, //juniper-apple rust
      972793, //Pear-shaped Puffball
      125738, //Black-staining Polypore
      487301, //White-pored Chicken of the Woods
      125743, //Ravenel's stinkhorn
      144013, //Honeydew Eater
      787944, //oak bracket
      126831, //Eastern American jack-o'-lantern
      786918, //Gilled Polypore
      54573, //splitgill mushroom
      121176, //Bushy beard lichen
      84271, //devil's dipstick
      58709, //devil's urn
      48494, //Oyster Mushroom
      196842, //crowded parchment
      117308, //green-spored parasol
      352462, //Old-man-of-the-woods
      334704, //crown-tipped coral fungus
      793759, //Wrinkly Stinkhorn
      117943, //common greenshield lichen
      85398, //flowerpot parasol
      48443, //common puffball
      48529, //witch's butter, less common but super cool looking
      155091, //powdered ruffle lichen, 3rd most common lichen in NC piedmont and looks similar to greenshield lichen
    ],
  },
  "Common Piedmont Mosses (NC)": {
    description: "So floofy!",
    photo: "images/preset_mosses.jpg",
    mode: "visual_id",
    taxa: [
      159499, //Bryoandersonia illecebra
      169738, //Thuidium delicatulum
      154195, //Physcomitrium pyriforme
      320575, //Bartramia pomiformis
      128029, //Entodon seductrix
      120000, //Funaria hygrometrica
      122658, //Leucobryum glaucum
      163550, //Hedwigia ciliata
      123134, //Dicranum scoparium
      161971, //Ditrichum pallidum
      141535, //Plagiomnium cuspidatum
      56156, //Atrichum angustatum
      123390, //Bryum argenteum
      125668, //Climacium americanum
      1138520, //Pseudanomodon attenuatus
      68293, //Polytrichum commune
      164650, //Leucobryum albidum
      164653, //Leucodon julaceus
      1278022, //Callicladium imponens
      167808, //Rhodobryum ontariense
      169216, //Sphagnum lescurii, less common but here to represent the iconic Sphagnum genus
    ],
  },
  "Yellow Asteraceae Genera (NC Piedmont)": {
    description: "Is that a tasty dandelion? Are you sure...?",
    photo: "images/preset_yellow_asteraceae.jpg",
    mode: "visual_id",
    place_id: "63888", // nc piedmont,
    taxa: [
      // roughly organized by visual similarity when taken in groups of 4

      // aster tribe of aster subfamily
      48678, //goldenrods
      58827, //grass-leaved goldenrods
      156595, //Silkgrasses
      127266, //golden asters

      // sunflower tribe of aster subfamily
      56955, //sunflowers
      62742, //black-eyed Susans and orange coneflowers
      54006, //Rosinweeds
      72422, //crownbeard

      129314, //northern green and gold (species)
      // coreopsis tribe of aster subfamily
      50204, //Beggarticks (Bidens)
      57952, //Tickseed
      // misc aster subfamily
      200075, //bears foot (species)

      54923, //American groundsels and ragworts
      // sneezeweed tribe of aster subfamily
      53093, //sneezeweeds
      // chickory subfamily
      53106, //wild lettuces
      53270, //sow thistles

      47603, //dandelions
      51900, //Cat's-Ears
      53863, //Dwarf dandelions
      68572, //desert-chicories aka false dandelion

      55910, //hawkweeds
      130953, //rattlesnake roots
      203680, //mouse-ear hawkweeds
      127067, //asiatic hawksbeard
    ],
  },
};

PRESETS["North America Families (All)"].taxa = PRESETS[
  "North America Families (Non-Passeriformes)"
].taxa.concat(PRESETS["North America Families (Passeriformes)"].taxa);
