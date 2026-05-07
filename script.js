// ── LANGUAGE ──────────────────────────────────────────────
function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && TRANSLATIONS[saved]) return saved;
  const browser = (navigator.language || 'nl').split('-')[0].toLowerCase();
  return TRANSLATIONS[browser] ? browser : 'nl';
}

function applyLang(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t[el.dataset.i18nHtml];
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = t[el.dataset.i18nPh];
    if (v !== undefined) el.placeholder = v;
  });
  // Update page title + meta description dynamically
  const page = document.body?.dataset.page;
  if (page && t[`page.title.${page}`]) document.title = t[`page.title.${page}`];
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && page && t[`page.desc.${page}`]) descEl.setAttribute('content', t[`page.desc.${page}`]);
  const ogTitleEl = document.querySelector('meta[property="og:title"]');
  if (ogTitleEl && page && t[`og.title.${page}`]) ogTitleEl.setAttribute('content', t[`og.title.${page}`]);
  // Update picker display
  const flag = document.getElementById('lp-flag');
  const code = document.getElementById('lp-code');
  if (flag) flag.textContent = LANG_FLAGS[lang];
  if (code) code.textContent = LANG_CODES[lang];
  document.querySelectorAll('.lp-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  // Sync privacy tabs if present
  document.querySelectorAll('.privacy-content-section').forEach(s => s.classList.remove('active'));
  const ps = document.getElementById('privacy-' + lang);
  if (ps) ps.classList.add('active');
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
}

function setLang(lang) { applyLang(lang); closePicker(); }

// ── LANG PICKER DROPDOWN ──────────────────────────────────
const picker = document.getElementById('lang-picker');
const pickerToggle = document.getElementById('lp-toggle');
const pickerDropdown = document.getElementById('lp-dropdown');

function openPicker() { pickerDropdown?.classList.add('open'); }
function closePicker() { pickerDropdown?.classList.remove('open'); }

if (pickerToggle) {
  pickerToggle.addEventListener('click', e => {
    e.stopPropagation();
    pickerDropdown.classList.toggle('open');
  });
}
document.querySelectorAll('.lp-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});
document.addEventListener('click', e => {
  if (picker && !picker.contains(e.target)) closePicker();
});

// ── HAMBURGER ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ── PRIVACY LANG TABS (standalone switcher on privacy page) ──
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    applyLang(lang);
  });
});

// ── BETA: device buttons ──────────────────────────────────
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

// ── BETA: form submit ─────────────────────────────────────
const betaForm = document.getElementById('beta-form');
const betaFormWrap = document.getElementById('beta-form-wrap');
const betaSuccess = document.getElementById('beta-success');
if (betaForm) {
  betaForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = betaForm.querySelector('.btn-submit');
    btn.textContent = '…'; btn.disabled = true;
    try {
      const res = await fetch('https://formspree.io/f/xojrlbdn', {
        method: 'POST', body: new FormData(betaForm), headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        if (betaFormWrap) betaFormWrap.style.display = 'none';
        if (betaSuccess) betaSuccess.style.display = 'block';
      } else { btn.textContent = TRANSLATIONS[detectLang()]['beta.submit'] || 'Probeer opnieuw'; btn.disabled = false; }
    } catch { btn.textContent = TRANSLATIONS[detectLang()]['beta.submit'] || 'Probeer opnieuw'; btn.disabled = false; }
  });
}

// ── INIT ──────────────────────────────────────────────────
applyLang(detectLang());
