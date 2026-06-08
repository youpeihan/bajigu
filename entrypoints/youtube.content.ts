import { youtube } from '@/src/rules/youtube';
import { applyRules, removeRules, injectHideCss } from '@/src/engine/applyRules';
import { statsStorage } from '@/src/storage/stats';

export default defineContentScript({
  matches: youtube.matches,
  runAt: 'document_start',
  main() {
    // Optimistic, synchronous, pre-paint hide. Defaults are enabled, so this
    // prevents the flash of Shorts on load. Removed below if actually disabled.
    injectHideCss(youtube);

    async function sync() {
      const enabled =
        (await statsStorage.masterToggle.getValue()) &&
        (await statsStorage.youtubeToggle.getValue());
      if (enabled) applyRules(youtube);
      else removeRules(youtube);
    }

    sync();
    statsStorage.masterToggle.watch(sync);
    statsStorage.youtubeToggle.watch(sync);
  },
});
