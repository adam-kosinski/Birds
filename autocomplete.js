//autocomplete list stuff

function initAutocomplete(
  input_id,
  list_id,
  get_api_endpoint,
  result_callback,
  select_callback
) {
  /*
    get_api_endpoint is a function that returns the api endpoint when called - need a function b/c the endpoint can change based on user settings
    result_callback is a function to call for each result object,
    select_callback is a function to call when a user clicks an autocomplete option
    */

  let autocomplete_timeout_id;
  let input = document.getElementById(input_id);
  let list = document.getElementById(list_id);

  //update autocomplete
  input.addEventListener("input", (e) => {
    clearTimeout(autocomplete_timeout_id); //works even if undefined

    if (input.value.length === 0) {
      list.style.display = "none";
    } else {
      autocomplete_timeout_id = setTimeout(() => {
        updateAutocomplete(
          input_id,
          list_id,
          get_api_endpoint,
          result_callback
        );
      }, AUTOCOMPLETE_DELAY);
    }
  });

  //selecting an autocomplete option
  list.addEventListener("click", (e) => {
    let option = e.target.closest(".autocomplete-option");
    if (option && !e.target.classList.contains("range-map-icon")) {
      select_callback(option);
      input.value = "";
      list.style.display = "none";
    }
  });

  //close list if click off it, or press Esc
  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest("#" + input_id) && !e.target.closest("#" + list_id)) {
      list.style.display = "none";
      input.blur();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      list.style.display = "none";
      input.blur();
    }
  });

  //reopen list if click back on
  input.addEventListener("focus", (e) => {
    if (input.value.length > 0)
      updateAutocomplete(input_id, list_id, get_api_endpoint, result_callback);
  });
}

function updateAutocomplete(
  input_id,
  list_id,
  get_api_endpoint,
  result_callback
) {
  // console.log(get_api_endpoint());
  let query = document.getElementById(input_id).value;
  fetch(
    get_api_endpoint() + "&q=" + query + "&per_page=" + N_AUTOCOMPLETE_RESULTS
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log("autocomplete results", data);

      let list = document.getElementById(list_id);
      list.innerHTML = "";

      for (
        let k = 0;
        k < Math.min(data.results.length, N_AUTOCOMPLETE_RESULTS);
        k++
      ) {
        //for loop because sometimes extra results are returned
        let list_option = document.createElement("button");
        list_option.className = "autocomplete-option";
        let ignore_result =
          false === result_callback(data.results[k], list_option);
        if (!ignore_result) list.append(list_option);
      }

      if (data.results.length === 0) {
        let p = document.createElement("p");
        p.textContent = "No results found";
        list.append(p);
      }

      list.style.display = "block";
    });
}
