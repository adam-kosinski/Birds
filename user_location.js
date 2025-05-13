async function getIPLocation() {
  const ipRes = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipRes.json();
  const ip = ipData.ip;

  const geoRes = await fetch(`https://ipwho.is/${ip}`);
  const geoData = await geoRes.json();

  const lat = geoData.latitude;
  const lng = geoData.longitude;
  let name = "";

  if (geoData.city && geoData.region_code) {
    name = `${geoData.city}, ${geoData.region_code}`;
  } else if (geoData.city) {
    name = geoData.city;
  } else if (geoData.region_code) {
    name = geoData.region_code;
  } else if (lat && lng) {
    name = `${lat}, ${lng}`;
  } else {
    name = "Unknown";
  }

  return { lat, lng, name };
}

async function speciesCountsInLocation(lat, lng, taxonIds) {
  const counts = {};
  const readableCounts = new Map();

  if (lat && lng) {
    const res = await fetch(
      `https://api.inaturalist.org/v1/observations/species_counts?` +
        `lat=${lat}&lng=${lng}&radius=${SPECIES_COUNTS_RADIUS}` +
        `&taxon_id=${taxonIds.join(",")}&verifiable=true&per_page=100`
    );
    const data = await res.json();
    data.results.forEach((obj) => {
      counts[obj.taxon.id] = obj.count;
      readableCounts.set(obj.taxon.preferred_common_name, obj.count);
    });
  }

  console.log("counts", readableCounts);
  return counts;
}
