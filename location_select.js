// FILE FOR STUFF INVOLVING THE LOCATION SELECT SCREEN

//globals

let place_id;
let place_bounds; //sometimes have this (or an estimate of it) but not place_id
//if both place_id and place_bounds are undefined, will use map bounds (see location_view_taxa.js)

let map;
let place_layer;
let cached_places = {}; //key = place id, value = place object from autocomplete search
let ignore_map_move_once = false; //used when setting an iNaturalist place

// iconic taxon select ----------------------------------

const iconic_taxon_select = document.getElementById("iconic-taxon-select");

iconic_taxon_select.addEventListener("change", updateSelectElementWidth);
// for back-forward cache navigation, select defaults to previous selection, want to adjust width
document.addEventListener("DOMContentLoaded", () => {
  // use set timeout so that this goes in the event queue after whatever script changes the select back to what we had before
  setTimeout(updateSelectElementWidth, 0);
});

function updateSelectElementWidth() {
  // figure out width of text using hidden element
  const hidden_p = document.getElementById("taxon-select-width-guesser");
  const selectedText = iconic_taxon_select.selectedOptions[0].textContent;
  hidden_p.textContent = selectedText;
  hidden_p.style.display = "block";
  const textWidth = hidden_p.getBoundingClientRect().width;
  hidden_p.style.display = "none";

  iconic_taxon_select.style.width = textWidth + 45 + "px";
}

//init map ----------------------------------------

map = L.map("map", {
  center: [35, -90],
  zoom: 2,
});

//zoom snap 0 for touch interaction
document.addEventListener("touchstart", () => (map.options.zoomSnap = 0), {
  once: true,
});

//basemap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

clearMapPlace(); //sets initial state to use full map

//place autocomplete / handling ----------------------------

initAutocomplete(
  "place-input",
  "place-autocomplete-list",
  () => "https://api.inaturalist.org/v1/places/autocomplete?",
  //result callback
  (obj, list_option) => {
    //to process the place, need either the bounding box, or a location and bounding box area (can estimate bounding box from that)
    if (!(obj.bounding_box_geojson || (obj.location && obj.bbox_area))) {
      return false;
    }
    list_option.textContent = obj.display_name;
    list_option.dataset.placeId = obj.id;
    cached_places[obj.id] = obj; //so don't have to refetch geometry when select
  },
  //select callback
  (list_option) => {
    let place = cached_places[list_option.dataset.placeId];
    console.log("selected place", place);
    setMapPlace(place);
    cached_places = {}; // we're clearing the autocomplete list, so don't need these anymore
  }
);

//map UI stuff for showing selected place --------------------------------------------

function setMapPlace(place) {
  //place is a place obj from iNaturalist

  clearMapPlace();

  document.getElementById("map-caption").textContent = place.display_name;
  document.getElementById("map-container").classList.remove("outlined");
  document.getElementById("pan-zoom-instructions").style.display = "none";
  document.getElementById("clear-place-selection").style.display = "block";

  //zoom to place bounds
  let bounds;
  if (place.bounding_box_geojson) {
    //fix coords if crossing the antimeridian
    let coords = place.bounding_box_geojson.coordinates[0]; //array of [lng, lat]
    if (coords[1][0] > coords[2][0]) {
      //shouldn't be the case, index 1 -> 2 is going east (increasing longitude) by iNaturalist convention
      coords[2][0] += 360;
      coords[3][0] += 360;
    }
    bounds = L.geoJSON(place.bounding_box_geojson).getBounds();
  } else {
    //use center and bbox area (units of degrees^2) to approx bounding box as a square
    //center and area are guaranteed to be defined at this point, we filtered the rest out of the autocomplete list
    let center = place.location.split(",").map((s) => Number(s));
    let side = Math.sqrt(place.bbox_area);
    bounds = L.latLngBounds(
      [center[0] + 0.5 * side, center[1] + 0.5 * side], //ne
      [center[0] - 0.5 * side, center[1] - 0.5 * side] //sw
    );
    place_layer = L.rectangle(bounds, PLACE_STYLE).addTo(map);
  }
  place_bounds = bounds;
  map.fitBounds(bounds.pad(0.1));

  //draw place outline if exists, check for bounding box geojson b/c need that for correct +360 longitude correction to have been done earlier
  if (place.geometry_geojson && place.bounding_box_geojson) {
    //only set place id if it's an actual region (aka has geometry)
    place_id = place.id;

    //fix geometry if needed so it is all within the correct bounds
    if (
      !bounds.pad(0.1).contains(L.geoJSON(place.geometry_geojson).getBounds())
    ) {
      const fixPolygon = function (polygon) {
        let padded = bounds.pad(0.01);
        polygon[0].forEach((coord) => {
          if (!padded.contains([coord[1], coord[0]])) {
            //longitude comes first
            coord[0] += 360;
          }
        });
      };

      if (place.geometry_geojson.type === "Polygon") {
        fixPolygon(place.geometry_geojson.coordinates);
      } else if (place.geometry_geojson.type === "MultiPolygon") {
        place.geometry_geojson.coordinates.forEach((polygon) =>
          fixPolygon(polygon)
        );
      } else {
        throw new Error(
          "Could not read geometry geojson, not of type Polygon or MultiPolygon"
        );
      }
    }

    //add geometry to map
    place_layer = L.geoJSON(place.geometry_geojson, {
      style: PLACE_STYLE,
      attribution:
        '<a href="https://api.inaturalist.org/v1/docs/#!/Places/get_places_autocomplete">iNaturalist Data</a>',
    }).addTo(map);
  }
}

function clearMapPlace() {
  place_id = undefined;
  place_bounds = undefined;

  if (place_layer) {
    place_layer.remove();
    place_layer = undefined;
  }

  document.getElementById("map-container").classList.add("outlined");
  document.getElementById("map-caption").textContent =
    "Using Area Shown in Map";
  document.getElementById("pan-zoom-instructions").style.display = "block";
  document.getElementById("clear-place-selection").style.display = "none";
}

document
  .getElementById("clear-place-selection")
  .addEventListener("click", clearMapPlace);
