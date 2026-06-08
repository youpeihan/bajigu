<div align="center">

<img src="public/icon/128.png" width="96" height="96" alt="Bajigu" />

# Bajigu

**Block YouTube Shorts & Facebook Reels. Redirect Shorts to normal videos. Reclaim your focus.**

[![Build](https://github.com/youpeihan/bajigu/actions/workflows/ci.yml/badge.svg)](https://github.com/youpeihan/bajigu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-8B5CF6.svg)](LICENSE)
<!-- [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/REPLACE_WITH_EXTENSION_ID)](https://chrome.google.com/webstore/detail/REPLACE_WITH_EXTENSION_ID) -->

</div>

---

## The story

I'm a dad. Between work and everything else, my time comes in fragments — and
short-form video was eating every one of them. Shorts, Reels: I'd look up and
twenty minutes were gone.

One evening my two-year-old daughter wanted to play peek-a-boo. She couldn't
quite say it yet — it came out **"Bajigu."** We played, she laughed, and it hit
me that those few minutes with her were exactly what the endless scroll had been
quietly stealing.

So I built **Bajigu**. It clears Shorts and Reels out of your feeds before they
can pull you in, and if you do open one, it sends you straight to the normal
video player. Not to make you productive — just to hand those minutes back, for
peek-a-boo, or whatever your version of it is.

Your attention is the most valuable thing you own. Spend it on what matters.

## Why Bajigu is different

Most blockers just hide Shorts and call it a day. Bajigu is built around one idea:
**give the minutes back without making you fight the page.**

- **You keep the video — you just lose the trap.** Open a Short and Bajigu sends you
  to the *normal* player. Same content, none of the swipe-forever format. Other
  blockers delete it; Bajigu lets you actually watch what you meant to.
- **Zero flicker — it hides before the page paints.** Bajigu injects its rules at
  `document_start`, so you never see Shorts flash in and disappear. Most extensions
  hide *after* load — you get baited for a split second on every visit.
- **It works even inside the app.** Tap a Short from search, a channel, or an in-app
  swipe and Bajigu still catches it. Naive blockers only handle full page loads and
  miss in-app navigation entirely.
- **Honest numbers, not vanity metrics.** Two separate stats: Shorts *removed from
  your feed*, and Shorts you actually *opened and resisted*. No inflated
  "you saved 40 hours" fiction the day you install it.
- **No ads, no tracking, no servers, no VC.** 100% local, funded only by the people
  it helps. It's a dad's side project, not an ad-tech funnel.

**Supported today:** YouTube Shorts, Facebook Reels. More sites are added through
community-maintained [rules](src/rules) — no engine changes required.

## Install

**From the Chrome Web Store:** _coming soon_ — link will appear here at launch.

**From source (developer mode):**

```bash
pnpm install
pnpm build
```

Then open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select `.output/chrome-mv3`.

## How it works

Bajigu keeps a clean separation between the **engine** (how things are hidden/redirected/counted) and the **rules** (what to hide on each site). You almost never need to touch the engine.

```
src/
  rules/        <- what to hide & redirect per site  (the contribution surface)
    youtube.ts
    facebook.ts
    schema.ts   <- the shape every rule must follow (Zod-validated)
  engine/       <- how it's done (hide CSS, SPA redirect, counting)
  storage/      <- local stats & toggles
entrypoints/    <- background worker, content scripts, popup, dashboard, new tab
```

- **Hiding** is pure CSS injected at `document_start` -> no flash of Shorts.
- **Redirecting** uses Chrome's `declarativeNetRequest` for full-page loads, plus a tiny `MAIN`-world bridge that catches in-app (SPA) navigations.
- **Counting** is two honest numbers: *removed from feed* (scale) and *resisted* (the Shorts you actually opened and we intercepted).

## Contributing

Sites change their markup constantly — that's the #1 reason a blocker breaks. **The most valuable thing you can do is keep the rules fresh, and you can do it without touching the engine.** See **[CONTRIBUTING.md](CONTRIBUTING.md)**.

The fastest path: if something stopped being hidden, click **Report Broken Rule** in the extension popup — it opens a pre-filled issue.

## Support

Bajigu has no ads, no tracking, no data to sell, and no investors — donations are
the *only* thing that keep the rules maintained as YouTube and Facebook keep changing.
If Bajigu gave you back even one evening, please consider **[supporting it with crypto](DONATE.md)**.
You're not tipping a company — you're backing one parent building a tool that gives
time back instead of stealing it. 🤫

## License

[MIT](LICENSE) © youpeihan
