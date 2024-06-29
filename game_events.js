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

    //update auto-selection if setting is enabled
    if(loadBooleanSetting("auto-select-recommended", false)){
        selectRecommended();
    }

    //reset vars
    obs = [];
    taxa_to_use = []; //probably don't need to reset, but just in case
    taxon_obs = {};
    taxon_queues = {};
    taxon_bag = [];
    n_pages_by_query = {};
    current = undefined;
    already_notified_full_progress_bar = false;
    setGameState(INACTIVE);

    //kill ongoing fetch until threshold
    for (let i = 0; i < kill_fetch_until_threshold.length; i++) {
        kill_fetch_until_threshold[i] = true;
    }
    //reset funny bird
    if (funny_bird_timeout_id) {
        clearTimeout(funny_bird_timeout_id);
    }
    funny_bird.removeEventListener("transitionend", scheduleFunnyBird);
    funny_bird.removeAttribute("data-clicked");
    funny_bird.removeAttribute("style"); //reset the changed transition duration

    //reset datalist
    document.getElementById("guess-datalist").innerHTML = "";

    // reset progress bar
    document.getElementById("game-progress").value = 0;
});

//save list
document.getElementById("save-list").addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href);
    alert("The current list is encoded in the URL, which has been copied to your clipboard. To save this list, save this URL somewhere. Visiting this URL will load this list. You can also bookmark this page.");
});

//switch mode
document.getElementById("mode-toggle").addEventListener("click", e => {
    let mode_button = e.target.closest("button");
    if (!mode_button) return;
    setMode(mode_button.dataset.mode);
});



// bird selection during the game
let bird_grid = document.getElementById("bird-grid");
bird_grid.addEventListener("click", (e) => {

    let bird_grid_option = e.target.closest(".bird-grid-option");
    if (!bird_grid_option) return;

    let originally_selected = bird_grid_option.classList.contains("selected");
    bird_grid.querySelectorAll(".bird-grid-option.selected").forEach(el => {
        el.classList.remove("selected");
    });
    if (!originally_selected) bird_grid_option.classList.add("selected");

    //update text input
    document.getElementById("guess-input").value = originally_selected ? "" : bird_grid_option.dataset.commonName;

});



//bird list bird selection

function toggleListSelection(taxon_id){
    const bird_list_item = document.getElementById("bird-list-" + taxon_id);
    bird_list_item.classList.toggle("selected");
    document.getElementById("n-selected").textContent = document.querySelectorAll("#bird-list .selected").length;
}
function clearListSelection(){
    document.querySelectorAll("#bird-list .selected").forEach(el => {
        el.classList.remove("selected");
    });
}
document.getElementById("clear-selection").addEventListener("click", clearListSelection);
document.getElementById("select-recommended").addEventListener("click", selectRecommended);

function selectRecommended() {
    if (bird_taxa.length === 0) return;

    let recommended_ids = [];

    if (loadBooleanSetting("store-progress", false)) {
        // recommend based on proficiency level
        const proficiencies = []; // each element is [taxon_id, proficiency]
        bird_taxa.forEach(taxon => proficiencies.push([taxon.id, loadProficiency(taxon.id, mode)]));
        // sort ascending
        proficiencies.sort(([id1, a], [id2, b]) => a - b);
        // if any low proficiency, recommend 4 so they can learn in a simple setting
        if (proficiencies[0][1] < MEDIUM_PROFICIENCY_THRESHOLD) {
            recommended_ids = proficiencies.slice(0, 4).map(([id, value]) => id);
        }
        // if all medium or above, recommend 8 to strengthen
        else if (proficiencies[0][1] < HIGH_PROFICIENCY_THRESHOLD) {
            recommended_ids = proficiencies.slice(0, 8).map(([id, value]) => id);
        }
        // if all high proficiency, do the whole set
        else {
            recommended_ids = proficiencies.map(([id, value]) => id);
        }
    }
    else {
        // not storing proficiencies, just pick a random 4
        const taxon_ids = bird_taxa.map(taxon => taxon.id);
        for(let i=0; i<4; i++){
            const idx = Math.floor(taxon_ids.length * Math.random());
            recommended_ids.push(taxon_ids.splice(idx, 1)[0]);
        }
    }
    // select
    clearListSelection();
    recommended_ids.forEach(id => toggleListSelection(id));
    // show the user what we selected by moving them to the top and highlighting
    const bird_list = document.getElementById("bird-list");
    recommended_ids.toReversed().forEach(id => {
        const bird_list_item = document.getElementById("bird-list-" + id);
        bird_list.prepend(bird_list_item);
        highlightElement(bird_list_item);
    });
}


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


//bird image parent aspect ratio resizing
let bird_image = document.getElementById("bird-image")
bird_image.addEventListener("load", () => {
    document.getElementById("bird-image-parent-div").style.aspectRatio = bird_image.naturalWidth + " / " + bird_image.naturalHeight;
})


//show-hide attribution text
document.addEventListener("click", e => {
    let button = e.target.closest("#image-attribution-button");
    if (button) {
        document.getElementById("image-attribution").classList.toggle("visible");
    }
    else {
        document.getElementById("image-attribution").classList.remove("visible");
    }
});


//desktop hover zoom
let bird_image_zoom_factor = 1;

document.addEventListener("mousemove", updateBirdImageZoom);

document.getElementById("bird-image").addEventListener("wheel", e => {
    let new_zoom = bird_image_zoom_factor - e.deltaY / 200
    bird_image_zoom_factor = Math.max(1, Math.min(MAX_BIRD_IMAGE_ZOOM_FACTOR, new_zoom));
    updateBirdImageZoom(e);
});

document.getElementById("bird-image").addEventListener("click", e => {
    let cursor = getComputedStyle(document.getElementById("bird-image")).cursor;
    bird_image_zoom_factor = cursor == "zoom-in" ? MAX_BIRD_IMAGE_ZOOM_FACTOR : 1;
    updateBirdImageZoom(e);
});

function updateBirdImageZoom(e) {
    //disable zoom on mobile
    if (!matchMedia("(hover: hover)").matches) return;

    //only do this for visual id
    if (mode != "visual_id") return;

    let transform = "initial";
    if (e.target.id == "bird-image") {
        let parent = document.getElementById("bird-image-parent-div");
        let rect = parent.getBoundingClientRect()

        //get content rect (client rect includes border)
        let border_size = Number(getComputedStyle(parent).borderWidth.split("px")[0])
        let content = {
            x: rect.x + border_size,
            y: rect.y + border_size,
            width: rect.width - 2 * border_size,
            height: rect.height - 2 * border_size
        }
        let fracX = (e.clientX - content.x) / content.width;
        let fracY = (e.clientY - content.y) / content.height;
        fracX = Math.max(0, Math.min(1, fracX)) //sometimes it goes slightly negative, probably a rounding error
        fracY = Math.max(0, Math.min(1, fracY))

        let x_range = content.width * bird_image_zoom_factor - content.width;
        let y_range = content.height * bird_image_zoom_factor - content.height;
        transform = `translate(${-(fracX - 0.5) * x_range}px, ${-(fracY - 0.5) * y_range}px) scale(${bird_image_zoom_factor})`
    }
    else {
        //if not targeting the bird image
        bird_image_zoom_factor = 1; //reset
    }
    document.getElementById("bird-image").style.transform = transform;
    document.getElementById("bird-image").style.cursor = bird_image_zoom_factor == MAX_BIRD_IMAGE_ZOOM_FACTOR ? "zoom-out" : "zoom-in";
}


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