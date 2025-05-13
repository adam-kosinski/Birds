async function getIPLocation() {
  const ipRes = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipRes.json();
  const ip = ipData.ip;

  const geoRes = await fetch(`https://ip-api.com/json/${ip}`);
  const geoData = await geoRes.json();

  const lat = geoData.lat;
  const lng = geoData.lon;
  let name = "";

  if (geoData.city && geoData.region) {
    name = `${geoData.city}, ${geoData.region}`;
  } else if (geoData.city) {
    name = geoData.city;
  } else if (geoData.region) {
    name = geoData.region;
  } else if (lat && lng) {
    name = `${lat}, ${lng}`;
  } else {
    name = "Unknown";
  }

  return { lat, lng, name };
}

async function speciesCountsInLocation(lat, lng, taxonIds) {
  const res = await fetch(
    `https://api.inaturalist.org/v1/observations/species_counts?` +
      `lat=${lat}&lng=${lng}&radius=${SPECIES_COUNTS_RADIUS}` +
      `&taxon_id=${taxonIds.join(",")}&verifiable=true&per_page=100`
  );
  const data = await res.json();
  const counts = {};
  const readableCounts = new Map();
  data.results.forEach((obj) => {
    counts[obj.taxon.id] = obj.count;
    readableCounts.set(obj.taxon.preferred_common_name, obj.count);
  });
  console.log(readableCounts);
  return counts;
}
