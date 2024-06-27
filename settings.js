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
})


function applySetting(name, value) {
    if (name === "allow-all-taxa") {
        document.getElementById("add-bird-input").placeholder = `Search for ${value ? 'taxon' : 'bird'} to add`;
    }
    if (name === "store-progress") {
        const bird_list = document.getElementById("bird-list");
        if(value) bird_list.classList.add("show-taxa-progress");
        else bird_list.classList.remove("show-taxa-progress");
    }
}


function loadBooleanSetting(name, default_value) {
    switch (localStorage.getItem(`setting:${name}`)) {
        case "true": return true;
        case "false": return false;
        case null: return default_value;
    }
}



// load from local storage

function loadLocalStorage() {
    let allow_all_taxa = loadBooleanSetting("allow-all-taxa", false);
    document.getElementById("allow-all-taxa").checked = allow_all_taxa;
    applySetting("allow-all-taxa", allow_all_taxa);

    let store_progress = loadBooleanSetting("store-progress", false);
    document.getElementById("store-progress").checked = store_progress;
    applySetting("store-progress", store_progress);
}

loadLocalStorage();