//movement between screens
document.getElementById("start-game-button").addEventListener("click", () => {
    document.getElementById("add-bird-input").value = "";
    game_state = GUESSING; //prevent adding or removing birds
    initBirdsongGame();
});

document.getElementById("back-to-list").addEventListener("click", () => {
    //don't keep playing the birdsong
    document.getElementById("birdsong-audio-0").pause();
    document.getElementById("birdsong-audio-1").pause();

    //change screens
    document.getElementById("list-screen").style.display = "flex";
    document.getElementById("birdsong-screen").style.display = "none";

    //reset vars
    obs = [];
    taxon_obs = {};
    n_pages_by_query = {};
    current = undefined;
    game_state = INACTIVE;

    //reset datalist
    document.getElementById("guess-datalist").innerHTML = "";
});

//save list
document.getElementById("save-list").addEventListener("click", () => {
    alert("The current bird list is encoded in the URL. To save this list, copy the URL and save it somewhere. Visiting this URL will load this bird list.");
});


//bird selection
let bird_grid = document.getElementById("bird-grid");
bird_grid.addEventListener("click", (e) => {

    let bird_grid_option = e.target.closest(".bird-grid-option");
    if (bird_grid_option) {
        let originally_selected = bird_grid_option.classList.contains("selected");
        bird_grid.querySelectorAll(".bird-grid-option.selected").forEach(el => {
            el.classList.remove("selected");
        });
        if (!originally_selected) bird_grid_option.classList.add("selected");

        //update text input
        document.getElementById("guess-input").value = originally_selected ? "" : bird_grid_option.dataset.commonName;
    }
});


//keypress handling
document.addEventListener("keypress", (e) => {

    if (e.key == "Enter") {
        if (game_state === GUESSING) {
            checkAnswer();
        }
        else if (game_state === ANSWER_SHOWN) {
            nextObservation();
        }
    }

    //if typed a single letter, focus the guess input (avoid stuff like space or the Enter key)
    if (/^[a-zA-Z]$/.test(e.key) && getComputedStyle(document.getElementById("birdsong-screen")).display == "block") {
        document.getElementById("guess-input").focus();
    }
});


//check answer
document.getElementById("guess-button").addEventListener("click", checkAnswer);

//next observation
document.getElementById("correct-button").addEventListener("click", nextObservation);
document.getElementById("incorrect-button").addEventListener("click", nextObservation);


//autoplay second audio when first finishes
document.getElementById("birdsong-audio-0").addEventListener("ended", () => {
    let audio1 = document.getElementById("birdsong-audio-1");
    if (audio1.hasAttribute("src")) {
        audio1.play();
    }
});



//range map

let range_map = L.map("range-map"); //only init once or will get an error
let range_layer;
let grid_layer;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(range_map);

document.addEventListener("click", e => {
    if (!e.target.classList.contains("range-map-icon")) return;

    document.getElementById("range-map-taxon-image").src = e.target.dataset.imageUrl;
    document.getElementById("range-map-common-name").textContent = e.target.dataset.commonName;
    document.getElementById("range-map-scientific-name").textContent = e.target.dataset.scientificName;

    document.getElementById("range-map-modal").style.display = "flex"; //seems useful to do this before leaflet stuff

    grid_layer = L.tileLayer('https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=' + e.target.dataset.id + '&quality_grade=research&mappable=true').addTo(range_map);
    // range_layer = L.tileLayer('https://api.inaturalist.org/v1/taxon_ranges/' + e.target.dataset.id + '/{z}/{x}/{y}.png').addTo(range_map);

    // set zoom and center based on observation extent, method based on https://jumear.github.io/stirfry/iNat_map.html
    //use out of range query if it returns bounds, else use the mappable query which should always (?) return bounds
    let mappable_bounds = fetch("https://api.inaturalist.org/v1/observations?taxon_id=" + e.target.dataset.id + "&quality_grade=research&mappable=true&return_bounds=true&per_page=0")
        .then(res => res.json())
        .then(data => data.total_bounds);
    let out_of_range_bounds = fetch("https://api.inaturalist.org/v1/observations?taxon_id=" + e.target.dataset.id + "&quality_grade=research&out_of_range=false&return_bounds=true&per_page=0")
        .then(res => res.json())
        .then(data => data.total_bounds);

    Promise.all([mappable_bounds, out_of_range_bounds])
        .then(boxes => {
            let b = boxes[1] ? boxes[1] : boxes[0];
            let bounds = [[b.nelat, (b.swlng < b.nelng ? b.nelng : b.nelng + 360)], [b.swlat, b.swlng]];
            range_map.fitBounds(bounds);
        });
});

document.getElementById("close-range-map").addEventListener("click", () => {
    document.getElementById("range-map-modal").style.display = "none";
    if (grid_layer) {
        grid_layer.remove();
    }
    if (range_layer) {
        range_layer.remove();
    }
});