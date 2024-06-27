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
    updateSearchFiltering(e.target.checked);
});
document.getElementById("store-progress").addEventListener("change", (e) => {
    if(e.target.checked === false){
        if(!confirm("Are you sure you want to stop storing your progress? All of your data will be lost.")){
            e.target.checked = true;
            return;
        }
        // clear taxon info
        // TODO
    }

    localStorage.setItem("setting:store-progress", e.target.checked);
})


function updateSearchFiltering(allow_all_taxa) {
    only_search_for_birds = !allow_all_taxa;  // see add_remove_birds.js
    document.getElementById("add-bird-input").placeholder = `Search for ${allow_all_taxa ? 'taxon' : 'bird'} to add`
}



// load from local storage

function loadBooleanSetting(name, default_value){
    switch (localStorage.getItem(`setting:${name}`)) {
        case "true": return true;
        case "false": return false;
        case null: return default_value;      
    }
}

function loadLocalStorage() {
    let allow_all_taxa = loadBooleanSetting("allow-all-taxa", false);
    document.getElementById("allow-all-taxa").checked = allow_all_taxa;
    updateSearchFiltering(allow_all_taxa);

    // let store_progress;
    // switch (localStorage.getItem("setting:store_progress")) {
    //     case "true": allow_all_taxa = true; break;
    //     case "false": allow_all_taxa = false; break;
    //     case null:
    //         console.log("Setting initial allow_all_taxa=false");
    //         allow_all_taxa = false; // default value  
    //         localStorage.setItem("setting:allow-all-taxa", allow_all_taxa);
    // }
    // document.getElementById("allow-all-taxa").checked = allow_all_taxa;
}

loadLocalStorage();