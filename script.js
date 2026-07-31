// ——— NAVIGATION ———
const navLinks = document.querySelectorAll('nav a');
const pages = {
  home: document.getElementById('page-home'),
  about: document.getElementById('page-about'),
  services: document.getElementById('page-services'),
  contact: document.getElementById('page-contact')
};

function navigateTo(page) {
  Object.keys(pages).forEach(key => pages[key].classList.remove('active'));
  if (pages[page]) pages[page].classList.add('active');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === page) link.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// ——— SCROLL INDICATOR ———
const scrollIndicator = document.getElementById('scrollIndicator');
window.addEventListener('scroll', () => {
  scrollIndicator.classList.toggle('fade-out', window.scrollY > 100);
});

// ——— CURSOR ———
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('.project-card, .service-card, .contact-item, .contact-form button, nav a, .logo h1, .footer-section a, .hire-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      cursor.style.borderColor = '#d4a373';
      cursor.style.background = 'rgba(212, 163, 115, 0.06)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.borderColor = '#d4a373';
      cursor.style.background = 'transparent';
    });
  });
} else {
  cursor.style.display = 'none';
  cursorDot.style.display = 'none';
}

// ——— PARTICLES ———
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let w, h;

function resizeParticles() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeParticles);
resizeParticles();

const particles = [];
const PARTICLE_COUNT = Math.min(70, Math.floor((w * h) / 18000));

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 1,
    opacity: Math.random() * 0.4 + 0.1,
    hue: 30 + Math.random() * 20
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.opacity})`;
    ctx.fill();
    ctx.shadowColor = `hsla(${p.hue}, 70%, 70%, 0.1)`;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212, 163, 115, ${0.04 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ——— 3D TILT ———
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const inner = card.querySelector('.project-card-inner');
      if (inner) inner.style.transform = `perspective(800px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg)`;
      const brush = card.querySelector('.brush-overlay');
      if (brush) {
        brush.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        brush.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
      }
    });
    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.project-card-inner');
      if (inner) inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  });
}

// ——— MODAL ———
const modal = document.getElementById('projectModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const closeModal = document.getElementById('closeModal');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function() {
    modalImg.src = this.dataset.img;
    modalTitle.textContent = this.dataset.title;
    modalCategory.textContent = this.dataset.category;
    modalDesc.textContent = this.dataset.desc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

function closeModalFunc() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}
closeModal.addEventListener('click', closeModalFunc);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFunc(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'flex') closeModalFunc(); });

// ——— CONTACT FORM ———
function handleSubmit(e) {
  e.preventDefault();
  alert('✨ Thank you! Your message has been sent. I\'ll get back to you soon.');
  document.getElementById('contactForm').reset();
  return false;
}

console.log('🔥 Tirtha Das · Bold design with 2-column grid on desktop & tablet.');
console.log('🔥 Crafted with ♥ by Aung Ching');