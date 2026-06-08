/**
 * MAIN-world bridge.
 *
 * A content script in the default isolated world CANNOT observe the page's own
 * `history.pushState` / `history.replaceState` calls — patching them there only
 * affects the isolated wrapper, not what YouTube/Facebook actually call. So this
 * tiny script runs in the MAIN world, wraps those two methods, and re-broadcasts
 * each call as a `bajigu:locationchange` DOM event that the isolated content
 * scripts listen for. It holds no rules or state and touches no chrome.* APIs.
 */
export default defineContentScript({
  matches: ['*://*.youtube.com/*', '*://*.facebook.com/*'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    const fire = () => window.dispatchEvent(new Event('bajigu:locationchange'));
    const h = history as unknown as Record<string, (...args: unknown[]) => unknown>;

    for (const method of ['pushState', 'replaceState']) {
      const original = h[method];
      if (typeof original !== 'function') continue;
      h[method] = function (this: unknown, ...args: unknown[]) {
        const result = original.apply(this, args);
        fire();
        return result;
      };
    }
  },
});
