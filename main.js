/* ========================================
   CINEMATIC LUXURY WATCH COLLECTION
   Award-Winning JavaScript Implementation
   ======================================== */

// Configuration
const CONFIG = {
  PRODUCTS_JSON: './products.json',
  VIDEO_INTERSECTION_THRESHOLD: 0.3,
  SCROLL_REVEAL_DISTANCE: '80px',
  SCROLL_REVEAL_DURATION: 1500,
  VIDEO_FADE_DURATION: 300
};

// State Management
let watchesData = [];
let intersectionObserver = null;
let videoObserver = null;
let currentModal = null;

// DOM Cache
const DOM = {
  // Navigation
  navbar: null,
  logo: null,
  navLinks: null,
  
  // Watches
  watchesGrid: null,
  
  // Modal
  productModal: null,
  modalClose: null,
  modalImage: null,
  modalVideo: null,
  modalName: null,
  modalPrice: null,
  modalColor: null,
  modalSpecs: null,
  modalDescription: null,
  
  // Videos
  allVideos: null,
  heroVideo: null,
  porschemVideo: null
};

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize all DOM references
 */
function initializeDOM() {
  // Navigation
  DOM.navbar = document.querySelector('.navbar');
  DOM.logo = document.getElementById('logo');
  DOM.navLinks = document.querySelectorAll('.nav-links a');
  
  // Watches
  DOM.watchesGrid = document.getElementById('watches-grid');
  
  // Modal
  DOM.productModal = document.getElementById('product-modal');
  DOM.modalClose = document.querySelector('.modal-close');
  DOM.modalImage = document.getElementById('modal-watch-image');
  DOM.modalVideo = document.getElementById('modal-watch-video');
  DOM.modalName = document.getElementById('modal-watch-name');
  DOM.modalPrice = document.getElementById('modal-watch-price');
  DOM.modalColor = document.getElementById('modal-watch-color');
  DOM.modalSpecs = document.getElementById('modal-watch-specs');
  DOM.modalDescription = document.getElementById('modal-watch-description');
  
  // Videos
  DOM.allVideos = document.querySelectorAll('video[data-video]');
  DOM.heroVideo = document.querySelector('.hero-video');
  DOM.porschemVideo = document.querySelector('.porsche-video');
  
  console.log('✅ DOM Elements Initialized');
}

/**
 * Load watches data from JSON
 */
async function loadWatchesData() {
  try {
    console.log('🔄 Loading watches data...');
    const response = await fetch(CONFIG.PRODUCTS_JSON);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    watchesData = data.watches || [];
    
    console.log('✅ Watches data loaded:', watchesData.length, 'watches');
    
    if (watchesData.length > 0) {
      renderWatches();
    } else {
      renderFallbackWatches();
    }
    
  } catch (error) {
    console.error('❌ Error loading watches:', error);
    renderFallbackWatches();
  }
}

/**
 * Render watches dynamically
 */
function renderWatches() {
  if (!DOM.watchesGrid || !watchesData.length) return;
  
  console.log('🎨 Rendering watches...');
  
  const watchCards = watchesData.map(watch => `
    <div class="watch-card glass" data-watch-id="${watch.id}" tabindex="0">
      <img src="${watch.image}" 
           alt="${watch.name}" 
           class="watch-image" 
           loading="lazy"
           onerror="this.src='assets/header.png'">
      <h3 class="watch-name">${watch.name}</h3>
      <p class="watch-price">${watch.price}</p>
      <div class="watch-specs">
        ${watch.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
      </div>
      <button class="btn btn-watch" aria-label="View ${watch.name} details">
        View Details
      </button>
    </div>
  `).join('');
  
  DOM.watchesGrid.innerHTML = watchCards;
  
  // Add event listeners
  addWatchCardListeners();
  
  console.log('✅ Watches rendered successfully');
}

/**
 * Render fallback watches if JSON fails
 */
function renderFallbackWatches() {
  if (!DOM.watchesGrid) return;
  
  console.log('⚠️ Rendering fallback watches...');
  
  const fallbackWatches = [
    { id: 'f1', name: 'Chopard 201-Carat', price: '₹18,75,00,000', image: 'assets/Chopard-201-Carat-Watch-25-Million.webp' },
    { id: 'f2', name: 'Franck Muller Aeternitas', price: '₹20,25,00,000', image: 'assets/Franck-Muller-Aeternitas-Mega-4-watch-2.7-Million.webp' },
    { id: 'f3', name: 'Hublot Big Bang Diamond', price: '₹37,50,00,000', image: 'assets/Hublot-Big-Bang-Diamond-5-Million.webp' },
    { id: 'f4', name: 'Patek Philippe Nautilus', price: '₹45,00,000', image: 'assets/patek-philippe-nautilus-ref-5711-1500A-children-auction.webp' },
    { id: 'f5', name: 'Patek Philippe 1527', price: '₹37,50,00,000', image: 'assets/patek-philippe-ref-1527.webp' },
    { id: 'f6', name: 'Patek Philippe 6300A', price: '₹2,34,00,00,000', image: 'assets/patek-philippe-ref-6300A-most-expensive-watch-in-the-world-1920x1920.webp' },
    { id: 'f7', name: 'Vintage Heritage', price: '₹8,50,000', image: 'assets/watch1.jpg' },
    { id: 'f8', name: 'Sport Chronograph', price: '₹6,75,000', image: 'assets/watch2.jpg' },
    { id: 'f9', name: 'Elegant Dress', price: '₹4,25,000', image: 'assets/watch3.jpg' },
    { id: 'f10', name: 'Modern Innovation', price: '₹9,90,000', image: 'assets/watch4.jpg' },
    { id: 'f11', name: 'Heritage Luxury', price: '₹12,75,000', image: 'assets/watch5.jpg' },
    { id: 'f12', name: 'Porsche Diesel', price: '₹15,50,000', image: 'assets/pexels-sambecerra-12934247.jpg' },
    { id: 'f13', name: 'Classic Elegance', price: '₹7,25,000', image: 'assets/header.png' }
  ];
  
  const watchCards = fallbackWatches.map(watch => `
    <div class="watch-card glass" data-watch-id="${watch.id}" tabindex="0">
      <img src="${watch.image}" 
           alt="${watch.name}" 
           class="watch-image" 
           loading="lazy"
           onerror="this.src='assets/header.png'">
      <h3 class="watch-name">${watch.name}</h3>
      <p class="watch-price">${watch.price}</p>
      <div class="watch-specs">
        <span class="spec-tag">42mm</span>
        <span class="spec-tag">Automatic</span>
        <span class="spec-tag">Swiss Made</span>
      </div>
      <button class="btn btn-watch" aria-label="View ${watch.name} details">
        View Details
      </button>
    </div>
  `).join('');
  
  DOM.watchesGrid.innerHTML = watchCards;
  addWatchCardListeners();
  
  console.log('✅ Fallback watches rendered');
}

/**
 * Add event listeners to watch cards
 */
function addWatchCardListeners() {
  const watchCards = document.querySelectorAll('.watch-card');
  
  watchCards.forEach(card => {
    // Click event
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const watchId = card.dataset.watchId;
      const watch = findWatchById(watchId);
      if (watch) {
        openModal(watch);
      }
    });
    
    // Keyboard event
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    
    // Hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-20px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Find watch by ID
 */
function findWatchById(id) {
  return watchesData.find(watch => watch.id === id);
}

// ========================================
// MODAL FUNCTIONALITY
// ========================================

/**
 * Open product modal
 */
function openModal(watch) {
  if (!DOM.productModal || !watch) return;
  
  console.log('🔍 Opening modal for:', watch.name);
  currentModal = watch;
  
  // Populate modal content
  if (DOM.modalImage) {
    DOM.modalImage.src = watch.image || 'assets/header.png';
    DOM.modalImage.alt = watch.name;
  }
  
  if (DOM.modalName) DOM.modalName.textContent = watch.name;
  if (DOM.modalPrice) DOM.modalPrice.textContent = watch.price;
  if (DOM.modalColor) DOM.modalColor.textContent = watch.color || 'Classic';
  if (DOM.modalDescription) DOM.modalDescription.textContent = watch.description || 'Exceptional craftsmanship meets timeless design.';
  
  // Specs
  if (DOM.modalSpecs && watch.specs) {
    DOM.modalSpecs.innerHTML = watch.specs.map(spec => 
      `<span class="spec-tag">${spec}</span>`
    ).join('');
  }
  
  // Video handling
  if (DOM.modalVideo && watch.video) {
    const source = DOM.modalVideo.querySelector('source');
    if (source) {
      source.src = watch.video;
      DOM.modalVideo.load();
      DOM.modalVideo.style.display = 'block';
      DOM.modalImage.style.display = 'none';
      
      // Try to play video
      DOM.modalVideo.play().catch(e => {
        console.log('Modal video autoplay failed:', e);
      });
    }
  } else if (DOM.modalVideo) {
    DOM.modalVideo.style.display = 'none';
    DOM.modalImage.style.display = 'block';
  }
  
  // Show modal
  DOM.productModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Focus management
  DOM.modalClose?.focus();
  
  console.log('✅ Modal opened');
}

/**
 * Close modal
 */
function closeModal() {
  if (!DOM.productModal) return;
  
  console.log('❌ Closing modal');
  
  DOM.productModal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  // Pause modal video
  if (DOM.modalVideo) {
    DOM.modalVideo.pause();
    DOM.modalVideo.currentTime = 0;
  }
  
  currentModal = null;
  console.log('✅ Modal closed');
}

// ========================================
// VIDEO MANAGEMENT
// ========================================

/**
 * Initialize video intersection observer
 */
function initializeVideoObserver() {
  if (!window.IntersectionObserver) {
    console.warn('⚠️ IntersectionObserver not supported');
    return;
  }
  
  console.log('🎥 Initializing video observer...');
  
  videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      
      if (entry.isIntersecting) {
        // Video is visible, try to play
        console.log('▶️ Attempting to play video:', video.src || video.querySelector('source')?.src);
        video.play().catch(error => {
          console.log('⚠️ Video autoplay failed:', error.message);
          // Show play button overlay if autoplay fails
          showPlayButton(video);
        });
      } else {
        // Video is not visible, pause it
        console.log('⏸️ Pausing video:', video.src || video.querySelector('source')?.src);
        video.pause();
      }
    });
  }, {
    threshold: CONFIG.VIDEO_INTERSECTION_THRESHOLD,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe all videos
  DOM.allVideos.forEach((video, index) => {
    videoObserver.observe(video);
    
    // Add load event listener
    video.addEventListener('loadeddata', () => {
      console.log(`✅ Video ${index + 1} loaded successfully:`, video.src || video.querySelector('source')?.src);
    });
    
    // Add click to play/pause
    video.addEventListener('click', () => {
      if (video.paused) {
        console.log('🎬 User clicked to play video');
        video.play();
      } else {
        console.log('⏹️ User clicked to pause video');
        video.pause();
      }
    });
    
    // Add error handling
    video.addEventListener('error', (e) => {
      console.error('❌ Video error:', e, 'Source:', video.src || video.querySelector('source')?.src);
      // Hide video and show placeholder
      video.style.display = 'none';
      
      // Add error message
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff6b6b;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-size: 14px;
      `;
      errorDiv.innerHTML = '❌ Video not available';
      
      video.parentElement.style.position = 'relative';
      video.parentElement.appendChild(errorDiv);
    });
  });
  
  console.log('✅ Video observer initialized for', DOM.allVideos.length, 'videos');
}

/**
 * Show play button for videos that can't autoplay
 */
function showPlayButton(video) {
  if (video.parentElement.querySelector('.play-button')) return;
  
  const playButton = document.createElement('div');
  playButton.className = 'play-button';
  playButton.innerHTML = '▶';
  playButton.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(212, 175, 55, 0.9);
    color: black;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
  `;
  
  playButton.addEventListener('click', () => {
    video.play().then(() => {
      playButton.remove();
    });
  });
  
  video.parentElement.style.position = 'relative';
  video.parentElement.appendChild(playButton);
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

/**
 * Initialize ScrollReveal animations
 */
function initializeScrollAnimations() {
  if (typeof ScrollReveal === 'undefined') {
    console.warn('⚠️ ScrollReveal not loaded');
    return;
  }
  
  console.log('✨ Initializing scroll animations...');
  
  const sr = ScrollReveal({
    distance: CONFIG.SCROLL_REVEAL_DISTANCE,
    duration: CONFIG.SCROLL_REVEAL_DURATION,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    reset: false,
    mobile: true
  });
  
  // Hero animations
  sr.reveal('.hero-title', { 
    delay: 300, 
    origin: 'bottom',
    scale: 0.8
  });
  
  sr.reveal('.hero-tagline', { 
    delay: 600, 
    origin: 'bottom' 
  });
  
  sr.reveal('.btn-hero', { 
    delay: 900, 
    origin: 'bottom',
    scale: 0.8
  });
  
  // Section animations
  sr.reveal('.section-title', { 
    delay: 200, 
    origin: 'bottom',
    distance: '50px'
  });
  
  sr.reveal('.featured-video-container', { 
    delay: 400, 
    origin: 'left',
    distance: '100px'
  });
  
  sr.reveal('.video-card', { 
    delay: 200, 
    interval: 150, 
    origin: 'bottom' 
  });
  
  sr.reveal('.watch-card', { 
    delay: 100, 
    interval: 100, 
    origin: 'bottom',
    scale: 0.9
  });
  
  sr.reveal('.testimonial-card', { 
    delay: 300, 
    interval: 200, 
    origin: 'bottom' 
  });
  
  sr.reveal('.brand-story-content', { 
    delay: 400, 
    origin: 'bottom' 
  });
  
  sr.reveal('.porsche-content', { 
    delay: 500, 
    origin: 'bottom',
    scale: 0.8
  });
  
  sr.reveal('.heritage-stats .stat', { 
    delay: 200, 
    interval: 150, 
    origin: 'bottom' 
  });
  
  console.log('✅ Scroll animations initialized');
}

// ========================================
// NAVIGATION
// ========================================

/**
 * Initialize smooth scrolling
 */
function initializeSmoothScrolling() {
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const navHeight = DOM.navbar ? DOM.navbar.offsetHeight : 80;
          const targetPosition = target.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          console.log('🔗 Smooth scroll to:', href);
        }
      }
    });
  });
}

/**
 * Initialize navbar scroll effects
 */
function initializeNavbarScroll() {
  if (!DOM.navbar) return;
  
  let ticking = false;
  
  function updateNavbar() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      DOM.navbar.style.background = 'rgba(0, 0, 0, 0.98)';
      DOM.navbar.style.backdropFilter = 'blur(40px)';
      DOM.navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
    } else {
      DOM.navbar.style.background = 'rgba(0, 0, 0, 0.8)';
      DOM.navbar.style.backdropFilter = 'blur(30px)';
      DOM.navbar.style.boxShadow = 'none';
    }
    
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  console.log('✅ Navbar scroll effects initialized');
}

// ========================================
// SPECIAL EFFECTS
// ========================================

/**
 * Initialize logo animation
 */
function initializeLogoAnimation() {
  if (!DOM.logo) return;
  
  DOM.logo.addEventListener('click', () => {
    const logoImg = DOM.logo.querySelector('.logo-img');
    if (logoImg) {
      logoImg.style.animation = 'none';
      logoImg.offsetHeight; // Trigger reflow
      logoImg.style.animation = 'logoSpin 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      setTimeout(() => {
        logoImg.style.animation = '';
      }, 1000);
      
      console.log('🎯 Logo animation triggered');
    }
  });
  
  // Add logo spin animation to CSS
  if (!document.getElementById('logo-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'logo-animation-styles';
    style.textContent = `
      @keyframes logoSpin {
        0% { 
          transform: scale(1) rotate(0deg); 
          filter: drop-shadow(0 0 30px #d4af37); 
        }
        50% { 
          transform: scale(1.3) rotate(180deg); 
          filter: drop-shadow(0 0 50px #ffd700); 
        }
        100% { 
          transform: scale(1) rotate(360deg); 
          filter: drop-shadow(0 0 30px #d4af37); 
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Initialize testimonial video interactions
 */
function initializeTestimonialVideos() {
  const testimonialVideos = document.querySelectorAll('.testimonial-video');
  
  testimonialVideos.forEach(video => {
    video.addEventListener('click', () => {
      video.muted = !video.muted;
      
      // Visual feedback
      const card = video.closest('.testimonial-card');
      if (card) {
        if (video.muted) {
          card.style.borderColor = 'transparent';
          showVideoMessage(video, 'Muted');
        } else {
          card.style.borderColor = '#d4af37';
          card.style.borderWidth = '2px';
          showVideoMessage(video, 'Unmuted');
        }
      }
      
      console.log('🔊 Testimonial video', video.muted ? 'muted' : 'unmuted');
    });
  });
}

/**
 * Show video message
 */
function showVideoMessage(video, message) {
  const messageEl = document.createElement('div');
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #d4af37;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    z-index: 10;
    pointer-events: none;
  `;
  
  video.parentElement.style.position = 'relative';
  video.parentElement.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 2000);
}

// ========================================
// ACCESSIBILITY
// ========================================

/**
 * Initialize keyboard accessibility
 */
function initializeKeyboardAccessibility() {
  // Modal keyboard handling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.productModal?.style.display === 'block') {
      closeModal();
    }
  });
  
  // Tab trap in modal
  if (DOM.productModal) {
    DOM.productModal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        trapFocus(e, DOM.productModal);
      }
    });
  }
  
  console.log('⌨️ Keyboard accessibility initialized');
}

/**
 * Trap focus within modal
 */
function trapFocus(e, container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

// ========================================
// PERFORMANCE
// ========================================

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Preload critical resources
  const preloadLinks = [
    { href: 'assets/Chopard-201-Carat-Watch-25-Million.webp', as: 'image' },
    { href: 'video assests/The Rolex Submariner (1080p).mp4', as: 'video' }
  ];
  
  preloadLinks.forEach(link => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = link.href;
    preloadLink.as = link.as;
    document.head.appendChild(preloadLink);
  });
  
  console.log('⚡ Performance optimizations initialized');
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Add all event listeners
 */
function addEventListeners() {
  // Modal events
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
  
  // Window events
  window.addEventListener('resize', debounce(() => {
    console.log('📱 Window resized');
  }, 250));
  
  // Prevent context menu on videos (optional)
  DOM.allVideos.forEach(video => {
    video.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  });
  
  console.log('👂 Event listeners added');
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// MAIN INITIALIZATION
// ========================================

/**
 * Initialize everything when DOM is ready
 */
async function initialize() {
  console.log('🚀 Initializing Cinematic Luxury Watch Collection...');
  
  // Show loading progress
  updateLoadingProgress(10, 'Initializing DOM...');
  
  try {
    // Core initialization
    initializeDOM();
    updateLoadingProgress(20, 'Loading watch collection...');
    
    await loadWatchesData();
    updateLoadingProgress(40, 'Setting up videos...');
    
    // Feature initialization
    initializeVideoObserver();
    updateLoadingProgress(55, 'Preparing animations...');
    
    initializeScrollAnimations();
    updateLoadingProgress(65, 'Setting up navigation...');
    
    initializeSmoothScrolling();
    initializeNavbarScroll();
    updateLoadingProgress(75, 'Adding special effects...');
    
    initializeLogoAnimation();
    initializeTestimonialVideos();
    updateLoadingProgress(85, 'Finalizing accessibility...');
    
    initializeKeyboardAccessibility();
    initializePerformanceOptimizations();
    updateLoadingProgress(95, 'Ready to launch...');
    
    // Event listeners
    addEventListeners();
    
    updateLoadingProgress(100, 'Complete!');
    
    // Hide loading screen after a brief delay
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    }, 800);
    
    console.log('✅ Initialization complete!');
    console.log('🏆 CINEMATIC LUXURY WATCH COLLECTION READY');
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
    updateLoadingProgress(100, 'Error occurred - retrying...');
    
    // Hide loading screen even on error
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
    }, 2000);
  }
}

/**
 * Update loading progress
 */
function updateLoadingProgress(percentage, text) {
  const progressBar = document.getElementById('loading-progress');
  const loadingText = document.getElementById('loading-text');
  
  if (progressBar) {
    progressBar.style.width = percentage + '%';
  }
  
  if (loadingText) {
    loadingText.textContent = text;
  }
  
  console.log(`📊 Loading: ${percentage}% - ${text}`);
}

// ========================================
// STARTUP
// ========================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-duration', '0.1s');
  console.log('♿ Reduced motion mode active');
}

// Export for debugging (if needed)
window.WatchCollection = {
  DOM,
  watchesData,
  openModal,
  closeModal,
  CONFIG
};
