import { facebook } from '@/src/rules/facebook';
import { applyRules, removeRules, injectHideCss } from '@/src/engine/applyRules';
import { statsStorage } from '@/src/storage/stats';

export default defineContentScript({
  matches: facebook.matches,
  runAt: 'document_start',
  main() {
    // Optimistic, synchronous, pre-paint hide. Defaults are enabled, so this
    // prevents the flash of Reels on load. Removed below if actually disabled.
    injectHideCss(facebook);

    async function sync() {
      const enabled =
        (await statsStorage.masterToggle.getValue()) &&
        (await statsStorage.facebookToggle.getValue());
      if (enabled) applyRules(facebook);
      else removeRules(facebook);
    }

    sync();
    statsStorage.masterToggle.watch(sync);
    statsStorage.facebookToggle.watch(sync);
  },
});
