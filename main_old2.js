// Cinematic Luxury Watch Landing Page - Award-Winning JavaScript

// Configuration
const CONFIG = {
  PRODUCTS_JSON: 'products.json',
  VIDEO_INTERSECTION_THRESHOLD: 0.3,
  SCROLL_REVEAL_DISTANCE: '60px',
  SCROLL_REVEAL_DURATION: 1200
};

// State Management
let watchesData = [];
let intersectionObserver = null;

// DOM Elements
const DOM = {
  watchesGrid: null,
  productModal: null,
  modalClose: null,
  modalWatchImage: null,
  modalWatchVideo: null,
  modalWatchName: null,
  modalWatchPrice: null,
  modalWatchColor: null,
  modalWatchSpecs: null,
  modalWatchDescription: null
};

// Initialize DOM references
function initializeDOM() {
  DOM.watchesGrid = document.getElementById('watches-grid');
  DOM.productModal = document.getElementById('product-modal');
  DOM.modalClose = document.querySelector('.modal-close');
  DOM.modalWatchImage = document.getElementById('modal-watch-image');
  DOM.modalWatchVideo = document.getElementById('modal-watch-video');
  DOM.modalWatchName = document.getElementById('modal-watch-name');
  DOM.modalWatchPrice = document.getElementById('modal-watch-price');
  DOM.modalWatchColor = document.getElementById('modal-watch-color');
  DOM.modalWatchSpecs = document.getElementById('modal-watch-specs');
  DOM.modalWatchDescription = document.getElementById('modal-watch-description');
}

// Load watches data from JSON
async function loadWatchesData() {
  try {
    const response = await fetch(CONFIG.PRODUCTS_JSON);
    if (!response.ok) throw new Error('Failed to load products');
    const data = await response.json();
    watchesData = data.watches;
    renderWatches();
  } catch (error) {
    console.error('Error loading watches:', error);
    // Fallback: render with placeholder data
    renderFallbackWatches();
  }
}

// Render watches grid
function renderWatches() {
  if (!DOM.watchesGrid || !watchesData.length) return;
  
  DOM.watchesGrid.innerHTML = watchesData.map(watch => `
    <div class="watch-card" data-watch-id="${watch.id}">
      <img src="${watch.image}" alt="${watch.name}" class="watch-image" loading="lazy">
      <h3 class="watch-name">${watch.name}</h3>
      <p class="watch-price">${watch.price}</p>
      <div class="watch-specs">
        ${watch.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
      </div>
      <button class="btn btn-watch">View Details</button>
    </div>
  `).join('');
  
  // Add click event listeners
  document.querySelectorAll('.watch-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const watchId = card.dataset.watchId;
      const watch = watchesData.find(w => w.id === watchId);
      if (watch) openModal(watch);
    });
  });
}

// Fallback watches rendering
function renderFallbackWatches() {
  if (!DOM.watchesGrid) return;
  
  const fallbackWatches = Array.from({length: 13}, (_, i) => ({
    id: `watch-${i + 1}`,
    name: `Luxury Timepiece ${i + 1}`,
    price: `₹${(Math.random() * 20 + 5).toFixed(2).replace('.', ',')}0,000`,
    image: 'assets/header.png',
    specs: ['42mm', 'Automatic', 'Water Resistant'],
    description: 'Exceptional craftsmanship meets timeless design in this luxury timepiece.'
  }));
  
  DOM.watchesGrid.innerHTML = fallbackWatches.map(watch => `
    <div class="watch-card" data-watch-id="${watch.id}">
      <img src="${watch.image}" alt="${watch.name}" class="watch-image" loading="lazy">
      <h3 class="watch-name">${watch.name}</h3>
      <p class="watch-price">${watch.price}</p>
      <div class="watch-specs">
        ${watch.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
      </div>
      <button class="btn btn-watch">View Details</button>
    </div>
  `).join('');
}

// Modal functionality
function openModal(watch) {
  if (!DOM.productModal) return;
  
  DOM.modalWatchImage.src = watch.image;
  DOM.modalWatchImage.alt = watch.name;
  DOM.modalWatchName.textContent = watch.name;
  DOM.modalWatchPrice.textContent = watch.price;
  DOM.modalWatchColor.textContent = watch.color || 'Classic';
  DOM.modalWatchDescription.textContent = watch.description;
  
  // Specs
  DOM.modalWatchSpecs.innerHTML = watch.specs.map(spec => 
    `<span class="spec-tag">${spec}</span>`
  ).join('');
  
  // Video handling
  if (watch.video) {
    DOM.modalWatchVideo.querySelector('source').src = watch.video;
    DOM.modalWatchVideo.load();
    DOM.modalWatchVideo.style.display = 'block';
    DOM.modalWatchImage.style.display = 'none';
    DOM.modalWatchVideo.play();
  } else {
    DOM.modalWatchVideo.style.display = 'none';
    DOM.modalWatchImage.style.display = 'block';
  }
  
  DOM.productModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!DOM.productModal) return;
  
  DOM.productModal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  // Pause videos
  if (DOM.modalWatchVideo) {
    DOM.modalWatchVideo.pause();
  }
}

// Video Intersection Observer for autoplay/pause
function initializeVideoObserver() {
  const videos = document.querySelectorAll('video[data-video]');
  
  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(e => console.log('Video autoplay failed:', e));
      } else {
        video.pause();
      }
    });
  }, {
    threshold: CONFIG.VIDEO_INTERSECTION_THRESHOLD
  });
  
  videos.forEach(video => {
    intersectionObserver.observe(video);
  });
}

// ScrollReveal Animations
function initializeScrollAnimations() {
  if (typeof ScrollReveal === 'undefined') return;
  
  const sr = ScrollReveal({
    distance: CONFIG.SCROLL_REVEAL_DISTANCE,
    duration: CONFIG.SCROLL_REVEAL_DURATION,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    reset: false
  });
  
  // Hero animations
  sr.reveal('.hero-title', { delay: 200, origin: 'bottom' });
  sr.reveal('.hero-tagline', { delay: 400, origin: 'bottom' });
  sr.reveal('.btn-hero', { delay: 600, origin: 'bottom' });
  
  // Section animations
  sr.reveal('.section-title', { delay: 200, origin: 'bottom' });
  sr.reveal('.featured-video-container', { delay: 300, origin: 'left' });
  sr.reveal('.video-card', { delay: 200, interval: 150, origin: 'bottom' });
  sr.reveal('.watch-card', { delay: 100, interval: 100, origin: 'bottom' });
  sr.reveal('.testimonial-card', { delay: 200, interval: 200, origin: 'bottom' });
  sr.reveal('.brand-story-content', { delay: 300, origin: 'bottom' });
  sr.reveal('.porsche-content', { delay: 400, origin: 'bottom' });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
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

// Navbar scroll effect
function initializeNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(10, 10, 10, 0.98)';
      navbar.style.backdropFilter = 'blur(30px)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
      navbar.style.backdropFilter = 'blur(20px)';
    }
  });
}

// Logo Easter Egg Animation
function initializeLogoAnimation() {
  const logo = document.getElementById('logo');
  if (!logo) return;
  
  logo.addEventListener('click', () => {
    const logoImg = logo.querySelector('.logo-img');
    if (logoImg) {
      logoImg.style.animation = 'none';
      logoImg.offsetHeight; // Trigger reflow
      logoImg.style.animation = 'logoSpin 1s cubic-bezier(0.23, 1, 0.32, 1)';
      
      setTimeout(() => {
        logoImg.style.animation = '';
      }, 1000);
    }
  });
}

// Add CSS animations for logo
function addLogoAnimationCSS() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes logoSpin {
      0% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 20px #d4af37); }
      50% { transform: scale(1.2) rotate(180deg); filter: drop-shadow(0 0 40px #ffd700); }
      100% { transform: scale(1) rotate(360deg); filter: drop-shadow(0 0 20px #d4af37); }
    }
  `;
  document.head.appendChild(style);
}

// Testimonial video click to unmute
function initializeTestimonialVideos() {
  document.querySelectorAll('.testimonial-video').forEach(video => {
    video.addEventListener('click', () => {
      video.muted = !video.muted;
      
      // Visual feedback
      const card = video.closest('.testimonial-card');
      if (card) {
        if (video.muted) {
          card.style.borderColor = 'transparent';
        } else {
          card.style.borderColor = '#d4af37';
          card.style.borderWidth = '2px';
        }
      }
    });
  });
}

// Keyboard accessibility for modal
function initializeKeyboardAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.productModal?.style.display === 'block') {
      closeModal();
    }
  });
}

// Performance optimization: Lazy load videos
function initializeLazyVideoLoading() {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const source = video.querySelector('source');
        if (source && source.dataset.src) {
          source.src = source.dataset.src;
          video.load();
          videoObserver.unobserve(video);
        }
      }
    });
  });
  
  document.querySelectorAll('video source[data-src]').forEach(source => {
    videoObserver.observe(source.parentElement);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  initializeDOM();
  addLogoAnimationCSS();
  
  // Load watches data and render
  await loadWatchesData();
  
  // Initialize all features
  initializeVideoObserver();
  initializeScrollAnimations();
  initializeSmoothScrolling();
  initializeNavbarScroll();
  initializeLogoAnimation();
  initializeTestimonialVideos();
  initializeKeyboardAccessibility();
  initializeLazyVideoLoading();
  
  // Modal event listeners
  if (DOM.modalClose) {
    DOM.modalClose.addEventListener('click', closeModal);
  }
  
  if (DOM.productModal) {
    DOM.productModal.addEventListener('click', (e) => {
      if (e.target === DOM.productModal) {
        closeModal();
      }
    });
  }
  
  console.log('🚀 Cinematic Luxury Watch Landing Page Initialized!');
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition', 'none');
}
