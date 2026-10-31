const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;

function setupThemeToggle() {
  const root = document.documentElement;
  $('#theme').onclick = () => { const n = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = n; try { localStorage.setItem('theme', n) } catch (e) {/* Storage can be unavailable in private browsing. */ } };
}

function setupMobileMenu() {
  const links = $('#links'), menu = $('#menu');
  menu.onclick = () => menu.setAttribute('aria-expanded', links.classList.toggle('open'));
  $$('#links a').forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false') }));
}

function setupTypingAnimation() {
  const roles = ['Competitive Programmer', 'ICPC Dhaka Regional Finalist', 'Aspiring Software Engineer'], el = $('#role');
  if (still) { el.textContent = roles[2]; return }
  let r = 0, i = 0, del = false;
  (function type() {
    const w = roles[r]; el.textContent = w.slice(0, i);
    if (!del && i === w.length) { del = true; return setTimeout(type, 1600) }
    if (del && i === 0) { del = false; r = (r + 1) % roles.length }
    i += del ? -1 : 1; setTimeout(type, del ? 35 : 70)
  })();
}

function setupRevealAnimations() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target) }), { threshold: .12 });
  $$('.rv').forEach(n => io.observe(n));
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const n = e.target, end = +n.dataset.n, dec = +(n.dataset.d || 0), suf = n.dataset.s || '';
    if (still) return n.textContent = end.toFixed(dec) + suf; const t0 = performance.now();
    (function count(t) { const p = Math.min((t - t0) / 1200, 1); n.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suf; if (p < 1) requestAnimationFrame(count) })(t0)
  }), { threshold: .6 });
  $$('[data-n]').forEach(n => co.observe(n));
}

function setupActiveNavigation() {
  const secs = $$('main section[id]'), so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('#links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => so.observe(s));
}

function setupCertificateLightbox() {
  const dlg = $('#dlg'), big = $('img', dlg);
  $$('[data-full]').forEach(b => b.onclick = () => { big.src = b.dataset.full; big.alt = $('img', b).alt; dlg.showModal() });
  dlg.onclick = e => { if (e.target !== big) dlg.close() };
}

function setupContactForm() {
  $('#form').onsubmit = e => {
    e.preventDefault(); const f = new FormData(e.target);
    location.href = 'mailto:w.siyam10@gmail.com?subject=' + encodeURIComponent(f.get('subject')) + '&body=' + encodeURIComponent(f.get('message') + '\n\n' + f.get('name') + ' (' + f.get('email') + ')')
  };
}

setupThemeToggle();
setupMobileMenu();
setupTypingAnimation();
setupRevealAnimations();
setupActiveNavigation();
setupCertificateLightbox();
setupContactForm();
$('#yr').textContent = new Date().getFullYear();
