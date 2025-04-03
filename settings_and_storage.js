// open and close modal
document.querySelectorAll(".settings-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("settings-modal").style.display = "flex";
  });
});
document.getElementById("close-settings").addEventListener("click", () => {
  document.getElementById("settings-modal").style.display = "none";
});

// event handlers for changing settings
document.getElementById("allow-all-taxa").addEventListener("change", (e) => {
  localStorage.setItem("setting:allow-all-taxa", e.target.checked);
  applySetting("allow-all-taxa", e.target.checked);
});
document.getElementById("store-progress").addEventListener("change", (e) => {
  if (e.target.checked === false) {
    if (
      !confirm(
        "Are you sure you want to stop storing your progress? All of your data will be lost."
      )
    ) {
      e.target.checked = true;
      return;
    }
  }
  localStorage.setItem("setting:store-progress", e.target.checked);
  applySetting("store-progress", e.target.checked);
});
document
  .getElementById("auto-select-recommended")
  .addEventListener("change", (e) => {
    localStorage.setItem("setting:auto-select-recommended", e.target.checked);
    applySetting("auto-select-recommended", e.target.checked);
  });

function applySetting(name, value) {
  if (name === "allow-all-taxa") {
    document.getElementById("add-bird-input").placeholder = `Search for ${
      value ? "taxon" : "bird"
    } to add`;
  }
  if (name === "store-progress") {
    // show progress bars on main list
    // note: setting the values of the progress bars is done in add_remove_birds.js once the birds have been loaded
    const bird_list = document.getElementById("bird-list");
    if (value) bird_list.classList.add("show-taxa-progress");
    else bird_list.classList.remove("show-taxa-progress");

    // clear out data if no longer storing progress
    if (!value) clearData();
  }
  // nothing special needs to be done for auto-select-recommended, the relevant code will just read from localstorage
}

function clearData() {
  const keys = Object.keys(localStorage);
  for (let key of keys) {
    if (key.startsWith("taxon")) {
      localStorage.removeItem(key);
    }
  }
  // set displays back to 0 so if we re-enable the setting old data isn't showing
  document.querySelectorAll(".taxon-progress").forEach((el) => {
    el.style.borderLeftWidth = 0;
  });
}

function refreshTaxonProficiencyDisplay(taxon_id) {
  const progress_bar = document.querySelector(
    `#bird-list-${taxon_id} .taxon-progress`
  );
  const proficiency = loadTaxonData(taxon_id).proficiency;
  const full_progress_width =
    getComputedStyle(progress_bar).getPropertyValue("--width");
  progress_bar.style.borderLeftWidth = `calc(${proficiency} * ${full_progress_width})`;
}

function loadBooleanSetting(name, default_value) {
  switch (localStorage.getItem(`setting:${name}`)) {
    case "true":
      return true;
    case "false":
      return false;
    case null:
      return default_value;
  }
}

function key(taxon_id) {
  const baseKey = `taxon-${taxon_id}-${mode}`;
  if (data_source === "iNaturalist") return baseKey;
  return baseKey + "-" + data_source;
}

function loadTaxonData(taxon_id, raw = false) {
  // if raw=false, also calculates proficiency, time since reviewed, and default values if missing,
  // since when we call this function we usually want to know these things,
  // and helps avoid redundant reading of localstorage

  let data = {};
  const storage_string = localStorage.getItem(key(taxon_id));
  if (storage_string !== null) data = JSON.parse(storage_string);

  if (raw) return data;

  // default values
  data.taxon_id = taxon_id; // useful to keep this tied to the data
  if (!data.prev_answers) {
    data.prev_answers = [];
  }
  if (!data.difficulty_achieved) {
    data.difficulty_achieved = 0;
  }
  if (!data.reviewed_timestamp) {
    data.reviewed_timestamp = Date.now();
  } // if never started this taxon, make it so time since reviewed is 0 so it doesn't get chosen to review

  // calculate proficiency
  const prev_answers = data.prev_answers.slice(); // slice so we don't mutate this
  // calculate average correctness - correct answer is 1 and incorrect is 0
  // assume if fewer than N_ANSWERS_TO_STORE questions were answered, all remaining ones were "wrong" (so the user has to build up from 0 proficiency)
  while (prev_answers.length < N_ANSWERS_TO_STORE) prev_answers.push(0);
  data.proficiency =
    prev_answers.reduce((accumulator, current) => accumulator + current, 0) /
    prev_answers.length;

  // calculate time since reviewed
  data.hours_since_reviewed =
    (Date.now() - data.reviewed_timestamp) / (60 * 60 * 1000);

  return data;
}

function updateTaxonProficiency(taxon_id, answered_correctly) {
  // don't store anything if the user doesn't want us to
  if (!loadBooleanSetting("store-progress", false)) return;

  const data = loadTaxonData(taxon_id, true);
  const prev_answers = data.prev_answers || [];
  prev_answers.push(answered_correctly ? 1 : 0);
  // remove old answers we don't care about anymore
  while (prev_answers.length > N_ANSWERS_TO_STORE) prev_answers.shift();

  // store
  data.prev_answers = prev_answers;
  localStorage.setItem(key(taxon_id), JSON.stringify(data));

  // update display
  refreshTaxonProficiencyDisplay(taxon_id);
}

function updateTaxonDifficultyAchieved(taxon_id, difficulty) {
  // don't store anything if the user doesn't want us to
  if (!loadBooleanSetting("store-progress", false)) return;

  const data = loadTaxonData(taxon_id, true);
  data.difficulty_achieved = data.difficulty_achieved
    ? Math.max(data.difficulty_achieved, difficulty)
    : difficulty;
  localStorage.setItem(key(taxon_id), JSON.stringify(data));
}

function updateTaxonReviewedTimestamp(taxon_id) {
  // don't store anything if the user doesn't want us to
  if (!loadBooleanSetting("store-progress", false)) return;

  // time is now
  const data = loadTaxonData(taxon_id, true);
  data.reviewed_timestamp = Date.now();
  localStorage.setItem(key(taxon_id), JSON.stringify(data));
}

function clearTaxonData(taxon_id) {
  localStorage.removeItem(key(taxon_id));
}

function loadLocalStorage() {
  let allow_all_taxa = loadBooleanSetting("allow-all-taxa", false);
  document.getElementById("allow-all-taxa").checked = allow_all_taxa;
  applySetting("allow-all-taxa", allow_all_taxa);

  let store_progress = loadBooleanSetting("store-progress", false);
  document.getElementById("store-progress").checked = store_progress;
  applySetting("store-progress", store_progress);

  let auto_select_recommended = loadBooleanSetting(
    "auto-select-recommended",
    false
  );
  document.getElementById("auto-select-recommended").checked =
    auto_select_recommended;
  applySetting("auto-select-recommended", auto_select_recommended);
}

loadLocalStorage();

// exporting / importing data

document.getElementById("export-data-button").addEventListener("click", () => {
  const data_string = getTaxonStorageString();
  navigator.clipboard.writeText(data_string);
  alert("Data has been copied to your clipboard!");
});
document.getElementById("import-data-button").addEventListener("click", () => {
  const data_string = prompt(
    "Please enter the data that was copied from another device. WARNING: this will overwrite any existing data stored on this device."
  );
  if (!data_string) return;
  // set storing data setting to true, otherwise this import makes no sense
  localStorage.setItem("setting:store-progress", true);
  applySetting("store-progress", true);
  loadTaxonStorageString(data_string);
});

function getTaxonStorageString() {
  const taxon_data = Object.entries(localStorage).filter((a) =>
    a[0].startsWith("taxon")
  );
  return JSON.stringify(taxon_data);
}
function loadTaxonStorageString(s) {
  clearData();
  const taxon_data = JSON.parse(s);
  for (const [k, v] of taxon_data) {
    localStorage[k] = v;
  }
  // reload to update the progress bars
  window.location = window.location;
}
