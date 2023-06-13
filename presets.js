initPresets();

function initPresets(){
    let list = document.getElementById("preset-list");

    for(const [name, obj] of Object.entries(presets)){
        let container = document.createElement("div");
        container.className = "preset";

        let title = document.createElement("p");
        title.className = "preset-title";
        title.textContent = name;

        container.append(title);
        list.append(container);
    }
}