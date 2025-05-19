let initializationComplete = false;
let list_taxa = []; //list of iNaturalist taxon objects that are on the practice list
let taxa_to_use = []; //subset of list_taxa being used this game, initialized at game init based on the selected birds
let place_id;
let similarSpeciesData = { birdsong: {}, visual_id: {} };
// gets fetched from firebase once, when addBirds() is called for the first time (on page load)
// will load both sounds and photos so that it's easier for switching modes
// format: {birdsong: {taxonId1: {...}, taxonId2: {...}, ...}, visual_id: {...}}

// this function gets called on page load, see html file
async function initListScreen() {
  startListLoader();

  let url = new URL(window.location.href);
  let taxonIdsString = url.searchParams.get("taxa");
  let default_mode = url.searchParams.get("mode");
  let data_source_setting =
    url.searchParams.get("data_source") || "iNaturalist";
  place_id = url.searchParams.get("place_id");

  // fill in taxa
  if (taxonIdsString === null) {
    //if no taxa, display message
    document.getElementById("bird-list-message").style.display = "block";
  } else {
    const taxonIds = taxonIdsString.split(",").map((s) => Number(s));
    const addBirdsPromise = addBirds(taxonIds, false);
    const locationPromise = initRegionalCounts(taxonIds);
    await Promise.all([addBirdsPromise, locationPromise]);
  }
  console.log("Taxa loaded");

  if (default_mode) setMode(default_mode);
  setDataSource(data_source_setting);

  makeTaxonGroups();

  // start getting similar species data from iNaturalist for taxa we don't have it for yet
  // but don't require this to finish before we resolve this function's promise; this can happen in the background
  getMissingSimilarSpeciesData();

  // check if a lot of list taxa aren't found in this location; give warning if so
  // do this after a delay so that the page will render first
  setTimeout(() => {
    const taxaNotFound = [];
    list_taxa.forEach((obj) => {
      if (obj.rank_level > 10) return; // above species level
      if (!(roundUpIdToSpecies(obj.id) in regionalSpeciesCounts)) {
        taxaNotFound.push(obj);
      }
    });
    console.log("taxa not found", taxaNotFound);
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

  stopListLoader();
  initializationComplete = true;
}

function getSpeciesParent(taxonObj) {
  // converts subspecies taxon object to species level taxon object
  if (taxonObj.rank_level >= 10) {
    console.error(taxonObj);
    throw new Error("Taxon object is not at subspecies level");
  }
  for (let i = taxonObj.ancestors.length - 1; i >= 0; i--) {
    if (taxonObj.ancestors[i].rank === "species") {
      return taxonObj.ancestors[i];
    }
  }
  console.error(taxonObj);
  throw new Error("Couldn't find a species level parent");
}

async function getMissingSimilarSpeciesData(taxonIdSubset = undefined) {
  // do it for both modes, but prioritize the current mode
  // this helps make sure it's still happening even if the mode is switched back and forth, without happening multiple times
  // having extra data is okay, and the fetch rate adapts to whether a game is going on
  const modeList =
    mode === "birdsong" ? ["birdsong", "visual_id"] : ["visual_id", "birdsong"];

  for (const m of modeList) {
    // determine which taxa we don't have similar species data for already
    // note that subspecies use their parent species' data

    const idsWithoutData = [];
    for (const obj of list_taxa) {
      // if rank is too high, this data doesn't exist, don't try to fetch it
      if (obj.rank_level > 20) continue;

      const idInData = obj.rank_level < 10 ? getSpeciesParent(obj).id : obj.id;
      const noData = !(String(idInData) in similarSpeciesData[m]);
      const inSubset =
        taxonIdSubset === undefined || taxonIdSubset.includes(obj.id);
      // console.log(obj.id, idInData, noData, inSubset);

      if (noData && inSubset) {
        idsWithoutData.push(obj.id);
      }
    }
    console.log(
      `Taxa without similar species data for mode ${m}: ${
        idsWithoutData.join(",") || "None"
      }`
    );
    if (idsWithoutData.length > 0) {
      const sounds = m === "birdsong";
      await updateFirebaseSimilarSpecies(idsWithoutData, sounds);
    }
  }
}

function setURLParam(key, value) {
  //fetch current params in case there are other params besides taxa, don't want to mess with those
  let params = new URL(window.location.href).searchParams;
  params.delete(key);
  value = String(value); //just in case
  if (value && value.length > 0) params.append(key, value);
  window.history.replaceState(
    null,
    "",
    "?" + params.toString().replaceAll("%2C", ",")
  ); //technically %2C is correct but comma looks so much neater and more intuitive
}

function startListLoader() {
  document.getElementById("bird-list-loader").style.display = "block";
}
function stopListLoader() {
  document.getElementById("bird-list-loader").style.display = "none";
}

async function addBirds(taxa_id_list) {
  if (game_state !== INACTIVE) return;

  //extract only taxon ids we don't have
  let ids_we_have = list_taxa.map((obj) => obj.id);

  let ids_to_fetch = [];
  taxa_id_list.forEach((id) => {
    if (!ids_we_have.includes(id)) {
      ids_to_fetch.push(id);
    }
  });
  if (ids_to_fetch.length === 0) return;

  startListLoader();

  //update URL list, added entries will be at the end
  setURLParam("taxa", ids_we_have.concat(ids_to_fetch).join(","));

  // Get bird data

  let results = new Array(ids_to_fetch.length); //array of undefined which will get populated w the data
  let promises = [];

  //fetch 30 taxa at a time (iNaturalist limit)
  //only when they've all arrived add them to the list (so ensure same order as in id list)
  let start_idx = 0; //for indexing ids_to_fetch

  // TODO - experiment with whether sending out more balanced queries is faster
  // e.g. for 35 species, sending queries with 17 and 18 taxa, rather than queries with 30 and 5 taxa

  while (start_idx < ids_to_fetch.length) {
    let ids = ids_to_fetch.slice(start_idx, start_idx + 30);
    start_idx += 30;

    promises.push(
      fetch("https://api.inaturalist.org/v1/taxa/" + ids.join(","))
        .then((res) => res.json())
        .then((data) => {
          //insert into correct location in results array
          let offset = ids_to_fetch.indexOf(data.results[0].id);
          for (let i = 0; i < data.results.length; i++) {
            results[i + offset] = data.results[i];
          }
        })
    );
  }

  // also fetch similar species data from firebase
  promises.push(getSimilarSpeciesDataFromFirebase(ids_to_fetch));

  await Promise.all(promises);

  //add taxa
  results.forEach((taxon) => {
    //make sure we use default photos that are licensed
    if (taxon.default_photo && taxon.default_photo.license_code === null) {
      let licensed_photo_obj = taxon.taxon_photos.find(
        (photo_obj) => photo_obj.photo.license_code !== null
      );
      if (licensed_photo_obj) taxon.default_photo = licensed_photo_obj.photo;
    }

    //add to JS list
    list_taxa.push(taxon);

    //add to HTML list ----------------

    //create container

    let container = document.createElement("div");
    container.id = "bird-list-" + taxon.id;
    container.className = "bird-list-item";
    container.dataset.taxonId = taxon.id;
    container.dataset.rank = taxon.rank;
    container.dataset.isBird = taxon.ancestor_ids.includes(3); // used for css styling

    container.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        toggleListSelection(taxon.id);
      }
    });

    //create elements in container

    let progress_bar = document.createElement("div");
    progress_bar.className = "taxon-progress";
    progress_bar.title = "Your recent proficiency";

    let bird_square = document.createElement("img");
    bird_square.className = "bird-square";
    if (taxon.default_photo) bird_square.src = taxon.default_photo.square_url;
    bird_square.alt = "Photo of " + taxon.preferred_common_name;

    let checkmark = document.createElement("img");
    checkmark.src = "images/checkmark_icon.png";
    checkmark.className = "checkmark";

    let name_container = document.createElement("div");

    let link = document.createElement("a");
    link.href = getInfoURL(taxon, mode);
    link.target = "_blank";
    let info_button = document.createElement("button");
    info_button.className = "info-button inline";
    link.append(info_button);

    let i = document.createElement("i");
    i.textContent = taxon.name;

    if (taxon.preferred_common_name) {
      let b = document.createElement("b");
      let br = document.createElement("br");
      b.textContent = taxon.preferred_common_name;
      name_container.append(b, link, br, i);
    } else {
      name_container.append(i, link);
    }

    let map_icon = document.createElement("button");
    map_icon.className = "range-map-icon";
    map_icon.dataset.id = taxon.id;
    map_icon.dataset.commonName = taxon.preferred_common_name;
    map_icon.dataset.scientificName = taxon.name;
    map_icon.dataset.imageUrl = taxon.default_photo.square_url;

    let x_button = document.createElement("button");
    x_button.className = "x-button";
    x_button.addEventListener("click", (e) => {
      if (confirm("Remove " + taxon.preferred_common_name + " from list?"))
        removeBird(taxon.id);
    });

    //append
    container.append(
      progress_bar,
      checkmark,
      bird_square,
      name_container,
      map_icon,
      x_button
    );
    document.getElementById("bird-list").append(container);

    //load proficiency display (nothing will show if not storing data)
    refreshTaxonProficiencyDisplay(taxon.id);
  });

  //update count
  document.getElementById("n-species-display").textContent = list_taxa.length;
  document.getElementById("bird-list-message").style.display = "none";

  //if birds are added after initialization, update groups and missing similar species data
  if (initializationComplete) {
    makeTaxonGroups();
    getMissingSimilarSpeciesData(ids_to_fetch);
  }

  // if just added a bird manually (proxy this with if only added one), highlight it
  if (results.length === 1) {
    highlightElement(document.getElementById("bird-list-" + ids_to_fetch[0]));
  }

  checkIfNoneSelected();
  stopListLoader();
}

function removeBird(taxon_id) {
  if (game_state !== INACTIVE) return;

  //remove from HTML
  let container = document.getElementById("bird-list-" + taxon_id);
  container.parentElement.removeChild(container);

  //remove from JS
  for (let i = 0; i < list_taxa.length; i++) {
    if (list_taxa[i].id === taxon_id) {
      list_taxa.splice(i, 1);
      break;
    }
  }

  //update count
  document.getElementById("n-species-display").textContent = list_taxa.length;

  //remove from URL
  if (list_taxa.length === 0) {
    //clear search params
    setURLParam("taxa", "");
    document.getElementById("bird-list-message").style.display = "block";
  } else {
    setURLParam("taxa", list_taxa.map((obj) => obj.id).join(","));
  }

  // update groups
  makeTaxonGroups();

  checkIfNoneSelected();
}

function checkIfNoneSelected() {
  //if no birds selected, update message and button
  const empty =
    document.querySelectorAll(".bird-list-item.selected").length === 0;
  document.getElementById("start-game-button").disabled = empty;
}

//autocomplete list stuff

function capitalize(str) {
  return str.replace(/^\w|\s\w|-\w/g, function (char) {
    return char.toUpperCase();
  });
}

initAutocomplete(
  "add-bird-input",
  "taxon-autocomplete-list",
  // get api endpoint function
  () => {
    const allow_all_taxa = loadBooleanSetting("allow-all-taxa", false);
    let taxa_to_search_in = allow_all_taxa ? [] : [3];

    if (data_source === "ebird_calls") {
      // restrict to taxa we have data for
      taxa_to_search_in = taxa_to_search_in.concat(Object.keys(eBirdCalls));
    }
    let taxonIdParam =
      taxa_to_search_in.length === 0
        ? ""
        : "taxon_id=" + taxa_to_search_in.join() + "&";

    return `https://api.inaturalist.org/v1/taxa/autocomplete?${taxonIdParam}rank=species,genus,family,order&is_active=true`;
  },
  //result callback
  (obj, list_option) => {
    if (!obj.default_photo || obj.observations_count === 0) return; //extinct species are sometimes returned

    list_option.dataset.taxonId = obj.id;

    let img = document.createElement("img");
    img.src = obj.default_photo.square_url;

    let p = document.createElement("p");
    let b = document.createElement("b");
    let br = document.createElement("br");
    let rank_label = document.createTextNode(capitalize(obj.rank) + " "); //for family or higher
    let i = document.createElement("i");
    let name_no_italics = document.createTextNode(obj.name); //for higher than family
    b.textContent = obj.preferred_common_name;
    if (
      !(
        obj.preferred_common_name &&
        obj.preferred_common_name.includes(obj.matched_term)
      ) &&
      !obj.name.includes(obj.matched_term)
    ) {
      b.textContent += " (" + obj.matched_term + ")";
    }
    i.textContent = obj.name;

    p.append(b, br);
    if (obj.rank_level >= 30) p.append(rank_label);
    obj.rank_level <= 30 ? p.append(i) : p.append(name_no_italics);

    let map_icon = document.createElement("button");
    map_icon.className = "range-map-icon";
    map_icon.dataset.id = obj.id;
    map_icon.dataset.commonName = obj.preferred_common_name;
    map_icon.dataset.scientificName = obj.name;
    map_icon.dataset.imageUrl = obj.default_photo.square_url;

    list_option.append(img, p, map_icon);
  },
  //select callback
  (list_option) => {
    let taxon_id = list_option.dataset.taxonId;
    let found_elem = document.getElementById("bird-list-" + taxon_id);

    if (found_elem) highlightElement(found_elem);
    else addBirds([Number(taxon_id)]);
  }
);

function highlightElement(el, scrollTo = true) {
  if (scrollTo) {
    el.scrollIntoView({ block: "center" });
  }
  el.classList.add("highlighting");
  setTimeout(() => {
    el.classList.remove("highlighting");
  }, 2000);
}
