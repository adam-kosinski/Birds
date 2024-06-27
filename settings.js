document.querySelectorAll(".settings-button").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("settings-modal").style.display = "flex";
    });
});
document.getElementById("close-settings").addEventListener("click", () => {
    document.getElementById("settings-modal").style.display = "none";
});
document.getElementById("allow-all-taxa").addEventListener("change", (e) => {
    localStorage.setItem("setting:allow-all-taxa", e.target.checked);
    updateSearchFiltering(e.target.checked);
});



function updateSearchFiltering(allow_all_taxa) {
    only_search_for_birds = !allow_all_taxa;  // see add_remove_birds.js
    document.getElementById("add-bird-input").placeholder = `Search for ${allow_all_taxa ? 'taxon' : 'bird'} to add`
}



// load from local storage
function loadLocalStorage() {
    let allow_all_taxa;
    switch (localStorage.getItem("setting:allow-all-taxa")) {
        case "true": allow_all_taxa = true; break;
        case "false": allow_all_taxa = false; break;
        case null:
            console.log("Setting initial allow_all_taxa=false");
            allow_all_taxa = false; // default value  
            localStorage.setItem("setting:allow-all-taxa", allow_all_taxa);
    }
    document.getElementById("allow-all-taxa").checked = allow_all_taxa;
    updateSearchFiltering(allow_all_taxa);
}

loadLocalStorage();