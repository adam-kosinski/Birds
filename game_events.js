//movement between screens
document.getElementById("start-game-button").addEventListener("click", () => {
    initBirdsongGame();
});

document.getElementById("back-to-list").addEventListener("click", () => {
    document.getElementById("birdsong-audio").pause(); //don't keep playing the birdsong
    document.getElementById("list-screen").style.display = "flex";
    document.getElementById("birdsong-screen").style.display = "none";

    //reset vars
    obs = [];
    taxon_obs = {};
    page_order = [];
    current = undefined;
});


//bird selection
let bird_grid = document.getElementById("bird-grid");
bird_grid.addEventListener("click", (e) => {

    let bird_grid_option = e.target.closest(".bird-grid-option");
    if(bird_grid_option){
        bird_grid.querySelectorAll(".bird-grid-option.selected").forEach(el => {
            el.classList.remove("selected");
        });
        bird_grid_option.classList.add("selected");

        //update text input
        document.getElementById("guess-input").value = bird_grid_option.dataset.commonName;
    }
});


//autofocus guess input
document.addEventListener("keypress", (e) => {
    //if typed a single letter, focus the input (avoid stuff like space or the Enter key)
    if(/^[a-zA-Z]$/.test(e.key) && getComputedStyle(document.getElementById("birdsong-screen")).display == "block"){
        document.getElementById("guess-input").focus();
    }
})