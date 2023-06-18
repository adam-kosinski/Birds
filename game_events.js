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
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("start-game-button").removeAttribute("disabled");

    //reset vars
    obs = [];
    taxon_obs = {};
    taxon_queues = {};
    taxon_bag = [];
    n_pages_by_query = {};
    current = undefined;
    setGameState(INACTIVE);

    //kill ongoing fetch until threshold
    for (let i=0; i<kill_fetch_until_threshold.length; i++){
        kill_fetch_until_threshold[i] = true;
    }
    //reset funny bird
    if(funny_bird_timeout_id){
        clearTimeout(funny_bird_timeout_id);
    }
    funny_bird.removeAttribute("data-clicked");
    funny_bird.removeAttribute("style"); //reset the changed transition duration


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
    setMode(mode_button.dataset.mode);
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
            e.preventDefault();
            checkAnswer();
        }
        else if (game_state === ANSWER_SHOWN) {
            e.preventDefault();
            nextObservation();
        }
    }

    //if typed a single letter, focus the guess input (avoid stuff like space or the Enter key)
    if (/^[a-zA-Z]$/.test(e.key) && getComputedStyle(document.getElementById("game-screen")).display == "block") {
        document.getElementById("guess-input").focus();
    }
});


//check answer
document.getElementById("guess-button").addEventListener("click", checkAnswer);

//next observation
document.getElementById("correct-button").addEventListener("click", nextObservation);
document.getElementById("incorrect-button").addEventListener("click", nextObservation);
document.getElementById("neutral-next-button").addEventListener("click", nextObservation);


//autoplay second audio when first finishes
document.getElementById("birdsong-audio-0").addEventListener("ended", () => {
    let audio1 = document.getElementById("birdsong-audio-1");
    if (audio1.hasAttribute("src")) {
        audio1.play();
    }
});


//image attribution

//do this styling with javascript + hacky CSS because can't wrap the bird-image in a div or iOS goes crazy
let image_resize_observer = new ResizeObserver((entries) => {
    let img_width = entries[0].contentBoxSize[0].inlineSize;
    document.getElementById("image-attribution-container").style.width = img_width + "px";
});
image_resize_observer.observe(document.getElementById("bird-image"));

//show-hide attribution text
document.addEventListener("click", e => {
    let button = e.target.closest("#image-attribution-button");
    if(button){
        document.getElementById("image-attribution").classList.toggle("visible");
    }
    else {
        document.getElementById("image-attribution").classList.remove("visible");
    }
});


//funny bird
let hawk_screech = new Audio("hawk_screech.mp3");
document.getElementById("funny-bird").addEventListener("click", () => {
    let funny_bird = document.getElementById("funny-bird");
    funny_bird.dataset.clicked = "true"; //stop it from coming out again
    hawk_screech.play();
    setTimeout(() => {
        funny_bird.style.transitionDuration = "1.5s";
        funny_bird.classList.remove("out");
    }, 750);
});