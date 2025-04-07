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

function defaultConf(correctTaxonId, otherTaxonId) {
  // returns [numerator, denominator] for default confusion values, should add to 1

  // TODO use configuration (e.g. for bird calls, doesn't align w iNat confusion)

  // try iNaturalist data
  let iNatConf = iNaturalistConf(correctTaxonId, otherTaxonId);
  if (iNatConf === undefined) {
    // try conf(B, A) as an estimate when we don't have conf(A, B)
    iNatConf = iNaturalistConf(otherTaxonId, correctTaxonId);
    console.log("using flipped conf");
  }
  if (iNatConf !== undefined) {
    // get num and denom from the ratio
    // 1-x / x = ratio r
    // 1-x = xr
    // 1 = (1+r)x
    // 1/(1+r) = x
    const denom = 1 / (1 + iNatConf);
    const num = 1 - denom;
    return [num, denom];
  }

  // TODO use similar ancestry

  // for taxa without data, assume we won't confuse them so that it doesn't mess with
  // the groupings of taxa for which we do have data
  return [0, 1];
}

function iNaturalistConf(correctTaxonId, otherTaxonId) {
  if (!similarSpeciesData) return undefined;
  if (!(correctTaxonId in similarSpeciesData[mode])) return undefined;
  const data = similarSpeciesData[mode][correctTaxonId];
  const otherSpecies = data.similar_species.find((x) => x.id === otherTaxonId);
  if (!otherSpecies) return 0; // not confused at all
  const correctCount = data.observations_count;
  let ratio = (200 * otherSpecies.count) / correctCount;
  return ratio;
}

function updateConfusionScore(correctId, guessedId, idsInPlay) {
  // update incorrect and correct counts using an exponential moving average

  // confusion scores are stored with the taxon who the question is about
  // load raw data because we want to access numerator and denominator
  const confusedTaxa = loadTaxonData(correctId, true).confused_taxa || {};

  if (guessedId !== correctId) {
    applyEMA(confusedTaxa, correctId, guessedId, 1, 0);
  } else {
    // got it right, update scores for all taxa in play
    for (const id of idsInPlay) {
      if (id !== correctId) {
        applyEMA(confusedTaxa, correctId, id, 0, 1);
      }
    }
  }

  // save to local storage
  updateTaxonConfusions(correctId, confusedTaxa);
}

function applyEMA(confusedTaxa, correctId, otherId, numVal, denomVal) {
  // get existing num and denom values
  let num, denom;
  if (!(otherId in confusedTaxa)) {
    [num, denom] = defaultConf(correctId, otherId);
  } else {
    [num, denom] = confusedTaxa[otherId];
  }

  // apply EMA
  num = num * CONFUSION_EMA_FRAC + numVal * (1 - CONFUSION_EMA_FRAC);
  denom = denom * CONFUSION_EMA_FRAC + denomVal * (1 - CONFUSION_EMA_FRAC);

  // update the confusedTaxa object
  confusedTaxa[otherId] = [num, denom];
}

function makeTaxonGroups() {
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
        const [num, denom] = defaultConf(id, otherId);
        adjList[id][otherId] = num / denom;
      }
    }
  }
  console.log(adjList);
  // const adjMatrix = [];
  // const labels = [];
  // for (const a of taxonIds) {
  //   labels.push(idToName(Number(a)));
  //   const row = [];
  //   for (const b of taxonIds) {
  //     row.push(adjList[a][b] || 0);
  //   }
  //   adjMatrix.push(row);
  // }
  // for (let r = 0; r < adjMatrix.length; r++) {
  //   for (let c = r + 1; c < adjMatrix.length; c++) {
  //     adjMatrix[r][c] =
  //       1 - 0.5 * (1 / (1 + adjMatrix[r][c]) + 1 / (1 + adjMatrix[c][r]));
  //     adjMatrix[c][r] = adjMatrix[r][c];
  //   }
  // }
  // console.log(JSON.stringify(adjMatrix));
  // console.log(JSON.stringify(labels));
  // console.log(adjMatrix.map((row) => Math.max(...row)));

  // create list of edges, assign edges symmetric weights based on conf(A,B) and conf(B,A)
  const edges = [];
  for (let i = 0; i < taxonIds.length; i++) {
    for (let j = i + 1; j < taxonIds.length; j++) {
      // combine two confusion scores by predicting the probability the user will get a question correct
      // in a game with just those two taxa, and then doing 1 minus that because we want most confusing pairs
      // to have the largest weights
      // empirically this works better than averaging the two confusion scores, and is more principled as well
      const confAB = adjList[taxonIds[i]][taxonIds[j]];
      const pCorrectGivenA = 1 / (1 + confAB);
      const confBA = adjList[taxonIds[j]][taxonIds[i]];
      const pCorrectGivenB = 1 / (1 + confBA);
      const pCorrect = (pCorrectGivenA + pCorrectGivenB) / 2;
      edges.push({
        // weight: (confAB + confBA) / 2,
        weight: 1 - pCorrect,
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

    console.log(idToName(e.nodes[0]), "<->", idToName(e.nodes[1]));
    console.log(
      groupA.map((id) => idToName(id)),
      "<->",
      groupB.map((id) => idToName(id))
    );
    console.log();

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

  // sort groups
  const groups = Object.values(groupToIds);
  // TODO - actually sort

  // update bird list UI to reflect groups
  // first get reference to old group containers so we can delete them later
  const oldGroupDivs = document.querySelectorAll(".taxa-group");
  for (const group of groups) {
    const div = document.createElement("div");
    div.className = "taxa-group";
    for (const taxonId of group) {
      const listItem = document.querySelector(
        `.bird-list-item[data-taxon-id="${taxonId}"]`
      );
      div.append(listItem);
    }
    document.getElementById("bird-list").append(div);
  }
  // remove the old group containers
  oldGroupDivs.forEach((div) => div.remove());

  // TODO figure out what to return (might want to include info to help sort groups)
  // TODO try symmetric weight = p(wrong) for game w only A and B
  // TODO try dynamic group sizing based on p(wrong)
}

// debugging function
function idToName(taxonId) {
  const taxon = list_taxa.find((obj) => obj.id === taxonId);
  if (taxon) return taxon.preferred_common_name;
  return "No name";
}

// OLD FUNCTION, PLEASE REPLACE EVENTUALLY
function selectRecommended() {
  if (list_taxa.length === 0) return;

  let recommended_ids = [];

  if (loadBooleanSetting("store-progress", false)) {
    console.log("Generating recommendation:");

    // method:
    // "level" = category of taxa where their difficulty achieved is between two subset sizes defined by RECOMMENDED_SUBSET_SIZES
    // try to upgrade difficulty achieved (aka subset size) by one level if there's enough of the next lower level
    // prioritize making a larger subset when doing this, so we get something like the pattern:
    // - learn 4 (A), learn 4 (B), learn 8 (A+B), learn 4 (C), learn4 (D), learn 8 (C+D), learn 16 (A+B+C+D)
    // if there aren't enough taxa left, we will need to make mixed sets, where only some of them come from the next lower level, and others come from higher levels
    // but in general we want to avoid making mixed sets, because allowing that from the beginning would lead to:
    // - learn 4 (A), learn 4 (B), learn 8 (A+B), learn 4 (C), learn 8 (C + 4 from A+B) -- we would like to do learn 4 (D) before moving C up
    // - this is especially an issue if you have just one taxa in a level and the ones above are all mastered - would like to learn new taxa instead of recommending

    let taxa_to_review = [];

    // organize taxa into levels: key = min difficulty achieved to belong
    const levels = { 0: [] };
    RECOMMENDED_SUBSET_SIZES.forEach((size) => (levels[size] = []));
    list_taxa.forEach((taxon) => {
      const data = loadTaxonData(taxon.id);
      if (data.hours_since_reviewed > HOURS_SINCE_REVIEWED_THRESHOLD) {
        taxa_to_review.push(data);
      }
      for (let size of RECOMMENDED_SUBSET_SIZES) {
        if (data.difficulty_achieved >= size) {
          levels[size].push(data);
          return;
        }
      }
      levels[0].push(data);
    });
    // sort levels by decreasing proficiency (and otherwise maintains original order) will take from front when making pure sets
    Object.values(levels).forEach((list) =>
      list.sort((a, b) => b.proficiency - a.proficiency)
    );
    console.log("levels", levels);

    // try to make pure sets, prioritizing largest subset size
    for (let i = 0; i < RECOMMENDED_SUBSET_SIZES.length; i++) {
      const size = RECOMMENDED_SUBSET_SIZES[i];
      const level_key = RECOMMENDED_SUBSET_SIZES[i + 1] || 0; // if i out of range will pick 0
      const level = levels[level_key];
      console.log(
        `trying to make a set of size ${size} using ${level.length} taxa from level ${level_key}`
      );
      if (level.length < size) continue;

      // this will work - grab most proficient in the level to make the subset (helps w level 0, to focus on ones they've started learning)
      recommended_ids = level.slice(0, size).map((data) => data.taxon_id);
      break;
    }

    // if failed to make a pure set, make a mixed set
    if (recommended_ids.length === 0) {
      // concatenate levels into one big list, and pick from the front
      // sort ascending by proficiency and otherwise in original order - have to do this second sort b/c now proficiency should be going in the same direction as the original taxon list
      Object.values(levels).forEach((list) =>
        list.sort((a, b) => {
          const taxon_order = list_taxa.map((taxon) => taxon.id);
          return (
            a.proficiency - b.proficiency ||
            taxon_order.indexOf(a.taxon_id) - taxon_order.indexOf(b.taxon_id)
          );
        })
      );
      const big_list = [0, ...RECOMMENDED_SUBSET_SIZES.toReversed()].flatMap(
        (size) => levels[size]
      );
      // difficulty level of the first item will determine the subset size (want to level that one up by one)
      let subset_size = big_list.length; // if we don't find a smaller size, use everything
      for (let size of RECOMMENDED_SUBSET_SIZES.toReversed()) {
        if (big_list[0].difficulty_achieved < size) {
          subset_size = size;
          break;
        }
      }
      console.log("making a mixed set of size " + subset_size);
      recommended_ids = big_list
        .slice(0, subset_size)
        .map((data) => data.taxon_id);
    }

    // overwrite some with taxa needing review if they exist
    // sort so that longest-ago-reviewed taxa come
    taxa_to_review = taxa_to_review.filter(
      (obj) => !recommended_ids.includes(obj.taxon_id)
    );
    taxa_to_review.sort(
      (a, b) => b.hours_since_reviewed - a.hours_since_reviewed
    );
    const n_review_spots = Math.min(
      taxa_to_review.length,
      Math.ceil(FRACTION_RESERVED_FOR_REVIEW * recommended_ids.length)
    );
    const reviewing = taxa_to_review.slice(0, n_review_spots);
    console.log("Reviewing:", reviewing);
    // overwrite the last spots
    recommended_ids.splice.apply(recommended_ids, [
      -n_review_spots,
      n_review_spots,
      ...reviewing.map((x) => x.taxon_id),
    ]);
  } else {
    // not storing proficiencies, just pick a random set of the smallest subset size
    const taxon_ids = list_taxa.map((taxon) => taxon.id);
    for (let i = 0; i < RECOMMENDED_SUBSET_SIZES.slice(-1); i++) {
      const idx = Math.floor(taxon_ids.length * Math.random());
      recommended_ids.push(taxon_ids.splice(idx, 1)[0]);
    }
  }
  console.log("recommended ids", recommended_ids);

  // select
  selectNone();
  recommended_ids.forEach((id) => toggleListSelection(id));

  // show the user what we selected by moving them to the top and highlighting
  const bird_list = document.getElementById("bird-list");
  recommended_ids.toReversed().forEach((id) => {
    const bird_list_item = document.getElementById("bird-list-" + id);
    bird_list.prepend(bird_list_item);
    highlightElement(bird_list_item);
  });
}

// iNaturalist fetching functions =======================================================

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
  for (let taxonId of taxonIds) {
    await sleep(1); // keep iNaturalist happy
    const similarSpecies = await fetchSimilarSpecies(taxonId, sounds);
    console.log(`Got similar species for ${taxonId}, sending to firebase`);
    const data = {
      taxonId: {
        preferred_common_name: counts[taxonId].commonName,
        observations_count: counts[taxonId].count,
        similar_species: similarSpecies,
      },
    };
    firebaseAddSimilarSpecies(data, sounds);
  }
}
