let kill_fetch_until_threshold = []; //when fetchUntilThreshold is called, it appends "false", and kills itself if the "false" at that index gets changed to "true"
//this is used when exiting a game, to stop the fetchUntilThreshold from continuing to run

//STATE VARIABLES - get reset when we go back to list (see game_events.js)
let taxon_obs = {}; //stores lists of objects, organized by taxon id keys
let taxon_queues = {}; //stores lists of observation objects for each taxon in order of showing, pop from beginning of list to show and refill if empty, helps with not repeating observations frequently
let taxon_bag = []; //list of unordered taxon ids, perhaps each id in here multiple times, pick a random item to determine next taxon to show
let bad_ids = {}; // object (taxon_id: [array of iNaturalist ids]) that records ids that were skipped before or are otherwise bad (e.g. missing audio). This coordinates w firebase
let current; //current observation object
let next; //helpful for preloading

const audio_preloader = new Audio();
audio_preloader.addEventListener("loadedmetadata", checkNextAudioDuration);

let game_state;
const INACTIVE = 0;
const GUESSING = 1;
const ANSWER_SHOWN = 2;
setGameState(INACTIVE);

let mode = "birdsong"; // or "visual_id"
let data_source = "iNaturalist"; // default "iNaturalist" (see initListScreen()), other options: "ebird_calls"

let funny_bird_timeout_id;

let already_notified_full_progress_bar = false;

function setGameState(state) {
  game_state = state;
  document.getElementById("game-main").dataset.gameState = state;
}

function setMode(new_mode) {
  mode = new_mode;

  //update HTML
  document
    .querySelectorAll("#mode-container *")
    .forEach((el) => el.classList.remove("selected"));
  document
    .querySelector("[data-mode=" + new_mode + "]")
    .classList.add("selected");
  document.getElementById("game-main").dataset.mode = mode;
  document.getElementById("bird-image").style.cursor =
    new_mode === "visual_id" ? "zoom-in" : "default";

  //update links
  document.querySelectorAll("#bird-list a").forEach((a) => {
    let container = a.closest(".bird-list-item");
    let taxon_id = Number(container.dataset.taxonId);
    let taxon_obj = list_taxa.find((obj) => obj.id === taxon_id);
    a.href = getInfoURL(taxon_obj, new_mode);
  });

  //update URL
  setURLParam("mode", mode);

  //update proficiency display
  list_taxa.forEach((obj) => {
    refreshTaxonProficiencyDisplay(obj.id);
  });

  //update groups if mode is set after initialization
  if (initializationComplete) makeTaxonGroups();
}

function setDataSource(new_data_source) {
  data_source = new_data_source;

  // game mode override (if data source doesn't allow visual id / birdsong toggling)
  if (new_data_source === "ebird_calls") {
    document
      .querySelector(".override[data-name=ebird_calls]")
      .setAttribute("active", true);
  } else {
    document
      .querySelectorAll(".override[active]")
      .forEach((el) => el.removeAttribute("active"));
  }

  // apply CSS styling changes to the game
  document.getElementById("game-main").dataset.dataSource = new_data_source;
}

// try a different observation if the audio is too long

let n_short_audio_retries_left = MAX_SHORT_AUDIO_RETRIES;
setInterval(function () {
  n_short_audio_retries_left = Math.min(
    n_short_audio_retries_left + 1,
    MAX_SHORT_AUDIO_RETRIES
  );
}, TIME_TO_REPLENISH_A_SHORT_AUDIO_RETRY);

function checkNextAudioDuration(e) {
  // this is an event handler for when the next observation's audio's metadata loads
  // if the audio is too long, try again
  if (data_source !== "iNaturalist") return; // other data sources will probably be curated already
  if (audio_preloader.duration <= MAX_PREFERRED_AUDIO_DURATION) return;
  if (n_short_audio_retries_left > 0) {
    console.log(
      `next audio too long (${audio_preloader.duration}s > ${MAX_PREFERRED_AUDIO_DURATION}s) retrying`
    );
    next = pickObservation();
    audio_preloader.src = next.sounds[0].file_url;
    n_short_audio_retries_left--;
  } else {
    console.log("ran out of retries to pick a shorter audio clip");
  }
}

function pickObservation() {
  //pick next observation object, return it. Try not to duplicate the current observation
  //use the taxon_queues to ensure each observation gets a chance to be seen before recycling

  //squirrel intruder (only for lists of birds b/c that's what is easily confused with squirrels)
  const all_birds = list_taxa.every((taxon) => taxon.ancestor_ids.includes(3));
  if (
    all_birds &&
    mode === "birdsong" &&
    Math.random() < SQUIRREL_PROBABILITY
  ) {
    return squirrel_obs[Math.floor(Math.random() * squirrel_obs.length)];
  }

  //filter to get taxa we currently have observations for
  let filtered_taxon_bag = taxon_bag.filter((id) => taxon_obs[id].length > 0);
  if (filtered_taxon_bag.length === 0) {
    console.error("No observations found, cannot pick one");
    alert(
      "Error: Cannot pick the next observation because no observations were found. This could be because:\n-Data is still being fetched\n-All iNaturalist observations are either not research grade or marked as 'Don't Show Again'\n-Some other error.\n\nPlease reload the page and try again."
    );
    return;
  }

  // try a few times to not duplicate the current observation, and to pick one with only one or few photos (if visual id mode)
  // - using observations with only one photo means the taxon is probably identifiable from just that photo.
  // - this is helpful b/c the user only sees one photo
  // - don't try too hard though because then repeat the same observations too much
  let picked;
  for (let i = 0; i < 3; i++) {
    //draw from taxon bag, taxa are weighted differently in there depending on how good the player is doing
    let next_taxon_id =
      filtered_taxon_bag[Math.floor(filtered_taxon_bag.length * Math.random())];

    //take an observation from our available ones for that taxon
    prev_picked = picked; // store previous pick so we can compare # photos
    picked = taxon_queues[next_taxon_id].shift();
    //refill queue if it emptied
    if (taxon_queues[next_taxon_id].length === 0) resetQueue(next_taxon_id);

    // main priority is not to duplicate the current observation
    if (picked === current) {
      // revert to non-current if we can
      if (prev_picked && prev_picked !== current) picked = prev_picked;
      // keep looking
      continue;
    }

    // if not duplicating and mode isn't visual id, we can use this one
    if (mode !== "visual_id") return picked;

    // in visual id mode, try for fewer photos - ideally 1
    if (picked.photos.length === 1) {
      console.log("trying to pick next - found obs with 1 photo");
      return picked;
    }
    // prefer the observation with fewer photos
    if (prev_picked && prev_picked.photos.length < picked.photos.length) {
      picked = prev_picked;
    }
    console.log("trying to pick next - # photos", picked.photos.length);
  }
  return picked;
}

function resetQueue(taxon_id) {
  let queue = taxon_queues[taxon_id];
  taxon_obs[taxon_id].forEach((obj) => {
    let insert_idx = Math.floor((queue.length + 1) * Math.random());
    queue.splice(insert_idx, 0, obj);
  });
}

async function initGame() {
  console.log("\nINIT GAME ============================\n\n");

  //start loader
  startListLoader();

  //get taxa_to_use
  taxa_to_use = Array.from(
    document.querySelectorAll("#bird-list .selected")
  ).map((el) => {
    let id = Number(el.dataset.taxonId);
    return list_taxa.find((obj) => obj.id === id);
  });
  if (taxa_to_use.length === 0) {
    alert("No taxa selected");
    stopListLoader();
    return;
  }
  console.log("taxa to use", taxa_to_use);

  //init taxon_obs, taxon_queues, taxon bag
  taxon_obs = {}; //clear it in case last init failed and this isn't empty
  taxa_to_use.forEach((obj) => {
    taxon_obs[obj.id] = [];
    taxon_queues[obj.id] = [];
    // determine how many to add to taxon bag, based on previous proficiency
    // should range from 2 to START_TAXON_BAG_COPIES (never 1 b/c we don't want them to start at full proficiency meter)
    const n_copies = Math.ceil(
      2 + (START_TAXON_BAG_COPIES - 2) * (1 - loadTaxonData(obj.id).proficiency)
    );
    console.log(obj.preferred_common_name, n_copies, "copies in taxon bag");
    // add to taxon_bag
    for (let i = 0; i < n_copies; i++) {
      taxon_bag.push(obj.id);
    }
  });
  updateProgressBar();

  // get bad observations (do before initial fetch, b/c fetchObservationData() can add to bad_ids)
  bad_ids = await getBadIds(
    taxa_to_use.map((obj) => obj.id),
    mode
  );

  // get initial data
  const taxa_ids = taxa_to_use.map((obj) => obj.id);
  if (data_source === "ebird_calls") {
    loadEBirdCalls(taxa_ids);
  } else if (data_source === "iNaturalist") {
    const data_was_fetched = await fetchObservationData(
      taxa_ids,
      "",
      INITIAL_PER_PAGE
    );
    if (!data_was_fetched) {
      alert(
        "Failed to find research grade iNaturalist observations for any of the chosen taxa. Please try again with different taxa."
      );
      stopListLoader();
      resetAndExitGame();
      return;
    }
  }

  //populate bird grid
  let bird_grid = document.getElementById("bird-grid");
  //clear previous grid
  bird_grid
    .querySelectorAll(".bird-grid-option:not(#other-option")
    .forEach((el) => {
      el.parentElement.removeChild(el);
    });
  //add taxa
  taxa_to_use.forEach((obj) => {
    //HTML
    let button = document.createElement("button");
    button.className = "bird-grid-option";
    button.dataset.commonName = obj.preferred_common_name;
    if (obj.default_photo)
      button.style.backgroundImage = `url('${obj.default_photo.square_url}')`;
    bird_grid.append(button);

    //datalist - only include scientific option if taxon isn't a species/subspecies, OR if taxon is a plant
    let option_common = document.createElement("option");
    option_common.value = obj.preferred_common_name;
    document.getElementById("guess-datalist").append(option_common);
    if (obj.rank_level > 10 || obj.ancestor_ids.includes(47126)) {
      let option_scientific = document.createElement("option");
      option_scientific.value = obj.name;
      document.getElementById("guess-datalist").append(option_scientific);
    }
  });

  //switch screens and stop loader
  //if visual id, delay starting until the image is loaded
  if (mode === "visual_id") {
    document.getElementById("bird-image").addEventListener(
      "load",
      () => {
        document.getElementById("list-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        document.getElementById("bird-list-loader").style.display = "none";
      },
      { once: true }
    );
  } else {
    //do it immediately
    document.getElementById("list-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("bird-list-loader").style.display = "none";
  }

  next = pickObservation();
  nextObservation(); //sets game_state FYI, but was already set in the event listener

  //funny bird
  scheduleFunnyBird();

  if (data_source === "iNaturalist") {
    //fetch the rest more slowly (limit to < 1 API call per sec)
    //each attempt usually makes 2 API calls (n pages, and data), pace it slower than 1 API call / sec
    const result = await fetchUntilThreshold(N_OBS_PER_TAXON, 3000);
    //if some taxa had no observations at all, alert the user
    if (
      !result.success &&
      result.failure_reason === "not_enough_observations"
    ) {
      let no_obs_ids = result.lacking_ids.filter(
        (id) => taxon_obs[id].length === 0
      );
      if (no_obs_ids.length === 0) return;

      let failed_names = no_obs_ids.map((id_str) => {
        return list_taxa.find((obj) => obj.id === Number(id_str))
          .preferred_common_name;
      });
      alert(
        "Failed to find research grade iNaturalist observations for " +
          failed_names.join(", ") +
          ". This doesn't break anything, just no questions will be about these species."
      );
    }
  }
}

function searchAncestorsForTaxonId(obj) {
  //since observations can come from children of a taxon, try each ancestry level one by one, starting w most specific
  let ancestor_ids = obj.taxon.ancestor_ids.slice();
  while (ancestor_ids.length > 0) {
    let id = ancestor_ids.pop(); //end of list is most specific taxon, starting with observation's taxon id
    if (taxon_obs.hasOwnProperty(id)) {
      return id;
    }
  }
}

async function fetchObservationData(
  taxa_ids = undefined,
  extra_args = "",
  per_page = undefined
) {
  //returns a promise (b/c async) that fulfills when data has been fetched and added to data structures
  //the promise resolves to true if data was fetched, false if there was no data to fetch
  //audio missing a url will be filtered out
  //long audio will be filtered out, but at least one audio will always be let through even if long, to not break other code

  if (!taxa_ids) {
    taxa_ids = taxa_to_use.map((obj) => obj.id);
  }

  if (!per_page) {
    //don't try to fetch with a big per page if realistically we don't need that many observations
    let n_obs_needed_ish = taxa_ids.length * N_OBS_PER_TAXON;
    per_page = Math.min(DEFAULT_PER_PAGE, 3 * n_obs_needed_ish); // times 3 because some taxa are more common than others, would like to get a good amount of the less common
  }
  const taxa_id_string = taxa_ids.join(",");

  console.groupCollapsed(`FETCH ${taxa_id_string}\nExtra args: ${extra_args}`);

  //figure out which observations (of the requested taxa) we have already so we don't repeat
  let obs_ids_we_have = [];
  for (const taxon_id in taxon_obs) {
    if (taxa_id_string.includes(taxon_id)) {
      obs_ids_we_have = obs_ids_we_have.concat(
        taxon_obs[taxon_id].map((obj) => obj.id)
      );
    }
  }
  //get list of bad observation ids for just the taxa we are fetching
  let bad_obs_ids = [];
  taxa_ids.forEach((taxon_id) => {
    bad_obs_ids = bad_obs_ids.concat(bad_ids[taxon_id]);
  });

  //prep API calls
  const prefix = "https://api.inaturalist.org/v1/observations";
  const args =
    "?" +
    (extra_args ? extra_args + "&" : "") +
    `taxon_id=${taxa_id_string}&quality_grade=research` +
    (place_id ? "&place_id=" + place_id : "") +
    (mode === "birdsong"
      ? "&sounds=true&sound_license=cc-by,cc-by-nc,cc-by-nd,cc-by-sa,cc-by-nc-nd,cc-by-nc-sa,cc0"
      : "&photos=true&photo_licensed=true") +
    `&not_id=${[...obs_ids_we_have, ...bad_obs_ids].join(",")}`;

  console.log(prefix + args);

  //figure out how many pages we're dealing with if we don't know -------------------

  console.log("Querying to determine n pages");
  const n_results = await fetch(prefix + args + "&only_id=true&per_page=0")
    .then((res) => res.json())
    .then((data) => data.total_results);

  //n_pages * per_page must be strictly less than 10000, or iNaturalist will block
  const quotient = Math.min(n_results, 10000) / per_page;
  const n_pages =
    Math.ceil(quotient) * per_page < 10000
      ? Math.ceil(quotient)
      : Math.floor(quotient);

  console.log(n_pages + " usable pages with per_page=" + per_page);

  //fetch data -------------------------------------------------------------------

  if (n_pages === 0) {
    console.log("n_pages is 0, skipping fetch");
    console.groupEnd();
    return false;
  }
  //get next page and fetch it
  const next_page = Math.ceil(n_pages * Math.random());
  console.log("Fetching page " + next_page);
  const data = await fetch(
    prefix + args + "&per_page=" + per_page + "&page=" + next_page
  ).then((res) => res.json());
  console.log(data);

  // shuffle if popular fetch, so we don't add the same popular ones every time
  if (args.includes("popular=true")) {
    const shuffled = [];
    for (const obj of data.results) {
      const i = Math.floor(shuffled.length * Math.random());
      shuffled.splice(i, 0, obj);
    }
    data.results = shuffled;
  }

  //add to data structures
  for (let i = 0; i < data.results.length; i++) {
    const obj = data.results[i];

    // make sure audio has a working url (not always the case)
    // if not, mark it as a bad id
    if (mode === "birdsong" && !obj.sounds[0].file_url) {
      if (!current.is_squirrel_intruder) addBadId(obj.taxon.id, obj.id, mode); //firebase.js
      continue;
    }

    const id = searchAncestorsForTaxonId(obj);

    // don't add too many popular observations, when fetching only popular observations
    if (args.includes("popular=true")) {
      const n_popular = taxon_obs[id].filter((x) => x.faves_count > 0).length;
      if (n_popular >= MAX_POPULAR_OBS) continue;
    }

    // need to check that we have a place to put the data (in case the game was ended while we were fetching)
    if (taxon_obs.hasOwnProperty(id) && taxon_queues.hasOwnProperty(id)) {
      taxon_obs[id].push(obj);
      taxon_queues[id].push(obj);
    }
  }
  // report if hit popular limit
  if (args.includes("popular=true")) {
    for (const id in taxon_obs) {
      const n_popular = taxon_obs[id].filter((x) => x.faves_count > 0).length;
      if (n_popular >= MAX_POPULAR_OBS) {
        console.log(`hit max popular obs (${MAX_POPULAR_OBS}) for taxon ${id}`);
      }
    }
  }

  console.log("Done adding to data structures");
  console.groupEnd();
  return true;
}

async function fetchUntilThreshold(threshold = 1, delay_between_attempts = 0) {
  //keeps fetching until each taxon in taxon_obs has at least threshold observations
  //requires taxon_obs to be initialized with taxon id keys
  //does prioritization for popular observations etc.
  //returns a promise for when we are done with this, that resolves to {success: true/false, lacking_ids:[...]}
  //delay_between_attempts (ms) is for after we've started, be less aggressive when fetching to be nice to iNaturalist

  console.log("FETCH UNTIL THRESHOLD " + threshold);

  let kill_index = kill_fetch_until_threshold.length;
  kill_fetch_until_threshold.push(false);

  let lacking_ids;
  let trying_popular = true;
  let trying_no_photos = mode === "birdsong";
  let popular_attempts =
    mode === "birdsong"
      ? BIRDSONG_POPULAR_ATTEMPTS
      : VISUAL_ID_POPULAR_ATTEMPTS;

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
    //figure out ids with less than threshold, and check if we're done
    lacking_ids = Object.keys(taxon_obs).filter(
      (id) => taxon_obs[id].length < threshold
    );
    if (lacking_ids.length === 0) {
      console.log("THRESHOLD OF " + threshold + " MET");
      return { success: true };
    }

    //prepare fetch
    console.log("ids w < " + threshold + " obs", lacking_ids);
    if (trying_popular && attempt > popular_attempts) {
      trying_popular = false;
      console.warn(
        "stopped trying popular b/c attempt #" +
          attempt +
          " > " +
          popular_attempts
      );
    }
    let extra_args = [];
    if (trying_popular) extra_args.push("popular=true");
    if (trying_no_photos) extra_args.push("photos=false");

    //fetch data, handle if couldn't get any
    let was_data_fetched = await fetchObservationData(
      lacking_ids,
      extra_args.join("&")
    );
    if (!was_data_fetched) {
      if (trying_popular) {
        trying_popular = false;
        console.warn("stopped trying popular because no data fetched");
      } else if (trying_no_photos) {
        trying_no_photos = false;
        console.warn("stopped trying no photos because no data fetched");
      } else {
        console.log(
          "Not enough observations to reach threshold of " +
            threshold +
            "\nTaxon ids remaining: " +
            lacking_ids.join(",")
        );
        return {
          success: false,
          lacking_ids: lacking_ids,
          failure_reason: "not_enough_observations",
        };
      }
    }

    //pause for the specified duration
    await new Promise((resolve) => setTimeout(resolve, delay_between_attempts));
    if (kill_fetch_until_threshold[kill_index]) {
      console.log("FETCH UNTIL THRESHOLD KILLED");
      return {
        success: false,
        lacking_ids: lacking_ids,
        failure_reason: "fetch_until_threshold_killed",
      };
    }
  }
  console.warn(
    `Exceeded max (${MAX_FETCH_ATTEMPTS}) number of attempts to fetch until threshold of ${threshold}\nTaxon ids remaining: ${lacking_ids.join()}`
  );
  return {
    success: false,
    lacking_ids: lacking_ids,
    failure_reason: "exceeded_max_attempts",
  };
}

function nextObservation() {
  //when we load an observation, it gets copied into the 'current' global var

  current = next;
  next = pickObservation();
  console.log("current", current);

  let taxon_id = searchAncestorsForTaxonId(current);
  let taxon_obj = taxa_to_use.find((obj) => obj.id === taxon_id);
  if (current.is_squirrel_intruder) {
    taxon_obj = squirrel_taxon_obj;
  }

  //set taxon HTML (not necessarily displayed yet, see game_display.scss)
  document.getElementById("answer-common-name").textContent =
    taxon_obj.preferred_common_name || taxon_obj.name; // fall back onto scientific name
  document.getElementById("answer-scientific-name").textContent =
    taxon_obj.name;
  document.getElementById("answer-species-name-appended").textContent =
    taxon_obj.rank === "species"
      ? ""
      : current.taxon.preferred_common_name
      ? " - " + current.taxon.preferred_common_name
      : "";
  document.getElementById("answer-info-link").href = getInfoURL(
    taxon_obj,
    mode
  );
  document.getElementById("observation-link").href = current.uri;

  //reset HTML from answer screen
  document.getElementById("guess-input").value = "";
  document.getElementById("guess-input").readOnly = false;
  document
    .getElementById("bird-grid")
    .querySelectorAll(".bird-grid-option.selected")
    .forEach((el) => {
      el.classList.remove("selected");
    });
  document.getElementById("image-attribution").classList.remove("visible");
  document
    .querySelectorAll(".mark-as-bad-button")
    .forEach((el) => el.classList.remove("marked"));

  //game mode specific stuff

  let photo; //stored here for attribution later

  if (mode === "birdsong") {
    document.getElementById("birdsong-question").innerHTML = getQuestionHTML(
      mode,
      taxon_obj,
      current.is_squirrel_intruder
    ); // see config.js

    //set answer image ahead of time so it can load
    let bird_image = document.getElementById("bird-image");
    if (
      current.photos &&
      current.photos[0] &&
      current.photos[0].license_code !== null
    ) {
      photo = current.photos[0];
      bird_image.src = photo.url.replace("square", "medium");
    } else {
      if (taxon_obj.rank === "species" && taxon_obj.default_photo) {
        photo = taxon_obj.default_photo;
        bird_image.src = taxon_obj.default_photo.medium_url;
      } else if (current.taxon.default_photo) {
        photo = current.taxon.default_photo;
        bird_image.src = current.taxon.default_photo.medium_url;
      } else {
        bird_image.src = "";
      }
    }
    //audio
    document.getElementById("birdsong-audio-0").src =
      current.sounds[0].file_url;
    let audio1 = document.getElementById("birdsong-audio-1");
    if (current.sounds[1]) {
      audio1.src = current.sounds[1].file_url;
    } else {
      audio1.pause();
      audio1.removeAttribute("src");
    }
    // note: spectrogram stuff happens automatically when audio src changed
    // misc
    document.getElementById("bird-grid").scrollTop = 0;

    //start loading the next observation's audio
    //the event listener on the preloader will try to change the choice for 'next' if the audio is too long
    audio_preloader.src = next.sounds[0].file_url;
  } else if (mode === "visual_id") {
    document.getElementById("visual-id-question").innerHTML = getQuestionHTML(
      mode,
      taxon_obj
    ); // see config.js

    document.getElementById("img-preloader").src = next.photos[0].url.replace(
      "square",
      "large"
    );
    document.getElementById("bird-image").src = current.photos[0].url.replace(
      "square",
      "large"
    );
    photo = current.photos[0];
  }

  // spectrogram visibility - needs to be done in JS because squirrel intruders are edge case
  const birdImgContainer = document.getElementById("bird-image-container");
  if (
    mode === "birdsong" &&
    data_source === "ebird_calls" &&
    !current.is_squirrel_intruder
  ) {
    birdImgContainer.classList.add("spectrogram-visible");
  } else {
    birdImgContainer.classList.remove("spectrogram-visible");
  }

  //image attribution
  if (photo) {
    document.getElementById("image-attribution").textContent =
      photo.attribution;
    document.getElementById("image-copyright-type").textContent =
      photo.license_code === "cc0"
        ? "CC0"
        : photo.license_code === null
        ? "C"
        : "CC";
  }

  //reset zoom (don't want it to be zoomed in by default)
  bird_image_zoom_factor = 1;
  document.getElementById("bird-image").style.transform = "initial";

  // description
  let descriptionDisplay = "";
  if (current.description) {
    let words = current.description.split(" ").slice(0, MAX_DESCRIPTION_WORDS);
    descriptionDisplay = "Notes - " + words.join(" ");
    if (words.length === MAX_DESCRIPTION_WORDS) {
      descriptionDisplay += " ...";
    }
  }
  document.getElementById("description").textContent = descriptionDisplay;

  setGameState(GUESSING);
}

function checkAnswer() {
  let guess_input = document.getElementById("guess-input");
  guess_input.readOnly = true;
  guess_input.blur();
  let guess = guess_input.value;

  //find taxon object that matches the guess, if it exists
  //concat with the squirrel taxon to check for correctness of squirrel intruder
  let guess_obj = list_taxa
    .concat([squirrel_taxon_obj])
    .find(
      (obj) =>
        guess.toLowerCase() === obj.name.toLowerCase() ||
        (obj.preferred_common_name &&
          guess.toLowerCase() === obj.preferred_common_name.toLowerCase())
    );

  let correct = Boolean(
    guess_obj &&
      (current.taxon.id === guess_obj.id ||
        current.taxon.ancestor_ids.includes(guess_obj.id))
  );
  document.getElementById("game-main").dataset.correct =
    guess.length > 0 ? correct : "no-guess";

  //update taxon picking probabilities and user data (if storing)
  //don't do anything if squirrel intruder, those are jokes
  if (!current.is_squirrel_intruder) {
    if (correct) {
      updateTaxonBag(guess_obj.id, -CORRECT_REMOVE_COPIES);
      updateTaxonProficiency(guess_obj.id, true);
      updateTaxonReviewedTimestamp(guess_obj.id);
    } else {
      // incorrect or skipped
      const correct_id = searchAncestorsForTaxonId(current);
      if (guess_obj) {
        // incorrect
        updateTaxonBag(guess_obj.id, INCORRECT_ADD_COPIES);
        updateTaxonBag(correct_id, INCORRECT_ADD_COPIES);
        updateTaxonProficiency(guess_obj.id, false);
        updateTaxonProficiency(correct_id, false);
      } else {
        // no guess
        updateTaxonBag(correct_id, NO_GUESS_ADD_COPIES);
      }
    }
  }

  setGameState(ANSWER_SHOWN);
}

function updateTaxonBag(taxon_id, delta) {
  let n_copies_in_bag = taxon_bag.filter((id) => id === taxon_id).length;
  let target = Math.max(
    1,
    Math.min(MAX_TAXON_BAG_COPIES, n_copies_in_bag + delta)
  );
  let true_delta = target - n_copies_in_bag;
  if (true_delta < 0) {
    for (let i = 0; i < Math.abs(true_delta); i++) {
      taxon_bag.splice(taxon_bag.indexOf(taxon_id), 1);
    }
  } else if (true_delta > 0) {
    for (let i = 0; i < true_delta; i++) {
      taxon_bag.push(taxon_id);
    }
  }
  // if reached one copy, this species has been passed at the current difficulty
  if (target === 1) {
    updateTaxonDifficultyAchieved(taxon_id, taxa_to_use.length);
  }

  updateProgressBar();
}

function updateProgressBar() {
  // update proficiency progress bar, which is based on the taxon bag
  const progress_bar = document.getElementById("game-progress");
  // for each taxon, count how many copies have been removed from the taxon bag compared to the start
  // if there are more copies of a taxon in the bag than we started with, consider this having removed 0 copies
  // 100% progress = max copies removed (only 1 of each taxon remains)
  const removed_counts = {};
  taxon_bag.forEach((id) => {
    if (!(id in removed_counts)) removed_counts[id] = START_TAXON_BAG_COPIES; // if haven't seen any yet, assume all removed
    removed_counts[id] = Math.max(0, removed_counts[id] - 1);
  });
  const n_taxa = Object.keys(removed_counts).length;
  if (n_taxa > 0) {
    // avoid divide by 0
    const max_possible_removed = n_taxa * (START_TAXON_BAG_COPIES - 1);
    let total_removed = 0;
    Object.values(removed_counts).forEach((count) => (total_removed += count));
    const progress_value = total_removed / max_possible_removed;
    progress_bar.value = progress_value;

    if (progress_value === 1 && !already_notified_full_progress_bar) {
      already_notified_full_progress_bar = true;
      setTimeout(
        () =>
          alert(
            "Wow, you're doing amazing at this! Consider trying a different set of species, since you seem to have this set down?"
          ),
        300
      );
    }
  }
}

function scheduleFunnyBird() {
  funny_bird = document.getElementById("funny-bird");
  if (funny_bird.dataset.clicked) return;

  //set next location
  let locations = ["from-top", "from-left", "from-bottom"];
  let location = locations[Math.floor(Math.random() * locations.length)];
  funny_bird.classList.remove("enable-transition");
  locations.forEach((s) => funny_bird.classList.remove(s));
  funny_bird.classList.add(location);

  //schedule when it gets shown
  funny_bird_timeout_id = setTimeout(() => {
    funny_bird.classList.add("enable-transition", "out");

    //hide the bird after a certain duration
    setTimeout(() => {
      funny_bird.classList.remove("out");
      funny_bird.addEventListener("transitionend", scheduleFunnyBird, {
        once: true,
      });
    }, FUNNY_BIRD_LEAVE_DELAY);
  }, getFunnyBirdDelay());
}

// for debugging / testing
function instaSucceed() {
  while (taxon_bag.length > taxa_to_use.length) {
    const guess_input = document.getElementById("guess-input");
    guess_input.value = current.taxon.preferred_common_name;
    checkAnswer();
    nextObservation();
  }
}
