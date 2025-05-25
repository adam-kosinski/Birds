let userLat;
let userLng;
let regionalSpeciesCounts = {}; // gets fetched from iNaturalist when page inits, and updates when new taxa are added

async function getIPLocation() {
  const ipRes = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipRes.json();
  const ip = ipData.ip;

  const geoRes = await fetch(`https://ipwho.is/${ip}`);
  const geoData = await geoRes.json();

  const lat = geoData.latitude;
  const lng = geoData.longitude;
  let name = undefined;

  if (geoData.city && geoData.region_code) {
    name = `${geoData.city}, ${geoData.region_code}`;
  } else if (geoData.city) {
    name = geoData.city;
  } else if (geoData.region_code) {
    name = geoData.region_code;
  }

  return [lat, lng, name];
}

async function initRegionalCounts(taxonIds) {
  let lat, lng, locationName;

  // use location from URL if we have it, otherwise use location based on IP address

  let url = new URL(window.location.href);
  lat = url.searchParams.get("lat");
  lng = url.searchParams.get("lng");
  locationName = url.searchParams.get("location_name");

  if (lat && lng) {
    lat = Number(lat);
    lng = Number(lng);
  } else {
    [lat, lng, locationName] = await getIPLocation();
    if (lat === undefined || lng === undefined) {
      console.warn("Lat or lng is undefined");
      return;
    }
  }
  console.log(lat, lng, locationName);
  await updateRegionalCounts(taxonIds, lat, lng, locationName);
}

async function updateRegionalCounts(
  taxonIds,
  lat,
  lng,
  locationName = undefined
) {
  // update state
  userLat = lat;
  userLng = lng;
  setURLParam("lat", lat.toFixed(2));
  setURLParam("lng", lng.toFixed(2));
  setURLParam("location_name", locationName || "");

  // location name display
  document.getElementById("location-name").textContent =
    locationName || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;

  if (!locationName) {
    // fetch it in the background
    reverseGeocode(lat, lng).then((name) => {
      if (!name) return;
      setURLParam("location_name", name);
      document.getElementById("location-name").textContent = name;
    });
  }

  // regional species counts
  // Get most common species, store counts for individual species but also for genera, family, etc.
  // by summing individual species counts who share a genus, family, etc.
  // This way we are maximally flexible - e.g. suppose the user had "coneflowers" as a taxon but
  // then decided to also add "cutleaf coneflower" to the taxa list

  regionalSpeciesCounts = {};

  if (lat && lng) {
    const res = await fetch(
      `https://api.inaturalist.org/v1/observations/species_counts?` +
        `lat=${lat}&lng=${lng}&radius=${SPECIES_COUNTS_RADIUS}` +
        `&taxon_id=${taxonIds.join(",")}&verifiable=true&per_page=100`
    );
    const data = await res.json();
    data.results.forEach((obj) => {
      // iterate through ancestors, adding this species' count to each taxon level
      // note that obj.taxon.ancestor_ids includes the species id
      for (const id of obj.taxon.ancestor_ids) {
        if (!(id in regionalSpeciesCounts)) regionalSpeciesCounts[id] = 0;
        regionalSpeciesCounts[id] += obj.count;
      }
    });

    // check if a lot of list taxa aren't found in this location; give warning if so
    // do this after a delay so that the page will render first
    setTimeout(() => {
      const taxaNotFound = [];
      list_taxa.forEach((obj) => {
        // if above species level, it could exist but just not be very common
        // (regional counts are best-effort, not guaranteed), so don't alert the user
        // since it could be a false alert
        if (obj.rank_level > 10) return;

        if (!(roundUpIdToSpecies(obj.id) in regionalSpeciesCounts)) {
          taxaNotFound.push(obj);
        }
      });
      console.log("taxa not found in region of study", taxaNotFound);
      const nTaxaThreshold =
        FRAC_TAXA_ABSENT_WARNING_THRESHOLD * list_taxa.length;
      if (taxaNotFound.length > nTaxaThreshold) {
        alert(
          `${taxaNotFound.length} species weren't found in the chosen location. Make sure that the location reflects the area you wish to study so that common species can be determined correctly.\n\n` +
            `Not found:\n${taxaNotFound
              .map((x) => x.preferred_common_name || x.name)
              .join(", ")}`
        );
      }
    }, 1000);
  }

  console.log("Regional species counts loaded");
}

async function reverseGeocode(lat, lng) {
  // do reverse geocoding - try fetching it immediately, and if we get throttled wait a bit and try again
  let response;
  for (let i = 0; i < 3; i++) {
    response = await fetch(
      `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=6825058f1b67a097439135cvl0fb5a7`
    );
    if (response.status === 200) break;
    console.log("Geocoding request failed, waiting and trying again");
    await sleep(1.5);
  }
  if (response.status !== 200) return;

  const data = await response.json();
  if (data.error) return;

  const address = data.address;
  console.log(data);

  let first = address.city || address.county || address.province || "";
  let second = "";
  if (address.country === "United States") {
    if (address.state in STATE_ABBREVIATIONS) {
      second = STATE_ABBREVIATIONS[address.state];
    } else {
      second = address.state;
    }
  } else second = address.country;

  return first + ", " + second;
}

const STATE_ABBREVIATIONS = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AZ",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

// LOCATION MAP -----------------------------------------------------------------

// only init once or will get an error
const locationMap = L.map("location-map");

// set up circle radius for region to study
const defaultLatLng = [36, -79];
const locationCircle = L.circle(defaultLatLng, {
  radius: SPECIES_COUNTS_RADIUS * 1000, // meters
  ...PLACE_STYLE,
}).addTo(locationMap);

// put marker at center of circle
const circleCenterMarker = L.marker(defaultLatLng).addTo(locationMap);

// keep it centered
locationMap.on("move", () => {
  locationCircle.setLatLng(locationMap.getCenter());
  circleCenterMarker.setLatLng(locationMap.getCenter());
});

// zoom snap 0 for touch interaction
document.addEventListener(
  "touchstart",
  () => (locationMap.options.zoomSnap = 0),
  { once: true }
);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 12,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(locationMap);

document.getElementById("location-map-button").addEventListener("click", () => {
  document.getElementById("location-map-modal").style.display = "flex";

  locationMap.setView([userLat, userLng], locationMap.getZoom() || 6); // set decent default zoom
  locationCircle.setLatLng([userLat, userLng]);
  circleCenterMarker.setLatLng([userLat, userLng]);
  // adjust bounds to fit the circle better
  locationMap.fitBounds(locationCircle.getBounds(), {
    padding: [30, 30], // padding is in px
    animate: false,
  });
});

document
  .getElementById("close-location-map")
  .addEventListener("click", async () => {
    document.getElementById("location-map-modal").style.display = "none";

    let { lat, lng } = locationMap.getCenter();
    // clamp lng to (-180, 180)
    while (lng <= -180) lng += 360;
    while (lng >= 180) lng -= 360;

    if (coordsClose(lat, userLat) && coordsClose(lng, userLng)) return;

    // update regional species counts and location name
    startListLoader();
    const taxonIds = list_taxa.map((obj) => obj.id);
    await updateRegionalCounts(taxonIds, lat, lng);
    makeTaxonGroups();
    stopListLoader();
  });

function coordsClose(a, b) {
  // a and b are either both latitudes or both longitudes
  if (Math.abs(a - b) < 0.1) return true;
  return false;
}
