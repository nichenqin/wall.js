import type { Wall } from 'wall.js';

export type HashSyncOptions = {
  /**
   * Hash slugs per section index (without `#`).
   * Defaults to each section's `id`, falling back to `section-${i + 1}`.
   */
  hashes?: string[];
  /**
   * How to write the URL when the page changes.
   * - `replace` (default): scroll doesn't fill history
   * - `push`: each section becomes a history entry
   */
  mode?: 'replace' | 'push';
};

function sectionHashes(wall: Wall, explicit?: string[]): string[] {
  if (explicit?.length) return explicit;
  return Array.from(wall.wrapper.children).map((el, i) => {
    const id = (el as HTMLElement).id?.trim();
    return id || `section-${i + 1}`;
  });
}

/**
 * App-layer helper: keep `location.hash` in sync with the active section.
 *
 * Not part of wall.js core — compose with `wall.on('change')` + `wall.goTo()`.
 *
 * @returns disposer
 */
export function bindSectionHash(
  wall: Wall,
  options: HashSyncOptions = {},
): () => void {
  const mode = options.mode ?? 'replace';
  const hashes = sectionHashes(wall, options.hashes);

  let applyingFromUrl = false;

  const writeHash = (index: number): void => {
    if (applyingFromUrl) return;
    const slug = hashes[index];
    if (!slug) return;

    const next = `#${slug}`;
    if (location.hash === next) return;

    if (mode === 'push') {
      history.pushState({ wallIndex: index }, '', next);
    } else {
      history.replaceState({ wallIndex: index }, '', next);
    }
  };

  const indexFromHash = (): number | null => {
    const raw = location.hash.replace(/^#/, '').trim();
    if (!raw) return null;
    const idx = hashes.indexOf(raw);
    return idx >= 0 ? idx : null;
  };

  const applyHash = (): void => {
    const idx = indexFromHash();
    if (idx == null || idx === wall.currentIndex) return;
    applyingFromUrl = true;
    void wall.goTo(idx).finally(() => {
      applyingFromUrl = false;
    });
  };

  const offChange = wall.on('change', ({ to }) => {
    writeHash(to);
  });

  window.addEventListener('hashchange', applyHash);
  window.addEventListener('popstate', applyHash);

  // Deep link on load: /#api
  applyHash();
  // If already on a section with no hash, stamp current slug
  if (!location.hash) {
    writeHash(wall.currentIndex);
  }

  return () => {
    offChange();
    window.removeEventListener('hashchange', applyHash);
    window.removeEventListener('popstate', applyHash);
  };
}

/**
 * Intercept in-page hash links so they drive wall.js instead of native scroll.
 */
export function bindHashLinks(wall: Wall, hashes?: string[]): () => void {
  const list = sectionHashes(wall, hashes);

  const onClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest?.(
      'a[href^="#"]',
    ) as HTMLAnchorElement | null;
    if (!anchor) return;
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      anchor.target === '_blank'
    ) {
      return;
    }

    const slug = anchor.getAttribute('href')?.replace(/^#/, '') ?? '';
    const idx = list.indexOf(slug);
    if (idx < 0) return;

    e.preventDefault();
    void wall.goTo(idx);
    // hash is written by bindSectionHash on `change`
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
