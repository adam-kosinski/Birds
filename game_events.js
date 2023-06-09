//movement between screens
document.getElementById("start-game-button").addEventListener("click", e => {
    e.target.disabled = true;
    document.getElementById("add-bird-input").value = "";
    setGameState(GUESSING); //prevent adding or removing birds
    initBirdsongGame();
});

document.getElementById("back-to-list").addEventListener("click", () => {
    //don't keep playing the birdsong
    document.getElementById("birdsong-audio-0").pause();
    document.getElementById("birdsong-audio-1").pause();

    //change screens
    document.getElementById("list-screen").style.display = "flex";
    document.getElementById("birdsong-screen").style.display = "none";
    document.getElementById("start-game-button").removeAttribute("disabled");

    //reset vars
    obs = [];
    taxon_obs = {};
    n_pages_by_query = {};
    current = undefined;
    setGameState(INACTIVE);

    //reset datalist
    document.getElementById("guess-datalist").innerHTML = "";
});

//save list
document.getElementById("save-list").addEventListener("click", () => {
    alert("The current bird list is encoded in the URL. To save this list, copy the URL and save it somewhere. Visiting this URL will load this bird list.");
});

//switch mode
document.getElementById("mode-toggle").addEventListener("click", e => {
    let mode_button = e.target.closest("button");
    if (!mode_button) return;

    document.querySelectorAll("#mode-toggle button").forEach(el => el.classList.remove("selected"));
    mode_button.classList.add("selected");
    mode = mode_button.dataset.mode;
    document.getElementById("birdsong-main").dataset.mode = mode;

    //update links
    document.querySelectorAll("#bird-list a").forEach(a => {
        a.href = getAllAboutBirdsURL(a.dataset.commonName);
    });
});


//bird selection
let bird_grid = document.getElementById("bird-grid");
bird_grid.addEventListener("click", (e) => {

    let bird_grid_option = e.target.closest(".bird-grid-option");
    if (bird_grid_option) {
        let originally_selected = bird_grid_option.classList.contains("selected");
        bird_grid.querySelectorAll(".bird-grid-option.selected").forEach(el => {
            el.classList.remove("selected");
        });
        if (!originally_selected) bird_grid_option.classList.add("selected");

        //update text input
        document.getElementById("guess-input").value = originally_selected ? "" : bird_grid_option.dataset.commonName;
    }
});


//keypress handling
document.addEventListener("keypress", (e) => {

    if (e.key == "Enter") {
        if (game_state === GUESSING) {
            checkAnswer();
        }
        else if (game_state === ANSWER_SHOWN) {
            nextObservation();
        }
    }

    //if typed a single letter, focus the guess input (avoid stuff like space or the Enter key)
    if (/^[a-zA-Z]$/.test(e.key) && getComputedStyle(document.getElementById("birdsong-screen")).display == "block") {
        document.getElementById("guess-input").focus();
    }
});


//check answer
document.getElementById("guess-button").addEventListener("click", checkAnswer);

//next observation
document.getElementById("correct-button").addEventListener("click", nextObservation);
document.getElementById("incorrect-button").addEventListener("click", nextObservation);


//autoplay second audio when first finishes
document.getElementById("birdsong-audio-0").addEventListener("ended", () => {
    let audio1 = document.getElementById("birdsong-audio-1");
    if (audio1.hasAttribute("src")) {
        audio1.play();
    }
});