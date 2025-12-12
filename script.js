// Video Preloading and Optimization
function preloadVideo(videoElement) {
  if (!videoElement) return;
  
  videoElement.addEventListener('loadeddata', function() {
    videoElement.classList.add('loaded');
  });
  
  videoElement.addEventListener('canplay', function() {
    videoElement.classList.add('loaded');
  });
  
  // Fallback for browsers that don't fire loadeddata
  setTimeout(function() {
    videoElement.classList.add('loaded');
  }, 1000);
}

function initVideoBackgrounds() {
  const videos = document.querySelectorAll('.video-bg');
  videos.forEach(preloadVideo);
}

// Card functionality (from existing script.js)
const totalCards = 614;
const batchSize = 31;
let loadedCards = 0;

const standardContainer = document.getElementById('standardCards');
const mapContainer = document.getElementById('mapCards');

function createCard(i) {
  const isMapCard = i >= 550;
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
    if (i < 550) {
      standardFragment.appendChild(card);
    } else {
      mapFragment.appendChild(card);
    }
  }

  if (standardContainer) {
    standardContainer.appendChild(standardFragment);
  }
  if (mapContainer) {
    mapContainer.appendChild(mapFragment);
  }
  loadedCards += batchSize;
}

function initCardLoading() {
  if (!standardContainer && !mapContainer) return; // Only run on pages with cards
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.offsetHeight;

    if (scrollPosition >= pageHeight - 100 && loadedCards < totalCards) {
      loadNextBatch();
    }
  });

  loadNextBatch();
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initVideoBackgrounds();
  initCardLoading();
  initSmoothScrolling();
});