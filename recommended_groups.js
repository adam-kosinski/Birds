// A confusion score conf(A, B) measures, for games with taxon A and B in play,
// the expected number of times the user will guess taxon B for a question about taxon A,
// per time that the user correctly guesses taxon A.
// So it is calculated (# B guesses / # A guesses) assuming the question is about A and both are in play.
// Note that conf(A,B) is not the same as conf(B, A)

// This method is used because it is a metric unaffected by the number of taxa in play, nor by how many
// questions were asked about each taxon.

// I would like to use an exponential moving average (EMA) to weight more recent questions more than older ones.
// So instead of storing (# B guesses) and (# A guesses), I store (# B guesses / # B or A guesses) and (# A guesses / # B or A guesses),
// allowing me to average over all guesses. Both these values range between 0 and 1, and dividing gives the same value as before.
// If they were a straight average, they should sum to 1 (so initialization should behave this way). The EMA seems to preserve this.
// If B was guessed, I EMA in a 1 to the numerator value and a 0 into the denominator.
// If A was guessed, I EMA in a 0 to the numerator value and a 1 into the denominator.
// The values are stored in local storage in the taxon data of who the question was about.

async function defaultConf(correctTaxonId, otherTaxonId) {
  // returns [numerator, denominator] for default confusion values, should add to 1
  // TODO: more sophisticated initialization based on configuration, or iNaturalist data

  // first try iNaturalist data
  const similarData = await firebaseGetSimilarSpecies(
    correctTaxonId,
    mode === "birdsong"
  );
  if (similarData) {
    const otherSpecies = similarData.similar_species.find(
      (x) => x.id === otherTaxonId
    );
    if (!otherSpecies) return [0, 1]; // not confused at all
    const correctCount = similarData.observations_count;
    let ratio = (40 * otherSpecies.count) / correctCount;
    ratio = Math.min(0.8, ratio);

    // 1-x / x = r
    // 1-x = xr
    // 1 = (1+r)x
    // 1/(1+r) = x
    const denom = 1 / (1 + ratio);
    const num = 1 - denom;
    return [num, denom];
  }

  return [0.5, 0.5]; // this matches the score values if randomly guessing
}

async function updateConfusionScore(correctId, guessedId, idsInPlay) {
  // update incorrect and correct counts using an exponential moving average

  // confusion scores are stored with the taxon who the question is about
  // load raw data because we want to access numerator and denominator
  const confusedTaxa = loadTaxonData(correctId, true).confused_taxa || {};

  if (guessedId !== correctId) {
    await applyEMA(confusedTaxa, correctId, guessedId, 1, 0);
  } else {
    // got it right, update scores for all taxa in play
    for (const id of idsInPlay) {
      if (id !== correctId) {
        await applyEMA(confusedTaxa, correctId, id, 0, 1);
      }
    }
  }

  // save to local storage
  updateTaxonConfusions(correctId, confusedTaxa);
}

async function applyEMA(confusedTaxa, correctId, otherId, numVal, denomVal) {
  // get existing num and denom values
  let num, denom;
  if (!(otherId in confusedTaxa)) {
    [num, denom] = await defaultConf(correctId, otherId);
  } else {
    [num, denom] = confusedTaxa[otherId];
  }

  // apply EMA
  num = num * CONFUSION_EMA_FRAC + numVal * (1 - CONFUSION_EMA_FRAC);
  denom = denom * CONFUSION_EMA_FRAC + denomVal * (1 - CONFUSION_EMA_FRAC);

  // update the confusedTaxa object
  confusedTaxa[otherId] = [num, denom];
}

async function makeTaxonGroups() {
  const taxonIds = list_taxa.map((obj) => obj.id);

  // load adjacency list of taxon scores {A: {B: conf(A,B), C: conf(A,C), ...}, ...}
  // note that this is asymmetric because conf(A,B) doesn't equal conf(B,A)
  // If conf(A,B) or conf(B,A) is missing from local storage, uses the default value instead.
  const adjList = {};
  for (const id of taxonIds) {
    adjList[id] = loadTaxonData(id).confused_taxa;
    // fill in default values if conf scores missing
    for (const otherId of taxonIds) {
      if (otherId !== id && !(otherId in adjList[id])) {
        const [num, denom] = await defaultConf(id, otherId);
        adjList[id][otherId] = num / denom;
      }
    }
  }
  console.log(adjList);

  // create list of edges, assign edges symmetric weights based on conf(A,B) and conf(B,A)
  const edges = [];
  for (let i = 0; i < taxonIds.length; i++) {
    for (let j = i + 1; j < taxonIds.length; j++) {
      const confAB = adjList[taxonIds[i]][taxonIds[j]];
      const confBA = adjList[taxonIds[j]][taxonIds[i]];
      edges.push({
        weight: (confAB + confBA) / 2,
        nodes: [taxonIds[i], taxonIds[j]],
      });
    }
  }

  // initialize group mappings, starting with each node in its own group
  const groupToIds = {};
  const idToGroup = {};
  for (let i = 0; i < taxonIds.length; i++) {
    const id = taxonIds[i];
    idToGroup[id] = i;
    groupToIds[i] = [id];
  }

  // iterate through edges, highest weight first, and join the groups it connects
  // unless we identify that we're not allowed to
  edges.sort((a, b) => b.weight - a.weight);
  for (const e of edges) {
    // check if not allowed to join groups because would make the group too big
    const A = idToGroup[e.nodes[0]];
    const B = idToGroup[e.nodes[1]];
    const groupA = groupToIds[A];
    const groupB = groupToIds[B];
    if (groupA.length + groupB.length > 4) continue;

    // join groups by reassigning everything in group B to group A
    groupToIds[A] = [...groupA, ...groupB];
    delete groupToIds[B];
    for (const id of groupB) {
      idToGroup[id] = A;
    }
  }

  // print out groups
  for (const g in groupToIds) {
    const groupNames = groupToIds[g].map(
      (id) => list_taxa.find((obj) => obj.id === id).preferred_common_name
    );
    console.log(groupNames);
  }

  // TODO load iNaturalist data and test this on that
  // TODO figure out what to return (might want to include info to help sort groups)
  // TODO try symmetric weight = p(wrong) for game w only A and B
  // TODO try dynamic group sizing based on p(wrong)
}

// iNaturalist fetching functions

async function fetchSimilarSpecies(taxonId, sounds = false) {
  const similarUrl = `https://api.inaturalist.org/v1/identifications/similar_species?sounds=${sounds}&taxon_id=${taxonId}`;
  const results = (await (await fetch(similarUrl)).json()).results;

  const infoToKeep = results.map((obj) => {
    return {
      id: obj.taxon.id,
      count: obj.count,
      name: obj.taxon.name,
      preferred_common_name: obj.taxon.preferred_common_name,
    };
  });
  return infoToKeep;
}

function sleep(sec) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * sec));
}

async function updateFirebaseSimilarSpecies(taxonIds, sounds = false) {
  console.log(
    "Updating firebase similar species database for " +
      taxonIds.join() +
      `, with sounds=${sounds}`
  );
  // get total number of observations for each species
  const countsUrl =
    "https://api.inaturalist.org/v1/observations/species_counts?quality_grade=research" +
    `&sounds=${sounds}&taxon_id=${taxonIds.join(",")}`;
  const results = (await (await fetch(countsUrl)).json()).results;
  const counts = {};
  results.forEach((obj) => {
    counts[obj.taxon.id] = {
      count: obj.count,
      commonName: obj.taxon.preferred_common_name,
    };
  });

  // get similar species, combine with count data to be sent to firebase
  const data = {};
  for (let taxonId of taxonIds) {
    await sleep(1); // keep iNaturalist happy
    const similarSpecies = await fetchSimilarSpecies(taxonId, sounds);
    console.log(`Got similar species for ${taxonId}`);
    data[taxonId] = {
      preferred_common_name: counts[taxonId].commonName,
      observations_count: counts[taxonId].count,
      similar_species: similarSpecies,
    };
  }

  // send to firebase
  console.log("Sending similar species to firebase");
  firebaseAddSimilarSpecies(data, sounds);
}
