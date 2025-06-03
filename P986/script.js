const totalCards = 614;
const batchSize = 31;
let loadedCards = 0;

const standardContainer = document.getElementById('standardCards');
const mapContainer = document.getElementById('mapCards');

function createCard(i) {
  const isMapCard = i >= 551;
  const card = document.createElement('div');
  card.className = isMapCard ? 'card map-card' : 'card';

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-back">
        <img src="cards/backs/${String(i).padStart(3, '0')}_back.webp" alt="Card ${i} Back">
      </div>
      <div class="card-front">
        <img src="cards/fronts/${String(i).padStart(3, '0')}.webp" alt="Card ${i}">
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });

  return card;
}

function loadNextBatch() {
  const standardFragment = document.createDocumentFragment();
  const mapFragment = document.createDocumentFragment();

  for (let i = loadedCards; i < Math.min(loadedCards + batchSize, totalCards); i++) {
    const card = createCard(i);
    if (i < 548) {
      standardFragment.appendChild(card);
    } else {
      mapFragment.appendChild(card);
    }
  }

  standardContainer.appendChild(standardFragment);
  mapContainer.appendChild(mapFragment);
  loadedCards += batchSize;
}

window.addEventListener('scroll', () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.offsetHeight;

  if (scrollPosition >= pageHeight - 100 && loadedCards < totalCards) {
    loadNextBatch();
  }
});

loadNextBatch();
