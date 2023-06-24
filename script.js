const addPlayerForm = document.getElementById('add-player-form');
const randomPlayerButton = document.getElementById('random-player-button');
const removePlayerButton = document.getElementById('remove-player-button');
const playerContainer = document.getElementById('all-players-container');
const cohortName = '2302-acc-pt-web-pt-e';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

// Function to display error message
function displayError(message) {
  const errorContainer = document.getElementById('error-container');
  errorContainer.textContent = message;
}

// Function to fetch a random player
function getRandomPlayer() {
  fetch(APIURL)
    .then(response => response.json())
    .then(data => {
      const { success, error, data: { players } } = data;

      if (!success) {
        throw new Error(error?.message || 'Failed to fetch random player.');
      }

      if (players.length === 0) {
        throw new Error('No players available.');
      }

      const randomIndex = Math.floor(Math.random() * players.length);
      const randomPlayer = players[randomIndex];

      const playerName = document.createElement('p');
      playerName.textContent = `Name: ${randomPlayer.name}`;
      const playerBreed = document.createElement('p');
      playerBreed.textContent = `Breed: ${randomPlayer.breed}`;
      const playerImage = document.createElement('img');
      playerImage.src = randomPlayer.imageUrl;
      playerImage.alt = randomPlayer.name;

      playerContainer.innerHTML = '';
      playerContainer.appendChild(playerName);
      playerContainer.appendChild(playerBreed);
      playerContainer.appendChild(playerImage);

      // Prompt user if they want to delete the player
      const userInput = prompt('Do you want to delete the player? (yes/no)');
      if (userInput.toLowerCase() === 'yes') {
        removePlayer(randomPlayer.id);
      } else {
        console.log('Player not deleted.');
      }
    })
    .catch(error => {
      displayError(error.message);
      console.error(error);
    });
}

const viewRosterButton = document.getElementById('view-roster-button');

// Function to view the roster
function viewRoster() {
  fetch(APIURL)
    .then(response => response.json())
    .then(data => {
      const { success, error, data: { players } } = data;

      if (!success) {
        throw new Error(error?.message || 'Failed to fetch roster.');
      }

      if (players.length === 0) {
        throw new Error('No players available.');
      }

      playerContainer.innerHTML = '';

      players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');
        playerElement.dataset.playerId = player.id;

        const playerName = document.createElement('p');
        playerName.textContent = `Name: ${player.name}`;
        const playerBreed = document.createElement('p');
        playerBreed.textContent = `Breed: ${player.breed}`;
        const playerImage = document.createElement('img');
        playerImage.src = player.imageUrl;
        playerImage.alt = player.name;
        playerImage.style.width = '150px'; // Set the desired width
        playerImage.style.height = '150px'; // Set the desired height

        playerElement.appendChild(playerName);
        playerElement.appendChild(playerBreed);
        playerElement.appendChild(playerImage);
        playerContainer.appendChild(playerElement);
      });
    })
    .catch(error => {
      displayError(error.message);
      console.error(error);
    });
}

viewRosterButton.addEventListener('click', viewRoster);


// Function to remove a player
async function removePlayer(playerId) {
  try {
    const response = await fetch(`${APIURL}/${playerId}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    const { success, error } = result;

    if (!success) {
      throw new Error(error?.message || 'Failed to remove player.');
    }

    console.log('Player successfully deleted.');

    // Fetch a new random player to display
    getRandomPlayer();
  } catch (error) {
    displayError(error.message);
    console.error(error);
  }
}

// Function to add a player
function addPlayer(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name-input');
  const breedInput = document.getElementById('breed-input');
  const statusSelect = document.getElementById('status-select');
  const imageUrlInput = document.getElementById('image-url-input');

  const newPlayer = {
    name: nameInput.value.trim(),
    breed: breedInput.value.trim(),
    status: statusSelect.value,
    imageUrl: imageUrlInput.value.trim()
  };

  fetch(APIURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPlayer)
  })
    .then(response => response.json())
    .then(data => {
      const { success, error, data: { newPlayer } } = data;

      if (!success) {
        throw new Error(error?.message || 'Failed to add player.');
      }

      const playerName = document.createElement('p');
      playerName.textContent = `Name: ${newPlayer.name}`;
      const playerBreed = document.createElement('p');
      playerBreed.textContent = `Breed: ${newPlayer.breed}`;
      const playerImage = document.createElement('img');
      playerImage.src = newPlayer.imageUrl;
      playerImage.alt = newPlayer.name;

      playerContainer.innerHTML = '';
      playerContainer.appendChild(playerName);
      playerContainer.appendChild(playerBreed);
      playerContainer.appendChild(playerImage);

      nameInput.value = '';
      breedInput.value = '';
      statusSelect.value = 'bench';
      imageUrlInput.value = '';
    })
    .catch(error => {
      displayError(error.message);
      console.error(error);
    });
}

randomPlayerButton.addEventListener('click', getRandomPlayer);
addPlayerForm.addEventListener('submit', addPlayer);
removePlayerButton.addEventListener('click', () => {
  const userInput = prompt('Enter the ID of the player you want to remove:');
  if (userInput) {
    removePlayer(userInput);
  }
});

// Make the API call
fetch(APIURL)
  .then(response => response.json())
  .then(data => {
    // Handle the response
    if (data.success) {
      // Process the data if the response is successful
      console.log(data.data);
    } else {
      // Handle the error if the response is unsuccessful
      const errorResponse = {
        success: false,
        error: {
          name: "ErrorName",
          message: "This is an error message."
        },
        data: null
      };
      console.log(errorResponse);
    }
  })
  .catch(error => {
    // Handle any network or other errors
    console.error(error);
  });
