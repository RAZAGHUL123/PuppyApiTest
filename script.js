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
    })
    .catch(error => {
      displayError(error.message);
      console.error(error);
    });
}

// Function to remove a player
function removePlayer() {
  fetch(APIURL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      const { success, error } = data;

      if (!success) {
        throw new Error(error?.message || 'Failed to remove player.');
      }

      playerContainer.innerHTML = '';
    })
    .catch(error => {
      displayError(error.message);
      console.error(error);
    });
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
      statusSelect.value = 'field';
      imageUrlInput.value = '';
    })
    .catch(error => {
      displayError(error.message);
      console.error(error);
    });
}

// Event listeners
randomPlayerButton.addEventListener('click', getRandomPlayer);
addPlayerForm.addEventListener('submit', addPlayer);
removePlayerButton.addEventListener('click', removePlayer);
