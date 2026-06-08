import { PlatformRule } from './schema';

export const facebook: PlatformRule = {
  id: 'facebook',
  name: 'Facebook',
  version: '2026.06.07',
  matches: ['*://*.facebook.com/*'],
  redirect: [
    {
      fromRegex: '^https://(?:www\\.|m\\.|web\\.)?facebook\\.com/reel/.*$',
      to: 'https://www.facebook.com/',
      dnrTo: 'https://www.facebook.com/',
    },
  ],
  hideSelectors: [
    'div[aria-label="Reels tray"]',
    'div[aria-label="Reels and short videos"]',
    'div[data-pagelet="Reels"]',
    'a[role="link"][href^="/reel/"]',
  ],
  // Individual reels, for the "removed from feed" count (deduped by href).
  countSelectors: [
    'a[role="link"][href^="/reel/"]',
  ],
};
