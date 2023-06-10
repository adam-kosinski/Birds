//STATE VARIABLES - get reset when we go back to list (see game_events.js)

let obs = []; //stores raw objects returned from data fetch, no ordering
let taxon_obs = {}; //stores lists of objects, organized by taxon id keys
//note that we can use .indexOf(obj) to find where one object is in the other data structure, if necessary

let n_pages_by_query = {}; //cache for total results queries, key is args string '?sounds=true' etc, value is n pages

let current; //current observation object
let next; //helpful for preloading

let game_state;
const INACTIVE = 0;
const GUESSING = 1;
const ANSWER_SHOWN = 2;
setGameState(INACTIVE);

let mode = "birdsong"; //doesn't get reset when go back to list


function setGameState(state) {
    game_state = state;
    document.getElementById("birdsong-main").dataset.gameState = state;
}

function setMode(new_mode) {
    document.querySelectorAll("#mode-toggle button").forEach(el => el.classList.remove("selected"));
    document.querySelector("[data-mode=" + new_mode + "]").classList.add("selected");
    mode = new_mode;
    document.getElementById("birdsong-main").dataset.mode = mode;

    //update links
    document.querySelectorAll("#bird-list a").forEach(a => {
        a.href = getAllAboutBirdsURL(a.dataset.commonName);
    });
}



function pickObservation() {
    //pick next observation object, return it. Try not to duplicate the current observation

    let taxon_keys = Object.keys(taxon_obs).filter(key => taxon_obs[key].length > 0);
    if (taxon_keys.length == 0) {
        console.error("No observations in bird_taxa, cannot pick one");
        return;
    }

    //try a bunch of times to not duplicate the current observation
    for (let i = 0; i < 5; i++) {
        //each taxon is roughly equal to appear
        let next_taxon = taxon_keys[Math.floor(taxon_keys.length * Math.random())];

        //take a random observation from our available ones for that taxon
        let options = taxon_obs[next_taxon];
        let picked = options[Math.floor(options.length * Math.random())];
        if (picked != current) return picked;
    }
    return picked;
}


function initBirdsongGame() {
    console.log("\nINIT GAME ============================\n\n");

    //start loader
    document.getElementById("bird-list-loader").style.display = "block";

    //init taxon_obs data structure
    taxon_obs = {}; //clear it in case last init failed and this isn't empty
    bird_taxa.forEach(obj => {
        taxon_obs[obj.id] = [];
    });

    fetchUntilThreshold(1)
        .then(result => {
            if (!result.success) {
                let failed_names = result.lacking_ids.map(id_str => {
                    return bird_taxa.find(obj => obj.id == Number(id_str)).preferred_common_name;
                });
                alert("Failed to find research grade iNaturalist sound observations for " + failed_names.join(", ") + ". Please remove from the list and try again.");
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

                let option_common = document.createElement("option");
                option_common.value = obj.preferred_common_name;
                document.getElementById("guess-datalist").append(option_common);
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

            //fetch the rest more slowly (limit to < 1 API call per sec)
            fetchUntilThreshold(taxon_obs_threshold, 3000); //each attempt usually makes 2 API calls (n pages, and data), pace it slower than 1 API call / sec
        });
}



async function fetchObservationData(taxa_id_string = undefined, extra_args = "") {
    //returns a promise (b/c async) that fulfills when data has been fetched and added to data structures
    //the promise resolves to true if data was fetched, false if there was no data to fetch

    if (!taxa_id_string) {
        taxa_id_string = bird_taxa.map(obj => obj.id).join(",");
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
    let args = "?" + extra_args + "&" + (mode == "birdsong" ? "sounds=true" : "photos=true") + "&quality_grade=research&taxon_id=" + taxa_id_string + "&not_id=" + obs_ids_we_have.join(",");
    console.log(prefix + args);

    //figure out how many pages we're dealing with if we don't know -------------------

    let n_pages = n_pages_by_query[args];

    if (n_pages === undefined) { //because wasn't in the cache
        console.log("Querying to determine n pages")
        let data = await fetch(prefix + args + "&only_id=true&per_page=0")
            .then(res => res.json());

        //n_pages * per_page must be strictly less than 10000, or iNaturalist will block
        //per_page is a global config var
        let quotient = Math.min(data.total_results, 10000) / per_page;
        n_pages = Math.ceil(quotient) * per_page < 10000 ?
            Math.ceil(quotient) : Math.floor(quotient);

        // store in the cache
        n_pages_by_query[args] = n_pages;
    }

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
    let data = await fetch(prefix + args + "&per_page=" + per_page)
        .then(res => res.json())
    console.log(data);

    //add to data structures
    obs = obs.concat(data.results);
    data.results.forEach(obj => {
        //since observations can come from children of a taxon, try each ancestry level one by one, starting w most specific
        let ancestor_ids = obj.taxon.ancestor_ids.slice();
        while (ancestor_ids.length > 0) {
            let id = ancestor_ids.pop(); //end of list is most specific taxon, starting with observation's taxon id
            if (taxon_obs.hasOwnProperty(id)) {
                taxon_obs[id].push(obj);
                break;
            }
        }
    });
    console.log("DONE adding to data structures");
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

    let lacking_ids;
    let trying_popular = true;
    let popular_attempts = mode == "birdsong" ? birdsong_popular_attempts : visual_id_popular_attempts;

    for (let attempt = 1; attempt <= max_fetch_attempts; attempt++) {
        //figure out ids with less than threshold, and check if we're done
        lacking_ids = Object.keys(taxon_obs).filter(id => taxon_obs[id].length < threshold);
        if (lacking_ids.length == 0) {
            console.log("THRESHOLD OF " + threshold + " MET");
            return { success: true, lacking_ids: lacking_ids };
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
                return { success: false, lacking_ids: lacking_ids };
            }
        }

        //pause for the specified duration
        await new Promise(resolve => setTimeout(resolve, delay_between_attempts));
    }
    console.log("Exceeded max (3) number of attempts to fetch until threshold of " + threshold + "\nTaxon ids remaining: " + lacking_ids.join(","));
    return { success: false, lacking_ids: lacking_ids };
}




function nextObservation() {
    //when we load an observation, it gets copied into the 'current' global var

    current = next;
    next = pickObservation();
    console.log("current", current);

    //set taxon HTML (not necessarily displayed yet, see scss)
    document.getElementById("answer-common-name").textContent = current.taxon.preferred_common_name;
    document.getElementById("answer-scientific-name").textContent = current.taxon.name;
    document.getElementById("answer-info-link").href = getAllAboutBirdsURL(current.taxon.preferred_common_name);
    document.getElementById("inat-link").href = current.uri;

    //reset HTML from answer screen
    document.getElementById("guess-input").value = "";
    document.getElementById("guess-input").readOnly = false;
    document.getElementById("bird-grid").querySelectorAll(".bird-grid-option.selected").forEach(el => {
        el.classList.remove("selected");
    });

    //game mode specific stuff

    if (mode == "birdsong") {
        //set answer image ahead of time so it can load
        let bird_image = document.getElementById("bird-image");
        if(current.photos && current.photos[0]){
            bird_image.src = current.photos[0].url.replace("square", "medium");
        }
        else {
            bird_image.src = current.taxon.default_photo ? current.taxon.default_photo.medium_url : "";
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
        document.getElementById("img-preloader").src = next.photos[0].url.replace("square", "medium");
        document.getElementById("bird-image").src = current.photos[0].url.replace("square", "medium");
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

    setGameState(ANSWER_SHOWN);
}