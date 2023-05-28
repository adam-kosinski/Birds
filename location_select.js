//globals

let place_id; //if undefined, will use bbox
let bbox_args; //string of URL args, matching what iNaturalist wants


//init map ----------------------------------------

let map = L.map("map", {
    zoomSnap: 0.5,
    center: [40.731, -96.416],
    zoom: 2
});

//basemap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

updateBoundingBox();


//bounding box selection ------------------------------
map.addEventListener("move", updateBoundingBox);

function updateBoundingBox(){
    console.log("update bounding box")
    let bounds = map.getBounds();
    bbox_args = `nelat=${bounds.getNorth()}&nelng=${bounds.getEast()}&swlat=${bounds.getSouth()}&swlng=${bounds.getWest()}`;
    document.getElementById("map-caption").textContent = "Using Area Shown in Map";
}


//place autocomplete / handling ----------------------------

let cached_places = {}; //key = place id, value = place object from autocomplete search

initAutocomplete(
    "place-input",
    "place-autocomplete-list",
    "location-screen",
    "https://api.inaturalist.org/v1/places/autocomplete?",
    //result callback
    (obj, list_option) => {
        list_option.textContent = obj.display_name;
        list_option.dataset.placeId = obj.id;
        cached_places[obj.id] = obj; //so don't have to refetch geometry when select
    },
    //select callback
    (list_option) => {
        let place = cached_places[list_option.dataset.placeId];
        console.log(list_option, place);

        document.getElementById("map-caption").textContent = place.display_name;

        cached_places = {}; // we're clearing the autocomplete list, so don't need these anymore
    }
)