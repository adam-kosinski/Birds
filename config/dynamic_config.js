// FUNCTIONS (DYNAMIC CONFIG) ----------------------------------------------------

function getInfoURL(taxon_obj, mode) {
  if (taxon_obj.ancestor_ids.includes(3) && taxon_obj.rank === "species") {
    return (
      "https://www.allaboutbirds.org/guide/" +
      taxon_obj.preferred_common_name.replaceAll(" ", "_").replaceAll("'", "") +
      (mode === "birdsong" ? "/sounds" : "/id")
    );
  }
  //Amphibians and Reptiles
  if (
    (taxon_obj.ancestor_ids.includes(20978) ||
      taxon_obj.ancestor_ids.includes(26036)) &&
    taxon_obj.rank_level <= 10
  ) {
    // rank level 10 is species, 5 is subspecies
    if (taxon_obj.id === 73887) return "https://herpsofnc.org/corn-snake/"; // herps of nc has a typo for the scientific name for corn snakes
    if (taxon_obj.id === 788326)
      return "https://herpsofnc.org/eastern-ribbon-snake/"; // herps of nc has a typo for eastern ribbon snake too
    if (taxon_obj.id === 27389) return "https://herpsofnc.org/worm-snake/"; // for some reason there is a "Worm Snake Test" result with less info that comes up first in search results, go to correct one
    if (taxon_obj.id === 39830) return "https://herpsofnc.org/river-cooter/"; // florida cooter comes up first for river cooter, which is confusing
    if (taxon_obj.id === 39782)
      return "https://herpsofnc.org/yellow-bellied-slider/"; // same, florida cooter comes up first
    return (
      "https://herpsofnc.org/?s=" +
      taxon_obj.name.split(" ").slice(0, 2).join("+")
    ); // only include genus and species, not subspecies (can mess up search)
  }
  //Insect orders
  let bugguide_mapping = {
    // iNaturalist taxon id: bugguide node id
    // insect orders
    47157: 57, //Butterflies and Moths
    47208: 60, //Beetles
    47201: 59, //Ants, Bees, Wasps, and Sawflies
    47744: 63, //True Bugs, Hoppers, Aphids, and allies
    47822: 55, //Flies
    47792: 191, //Dragonflies and Damselflies
    47651: 73, //Grasshoppers, Crickets, and Katydids
    48112: 342391, //Mantises
    48763: 61, //Antlions, Lacewings, and Allies
    81769: 342386, //Cockroaches and Termites
    62164: 5233, //Caddisflies
    48011: 78, //Mayflies
    47198: 74, //Stick Insects
    47793: 2709, //Earwigs
    83187: 67, //Barklice, Booklice, and Parasitic Lice
    47504: 76, //Stoneflies
    47864: 233428, //Alderflies, Dobsonflies, and Fishflies
    49369: 56, //Scorpionflies, Hangingflies, and Allies
    48301: 79, //Silverfishes

    // dragonflies and damselflies
    84549: 603, //Common Whitetail
    61495: 577, //Eastern Pondhawk
    59774: 598, //Blue Dasher
    84481: 601, //Ebony Jewelwing
    104586: 576, //Great Blue Skimmer
    103498: 604, //Fragile Forktail
    104580: 2650, //Slaty Skimmer
    47934: 586, //Widow Skimmer
    59776: 8058, //Eastern Amberwing
    47975: 2642, //Blue-fronted Dancer
    // 103927: 27364,    //Blue Corporal  - wikipedia better
    94575: 14911, //Blue-tipped Dancer
    94545: 584, //Variable Dancer
    50147: 2591, //Halloween Pennant
    100034: 2584, //Swamp Darner
    63160: 595, //Calico Pennant
    100212: 10646, //Common Baskettail
    68229: 3828, //Carolina Saddlebags
    520958: 3148, //Lancet Clubtail
    67731: 585, //Common Green Darner
    // 94557: 2640,    //Powdered Dancer  - wikipedia better
    104575: 600, //Spangled Skimmer
    96907: 594, //Banded Pennant
    520951: 17841, //Ashy Clubtail
    110625: 573, //Common Sanddragon
    99897: 596, //Familiar Bluet
    103494: 597, //Citrine Forktail
    99609: 6388, //Black-shouldered Spinyleg
    94571: 2641, //Blue-ringed Dancer
    99924: 583, //Orange Bluet
    99283: 589, //Stream Cruiser
    100403: 590, //Little Blue Dragonlet
    // 102006: 17837,    //Dragonhunter  - wikipedia better
    104585: 4085, //Painted Skimmer
    // 108344: 8933    //Wandering Glider  - wikipedia better

    // butterflies
    60551: 491, //Eastern Tiger Swallowtail
    48662: 540, //Monarch
    81559: 403, //Silver-spotted Skipper
    60607: 484, //Red-spotted Admiral
    49972: 412, //Pipevine Swallowtail
    48505: 516, //Common Buckeye
    50340: 406, //Fiery Skipper
    52925: 411, //Pearl Crescent
    58523: 2636, //Black Swallowtail
    49150: 567, //Gulf Fritillary
    48549: 488, //American Lady
    58525: 2648, //Spicebush Swallowtail
    68244: 400, //Variegated Fritillary
    1081329: 450, //Zabulon Skipper
    48550: 501, //Cloudless Sulphur
    122381: 464, //Eastern Tailed-Blue
    49133: 448, //Red Admiral
    1456562: 4221, //Great Spangled Fritillary
    142988: 5648, //Clouded Skipper
    1455248: 9521, //Huron Sachem
    55626: 3259, //Small White
    67439: 3815, //Sleepy Orange
    68232: 3489, //Palamedes Swallowtail
    58579: 487, //Question Mark
    50931: 579, //Gray Hairstreak
    122281: 575, //Red-banded Hairstreak
    50071: 17268, //Horace's Duskywing
    67435: 439, //Long-tailed Skipper
    82792: 223, //Summer Azure
    60752: 492, //Carolina Satyr
    68264: 3533, //Hackberry Emperor
    147931: 3052, //Ocola Skipper
    62978: 429, //Silvery Checkerspot
    58586: 548, //Viceroy
    83086: 3101, //Zebra Swallowtail
    1038408: 5557, //Common Checkered-Skipper
    58475: 565, //Juvenal's Duskywing
    54064: 5509, //Eastern Comma
    48548: 2649, //Painted Lady
    58561: 440, //American Snout
    198812: 3940, //Northern Pearly-eye
    58481: 5522, //Least Skipper
    58606: 459, //Common Wood-Nymph
    132227: 3240, //Appalachian Brown
    58532: 3248, //Orange Sulphur
    223532: 4154, //Southern Pearly-eye
    58587: 2646, //Tawny Emperor
    58603: 474, //Little Wood Satyr
    56832: 3188, //Mourning Cloak
    143140: 502, //Eastern Gemmed-Satyr
  };
  // swallowtail butterfly guide
  // if ([60551, 49972, 58523].includes(taxon_obj.id)){
  //   return "https://littlewildstreak.com/2015/09/12/distinguishing-swallowtail-butterflies/"
  //   // or this one? https://usinggeorgianativeplants.blogspot.com/2020/08/confusing-dark-swallowtails.html
  // }
  // american vs painted lady guide - https://bugguide.net/node/view/236368

  if (taxon_obj.id in bugguide_mapping) {
    return "https://bugguide.net/node/view/" + bugguide_mapping[taxon_obj.id];
  }

  //Fungi - mushroomexpert.com
  //check if fungus and not lichen since the iNaturalist fungi taxon includes lichens
  let not_on_mushroom_expert = [144013];
  if (
    taxon_obj.ancestor_ids.includes(47170) &&
    !taxon_obj.ancestor_ids.includes(54743) &&
    taxon_obj.rank === "species" &&
    !not_on_mushroom_expert.includes(taxon_obj.id)
  ) {
    if (taxon_obj.id === 1238700)
      return "https://www.mushroomexpert.com/Armillaria_tabescens.html";
    if (taxon_obj.id === 972793)
      return "https://www.mushroomexpert.com/lycoperdon_pyriforme.html";
    if (taxon_obj.id === 786918)
      return "https://www.mushroomexpert.com/lenzites_betulina.html";
    if (taxon_obj.id === 352462)
      return "https://www.mushroomexpert.com/strobilomyces_floccopus.html";
    return (
      "https://www.mushroomexpert.com/" +
      taxon_obj.name.toLowerCase().replaceAll(" ", "_") +
      ".html"
    );
  }

  //Bryophytes
  //Use ohiomosslichen.org for mosses, good pictures, simple, and comprehensive
  //illinoiswildflowers.info is more detailed for some mosses but less comprehensive, and maybe a bit of an info dump
  if (taxon_obj.ancestor_ids.includes(311249) && taxon_obj.rank === "species") {
    if (taxon_obj.id === 1138520)
      return "https://ohiomosslichen.org/moss-anomodon-attenuatus/";
    if (taxon_obj.id === 164650)
      return "https://ohiomosslichen.org/moss-leucobryum-glaucum/"; //other species of same genus, v similar and article mentions how to tell apart
    if (taxon_obj.id === 1278022)
      return "https://ohiomosslichen.org/moss-hypnum-imponens/";
    return (
      "https://ohiomosslichen.org/moss-" +
      taxon_obj.name.toLowerCase().replaceAll(" ", "-")
    );
  }

  //Wikipedia is standard default
  if (taxon_obj.wikipedia_url) return taxon_obj.wikipedia_url;

  //Deal with name changes / weird taxa that haven't been synchronized with wikipedia in the iNaturalist database
  if (taxon_obj.id === 1363728) return "https://en.wikipedia.org/wiki/Grouper";
  if (taxon_obj.id === 1359791)
    return "https://en.wikipedia.org/wiki/Anthiinae";

  //Final default is the iNaturalist page for this taxon, which must exist
  return "https://www.inaturalist.org/taxa/" + taxon_obj.id;
}

function getQuestionHTML(mode, taxon_obj, is_squirrel_intruder = false) {
  const rank = taxon_obj.rank;
  let is_bird = taxon_obj.ancestor_ids.includes(3);
  if (is_squirrel_intruder) is_bird = true; // definitely a bird ;)
  const is_animal = taxon_obj.ancestor_ids.includes(1);
  const entity_name = is_bird ? "bird " : is_animal ? "animal " : ""; //appending a space if not blank to make questions work out

  if (mode === "birdsong") {
    if (taxon_obj.rank_level <= 10) {
      // species, subspecies, etc.
      return `<span class='font-large'>What ${entity_name}is singing?</span><br>Select one below or write its name`;
    } else {
      const rank_article = /a|e|i|o|u/.test(rank[0].toLowerCase()) ? "an" : "a";
      return `<span class='font-large'>What ${rank} is this ${entity_name}from?</span><br>Select ${rank_article} ${rank} or write its name`;
    }
  } else if (mode === "visual_id") {
    if (taxon_obj.rank_level <= 10) {
      // species, subspecies, etc.
      return `What ${entity_name}is this?`;
    } else {
      return `What ${rank} is this ${entity_name}from?`;
    }
  }
}
