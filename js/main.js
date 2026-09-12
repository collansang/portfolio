document.getElementById('year').textContent = new Date().getFullYear();

// ---- Mobile menu ----
const burger = document.getElementById('burger');
const panel = document.getElementById('mobilePanel');
burger.addEventListener('click', () => {
  const open = panel.classList.toggle('show');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  panel.classList.remove('show');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// ---- Render work grid from PROJECTS (see js/data.js) ----
const grid = document.getElementById('workGrid');
grid.innerHTML = PROJECTS.map((p, i) => `
  <article class="work-card" data-cat="${p.cat}" data-idx="${i}" style="--c1:${p.c1};--c2:${p.c2};" tabindex="0" role="button" aria-label="View posters for ${p.name}">
    <div class="swatch" style="background:linear-gradient(140deg,var(--c1),var(--c2));"></div>
    <div class="veil"></div>
    <span class="num">${String(i + 1).padStart(2, '0')}</span>
    <span class="expand-hint"><svg viewBox="0 0 24 24" fill="none" stroke="#faf8f4" stroke-width="2"><path d="M7 17L17 7M17 7H9M17 7V15"/></svg></span>
    <div class="meta"><span class="tag">${p.tag}</span><h3>${p.name}</h3></div>
  </article>
`).join('');

// ---- Work filter ----
const filterBtns = document.querySelectorAll('#workFilter button');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ---- Poster modal ----
const modal = document.getElementById('posterModal');
const pmTag = document.getElementById('pmTag');
const pmTitle = document.getElementById('pmTitle');
const pmGrid = document.getElementById('pmGrid');
const pmClose = document.getElementById('pmClose');

function openProject(idx) {
  const p = PROJECTS[idx];
  pmTag.textContent = p.tag;
  pmTitle.textContent = p.name;
  pmGrid.innerHTML = p.posters.map(ps => `
    <div class="poster-tile" style="background:linear-gradient(150deg, ${ps.c1}, ${ps.c2});">
      <span>${ps.label}</span>
    </div>
  `).join('');
  modal.querySelector('.poster-scroll').scrollTop = 0;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  pmClose.focus();
}
function closeProject() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.work-card');
  if (card) openProject(Number(card.dataset.idx));
});
grid.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.work-card');
    if (card) { e.preventDefault(); openProject(Number(card.dataset.idx)); }
  }
});
pmClose.addEventListener('click', closeProject);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProject(); });

// ---- Testimonial accordion ----
document.querySelectorAll('.t-item-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.closest('.t-item');
    const body = item.querySelector('.t-item-body');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.t-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.t-item-body').style.maxHeight = null;
      i.querySelector('.t-item-head').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      head.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- Header shadow on scroll ----
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 8px 24px rgba(0,0,0,.35)' : 'none';
});
