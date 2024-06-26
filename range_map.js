//only init once or will get an error
let range_map = L.map("range-map");
let grid_layer;

//zoom snap 0 for touch interaction
document.addEventListener("touchstart", () => range_map.options.zoomSnap = 0, {once: true});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(range_map);

document.addEventListener("click", e => {
    if (!e.target.classList.contains("range-map-icon")) return;

    document.getElementById("range-map-taxon-image").src = e.target.dataset.imageUrl;
    document.getElementById("range-map-common-name").textContent = e.target.dataset.commonName;
    document.getElementById("range-map-scientific-name").textContent = e.target.dataset.scientificName;

    document.getElementById("range-map-modal").style.display = "flex"; //seems useful to do this before leaflet stuff

    grid_layer = L.tileLayer('https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=' + e.target.dataset.id + '&quality_grade=research&mappable=true', {
        attribution: '<a href="https://api.inaturalist.org/v1/docs/#!/Observation_Tiles/get_grid_zoom_x_y_png">iNaturalist Data</a>'
    }).addTo(range_map);

    // set zoom and center based on observation extent, method based on https://jumear.github.io/stirfry/iNat_map.html
    fetch("https://api.inaturalist.org/v1/observations?taxon_id=" + e.target.dataset.id + "&quality_grade=research&mappable=true&return_bounds=true&per_page=0")
        .then(res => res.json())
        .then(data => {
            let b = data.total_bounds;
            let bounds = [[b.nelat, (b.swlng < b.nelng ? b.nelng : b.nelng + 360)], [b.swlat, b.swlng]];
            range_map.fitBounds(bounds);
        });
});

document.getElementById("close-range-map").addEventListener("click", () => {
    document.getElementById("range-map-modal").style.display = "none";
    if (grid_layer) {
        grid_layer.remove();
    }
});