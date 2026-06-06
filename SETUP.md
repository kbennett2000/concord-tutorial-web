# Setup — get the files and run them

This is the one-time setup: getting the lesson files onto your computer, and starting a local
preview to run them. You'll need it from Lesson 2 onward — Lesson 1 needs nothing but your
browser.

## Get the files

Right now you're looking at this course on GitHub, in your web browser. First, get your own copy
onto your computer:

1. On this repo's page on GitHub, click the green "Code" button, then "Download ZIP."
2. Unzip it — on most computers, just double-click the downloaded file. You'll get a folder named
   `concord-tutorial-web`.

That unzipped `concord-tutorial-web` folder holds everything — every lesson and its files. When a
lesson says "this folder" or "open the lesson's folder," it means one of the lesson folders inside
it, like `lessons/02-show-me-a-verse/`.

Already use git? `git clone https://github.com/kbennett2000/concord-tutorial-web` works too.

## How to run a lesson

From Lesson 2 onward, each lesson is a real file you open in a web browser. There's one way to
open it that works, and the friendly setup below gets you there in a few minutes — you only do
it once, and then it's the same every lesson. Here's the easy path.

### The easy way: VS Code + Live Server

[VS Code](https://code.visualstudio.com/) is a free code editor from Microsoft — a program for
opening and editing the lesson files. If you don't have it yet, download and install it from
that link; it's free and takes a couple of minutes.

Inside VS Code you'll add one *extension* — a small add-on you install with a single click. The
one we want is **Live Server**: it shows your lesson page in the browser at `http://localhost`
and quietly refreshes it every time you save, so your changes appear instantly.

Once VS Code is installed:

1. Open the lesson's folder in VS Code.
2. Install the Live Server extension once: open the Extensions panel, search for "Live Server,"
   and click "Install."
3. Click "Go Live" in the bar at the bottom of the window.

Your lesson page opens at `http://localhost:5500`. That's it — you're running.

### Already comfortable with a terminal? Use Python instead

If you'd rather not install VS Code and you've used a *terminal* before — the text window where
you type commands to your computer directly — you can serve a lesson with Python instead. *Python*
is a programming language; we use it here only to run a tiny local web server, nothing more.

Open a terminal inside the lesson's folder and check whether Python is already there:

```
python3 --version
```

If you see a version number, you're set. If not, install it from
[python.org/downloads](https://www.python.org/downloads/).

Then run this command to serve the lesson:

```
python3 -m http.server 5500
```

and visit `http://localhost:5500` in your browser.

**Opening the file by double-clicking it does not work.** When you double-click an `.html` file,
your browser loads it from a `file://` address, and browsers refuse to let a `file://` page talk
to Concord — so the page sits there blank or broken. This isn't a maybe. Always serve the lesson
over `http://localhost` using one of the two methods above.

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

If Concord runs on the same computer as you, leave that line exactly as it is.

If Concord runs on another computer on your network, change only that one line to that machine's
address (for example `http://192.168.1.62:8000`). Concord's
[Deployment docs](https://github.com/kbennett2000/concord#deployment) show how to find it.
