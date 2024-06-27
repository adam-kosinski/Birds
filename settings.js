document.querySelectorAll(".settings-button").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("settings-modal").style.display = "flex";
    });
});
document.getElementById("close-settings").addEventListener("click", () => {
    document.getElementById("settings-modal").style.display = "none";
});
document.getElementById("allow-searching-all-taxa").addEventListener("change", (e) => {
    updateSearchFiltering(e.target.checked);
});



function updateSearchFiltering(allow_all_taxa){
    only_search_for_birds = !allow_all_taxa;  // see add_remove_birds.js
    document.getElementById("add-bird-input").placeholder = `Search for ${allow_all_taxa ? 'taxon' : 'bird'} to add`
}