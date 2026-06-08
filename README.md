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

## What it does

- **Hides Shorts & Reels** across YouTube and Facebook — home feed, search, sidebar, watch-page carousels — with zero flash on load.
- **Redirects Shorts to the normal player.** Open a `/shorts/` link anywhere and you land on `/watch` instead.
- **An honest focus dashboard** on your new tab (optional): a streak, how many Shorts you've kept out of your feed, and how many you actually resisted opening.
- **100% local.** No accounts, no tracking, no servers. Your stats never leave your device.
- **No ads. No search hijacking.** Ever.

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

Bajigu is free, open-source, and will never show ads or sell your data. If it
gave you back some time, you can [sponsor the project](https://github.com/sponsors/youpeihan)
— it keeps the rules maintained and the lights on. ☕

## License

[MIT](LICENSE) © youpeihan
