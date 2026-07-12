import { Wall } from 'wall.js';
import { bindHashLinks, bindSectionHash } from './hash-sync';

const wall = new Wall('#wall', {
  duration: 780,
  easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  swipeThreshold: 50,
  wheelThreshold: 18,
});

const progressBar = document.getElementById('progress-bar');
const hint = document.getElementById('hint');
const slideIndicator = document.getElementById('slide-indicator');

function updateChrome(index: number): void {
  if (progressBar) {
    const pct = ((index + 1) / wall.sectionCount) * 100;
    progressBar.style.width = `${pct}%`;
  }
  if (hint) {
    hint.classList.toggle('is-hidden', index > 0);
  }
  updateSlideLabel();

  document.querySelectorAll('.top-nav a[href^="#"]').forEach((a) => {
    const slug = a.getAttribute('href')?.replace(/^#/, '');
    const section = slug
      ? wall.wrapper.querySelector(`:scope > #${CSS.escape(slug)}`)
      : null;
    const sections = Array.from(wall.wrapper.children);
    const idx = section ? sections.indexOf(section) : -1;
    a.classList.toggle('is-active', idx === index);
  });
}

function updateSlideLabel(): void {
  if (!slideIndicator) return;
  if (wall.currentIndex !== 3) return;
  const n = wall.currentSlideIndex + 1;
  slideIndicator.textContent = `Slide ${n} / 3`;
}

updateChrome(0);

// App layer: hash ↔ section (not wall.js core)
bindSectionHash(wall, { mode: 'replace' });
bindHashLinks(wall);

wall.on('change', (payload) => {
  updateChrome(payload.to);
});

wall.on('slideChange', () => {
  updateSlideLabel();
});

const bindSlide = (selector: string, fn: () => void): void => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fn();
    });
  });
};

bindSlide('#next-slide, [data-slide-next], #arrow-next', () => {
  void wall.nextSlide();
});
bindSlide('#prev-slide, [data-slide-prev], #arrow-prev', () => {
  void wall.prevSlide();
});

;(window as unknown as { wall: Wall }).wall = wall;

console.info(
  '%cwall.js%c (Astro site) — try #features #api #slides #install',
  'color:#0b0c0f;background:#e8ff6a;padding:2px 6px;border-radius:4px;font-weight:700',
  'color:#9a958c',
);
