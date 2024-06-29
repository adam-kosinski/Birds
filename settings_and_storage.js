// open and close modal
document.querySelectorAll(".settings-button").forEach(button => {
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
        if (!confirm("Are you sure you want to stop storing your progress? All of your data will be lost.")) {
            e.target.checked = true;
            return;
        }
        // clear taxon info
        // TODO
    }
    localStorage.setItem("setting:store-progress", e.target.checked);
    applySetting("store-progress", e.target.checked);
});


function applySetting(name, value) {
    if (name === "allow-all-taxa") {
        document.getElementById("add-bird-input").placeholder = `Search for ${value ? 'taxon' : 'bird'} to add`;
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
}


function clearData(){
    const keys = Object.keys(localStorage);
    for(let key of keys){
        if(key.startsWith("taxon")){
            localStorage.removeItem(key);
        }
    }
    // set displays back to 0 so if we re-enable the setting old data isn't showing
    document.querySelectorAll(".taxon-progress").forEach(el => {
        el.style.borderLeftWidth = 0;
    });
}


function refreshTaxonProficiencyDisplay(taxon_id, mode) {
    const progress_bar = document.querySelector(`#bird-list-${taxon_id} .taxon-progress`);
    const proficiency = loadProficiency(taxon_id, mode);
    const full_progress_width = getComputedStyle(progress_bar).getPropertyValue("--width");
    progress_bar.style.borderLeftWidth = `calc(${proficiency} * ${full_progress_width})`;
}


function updateTaxonProficiency(taxon_id, mode, answered_correctly) {
    // don't store anything if the user doesn't want us to
    if (!loadBooleanSetting("store-progress", false)) return;

    const prev_answers = loadProficiency(taxon_id, mode, true);
    prev_answers.push(answered_correctly ? 1 : 0);
    // remove old answers we don't care about anymore
    while (prev_answers.length > N_ANSWERS_TO_STORE) prev_answers.shift();
    // store
    localStorage.setItem(`taxon-${taxon_id}-${mode}`, JSON.stringify(prev_answers));
    
    // update display
    refreshTaxonProficiencyDisplay(taxon_id, mode);
}


function loadBooleanSetting(name, default_value) {
    switch (localStorage.getItem(`setting:${name}`)) {
        case "true": return true;
        case "false": return false;
        case null: return default_value;
    }
}

function loadProficiency(taxon_id, mode, return_array = false) {
    let prev_answers = [];
    const storage_string = localStorage.getItem(`taxon-${taxon_id}-${mode}`);
    if (storage_string !== null) prev_answers = JSON.parse(storage_string);

    // return raw data if that's what we want
    if (return_array) return prev_answers;

    // return average correctness - correct answer is 1 and incorrect is 0
    // assume if fewer than N_ANSWERS_TO_STORE questions were answered, all remaining ones were "wrong" (so the user has to build up from 0 proficiency)
    while (prev_answers.length < N_ANSWERS_TO_STORE) prev_answers.push(0);
    return prev_answers.reduce((accumulator, current) => accumulator + current, 0) / prev_answers.length;
}


function loadLocalStorage() {
    let allow_all_taxa = loadBooleanSetting("allow-all-taxa", false);
    document.getElementById("allow-all-taxa").checked = allow_all_taxa;
    applySetting("allow-all-taxa", allow_all_taxa);

    let store_progress = loadBooleanSetting("store-progress", false);
    document.getElementById("store-progress").checked = store_progress;
    applySetting("store-progress", store_progress);
}

loadLocalStorage();



// transferring data to another device

function getTaxonStorageString() {
    const taxon_data = Object.entries(localStorage).filter(a => a[0].startsWith("taxon"));
    return JSON.stringify(taxon_data);
}
function loadTaxonStorageString(s) {
    clearData();
    const taxon_data = JSON.parse(s);
    for(const [k, v] of taxon_data){
        localStorage[k] = v;
    }
    // reload to update the progress bars
    window.location = window.location;
}