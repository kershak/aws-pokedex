  // Defines the maximum number of Pokemons that we will fetch.

  const MAX_POKEMON = 30;

  // DOM elements for inputs.
  const listContainer = document.querySelector(".list-container");
  const searchInput = document.querySelector("#search-input");
  const numberFilter = document.querySelector("#number");
  const nameFilter = document.querySelector("#name");
  const notFoundMessage = document.querySelector("#not-found-message");

  // Array where pokemons will be store after fetch.
  let pokemonList = [];

  // Fetch pokemon data
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
    .then((response) => response.json())
    .then((data) => { 
      pokemonList = data.results;
      displayPokemons(pokemonList);
    });

  // Function to display Pokemon data list
  function displayPokemons(pokemon) {
    // Clear the existing content.
    listContainer.innerHTML = "";

    // Iterate each pokemon from the array "pokemonList" 
    pokemon.forEach((pokemon) => {
      
      const pokemonID = pokemon.url.split("/")[6];
      const listPokemon = document.createElement("div");
      listPokemon.className = "list-item";
      listPokemon.innerHTML = `
          <div class="number-wrap">
              <p class="caption-fonts">#${pokemonID}</p>
          </div>
          <div class="img-wrap">
              <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
          </div>
          <div class="name-wrap">
              <p class="body3-fonts">#${pokemon.name}</p>
          </div>
      `;
      listPokemon.addEventListener("click", async () => {
        const pokemonID = pokemon.url.split("/")[6];
        // Fetch detailed Pokemon data
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        const currentPokemon = await response.json();
        // Display the modal with Pokemon data
        displayModal(currentPokemon); 
      });
      // Append the pokemon list to the listt container.
      listContainer.appendChild(listPokemon);
    });
  }

  
  // Event listener for search input.
  searchInput.addEventListener("keyup", handleSearch);

  function handleSearch() {
    const searchPokemon = searchInput.value.toLowerCase();
    let filteredPokemons;
    
    // Filters search by pokemon ID number.
    if (numberFilter.checked) {
      filteredPokemons = pokemonList.filter((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        return pokemonID.startsWith(searchPokemon);
      });
    
    // Filters search by pokemon name.
    } else if (nameFilter.checked) {
      filteredPokemons = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchPokemon)
      );
    } else {
      filteredPokemons = pokemonList;
    }

    // Displays filter search.
    displayPokemons(filteredPokemons);

    // Displays or not "not found message".
    if (filteredPokemons.length === 0) {
      notFoundMessage.style.display = "block";
    } else {
      notFoundMessage.style.display = "none";
    }
  }

  // Close buttton in search bar event listener.  
  const closeButton = document.querySelector(".search-close-icon");
  closeButton.addEventListener("click", clearSearch);

  function clearSearch() {
    searchInput.value = "";
    displayPokemons(pokemonList);
    notFoundMessage.style.display = "none";
  }

  // Sort wrapper, close icon, and search input.
  const inputElement = document.querySelector("#search-input");
  const search_icon = document.querySelector("#search-close-icon");
  const sort_wrapper = document.querySelector(".sort-wrapper");

  // Event listener for search input.
  inputElement.addEventListener("input", () => {
    handleInputChange(inputElement);
  });

  // Event listener for sort wrapper.
  search_icon.addEventListener("click", handleSearchCloseOnClick);
  sort_wrapper.addEventListener("click", handleSortIconOnClick);

  function handleInputChange(inputElement) {
    const inputValue = inputElement.value;

    if (inputValue !== "") {
      document
        .querySelector("#search-close-icon")
        .classList.add("search-close-icon-visible");
    } else {
      document
        .querySelector("#search-close-icon")
        .classList.remove("search-close-icon-visible");
    }
  }

  // Function for event listener click on close icon.
  function handleSearchCloseOnClick() {
    document.querySelector("#search-input").value = "";
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }

  // Function for event listener click on the sort wrapper.
  function handleSortIconOnClick() {
    document
      .querySelector(".filter-wrapper")
      .classList.toggle("filter-wrapper-open");
    document.querySelector("body").classList.toggle("filter-wrapper-overlay");
  }

  // Function to display the modal
  function displayModal(currentPokemon) { 
    const modal = document.getElementById("pokemon-modal");
    modal.style.display = "block";
    const modalImg = document.querySelector("#modal-img");
    const modalName = document.querySelector("#modal-title");
    const modalHeight = document.querySelector("#modal-description"); 
    let heightInM = currentPokemon.height / 10;
 
    // Populate modal content
    modalImg.src = currentPokemon.sprites.front_default;
    modalName.textContent = `No: ${currentPokemon.id} ${currentPokemon.name}`;
    modalHeight.textContent = `height: ${heightInM} m`;
  
    // Close button functionality
    modalImg.addEventListener("click", () => {modal.style.display = "none"})
    const closeModalButton = document.querySelector(".close-modal");
    closeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

document.getElementById("new-pokemon-form").addEventListener("submit", createNewPokemon);

// Add new pokemon.
function createNewPokemon(event) {
  event.preventDefault();   

  // Get pokemno data
  const name = document.getElementById('newname').value;
  const height = parseFloat(document.getElementById('newheight').value);
  const weight = parseFloat(document.getElementById('newweight').value);
  
  // New Pokemon object
  const newPokemon = {
    name: name,
    height: height,
    weight: weight
  };

  // Send new Pokemon data to your API
  fetch('http://localhost:3000/newpokemon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPokemon)
  })
  .then((response) => response.json())
  .then(updatePokemonList) 
  .catch(error => {
    console.error('Error adding Pokemon:', error);
  });

  document.getElementById("new-pokemon-form").reset();
}

// Function to update pokemon list
function updatePokemonList(data) { 
  // Add the new Pokemon to the list
  pokemonList.push(data); 
  displayPokemons(pokemonList);
  // Refresh the form
  document.getElementById("new-pokemon-form").reset();
}