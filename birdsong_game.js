//STATE VARIABLES - get reset when we go back to list (see game_events.js)

let obs = []; //stores raw objects returned from data fetch, no ordering
let taxon_obs = {}; //stores lists of objects, organized by taxon id keys
//note that we can use .indexOf(obj) to find where one object is in the other data structure, if necessary

let n_pages_by_query = {}; //cache for total results queries, key is args string '?sounds=true' etc, value is n pages

let current; //current observation object



function initBirdsongGame() {
    console.log("\nINIT GAME ============================\n\n");

    //start loader
    document.getElementById("bird-list-loader").style.display = "block";

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

        let img = document.createElement("img");
        img.src = obj.default_photo.square_url;
        button.append(img);
        bird_grid.append(button);

        //init taxon_obs data structure
        taxon_obs[obj.id] = [];
    });

    fetchUntilThreshold(1)
        .then(success => {
            if (!success) {
                alert("Couldn't find observations for all taxa, talk to Adam this breaks stuff");
                document.getElementById("bird-list-loader").style.display = "none";
                return;
            }

            nextObservation();

            //switch screens and stop loader
            document.getElementById("list-screen").style.display = "none";
            document.getElementById("birdsong-screen").style.display = "block";
            document.getElementById("bird-list-loader").style.display = "none";

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
    console.group("FETCH " + taxa_id_string + "\nExtra args: " + extra_args);

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
    let args = "?" + extra_args + "&sounds=true&quality_grade=research&taxon_id=" + taxa_id_string + "&not_id=" + obs_ids_we_have.join(",");
    console.log(prefix + args);

    //figure out how many pages we're dealing with if we don't know -------------------

    let n_pages = n_pages_by_query[args];

    if (n_pages === undefined) { //because wasn't in the cache
        console.log("Querying to determine n pages")
        let data = await fetch(prefix + args + "&only_id=true&per_page=1")
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
    //returns a promise for when we are done with this, that resolves to whether we succeeded at meeting the threshold (true/false)
    //delay_between_attempts (ms) is for after we've started, be less aggressive when fetching to be nice to iNaturalist

    console.log("FETCH UNTIL THRESHOLD " + threshold);

    let lacking_ids;
    let trying_popular = true;

    for (let attempt = 1; attempt <= max_fetch_attempts; attempt++) {
        //figure out ids with less than threshold, and check if we're done
        lacking_ids = Object.keys(taxon_obs).filter(id => taxon_obs[id].length < threshold);
        if (lacking_ids.length == 0) {
            console.log("THRESHOLD MET");
            return true;
        }

        //prepare fetch
        console.log("ids w < " + threshold + " obs", lacking_ids);
        if(attempt > attempts_to_try_popular) {
            trying_popular = false;
            console.warn("stopped trying popular b/c attempt #" + attempt + " > " + attempts_to_try_popular);
        }
        let extra_args = trying_popular ? "popular=true" : "";

        //fetch data, handle if couldn't get any
        let was_data_fetched = await fetchObservationData(lacking_ids.join(","), extra_args);
        if(!was_data_fetched){
            if(trying_popular) {
                trying_popular = false;
                console.warn("stopped trying popular because no data fetched");
            }
            else {
                console.log("Not enough observations to reach threshold of " + threshold + "\nTaxon ids remaining: " + lacking_ids.join(","));
                return false;
            }
        }

        //pause for the specified duration
        await new Promise(resolve => setTimeout(resolve, delay_between_attempts));
    }
    console.log("Exceeded max (3) number of attempts to fetch until threshold of " + threshold + "\nTaxon ids remaining: " + lacking_ids.join(","));
    return false;
}




function nextObservation(taxon_balancing = true) {
    //when we load an observation, it gets put into the 'current' var and removed from the data structures

    console.group("Next Observation");

    //default behavior is to do taxon_balancing - each taxon is roughly equal to appear
    let taxon_keys = Object.keys(taxon_obs);
    let next_taxon = taxon_keys[Math.floor(taxon_keys.length * Math.random())];
    console.log("Next taxon " + next_taxon);

    //take a random observation from our available ones for that taxon
    let options = taxon_obs[next_taxon];
    console.log("options", options);
    current = options[Math.floor(options.length * Math.random())];
    console.log("current", current)

    //add to HTML
    document.getElementById("inat-link").href = current.uri;
    document.getElementById("birdsong-audio-0").src = current.sounds[0].file_url;
    let audio1 = document.getElementById("birdsong-audio-1");
    if(current.sounds[1]){
        audio1.src = current.sounds[1].file_url;
        audio1.style.display = "block";
    }
    else {
        audio1.pause();
        audio1.removeAttribute("src");
        audio1.style.display = "none";
    }

    //reset HTML from answer screen
    document.getElementById("guess-input").value = "";
    document.getElementById("bird-grid").querySelectorAll(".bird-grid-option.selected").forEach(el => {
        el.classList.remove("selected");
    });
    document.getElementById("question").style.display = "block";
    document.getElementById("answer").style.display = "none";
    document.getElementById("bird-grid").style.display = "grid";
    document.getElementById("correct-button").style.display = "none";
    document.getElementById("incorrect-button").style.display = "none";
    document.getElementById("guess-button").style.display = "block";
    //TODO other resetting things

    //preload the answer image
    document.getElementById("answer-image").src = current.taxon.default_photo.medium_url;

    console.groupEnd();
}



function checkAnswer() {
    document.getElementById("guess-button").style.display = "none";
    let guess = document.getElementById("guess-input").value;

    if (guess.toLowerCase() == current.taxon.name.toLowerCase() ||
        guess.toLowerCase() == current.taxon.preferred_common_name.toLowerCase()) {
        document.getElementById("correct-button").style.display = "block";
    }
    else {
        document.getElementById("incorrect-button").style.display = "block";
    }

    //reveal taxon
    document.getElementById("answer-common-name").textContent = current.taxon.preferred_common_name;
    document.getElementById("answer-scientific-name").textContent = current.taxon.name;
    document.getElementById("question").style.display = "none";
    document.getElementById("bird-grid").style.display = "none";
    document.getElementById("answer").style.display = "flex";
}