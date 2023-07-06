let bird_taxa = []; //list of iNaturalist taxon objects that are on the practice list
let taxa_to_use = []; //subset of bird_taxa being used this game, initialized at game init based on the selected birds
let cached_bird_taxa = []; //whenever we get taxon info from autocomplete search, add it here so we don't have to make another API call to add to the list
let place_id;

//automatically read taxa from URL and populate the HTML and JS taxa lists
initURLArgs();

function initURLArgs() {
    let url = new URL(window.location.href);
    let taxa_ids = url.searchParams.get("taxa");
    let default_mode = url.searchParams.get("mode");
    place_id = url.searchParams.get("place_id");

    //if no taxa, display message
    if (taxa_ids === null) document.getElementById("bird-list-message").style.display = "block";
    else addBirds(taxa_ids.split(",").map(s => Number(s)));

    if (default_mode) setMode(default_mode);
}


function setURLParam(key, value) {
    //fetch current params in case there are other params besides taxa, don't want to mess with those
    let params = new URL(window.location.href).searchParams;
    params.delete(key);
    value = String(value); //just in case
    if (value && value.length > 0) params.append(key, value);
    window.history.replaceState(null, "", "?" + params.toString().replaceAll("%2C", ",")); //technically %2C is correct but comma looks so much neater and more intuitive
}


async function addBirds(taxa_id_list) {
    if (game_state !== INACTIVE) return;

    //extract only taxon ids we don't have
    let ids_we_have = bird_taxa.map(obj => obj.id);

    let ids_to_fetch = [];
    taxa_id_list.forEach(id => {
        if (!ids_we_have.includes(id)) {
            ids_to_fetch.push(id);
        }
    });
    if (ids_to_fetch.length == 0) return;

    //clear message about no birds selected, start loader
    document.getElementById("bird-list-message").style.display = "none";
    document.getElementById("above-list-container").style.display = "grid";
    document.getElementById("bird-list-loader").style.display = "block";

    //update URL list, added entries will be at the end
    setURLParam("taxa", ids_we_have.concat(ids_to_fetch).join(","))


    // Get bird data

    let results = new Array(ids_to_fetch.length); //array of undefined, will check if array includes undefined to tell if all arrived

    // If cached and only one bird (from the autocomplete basically), use that, else ask iNaturalist
    if (ids_to_fetch.length == 1 && cached_bird_taxa.hasOwnProperty(ids_to_fetch[0])) {
        results = [cached_bird_taxa[ids_to_fetch[0]]];
    }
    else {
        //fetch 30 taxa at a time (iNaturalist limit)
        //only when they've all arrived add them to the list (so ensure same order as in id list)
        let promises = [];
        let start_idx = 0; //for indexing ids_to_fetch

        while (start_idx < ids_to_fetch.length) {
            let ids = ids_to_fetch.slice(start_idx, start_idx + 30);
            start_idx += 30;

            promises.push(fetch("https://api.inaturalist.org/v1/taxa/" + ids.join(","))
                .then(res => res.json())
                .then(data => {
                    //insert into correct location in results array
                    let offset = ids_to_fetch.indexOf(data.results[0].id);
                    for (let i = 0; i < data.results.length; i++) {
                        results[i + offset] = data.results[i];
                    }
                })
            );
        }

        await Promise.all(promises);
    }

    //get licensed default photos - this method sorta works but with inconsistent results, bird not always nicely visible
    // let copyrighted_ids = results.filter(obj => obj.default_photo && obj.default_photo.license_code === null).map(obj => obj.id);
    // console.log("copyrighted_ids", copyrighted_ids);
    // console.log(copyrighted_ids.map(id => results.find(obj => obj.id == id).preferred_common_name))

    // for (let attempt = 0; attempt < max_avoid_copyright_attempts; attempt++) {
    //     console.log("attempt", attempt)
    //     let licensed_options = await fetch("https://api.inaturalist.org/v1/observations?photos=true&photo_licensed=true&order_by=votes&quality_grade=research&taxon_id=" + copyrighted_ids.join(","))
    //         .then(res => res.json())
    //         .then(data => data.results);

    //     console.log(licensed_options)

    //     for (let k = 0; k < copyrighted_ids.length; k++) {
    //         let id = copyrighted_ids[k];
    //         let match = licensed_options.find(obj => obj.taxon.id == id);
    //         if (!match) continue;

    //         let photo = match.photos[0];
    //         photo.medium_url = photo.url.replace("square", "medium");
    //         photo.square_url = photo.url;
    //         results.find(obj => obj.id == id).default_photo = photo;
    //         copyrighted_ids.splice(k, 1);
    //         k--;
    //     }
    //     console.log("copyrighted_ids left", copyrighted_ids);
    //     if(copyrighted_ids.length == 0) break;
    // }


    //add taxa
    results.forEach(obj => {

        //add to JS list
        bird_taxa.push(obj);

        //add to HTML list
        // let link_container = document.createElement("a");
        
        // link_container.href = getInfoURL(obj);
        // link_container.target = "_blank";
        // link_container.addEventListener("click", e => {
        //     if (e.target.tagName == "BUTTON" || e.target.tagName == "IMG" || e.classList.contains("plus-icon")) e.preventDefault(); //don't follow the link if clicking on range map etc.
        // });

        let container = document.createElement("div");
        container.id = "bird-list-" + obj.id;
        container.className = "bird-list-item";
        container.dataset.taxonId = obj.id;
        container.dataset.rank = obj.rank;
        container.dataset.isBird = obj.ancestor_ids.includes(3);

        let birdinfo = document.createElement("div");
        birdinfo.addEventListener("click", e => {
            if (!(e.target.classList.contains("plus-sign") || e.target.classList.contains("bird-square"))) return;
            container.classList.toggle("selected");
            document.getElementById("n-selected").textContent = document.querySelectorAll("#bird-list .selected").length;
        });

        let plus_sign = document.createElement("div");
        plus_sign.className = "plus-sign";
        plus_sign.textContent = "+";

        let bird_square = document.createElement("img");
        bird_square.className = "bird-square";
        if (obj.default_photo) bird_square.src = obj.default_photo.square_url;
        bird_square.alt = "Photo of " + obj.preferred_common_name;

        let link = document.createElement("a");
        link.href = getInfoURL(obj);
        link.target = "_blank";

        let b = document.createElement("b");
        let i = document.createElement("i");
        let br = document.createElement("br");
        b.textContent = obj.preferred_common_name;
        i.textContent = obj.name;
        link.append(b, br, i);

        birdinfo.append(plus_sign, bird_square, link);
        container.append(birdinfo);

        let buttons = document.createElement("div");

        let map_icon = document.createElement("button");
        map_icon.className = "range-map-icon";
        map_icon.dataset.id = obj.id;
        map_icon.dataset.commonName = obj.preferred_common_name;
        map_icon.dataset.scientificName = obj.name;
        map_icon.dataset.imageUrl = obj.default_photo.square_url;

        let x_button = document.createElement("button");
        x_button.className = "x-button";
        x_button.addEventListener("click", e => {
            if (confirm("Remove " + obj.preferred_common_name + " from list?")) removeBird(obj.id);
        });

        buttons.append(map_icon, x_button);
        container.append(buttons);

        let bird_list = document.getElementById("bird-list");
        bird_list.append(container);

        // if just added a bird manually (proxy check if only added one), highlight it
        if (results.length == 1) highlightElement(container);
    });

    //enable button
    document.getElementById("start-game-button").removeAttribute("disabled");

    //update count
    document.getElementById("n-species-display").textContent = bird_taxa.length;

    //stop loader
    document.getElementById("bird-list-loader").style.display = "none";
}


function removeBird(taxon_id) {
    if (game_state !== INACTIVE) return;

    //remove from HTML
    let container = document.getElementById("bird-list-" + taxon_id);
    container.parentElement.removeChild(container);

    //remove from JS
    for (let i = 0; i < bird_taxa.length; i++) {
        if (bird_taxa[i].id == taxon_id) {
            bird_taxa.splice(i, 1);
            break;
        }
    }

    //update count
    document.getElementById("n-species-display").textContent = bird_taxa.length;

    //remove from URL
    if (bird_taxa.length == 0) {
        //clear search params
        setURLParam("taxa", "");
    }
    else {
        setURLParam("taxa", bird_taxa.map(obj => obj.id).join(","));
    }

    //if no birds selected, update message and button
    if (bird_taxa.length == 0) {
        document.getElementById("bird-list-message").style.display = "block";
        document.getElementById("start-game-button").disabled = true;
        document.getElementById("above-list-container").style.display = "none";
    }
}

document.getElementById("clear-list").addEventListener("click", () => {
    if (!confirm("Are you sure you want to clear this bird list?")) return;
    while (bird_taxa.length > 0) {
        removeBird(bird_taxa[0].id);
    }
});




//autocomplete list stuff

function capitalize(str) {
    return str.replace(/^\w|\s\w|-\w/g, function (char) {
        return char.toUpperCase();
    });
}

initAutocomplete(
    "add-bird-input",
    "taxon-autocomplete-list",
    "list-screen",
    "https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=3&rank=species,family,order&is_active=true",
    //result callback
    (obj, list_option) => {
        if (!obj.default_photo || obj.observations_count == 0) return; //extinct species are sometimes returned

        cached_bird_taxa[obj.id] = obj; //add to cache for faster adding to the list

        list_option.dataset.taxonId = obj.id;

        let img = document.createElement("img");
        img.src = obj.default_photo.square_url;

        let p = document.createElement("p");
        let b = document.createElement("b");
        let br = document.createElement("br");
        let rank_label = document.createTextNode(capitalize(obj.rank) + " "); //for family or higher
        let i = document.createElement("i");
        let name_no_italics = document.createTextNode(obj.name); //for higher than family
        b.textContent = obj.preferred_common_name;
        if (!(obj.preferred_common_name && obj.preferred_common_name.includes(obj.matched_term)) && !obj.name.includes(obj.matched_term)) {
            b.textContent += " (" + obj.matched_term + ")";
        }
        i.textContent = obj.name;

        p.append(b, br);
        if (obj.rank_level >= 30) p.append(rank_label);
        obj.rank_level <= 30 ? p.append(i) : p.append(name_no_italics);


        let map_icon = document.createElement("button");
        map_icon.className = "range-map-icon";
        map_icon.dataset.id = obj.id;
        map_icon.dataset.commonName = obj.preferred_common_name;
        map_icon.dataset.scientificName = obj.name;
        map_icon.dataset.imageUrl = obj.default_photo.square_url;

        list_option.append(img, p, map_icon);
    },
    //select callback
    (list_option) => {
        let taxon_id = list_option.dataset.taxonId;
        let found_elem = document.getElementById("bird-list-" + taxon_id);

        if (found_elem) highlightElement(found_elem);
        else addBirds([Number(taxon_id)]);
    }
);



function highlightElement(el) {
    el.scrollIntoView({ block: "center" });
    el.classList.add("just-added");
    setTimeout(() => {el.classList.remove("just-added")}, 2000);
}