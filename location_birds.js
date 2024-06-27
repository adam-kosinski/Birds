// FILE FOR FETCHING BIRDS / THE BIRD SELECTION SCREEN

//switching between screens

document.getElementById("search-for-birds").addEventListener("click", e => {
    e.target.style.visibility = "hidden";
    document.getElementById("sound-only-checkbox").disabled = true;
    document.getElementById("search-loader").style.display = "block";

    fetchSpeciesCounts().then(() => {
        document.getElementById("search-loader").style.display = "none";
        document.getElementById("location-screen").style.display = "none";
        document.getElementById("bird-screen").style.display = "flex";
        document.getElementById("list").scrollTop = 0;
    });
});

document.getElementById("back-button").addEventListener("click", () => {
    document.getElementById("search-for-birds").style.visibility = "visible";
    document.getElementById("sound-only-checkbox").removeAttribute("disabled");
    document.getElementById("bird-screen").style.display = "none";
    document.getElementById("location-screen").style.display = "flex";
    map.invalidateSize(); //update sizing, since window might have been resized while the map wasn't visible
});

document.getElementById("continue-button").addEventListener("click", () => {
    let taxon_ids = [];
    document.querySelectorAll(".bird-option.selected").forEach(el => {
        taxon_ids.push(el.dataset.taxonId);
    });
    let args = "?taxa=" + taxon_ids.join(",");
    window.location = "game.html" + (taxon_ids.length > 0 ? args : "");
});



// iNaturalist API calls and list construction

async function fetchSpeciesCounts() {
    let sounds_only = document.getElementById("sound-only-checkbox").checked;
    let base_url = "https://api.inaturalist.org/v1/observations/species_counts?taxon_id=3&quality_grade=research" + (sounds_only ? "&sounds=true" : "");

    let promise;
    if (place_id) {
        promise = fetch(base_url + "&place_id=" + place_id);
    }
    else {
        let bounds = place_bounds ? place_bounds : map.getBounds();
        bbox_args = `&nelat=${bounds.getNorth()}&nelng=${bounds.getEast()}&swlat=${bounds.getSouth()}&swlng=${bounds.getWest()}`;
        promise = fetch(base_url + bbox_args);
    }

    let data = await promise.then(res => res.json());

    let list = document.getElementById("list");
    list.innerHTML = "";
    document.getElementById("species-count").textContent = data.results.length;

    for (let k = 0; k < data.results.length; k++) {
        let obj = data.results[k];

        let div = document.createElement("div");
        div.className = "bird-option";
        div.dataset.taxonId = obj.taxon.id;

        let checkbox = document.createElement("div");
        checkbox.className = "checkbox";

        if (k < TOP_N_SELECTED){
            div.classList.add("selected");
        }

        let img = document.createElement("img");
        img.className = "bird-square";
        if (obj.taxon.default_photo) img.src = obj.taxon.default_photo.square_url;
        img.alt = obj.taxon.preferred_common_name;

        let info = document.createElement("p");
        let b = document.createElement("b");
        let i = document.createElement("i");
        i.className = "font-small";
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let count = document.createElement("p");
        count.className = "font-small";
        b.textContent = (k+1) + ". " + obj.taxon.preferred_common_name;
        i.textContent = obj.taxon.name;
        count.textContent = obj.count + " observations";
        info.append(b, br1, i, br2, count);

        let map_icon = document.createElement("button");
        map_icon.className = "range-map-icon";
        map_icon.dataset.id = obj.taxon.id;
        map_icon.dataset.commonName = obj.taxon.preferred_common_name;
        map_icon.dataset.scientificName = obj.taxon.name;
        map_icon.dataset.imageUrl = img.src;

        div.append(checkbox, img, info, map_icon);
        list.append(div);
    };

    if(data.results.length == 0){
        let p = document.createElement("p");
        p.textContent = "No observations found";
        list.append(p);
    }
}



//selection event handlers

document.getElementById("list").addEventListener("click", e => {
    let bird_option = e.target.closest(".bird-option");
    if(bird_option && !e.target.classList.contains("range-map-icon")){
        bird_option.classList.toggle("selected");
        updateNSelectedDisplay()
    }
});

document.getElementById("select-all").addEventListener("click", () => {
    document.querySelectorAll(".bird-option").forEach(el => el.classList.add("selected"));
    updateNSelectedDisplay()
});

document.getElementById("select-none").addEventListener("click", () => {
    document.querySelectorAll(".bird-option").forEach(el => el.classList.remove("selected"));
    updateNSelectedDisplay()
});

function updateNSelectedDisplay(){
    document.getElementById("n-selected").textContent = document.querySelectorAll(".bird-option.selected").length;
}