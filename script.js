// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Privacy language switcher
const langBtns = document.querySelectorAll('.lang-btn');
if (langBtns.length) {
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.privacy-content-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('privacy-' + btn.dataset.lang)?.classList.add('active');
    });
  });
}

// Beta: device toggle buttons
const deviceBtns = document.querySelectorAll('.device-btn');
const deviceInput = document.getElementById('device-input');
if (deviceBtns.length) {
  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (deviceInput) deviceInput.value = btn.dataset.value;
    });
  });
}

// Beta: form submit → success state
const betaForm = document.getElementById('beta-form');
const betaFormWrap = document.getElementById('beta-form-wrap');
const betaSuccess = document.getElementById('beta-success');
if (betaForm) {
  betaForm.addEventListener('submit', e => {
    e.preventDefault();
    if (betaFormWrap) betaFormWrap.style.display = 'none';
    if (betaSuccess) betaSuccess.style.display = 'block';
  });
}
