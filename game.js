let kill_fetch_until_threshold = []; //when fetchUntilThreshold is called, it appends "false", and kills itself if the "false" at that index gets changed to "true"
//this is used when exiting a game, to stop the fetchUntilThreshold from continuing to run


//STATE VARIABLES - get reset when we go back to list (see game_events.js)

let taxon_obs = {}; //stores lists of objects, organized by taxon id keys
let taxon_queues = {}; //stores lists of observation objects for each taxon in order of showing, pop from beginning of list to show and refill if empty
let taxon_bag = []; //list of unordered taxon ids, perhaps each id in here multiple times, pick a random item to determine next taxon to show
let rejected_ids = []; //list of observation ids that we didn't like (because missing audio, might add other reasons in future), these will not be fetched
let bad_ids = {}; // object (taxon_id: [array of iNaturalist ids]) that records ids that were skipped before or are otherwise bad (e.g. missing audio). This coordinates w firebase
let bad_ids_to_add = {}; // Same format as bad_ids, but stuff to add to firebase. As ids are sent to firebase, they get removed from this

let n_pages_by_query = {}; //cache for total results queries, key is args string '?sounds=true' etc, value is n pages
//not super useful but hey why not, doesn't hurt

let current; //current observation object
let next; //helpful for preloading

const audio_preloader = new Audio();
audio_preloader.addEventListener("loadedmetadata", checkNextAudioDuration);

let game_state;
const INACTIVE = 0;
const GUESSING = 1;
const ANSWER_SHOWN = 2;
setGameState(INACTIVE);

let mode = "birdsong"; // or "visual_id"

let funny_bird_timeout_id;

let already_notified_full_progress_bar = false;




function setGameState(state) {
    game_state = state;
    document.getElementById("birdsong-main").dataset.gameState = state;
}

function setMode(new_mode) {
    //update HTML and JS
    document.querySelectorAll("#mode-toggle button").forEach(el => el.classList.remove("selected"));
    document.querySelector("[data-mode=" + new_mode + "]").classList.add("selected");
    mode = new_mode;
    document.getElementById("birdsong-main").dataset.mode = mode;
    document.getElementById("bird-image").style.cursor = new_mode == "visual_id" ? "zoom-in" : "default";

    //update links
    document.querySelectorAll("#bird-list a").forEach(a => {
        let container = a.closest(".bird-list-item");
        let taxon_id = Number(container.dataset.taxonId);
        let taxon_obj = bird_taxa.find(obj => obj.id == taxon_id);
        a.href = getInfoURL(taxon_obj);
    });

    //update URL
    setURLParam("mode", mode);

    //update proficiency display
    bird_taxa.forEach(obj => {
        refreshTaxonProficiencyDisplay(obj.id, new_mode);
    });

    //update auto-selection if setting is enabled
    if (loadBooleanSetting("auto-select-recommended", false)) {
        selectRecommended();
    }
}

function markAsBadId(taxon_id, id){
    if(!(taxon_id in bad_ids)) bad_ids[taxon_id] = [];
    bad_ids[taxon_id].push(id);
    bad_ids[taxon_id].dirty = true; // so we know we changed something
}


// try a different observation if the audio is too long

let n_short_audio_retries_left = MAX_SHORT_AUDIO_RETRIES;
setInterval(function () {
    n_short_audio_retries_left = Math.min(n_short_audio_retries_left + 1, MAX_SHORT_AUDIO_RETRIES);
}, TIME_TO_REPLENISH_A_SHORT_AUDIO_RETRY);

function checkNextAudioDuration(e) {
    // this is an event handler for when the next observation's audio's metadata loads
    // if the audio is too long, try again
    if (audio_preloader.duration <= MAX_PREFERRED_AUDIO_DURATION) return;
    if (n_short_audio_retries_left > 0) {
        console.log(`next audio too long (${audio_preloader.duration}s > ${MAX_PREFERRED_AUDIO_DURATION}s) retrying`);
        next = pickObservation();
        audio_preloader.src = next.sounds[0].file_url;
        n_short_audio_retries_left--;
    }
    else {
        console.log("ran out of retries to pick a shorter audio clip");
    }
}



function pickObservation() {
    //pick next observation object, return it. Try not to duplicate the current observation
    //use the taxon_queues to ensure each observation gets a chance to be seen before recycling

    //squirrel intruder
    if (mode == "birdsong" && Math.random() < SQUIRREL_PROBABILITY) {
        return squirrel_obs[Math.floor(Math.random() * squirrel_obs.length)]
    }

    //filter to get taxa we currently have observations for
    let filtered_taxon_bag = taxon_bag.filter(id => taxon_obs[id].length > 0);
    if (filtered_taxon_bag.length == 0) {
        console.error("No observations found, cannot pick one");
        return;
    }

    //try a bunch of times to not duplicate the current observation
    let picked;
    for (let i = 0; i < 5; i++) {
        //draw from taxon bag, taxa are weighted differently in there depending on how good the player is doing
        let next_taxon_id = filtered_taxon_bag[Math.floor(filtered_taxon_bag.length * Math.random())];

        //take a random observation from our available ones for that taxon
        picked = taxon_queues[next_taxon_id].shift();
        if (taxon_queues[next_taxon_id].length == 0) resetQueue(next_taxon_id); //refill queue if it emptied
        if (picked != current) return picked;
    }
    return picked;
}


function resetQueue(taxon_id) {
    let queue = taxon_queues[taxon_id]
    taxon_obs[taxon_id].forEach(obj => {
        let insert_idx = Math.floor((queue.length + 1) * Math.random());
        queue.splice(insert_idx, 0, obj);
    });
}




async function initGame() {
    console.log("\nINIT GAME ============================\n\n");

    //start loader
    document.getElementById("bird-list-loader").style.display = "block";

    //get taxa_to_use
    taxa_to_use = Array.from(document.querySelectorAll("#bird-list .selected")).map(el => {
        let id = el.dataset.taxonId;
        return bird_taxa.find(obj => obj.id == id);
    });
    if (taxa_to_use.length == 0) taxa_to_use = bird_taxa;
    console.log("taxa to use", taxa_to_use)

    //init taxon_obs, taxon_queues, taxon bag
    taxon_obs = {}; //clear it in case last init failed and this isn't empty
    taxa_to_use.forEach(obj => {
        taxon_obs[obj.id] = [];
        taxon_queues[obj.id] = [];
        // determine how many to add to taxon bag, based on previous proficiency
        // should range from 2 to START_TAXON_BAG_COPIES (never 1 b/c we don't want them to start at full proficiency meter)
        const n_copies = Math.ceil(2 + (START_TAXON_BAG_COPIES - 2) * (1 - loadTaxonData(obj.id, mode).proficiency));
        console.log(obj.preferred_common_name, n_copies)
        // add to taxon_bag
        for (let i = 0; i < n_copies; i++) {
            taxon_bag.push(obj.id);
        }
    });
    updateProgressBar();

    // get bad observations (do before initial fetch, b/c fetchObservationData() can add to bad_ids)
    bad_ids = await getBadIds(taxa_to_use.map(obj => obj.id), mode);

    // get initial data
    const data_was_fetched = await fetchObservationData(undefined, mode == "birdsong" ? "photos=false" : "", INITIAL_PER_PAGE)
    if (!data_was_fetched) {
        alert("Failed to find research grade iNaturalist observations for any of the chosen birds. Please try again with different birds.");
        document.getElementById("bird-list-loader").style.display = "none";
        setGameState(INACTIVE);
        return;
    }

    //populate bird grid
    let bird_grid = document.getElementById("bird-grid");
    //clear previous grid
    bird_grid.querySelectorAll(".bird-grid-option:not(#other-option").forEach(el => {
        el.parentElement.removeChild(el);
    });
    //add taxa
    taxa_to_use.forEach(obj => {
        //HTML
        let button = document.createElement("button");
        button.className = "bird-grid-option";
        button.dataset.commonName = obj.preferred_common_name;
        if (obj.default_photo) button.style.backgroundImage = "url('" + obj.default_photo.square_url + "')";
        bird_grid.append(button);

        //datalist - only include scientific option if taxon isn't a species, OR if taxon is a plant
        let option_common = document.createElement("option");
        option_common.value = obj.preferred_common_name;
        document.getElementById("guess-datalist").append(option_common);
        if (obj.rank != "species" || obj.ancestor_ids.includes(47126)) {
            let option_scientific = document.createElement("option");
            option_scientific.value = obj.name;
            document.getElementById("guess-datalist").append(option_scientific);
        }
    });

    //switch screens and stop loader
    //if visual id, delay starting until the image is loaded
    if (mode == "visual_id") {
        document.getElementById("bird-image").addEventListener("load", () => {
            document.getElementById("list-screen").style.display = "none";
            document.getElementById("game-screen").style.display = "block";
            document.getElementById("bird-list-loader").style.display = "none";
        }, { once: true });
    }
    else {
        //do it immediately
        document.getElementById("list-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        document.getElementById("bird-list-loader").style.display = "none";
    }

    next = pickObservation();
    nextObservation(); //sets game_state FYI, but was already set in the event listener

    //funny bird
    scheduleFunnyBird();

    //fetch the rest more slowly (limit to < 1 API call per sec)
    //each attempt usually makes 2 API calls (n pages, and data), pace it slower than 1 API call / sec
    const result = await fetchUntilThreshold(N_OBS_PER_TAXON, 3000)
    //if some taxa had no observations at all, alert the user
    if (!result.success && result.failure_reason == "not_enough_observations") {
        let no_obs_ids = result.lacking_ids.filter(id => taxon_obs[id].length == 0);
        if (no_obs_ids.length == 0) return;

        let failed_names = no_obs_ids.map(id_str => {
            return bird_taxa.find(obj => obj.id == Number(id_str)).preferred_common_name;
        });
        alert("Failed to find research grade iNaturalist observations for " + failed_names.join(", ") + ". This doesn't break anything, just no questions will be about these birds.");
    }
}


function searchAncestorsForTaxonId(obj) {
    //since observations can come from children of a taxon, try each ancestry level one by one, starting w most specific
    let ancestor_ids = obj.taxon.ancestor_ids.slice();
    while (ancestor_ids.length > 0) {
        let id = ancestor_ids.pop(); //end of list is most specific taxon, starting with observation's taxon id
        if (taxon_obs.hasOwnProperty(id)) {
            return id;
        }
    }
}



async function fetchObservationData(taxa_ids = undefined, extra_args = "", per_page = undefined) {
    //returns a promise (b/c async) that fulfills when data has been fetched and added to data structures
    //the promise resolves to true if data was fetched, false if there was no data to fetch
    //audio missing a url will be filtered out
    //long audio will be filtered out, but at least one audio will always be let through even if long, to not break other code

    if (!taxa_ids) {
        taxa_ids = taxa_to_use.map(obj => obj.id);
    }
    if (!per_page) {
        //don't try to fetch with a big per page if realistically we don't need that many observations
        let n_obs_needed_ish = taxa_ids.length * N_OBS_PER_TAXON;
        per_page = Math.min(DEFAULT_PER_PAGE, 3 * n_obs_needed_ish);
    }
    const taxa_id_string = taxa_ids.join(",");

    console.groupCollapsed("FETCH " + taxa_id_string + "\nExtra args: " + extra_args);

    //figure out which observations (of the requested taxa) we have already so we don't repeat
    let obs_ids_we_have = [];
    for (let taxon_id in taxon_obs) {
        if (taxa_id_string.includes(taxon_id)) {
            let obs_ids_we_have_for_taxon = taxon_obs[taxon_id].map(obj => obj.id);
            obs_ids_we_have = obs_ids_we_have.concat(obs_ids_we_have_for_taxon); //appending
        }
    }
    let obs_ids_to_not_fetch = obs_ids_we_have.concat(rejected_ids);

    //prep API calls
    let prefix = "https://api.inaturalist.org/v1/observations";
    let args = "?" + extra_args + "&" + (mode == "birdsong" ? "sounds=true" : "photos=true") + (place_id ? "&place_id=" + place_id : "")
        + "&" + (mode == "birdsong" ? "sound_license=cc-by,cc-by-nc,cc-by-nd,cc-by-sa,cc-by-nc-nd,cc-by-nc-sa,cc0" : "photo_licensed=true")
        + "&quality_grade=research&taxon_id=" + taxa_id_string + "&not_id=" + obs_ids_to_not_fetch.join(",");
    console.log(prefix + args);

    //figure out how many pages we're dealing with if we don't know -------------------

    console.log("Querying to determine n pages")
    let n_results = await fetch(prefix + args + "&only_id=true&per_page=0")
        .then(res => res.json())
        .then(data => data.total_results);

    //n_pages * per_page must be strictly less than 10000, or iNaturalist will block
    let quotient = Math.min(n_results, 10000) / per_page;
    let n_pages = Math.ceil(quotient) * per_page < 10000 ?
        Math.ceil(quotient) : Math.floor(quotient);

    console.log(n_pages + " usable pages with per_page=" + per_page);


    //fetch data -------------------------------------------------------------------

    if (n_pages == 0) {
        console.log("n_pages is 0, skipping fetch");
        console.groupEnd();
        return false;
    }
    //get next page and fetch it
    let next_page = Math.ceil(n_pages * Math.random());
    console.log("Fetching page " + next_page);
    let data = await fetch(prefix + args + "&per_page=" + per_page + "&page=" + next_page)
        .then(res => res.json())
    console.log(data);


    //add to data structures
    for (let i = 0; i < data.results.length; i++) {
        const obj = data.results[i];

        //make sure audio has a working url (not always the case)
        if (mode == "birdsong" && !obj.sounds[0].file_url) {
            if(!current.is_squirrel_intruder) markAsBadId(obj.taxon.id, obj.id);
            continue;
        }

        let id = searchAncestorsForTaxonId(obj);
        if (taxon_obs.hasOwnProperty(id)) {   // need to check for this in case game was ended while we were fetching
            taxon_obs[id].push(obj);
        }
        if (taxon_queues.hasOwnProperty(id)) {
            taxon_queues[id].push(obj);
        }
    }
    console.log("Done adding to data structures");
    console.groupEnd();
    return true;
}




async function fetchUntilThreshold(threshold = 1, delay_between_attempts = 0) {
    //keeps fetching until each taxon in taxon_obs has at least threshold observations
    //requires taxon_obs to be initialized with taxon id keys
    //does prioritization for popular observations etc.
    //returns a promise for when we are done with this, that resolves to {success: true/false, lacking_ids:[...]}
    //delay_between_attempts (ms) is for after we've started, be less aggressive when fetching to be nice to iNaturalist

    console.log("FETCH UNTIL THRESHOLD " + threshold);

    let kill_index = kill_fetch_until_threshold.length;
    kill_fetch_until_threshold.push(false);

    let lacking_ids;
    let trying_popular = true;
    let trying_no_photos = mode == "birdsong";
    let popular_attempts = mode == "birdsong" ? BIRDSONG_POPULAR_ATTEMPTS : VISUAL_ID_POPULAR_ATTEMPTS;

    for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
        //figure out ids with less than threshold, and check if we're done
        lacking_ids = Object.keys(taxon_obs).filter(id => taxon_obs[id].length < threshold);
        if (lacking_ids.length == 0) {
            console.log("THRESHOLD OF " + threshold + " MET");
            return { success: true };
        }

        //prepare fetch
        console.log("ids w < " + threshold + " obs", lacking_ids);
        if (trying_popular && attempt > popular_attempts) {
            trying_popular = false;
            console.warn("stopped trying popular b/c attempt #" + attempt + " > " + popular_attempts);
        }
        let extra_args = [];
        if (trying_popular) extra_args.push("popular=true");
        if (trying_no_photos) extra_args.push("photos=false");

        //fetch data, handle if couldn't get any
        let was_data_fetched = await fetchObservationData(lacking_ids, extra_args.join("&"));
        if (!was_data_fetched) {
            if (trying_popular) {
                trying_popular = false;
                console.warn("stopped trying popular because no data fetched");
            }
            else if (trying_no_photos) {
                trying_no_photos = false;
                console.warn("stopped trying no photos because no data fetched");
            }
            else {
                console.log("Not enough observations to reach threshold of " + threshold + "\nTaxon ids remaining: " + lacking_ids.join(","));
                return { success: false, lacking_ids: lacking_ids, failure_reason: "not_enough_observations" };
            }
        }

        //pause for the specified duration
        await new Promise(resolve => setTimeout(resolve, delay_between_attempts));
        if (kill_fetch_until_threshold[kill_index]) {
            console.log("FETCH UNTIL THRESHOLD KILLED");
            return { success: false, lacking_ids: lacking_ids, failure_reason: "fetch_until_threshold_killed" };
        }
    }
    console.warn("Exceeded max (" + MAX_FETCH_ATTEMPTS + ") number of attempts to fetch until threshold of " + threshold + "\nTaxon ids remaining: " + lacking_ids.join(","));
    return { success: false, lacking_ids: lacking_ids, failure_reason: "exceeded_max_attempts" };
}




function nextObservation() {
    //when we load an observation, it gets copied into the 'current' global var

    current = next;
    next = pickObservation();
    console.log("current", current);

    let taxon_id = searchAncestorsForTaxonId(current);
    let taxon_obj = taxa_to_use.find(obj => obj.id == taxon_id);
    if (current.is_squirrel_intruder) {
        taxon_obj = squirrel_taxon_obj;
    }

    //set taxon HTML (not necessarily displayed yet, see scss)
    document.getElementById("answer-common-name").textContent = taxon_obj.preferred_common_name;
    document.getElementById("answer-scientific-name").textContent = taxon_obj.name;
    document.getElementById("answer-species-name-appended").textContent = taxon_obj.rank == "species" ? "" : (current.taxon.preferred_common_name ? " - " + current.taxon.preferred_common_name : "");
    document.getElementById("answer-info-link").href = getInfoURL(taxon_obj);
    document.getElementById("inat-link").href = current.uri;

    //reset HTML from answer screen
    document.getElementById("guess-input").value = "";
    document.getElementById("guess-input").readOnly = false;
    document.getElementById("bird-grid").querySelectorAll(".bird-grid-option.selected").forEach(el => {
        el.classList.remove("selected");
    });
    document.getElementById("image-attribution").classList.remove("visible");

    //game mode specific stuff

    let photo; //stored here for attribution later

    if (mode == "birdsong") {
        document.getElementById("birdsong-question").innerHTML = getQuestionHTML(mode, taxon_obj, current.is_squirrel_intruder); // see config.js

        //set answer image ahead of time so it can load
        let bird_image = document.getElementById("bird-image");
        if (current.photos && current.photos[0] && current.photos[0].license_code !== null) {
            photo = current.photos[0];
            bird_image.src = photo.url.replace("square", "medium");
        }
        else {
            if (taxon_obj.rank == "species" && taxon_obj.default_photo) {
                photo = taxon_obj.default_photo;
                bird_image.src = taxon_obj.default_photo.medium_url;
            }
            else if (current.taxon.default_photo) {
                photo = current.taxon.default_photo;
                bird_image.src = current.taxon.default_photo.medium_url;
            }
            else {
                bird_image.src = "";
            }
        }
        //audio and misc
        document.getElementById("birdsong-audio-0").src = current.sounds[0].file_url;
        let audio1 = document.getElementById("birdsong-audio-1");
        if (current.sounds[1]) {
            audio1.src = current.sounds[1].file_url;
        }
        else {
            audio1.pause();
            audio1.removeAttribute("src");
        }
        document.getElementById("bird-grid").scrollTop = 0;

        //start loading the next observation's audio
        //the event listener on the preloader will try to change the choice for 'next' if the audio is too long
        audio_preloader.src = next.sounds[0].file_url;
    }

    else if (mode == "visual_id") {
        document.getElementById("visual-id-question").innerHTML = getQuestionHTML(mode, taxon_obj); // see config.js

        document.getElementById("img-preloader").src = next.photos[0].url.replace("square", "large");
        document.getElementById("bird-image").src = current.photos[0].url.replace("square", "large");
        photo = current.photos[0];
    }


    //image attribution
    if (photo) {
        document.getElementById("image-attribution").textContent = photo.attribution;
        document.getElementById("image-copyright-type").textContent = photo.license_code == "cc0" ? "CC0" : (photo.license_code === null ? "C" : "CC");
    }

    //reset zoom (don't want it to be zoomed in by default)
    bird_image_zoom_factor = 1;
    document.getElementById("bird-image").style.transform = "initial";

    setGameState(GUESSING);
}


function checkAnswer() {
    let guess_input = document.getElementById("guess-input");
    guess_input.readOnly = true;
    guess_input.blur();
    let guess = guess_input.value;

    //find taxon object that matches the guess, if it exists
    //concat with the squirrel taxon to check for correctness of squirrel intruder
    let guess_obj = bird_taxa.concat([squirrel_taxon_obj]).find(obj =>
        guess.toLowerCase() == obj.name.toLowerCase() ||
        guess.toLowerCase() == obj.preferred_common_name.toLowerCase()
    );

    let correct = Boolean(guess_obj && (current.taxon.id == guess_obj.id || current.taxon.ancestor_ids.includes(guess_obj.id)));
    document.getElementById("birdsong-main").dataset.correct = guess.length > 0 ? correct : "no-guess"

    //update taxon picking probabilities and user data (if storing)
    //don't do anything if squirrel intruder, those are jokes
    if (!current.is_squirrel_intruder) {
        if (correct) {
            updateTaxonBag(guess_obj.id, -CORRECT_REMOVE_COPIES);
            updateTaxonProficiency(guess_obj.id, mode, true);
            updateTaxonReviewedTimestamp(guess_obj.id, mode);
        }
        else { // incorrect or skipped
            const correct_id = searchAncestorsForTaxonId(current);
            if (guess_obj) {
                // incorrect
                updateTaxonBag(guess_obj.id, INCORRECT_ADD_COPIES);
                updateTaxonBag(correct_id, INCORRECT_ADD_COPIES);
                updateTaxonProficiency(guess_obj.id, mode, false);
                updateTaxonProficiency(correct_id, mode, false);
            }
            else {
                // no guess
                updateTaxonBag(correct_id, NO_GUESS_ADD_COPIES);
            }
        }
    }

    setGameState(ANSWER_SHOWN);
}



function updateTaxonBag(taxon_id, delta) {
    let n_copies_in_bag = taxon_bag.filter(id => id == taxon_id).length;
    let target = Math.max(1, Math.min(MAX_TAXON_BAG_COPIES, n_copies_in_bag + delta))
    let true_delta = target - n_copies_in_bag;
    if (true_delta < 0) {
        for (let i = 0; i < Math.abs(true_delta); i++) {
            taxon_bag.splice(taxon_bag.indexOf(taxon_id), 1);
        }
    }
    else if (true_delta > 0) {
        for (let i = 0; i < true_delta; i++) {
            taxon_bag.push(taxon_id);
        }
    }
    // if reached one copy, this species has been passed at the current difficulty
    if (target === 1) {
        updateTaxonDifficultyAchieved(taxon_id, mode, taxa_to_use.length);
    }

    updateProgressBar();
}


function updateProgressBar() {
    // update proficiency progress bar, which is based on the taxon bag
    const progress_bar = document.getElementById("game-progress");
    // for each taxon, count how many copies have been removed from the taxon bag compared to the start
    // if there are more copies of a taxon in the bag than we started with, consider this having removed 0 copies
    // 100% progress = max copies removed (only 1 of each taxon remains)
    const removed_counts = {};
    taxon_bag.forEach(id => {
        if (!(id in removed_counts)) removed_counts[id] = START_TAXON_BAG_COPIES; // if haven't seen any yet, assume all removed
        removed_counts[id] = Math.max(0, removed_counts[id] - 1);
    });
    const n_taxa = Object.keys(removed_counts).length;
    if (n_taxa > 0) {  // avoid divide by 0
        const max_possible_removed = n_taxa * (START_TAXON_BAG_COPIES - 1);
        let total_removed = 0;
        Object.values(removed_counts).forEach(count => total_removed += count);
        const progress_value = total_removed / max_possible_removed;
        progress_bar.value = progress_value;

        if (progress_value === 1 && !already_notified_full_progress_bar) {
            already_notified_full_progress_bar = true;
            setTimeout(() => alert("Wow, you're doing amazing at this! Consider trying a different set of species, since you seem to have this set down?"), 300);
        }
    }
}



function scheduleFunnyBird() {
    funny_bird = document.getElementById("funny-bird");
    if (funny_bird.dataset.clicked) return;

    //set next location
    let locations = ["from-top", "from-left", "from-bottom"];
    let location = locations[Math.floor(Math.random() * locations.length)];
    funny_bird.classList.remove("enable-transition");
    locations.forEach(s => funny_bird.classList.remove(s));
    funny_bird.classList.add(location);

    //schedule when it gets shown
    funny_bird_timeout_id = setTimeout(() => {
        funny_bird.classList.add("enable-transition", "out");

        //hide the bird after a certain duration
        setTimeout(() => {
            funny_bird.classList.remove("out");
            funny_bird.addEventListener("transitionend", scheduleFunnyBird, { once: true });
        }, FUNNY_BIRD_LEAVE_DELAY);

    }, getFunnyBirdDelay());
}


// for debugging / testing
function instaSucceed() {
    while (taxon_bag.length > taxa_to_use.length) {
        const guess_input = document.getElementById("guess-input");
        guess_input.value = current.taxon.preferred_common_name;
        checkAnswer();
        nextObservation();
    }
}