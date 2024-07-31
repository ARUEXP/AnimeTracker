const animeForm = document.getElementById("animeForm");
const animeList = document.getElementById("animeList");

let animeData = [];

// Load anime data from local storage
loadAnimeData();

// Add anime to the list
animeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const animeName = document.getElementById("animeName").value;
  const watchedEpisodes = parseInt(
    document.getElementById("watchedEpisodes").value
  );
  const totalEpisodes = parseInt(
    document.getElementById("totalEpisodes").value
  );
  const animeGenre = document.getElementById("animeGenre").value;
  const animeDescription = document.getElementById("animeDescription").value;

  const newAnime = {
    name: animeName,
    watched: watchedEpisodes,
    total: totalEpisodes,
    genre: animeGenre,
    description: animeDescription,
  };

  animeData.push(newAnime);
  saveAnimeData();
  displayAnimeList(animeData);

  // Clear the form after submission
  animeForm.reset();
});

// Display anime list
function displayAnimeList(animeData) {
  animeList.innerHTML = ""; // Clear previous list

  animeData.forEach((anime, index) => {
    const animeItem = document.createElement("div");
    animeItem.classList.add("anime-item");
    animeItem.innerHTML = `
      <h2>${anime.name}</h2>
      <p>Watched: ${anime.watched} / ${anime.total} Episodes</p>
      <p>Genre: ${anime.genre}</p>
      <p>${anime.description}</p>
      <button class="delete-button" data-index="${index}">Delete</button>
      <button class="edit-button" data-index="${index}">Edit</button> 
    `;
    animeList.appendChild(animeItem);
  });

  // Add event listeners to delete buttons
  const deleteButtons = animeList.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteAnime);
  });

  // Add event listeners to edit buttons
  const editButtons = animeList.querySelectorAll(".edit-button");
  editButtons.forEach((button) => {
    button.addEventListener("click", editAnime);
  });
}

// Function to delete an anime
function deleteAnime(event) {
  const index = parseInt(event.target.dataset.index);
  animeData.splice(index, 1);
  saveAnimeData();
  displayAnimeList(animeData);
}

// Function to edit an anime
function editAnime(event) {
  const index = parseInt(event.target.dataset.index);
  const anime = animeData[index];

  // Create a form for editing the anime
  const editForm = document.createElement("form");
  editForm.innerHTML = `
    <label for="editAnimeName">Name:</label>
    <input type="text" id="editAnimeName" value="${anime.name}"><br>
    <label for="editWatchedEpisodes">Watched Episodes:</label>
    <input type="number" id="editWatchedEpisodes" value="${anime.watched}"><br>
    <label for="editTotalEpisodes">Total Episodes:</label>
    <input type="number" id="editTotalEpisodes" value="${anime.total}"><br>
    <label for="editAnimeGenre">Genre:</label>
    <input type="text" id="editAnimeGenre" value="${anime.genre}"><br>
    <label for="editAnimeDescription">Description:</label>
    <textarea id="editAnimeDescription">${anime.description}</textarea><br>
    <button type="submit">Save Changes</button>
  `;

  // Replace the anime item with the edit form
  animeList.replaceChild(editForm, event.target.parentElement);

  // Add event listener to the edit form
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get updated values from the form
    const updatedName = document.getElementById("editAnimeName").value;
    const updatedWatched = parseInt(
      document.getElementById("editWatchedEpisodes").value
    );
    const updatedTotal = parseInt(
      document.getElementById("editTotalEpisodes").value
    );
    const updatedGenre = document.getElementById("editAnimeGenre").value;
    const updatedDescription = document.getElementById(
      "editAnimeDescription"
    ).value;

    // Update the anime object in the data array
    animeData[index] = {
      name: updatedName,
      watched: updatedWatched,
      total: updatedTotal,
      genre: updatedGenre,
      description: updatedDescription,
    };

    // Save updated data to local storage
    saveAnimeData(animeData);

    // Update the displayed anime list
    displayAnimeList(animeData);
  });
}

// Save anime data to local storage
function saveAnimeData() {
  localStorage.setItem("animeData", JSON.stringify(animeData));
}

// Load anime data from local storage
function loadAnimeData() {
  const storedData = localStorage.getItem("animeData");
  if (storedData) {
    animeData = JSON.parse(storedData);
    displayAnimeList(animeData);
  }
}
