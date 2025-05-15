const container = document.getElementById('card-container');
let loadedCards = 0;
const totalCards = 986;
const batchSize = 20;

// Load a batch of cards
function loadCards() {
  for (let i = loadedCards; i < loadedCards + batchSize && i < totalCards; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${(i - loadedCards) * 40}ms`;

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    const front = document.createElement('div');
    front.className = 'card-front';
    front.style.backgroundImage = `url(cards/fronts/${String(i).padStart(3, '0')}.webp)`;

    const back = document.createElement('div');
    back.className = 'card-back';
    back.style.backgroundImage = `url(cards/backs/${String(i).padStart(3, '0')}.webp)`;

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);
    container.appendChild(card);

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  }

  loadedCards += batchSize;
}

// Trigger more loads on scroll
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    loadCards();
  }
});

// Load initial batch
loadCards();
