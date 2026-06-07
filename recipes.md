# Recipes — steal these

These are yours to keep. Every snippet below is lifted straight from the lessons you just built,
so you can paste it into your own page and it'll behave exactly like it did here.

A note before you start: all of these assume the **base-URL line** (recipe 1) sits at the top of
your `<script>`. Recipes 2 and 3 are made to work together; recipe 5 uses the little `coords`
helper that's included with it.

## 1. The base-URL line

*What it does: tells your code where Concord is. The one line you'd change to point at Concord on
another computer.*

```js
const CONCORD = "http://localhost:8000"; // change this only if Concord runs on another computer
```

If Concord runs on another machine on your network, change just this line to that machine's address,
e.g. `const CONCORD = "http://192.168.1.62:8000";`. Every other recipe assumes this line is present.

## 2. Fetch and show a verse

*What it does: asks Concord for a reference and puts the verse(s) on the page.*

```js
// Put the verses on the page. `verses` is the list Concord sent back.
function render(verses) {
  result.innerHTML = "";
  for (const v of verses) {
    const box = document.createElement("div");
    box.className = "verse";

    const ref = document.createElement("div");
    ref.className = "ref";
    ref.textContent = v.reference;   // Concord hands us a ready-made label, e.g. "John 3:16"

    const body = document.createElement("div");
    // v.text is keyed by translation; with the default there's just one. Show whatever came back.
    body.textContent = Object.values(v.text).join(" ");

    box.appendChild(ref);
    box.appendChild(body);
    result.appendChild(box);
  }
}

async function showVerse() {
  const ref = input.value.trim();
  if (!ref) return;

  // encodeURIComponent turns the space into %20 for us.
  const url = `${CONCORD}/v1/verses/${encodeURIComponent(ref)}`;

  let response;
  try {
    response = await fetch(url);            // plain, header-free — a CORS "simple request"
  } catch (e) {
    showMessage("Couldn't reach Concord — is it running?",
                "Check " + CONCORD + "/healthz in your browser.");
    return;
  }

  const data = await response.json();       // Concord answers in JSON, success or error
  if (!response.ok) {
    const said = data.error && data.error.message ? "Concord said: " + data.error.message : "";
    showMessage("Hmm — couldn't find that. Try something like John 3:16.", said);
    return;
  }

  render(data.verses);                      // the happy path
}
```

This expects an `<input id="ref">`, a result `<div id="result">`, and the `showMessage` helper from
recipe 3. It pairs with a button: `document.getElementById("go").addEventListener("click", showVerse);`

## 3. The friendly error handler

*What it does: always says something human instead of a blank page or a raw error.*

```js
// Always say something human — never leave a blank page or dump a raw error.
function showMessage(text, hint) {
  result.innerHTML = "";
  const box = document.createElement("div");
  box.className = "message";
  box.textContent = text;
  if (hint) {
    const small = document.createElement("small");
    small.textContent = hint;
    box.appendChild(small);
  }
  result.appendChild(box);
}
```

Two things go wrong in real life, and this handles both (see how recipe 2 calls it): the `fetch`
throwing means Concord can't be reached; a `!response.ok` answer means Concord replied with its tidy
error envelope, `{ error: { message, … } }`, which you can read and show kindly.

## 4. Compare translations side by side

*What it does: shows one reference in several translations as columns — honestly, even when a
translation doesn't include the verse.*

```js
const TRANSLATIONS = ["KJV", "WEB", "ASV"];

// Concord sends "[verse not included…]" (or, rarely, null) when a translation omits a verse.
function isMissing(text) {
  return text === null || text === undefined || text === "[verse not included in this translation]";
}

// data = await (await fetch(`${CONCORD}/v1/verses/${encodeURIComponent(ref)}?translations=${TRANSLATIONS.join(",")}`)).json();
for (const v of data.verses) {
  const cols = document.createElement("div");
  cols.className = "columns";
  for (const t of TRANSLATIONS) {
    const col = document.createElement("div");
    col.className = "col";
    const h3 = document.createElement("h3");
    h3.textContent = t;
    const body = document.createElement("div");
    if (isMissing(v.text[t])) {
      body.className = "missing";
      body.textContent = "(this translation doesn't include this verse)";
    } else {
      body.textContent = v.text[t];
    }
    col.appendChild(h3);
    col.appendChild(body);
    cols.appendChild(col);
  }
  result.appendChild(cols);
}
```

Style `.columns` as a grid (e.g. `display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;`)
and they sit side by side.

## 5. The honest-place renderer

*What it does: shows where a passage happened — with coordinates when Concord knows, and an honest
note (never a fake location) when it doesn't.*

```js
// Turn 37.97 / 23.73 into "37.97°N, 23.73°E" — readable, and never reversible by accident.
function coords(lat, lon) {
  const ns = lat >= 0 ? "N" : "S", ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${ns}, ${Math.abs(lon).toFixed(2)}°${ew}`;
}

// Each place has a `status`. Some Concord can locate; the rest it honestly leaves unplaced.
function describePlace(p) {
  if (p.status === "identified") {
    return `${coords(p.latitude, p.longitude)} — we know roughly where this was.`;
  }
  if (p.status === "disputed") {
    return `${coords(p.latitude, p.longitude)} (disputed — scholars place it differently; this is a best guess).`;
  }
  if (p.status === "unknown") {
    return "Location lost to history — Concord doesn't invent a spot for it.";
  }
  if (p.status === "symbolic") {
    return "A figurative name, not a physical place.";
  }
  return "Refers to several places, so there's no single spot to show.";
}

// data = await (await fetch(`${CONCORD}/v1/verses/${encodeURIComponent(ref)}/places`)).json();
for (const p of data.places) {
  const box = document.createElement("div");
  box.className = "place";
  const name = document.createElement("div");
  name.textContent = p.type ? `${p.name} (${p.type})` : p.name;
  const where = document.createElement("div");
  where.textContent = describePlace(p);
  box.appendChild(name);
  box.appendChild(where);
  result.appendChild(box);
}
```

The `unknown`, `symbolic`, and `multiple` statuses come back with no coordinates on purpose — so this
renderer never shows a coordinate it doesn't have. That honesty is the point.

## 6. The zero-JavaScript search form

*What it does: searches Scripture with no code at all — just an HTML form that lands the browser on
the results.*

```html
<form method="get" action="http://localhost:8000/v1/search">
  <input name="q" placeholder="a word to find">
  <button>Search</button>
</form>
```

Submit it and the browser navigates straight to Concord's JSON results. This works because the
word-search endpoint takes its query as a `?q=…` parameter, which is exactly what an HTML form sends.
(It works for `?q=` search, not for the `/v1/verses/{ref}` address — that one puts the reference in
the path, not in a parameter.)
