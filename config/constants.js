// iNaturalist observation fetching
const DEFAULT_PER_PAGE = 200;
const INITIAL_PER_PAGE = 5;
const MAX_FETCH_ATTEMPTS = 15; //how many times to attempt fetching to meet threshold, before quit
const BIRDSONG_POPULAR_ATTEMPTS = 3; //how many times to attempt fetching popular observations before reverting to popular or not popular
const VISUAL_ID_POPULAR_ATTEMPTS = 1;
const N_OBS_PER_TAXON = 20; //number of observations we'd like to have for each taxon, will stop when reach this
const MAX_POPULAR_OBS = 10; //number of popular observations to add before fetching any observation - set less than N_OBS_PER_TAXON so we don't get only the same popular observations each time

// common species fetching
const SPECIES_COUNTS_RADIUS = 150; //km
const FRAC_TAXA_ABSENT_WARNING_THRESHOLD = 0.25; //if more than this fraction of taxa aren't found in the selected location, warn the user

// select by location
const TOP_N_SELECTED = 16;

// question selection
const MAX_PREFERRED_AUDIO_DURATION = 15; //seconds, if the next observation's sound is longer, try to pick a different next one
const MAX_SHORT_AUDIO_RETRIES = 3; //max number of tries to pick a shorter audio (to limit requests / possible infinite looping)
const TIME_TO_REPLENISH_A_SHORT_AUDIO_RETRY = 1000; //ms, retries replenish over time
const SQUIRREL_PROBABILITY = 0.02; //hee hee :)
// taxon bag
const START_TAXON_BAG_COPIES = 7; //default amount in taxon bag, may add fewer copies for taxa that the user is very proficient at - see game.js, initGame()
const MAX_TAXON_BAG_COPIES = 11; //number of times a taxon can be in the taxon bag
const MIN_TAXON_BAG_COPIES = 4; //if user is fully proficient, will add this many copies to taxon bag
const CORRECT_REMOVE_COPIES = 2; //number of copies to remove from taxon_bag if the user got a question on this taxon right
const INCORRECT_ADD_COPIES = 3; //number of copies to add if incorrect, for both the guess and what it actually is
const NO_GUESS_ADD_COPIES = 0; //number of copies to add to bag if no guess - 0 seems okay, since some recordings/images are v bad
// note that how the taxon bag works affects the progress bar:
// the progress bar is keeping track of how many fewer times the taxon appears in the taxon bag than when we started
// so if you get several wrong, you have to get several right to get the # copies back under START_TAXON_BAG_COPIES
// so probably don't set MAX_TAXON_BAG_COPIES too high, or this will never get back down enough

// UI stuff
const AUTOCOMPLETE_DELAY = 1000; //ms after user stops typing, to update the autocomplete
const N_AUTOCOMPLETE_RESULTS = 5;
const MAX_BIRD_IMAGE_ZOOM_FACTOR = 6;
const MAX_DESCRIPTION_WORDS = 40;
const PLACE_STYLE = {
  //for location geometry
  color: "orange",
};
const FIELD_MARKS_VIEW_BIRD_DURATION = 4000; // ms

// funny bird
const FUNNY_BIRD_LEAVE_DELAY = 8000; //ms
function getFunnyBirdDelay() {
  return 60000 + 60000 * Math.random();
}

// macaulay library spectrogram
// 250 horizontal pixels per second in raw spectrogram image
// squished by factor of 2
// 100% height = 257 pixels raw image height
const SPECTROGRAM_HORIZ_PERCENT_PER_SEC = (250 / 2) * (100 / 257);
const SPECTROGRAM_SEC_PER_IMAGE = 60;
const SPECTROGRAM_IMAGE_FETCH_BUFFER_SEC = 15;

// progress, recommendation, and grouping config

const MAX_GROUP_SIZE = 6;
const CONFUSION_EMA_FRAC = 0.9;
const PRED_ACCURACY_TARGET = 0.8; // don't make groups larger if their predicted accuracy is already below this
const MIN_INAT_CONFUSION_VALUE = 0.05;
const EXPOSURE_PROFICIENCY_THRESHOLD = 0.5; // after hit this with most common taxon, sort key switches avg taxon count not just most common taxon count (avg count will be lower = less priority)
const ACCURACY_MATTERS_PROFICIENCY_THRESHOLD = 0.5; // after hit this with the median proficiency of a group, start penalizing for low predicted accuracy when sorting
const MIN_INAT_COUNT = 1; // used when sorting taxon groups, round up any taxa counts to this
const DEFAULT_CONF = 0.25;
const WITHIN_GROUP_DEFAULT_CONF = 0.25;
const BETWEEN_GROUPS_DEFAULT_CONF = 0.05;

const N_ANSWERS_TO_STORE = 10;
// we store recent proficiency in local storage (if setting checked), this is how far back to remember
// - affects stability of proficiency measurement
// - also, when starting out, we assume that this many previous questions were all answered incorrectly
//   (so the user has to build up from 0 proficiency), so this affects how fast that can happen
