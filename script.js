// script.js
document.addEventListener("DOMContentLoaded", function () {
  const animeForm = document.getElementById("animeForm");
  const animeList = document.getElementById("animeList");
  const importJsonButton = document.getElementById("importJsonButton"); // Get the button after DOM is ready
  const downloadButton = document.getElementById("downloadButton"); // Get the button after DOM is ready
  const jsonFile = document.getElementById("jsonFile"); // Get the file input after DOM is ready
  const editAnimeModal = document.getElementById("editAnimeModal"); // Get the modal element

  let animeData = JSON.parse(localStorage.getItem("animes")) || []; // Array to store anime data

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
      openEditAnimeModal(anime); // Open the modal and pass anime data
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

  // Function to open the Edit Anime Modal
  function openEditAnimeModal(animeData) {
    // Populate the modal form fields with animeData
    document.getElementById("editAnimeName").value = animeData.name;
    document.getElementById("editWatchedEpisodes").value =
      animeData.watchedEpisodes;
    document.getElementById("editTotalEpisodes").value =
      animeData.totalEpisodes;
    document.getElementById("editAnimeGenre").value = animeData.genre;
    document.getElementById("editAnimeDescription").value =
      animeData.description;

    // Show the modal
    editAnimeModal.style.display = "block";
    window.animeBeingEdited = animeData;
  }

  // Function to close the Edit Anime Modal
  function closeEditAnimeModal() {
    editAnimeModal.style.display = "none";
  }

  // Function to update anime data in the array
  function updateAnimeData(updatedAnime) {
    // Find the index of the anime being edited
    const index = animeData.indexOf(window.animeBeingEdited); // Use the global variable
    if (index !== -1) {
      // Update the anime data in the array
      animeData[index] = updatedAnime;
      // Re-render the anime list
      updateAnimeList();
    }
  }

  // Function to update the anime list
  function updateAnimeList() {
    animeList.innerHTML = ""; // Clear the existing list
    animeData.forEach((anime) => addAnime(anime));
    localStorage.setItem("animes", JSON.stringify(animeData)); // Save to local storage
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

  // Load animes from local storage on page load
  window.addEventListener("load", () => {
    updateAnimeList(); // Load animes from local storage
  });

  // Event listener for the "Save Changes" button in the modal
  // Event listener for the "Save Changes" button in the modal
  const editAnimeForm = document.getElementById("editAnimeForm");
  if (editAnimeForm) {
    editAnimeForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission

      // Get the updated anime data from the modal form
      const updatedAnimeData = {
        name: document.getElementById("editAnimeName").value,
        watchedEpisodes: parseInt(
          document.getElementById("editWatchedEpisodes").value
        ),
        totalEpisodes: parseInt(
          document.getElementById("editTotalEpisodes").value
        ),
        genre: document.getElementById("editAnimeGenre").value,
        description: document.getElementById("editAnimeDescription").value,
      };

      // Update the anime data in the array
      updateAnimeData(updatedAnimeData);

      // Close the modal
      closeEditAnimeModal();
    });
  }

  // Add event listeners for closing the modal
  const closeButton = editAnimeModal.querySelector(".close");
  if (closeButton) {
    closeButton.addEventListener("click", closeEditAnimeModal);
  }

  // Add event listener for clicking outside the modal
  editAnimeModal.addEventListener("click", (event) => {
    if (event.target === editAnimeModal) {
      closeEditAnimeModal();
    }
  });
});
