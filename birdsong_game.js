let kill_fetch_until_threshold = []; //when fetchUntilThreshold is called, it appends "false", and kills itself if the "false" at that index gets changed to "true"
//this is used when exiting a game, to stop the fetchUntilThreshold from continuing to run


//STATE VARIABLES - get reset when we go back to list (see game_events.js)

let taxon_obs = {}; //stores lists of objects, organized by taxon id keys
let taxon_queues = {}; //stores lists of observation objects for each taxon in order of showing, pop from beginning of list to show and refill if empty
let taxon_bag = []; //list of unordered taxon ids, perhaps each id in here multiple times, pick a random item to determine next taxon to show

let n_pages_by_query = {}; //cache for total results queries, key is args string '?sounds=true' etc, value is n pages
//not super useful but hey why not, doesn't hurt

let current; //current observation object
let next; //helpful for preloading

let game_state;
const INACTIVE = 0;
const GUESSING = 1;
const ANSWER_SHOWN = 2;
setGameState(INACTIVE);

let mode = "birdsong"; //doesn't get reset when go back to list

let funny_bird = document.getElementById("funny-bird");
let funny_bird_timeout_id;





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

    //update links
    document.querySelectorAll("#bird-list a").forEach(a => {
        let taxon_id = Number(a.dataset.taxonId);
        let taxon_obj = bird_taxa.find(obj => obj.id == taxon_id)
        a.href = getInfoURL(taxon_obj);
    });

    //update URL
    setURLParam("mode", mode);
}



function pickObservation() {
    //pick next observation object, return it. Try not to duplicate the current observation

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




function initBirdsongGame() {
    console.log("\nINIT GAME ============================\n\n");

    //start loader
    document.getElementById("bird-list-loader").style.display = "block";

    //init taxon_obs, taxon_queues, taxon bag
    taxon_obs = {}; //clear it in case last init failed and this isn't empty
    bird_taxa.forEach(obj => {
        taxon_obs[obj.id] = [];
        taxon_queues[obj.id] = [];
        for (let i = 0; i < max_taxon_bag_copies; i++) {
            taxon_bag.push(obj.id)
        }
    });


    fetchObservationData(undefined, "", initial_per_page)
        .then(data_was_fetched => {
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
            bird_taxa.forEach(obj => {
                //HTML
                let button = document.createElement("button");
                button.className = "bird-grid-option";
                button.dataset.commonName = obj.preferred_common_name;
                if (obj.default_photo) button.style.backgroundImage = "url('" + obj.default_photo.square_url + "')";
                bird_grid.append(button);

                //datalist - only include scientific option if taxon isn't a species
                let option_common = document.createElement("option");
                option_common.value = obj.preferred_common_name;
                document.getElementById("guess-datalist").append(option_common);
                if (obj.rank != "species") {
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
            fetchUntilThreshold(taxon_obs_threshold, 3000)
                .then(result => {
                    //if some taxa had no observations at all, alert the user
                    if (!result.success && result.failure_reason == "not_enough_observations") {
                        let no_obs_ids = result.lacking_ids.filter(id => taxon_obs[id].length == 0);
                        if (no_obs_ids.length == 0) return;

                        let failed_names = no_obs_ids.map(id_str => {
                            return bird_taxa.find(obj => obj.id == Number(id_str)).preferred_common_name;
                        });
                        alert("Failed to find research grade iNaturalist observations for " + failed_names.join(", ") + ". This doesn't break anything, just no questions will be about these birds.");
                    }
                })
        });
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



async function fetchObservationData(taxa_id_string = undefined, extra_args = "", per_page = undefined) {
    //returns a promise (b/c async) that fulfills when data has been fetched and added to data structures
    //the promise resolves to true if data was fetched, false if there was no data to fetch

    if (!taxa_id_string) {
        taxa_id_string = bird_taxa.map(obj => obj.id).join(",");
    }
    if (!per_page) {
        //don't try to fetch with a big per page if realistically we don't need that many observations
        let n_obs_needed_ish = taxa_id_string.split(",").length * taxon_obs_threshold;
        per_page = Math.min(default_per_page, 3 * n_obs_needed_ish);
    }

    console.groupCollapsed("FETCH " + taxa_id_string + "\nExtra args: " + extra_args);

    //figure out which observations (of the requested taxa) we have already so we don't repeat
    let obs_ids_we_have = [];
    for (let taxon_id in taxon_obs) {
        if (taxa_id_string.includes(taxon_id)) {
            let obs_ids_for_taxon = taxon_obs[taxon_id].map(obj => obj.id);
            obs_ids_we_have = obs_ids_we_have.concat(obs_ids_for_taxon);
        }
    }

    //prep API calls
    let prefix = "https://api.inaturalist.org/v1/observations";
    let args = "?" + extra_args + "&" + (mode == "birdsong" ? "sounds=true" : "photos=true") + (place_id ? "&place_id=" + place_id : "")
        + "&" + (mode == "birdsong" ? "sound_license=cc-by,cc-by-nc,cc-by-nd,cc-by-sa,cc-by-nc-nd,cc-by-nc-sa,cc0" : "photo_licensed=true")
        + "&quality_grade=research&taxon_id=" + taxa_id_string + "&not_id=" + obs_ids_we_have.join(",");
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
    data.results.forEach(obj => {
        let id = searchAncestorsForTaxonId(obj);
        taxon_obs[id].push(obj);
        taxon_queues[id].push(obj);
    });
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
    let popular_attempts = mode == "birdsong" ? birdsong_popular_attempts : visual_id_popular_attempts;

    for (let attempt = 1; attempt <= max_fetch_attempts; attempt++) {
        //figure out ids with less than threshold, and check if we're done
        lacking_ids = Object.keys(taxon_obs).filter(id => taxon_obs[id].length < threshold);
        if (lacking_ids.length == 0) {
            console.log("THRESHOLD OF " + threshold + " MET");
            return { success: true };
        }

        //prepare fetch
        console.log("ids w < " + threshold + " obs", lacking_ids);
        if (attempt > popular_attempts) {
            trying_popular = false;
            console.warn("stopped trying popular b/c attempt #" + attempt + " > " + popular_attempts);
        }
        let extra_args = trying_popular ? "popular=true" : "";

        //fetch data, handle if couldn't get any
        let was_data_fetched = await fetchObservationData(lacking_ids.join(","), extra_args);
        if (!was_data_fetched) {
            if (trying_popular) {
                trying_popular = false;
                console.warn("stopped trying popular because no data fetched");
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
    console.warn("Exceeded max (" + max_fetch_attempts + ") number of attempts to fetch until threshold of " + threshold + "\nTaxon ids remaining: " + lacking_ids.join(","));
    return { success: false, lacking_ids: lacking_ids, failure_reason: "exceeded_max_attempts" };
}




function nextObservation() {
    //when we load an observation, it gets copied into the 'current' global var

    current = next;
    next = pickObservation();
    console.log("current", current);

    let taxon_id = searchAncestorsForTaxonId(current);
    let taxon_obj = bird_taxa.find(obj => obj.id == taxon_id);

    //set taxon HTML (not necessarily displayed yet, see scss)
    document.getElementById("answer-common-name").textContent = taxon_obj.preferred_common_name;
    document.getElementById("answer-scientific-name").textContent = taxon_obj.name;
    document.getElementById("answer-species-name-appended").textContent = taxon_obj.rank == "species" ? "" : " - " + current.taxon.preferred_common_name;
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
        console.log("taxon", taxon_obj)
        let question = !taxon_obj.ancestor_ids.includes(3) ? birdsong_nonbird_question
            : taxon_obj.rank == "order" ? birdsong_question_order
                : taxon_obj.rank == "family" ? birdsong_question_family
                    : birdsong_question;
        document.getElementById("birdsong-question").innerHTML = question;

        //set answer image ahead of time so it can load
        let bird_image = document.getElementById("bird-image");
        if (current.photos && current.photos[0] && current.photos[0].license_code !== null) {
            photo = current.photos[0];
            bird_image.src = photo.url.replace("square", "medium");
        }
        else {
            if (taxon_obj.rank == "species" && taxon_obj.default_photo) {
                bird_image.src = taxon_obj.default_photo.medium_url;
            }
            else if (current.taxon.default_photo) {
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
    }
    else if (mode == "visual_id") {
        let question = !taxon_obj.ancestor_ids.includes(3) ? visual_id_nonbird_question
            : taxon_obj.rank == "order" ? visual_id_question_order
                : taxon_obj.rank == "family" ? visual_id_question_family
                    : visual_id_question;
        document.getElementById("visual-id-question").innerHTML = question;

        document.getElementById("img-preloader").src = next.photos[0].url.replace("square", "large");
        document.getElementById("bird-image").src = current.photos[0].url.replace("square", "large");
        photo = current.photos[0];
    }

    //image attribution
    if (photo) {
        document.getElementById("image-attribution").textContent = photo.attribution;
        document.getElementById("image-copyright-type").textContent = photo.license_code == "cc0" ? "CC0" : (photo.license_code === null ? "C" : "CC");
    }

    setGameState(GUESSING);
}



function checkAnswer() {
    let guess_input = document.getElementById("guess-input");
    guess_input.readOnly = true;
    guess_input.blur();
    let guess = guess_input.value;

    //find taxon object that matches the guess, if it exists
    let guess_obj = bird_taxa.find(obj =>
        guess.toLowerCase() == obj.name.toLowerCase() ||
        guess.toLowerCase() == obj.preferred_common_name.toLowerCase()
    );

    let correct = Boolean(guess_obj && current.taxon.ancestor_ids.includes(guess_obj.id));
    document.getElementById("birdsong-main").dataset.correct = guess.length > 0 ? correct : "no-guess"

    //update taxon picking probabilities
    if (correct) updateTaxonBag(guess_obj.id, -correct_remove_copies);
    else {
        if (guess_obj) updateTaxonBag(guess_obj.id, incorrect_add_copies);
        updateTaxonBag(searchAncestorsForTaxonId(current), guess.length > 0 ? incorrect_add_copies : skipped_add_copies);
    }

    setGameState(ANSWER_SHOWN);
}



function updateTaxonBag(taxon_id, delta) {
    let n_copies_in_bag = taxon_bag.filter(id => id == taxon_id).length;
    let target = Math.max(1, Math.min(max_taxon_bag_copies, n_copies_in_bag + delta))
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
}



function scheduleFunnyBird(){
    if (funny_bird.dataset.clicked) return;

    //set next location
    let locations = ["from-top", "from-left"];
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
            funny_bird.addEventListener("transitionend", scheduleFunnyBird, {once: true});
        }, funny_bird_out_duration);

    }, getFunnyBirdDelay());
}