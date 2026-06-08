import { PlatformRule } from '../rules/schema';
import { incrementRemoved } from '../storage/stats';

const COUNTED_ATTR = 'data-bajigu-counted';
const SCAN_INTERVAL_MS = 2500;
const FLUSH_DELAY_MS = 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let pending = 0;

function scan(rule: PlatformRule) {
  if (!rule.countSelectors || rule.countSelectors.length === 0) return;

  const selector = rule.countSelectors.map((s) => `${s}:not([${COUNTED_ATTR}])`).join(', ');
  let nodes: NodeListOf<Element>;
  try {
    nodes = document.querySelectorAll(selector);
  } catch {
    return; // malformed selector on some surface; skip gracefully
  }
  if (nodes.length === 0) return;

  const seenHref = new Set<string>();
  let added = 0;

  for (const el of nodes) {
    // Always mark so an element is never examined twice, even if it's a
    // duplicate link we don't count.
    el.setAttribute(COUNTED_ATTR, '1');

    // Dedupe by the short/reel URL so a card with multiple anchors counts once.
    const href =
      el.getAttribute('href') ?? el.querySelector('a[href]')?.getAttribute('href') ?? '';
    if (href) {
      if (seenHref.has(href)) continue;
      seenHref.add(href);
    }
    added++;
  }

  if (added > 0) {
    pending += added;
    if (!flushTimer) {
      flushTimer = setTimeout(() => {
        const n = pending;
        pending = 0;
        flushTimer = null;
        if (n > 0) incrementRemoved(n).catch(() => {});
      }, FLUSH_DELAY_MS);
    }
  }
}

/**
 * Count Shorts/Reels removed from the feed on a low-frequency throttle.
 * Uses requestIdleCallback so it never competes with scrolling. Idempotent.
 */
export function startFeedCounter(rule: PlatformRule) {
  stopFeedCounter();

  const run = () => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => scan(rule));
    else scan(rule);
  };

  run(); // initial pass
  intervalId = setInterval(run, SCAN_INTERVAL_MS);
}

export function stopFeedCounter() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
    pending = 0;
  }
}
