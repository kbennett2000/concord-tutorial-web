# Lesson 1 — Is it on, and what does it say?

Welcome to your first lesson. In the next two minutes you'll make your first API call — with
nothing installed and not a single line of code.

Everything here happens right in your browser's address bar. No files, no setup. Let's go.

## You may have already done this

Remember the check from the [course README](../../README.md), where you opened this address to
make sure Concord was awake?

```
http://localhost:8000/healthz
```

That blob of text that came back — the one with counts in it — wasn't a web page. It was
*data*, sent straight to you by Concord. Which means: **you just made your first API call.**

If you skipped that check, open the address now and watch the counts come back. That's Concord
telling you it's on, in its own language.

## Now ask it for a verse

Concord doesn't just report on itself — it serves Scripture. Let's ask for a verse.

1. Click your browser's address bar.
2. Type this in, exactly as written — spaces and all:

   ```
   http://localhost:8000/v1/verses/John 3:16
   ```

3. Press Enter.

John 3:16 comes back. Not on a styled page — as data, the same way the counts did.

**About that space:** it's fine to type the space between `John` and `3:16`. Your browser tidies
it up for you, so don't be surprised if the address bar turns it into `John%203:16` — that's the
browser's way of writing a space, and it means everything is working.

### Try a few more

Change the reference and watch a new verse come back each time:

```
http://localhost:8000/v1/verses/Genesis 1:1
```

```
http://localhost:8000/v1/verses/Psalm 23:1
```

Any book, any chapter and verse. You're driving now.

## So what just happened?

You visited a web address and got back *data* instead of a page. That kind of address has a
name: an **endpoint**.

The data itself is written in a format called *JSON* — the common language apps use to pass
information around. You don't need to master it today; just know that's what you're looking at.

And here's the quiet truth: you've been using APIs your whole life. Every app on your phone is
doing exactly what you just did — asking an endpoint for data behind the scenes. Today you did
it yourself, out in the open.

## A note on the mess

That verse probably looked cluttered — curly braces, quotation marks, labels crowding the text.
That's completely normal, and nothing is wrong.

Firefox tidies JSON into a neat, foldable view; other browsers show it raw. **Both are fine** —
you don't need to install anything to read it. In the very next lesson, we'll take this same
data and put it on a clean page of your own, where the mess disappears.

---

### What you just learned about APIs

- An **endpoint** is a web address that gives back data instead of a page.
- That data is **JSON** — apps read it and reshape it into what you see on screen.

### You can now…

…read raw Concord data right in your browser.

And here's the quiet proof it's worth it: a real app called
[songbird](https://github.com/kbennett2000/songbird) already runs on the very endpoints you just
hit by hand. The calls you made today are the same ones a finished app makes — and you're on your
way to building one too.

Next up, [Lesson 2](../02-show-me-a-verse/): we take a verse and put it on a page of your own.
