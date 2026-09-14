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
    <div class="swatch">
      <img src="${p.cover}" alt="${p.name}">
    </div>
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
// ---- Poster modal ----
const modal = document.getElementById('posterModal');
const pmTag = document.getElementById('pmTag');
const pmTitle = document.getElementById('pmTitle');
const pmImage = document.getElementById('pmImage');
const pmProgress = document.getElementById('pmProgress');
const pmPrev = document.getElementById('pmPrev');
const pmNext = document.getElementById('pmNext');
const pmClose = document.getElementById('pmClose');

let currentProject = null;
let currentPoster = 0;

/* --------------------------------
   PRELOAD PROJECT IMAGES
--------------------------------- */

function preloadProjectImages(project) {
  if (!project || !project.posters) return;

  project.posters.forEach((poster) => {
    const img = new Image();
    img.src = poster.image;
  });
}


/* --------------------------------
   SHOW CURRENT POSTER
--------------------------------- */

function showPoster() {
  const p = PROJECTS[currentProject];
  const poster = p.posters[currentPoster];

  /*
    Do NOT remove the current image first.
    This prevents the blank/blink while
    the next image is loading.
  */

  const newImage = new Image();

  newImage.onload = () => {
    pmImage.classList.remove('poster-changing');

    pmImage.src = poster.image;
    pmImage.alt = poster.label;

    void pmImage.offsetWidth;

    pmImage.classList.add('poster-changing');
  };

  newImage.src = poster.image;

  pmProgress.textContent =
    `${String(currentPoster + 1).padStart(2, '0')} / ${String(p.posters.length).padStart(2, '0')}`;

  pmPrev.disabled = currentPoster === 0;
  pmNext.disabled = currentPoster === p.posters.length - 1;
}


/* --------------------------------
   OPEN PROJECT
--------------------------------- */

function openProject(idx) {
  const p = PROJECTS[idx];

  currentProject = idx;
  currentPoster = 0;

  pmTag.textContent = p.tag;
  pmTitle.textContent = p.name;

  showPoster();

  /*
    Start loading all project images
    immediately in the background.
  */
  preloadProjectImages(p);

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  pmClose.focus();
}


/* --------------------------------
   CLOSE PROJECT
--------------------------------- */

function closeProject() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}


/* --------------------------------
   NEXT POSTER
--------------------------------- */

function nextPoster() {
  if (currentProject === null) return;

  const p = PROJECTS[currentProject];

  if (currentPoster < p.posters.length - 1) {
    currentPoster++;
    showPoster();
  }
}


/* --------------------------------
   PREVIOUS POSTER
--------------------------------- */

function previousPoster() {
  if (currentProject === null) return;

  if (currentPoster > 0) {
    currentPoster--;
    showPoster();
  }
}


/* --------------------------------
   PROJECT CARD CLICK
--------------------------------- */

grid.addEventListener('click', (e) => {
  const card = e.target.closest('.work-card');

  if (card) {
    openProject(Number(card.dataset.idx));
  }
});


/* --------------------------------
   PROJECT CARD KEYBOARD
--------------------------------- */

grid.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.work-card');

    if (card) {
      e.preventDefault();
      openProject(Number(card.dataset.idx));
    }
  }
});


/* --------------------------------
   MODAL CONTROLS
--------------------------------- */

pmNext.addEventListener('click', nextPoster);
pmPrev.addEventListener('click', previousPoster);
pmClose.addEventListener('click', closeProject);


/* --------------------------------
   SWIPE SUPPORT
--------------------------------- */

let touchStartX = 0;
let touchEndX = 0;

pmImage.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

pmImage.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;

  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) < 50) return;

  if (distance < 0) {
    nextPoster();
  } else {
    previousPoster();
  }
});


/* --------------------------------
   KEYBOARD CONTROLS
--------------------------------- */

document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('show')) return;

  if (e.key === 'Escape') {
    closeProject();
  }

  if (e.key === 'ArrowRight') {
    nextPoster();
  }

  if (e.key === 'ArrowLeft') {
    previousPoster();
  }
});

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
