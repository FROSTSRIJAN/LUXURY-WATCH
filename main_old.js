
// Hero Watch Animation (slow rotate on load, hover, and parallax)
const heroWatch = document.getElementById('hero-watch');
if (heroWatch) {
  // Slow rotate on load
  heroWatch.style.transition = 'transform 2.5s cubic-bezier(.77,0,.18,1)';
  setTimeout(() => {
    heroWatch.style.transform = 'rotate(360deg) scale(1.04)';
    setTimeout(() => {
      heroWatch.style.transform = 'rotate(0deg) scale(1)';
    }, 2200);
  }, 400);
  // Rotate on hover
  heroWatch.addEventListener('mouseenter', () => {
    heroWatch.style.transform = 'scale(1.08) rotate(-12deg)';
  });
  heroWatch.addEventListener('mouseleave', () => {
    heroWatch.style.transform = 'scale(1) rotate(0deg)';
  });
}

// Parallax effect for hero S and backgrounds
window.addEventListener('scroll', () => {
  // Parallax S
  const heroS = document.getElementById('hero-letter-s');
  if (heroS) {
    const scrollY = window.scrollY || window.pageYOffset;
    heroS.style.transform = `translate(-50%, -50%) scale(${1 + scrollY * 0.0007}) rotate(${scrollY * 0.08}deg)`;
  }
  // Parallax backgrounds (legacy)
  const heroBg = document.querySelector('.hero-bg-parallax');
  const storySection = document.querySelector('.story-section');
  if (heroBg) {
    heroBg.style.backgroundPosition = `60% ${40 + window.scrollY * 0.08}%`;
  }
  if (storySection) {
    storySection.style.backgroundPositionY = `${window.scrollY * 0.18}px`;
  }
});

// ScrollReveal Animations for all sections
if (window.ScrollReveal) {
  const sr = ScrollReveal({
    distance: '60px',
    duration: 1200,
    easing: 'cubic-bezier(.77,0,.18,1)',
    reset: false
  });
  sr.reveal('.hero-watch-container', { origin: 'left', delay: 200 });
  sr.reveal('.hero-text', { origin: 'right', delay: 400 });
  sr.reveal('.features-section', { origin: 'bottom', delay: 100 });
  sr.reveal('.feature-card', { interval: 180, origin: 'bottom', delay: 200 });
  sr.reveal('.collections-section', { origin: 'bottom', delay: 100 });
  sr.reveal('.collection-card', { interval: 180, origin: 'bottom', delay: 200 });
  sr.reveal('.story-video-section', { origin: 'left', delay: 200 });
  sr.reveal('.cinematic-video-section', { origin: 'bottom', delay: 200 });
  sr.reveal('.story-overlay', { origin: 'left', delay: 200 });
  sr.reveal('.cta-section', { origin: 'bottom', delay: 200 });
  sr.reveal('.footer-content', { origin: 'bottom', delay: 200 });
}
// Horizontal swipe for collections grid (mobile)
const collectionsSlider = document.querySelector('.collections-slider');
if (collectionsSlider) {
  let isDown = false, startX, scrollLeft;
  collectionsSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    collectionsSlider.classList.add('dragging');
    startX = e.pageX - collectionsSlider.offsetLeft;
    scrollLeft = collectionsSlider.scrollLeft;
  });
  collectionsSlider.addEventListener('mouseleave', () => {
    isDown = false;
    collectionsSlider.classList.remove('dragging');
  });
  collectionsSlider.addEventListener('mouseup', () => {
    isDown = false;
    collectionsSlider.classList.remove('dragging');
  });
  collectionsSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - collectionsSlider.offsetLeft;
    const walk = (x - startX) * 1.2;
    collectionsSlider.scrollLeft = scrollLeft - walk;
  });
  // Touch events for mobile
  collectionsSlider.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - collectionsSlider.offsetLeft;
    scrollLeft = collectionsSlider.scrollLeft;
  });
  collectionsSlider.addEventListener('touchend', () => {
    isDown = false;
  });
  collectionsSlider.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - collectionsSlider.offsetLeft;
    const walk = (x - startX) * 1.2;
    collectionsSlider.scrollLeft = scrollLeft - walk;
  });
}

// Button Ripple Effect (for all .btn)
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Feature Card Tilt Effect
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Logo Easter Egg Animation
const logo = document.getElementById('logo');
if (logo) {
  logo.addEventListener('click', () => {
    logo.classList.add('logo-animate');
    setTimeout(() => logo.classList.remove('logo-animate'), 1200);
  });
}

// Add logo-animate CSS via JS for a glowing pulse
const style = document.createElement('style');
style.innerHTML = `
  .logo-animate .logo-img {
    animation: logo-pulse 1.2s cubic-bezier(.77,0,.18,1);
    filter: drop-shadow(0 0 32px #ffd700cc) drop-shadow(0 0 64px #ffb34799);
  }
  @keyframes logo-pulse {
    0% { transform: scale(1) rotate(0deg); }
    30% { transform: scale(1.18) rotate(-8deg); }
    60% { transform: scale(0.92) rotate(8deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
`;
document.head.appendChild(style);
