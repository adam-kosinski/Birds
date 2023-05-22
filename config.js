let per_page = 200;

let max_fetch_attempts = 10; //how many times to attempt fetching to meet threshold, before quit
let attempts_to_try_popular = 3;
let taxon_obs_threshold = 20; //number of observations we'd like to have for each taxon, will stop when reach this

let autocomplete_delay = 1000; //ms after user stops typing, to update the autocomplete
let n_autocomplete_results = 5;

let backyard_birds_ids = [
    144815, //black capped chickadee
    9744,   //red winged blackbird
    9602,   //common grackle
    12727,  //american robin
    9721,   //common yellowthroat
    145238, //yellow warbler
    9083,   //northern cardinal
    3454,   //mourning dove
    18236,  //northern flicker
    7428,   //cedar waxwing
    3017,   //rock pigeon
    8021,   //american crow
    14850,  //european starling
    13858,  //house sparrow
    20044,  //great horned owl
    792988, //downy woodpecker
    14801,  //white breasted nuthatch

    9424,   //eastern towhee
    12890,  //hermit thrush
    19893,  //barred owl
    13632,  //tufted titmouse
    8229,   //blue jay
    7513    //carolina wren
];