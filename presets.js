initPresets();

function initPresets() {
  let list = document.getElementById("preset-list");

  for (const [name, obj] of Object.entries(PRESETS)) {
    let container = document.createElement("div");
    container.className = "preset";

    let title = document.createElement("div");
    title.className = "preset-title";

    let img = document.createElement("img");
    img.src = obj.photo;
    let preset_name = document.createElement("p");
    preset_name.textContent = name;

    let link = document.createElement("a");
    link.className = "btn-primary";
    link.textContent = "Select";
    let params = new URLSearchParams();
    if (obj.place_id) params.append("place_id", obj.place_id);
    if (obj.taxa.length > 0) params.append("taxa", obj.taxa.flat().join(",")); // if custom groups, taxa won't be flat already
    if (obj.mode) params.append("mode", obj.mode);
    if (obj.data_source) params.append("data_source", obj.data_source);
    if (obj.custom_game_type)
      params.append("custom_game_type", obj.custom_game_type);
    if (obj.custom_groups) params.append("custom_groups", name);
    link.href = "game.html?" + params.toString();

    title.append(img, preset_name, link);

    let description = document.createElement("p");
    description.className = "description";
    description.innerHTML = obj.description;

    container.append(title, description);
    if (list.innerHTML) list.append(document.createElement("hr"));
    list.append(container);
  }
}
