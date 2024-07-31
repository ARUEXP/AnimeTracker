const animeForm = document.getElementById("animeForm");
const animeList = document.getElementById("animeList");
const importJsonButton = document.getElementById("importJsonButton");
const jsonFile = document.getElementById("jsonFile");
const downloadButton = document.getElementById("downloadButton"); // Get the download button element

// Load anime data from local storage on page load
let animeData = loadAnimeData();
displayAnimeList(animeData);

// Form submission event listener
animeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get values from the form
  const animeName = document.getElementById("animeName").value;
  const watchedEpisodes = parseInt(
    document.getElementById("watchedEpisodes").value
  );
  const totalEpisodes = parseInt(
    document.getElementById("totalEpisodes").value
  );
  const animeGenre = document.getElementById("animeGenre").value;
  const animeDescription = document.getElementById("animeDescription").value;

  // Create a new anime object
  const newAnime = {
    name: animeName,
    watched: watchedEpisodes,
    total: totalEpisodes,
    genre: animeGenre,
    description: animeDescription,
  };

  // Add the new anime to the data array
  animeData.push(newAnime);

  // Save updated data to local storage
  saveAnimeData(animeData);

  // Clear form fields
  animeForm.reset();

  // Update the displayed anime list
  displayAnimeList(animeData);
});

// Import JSON button event listener
importJsonButton.addEventListener("click", () => {
  jsonFile.click(); // Trigger the file input
});

// File input event listener
jsonFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);

      // Merge imported data with existing data
      animeData = animeData.concat(importedData);

      // Save updated data to local storage
      saveAnimeData(animeData);

      // Update the displayed anime list
      displayAnimeList(animeData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // Handle the error appropriately (e.g., display an error message)
    }
  };

  reader.readAsText(file);
});

// Function to display anime list
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
    `;
    animeList.appendChild(animeItem);
  });

  // Add event listeners to delete buttons
  const deleteButtons = animeList.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteAnime);
  });
}

// Function to delete an anime
function deleteAnime(event) {
  const index = parseInt(event.target.dataset.index);
  animeData.splice(index, 1); // Remove anime from the array
  saveAnimeData(animeData); // Save updated data to local storage
  displayAnimeList(animeData); // Update the displayed anime list
}

// Function to save anime data to local storage
function saveAnimeData(animeData) {
  localStorage.setItem("animeData", JSON.stringify(animeData));
}

// Function to load anime data from local storage
function loadAnimeData() {
  const storedData = localStorage.getItem("animeData");
  return storedData ? JSON.parse(storedData) : []; // Return empty array if no data
}

// Function to download anime data as a file
function downloadAnimeData() {
  const data = JSON.stringify(animeData, null, 2); // Format JSON for readability
  const blob = new Blob([data], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "anime_data.json"); // Set the file name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Add event listener to the download button
downloadButton.addEventListener("click", downloadAnimeData);
