# concord-tutorial-web — Build Spec

> Status: in build. The repo exists; the front door (README, SETUP.md, CLAUDE.md) and Lesson 1
> have shipped; **T2 is next**. This document is the blueprint cc builds against, one slice per
> PR (§8); it lives at `docs/SPEC.md` in the repo. Same spec-first, PR-per-slice discipline as
> Concord; Kris merges after review.
>
> **Synced through the T0/T1 front-door slices** (T0a–T0c, T1a): the run instructions now live in
> `SETUP.md` (§3.1, §4), and four governing rules earned during those rounds are recorded in §5.1
> (operative verbatim in CLAUDE.md).

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
and `v1.0.0`. Proof it's worth their time: **songbird** is a real app already running on these
exact endpoints — we point at it as evidence, not a hypothetical.

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
  shows results in two columns. Type `do not be anxious`: keyword search misses passages that
  never use those words; meaning search surfaces them. Then a query where the gap is stark.
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
- **Acceptance:** both panes populate; the anxiety example visibly demonstrates meaning-search
  catching what keyword-search misses.

### 2.4 Lesson 4 — Capstone (core): Compare, and where did it happen? *(`app.html`)*

- **Callback:** "You can read a verse, and you can search. Let's put real features together
  into one app you'd actually show someone."
- **What the learner does:** enter a reference; the app shows (a) the passage in **three
  translations side by side** and (b) the **places** that passage names, each shown honestly.
- **The file composes two calls:**
  - `GET /v1/verses/{ref}?translations=KJV,WEB,ASV` → three columns. (Old vs. modern English is
    itself interesting and makes parallel translations concrete.)
  - `GET /v1/verses/{ref}/places` → the places named, each rendered by its **status**:
    `identified` shows coordinates as plain text ("Athens — 37.98°N, 23.72°E"); `disputed`
    shows a best-guess coordinate flagged as contested; `unknown` shows *"location unknown"*
    with **no fabricated coordinates**. Use Acts 17 as the worked example (Athens, Berea,
    Thessalonica…).
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
- **What the learner does:** add **Leaflet** (via CDN `<link>` + `<script>`), drop pins for the
  `identified` places, flag `disputed` ones, and — crucially — **do not draw** the places with
  no coordinates; list them beside the map as "not shown — location unknown." The honesty model
  becomes *visible*: you literally cannot draw what isn't known.
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
headers.** That keeps it a CORS "simple request," so Concord's existing
`Access-Control-Allow-Origin: *` is honored with **no preflight** — and Concord needs **no
change**. Do not add `Content-Type`, `Authorization`, or other headers to these GETs.

### 3.2 Why "Chrome blocks localhost" doesn't apply to us (worth one sentence in the README)

Chrome's Local Network Access / Private Network Access (Chrome 142+) gates a **public** website
reaching into a more-private network (localhost or a LAN IP). Our page and Concord live in the
**same** address band — both on `localhost` (the happy path), or both on the same LAN (the
cross-machine footnote) — so the gate never fires. The only blocked scenario, a public site
talking to a LAN Concord, is exactly what Concord's `SECURITY.md` says not to do; it stays out
of scope, and Concord requires no CORS change for anything this course does.

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
│   │   └── README.md             # browser-only lesson, no code file (no SETUP link — nothing to set up)
│   ├── 02-show-me-a-verse/       # 02–05 each open with a one-line "do SETUP.md first" pointer
│   │   ├── README.md
│   │   └── verse.html
│   ├── 03-find-by-idea/
│   │   ├── README.md
│   │   └── search.html
│   ├── 04-compare-and-where/
│   │   ├── README.md
│   │   └── app.html
│   └── 05-drop-the-pins/         # the stretch/graduation lesson (not advertised "optional" on the front door)
│       ├── README.md
│       └── app-map.html
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

These four emerged from iterating the front door and now govern *every* page and lesson. They
share one root cause — writing for a developer by default, and explaining/reassuring before it's
due — so they're stated together. CLAUDE.md carries the operative wording cc reads each session;
the reasoning lives here.

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

**Flagged combined slices.** *T6* bundles `recipes.md` + `ideas.md` — both small, both "the
freebies," one coherent reciprocity unit. *T7* bundles all branding + final polish, mirroring
Concord's Slice 9 ("docs & polish last, after things settle"). Every other slice is the
smallest load-bearing unit: one lesson each — including Lesson 1, which is just a README but is
the first banked win and deserves its own reviewable PR.

**Front-door refinement (post-T0).** T0 shipped the skeleton; slices **T0a–T0c** then refined the
front door as real readers tested it — splitting the run instructions into `SETUP.md`, cutting the
README down to its just-in-time job, and recording the §5.1 rules. So T0's row above describes the
*original* scaffold; the front door's current shape is **§3.4 + §4**. **T1a** likewise moved the
songbird beat into Lesson 1's closer (§5.1). The remaining rows (T2–T7) are unchanged.

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

## 9. Decisions & the one remaining fork

The first draft's open questions are now resolved and folded into the spec above:

- **Lesson text home** — per-folder `README.md`. ✅ (§4)
- **`ideas.md`** — its own file. ✅ (§4, §6)
- **Example translations** — lean **WEB** for readability; Lesson 4's comparison is
  **KJV / WEB / ASV** (old vs. modern is its own demo). ✅ (§2.4, §5)
- **Banner** — scaffolding/blueprint direction + tagline *"now build with it."*; palette, motif,
  and metaphor locked. ✅ (§7)
- **Repo description + topics** — locked drafts in §7 (confirm exact wording).
- **Concord version pin** — pin examples to the **`/v1`** contract and **v1.0.0** unless a newer
  surface should be targeted.

**The one remaining fork — how cc starts:**

- **(a) Lock-then-build (the lean):** this spec is the complete handoff; cc runs T0 → T7 against
  it, one PR per slice, Kris merging.
- **(b) Draft-first:** cc builds **T0 + Lesson 1** as a tone/shape proof, we react, then cc runs
  the rest.

Either way the build is sliced and merged exactly as Concord was.

---

*This spec keeps Concord untouched: the course wires to its existing `/v1` surface and existing
install/deploy docs, and requires no Concord code or CORS change (§3). Any new documentation
lives in this repo; nothing here edits the main Concord repo except, eventually, flipping the
README's "tutorials coming" line to point at this one — a separate, later change to confirm.*