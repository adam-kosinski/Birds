const taxa = [
  9083, 144814, 7513, 13632, 8021, 18205, 9424, 12727, 14886, 8229, 792988,
  3454, 12942, 145310, 199840, 9135, 14801, 17008, 14850, 18236, 9744, 10227,
  9602, 14995, 9184, 10094, 145245, 1289388, 9100, 145244, 14825, 13858, 14898,
  19893,
];

async function getCounts(taxa) {
  const url = `https://api.inaturalist.org/v1/observations/species_counts?taxon_id=${taxa.join(
    ","
  )}&quality_grade=research`;
  const results = (await (await fetch(url)).json()).results;
  const counts = {};
  results.forEach((obj) => {
    counts[obj.taxon.id] = obj.count;
  });
  console.log(counts);
  return counts;
}

async function getEdges(taxonId, correctCounts) {
  console.log(taxonId);
  const similarUrl = `https://api.inaturalist.org/v1/identifications/similar_species?taxon_id=${taxonId}`;
  const similarResults = (await (await fetch(similarUrl)).json()).results;

  const row = new Array(taxa.length).fill(0);
  similarResults.forEach((obj) => {
    const id = Number(obj.taxon.id);
    if (taxa.includes(id)) {
      const i = taxa.indexOf(id);
      row[i] = obj.count / (obj.count + correctCounts[obj.taxon.id]);
    }
  });
  return row;
}

async function main() {
  const counts = await getCounts(taxa);
  const adjMatrix = [];
  for (const taxonId of taxa) {
    adjMatrix.push(await getEdges(taxonId, counts));
  }
  console.log(adjMatrix);
}

main();
