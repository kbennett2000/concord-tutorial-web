![Concord — now build with it.](docs/banner.svg)

# concord-tutorial-web

Welcome. You're about to build a real web app — one that compares Bible translations side by
side and shows *where* Scripture happened — and run it on your own computer. Five short
lessons, one new idea each, and by the end you'll have something you can open in front of a
friend or your pastor and say *"I built this."*

You don't need any experience. If you've never written a line of code and you're not quite
sure what an "API" is yet, you're exactly who this course is for. We'll explain each new word
the first time it shows up, in plain language, and you'll have working code in front of you
the whole way — never a fill-in-the-blanks puzzle. The app you build is the vehicle;
**you** becoming a builder is the point.

This course runs on [**Concord**](https://github.com/kbennett2000/concord), a small program
that serves Bible verses from a computer you control. Concord does the hard part — the data —
so you can focus on the fun part: asking it questions and showing the answers. And this isn't
hypothetical: **songbird** is a real app already running on the exact endpoints you're about to
use. The surface holds real apps. Yours is next.

> **Already a developer?** You're welcome to skim — but this is a "your first app" course
> written for beginners, deliberately not dense. For a fast, complete reference, go straight to
> Concord's [`docs/API.md`](https://github.com/kbennett2000/concord/blob/main/docs/API.md).

## Before you start

This course assumes Concord is **already running** on your computer. Here's the 30-second
check that you're ready.

**Is Concord on?** Open this address in your web browser:

```
http://localhost:8000/healthz
```

If a little blob of text comes back with some counts in it (how many translations, how many
verses), you're ready — Concord is awake and answering. That's all you need to start Lesson 1.

**If nothing comes back**, Concord isn't running yet. Setting it up is a one-time step that
lives in Concord's own docs — we won't repeat it here:

- Concord [**Quick start**](https://github.com/kbennett2000/concord#quick-start) — get it
  running.
- Concord [**Deployment**](https://github.com/kbennett2000/concord#deployment) — running it on
  another computer on your network.

**What you'll need:**

- A running Concord (the check above).
- A web browser. *(That's everything Lesson 1 needs.)*
- For Lessons 2 and up: either **VS Code with the Live Server extension**, or **Python** —
  whichever you have. (How to use them is in the next section.)

No accounts. No sign-ups. No `npm`, no installs beyond the above. Nothing reaches the
internet until the optional final lesson, and we'll flag it clearly when it does.

## How to run a lesson

From Lesson 2 onward, each lesson is a real file you open in a web browser. There's **one way
to open it** that works, and we want you to learn it once, here:

> **Serve the lesson over `http://localhost`.** Pick whichever of these you have:
>
> 1. **VS Code + Live Server (the easy default).** Open the lesson's folder in VS Code,
>    install the **Live Server** extension once, then click **"Go Live"** at the bottom of the
>    window. Your page opens at `http://localhost:5500` and refreshes itself every time you
>    save — editing becomes fun.
> 2. **Python (no VS Code needed).** Open a terminal *inside the lesson's folder* and run:
>    ```
>    python3 -m http.server 5500
>    ```
>    Then visit `http://localhost:5500` in your browser. Most computers already have Python.

**Opening the file by double-clicking it does not work.** When you double-click an `.html`
file, your browser loads it from a `file://` address, and browsers refuse to let a `file://`
page talk to Concord — so the page will sit there blank or broken. This isn't a maybe. Always
serve the lesson over `http://localhost` using one of the two methods above.

*(The one exception is Lesson 1, which you do entirely in your browser's address bar — no file
to open at all.)*

### The one setting each lesson carries

Every lesson file has a single line near the top of its code that tells it where to find
Concord:

```js
const CONCORD = "http://localhost:8000"; // ← change this only if Concord runs on another computer
```

Notice there are **two different addresses** in play, on purpose:

- `http://localhost:5500` — where *your page* lives (the one Live Server or Python serves).
- `http://localhost:8000` — where *Concord* lives (the one your page talks to).

If Concord runs on the **same** computer as you, leave that line exactly as it is. If Concord
runs on **another** computer on your network, change only that one line to that machine's
address (for example `http://192.168.1.62:8000`) — Concord's
[Deployment docs](https://github.com/kbennett2000/concord#deployment) show how to find it.

## The five lessons

One new idea per lesson. Every lesson ends with something that visibly works.

| # | Lesson | You can now… |
|---|---|---|
| 1 | **Is it on, and what does it say?** *(browser only — no files)* | …read raw Concord data right in your browser. |
| 2 | **Show me a verse** | …turn what a user types into a live verse on your page. |
| 3 | **Find verses by idea** | …search Scripture by meaning **and** by word — and know the difference. |
| 4 | **Compare, and where did it happen?** *(the capstone)* | …build a real, multi-feature app that runs fully offline. |
| 5 | **Drop the pins** *(optional — stretch)* | …put your data on a map, and understand the tradeoff you made to do it. |

Lessons 1–4 are the heart of the course and stay completely offline. **Lesson 5 is optional**
— it's the graduation step where you add a map and, with it, the first dependency on the
internet. We'll explain exactly what that tradeoff is when you get there, and you can stop
after Lesson 4 with a finished app you're proud of.

Start with [**Lesson 1**](lessons/01-is-it-on/) — it takes about two minutes, with nothing
installed.

## License

MIT © 2026 Kris Bennett — see [`LICENSE`](LICENSE). (Parity with Concord.)
