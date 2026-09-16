/**
 * Grows the feed as the reader scrolls: each batch is a prebuilt HTML fragment
 * that gets appended to the list. Without this script the reader still sees the
 * first batch and can follow the "Show more posts" link to the next fragment.
 */
const feed = document.querySelector<HTMLElement>('[data-feed]');
const marker = document.querySelector<HTMLElement>('[data-feed-marker]');
const stateKey = `feed:${location.pathname}`;

let loadedBatches = 1;
let loading = false;

function showMoreLink(): HTMLAnchorElement | null {
  return marker?.querySelector<HTMLAnchorElement>('.show-more') ?? null;
}

/** The link is only for readers without this script, or when loading failed. */
function hideShowMore(): void {
  showMoreLink()?.classList.add('is-hidden');
}

function saveState(): void {
  try {
    sessionStorage.setItem(stateKey, JSON.stringify({ loadedBatches, scrollY: window.scrollY }));
  } catch {
    // A browser with storage turned off just loses its place: not worth breaking the feed over.
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

async function loadNextBatch(): Promise<boolean> {
  const next = marker?.dataset.nextBatch;
  if (!feed || !marker || !next || loading) return false;

  loading = true;
  try {
    const response = await fetch(next);
    if (!response.ok) throw new Error(`Batch request failed: ${response.status}`);

    const fragment = new DOMParser().parseFromString(await response.text(), 'text/html');
    for (const item of fragment.querySelectorAll('.post-item')) {
      feed.appendChild(document.importNode(item, true));
    }

    const nextMarker = fragment.querySelector('[data-feed-marker]');
    marker.dataset.nextBatch = nextMarker?.getAttribute('data-next-batch') ?? '';
    marker.innerHTML = nextMarker?.innerHTML ?? '';

    loadedBatches += 1;
    hideShowMore();
    saveState();
    return true;
  } catch {
    showMoreLink()?.classList.remove('is-hidden');
    return false;
  } finally {
    loading = false;
  }
}

/** Puts the reader back where they were when they return from a post. */
async function restore(): Promise<void> {
  const state = readState();
  if (!state || state.loadedBatches <= 1) return;

  while (loadedBatches < state.loadedBatches) {
    if (!(await loadNextBatch())) break;
  }
  window.scrollTo(0, state.scrollY);
}

if (feed && marker) {
  hideShowMore();

  marker.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest('.show-more');
    if (!link) return;
    event.preventDefault();
    void loadNextBatch();
  });

  // Start loading about one screen before the reader reaches the end.
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadNextBatch();
    },
    { rootMargin: `0px 0px ${Math.round(window.innerHeight)}px 0px` }
  );
  observer.observe(marker);

  window.addEventListener('pagehide', saveState);
  void restore();
}
