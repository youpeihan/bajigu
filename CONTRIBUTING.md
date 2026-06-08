# Contributing to Bajigu

Thank you for helping people keep their focus. 🧠

The single most useful contribution to Bajigu is **keeping the site rules fresh**. YouTube and Facebook change their HTML all the time, and when they do, a selector stops matching and Shorts/Reels leak back in. You can fix that **without understanding the engine, the build, or React** — you only edit a list of CSS selectors.

This is by design: **the engine is stable, the rules are the contribution surface.**

---

## The easiest way: report a broken rule (no code)

1. In the Bajigu popup, click **Report Broken Rule**. It opens a pre-filled GitHub issue with the page URL.
2. Tell us what leaked through (a screenshot helps a lot).

That's it. A maintainer or another contributor turns it into a one-line selector fix.

## The next-easiest way: fix a selector (a few lines)

You only ever touch one of these two files:

- [`src/rules/youtube.ts`](src/rules/youtube.ts)
- [`src/rules/facebook.ts`](src/rules/facebook.ts)

Each is a plain object with arrays of CSS selectors:

| Field | What it does |
|---|---|
| `hideSelectors` | Elements hidden with `display:none` (shelves, cards, nav entries). |
| `countSelectors` | Individual Short/Reel cards, used for the "removed from feed" stat. |
| `redirect` | URL patterns that get bounced to the normal player. |

To fix a leak, you usually just **add one selector** to `hideSelectors`.

### Local steps

```bash
pnpm install
pnpm dev          # loads the extension in a dev browser with hot reload
# edit src/rules/youtube.ts or facebook.ts
pnpm compile      # type-check (must pass)
pnpm build        # production build (must pass)
```

### Finding a good selector

1. Right-click the thing that should be hidden → **Inspect**.
2. Find the smallest stable container (a custom element like `ytd-reel-shelf-renderer`, or an attribute like `[aria-label="Reels tray"]`).
3. **Prefer structural/semantic selectors** (tag names, `aria-*`, `href^="/shorts/"`) over auto-generated class names like `.sc-x1y2z3` — those change weekly and will break again.
4. Add it to the array, reload, confirm the item disappears **and** that nothing legitimate disappears with it.

### PR checklist

- [ ] Only `src/rules/*.ts` changed (engine untouched).
- [ ] `pnpm compile` and `pnpm build` pass.
- [ ] Tested on a real youtube.com / facebook.com page.
- [ ] No legitimate content (normal videos) is hidden by the new selector.
- [ ] One logical change per PR.

Keep PRs small and focused — a rules PR that does one thing gets merged fast.

---

## Bigger changes (engine, new sites, UI)

These are very welcome too, just open an issue first so we can agree on the approach before you build it. Adding a **new site** means creating a new `src/rules/<site>.ts` that matches the `PlatformRule` schema and a matching content-script entrypoint — the existing two are your template.

## Ground rules

- Be kind. This is a focus tool, not a flame war.
- No telemetry, no remote code, no ads, no affiliate links, no changing the user's search engine. These are non-negotiable promises Bajigu makes to its users.
- By contributing you agree your work is licensed under the project's [MIT License](LICENSE).

## Recognition

Every merged contributor is added to the Contributors list. Recurring rules maintainers can be invited as **rule maintainers** with merge rights on `src/rules/`.
