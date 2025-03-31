// Initialize the search functionality
function songSearch() {
  "use strict";

  let searchOutput = document.querySelector('.search-output');
  let searchBtn = document.getElementById('search');
  let searchInput = document.getElementById('search-input');
  let searchType = document.getElementById('search-type'); // Dropdown for search type
  let recommendedSongsSection = document.querySelector('.recommended-songs');

  searchBtn.addEventListener('click', () => {
    recommendedSongsSection.style.display = 'none';
    createSearch(searchInput, searchType, searchOutput);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
      recommendedSongsSection.style.display = 'none';
      createSearch(searchInput, searchType, searchOutput);
    }
  });
}

// Creating a song search or BPM search
function createSearch(input, typeSelector, output) {
  let inputVal = input.value.trim();
  let searchType = typeSelector.value; // Get the selected search type

  if (inputVal === '') {
    output.innerHTML = "<p>Please enter a value.</p>";
    return;
  }

  // Clear previous results
  output.innerHTML = `<p>Searching for "${inputVal}"...</p>`;

  // Call the appropriate API function
  if (searchType === "song") {
    fetchSongsByName(inputVal, output);
  } else if (searchType === "bpm") {
    fetchSongsByBPM(inputVal, output);
  }

  // Clear input field
  input.value = '';
}

// Function to fetch songs by name
async function fetchSongsByName(songName, output) {
  const apiKey = "INSERT KEY"; // Replace with valid API key
  const url = `https://api.getsong.co/search/?api_key=${apiKey}&type=song&lookup=${encodeURIComponent(songName)}`;

  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.search || data.search.length === 0) {
      output.innerHTML = `<p>No results found for "${songName}". Try another song.</p>`;
      return;
    }

    // Get the top 5 results
    const topResults = data.search.slice(0, 25);
    displayResults(topResults, output);
  } catch (error) {
    console.error("Error fetching song data:", error);
    output.innerHTML = `<p>There was an error fetching song data. Try again later.</p>`;
  }
}

async function fetchSongsByBPM(bpm, output) {
    const apiKey = "INSERT KEY"; // Replace with valid API key
    const genreFilter = document.getElementById("genre-select").value; // Get selected genre
    const url = `https://api.getsong.co/tempo/?api_key=${apiKey}&bpm=${bpm}`;

    try {
        console.log("Fetching BPM data from:", url); // Debugging

        const response = await fetch(url, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging: Print entire response

        if (!data.tempo || data.tempo.length === 0) {
            output.innerHTML = `<p>No songs found for BPM "${bpm}". Try another BPM.</p>`;
            return;
        }

        let songs = data.tempo;

        // Apply genre filtering if the user selected a genre
        if (genreFilter) {
            songs = songs.filter(song => 
                song.artist && song.artist.genres && song.artist.genres.includes(genreFilter.toLowerCase())
            );
        }

        // If no songs match the genre, display a message
        if (songs.length === 0) {
            output.innerHTML = `<p>No songs found for BPM "${bpm}" in the "${genreFilter}" genre.</p>`;
            return;
        }

        //  Pass filtered results to `displayResults()`
        displayResults(songs.slice(0, 20), output);
    } catch (error) {
        console.error("Error fetching song data:", error);
        output.innerHTML = `<p>There was an error fetching song data. Try again later.</p>`;
    }
}

// Function to display results
function displayResults(songs, output) {
    output.innerHTML = "<h2>Search Results</h2>";

    output.classList.add("recommended-songs");

    const resultsList = document.createElement("div");
    resultsList.classList.add("song-list");

    songs.forEach(song => {
        // Handle title variations between song search & BPM search
        const songTitle = song.title ? song.title : (song.song_title ? song.song_title : "Unknown Title"); 
        const artistName = song.artist && song.artist.name ? song.artist.name : "Unknown Artist";
        const bpm = song.tempo ? `${song.tempo} BPM` : "BPM not available";

        const songCard = document.createElement("div");
        songCard.classList.add("song-card"); // Apply .song-card class

        // Create song info
        const songInfo = document.createElement("div");
        songInfo.classList.add("song-info"); // Apply .song-info class

        songInfo.innerHTML = `
            <h2>${songTitle}</h2>
            <p>${artistName}</p>
        `;

        // Create song bpm info
        const songBpm = document.createElement("div");
        songBpm.classList.add("song-bpm"); // Apply .song-bpm class

        songBpm.innerHTML = `
            <p>${bpm}</p>
        `;

        // Append song info and bpm info to the song card
        songCard.appendChild(songInfo);
        songCard.appendChild(songBpm);

        // Append song card to the results list
        resultsList.appendChild(songCard);
    });

    output.appendChild(resultsList);
}

// Load app
songSearch();

