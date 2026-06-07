# Ideas — what could you build?

You just built a real app: it compares translations, tells the truth about where Scripture
happened, and puts it on a map. The hard part — wrangling the data — is already done for you by
Concord. What's left is the fun part: asking it questions and showing the answers, which is exactly
what you now know how to do.

Here are a few things you could build next. None of them is harder than what you've already
finished — they just point the same moves at a new purpose. Each one notes the Concord endpoint(s)
it leans on, so you can see the path from here to there.

## A verse-of-the-day screen

A full-screen page for a church lobby or a kitchen tablet that shows one verse, big and calm. Pick a
verse per day, or let Concord surprise you.
*Leans on:* `GET /v1/verses/{ref}` for a chosen verse, or `GET /v1/random` for a rotating one.

## A sermon-prep translation sheet

Type a passage and see it across several translations at once — print it, or keep it open while you
study. This is Lesson 4's compare half, aimed at your own desk.
*Leans on:* `GET /v1/verses/{ref}?translations=KJV,WEB,ASV,…`.

## A memory-verse quiz

Show the reference and let someone recall the verse, then reveal it — or blank out a few words and
have them fill the gaps. A gentle, encouraging study tool.
*Leans on:* `GET /v1/verses/{ref}`.

## A "places in this week's reading" map

Give it the passages from this week's reading plan and drop every place they name onto one map — with
the honest list of the ones whose location is lost. Lesson 5, pointed at a reading plan.
*Leans on:* `GET /v1/verses/{ref}/places` + Leaflet.

## A search-by-theme tool

A single box that finds passages by *idea* — "comfort in grief," "welcoming the stranger" — even when
they don't use those words. Lesson 3's meaning search, on its own.
*Leans on:* `GET /v1/semantic-search?q=…`.

## A daily random verse

The simplest possible app, and a lovely one: one button, one fresh verse. A nice first thing to build
entirely on your own.
*Leans on:* `GET /v1/random`.

---

If you're wondering whether the surface really carries real apps: it does. **songbird** — a private,
self-hosted Bible study companion — runs on these very endpoints. See it at
[kbennett2000/songbird](https://github.com/kbennett2000/songbird).

Build one of these, or something we'd never think of. Then tell us what you made — that's the best
part of all of this.
