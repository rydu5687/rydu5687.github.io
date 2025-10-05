// ===== GALLERY FILTER =====
const filterButtons = document.querySelectorAll('.gallery-nav button');
const photoCards = document.querySelectorAll('.photo-card');

filterButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const filterValue = event.target.textContent.toLowerCase();
    filterPhotos(filterValue);
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

// ===== SEARCH SYSTEM =====
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');

// When search button is clicked
searchButton.addEventListener('click', runSearch);

// Also allow Enter key
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    runSearch();
  }
});

function runSearch() {
  const query = searchInput.value.toLowerCase().trim();

  photoCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query) || query === "") {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
