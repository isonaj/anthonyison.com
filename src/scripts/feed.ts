/**
 * Grows the feed as the reader scrolls by lifting the posts out of the next
 * page and appending them. Without this script those pages are ordinary,
 * navigable pages reached through the "Older posts" link.
 */
const feed = document.querySelector<HTMLElement>('[data-feed]');
const marker = document.querySelector<HTMLElement>('[data-feed-marker]');
const stateKey = `feed:${location.pathname}`;

/** How far beyond the viewport the next page starts loading. */
const LOOKAHEAD_SCREENS = 1;

let loadedBatches = 1;
let loading = false;
let restoring = false;

/** True only when the reader came back to this page, rather than opening it afresh. */
function arrivedByBackButton(): boolean {
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return entry?.type === 'back_forward';
}

function olderPostsLink(): HTMLAnchorElement | null {
  return marker?.querySelector<HTMLAnchorElement>('.show-more') ?? null;
}

/** The link stays for readers without this script, and comes back if loading fails. */
function hideOlderPostsLink(): void {
  olderPostsLink()?.classList.add('is-hidden');
}

function saveState(): void {
  try {
    sessionStorage.setItem(stateKey, JSON.stringify({ loadedBatches, scrollY: window.scrollY }));
  } catch {
    // A browser with storage turned off just loses its place: not worth breaking the feed over.
  }
}

function clearState(): void {
  try {
    sessionStorage.removeItem(stateKey);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

function readState(): { loadedBatches: number; scrollY: number } | null {
  try {
    const raw = sessionStorage.getItem(stateKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** The end of the feed is close enough that the next batch should be on its way. */
function markerWithinReach(): boolean {
  if (!marker) return false;
  return marker.getBoundingClientRect().top <= window.innerHeight * (1 + LOOKAHEAD_SCREENS);
}

async function loadNextBatch(): Promise<boolean> {
  const next = marker?.dataset.nextPage;
  if (!feed || !marker || !next || loading) return false;

  loading = true;
  try {
    const response = await fetch(next);
    if (!response.ok) throw new Error(`Page request failed: ${response.status}`);

    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const nextMarker = page.querySelector('[data-feed-marker]');
    // Without a marker this isn't a feed page we understand, so keep the feed as
    // it is rather than replacing the end of it with nothing.
    if (!nextMarker) throw new Error('Feed page had no marker');

    for (const item of page.querySelectorAll('.post-item')) {
      feed.appendChild(document.importNode(item, true));
    }

    marker.dataset.nextPage = nextMarker.getAttribute('data-next-page') ?? '';
    marker.innerHTML = nextMarker.innerHTML;

    loadedBatches += 1;
    hideOlderPostsLink();
    if (!restoring) saveState();
    return true;
  } catch {
    olderPostsLink()?.classList.remove('is-hidden');
    return false;
  } finally {
    loading = false;
  }
}

/**
 * Keeps loading while the end of the feed is in reach. The observer only fires
 * when the marker crosses the boundary, so appending a batch that doesn't push
 * it out of view would otherwise leave the feed stalled until the reader moved.
 */
async function fillToLookahead(): Promise<void> {
  while (marker?.dataset.nextPage && markerWithinReach()) {
    if (!(await loadNextBatch())) return;
  }
}

/** Puts the reader back where they were when they return from a post. */
async function restore(state: { loadedBatches: number; scrollY: number }): Promise<void> {
  restoring = true;
  // The browser would otherwise restore the scroll position against a feed that
  // is still one batch long, which lands the reader in the wrong place.
  const previousBehaviour = history.scrollRestoration;
  history.scrollRestoration = 'manual';

  try {
    while (loadedBatches < state.loadedBatches) {
      if (!(await loadNextBatch())) break;
    }
    // Only return the reader to their old position if the feed reached its old
    // length; otherwise that position is further down than the feed now goes.
    if (loadedBatches >= state.loadedBatches) {
      window.scrollTo(0, state.scrollY);
    }
  } finally {
    restoring = false;
    history.scrollRestoration = previousBehaviour;
    saveState();
  }

  await fillToLookahead();
}

if (feed && marker) {
  hideOlderPostsLink();

  marker.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest('.show-more');
    if (!link) return;
    event.preventDefault();
    void loadNextBatch();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      if (restoring) return;
      if (entries.some((entry) => entry.isIntersecting)) void fillToLookahead();
    },
    { rootMargin: `0px 0px ${Math.round(window.innerHeight * LOOKAHEAD_SCREENS)}px 0px` }
  );
  observer.observe(marker);

  window.addEventListener('pagehide', saveState);

  const state = readState();
  if (state && state.loadedBatches > 1 && arrivedByBackButton()) {
    void restore(state);
  } else {
    // A fresh visit starts at the top with one batch, however far the reader got last time.
    clearState();
  }
}
