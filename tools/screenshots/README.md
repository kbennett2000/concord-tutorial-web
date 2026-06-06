# Screenshot generator (maintainers only)

**This folder is for maintainers of this course. It is NOT part of the lessons. Learners never
need Node, npm, Playwright, or anything in here — the lessons use only a browser and the one-time
[SETUP.md](../../SETUP.md). Do not reference this folder from any lesson.**

It regenerates the screenshots embedded in the lessons by driving the real lesson pages with
[Playwright](https://playwright.dev/) against a **live Concord**, so every shot shows real
Scripture and real responses.

## Prerequisites

- **Node** (18 or newer).
- **A running Concord at `http://localhost:8000`** — the screenshots use its real responses, so it
  must be up before you generate them.

## Install

```
cd tools/screenshots
npm install
npx playwright install
```

`npx playwright install` downloads the browser engines (Chromium, Firefox, WebKit). It's a
one-time step.

## Regenerate all screenshots

One command — it writes the PNGs into each lesson's `images/` folder:

```
npm run shots
```

## Check the page in all three engines

The functional smoke test loads Lesson 2's `verse.html` and runs every scenario (verse, range,
friendly "not found," friendly "is it running?") in **Chromium, Firefox, and WebKit** — this is
how we cover Safari/WebKit on Linux:

```
npm run smoke
```

## Keep screenshots honest (the staleness contract)

When a lesson's page or UI changes, **regenerate that lesson's screenshots in the same change**, so
the pictures never drift from what a learner actually sees. A screenshot that lies is worse than
none.

## Troubleshooting

- **No browser builds for your OS / "missing dependencies":** on Linux, install the system
  libraries Playwright needs with `npx playwright install-deps` (needs sudo). On a brand-new distro
  Playwright may not ship matching builds yet — set `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64`
  (or the closest supported release) before `npx playwright install` to fetch a fallback build.
- **Can't install the engines at all?** Set `PW_CHANNEL=chrome` to drive your *system* Google
  Chrome instead of Playwright's bundled Chromium for `shots` and the Chromium leg of `smoke`
  (e.g. `PW_CHANNEL=chrome npm run shots`). Firefox and WebKit in `smoke` still use Playwright's
  builds.
