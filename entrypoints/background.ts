import { youtube } from '@/src/rules/youtube';
import { facebook } from '@/src/rules/facebook';
import { statsStorage } from '@/src/storage/stats';

export default defineBackground(() => {
  const YOUTUBE_RULE_ID = 1;
  const FACEBOOK_RULE_ID = 2;

  async function updateRules() {
    const isMasterEnabled = await statsStorage.masterToggle.getValue();
    const isYoutubeEnabled = await statsStorage.youtubeToggle.getValue();
    const isFacebookEnabled = await statsStorage.facebookToggle.getValue();

    const addRules: Array<chrome.declarativeNetRequest.Rule> = [];

    if (isMasterEnabled && isYoutubeEnabled && youtube.redirect && youtube.redirect.length > 0) {
      const r = youtube.redirect[0];
      addRules.push({
        id: YOUTUBE_RULE_ID,
        priority: 1,
        action: {
          type: 'redirect' as const,
          redirect: {
            regexSubstitution: r.dnrTo ?? r.to,
          },
        },
        condition: {
          regexFilter: r.fromRegex,
          resourceTypes: ['main_frame' as const],
        },
      });
    }

    if (isMasterEnabled && isFacebookEnabled && facebook.redirect && facebook.redirect.length > 0) {
      const r = facebook.redirect[0];
      addRules.push({
        id: FACEBOOK_RULE_ID,
        priority: 1,
        action: {
          type: 'redirect' as const,
          redirect: {
            regexSubstitution: r.dnrTo ?? r.to,
          },
        },
        condition: {
          regexFilter: r.fromRegex,
          resourceTypes: ['main_frame' as const],
        },
      });
    }

    // Single atomic call: remove old rules and add new ones together
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [YOUTUBE_RULE_ID, FACEBOOK_RULE_ID],
      addRules,
    });
  }

  updateRules();

  statsStorage.masterToggle.watch(updateRules);
  statsStorage.youtubeToggle.watch(updateRules);
  statsStorage.facebookToggle.watch(updateRules);

  // Consent-first onboarding: explain the new-tab takeover on first install and
  // let the user opt out before they're surprised by it.
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      browser.tabs.create({ url: browser.runtime.getURL('/welcome.html') });
    }
  });
});
