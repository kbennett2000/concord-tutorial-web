# CLAUDE.md

Always-on rules for `concord-tutorial-web`. Tight by design — read every session.

**Source of truth for design is `docs/SPEC.md`. Read it before starting any slice.**
This file is the rules summary; the spec carries the full reasoning, the per-lesson contracts,
and the build plan. Work proceeds one slice at a time per **SPEC §8** — smallest reviewable
unit, one PR per slice.

## What this is

A **beginner-first, five-lesson course** that teaches someone who has never written code to
build a real web app on top of a **running Concord**. The learner is the audience; Concord is
the vehicle — this repo serves the learner, not the API. It assumes Concord is already running
and points to Concord's existing install/deploy docs if it isn't. It pins to Concord's **`/v1`**
surface and **v1.0.0**, and **never edits the main Concord repo**.

The first of the promised `concord-tutorial-*` series. Proof the surface carries real apps:
**songbird** already runs on these endpoints.

## Audience & voice (load-bearing — this is a teaching repo)

- **Primary reader:** non-technical but curious. Never written code. Found Concord, unsure what
  an API is. Every line is for them.
- **Not the target:** seasoned developers — welcome to skim, but they have Concord's
  `docs/API.md` for fast reference. **Do not** serve two densities in one voice.
- Second person, warm, **builder framing from line one** — "the app you're about to build,"
  "your endpoint," "when your users…" — never "if you manage to."
- **Plain language first, then the real term** ("you just made an API *request*"). Define each
  piece of jargon once, on first use.
- **Short sections, lots of working code, no walls of text.** If a lesson sprawls, it's two
  lessons or it's carrying scope it shouldn't.
- Match Concord's documentation voice (warm, precise, honest about limits) so the two repos feel
  like one family.

**Formatting — break the wall (a scannable page is itself reassurance).** For this
reader, a page that *looks* easy signals "you can do this"; a dense block signals
"this is hard." In every README and lesson:
- Keep paragraphs to 2–4 sentences, with real whitespace between them.
- Use frequent, plain subheadings so the page scans at a glance.
- Anything sequential is a numbered list (how-to-run is steps, not a paragraph).
- Anything you'd type — a URL, a command — goes in a code block, even one line.
- Set off the prereq check and the how-to-run path as visual callouts (a blockquote
  or a clearly-bounded block), not buried in prose.
- **Bold** at most one key phrase per section — the thing that must not be missed.
- Keep the connective tissue warm and human: short prose between the structure, never
  an all-bullets checklist and never a gray wall. The goal is "warm, broken into
  scannable pieces."

**No unexplained jargon — especially the tooling.** The reader has never coded: a word
that's obvious to a developer is a wall to them. The lesson's *topic* (API, endpoint,
JSON, fetch…) gets taught as it's introduced — but the **incidental tooling** the reader
is told to touch is the easy thing to forget, and just as alien. The first time you name
any of it, add a one-line plain gloss and a link where one exists — the editor (**VS Code**:
what it is + link), an **extension** (what installing one means), the **terminal**, a
**command**, a programming **language** (e.g. Python — and why it's even mentioned). Two
hard rules:
- **Never name a scary unknown just to reassure.** Saying "no npm" to calm someone who's
  never heard of npm introduces a new fear instead of removing one. Reassure only in words
  the reader already knows.
- **Never make the reader inventory their own machine.** Instead of "use whichever you have,"
  recommend one friendly default and let an "already comfortable with X?" line self-select
  any alternative — so a beginner is never asked to figure out what's installed.

**Just-in-time, not just-in-case — don't explain anything until the reader needs it to
take the next step.** Everything true is not everything useful. If a sentence isn't
helping the reader do the thing in front of them *right now*, it's costing them
attention and confidence. Default to cut, defer, or link — never pre-load.
- **Setup, caveats, and concepts appear in the lesson that needs them**, not earlier.
- **The roadmap is a destination, not a syllabus.** Don't open with a map of all lessons;
  if a "what's ahead" list earns a place, it goes at the *end* as encouragement.
- **Never answer a question the reader hasn't asked** — especially not a reassurance.
  Naming a fear to soothe it ("don't worry, Lesson 5 isn't too hard"; "no npm needed")
  plants the fear. If a real heads-up is needed, it belongs in the lesson where it
  becomes actionable, in words the reader already knows.
- **Motivation is timed, not cut.** "Just-in-time" defers *instructions and caveats*; it does
  not delete encouragement. Proof-it's-real and you-could-build-this beats (Unity) land
  hardest right *after* a win, not on the cold entry page — place them at a lesson's closer,
  where the reader has just felt success, never as front-door preamble.
This supersedes any pull toward completeness on entry pages: the front door's job is to
get hands-on fast, not to brief.

**Working first, explanation second — the win before the why.** A beginner needs to see it
run before they care how it runs. Never gate the hands-on behind a wall of explanation. A code
lesson opens by getting the reader to a *running, working result* as fast as possible — start
the preview, open the page, see it work — and only *then* explains how it works, for the reader
who's now curious. Reverse the teach-then-do instinct. Structure for code lessons: callback →
what we're building (a sentence or two) → **get it running and watch it work (the win)** → how
it works, piece by piece (the reward, not the gate) → the two closers. The reader should be
looking at a working page on their own screen inside the first minute.

**Setup happens once; lessons assume it's done.** The reader sets up a single time — getting
the files and starting a local preview (SETUP.md), and confirming Concord is on (the README's
front-door check, before Lesson 1). From Lesson 2 on, lessons *assume* that setup is done: they
link to SETUP.md instead of re-explaining it, and they do NOT re-gate the Concord check at the
top of each lesson. A setup step reappears in a lesson only as *troubleshooting*, tied to a
symptom ("page blank? make sure Concord's still running") — never as a standalone toll every
lesson. Repeating setup reads as friction and mild condescension; establish it once, trust the
reader, and surface it again only when something breaks.

## The three principles (they drive decisions — see SPEC §1)

- **Commitment & Consistency:** every lesson is numbered and completable; **no lesson ever ends
  on broken**; each opens with a callback to the prior win and closes with a "you can now ___."
- **Reciprocity:** ship a **complete, runs-as-is file** every lesson (never fill-in-the-blank);
  give `recipes.md` ("steal these") and `ideas.md` ("what could you build?").
- **Unity / Identity:** talk to the reader as a builder; the capstone must be genuinely
  demoable; the repo closes by inducting them ("you're a Concord builder now").

## Hard constraints

- **No build step, no npm, no dependencies through Lesson 4.** Lesson 5 (optional) adds exactly
  one — Leaflet via CDN — and **flags the offline→online tradeoff** (map tiles come from the
  internet; it won't work on an air-gapped box).
- **Every fetch is a plain, header-free `GET`** (`fetch(url)`), so it stays a CORS "simple
  request" and Concord's `Access-Control-Allow-Origin: *` is honored with no preflight. Do not
  add custom headers. **Concord needs no change** for anything this course does.
- **One blessed way to run a lesson: serve it over `http://localhost`** (VS Code Live Server, or
  `python3 -m http.server`). **Opening a file via `file://` does NOT work** — browsers treat
  local files as opaque origins, so `fetch` fails. State this plainly; no "might work" hedge.
- Each lesson file carries the **base-URL one-liner** at the top of its script, clearly commented
  ("change this only if Concord runs on another computer"). Repeat it per file; no shared
  `config.js`.
- **Build display logic against the real response shapes documented in Concord's `docs/API.md` —
  never invent field names.**
- Lesson text lives in each lesson's **own folder `README.md`**; the lesson's file(s) sit beside
  it. Self-contained per lesson. Structure in SPEC §4.

## Git workflow

Each slice gets its own branch off `main`:

```
git checkout main && git pull
git checkout -b slice/T0-skeleton   # T0, T1, … per SPEC §8
```

All work on that branch — **never commit directly to `main`, never push to `main`.** Conventional,
scoped commits (`docs:`, `feat:`, `chore:`). When a slice is complete and verified, open a PR with
`gh pr create`; the PR title is the slice name, the body summarizes what landed and links SPEC §8.
**PRs are merged by Kris after review — do not self-merge.**

If `git push` or `gh pr create` fails (auth, conflict, network), surface the full error
immediately. No `--force`, no resetting branches, no rebasing shared history. Never commit secrets
or anything matching `.gitignore`.

## "Done" means it actually runs

There is no automated test suite here — the proof is that the lesson **works**. Before declaring a
slice done: serve the lesson via the blessed path, open it, and confirm the feature works end to
end (a real verse appears; both search panes populate; places render honestly; the map draws the
located places and lists the unknown ones). Honor the **no-broken-ending** rule — a lesson that
doesn't run is not done. At **T2**, verify the served-page path on Chrome and Firefox against a
live Concord (SPEC §8.1) before later lessons lean on it.

## Taste & restraint

Smallest reviewable, load-bearing unit per slice. Reuse patterns across lessons rather than
inventing new ones. Resist adding a dependency, a config option, or cleverness the lesson doesn't
need — restraint is the house style, in the code *and* the prose.
