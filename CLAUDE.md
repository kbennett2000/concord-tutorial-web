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
doesn't run is not done. At **T2**, verify the served-page path on Chrome, Firefox, and Safari
against a live Concord (SPEC §8.1) before later lessons lean on it.

## Taste & restraint

Smallest reviewable, load-bearing unit per slice. Reuse patterns across lessons rather than
inventing new ones. Resist adding a dependency, a config option, or cleverness the lesson doesn't
need — restraint is the house style, in the code *and* the prose.
