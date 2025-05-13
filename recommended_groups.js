// A confusion score conf(A, B) measures, for games with taxon A and B in play,
// the expected number of times the user will guess taxon B for a question about taxon A,
// per time that the user correctly guesses taxon A. So a value of 0 means never confusing the two,
// a value of 1 means randomly guessing, and more than 1 means systematcally getting it wrong.
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
  }
  if (iNatConf !== undefined) {
    // threshold the ratio - only makes sense to be between 0 and 1
    iNatConf = Math.min(1, iNatConf);
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

  // for taxa without data, assume we won't confuse them that much so that it doesn't mess with
  // the groupings of taxa for which we do have data, but still leave room for confusion,
  // since that's realistic and also we want all pairings to be considered for a taxon group,
  // which won't happen if we assume not confused at all
  return [0.2, 0.8];
}

function roundUpIdToSpecies(taxonId) {
  const taxonObj = list_taxa.find((obj) => obj.id === taxonId);
  if (!taxonObj)
    throw new Error(
      `Couldn't find taxon object in list for taxon id ${taxonId}`
    );
  if (taxonObj.rank_level < 10) return getSpeciesParent(taxonObj).id;
  return taxonId;
}

function iNaturalistConf(correctTaxonId, otherTaxonId) {
  if (!similarSpeciesData) return undefined;

  // convert subspecies ids to species level
  correctTaxonId = roundUpIdToSpecies(correctTaxonId);
  otherTaxonId = roundUpIdToSpecies(otherTaxonId);

  if (!(correctTaxonId in similarSpeciesData[mode])) return undefined;
  const data = similarSpeciesData[mode][correctTaxonId];
  const otherSpecies = data.similar_species.find((x) => x.id === otherTaxonId);
  if (!otherSpecies) return MIN_INAT_CONFUSION_VALUE; // not confused at all
  const correctCount = data.observations_count;
  let ratio = (200 * otherSpecies.count) / correctCount;
  return ratio;
}

function updateConfusionScore(correctId, guessedId, idsInPlay) {
  // update incorrect and correct counts using an exponential moving average

  // don't store anything if we don't have iNaturalist data, we want to start from a reasonable confusion score
  if (!(correctId in similarSpeciesData[mode])) {
    console.log(
      `No iNaturalist data for taxon ${correctId}, not updating local storage`
    );
    return;
  }

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
  // console.log("user confusion data", adjList);

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
    const A = idToGroup[e.nodes[0]];
    const B = idToGroup[e.nodes[1]];
    if (A === B) continue; // already in the same group
    const groupA = groupToIds[A];
    const groupB = groupToIds[B];

    // check if not allowed to join groups because would make the group too big
    if (groupA.length + groupB.length > MAX_GROUP_SIZE) continue;

    // check if not allowed to join groups because the predicted accuracy is already past the threshold
    const predAccA = predictedAccuracy(groupA, adjList);
    const predAccB = predictedAccuracy(groupB, adjList);
    if (predAccA < PRED_ACCURACY_TARGET || predAccB < PRED_ACCURACY_TARGET) {
      continue;
    }

    // // debug - group formation process
    // console.log(idToName(e.nodes[0]), "<->", idToName(e.nodes[1]));
    // console.log(
    //   groupA.map((id) => idToName(id)),
    //   "<->",
    //   groupB.map((id) => idToName(id))
    // );
    // console.log();

    // join groups by reassigning everything in group B to group A
    groupToIds[A] = [...groupA, ...groupB];
    delete groupToIds[B];
    for (const id of groupB) {
      idToGroup[id] = A;
    }
  }

  // sort groups
  const groups = Object.values(groupToIds);
  sortGroups(groups, adjList); // sorts in place

  // print out groups
  for (const g of groups) {
    const groupNames = g.map(
      (id) => list_taxa.find((obj) => obj.id === id).preferred_common_name
    );
    const predAcc = predictedAccuracy(g, adjList);
    console.log(`pred acc ${predAcc.toFixed(2)} ${groupNames.join(",")}`);
  }

  displayGroups(groups);

  // TODO try dynamic group sizing based on p(wrong)
}

function predictedAccuracy(group, adjList) {
  // returns the user's predicted accuracy on a group of taxon ids
  // calculated as avg p(correct | taxon i)
  // where p(correct | taxon i) = 1 / (1 + conf(i, a) + conf(i, b) + ...)
  // adjList contains confusion scores between taxa
  let probSum = 0;
  // iterate over the taxon a question is being asked about
  // assume all taxa are chosen uniformly for questions, for simplicity
  for (const id of group) {
    let confSum = 0;
    // iterate over taxa that could be confused
    for (const otherId of group) {
      if (id === otherId) continue;
      confSum += adjList[id][otherId];
    }
    probSum += 1 / (1 + confSum);
  }
  return probSum / group.length;
}

function sortGroups(groups, adjList) {
  // groups is an array of arrays each containing the taxon ids in that group

  const count = (taxonId) => regionalSpeciesCounts[taxonId] || 0;

  const avgTaxonObsCount = (group) => {
    let sum = 0;
    group.forEach((taxonId) => (sum += count(taxonId)));
    return sum / group.length;
  };

  // const maxTaxonObsCount = (group) => {
  //   let max = 0;
  //   group.forEach(
  //     (taxonId) => (max = Math.max(max, regionalSpeciesCounts[taxonId] || 0))
  //   );
  //   return max;
  // };

  const maxCountTaxonId = (group) => {
    let max = -1;
    let maxId;
    group.forEach((taxonId) => {
      const taxonCount = count(taxonId);
      if (taxonCount > max) {
        max = taxonCount;
        maxId = taxonId;
      }
    });
    return maxId;
  };

  const medianProficiency = (group) => {
    const proficencies = group.map(
      (taxonId) => loadTaxonData(taxonId).proficiency
    );
    proficencies.sort();
    const n = proficencies.length;
    if (n % 2 === 1) return proficencies[(n - 1) / 2];
    return (proficencies[n / 2] + proficencies[n / 2 - 1]) / 2;
  };

  const sortMetric = (group) => {
    // want to prioritize common birds the user is bad at
    // so sort first the highest p(group | incorrect)
    // = p(incorrect | group) * p(group) / p(incorrect), by bayes rule
    // p(incorrect) is constant between groups, so drop that
    // p(group) = # observations of group taxa / total observations, but total obs is constant so drop that
    // also in practice I found using the avg # obs per taxa to be better than total # obs belonging to the group,
    // such that the group size doesn't affect this sort metric

    // Also, we would like to start by learning the most common birds, regardless of confusion,
    // then transition to reviewing the most confusing birds. Can measure this with taxon proficiency values.
    // If median proficiency is low, focus on common birds. If it's high, focus on common birds likely to cause mistakes.
    // Note that different groups can be using a different focus, and it'll work because low proficency groups will have
    // larger scores because they're not being affected by the (1 - predicted accuracy) term, and they indeed should be
    // sorted earlier.

    // Update: in practice, it seems that using the # observations of just the most common taxon works better than the avg
    // because you usually want to learn that one / how to tell it apart from look-alikes. There was a problem with this
    // though, which is that it would keep the most common taxon in the first group and cycle a bunch of uncommon taxa
    // through as the other group members, never getting to the second most common birds in the second group. So it seems
    // after the most common taxon has been seen, this doesn't work so well. Because of this, do indeed focus on the most
    // common taxon until it has been seen a bit (proficiency isn't like 0), then pivot to the other strategy.

    const commonId = maxCountTaxonId(group);
    if (loadTaxonData(commonId).proficiency <= EXPOSURE_PROFICIENCY_THRESHOLD) {
      return count(commonId);
    }
    if (medianProficiency(group) <= ACCURACY_MATTERS_PROFICIENCY_THRESHOLD) {
      return avgTaxonObsCount(group);
    }
    return (1 - predictedAccuracy(group, adjList)) * avgTaxonObsCount(group);
  };

  // sort ------------------------------
  groups.sort((a, b) => {
    return sortMetric(b) - sortMetric(a);
  });

  // TODO incorporate time since reviewed?
}

function displayGroups(groups) {
  // update bird list UI to reflect groups
  // first get reference to old group containers so we can delete them later
  const oldGroupDivs = document.querySelectorAll(".taxa-group");
  for (const group of groups) {
    const div = document.createElement("div");
    div.className = "taxa-group";

    const header = document.createElement("div");
    header.className = "taxa-group-header font-small";

    const headerLeft = document.createElement("div");
    headerLeft.className = "group-header-left";

    const nTaxa = document.createElement("p");
    nTaxa.className = "group-n-taxa font-small";
    nTaxa.textContent = `${group.length} taxa`;

    const selectGroup = document.createElement("button");
    selectGroup.textContent = "SELECT GROUP";
    selectGroup.addEventListener("click", () => {
      div
        .querySelectorAll(".bird-list-item:not(.selected)")
        .forEach((el) => toggleListSelection(el.dataset.taxonId));
    });
    const deselectGroup = document.createElement("button");
    deselectGroup.textContent = "DESELECT GROUP";
    deselectGroup.addEventListener("click", () => {
      div
        .querySelectorAll(".bird-list-item.selected")
        .forEach((el) => toggleListSelection(el.dataset.taxonId));
    });
    const infoButton = document.createElement("button");
    infoButton.className = "info-button";
    infoButton.addEventListener("click", () =>
      alert(
        "Similar species are automatically grouped together based on how likely it is for you to confuse them. This changes over time based on which species you confuse often. Groups are also sorted, such that groups are placed earlier if they\n(1) contain species that are common\n(2) contain species that you are struggling with, or\n(3) contain species that you haven't reviewed in a while.\n\nIt is recommended to practice the first group, but you can choose otherwise. If a species was recently added, you may need to wait a minute for the similar species data to be fetched, and then refresh the page for it to be grouped properly."
      )
    );

    headerLeft.append(nTaxa, selectGroup, deselectGroup);
    header.append(headerLeft, infoButton);
    div.append(header);

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

  // update auto-selection if setting is enabled
  // this is just selecting the first group
  if (loadBooleanSetting("auto-select-recommended", false)) {
    deselectAll();
    document
      .querySelector(".taxa-group")
      ?.querySelectorAll(".bird-list-item") // ?. b/c if list is empty there are no taxa groups
      .forEach((el) => {
        toggleListSelection(el.dataset.taxonId);
      });
  }
}

// debugging function
function idToName(taxonId) {
  const taxon = list_taxa.find((obj) => obj.id === taxonId);
  if (taxon) return taxon.preferred_common_name;
  return "No name";
}

// iNaturalist fetching functions =======================================================

async function fetchSimilarSpecies(taxonId, sounds = false) {
  const similarUrl = `https://api.inaturalist.org/v1/identifications/similar_species?sounds=${sounds}&taxon_id=${taxonId}`;
  const fetchResult = await fetch(similarUrl);
  if (fetchResult.status !== 200) {
    const taxonObj = list_taxa.find((obj) => obj.id === taxonId);
    const commonName = taxonObj?.preferred_common_name || taxonObj?.name || "?";
    console.warn(
      `Failed to fetch similar species data for taxon ${taxonId}: ${commonName}`
    );
    return undefined;
  }
  const results = (await (await fetch(similarUrl)).json()).results;

  const infoToKeep = results.map((obj) => {
    return {
      id: obj.taxon.id,
      count: obj.count,
      name: obj.taxon.name,
      preferred_common_name: obj.taxon.preferred_common_name || obj.taxon.name,
    };
  });
  return infoToKeep;
}

function sleep(sec) {
  return new Promise((resolve) => setTimeout(resolve, 1000 * sec));
}

async function updateFirebaseSimilarSpecies(taxonIds, sounds) {
  taxonIds = taxonIds.map((x) => Number(x));

  // console.log(
  //   "Updating firebase similar species database for " +
  //     taxonIds.join() +
  //     `, with sounds=${sounds}`
  // );

  // get similar taxa, combine with count data to be sent to firebase
  for (let taxonId of taxonIds) {
    await sleep(game_state === INACTIVE ? 1 : 3); // keep iNaturalist happy

    let taxonObj = list_taxa.find((obj) => obj.id === taxonId);
    if (!taxonObj) {
      console.warn(`Failed to find taxon object for taxon ${taxonId}`);
      continue;
    }

    // convert subspecies taxa to species level, since iNaturalist searches for similar taxa at the same rank,
    // and it's more meaningful to confuse with other species than other subspecies
    if (taxonObj.rank_level < 10) {
      console.log(
        `Converting subspecies ${taxonObj.id}: "${taxonObj.name}" to species`
      );
      taxonObj = getSpeciesParent(taxonObj);
      console.log(`Species is ${taxonObj.id}: "${taxonObj.name}"`);
    }

    const similarSpecies = await fetchSimilarSpecies(taxonObj.id, sounds);
    if (!similarSpecies) continue;
    console.log(
      `Got similar species for ${taxonObj.id}: ${
        taxonObj.preferred_common_name || taxonObj.name
      }, sounds=${sounds}, sending to firebase`
    );

    const data = {};
    data[taxonObj.id] = {
      preferred_common_name: taxonObj.preferred_common_name || taxonObj.name,
      observations_count: taxonObj.observations_count,
      similar_species: similarSpecies,
    };
    console.log(data);
    firebaseAddSimilarSpecies(data, sounds);
  }
}
