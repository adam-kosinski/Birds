let bird_taxa = []; //list of iNaturalist taxon objects that are on the practice list

//automatically read taxa from URL and populate the HTML and JS taxa lists
initURLTaxa();

function initURLTaxa() {
    // history.replaceState(null,"","?taxa=144814,9744,9602,12727,9721,145238,9083,3454,18236,7428,3017,8021,14850,13858,20044,792988,14801,12890,19893,13632,8229")

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





function addBirds(taxa_id_list) {

    //clear message about no birds selected
    document.getElementById("bird-list-message").style.display = "none";

    //extract only taxon ids we don't have
    let ids_we_have = bird_taxa.map(obj => obj.id);

    let ids_to_fetch = [];
    taxa_id_list.forEach(id => {
        if (!ids_we_have.includes(id)) {
            ids_to_fetch.push(id);
        }
    });
    if (ids_to_fetch.length == 0) return;

    //update URL list, added entries will be at the top so put those first
    let args = "?taxa=" + ids_to_fetch.concat(ids_we_have).join(",");
    window.history.replaceState(null, "", args);


    //fetch 30 taxa at a time (iNaturalist limit)
    //only when they've all arrived add them to the list (so ensure same order as in id list)

    let results = new Array(ids_to_fetch.length); //array of undefined, will check if array includes undefined to tell if all arrived
    let start_idx = 0; //for indexing ids_to_fetch
    document.getElementById("bird-list-loader").style.display = "block";

    while (start_idx < ids_to_fetch.length) {
        let ids = ids_to_fetch.slice(start_idx, start_idx + 30);
        start_idx += 30;

        fetch("https://api.inaturalist.org/v1/taxa/" + ids.join(","))
            .then(res => res.json())
            .then(data => {
                //insert into correct location in results array
                let offset = ids_to_fetch.indexOf(data.results[0].id);
                for (let i = 0; i < data.results.length; i++) {
                    results[i + offset] = data.results[i];
                }

                //check if we were the last one, if so process the results list
                if (!results.includes(undefined)) {

                    //insert before existing birds, but in order, use before() on the original first element to do this
                    let first_elem = document.getElementById("bird-list").firstElementChild;

                    results.forEach(obj => {

                        //add to JS list
                        bird_taxa.push(obj);

                        //add to HTML list
                        let div = document.createElement("div");
                        div.id = "bird-list-" + obj.id;

                        let birdinfo = document.createElement("div");

                        let bird_square = document.createElement("img");
                        bird_square.className = "bird-square";
                        bird_square.src = obj.default_photo.square_url;
                        bird_square.alt = "Photo of " + obj.name;

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
                        map_icon.dataset.commonName = obj.preferred_common_name;
                        map_icon.dataset.scientificName = obj.name;
                        map_icon.dataset.imageUrl = obj.default_photo.square_url;

                        let x_button = document.createElement("button");
                        x_button.className = "x-button";
                        x_button.addEventListener("click", e => {
                            removeBird(obj.id);
                        });

                        buttons.append(map_icon, x_button);
                        div.append(buttons);

                        if (first_elem) {
                            first_elem.before(div);
                        }
                        else {
                            document.getElementById("bird-list").append(div);
                        }
                    });

                    //enable button
                    document.getElementById("start-game-button").removeAttribute("disabled");

                    //stop loader
                    document.getElementById("bird-list-loader").style.display = "none";
                }

            });
    }
}


function removeBird(taxon_id) {
    //remove from HTML
    let div = document.getElementById("bird-list-" + taxon_id);
    div.parentElement.removeChild(div);

    //remove from JS
    for (let i = 0; i < bird_taxa.length; i++) {
        if (bird_taxa[i].id == taxon_id) {
            bird_taxa.splice(i, 1);
            break;
        }
    }

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
    }
}