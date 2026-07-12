import { createHighlighter, type Highlighter } from 'shiki';
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
  // mark active top-nav link from hash / index
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

// ── URL hash ↔ page (app layer, not wall.js core) ──────────
// Scroll / swipe / keyboard → change event → replaceState `#features`
// Open `/#api` or click `<a href="#install">` → goTo matching section
const disposeHash = bindSectionHash(wall, { mode: 'replace' });
const disposeLinks = bindHashLinks(wall);

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

/** Syntax-highlight `pre.code-block[data-lang]` with a slim Shiki highlighter. */
async function highlightCodeBlocks(): Promise<void> {
  const blocks = document.querySelectorAll<HTMLPreElement>(
    'pre.code-block[data-lang]',
  );
  if (!blocks.length) return;

  let highlighter: Highlighter;
  try {
    highlighter = await createHighlighter({
      themes: ['catppuccin-mocha'],
      langs: ['typescript', 'tsx', 'javascript', 'bash', 'shell'],
    });
  } catch (err) {
    console.warn('[site] shiki init failed', err);
    return;
  }

  for (const pre of blocks) {
    const code = pre.querySelector('code');
    const source = code?.textContent ?? pre.textContent ?? '';
    let lang = pre.dataset.lang || 'text';
    if (lang === 'ts') lang = 'typescript';
    if (lang === 'js') lang = 'javascript';
    if (lang === 'sh') lang = 'bash';

    try {
      const html = highlighter.codeToHtml(source, {
        lang,
        theme: 'catppuccin-mocha',
      });
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      const shikiPre = wrap.querySelector('pre');
      if (shikiPre) {
        shikiPre.classList.add('code-block', 'code-block--highlighted');
        shikiPre.tabIndex = 0;
        shikiPre.dataset.lang = lang;
        pre.replaceWith(shikiPre);
      }
    } catch (err) {
      console.warn('[site] highlight failed for', lang, err);
    }
  }
}

void highlightCodeBlocks();

;(window as unknown as { wall: Wall }).wall = wall;

// keep disposers referenced so tree-shaking won't drop them in odd builds
void disposeHash;
void disposeLinks;

console.info(
  '%cwall.js%c hash sync on — try #features #api #slides #install',
  'color:#0b0c0f;background:#e8ff6a;padding:2px 6px;border-radius:4px;font-weight:700',
  'color:#9a958c',
);
