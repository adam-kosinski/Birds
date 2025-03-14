// eBirdCalls global const is in the bird_calls_prep subfolder, generated by python

function loadEBirdCalls(taxa_ids) {
  // set taxon_obs
  const filteredEntries = Object.entries(eBirdCalls).filter(
    ([taxon_id, obs_list]) => taxa_ids.includes(Number(taxon_id))
  );
  taxon_obs = Object.fromEntries(filteredEntries);

  // make sure all taxa have keys
  const taxaWithoutData = [];
  for (const id of taxa_ids) {
    if (!(id in taxon_obs)) {
      taxaWithoutData.push(id);
      taxon_obs[id] = [];
    }
  }

  // fill in taxon object information
  const taxonObjects = Object.fromEntries(
    list_taxa.map((obj) => [obj.id, JSON.parse(JSON.stringify(obj))])
  );
  // need to add the species taxa level to ancestor ids b/c we're using the main taxon object,
  // not the taxon object that iNaturalist usually attaches to observations
  for (const obj of Object.values(taxonObjects)) {
    obj.ancestor_ids.push(obj.id);
  }
  // assign taxon objects appropriately
  for (const obs_list of Object.values(taxon_obs)) {
    for (const obs of obs_list) {
      obs.taxon = taxonObjects[obs.taxon_id];
    }
  }

  // set taxon_queues
  for (const taxon_id in taxon_obs) {
    taxon_queues[taxon_id] = [];
    resetQueue(taxon_id);
  }

  // warn the user about taxa without data
  const failedNames = taxaWithoutData.map(
    (id) => taxonObjects[id].preferred_common_name
  );
  if (failedNames.length > 0) {
    alert(
      "No bird call data is available for: " +
        failedNames.join(", ") +
        ". This doesn't break anything, just no questions will be about these species."
    );
  }
}
