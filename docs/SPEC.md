# concord-tutorial-web — Build Spec

> Status: **complete.** The whole build shipped across twenty reviewed PRs — the front door (T0),
> all five lessons (T1–T5), the two freebies (T6), the branding/polish pass (T7), and a CI slice
> that runs the smoke on every push and PR. The five-lesson course is now under **three-engine
> regression protection** (§8.1). This document is the design-of-record the build was built against;
> it lives at `docs/SPEC.md` and is now a record of a finished project. Same spec-first, PR-per-slice
> discipline as Concord; Kris merged each slice after review.
>
> **Synced through the full build** (T0–T7 plus the CI slice) and the Concord CORS fix. What's
> recorded below: a new lead rule heads §5.1 — the umbrella *"write for
> one real reader"* — with the others recast as instances of it (§5.1); a real Concord
> cache-poisoning bug found during T2c was **fixed at the root in Concord v1.0.2** (§3.2.1), which
> the course pins to; Lesson 5 adds the one dependency (Leaflet 1.9.4) and teaches the offline→online
> tradeoff (§2.5); a missing translation that Concord's API.md calls `null` is actually a placeholder
> string in v1.0.2 (§2.4); and gates run against the **pulled** v1.0.2 image, never a local rebuild
> (§8.1).

## 0. What this is — and who it's for

`concord-tutorial-web` is a **five-lesson course that teaches someone who has never written
code to build a real web app on top of a running Concord.** Concord is the vehicle; the
learner is the point. The repo serves the learner, not the API.

By the last core lesson they have built something they can open in front of their pastor: a
single page that compares Bible translations side by side and shows *where* Scripture
happened — honestly marking the places history has lost. It runs entirely on their own
computer. The optional final lesson puts those places on a map.

**Primary audience — the non-technical but curious reader.** Someone with an interest in the
Bible who found Concord, isn't sure what an API is, and has never built anything. Every line
is written for them. Seasoned developers are welcome to skim, but they are explicitly **not**
the target — they already have `docs/API.md` in the main Concord repo for fast reference. We
do not try to serve two densities in one voice. This is a "your first app" course that
happens to use Concord, not API documentation that beginners can tolerate.

**Relationship to Concord.** Separate repo, `kbennett2000/concord-tutorial-web` — the first of
the `concord-tutorial-*` glob the main README promised. It **assumes Concord is already
running** and, if it isn't, points to the existing Quick start / Deployment docs rather than
re-explaining install (§3). It pins to Concord's **`/v1` surface** (a stated stable contract)
and **v1.0.2** (the release carrying the CORS cache fix from §3.2). Proof it's worth their time:
**songbird** is a real app already running on these exact endpoints — we point at it as evidence,
not a hypothetical.

## 1. Design principles (these drive concrete decisions, not just tone)

Three behavior principles from Cialdini, each cashed out in a specific spec decision so they
shape what gets built, not just how it reads:

- **Commitment & Consistency** — small wins create momentum.
  - Lesson 1 is *numbered and completable in ~90 seconds with nothing installed* (not "Lesson
    0 / warm-up" — it must count as a finished lesson, a banked win).
  - **No lesson ever ends on broken.** Every lesson closes with something that visibly works —
    never "and next time it'll finally run."
  - Each lesson opens with a one-line **callback** to the prior win and closes with a
    **"you can now ___"** line, so forward motion is felt, not asserted.

- **Reciprocity** — give the useful thing first.
  - Every lesson ships a **complete, runs-as-is file they keep** — never a fill-in-the-blank
    skeleton they must earn.
  - Two freebies (§6): `recipes.md` ("steal these" snippets) and an ideas list ("what could
    you build?"). Seeding use cases is itself a gift.
  - The README's Concord-running check (§3.4) removes the step-one trap *before* they've invested
    anything.

- **Unity / Identity** — shift the reader from "trying Concord" to "I'm a Concord builder."
  - **Builder language from line one**: "the app you're about to build," "your endpoint,"
    "when your users…" — never "if you manage to."
  - Lesson 1 names the act in the field's own vocabulary: *"you just made your first API
    call."*
  - The capstone has to be genuinely **demoable** — the moment they show it to a friend or
    their pastor is the moment the identity sets.
  - The repo closes by **inducting** them: "you're a Concord builder now — here's where
    builders go next" (→ `docs/API.md`, the ideas list, an invitation to say what they built).
  - Sharing that *we* — Kris, Claude, cc — built songbird on this same surface puts them in
    the workshop, not the bleachers.

## 2. The arc — five lessons, one new idea each

| # | Lesson | The one new idea | Concord endpoint(s) | Ships | "You can now…" |
|---|---|---|---|---|---|
| 1 | **Is it on, and what does it say?** | An endpoint returns *data*, not a page; that data is JSON | `GET /healthz`, `GET /v1/verses/{ref}` | *(nothing — browser only)* | …read raw Concord data right in your browser |
| 2 | **Show me a verse** | The request → fetch → read JSON → display loop | `GET /v1/verses/{ref}` | `verse.html` | …turn what a user types into a live verse on your page |
| 3 | **Find verses by idea** | Query parameters; looping over a list of results; meaning vs. keyword | `GET /v1/semantic-search`, `GET /v1/search` | `search.html` *(both, side by side)* | …let users search Scripture by meaning **and** by word — and know the difference |
| 4 | **Capstone (core): Compare, and where did it happen?** | Composing several calls in one app; displaying structured data **honestly** | `GET /v1/verses/{ref}?translations=…`, `GET /v1/verses/{ref}/places` | `app.html` | …build a real, multi-feature app that runs fully offline |
| 5 | **Capstone (stretch, optional): Drop the pins** | Using a third-party library; the offline→online tradeoff | *(adds Leaflet + online map tiles)* | `app-map.html` | …put your data on a map — and understand the tradeoff you just made |

One new idea per lesson; every lesson ends in something that visibly works. The split between
Lesson 4 (core) and Lesson 5 (stretch) is deliberate and explained in §2.5.

### 2.1 Lesson 1 — Is it on, and what does it say? *(browser only, no files)*

- **Callback:** none — this is the first win. Open with the promise: "in the next two minutes
  you'll make your first API call, with nothing installed."
- **What the learner does:**
  1. Type `http://localhost:8000/healthz` in the browser address bar. A blob of text comes
     back with counts. *"Concord is awake, and it just answered you. That text is data — not a
     web page. You just made your first API request, and you didn't write a line of code."*
  2. Ask for a verse: `http://localhost:8000/v1/verses/John 3:16`. Scripture comes back as
     data. Try another book, another reference.
- **Concept taught:** an **endpoint** is a web address that gives back *data* instead of a
  page; the data format is **JSON**; you've been using APIs your whole life — every app does
  this behind the scenes.
- **Honest note (sets up Lesson 2 — commitment):** raw JSON looks messy in the browser, and
  that's fine. Firefox pretty-prints it; other browsers show it raw; either is okay — Lesson 2
  makes it pretty. *Do not* require a JSON-viewer extension (no install in Lesson 1).
- **What you just learned about APIs (2 lines):** an endpoint is a URL that returns data;
  that data is JSON, which apps read and reshape into what you see on screen.
- **You can now:** read raw Concord data right in your browser.
- **Acceptance:** a reader with only a browser and a running Concord reaches a verse with zero
  files and zero installs.

### 2.2 Lesson 2 — Show me a verse *(first vanilla HTML file: `verse.html`)*

- **Callback:** "You can already pull any verse by hand — now let's let your *users* pick one."
- **What the learner does:** open `verse.html` via Live Server (§3), type a reference, click a
  button, watch the verse appear on the page.
- **The file (single, self-contained):** an `<input>` for a reference, a `<button>`, a result
  `<div>`; the base-URL constant at the top of the script (§3.3); a plain
  `fetch(url).then(r => r.json())` then render. **Build the display against the actual
  `/v1/verses` response shape documented in Concord's `docs/API.md` — do not invent field
  names** (mirrors Concord's own "never invent reference data" rule). Keep the fetch
  header-free (§3.1).
- **Concept taught:** the full **request → response → display** loop, named in plain terms then
  in real terms (request, response, `fetch`, JSON, parsing).
- **Error handling is part of the lesson (reciprocity + no-broken-ending):** if the verse
  doesn't exist (404) or Concord is off (network error), show a friendly message — never a
  silent fail or a raw stack trace. Ship the friendly handler; it also lands in `recipes.md`.
- **What you just learned about APIs (2 lines):** your code sends a request to a URL and gets
  JSON back; you read fields out of that JSON and put them on the page — that's most of what a
  web app does.
- **You can now:** turn what a user types into a live verse on your page.
- **Acceptance:** typing a valid reference shows the verse; an invalid one shows a friendly
  message; Concord-off shows a friendly message.

### 2.3 Lesson 3 — Find verses by idea *(`search.html`, two panes side by side)*

- **Callback:** "Your app can show a verse someone already knows — now let's help them *find*
  one they don't."
- **What the learner does:** one input, one button; submitting fires **both** searches and
  shows results in two columns, **both pinned to WEB** so the comparison is which *verses* each
  method finds, not which translation. Type a thematic query whose literal words aren't in the
  text: keyword search misses passages that never use those words; meaning search surfaces them.
  *(Shipped pre-fill: `feeling alone and forgotten` → keyword empty, meaning finds Job 19:14 /
  Psalm 31:12. The design first tried `do not be anxious`, but WEB uses that very wording, so it
  was swapped after live verification — the contrast must be confirmed against real data, not
  assumed.)*
- **The file:** two `fetch` calls — `/v1/search?q=…` (keyword/FTS) and
  `/v1/semantic-search?q=…` (meaning) — each returning a **list**; loop over each list and
  render. Teaches **query parameters** (`?q=…&limit=…`) and **looping over results**.
- **Delightful aside (not the main path):** `/v1/search` can be hit by a *zero-JavaScript*
  `<form method="get">` whose `action` is the endpoint — submit and the browser navigates
  straight to the JSON. Mention it as a "did you know?" (and put it in `recipes.md`); we use JS
  for both panes here for consistency. *(Note for cc: native forms submit query strings, which
  is why this trick works for `?q=` search but not for the `/v1/verses/{ref}` path — don't
  generalize it.)*
- **Concept taught:** query parameters; iterating a result list; and the *idea* difference —
  keyword = the same words, meaning = the same idea.
- **What you just learned about APIs (2 lines):** parameters after `?` let you ask a more
  specific question; many endpoints answer with a list, and your code loops over it to build
  the page.
- **You can now:** let users search Scripture by meaning and by word — and you understand the
  difference.
- **Acceptance:** both panes populate; the chosen example visibly demonstrates meaning-search
  catching what keyword-search misses (an empty keyword pane is the *teaching moment*, not an error).

### 2.4 Lesson 4 — Capstone (core): Compare, and where did it happen? *(`app.html`)*

- **Callback:** "You can read a verse, and you can search. Let's put real features together
  into one app you'd actually show someone."
- **What the learner does:** enter a reference; the app shows (a) the passage in **three
  translations side by side** and (b) the **places** that passage names, each shown honestly.
- **The file composes two calls:**
  - `GET /v1/verses/{ref}?translations=KJV,WEB,ASV` → three columns. (Old vs. modern English is
    itself interesting and makes parallel translations concrete.) **Discrepancy to know:** a
    translation that omits a verse comes back as the literal string `"[verse not included in this
    translation]"` in v1.0.2 — *not* `null` as Concord's `docs/API.md` states. The lesson handles
    both; the inconsistency is a Concord-side doc/code mismatch worth reconciling there (the docs'
    `null` is arguably the better API design — an English display-string baked into JSON forces
    that wording on every client).
  - `GET /v1/verses/{ref}/places` → the places named, each rendered by its **status** (one of
    five): `identified` and `disputed` carry real coordinates (disputed flagged as a contested
    best guess); `unknown`, `symbolic`, and `multiple` carry **`null` coordinates** and are shown
    honestly ("location lost to history" / "a figurative name" / "refers to several places") with
    **no fabricated coordinates**. *(Shipped win: Genesis 4:16 — Eden and Nod both `unknown`, so the
    honesty model lands in the very first screen; the `LORD`/`Yahweh`/`Jehovah` divine-name
    difference across KJV/WEB/ASV is the translation contrast. Acts 17 (located places) and John
    3:16 (no places — the verse is about an idea) are the live-verified experiments.)*
- **Concept taught:** composing multiple API calls in one app; reading and **honestly
  displaying** structured data. The honesty model doubles as a *values* lesson — your app tells
  the truth about what's uncertain instead of inventing a pin.
- **Constraints:** **no new dependencies; fully offline.** This is a complete, demoable app.
- **What you just learned about APIs (2 lines):** one app can call several endpoints and weave
  the answers together; good apps present uncertain data honestly rather than faking
  confidence.
- **You can now:** build a real, multi-feature app — running entirely on your own computer, no
  internet. *(Identity moment: "open this in front of someone.")*
- **Acceptance:** three translations render side by side; places render with correct
  per-status display; an `unknown` place shows no coordinates; works with the network off.

### 2.5 Lesson 5 — Capstone (stretch): Drop the pins *(`app-map.html`)*

The stretch / graduation lesson — genuinely skippable, but **not advertised as "optional" on the
front door** (§3.4, §5.1). Skippability is conveyed where it's actionable: in **Lesson 4's closer**
("you can stop here with a finished app you're proud of") and within this lesson itself — never as
a front-door caveat that plants doubt before the reader has started.

- **Callback:** "Your app already shows *where* in words. Want to see it on a map? This is the
  step where you go from beginner to builder."
- **What the learner does:** add **Leaflet 1.9.4** (current stable; 2.0 is alpha-only) via a
  pinned CDN `<link>` + `<script>` with the official integrity hashes, plus OpenStreetMap tiles
  (attributed). Drop pins for the located places (`identified`/`disputed`) with name popups, fit
  the map to them, and — crucially — **do not draw** the no-coordinate places (`unknown`/`symbolic`/
  `multiple`); list them beside the map as "named here, but location lost — not on the map." The
  honesty model becomes *visible*: a pin means we know, a footnote means we don't — and the map
  literally cannot lie, because Concord won't hand it fake coordinates. *(Shipped win: Acts 17 —
  six pins tracing Paul's route across Greece. Load-bearing gotcha: the `#map` div needs an explicit
  CSS height or Leaflet renders a blank box.)*
- **Concept taught:** (1) using a **third-party library** — you don't build everything
  yourself; (2) the **offline → online tradeoff**, taught explicitly.
- **The honest flag (this is why it's last and optional):** Concord's data is local, but map
  *tiles* come from a tile server **on the internet**. This is the first time the app reaches
  online — so it **won't work on an air-gapped LAN box**, and it breaks the
  everything-is-local ethos every prior lesson honored. We say so plainly. Crossing that line —
  adding a dependency, reaching online — is itself the moment they stop being a beginner.
- **What you just learned about APIs (2 lines):** libraries let you stand on others' work; and
  every external dependency is a tradeoff — here, a map for a network connection you didn't
  need before.
- **You can now:** put your data on a map — and you understand the tradeoff you made to do it.
- **Acceptance:** identified places appear as pins; no-coordinate places are listed, not drawn;
  the online-tiles tradeoff is stated; skippability is conveyed at Lesson 4's closer and within
  this lesson, not as a front-door label.

## 3. How a learner runs the lessons — the bulletproof step one

The one step that must not fail. Verified against current browser behavior (2026), not
assumed.

### 3.1 The single blessed path: serve over `http://localhost`

**These run instructions live in `SETUP.md` at the repo root, not the README** (the front door
defers to it — see §3.4, §4). They're needed only from Lesson 2 on; Lesson 1 is browser-only.
The substance below is unchanged — it was relocated, not rewritten.

Opening a lesson file by **double-clicking it (`file://`) does not work** — modern browsers treat
local files as opaque origins, so `fetch()` fails before reaching Concord (MDN's own guidance is
to run a local server). So there is exactly one recommended path, stated with no hedging:

1. **VS Code + Live Server (the warm default).** Open the lesson folder in VS Code, install the
   Live Server extension once, click **"Go Live."** The page opens at `http://localhost:5500`
   and auto-reloads on save (editing becomes fun — a small delight worth naming).
2. **`python3 -m http.server 5500` (terminal alternative, gated by "already comfortable with a
   terminal?").** Run it from inside the lesson folder, then visit `http://localhost:5500`. Do
   **not** claim Python is pre-installed — it isn't reliably (modern macOS/Windows ship without
   it); give a one-line check (`python3 --version`) and a python.org link if it's absent.

Implementation rule for cc, load-bearing: **every fetch is a plain `fetch(url)` with no custom
headers.** That keeps it a CORS "simple request," so Concord's `Access-Control-Allow-Origin: *` is
honored with **no preflight**. Do not add `Content-Type`, `Authorization`, or other headers to
these GETs. (This is *necessary but not sufficient*: a simple request still tripped a real
cache-poisoning bug on the Lesson 1 → Lesson 2 path, now fixed in Concord — see §3.2.)

### 3.2 Why "Chrome blocks localhost" doesn't apply to us (worth one sentence in the README)

Chrome's Local Network Access / Private Network Access (Chrome 142+) gates a **public** website
reaching into a more-private network (localhost or a LAN IP). Our page and Concord live in the
**same** address band — both on `localhost` (the happy path), or both on the same LAN (the
cross-machine footnote) — so the gate never fires. The only blocked scenario, a public site
talking to a LAN Concord, is exactly what Concord's `SECURITY.md` says not to do; it stays out
of scope.

### 3.2.1 The cache-poisoning bug we found and fixed (Concord v1.0.2)

The course's run path is solid because a real Concord bug was **fixed at the root**, not worked
around — worth recording, since it's why the spec no longer claims "Concord needs no change."

During T2c (screenshots), driving the actual reader path surfaced it. Lesson 1 has the reader
visit a verse URL directly in the address bar — a top-level navigation, which sends *no* `Origin`
header — so Concord's CORS middleware returns that response with **no** `Access-Control-Allow-Origin`,
and it's cached hard (verses are `immutable`, one year). Lesson 2 then fetches that *same*
pre-filled verse cross-origin; with **no `Vary: Origin`** on the cached response, the browser
reuses the `ACAO`-less cached copy, the CORS check fails, and the reader sees the calm "couldn't
reach Concord — is it running?" message while Concord is up. Silent, confusing, and squarely on the
happy path (Lesson 1 sends them to John 3:16; Lesson 2 pre-fills John 3:16).

The fix is one line in Concord's shared `cached_json_response` helper — add `Vary: Origin` — which
covers every cacheable endpoint and both the 200 and 304 paths, and helps **every** consumer that
mixes a direct visit with a cross-origin fetch (songbird, soap-journal included). Shipped in
**Concord v1.0.2**; the course pins there. Because it's fixed in Concord, the lessons need no
mitigation (no cache-busting, no `no-store`) and stay clean.

### 3.3 The base-URL one-liner

Each lesson file is self-contained and carries its connection setting as a single, clearly
labeled line at the top of its script:

```js
const CONCORD = "http://localhost:8000"; // ← change this only if Concord runs on another computer
```

- **Same machine as Concord (the happy path):** leave it as `localhost`.
- **Concord on another LAN box (footnote):** change this one line to that machine's address
  (e.g. `http://192.168.1.62:8000`) — link Concord's Deployment docs for finding a LAN IP.

We repeat this constant per file rather than sharing a `config.js`: a second file invites "why
are there two? how do they connect?" cognitive load, and self-contained single files are the
cleanest beginner story. (A grown-up aside can note that real apps centralize this.) The course
strongly steers toward **same-machine + localhost + Live Server** as *the* path; cross-machine
LAN is a one-line footnote.

### 3.4 The README front door (trimmed to just-in-time — §5.1)

The README's job is to get the reader hands-on fast, not to brief them. Per §5.1, setup and the
roadmap are deferred; the page is short. In order:

- The banner.
- A short, warm welcome (the build-a-real-app / run-it-yourself / you-become-a-builder framing,
  a few sentences).
- **"Who this is for"** — the beginners-welcome paragraph and the "already a developer? → Concord's
  `docs/API.md`" callout. Brief.
- **The one un-failable check:** a 30-second "is Concord on?" callout — visit
  `http://localhost:8000/healthz`; counts come back ⇒ ready; if not, link Concord's existing
  **Quick start**. Do **not** re-explain install.
- **A single deferred pointer to setup**, e.g. "Lesson 1 needs nothing but your browser; Lesson 2
  onward needs a quick one-time setup — see `SETUP.md` when you get there." The run instructions
  themselves live in `SETUP.md` (§3.1), not here.
- **"Start here"** → Lesson 1 (~2 minutes, nothing installed).
- **"What's ahead"** *at the end only*, as encouragement — a short prose line (not a table, not a
  syllabus): a quick verse fetcher, search by meaning, a translation-comparer, and, if you want it,
  a map. **No lesson is labeled "optional"; no special-casing of Lesson 5; no caveats** on the
  front door (any "you can stop after Lesson 4" framing belongs in Lesson 4's closer, where it's
  actionable).
- The License line.

What the README does **not** carry: the how-to-run section (now `SETUP.md`), a "what you'll need"
list, an up-front lesson-map table, or any reassurance phrased in words the reader doesn't yet
know (no "no npm").

## 4. Repo structure

```
concord-tutorial-web/
├── README.md                     # front door: welcome · who-it's-for · the Concord check · SETUP pointer · Start here · what's-ahead (end)
├── SETUP.md                      # the one-time run instructions (how-to-run), surfaced from Lesson 2 on (§3.1)
├── LICENSE                       # MIT © 2026 Kris Bennett (parity with Concord)
├── .gitignore
├── docs/
│   ├── SPEC.md                   # this document
│   └── banner.svg                # committed banner (§7), mirrors Concord's docs/banner.svg
├── lessons/
│   ├── 01-is-it-on/
│   │   ├── README.md             # browser-only lesson, no code file (no SETUP link — nothing to set up)
│   │   └── images/               # checkpoint screenshots (§5.2)
│   ├── 02-show-me-a-verse/       # 02–05 each open with a one-line "do SETUP.md first" pointer
│   │   ├── README.md
│   │   ├── verse.html
│   │   └── images/               # checkpoint screenshots (§5.2)
│   ├── 03-find-by-idea/
│   │   ├── README.md
│   │   ├── search.html
│   │   └── images/
│   ├── 04-compare-and-where/
│   │   ├── README.md
│   │   ├── app.html
│   │   └── images/
│   └── 05-drop-the-pins/         # the stretch/graduation lesson (not advertised "optional" on the front door)
│       ├── README.md
│       ├── app-map.html
│       └── images/
├── tools/
│   └── screenshots/              # MAINTAINER-ONLY screenshot generator (§5.2); NOT part of the course; node_modules/ gitignored
├── recipes.md                    # "steal these" snippets (§6)
└── ideas.md                      # "what could you build?" (§6)
```

- **Lesson text lives in each folder's `README.md`**; the lesson's file(s) sit beside it. Clone
  once, `cd` into a lesson, read the README, open the file.
- **Top-level `README.md`** is the course front door (§3.4) — welcome, the audience-cleave, the
  Concord check, a deferred `SETUP.md` pointer, Start here, and a closing what's-ahead. It is
  *not* API documentation, and it does **not** hold the run instructions (those are `SETUP.md`)
  or an up-front lesson map.
- **`SETUP.md`** holds the single blessed run path (§3.1); Lessons 2–5 link to it at the top.
- **`tools/screenshots/`** is maintainer-only (§5.2) — Node/Playwright walled off here, never
  referenced by a lesson; `node_modules/` is gitignored and the repo root stays npm-free. Each
  lesson's checkpoint screenshots live beside it in `lessons/NN-…/images/`.

## 5. Voice & formatting rules (so cc writes every lesson consistently)

- Second person, warm, **builder framing** from line one — never "if you manage to."
- **Plain language first, then the real term** ("you just made an API *request*"). Define each
  piece of jargon once, on first use.
- **Short sections, lots of working code, no walls of text.** Break things up. If a lesson
  starts to sprawl, it's two lessons or it's carrying scope it shouldn't.
- **Every code block is complete and runnable** (reciprocity), and **commented for a
  beginner** — comments explain *why*, in human terms.
- **No build step, no npm, no dependencies through Lesson 4.** Lesson 5 introduces exactly one
  (Leaflet via CDN) and flags it as the tradeoff it is.
- Match Concord's documentation voice (warm, precise, honest about limits) so the two repos feel
  like one family.

### 5.1 The hard-won rules (front-door lessons — operative wording is verbatim in CLAUDE.md)

These emerged from iterating real pages, each earned after a beginner-hostile draft slipped
through. They share one root cause — writing for a developer by default, explaining or reassuring
before it's due — so the **lead rule names that root directly, and the rest are its instances**.
CLAUDE.md carries the operative wording cc reads each session; the reasoning lives here.

- **Write for one real reader — run every line past them (the umbrella).** Picture a specific
  person: curious, non-technical, has never written a line of code, one frustration from closing
  the tab. Before anything ships, hold each sentence and each step up to them: *would they know
  what this means? how to do it? why they're doing it?* Any "no" → cut, explain, or move. Every
  rule below is an instance of this. Sharpest instance: **never ask the reader to perform an action
  whose only purpose is to exercise the code** — stop a server, deliberately break something, force
  an error. That's the builder's job, already done for them; the reader only does what a real user
  would naturally do, and meets error states through *reassurance* ("if you ever see this, here's
  what it means"), never by being told to cause them. *(Added after the "Stop Concord and try
  again" step in Lesson 2 slipped past every specific rule below — proof that a growing list of
  don'ts has a ceiling, and the audience needs naming at the root. Companion check in CLAUDE.md's
  "Done" section: before a PR, read the lesson back **as the reader, not the author**.)*
- **Break the wall — a scannable page is itself reassurance.** For this reader a page that
  *looks* easy signals "you can do this"; a dense block signals "this is hard." Short paragraphs
  (2–4 sentences), frequent plain subheadings, numbered steps for anything sequential, a code
  block for anything you'd type, callouts for the must-not-miss bits, one bold phrase per
  section — kept warm, never an all-bullets checklist. (Found when T0's README, though correctly
  formatted, still read as a wall: the problem was volume and placement, not markup.)
- **No unexplained jargon — especially the tooling.** The lesson's *topic* (API, endpoint,
  JSON…) is taught as introduced; the easy thing to forget is the *incidental tooling* the reader
  is told to touch — VS Code, an extension, a terminal, a command, a language. Gloss each in one
  plain line + a link on first mention. Never name a scary unknown just to reassure ("no npm"
  introduces a fear rather than removing one), and never make the reader inventory their own
  machine ("use whichever you have" → recommend one default, let an "already comfortable with X?"
  line self-select alternatives).
- **Just-in-time, not just-in-case.** Everything true is not everything useful — if a sentence
  isn't helping the reader do the thing in front of them *right now*, it's costing them attention
  and confidence. Setup, caveats, and concepts appear in the lesson that needs them, not earlier.
  The roadmap is a destination, not a syllabus: no map of all lessons on entry; a "what's ahead"
  list, if it earns a place, goes at the *end* as encouragement. Never answer an unasked
  question — especially a reassurance: naming a fear to soothe it plants the fear ("don't worry,
  Lesson 5 isn't hard" *creates* the worry). This supersedes any pull toward completeness on entry
  pages — the front door's job is to get hands-on fast, not to brief.
- **Motivation is timed, not cut.** Just-in-time defers *instructions and caveats*; it does not
  delete encouragement. Proof-it's-real and you-could-build-this beats (Unity) land hardest right
  *after* a win — at a lesson's closer — never as front-door preamble. (Why songbird's "a real app
  already runs on these endpoints" moved from the README to Lesson 1's closer.)
- **Working first, explanation second — the win before the why.** A beginner needs to *see it run*
  before they care how it runs; never gate the hands-on behind a wall of explanation. A code lesson
  opens by getting the reader to a *running, working result* as fast as possible (start the
  preview, open the page, watch it work), and only *then* explains how, for the reader who's now
  curious. The structure for code lessons: callback → what we're building (a sentence or two) → get
  it running and watch it work (the win) → how it works, piece by piece (the reward, not the gate) →
  the two closers. (Found when Lesson 2 made the reader read a full code dissection before anything
  worked — backwards.)
- **Setup happens once; lessons assume it's done.** The reader sets up a single time — getting the
  files and starting a local preview (`SETUP.md`), and confirming Concord is on (the README's
  front-door check, before Lesson 1). From Lesson 2 on, lessons *assume* that's done: they link to
  `SETUP.md` rather than re-explaining it, and they do **not** re-gate the Concord check atop each
  lesson. A setup step reappears only as *troubleshooting*, tied to a symptom ("page blank? make
  sure Concord's still running") — never a standalone toll every lesson. Repeating setup reads as
  friction and mild condescension; establish it once, trust the reader. (Also closed a real hole:
  no file ever told the reader how the lesson files reach their computer — `SETUP.md`'s "Get the
  files" download-the-ZIP step now does.)

### 5.2 Visual checkpoints (no lesson page without a visual)

A scannable page reassures (§5.1); a *picture of the working result* reassures more — there is real
comfort in comparing your screen to the guide's and seeing the same thing. So **every lesson page
carries visual checkpoints**: a screenshot at each point the reader pauses, captioned like "your
screen should look about like this," with real descriptive alt text. The shots are of the *running
result*, not the code (they can already read the code in the file). For a code lesson that means
the page on load, the win, and each notable state — including the friendly error states, which calm
exactly when something looks wrong. Even browser-only Lesson 1 gets the reassuring ones: what
`/healthz` looks like, and that the raw-JSON "mess" is normal and expected.

The screenshots are generated against a **live Concord** (real Scripture — authenticity is the
point) by a committed Playwright tool in **`tools/screenshots/`**. Hard boundary, stated in that
folder's own README: this is **maintainer** tooling, **not part of the course** — learners never
touch Node, npm, or Playwright; the lessons stay genuinely dependency-free, and the tool is never
referenced from a lesson. `node_modules/` is gitignored; the repo root stays npm-free. **Staleness
rule:** when a lesson's page changes, its screenshots regenerate in the *same* slice, so the
pictures never drift from reality.

## 6. The two freebies (reciprocity, made concrete)

- **`recipes.md` — "steal these."** Labeled, paste-ready snippets, each with a one-line "what it
  does": the base-URL config line; a fetch-and-show helper; the friendly error handler (from
  Lesson 2); the parallel-translations render loop (Lesson 4); the honest-place renderer
  (status → display, Lesson 4); the zero-JS search `<form>` trick (Lesson 3 aside). Snippets
  match the lessons exactly so a reader can lift them without surprises.
- **`ideas.md` — "what could you build?"** A short, inviting list seeding real use cases: a
  verse-of-the-day screen for a church lobby, a sermon-prep translation-comparison sheet, a
  memory-verse quiz, a "places in this week's reading" map. Seeding use cases is a gift and
  plants the builder identity. Points back at songbird as proof the surface carries real apps.

## 7. Branding (parity with Concord) — LOCKED

Same treatment Concord got, built in the final slice (§8, T7). The asset is built in T7; the
**direction below is locked now.** Concord's banner is the reference (`docs/banner.svg`, 1280×320):
cream parchment, a warm-indigo serif "Concord", an italic slate-blue tagline, a small green leaf
ornament above the wordmark.

**Banner** — `docs/banner.svg`, 1280×320, an SVG sibling to Concord's: obvious family, one
deliberate contrast.

- **Shared with Concord's banner (instant family recognition):**
  - Canvas 1280×320; background cream **`#F5ECDB`**.
  - Wordmark **"Concord"** — serif (`'EB Garamond', 'Cormorant Garamond', Garamond, Georgia,
    serif`), indigo **`#2A4A6B`**, ~130px, weight 500, letter-spacing 3, centered.
  - Tagline — italic serif (`Georgia, serif`), slate-blue **`#4F6A85`**, ~22px, letter-spacing
    3, centered below the wordmark.
- **Locked tagline:** *"now build with it."* (Concord's is "Scripture, served locally."; the two
  read as a set. Wordmark + tagline together: "Concord — now build with it.")
- **The ornament is the differentiator.** Concord's is a small green leaf (**`#4A6B3C`**) above
  the wordmark — organic, calm, *grown*. The tutorial keeps that **position and scale** but swaps
  the motif to the build theme: a small **blueprint-line-art rendering of ancient lashed-timber
  scaffolding** — wooden poles bound with rope lashings (the authentic Biblical-era form), drawn
  as clean thin indigo (**`#2A4A6B`**) strokes, *not* a gritty/archaeological illustration. This
  marries both ideas (blueprint + scaffolding), keeps the warm/inviting feel, and line-art
  literally evokes "a plan you build from" — which is what a tutorial is.
- **Poetic flourish (confirm):** a tiny green leaf (Concord's exact **`#4A6B3C`**) resting on the
  scaffold's platform — the scaffolding *supporting the growing thing*, tying the tutorial
  (scaffold) to Concord (leaf/foundation). Keep subtle; drop if it crowds at banner scale.
- **Why the contrast is a feature:** Concord's banner is the calm, finished foundation
  (parchment + leaf); the tutorial's is the lively scaffold/blueprint where hands get dirty —
  same family, signalling *this is where you build*.

**Metaphor note (for the README's voice, too).** A tutorial *is* scaffolding: temporary
structure you stand on while you build something else, then it comes down and you keep the
building. It also extends Concord's own canonical image — Concord is the **foundation**, your app
is the **house** you live in, and this course is the **scaffolding** between them.

**Repo description** (locked draft — confirm wording): *"Build your first app on top of Concord —
a five-lesson course for the curious. No experience needed."*

**Topics/tags** (locked draft — confirm): `bible`, `api`, `tutorial`, `beginners`,
`learn-to-code`, `javascript`, `html`, `web`, `concord`.

## 8. Build plan — sliced for cc (PR-per-slice, smallest reviewable unit)

Same discipline as Concord: each slice its own branch + PR; Kris merges after review. Each
lesson is its own load-bearing unit. The two intentionally-combined slices are flagged.

| # | Slice | Delivers | Depends on | Review focus |
|---|---|---|---|---|
| **T0** | **Skeleton & the door** | Repo scaffold: top-level README (intro, audience cleave, **prereq box §3.4**, **how-to-run §3.1**, lesson map), LICENSE, `.gitignore`, `lessons/` structure stubbed, banner slot. The reciprocity+commitment entrance, before any lesson. | — | The prereq box + run instructions **cannot fail**; tone; structure |
| **T1** | **Lesson 1 (browser only)** | `lessons/01-is-it-on/README.md`. No code. | T0 | "You just made an API call" framing; address-bar examples are accurate; tone |
| **T2** | **Lesson 2 (verse)** | `lessons/02-show-me-a-verse/` (README + `verse.html`). First real file. | T1 + a running Concord | The fetch→JSON→display loop vs. the real `docs/API.md` shape; **friendly error handling**; base-URL line present; **end-to-end CORS verification gate (§8.1)** |
| **T3** | **Lesson 3 (search, side by side)** | `lessons/03-find-by-idea/` (README + `search.html`). | T2 | Query params; looping; the meaning-vs-keyword contrast lands |
| **T4** | **Lesson 4 (capstone core)** | `lessons/04-compare-and-where/` (README + `app.html`). | T3 | Composing calls; **the honesty model displayed truthfully**; fully offline |
| **T5** | **Lesson 5 (capstone stretch)** | `lessons/05-drop-the-pins/` (README + `app-map.html`). The stretch/graduation lesson — **not advertised "optional" on the front door** (§2.5, §3.4); skippability is conveyed at Lesson 4's closer. | T4 | The one new dependency (Leaflet/CDN); **the offline→online tradeoff flagged**; no-coord places not drawn |
| **T6** | **The two freebies** | `recipes.md` + `ideas.md`. | T5 | Snippets are paste-ready and match the lessons; ideas seed real use cases |
| **T7** | **Branding & graduation polish** | Banner committed, repo description, topics/tags, final README pass, the **"you're a Concord builder now → here's where builders go"** close (→ `docs/API.md`, `ideas.md`, invitation to share). Last slice, after lessons settle. | T6 | Tone; the induction close; **parity with Concord's branding** |
| **CI** | **Three-engine smoke (incl. WebKit)** | A GitHub Actions job that runs `tools/screenshots/smoke.mjs` — Playwright's CI setup installs Chromium + Firefox + **WebKit** (with system deps) on a stock runner — against a Concord container, closing the WebKit gap §8.1 flags. Not strictly sequential: can land anytime after T2. | T2 | Gate is genuinely three engines, automated; the maintainer tool stays walled off |

**Flagged combined slices.** *T6* bundles `recipes.md` + `ideas.md` — both small, both "the
freebies," one coherent reciprocity unit. *T7* bundles all branding + final polish, mirroring
Concord's Slice 9 ("docs & polish last, after things settle"). Every other slice is the
smallest load-bearing unit: one lesson each — including Lesson 1, which is just a README but is
the first banked win and deserves its own reviewable PR.

**Front-door refinement (post-T0).** T0 shipped the skeleton; slices **T0a–T0c** then refined the
front door as real readers tested it — splitting the run instructions into `SETUP.md`, cutting the
README down to its just-in-time job, and recording the §5.1 rules. So T0's row above describes the
*original* scaffold; the front door's current shape is **§3.4 + §4**. **T1a** moved the songbird
beat into Lesson 1's closer (§5.1).

**Lesson-2 refinement (post-T2) and the CORS fix.** T2 shipped `verse.html`, then spawned three
sub-slices as readers tested it: **T2a** reordered the lesson to *working-first* (§5.1); **T2b**
added `SETUP.md`'s "Get the files" step and the *setup-once* rule (§5.1); **T2c** added the
committed screenshot tooling and the per-lesson `images/` (§5.2). T2c also surfaced a real Concord
CORS cache-poisoning bug, **fixed at the root in Concord v1.0.2** (§3.2.1) — the course pins there.
**Lessons 3–5 (post-T2).** T3 shipped `search.html` (the empirical query swap above); **T4** the
offline capstone `app.html`; **T5** the map `app-map.html` (Leaflet 1.9.4, the offline→online
tradeoff). Each was built *working-first from the start*, gated on Chromium + Firefox against the
**pulled v1.0.2** image (§8.1), and carries committed screenshots (§5.2). The umbrella rule (§5.1)
landed in slice **T2e** alongside a Lesson-2 error-state fix (removing a "Stop Concord and try again"
step that asked the reader to break things). **T6** (the two freebies) and **T7** (the branding/polish
pass) then shipped; the **CI slice** (below) shipped last and now runs the smoke on every push and PR —
closing the WebKit gap for good. The build is complete.

### 8.1 Cross-cutting verification gate (folded into T2)

`file://` is already settled (out) by current-browser research, so we don't re-litigate it. But
before building Lessons 3–5 on the served-page path, **T2's review gate** confirms the *blessed*
path end-to-end: serve the lesson over `http://localhost` (Live Server and `python3 -m
http.server` are network-equivalent — same `:5500` static origin, same CORS conditions) against a
live Concord on **Chrome and Firefox**, and confirm a plain `GET` to `/healthz` and
`/v1/verses/{ref}` succeeds from the served page. (Safari/WebKit is out of the gate: it can't run
on the Linux build host, and a header-free GET is a standard CORS simple request WebKit honors
the same way.) Record the result in the PR; add a one-line note to `SETUP.md` only if a browser
needs a caveat the reader must know. If any browser surprises us, it's caught here — on one page —
not after five lessons assume it.

**Status (honest), now three engines verified.** Through the local build, every lesson's gate ran
green on **Chromium + Firefox** (18/18 at Lesson 5), with WebKit *tool-ready but unrun* — the build
host (Ubuntu 26.04) can't install WebKit's system libs. The **CI slice** (§8) closed that gap: a
GitHub-hosted runner installs WebKit cleanly, so `tools/screenshots/smoke.mjs` now runs all three
engines on every push and PR. On its first execution WebKit passed **18/18**, identical to the others —
no engine-specific issue surfaced. So the gate is genuinely **three engines verified (Chromium +
Firefox + WebKit), via CI** — no longer rounded up from two. Lesson 5 deliberately drops Lesson 4's
localhost-only assertion (its external tiles are the point) and asserts the map and pins render.

**Concord for the gate: pull, never build.** Gates run against the published image
(`docker pull ghcr.io/kbennett2000/concord:v1.0.2`), confirmed via `docker ps`. **Never rebuild
Concord from source on a dev box** — no `docker build`, no compose build, especially not
`--no-cache`: a Concord build re-bakes the embedding model and can pin the machine (it did once,
mid-T3). The published image exists precisely so no gate needs a local build.

## 9. Decisions (all resolved)

Every open question from the first draft is resolved and folded into the spec above:

- **Lesson text home** — per-folder `README.md`. ✅ (§4)
- **`ideas.md`** — its own file. ✅ (§4, §6)
- **Example translations** — lean **WEB** for readability; Lesson 4's comparison is
  **KJV / WEB / ASV** (old vs. modern is its own demo). ✅ (§2.4, §5)
- **Banner** — scaffolding/blueprint direction + tagline *"now build with it."*; palette, motif,
  and metaphor locked. ✅ (§7)
- **Repo description + topics** — confirmed as the §7 drafts. ✅
- **Concord version pin** — **v1.0.2** (the release carrying the §3.2.1 CORS fix), on the **`/v1`**
  contract. ✅ (§0, §3.2.1)
- **Start fork** — **(a) lock-then-build**, chosen; the build has run T0 → T2 (plus refinement
  sub-slices) this way, one PR per slice, Kris merging. ✅
- **WebKit/Safari verification** — the **CI slice** (§8) shipped and runs all three engines on every
  push and PR; WebKit passed 18/18 on first execution, so the gate is genuinely three-engine verified
  (§8.1). ✅

Nothing here is open; the build proceeds slice-by-slice per §8 — **T3 next**.

---

*The course wires to Concord's existing `/v1` surface and install/deploy docs and adds **no
mitigation hacks** — but it does not pretend Concord went untouched: building it surfaced a real
CORS cache-poisoning bug, **fixed at the root in Concord v1.0.2** (§3.2.1), which is why the course
pins there and which benefits every Concord consumer. The only remaining cross-repo change is
flipping Concord's README "tutorials coming" line to point at this one once it's far enough along —
a separate, later change to confirm.*