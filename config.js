const default_per_page = 200;
const initial_per_page = 5;

const max_fetch_attempts = 15; //how many times to attempt fetching to meet threshold, before quit
const birdsong_popular_attempts = 3; //how many times to attempt fetching popular observations before reverting to popular or not popular
const visual_id_popular_attempts = 1;
let taxon_obs_threshold = 30; //number of observations we'd like to have for each taxon, will stop when reach this

const autocomplete_delay = 1000; //ms after user stops typing, to update the autocomplete
const n_autocomplete_results = 5;

const place_style = {     //for place geometry
    "color": "orange"
}

const top_n_selected = 16; //for place selection

function getAllAboutBirdsURL(common_name){
    return "https://www.allaboutbirds.org/guide/" + common_name.replaceAll(" ", "_") + (mode == "birdsong" ? "/sounds" : "/id");
}


const backyard_birds_ids = [
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
];