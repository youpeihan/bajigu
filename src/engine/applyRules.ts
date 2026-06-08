import { PlatformRule } from '../rules/schema';
import { incrementIntercept } from '../storage/stats';
import { startFeedCounter, stopFeedCounter } from './feedCounter';

const STYLE_PREFIX = 'bajigu-style-';

// Per-platform teardown for the redirect listeners.
const activeTeardowns = new Map<string, () => void>();

/**
 * Inject the hide CSS. Synchronous and idempotent, so it can be called at
 * `document_start` BEFORE first paint (no flash of Shorts). Falls back to
 * <html> when <head> doesn't exist yet.
 */
export function injectHideCss(rule: PlatformRule) {
  if (!rule.hideSelectors || rule.hideSelectors.length === 0) return;
  const styleId = `${STYLE_PREFIX}${rule.id}`;
  if (document.getElementById(styleId)) return;

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = `${rule.hideSelectors.join(', ')} { display: none !important; }`;
  (document.head || document.documentElement).appendChild(styleEl);
}

export function removeHideCss(rule: PlatformRule) {
  document.getElementById(`${STYLE_PREFIX}${rule.id}`)?.remove();
}

/**
 * Enable a platform: ensure the hide CSS is present and wire up the SPA
 * redirect. Idempotent — re-applying tears down the previous redirect listeners
 * first, so repeated toggling never stacks handlers.
 */
export function applyRules(rule: PlatformRule) {
  teardownRedirect(rule);
  injectHideCss(rule);
  setupRedirect(rule);
  startFeedCounter(rule);
}

/** Disable a platform: stop redirecting/counting and unhide. */
export function removeRules(rule: PlatformRule) {
  teardownRedirect(rule);
  stopFeedCounter();
  removeHideCss(rule);
}

function setupRedirect(rule: PlatformRule) {
  if (!rule.redirect || rule.redirect.length === 0) return;

  const compiled = rule.redirect.map((r) => ({ re: new RegExp(r.fromRegex), to: r.to }));

  // Guards against double-firing: multiple navigation signals (yt-navigate-finish
  // + the MAIN-world history bridge) can fire for the same URL.
  let lastHandled = '';

  const checkUrlAndRedirect = async () => {
    const url = window.location.href;
    if (url === lastHandled) return;

    for (const { re, to } of compiled) {
      if (re.test(url)) {
        lastHandled = url;
        // Integrity counter: counted only when the user actually opened a
        // Short/Reel and we intercepted it — not for items merely hidden in the
        // feed. Awaited so the write persists before we navigate away.
        try {
          await incrementIntercept(1);
        } catch {
          /* storage write best-effort; never block the redirect */
        }
        window.location.replace(url.replace(re, to));
        return;
      }
    }
  };

  // YouTube SPA: yt-navigate-finish. Generic SPA (incl. Facebook): the MAIN-world
  // bridge re-broadcasts history.pushState/replaceState as 'bajigu:locationchange'
  // because a content script in the isolated world cannot observe the page's own
  // history calls. popstate covers back/forward.
  window.addEventListener('yt-navigate-finish', checkUrlAndRedirect);
  window.addEventListener('popstate', checkUrlAndRedirect);
  window.addEventListener('bajigu:locationchange', checkUrlAndRedirect);

  // Initial check (a direct load that slipped past the DNR rule).
  checkUrlAndRedirect();

  // Reliability net: Facebook (and some other SPAs) change the URL to the next
  // /reel/<id> as you scroll, without firing a history event the isolated
  // content script can observe. A lightweight poll catches every case — SPA
  // nav, scroll-driven URL swaps, and full loads alike. Cost is one regex test
  // per tick, which is negligible.
  const pollId = setInterval(checkUrlAndRedirect, 500);

  activeTeardowns.set(rule.id, () => {
    window.removeEventListener('yt-navigate-finish', checkUrlAndRedirect);
    window.removeEventListener('popstate', checkUrlAndRedirect);
    window.removeEventListener('bajigu:locationchange', checkUrlAndRedirect);
    clearInterval(pollId);
  });
}

function teardownRedirect(rule: PlatformRule) {
  const teardown = activeTeardowns.get(rule.id);
  if (teardown) {
    teardown();
    activeTeardowns.delete(rule.id);
  }
}
