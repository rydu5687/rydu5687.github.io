// Gallery 
const filterButtons = document.querySelectorAll('.gallery-nav button');
const photoCards = document.querySelectorAll('.photo-card');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');

// Load saved preferences
const savedFilter = localStorage.getItem('lastFilter');
const savedSearch = localStorage.getItem('lastSearch');
const dataOptOut = localStorage.getItem('optOut') === 'true';

// If opted out, skip restoring
if (!dataOptOut) {
  if (savedFilter) filterPhotos(savedFilter);
  if (savedSearch) {
    searchInput.value = savedSearch;
    runSearch();
  }
}

// Filter
filterButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const filterValue = event.target.textContent.toLowerCase();
    filterPhotos(filterValue);
    if (!dataOptOut) localStorage.setItem('lastFilter', filterValue);
  });
});

function filterPhotos(category) {
  photoCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Search

searchButton.addEventListener('click', runSearch);
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') runSearch();
});

function runSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (!dataOptOut) localStorage.setItem('lastSearch', query);

  photoCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query) || query === "") {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Data 

const dataControlContainer = document.createElement('div');
dataControlContainer.innerHTML = `
  <div class="data-controls">
    <button id="clearData">Clear My Data</button>
    <label>
      <input type="checkbox" id="optOut"> Opt out of data saving
    </label>
  </div>
`;
document.body.appendChild(dataControlContainer);

const clearButton = document.querySelector('#clearData');
const optOutCheckbox = document.querySelector('#optOut');
optOutCheckbox.checked = dataOptOut;

// Clear all localStorage data
clearButton.addEventListener('click', () => {
  localStorage.clear();
  alert('Your saved data has been cleared.');
});

// Opt-out toggle
optOutCheckbox.addEventListener('change', () => {
  localStorage.setItem('optOut', optOutCheckbox.checked);
  alert(optOutCheckbox.checked
    ? 'You have opted out of data saving.'
    : 'Data saving is now enabled.');
});

const dataStatus = document.querySelector('#dataStatus');

// pop-up message
function updateDataStatus() {
  if (localStorage.getItem('optOut') === 'true') {
    dataStatus.textContent = '';
  } else {
    dataStatus.textContent = 'If you can read this, this is a clear indication that your data is currently being stored. :)';
  }
}

// Update message
updateDataStatus();

optOutCheckbox.addEventListener('change', updateDataStatus);
