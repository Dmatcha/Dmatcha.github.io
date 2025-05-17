const totalCards = 612;
const batchSize = 21;
let loadedCards = 0;

const cardContainer = document.getElementById('cardContainer');

function loadNextBatch() {
  const fragment = document.createDocumentFragment();

  for (let i = loadedCards; i < Math.min(loadedCards + batchSize, totalCards); i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back">
          <img src="cards/fronts/${String(i).padStart(3, '0')}.webp" alt="Card ${i}">
        </div>
        <div class="card-front">
          <img src="cards/backs/${String(i).padStart(3, '0')}_back.webp" alt="Card ${i} Back">
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    fragment.appendChild(card);
  }

  cardContainer.appendChild(fragment);
  loadedCards += batchSize;
}

// Infinite scroll logic
window.addEventListener('scroll', () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.offsetHeight;

  if (scrollPosition >= pageHeight - 100) {
    if (loadedCards < totalCards) {
      loadNextBatch();
    }
  }
});

// Initial load
loadNextBatch();
