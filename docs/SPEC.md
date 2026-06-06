# concord-tutorial-web — Build Spec

> Status: design, pre-build. This document is the blueprint cc builds against, one slice
> per PR (§8). It is written to become `docs/SPEC.md` in the new `concord-tutorial-web`
> repo. Same spec-first, PR-per-slice discipline as Concord; Kris merges after review.

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
  - The prereq box (§3) removes the step-one trap *before* they've invested anything.

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

### 2.5 Lesson 5 — Capstone (stretch, optional): Drop the pins *(`app-map.html`)*

Flagged **optional** and framed as **graduation**.

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
  the online-tiles tradeoff is stated; the lesson is clearly marked skippable.

## 3. How a learner runs the lessons — the bulletproof step one

The one step that must not fail. Verified against current browser behavior (2026), not
assumed.

### 3.1 The single blessed path: serve over `http://localhost`

Opening a lesson file by **double-clicking it (`file://`) does not work** — modern browsers
treat local files as opaque origins, so `fetch()` fails before reaching Concord (MDN's own
guidance is to run a local server). So there is exactly one recommended path, stated with no
hedging:

1. **VS Code + Live Server (the warm default).** Open the lesson folder in VS Code, install the
   Live Server extension once, click **"Go Live."** The page opens at `http://localhost:5500`
   and auto-reloads on save (editing becomes fun — a small delight worth naming).
2. **`python3 -m http.server 5500` (no-VS-Code fallback).** Run it from inside the lesson
   folder, then visit `http://localhost:5500`. Most machines already have Python.

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

### 3.4 The prereq box (the repo README door — reciprocity + commitment, right at the entrance)

Before any lesson, the top-level README carries a short "before you start" box that makes step
one un-failable:

- **A 30-second "is Concord on?" check:** visit `http://localhost:8000/healthz` — counts come
  back ⇒ you're ready.
- **If it isn't running:** point to Concord's existing **Quick start** and **Deployment** docs.
  We do **not** re-explain install here.
- **What you need:** a running Concord, a web browser, and either VS Code+Live Server or Python
  for lessons 2+. Nothing else, no accounts, no npm.

## 4. Repo structure

```
concord-tutorial-web/
├── README.md                     # course intro · audience cleave · prereq box · how-to-run · lesson map
├── LICENSE                       # MIT © 2026 Kris Bennett (parity with Concord)
├── .gitignore
├── docs/
│   └── banner.svg                # committed banner (§7), mirrors Concord's docs/banner.svg
├── lessons/
│   ├── 01-is-it-on/
│   │   └── README.md             # browser-only lesson, no code file
│   ├── 02-show-me-a-verse/
│   │   ├── README.md
│   │   └── verse.html
│   ├── 03-find-by-idea/
│   │   ├── README.md
│   │   └── search.html
│   ├── 04-compare-and-where/
│   │   ├── README.md
│   │   └── app.html
│   └── 05-drop-the-pins/         # optional / stretch
│       ├── README.md
│       └── app-map.html
├── recipes.md                    # "steal these" snippets (§6)
└── ideas.md                      # "what could you build?" (§6)
```

- **Lesson text lives in each folder's `README.md`**; the lesson's file(s) sit beside it. Clone
  once, `cd` into a lesson, read the README, open the file. (Confirm in §9.)
- **Top-level `README.md`** is the course front door: intro, the light audience-cleave, the
  prereq box (§3.4), the single how-to-run path (§3.1), and the lesson map. It is *not* API
  documentation.

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
| **T5** | **Lesson 5 (capstone stretch, optional)** | `lessons/05-drop-the-pins/` (README + `app-map.html`). Marked optional. | T4 | The one new dependency (Leaflet/CDN); **the offline→online tradeoff flagged**; no-coord places not drawn |
| **T6** | **The two freebies** | `recipes.md` + `ideas.md`. | T5 | Snippets are paste-ready and match the lessons; ideas seed real use cases |
| **T7** | **Branding & graduation polish** | Banner committed, repo description, topics/tags, final README pass, the **"you're a Concord builder now → here's where builders go"** close (→ `docs/API.md`, `ideas.md`, invitation to share). Last slice, after lessons settle. | T6 | Tone; the induction close; **parity with Concord's branding** |

**Flagged combined slices.** *T6* bundles `recipes.md` + `ideas.md` — both small, both "the
freebies," one coherent reciprocity unit. *T7* bundles all branding + final polish, mirroring
Concord's Slice 9 ("docs & polish last, after things settle"). Every other slice is the
smallest load-bearing unit: one lesson each — including Lesson 1, which is just a README but is
the first banked win and deserves its own reviewable PR.

### 8.1 Cross-cutting verification gate (folded into T2)

`file://` is already settled (out) by current-browser research, so we don't re-litigate it. But
before building Lessons 3–5 on the served-page path, **T2's review gate** confirms the *blessed*
path end-to-end: run **Live Server** *and* **`python3 -m http.server`** against a live Concord
on **Chrome, Firefox, and Safari**, and confirm a plain `GET` to `/healthz` and
`/v1/verses/{ref}` succeeds from the served page. Record the result in the README's
troubleshooting note. If any browser surprises us, it's caught here — on one page — not after
five lessons assume it.

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
