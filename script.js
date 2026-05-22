// Benefits — highlight active brow as it enters view (timeline progression)
const brows = document.querySelectorAll('.brow');
if (brows.length && 'IntersectionObserver' in window) {
  const browIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        brows.forEach(b => b.classList.remove('is-active'));
        entry.target.classList.add('is-active');
      }
    });
  }, { threshold: 0.5, rootMargin: '-20% 0px -30% 0px' });
  brows.forEach(b => browIO.observe(b));
  // First brow active by default
  brows[0].classList.add('is-active');
}

// Telemedicine guide carousel
const tgCarousel = document.getElementById('telemedCarousel');
if (tgCarousel) {
  const tgSteps = [
    { title: 'Open MiCare Teleconsultation', desc: 'Tap "Start Chat" after entering the MiCare platform.' },
    { title: 'Choose Symptoms', desc: 'Select symptoms to help the healthcare provider understand your condition.' },
    { title: 'Begin Consultation', desc: 'Chat or speak with the assigned healthcare provider.' },
    { title: 'Receive e-Prescription', desc: 'Receive digital prescription after consultation.' },
    { title: 'Choose Medication Collection Method', desc: 'Choose either self-collection at Alpro Pharmacy or home delivery.' },
    { title: 'Track Medication Delivery', desc: 'Track your medication delivery status directly through the platform.' }
  ];
  const tgSlides  = tgCarousel.querySelectorAll('.tg__slide');
  const tgDots    = tgCarousel.querySelectorAll('.tg__dot');
  const tgPrev    = document.getElementById('tgPrev');
  const tgNext    = document.getElementById('tgNext');
  const tgTitleEl = document.getElementById('tgTitle');
  const tgDescEl  = document.getElementById('tgDesc');
  const tgNumEl   = document.getElementById('tgNum');
  let tgIndex = 0;

  const renderTg = () => {
    tgSlides.forEach((s, i) => s.classList.toggle('is-active', i === tgIndex));
    tgDots.forEach((d, i)   => d.classList.toggle('is-active', i === tgIndex));
    tgTitleEl.textContent = tgSteps[tgIndex].title;
    tgDescEl.textContent  = tgSteps[tgIndex].desc;
    tgNumEl.textContent   = String(tgIndex + 1);
    tgPrev.disabled = tgIndex === 0;
    tgNext.disabled = tgIndex === tgSteps.length - 1;
  };
  tgPrev.addEventListener('click', () => { if (tgIndex > 0) { tgIndex--; renderTg(); } });
  tgNext.addEventListener('click', () => { if (tgIndex < tgSteps.length - 1) { tgIndex++; renderTg(); } });
  tgDots.forEach((d, i) => d.addEventListener('click', () => { tgIndex = i; renderTg(); }));
  renderTg();
}

// Mobile nav toggle
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.nav__links a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// FAQ tabs
const tabs = document.querySelectorAll('.faq-tab');
const panels = document.querySelectorAll('.faq-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    panels.forEach(p => {
      p.classList.toggle('is-active', p.dataset.panel === target);
    });
  });
});

// Make FAQ items mutually exclusive within a panel (accordion behavior)
document.querySelectorAll('.faq-panel').forEach(panel => {
  const items = panel.querySelectorAll('details.faq');
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });
});

// Diagnosis preview expand/collapse
document.querySelectorAll('[data-diag-toggle]').forEach(btn => {
  const container = btn.closest('.diag-preview');
  if (!container) return;
  btn.addEventListener('click', () => {
    const expanded = container.getAttribute('data-state') === 'expanded';
    container.setAttribute('data-state', expanded ? 'collapsed' : 'expanded');
    btn.setAttribute('aria-expanded', String(!expanded));
  });
});

// Full covered list toggle
const toggleBtn = document.getElementById('toggleFullList');
const fullList = document.getElementById('fullList');
if (toggleBtn && fullList) {
  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    fullList.hidden = expanded;
    toggleBtn.querySelector('.toggle-label').textContent = expanded
      ? 'View Full Covered List'
      : 'Hide Full Covered List';
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.section, .benefit, .step, .mini, .flow, .cover, .faq');
revealEls.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-in'));
}
