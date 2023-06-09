let bird_taxa = []; //list of iNaturalist taxon objects that are on the practice list
let cached_bird_taxa = []; //whenever we get taxon info from autocomplete search, add it here so we don't have to make another API call to add to the list

//automatically read taxa from URL and populate the HTML and JS taxa lists
initURLTaxa();

function initURLTaxa() {
    let url = new URL(window.location.href);
    let taxa_ids = url.searchParams.get("taxa");

    //if no taxa, display message
    if (taxa_ids === null) {
        document.getElementById("bird-list-message").style.display = "block";
    }
    else {
        addBirds(taxa_ids.split(",").map(s => Number(s)));
    }
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
    document.getElementById("above-list-container").style.display = "flex";
    document.getElementById("bird-list-loader").style.display = "block";

    //update URL list, added entries will be at the end
    let args = "?taxa=" + ids_we_have.concat(ids_to_fetch).join(",");
    window.history.replaceState(null, "", args);


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

    results.forEach(obj => {

        //add to JS list
        bird_taxa.push(obj);

        //add to HTML list
        let link_container = document.createElement("a");
        link_container.id = "bird-list-" + obj.id;
        link_container.dataset.commonName = obj.preferred_common_name;
        link_container.href = getAllAboutBirdsURL(obj.preferred_common_name);
        link_container.target = "_blank";
        link_container.addEventListener("click", e => {
            if (e.target.tagName == "BUTTON") e.preventDefault(); //don't follow the link if clicking on range map etc.
        });

        let div = document.createElement("div");
        link_container.append(div);

        let birdinfo = document.createElement("div");

        let bird_square = document.createElement("img");
        bird_square.className = "bird-square";
        bird_square.src = obj.default_photo.square_url;
        bird_square.alt = "Photo of " + obj.preferred_common_name;

        let p = document.createElement("p");
        let b = document.createElement("b");
        let i = document.createElement("i");
        let br = document.createElement("br");
        b.textContent = obj.preferred_common_name;
        i.textContent = obj.name;
        p.append(b, br, i);

        birdinfo.append(bird_square, p);
        div.append(birdinfo);

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
        div.append(buttons);

        let bird_list = document.getElementById("bird-list");
        bird_list.append(link_container);
        if (results.length == 1) highlightElement(link_container);
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
        let pathname = new URL(window.location.href).pathname;
        window.history.replaceState(null, "", pathname);
    }
    else {
        let taxa_string = bird_taxa.map(obj => obj.id).join(",");
        window.history.replaceState(null, "", "?taxa=" + taxa_string);
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
    "https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=3&rank=species&is_active=true",
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
        if (!obj.preferred_common_name.includes(obj.matched_term) && !obj.name.includes(obj.matched_term)) {
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
    el.scrollIntoView({ block: "nearest" });
    el.classList.add("just-added");
    el.addEventListener("animationend", () => {
        el.classList.remove("just-added");
    }, { once: true });
}