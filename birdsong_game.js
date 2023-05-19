//STATE VARIABLES - get reset when we go back to list (see game_events.js)

let obs = []; //stores raw objects returned from data fetch, no ordering
let taxon_obs = {}; //stores lists of objects, organized by taxon id keys
//note that we can use .indexOf(obj) to find where one object is in the other data structure

let n_pages_by_query = {}; //cache for total results queries, key is args string '?sounds=true' etc, value is n pages

let current; //current observation object



function initBirdsongGame(){
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

    fetchUntilThreshold(3)
    .then(success => {
        if(!success){
            alert("Couldn't find observations for all taxa");
            document.getElementById("bird-list-loader").style.display = "none";
            return;
        }
        
        nextObservation();

        //switch screens and stop loader
        document.getElementById("list-screen").style.display = "none";
        document.getElementById("birdsong-screen").style.display = "block";
        document.getElementById("bird-list-loader").style.display = "none";
    });
}




async function fetchObservationData(taxa_id_string=undefined, extra_args=""){
    //returns a promise (b/c async) that fulfills when data has been fetched and added to data structures

    if(!taxa_id_string) {
        taxa_id_string = bird_taxa.map(obj => obj.id).join(",");
    }
    //figure out which observations (of the requested taxa) we have already so we don't repeat
    let obs_ids_we_have = [];
    for (let taxon_id in taxon_obs){
        if(taxa_id_string.includes(taxon_id)){
            let obs_ids_for_taxon = taxon_obs[taxon_id].map(obj => obj.id);
            obs_ids_we_have = obs_ids_we_have.concat(obs_ids_for_taxon);
        }
    }

    //prep API calls
    let prefix = "https://api.inaturalist.org/v1/observations";
    let args = "?" + extra_args + "&sounds=true&quality_grade=research&taxon_id=" + taxa_id_string + "&not_id=" + obs_ids_we_have.join(",");

    console.log(prefix + args);

    //figure out how many pages we're dealing with if we don't know
    //and pick a shuffled order to fetch them in
    //the promise will be instantly fulfilled and the fetch skipped if we've done this query before
    //the promise will resolve to the value of n pages
    let init_pages_promise = Promise.resolve(n_pages_by_query.hasOwnProperty(args) ? n_pages_by_query[args] : 
        fetch(prefix + args + "&only_id=true&per_page=1")
        .then(res => res.json())
        .then(data => {
            //n_pages * per_page must be strictly less than 10000, or iNaturalist will block
            //per_page is a global config var

            let quotient = Math.min(data.total_results, 10000) / per_page;
            n_pages = Math.ceil(quotient) * per_page < 10000 ?
                Math.ceil(quotient) : Math.floor(quotient);
            console.log(n_pages + " usable pages with per_page=" + per_page);

            // store and return n pages
            n_pages_by_query[args] = n_pages;
            return n_pages;
        })
    );

    let finish_promise = Promise.resolve(
        init_pages_promise.then(n_pages => {
            if(n_pages == 0){
                console.log("n_pages is 0, skipping fetch");
                return;
            }
            //get next page and fetch it
            let next_page = Math.ceil(n_pages * Math.random());

            console.log("Fetching page " + next_page);

            return fetch(prefix + args + "&per_page=" + per_page)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                obs = obs.concat(data.results);

                //now add to organized data structure
                data.results.forEach(obj => {
                    //since observations can come from children of a taxon, try each ancestry level one by one, starting w most specific
                    let ancestor_ids = obj.taxon.ancestor_ids.slice();
                    while(ancestor_ids.length > 0){
                        let id = ancestor_ids.pop(); //end of list is most specific taxon, starting with observation's taxon id
                        if(taxon_obs.hasOwnProperty(id)){
                            taxon_obs[id].push(obj);
                            break;
                        }
                    }
                });
                console.log("done adding to data structures")
            });
        })
    );

    //a calling function can use this promise to take action once data has finished being fetched
    return finish_promise;
}




function fetchUntilThreshold(threshold=1, attempt=1){
    //keeps fetching until each taxon in taxon_obs has at least threshold observations
    //requires taxon_obs to be initialized with taxon id keys
    //does prioritization for popular observations etc.
    //returns a promise for when we are done with this, that resolves to whether we succeeded at meeting the threshold (true/false)
    //attempt is a counter only used during recursive calls, for deciding when to stop or switch args

    let lacking_ids = Object.keys(taxon_obs).filter(id => taxon_obs[id].length < threshold);
    if(lacking_ids.length == 0){
        //we succeeded
        return Promise.resolve(true);
    }
    console.log("ids w < " + threshold + " obs", lacking_ids)

    if(attempt > 3){
        //TODO handle if a bird has no observations
        
        console.log("Exceeded max (3) number of attempts to fetch until threshold of " + threshold + "\nTaxon ids remaining: " + lacking_ids.join(","))
        return Promise.resolve(false); //return a fulfilled promise
    }

    return fetchObservationData(lacking_ids.join(","), "popular=true")
    .then(() => {
        return fetchUntilThreshold(threshold, lacking_ids.join(","), attempt+1);
        //we do the checks at the beginning of this function, so just call it
    });

}




function nextObservation(taxon_balancing=true){
    //when we load an observation, it gets put into the 'current' var and removed from the data structures

    console.log("Next Observation ----------------------")

    //default behavior is to do taxon_balancing - each taxon is roughly equal to appear
    let taxon_keys = Object.keys(taxon_obs);
    let next_taxon = taxon_keys[Math.floor(taxon_keys.length * Math.random())];
    console.log("Next taxon " + next_taxon);

    //take a random observation from our available ones for that taxon
    let options = taxon_obs[next_taxon];
    console.log("options", options);
    let i = Math.floor(options.length * Math.random());
    current = options.splice(i,1)[0];
    console.log("current",current)

    //remove from the flat data structure
    obs.splice(obs.indexOf(current), 1);

    //add to HTML
    document.getElementById("birdsong-audio").src = current.sounds[0].file_url;
    document.getElementById("inat-link").href = current.uri;

    //reset HTML
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


    //check if we're getting low on data and need to fetch more
    //TODO
}



function checkAnswer(){
    document.getElementById("guess-button").style.display = "none";
    let guess = document.getElementById("guess-input").value;

    if (guess.toLowerCase() == current.taxon.name.toLowerCase() ||
        guess.toLowerCase() == current.taxon.preferred_common_name.toLowerCase())
    {
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

    //TODO have answer image load when the question loads, and only become visible now
}