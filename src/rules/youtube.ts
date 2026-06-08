import { PlatformRule } from './schema';

export const youtube: PlatformRule = {
  id: 'youtube',
  name: 'YouTube',
  version: '2026.06.07',
  matches: ['*://*.youtube.com/*'],
  redirect: [
    {
      fromRegex: '^https://(?:www\\.|m\\.)?youtube\\.com/shorts/([^?/#]+).*$',
      to: 'https://www.youtube.com/watch?v=$1',
      dnrTo: 'https://www.youtube.com/watch?v=\\1',
    },
  ],
  // Hidden via CSS (display:none). Covers home feed, search results,
  // watch-page "up next", subscriptions, sidebar, and the newer shorts shelves.
  hideSelectors: [
    // Home / feed shelves
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has([is-shorts])',
    // Search results + watch-page related "Shorts" carousels
    'ytd-reel-shelf-renderer',
    'grid-shelf-view-model',
    // Individual Shorts cards wherever they appear (feed, search, related)
    'ytd-rich-item-renderer:has(a[href^="/shorts"])',
    'ytd-video-renderer:has(a[href^="/shorts"])',
    'ytd-grid-video-renderer:has(a[href^="/shorts"])',
    'ytd-compact-video-renderer:has(a[href^="/shorts"])',
    // Left sidebar + mini sidebar entries
    'ytd-guide-entry-renderer:has(a[title="Shorts"])',
    'ytd-guide-entry-renderer:has(a[href^="/shorts"])',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[href^="/shorts"])',
  ],
  // Individual Shorts cards, for the "removed from feed" count.
  countSelectors: [
    'ytd-rich-item-renderer:has(a[href^="/shorts"])',
    'ytd-video-renderer:has(a[href^="/shorts"])',
    'ytd-grid-video-renderer:has(a[href^="/shorts"])',
    'ytd-compact-video-renderer:has(a[href^="/shorts"])',
    'ytd-reel-item-renderer',
    'ytm-shorts-lockup-view-model',
  ],
};
