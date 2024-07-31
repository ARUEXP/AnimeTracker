// script.js
document.addEventListener("DOMContentLoaded", function () {
  const animeForm = document.getElementById("animeForm");
  const animeList = document.getElementById("animeList");
  const importJsonButton = document.getElementById("importJsonButton"); // Get the button after DOM is ready
  const downloadButton = document.getElementById("downloadButton"); // Get the button after DOM is ready
  const jsonFile = document.getElementById("jsonFile"); // Get the file input after DOM is ready

  let animeData = []; // Array to store anime data

  // Function to add anime to the list
  function addAnime(anime) {
    const animeItem = document.createElement("div");
    animeItem.classList.add("anime-item");

    const animeName = document.createElement("h2");
    animeName.textContent = anime.name;

    const watchedEpisodes = document.createElement("p");
    watchedEpisodes.textContent = `Watched Episodes: ${anime.watchedEpisodes}`;

    const totalEpisodes = document.createElement("p");
    totalEpisodes.textContent = `Total Episodes: ${anime.totalEpisodes}`;

    const animeGenre = document.createElement("p");
    animeGenre.textContent = `Genre: ${anime.genre}`;

    const animeDescription = document.createElement("p");
    animeDescription.textContent = `Description: ${anime.description}`;

    // Create a container for the buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    // Append the deleteButton to the DOM before adding the event listener
    buttonContainer.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
      // Remove anime from the array and update the list
      animeData = animeData.filter((item) => item !== anime);
      updateAnimeList();
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      // Implement edit functionality (e.g., open a modal to edit anime details)
      console.log("Edit button clicked for anime:", anime);
    });

    // Append buttons to the container
    buttonContainer.appendChild(editButton);

    // Append elements to the anime item
    animeItem.appendChild(animeName);
    animeItem.appendChild(watchedEpisodes);
    animeItem.appendChild(totalEpisodes);
    animeItem.appendChild(animeGenre);
    animeItem.appendChild(animeDescription);
    animeItem.appendChild(buttonContainer);
    animeList.appendChild(animeItem);
  }

  // Function to update the anime list
  function updateAnimeList() {
    animeList.innerHTML = ""; // Clear the existing list
    animeData.forEach((anime) => addAnime(anime));
  }

  // Event listener for form submission
  animeForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

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
      watchedEpisodes: watchedEpisodes,
      totalEpisodes: totalEpisodes,
      genre: animeGenre,
      description: animeDescription,
    };

    animeData.push(newAnime);
    updateAnimeList();
    animeForm.reset(); // Reset the form after submission
  });

  // Event listener for import JSON button
  if (importJsonButton) {
    // Check if the button exists
    importJsonButton.addEventListener("click", () => {
      jsonFile.click(); // Trigger the file input
    });
  }

  // Event listener for file input change
  if (jsonFile) {
    // Check if the file input exists
    jsonFile.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          animeData = JSON.parse(event.target.result);
          updateAnimeList();
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
    });
  }

  // Event listener for download button
  if (downloadButton) {
    // Check if the button exists
    downloadButton.addEventListener("click", () => {
      const jsonData = JSON.stringify(animeData, null, 2); // Format JSON for readability
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "anime_data.json";
      link.click();

      URL.revokeObjectURL(url); // Release the URL object
    });
  }
});
