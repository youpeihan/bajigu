import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Bajigu — Block YouTube Shorts & Facebook Reels',
    description:
      'Hide and block YouTube Shorts and Facebook Reels. Redirect Shorts to normal videos, stop the doomscroll, and reclaim your focus.',
    permissions: ['storage', 'declarativeNetRequest'],
    host_permissions: ['*://*.youtube.com/*', '*://*.facebook.com/*']
  }
});
