// Three-engine functional check for the lesson pages against a LIVE Concord.
// Runs the scenarios in Chromium, Firefox, and WebKit (this is how we cover Safari on Linux).
// MAINTAINER tooling only. Usage: npm run smoke   (needs Concord on :8000)
import { chromium, firefox, webkit } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { startServer } from "./server.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LESSONS = join(HERE, "..", "..", "lessons");
const CONCORD = "http://localhost:8000";
const PORT = 8099;
const VERSE_URL = `http://localhost:${PORT}/02-show-me-a-verse/verse.html`;
const SEARCH_URL = `http://localhost:${PORT}/03-find-by-idea/search.html`;
const APP_URL = `http://localhost:${PORT}/04-compare-and-where/app.html`;

// Lesson 3 queries (verified live in WEB): HEADLINE shows the contrast; EMPTY_KEYWORD has zero
// word-search hits but rich meaning hits (the teaching empty state).
const HEADLINE_Q = "feeling alone and forgotten";
const EMPTY_KEYWORD_Q = "being patient with difficult people";

// Lesson 4 references (verified live on v1.0.2).
const L4_WIN = "Genesis 4:16";    // Eden & Nod — both honestly lost (no coordinates)
const L4_LOCATED = "Acts 17:22";  // Athens & Areopagus — real coordinates
const L4_NOPLACES = "John 3:16";  // 0 places — about an idea

const APP_MAP_URL = `http://localhost:${PORT}/05-drop-the-pins/app-map.html`;
const L5_WIN = "Acts 17";         // 6 located places — pins
const L5_LOST = "Genesis 4:16";   // Eden & Nod — honest off-map list, no pins
const L5_NOPLACES = "John 3:16";  // 0 places

async function showAndRead(page, ref) {
  await page.fill("#ref", ref);
  // Clear the previous result so we wait for THIS request's render, not stale content.
  await page.evaluate(() => { document.getElementById("result").innerHTML = ""; });
  await page.click("#go");
  await page.waitForFunction(() => document.getElementById("result").textContent.trim().length > 0);
  return page.textContent("#result");
}

async function runEngine(launcher, name, launchOpts = {}) {
  const browser = await launcher.launch(launchOpts);
  const page = await browser.newPage();
  const checks = {};
  try {
    // ---- Lesson 2: verse.html ----
    await page.goto(VERSE_URL, { waitUntil: "load" });

    const single = await showAndRead(page, "John 3:16");
    checks["L2 verse shows"] = single.includes("For God so loved the world");

    await page.fill("#ref", "John 3:16-17");
    await page.click("#go");
    await page.waitForFunction(() => document.querySelectorAll(".verse").length === 2);
    checks["L2 range = 2 verses"] = true;

    const bad = await showAndRead(page, "Hesitations 9:99");
    checks["L2 friendly not-found"] = bad.includes("couldn't find that");

    await page.route(`${CONCORD}/**`, (r) => r.abort());
    const down = await showAndRead(page, "John 3:16");
    checks["L2 friendly is-it-running"] = down.includes("is it running");

    // ---- Lesson 3: search.html (fresh page so the verse route-abort above doesn't apply) ----
    const sp = await browser.newPage();
    const search = async (q) => {
      await sp.fill("#q", q);
      await sp.evaluate(() => {
        document.getElementById("keyword").innerHTML = "";
        document.getElementById("meaning").innerHTML = "";
      });
      await sp.click("#go");
      await sp.waitForFunction(() => {
        const k = document.getElementById("keyword").textContent;
        const m = document.getElementById("meaning").textContent;
        return k && m && !k.includes("Searching") && !m.includes("Searching");
      });
    };
    await sp.goto(SEARCH_URL, { waitUntil: "load" });

    await search(HEADLINE_Q);
    checks["L3 meaning pane populates"] = (await sp.locator("#meaning .hit").count()) > 0;

    await search(EMPTY_KEYWORD_Q);
    checks["L3 empty keyword teaches"] = (await sp.textContent("#keyword")).includes("comes up empty");

    await sp.route(`${CONCORD}/**`, (r) => r.abort());
    await search(HEADLINE_Q);
    checks["L3 friendly is-it-running"] = (await sp.textContent("#meaning")).includes("is it running");
    await sp.close();

    // ---- Lesson 4: app.html (fresh page; also record every request URL for the offline check) ----
    const ap = await browser.newPage();
    const hosts = new Set();
    ap.on("request", (r) => { try { hosts.add(new URL(r.url()).hostname); } catch {} });
    const lookUp = async (ref) => {
      await ap.fill("#ref", ref);
      await ap.evaluate(() => {
        document.getElementById("compare").innerHTML = "";
        document.getElementById("where").innerHTML = "";
      });
      await ap.click("#go");
      await ap.waitForFunction(() => {
        const c = document.getElementById("compare").textContent;
        const w = document.getElementById("where").textContent;
        return c && w && !c.includes("Looking up") && !w.includes("Looking up");
      });
    };
    await ap.goto(APP_URL, { waitUntil: "load" });

    await lookUp(L4_WIN);
    checks["L4 three translations"] = (await ap.locator("#compare .col").count()) === 3;
    checks["L4 lost place honest"] = (await ap.textContent("#where")).includes("lost to history");

    await lookUp(L4_LOCATED);
    checks["L4 located has coordinates"] = /\d+\.\d+°[NS], \d+\.\d+°[EW]/.test(await ap.textContent("#where"));

    await lookUp(L4_NOPLACES);
    checks["L4 no-places honest"] = (await ap.textContent("#where")).includes("about an idea");

    // Offline: the only hosts contacted are localhost (served page + Concord) — no CDN/fonts/tiles.
    checks["L4 fully offline (localhost only)"] = [...hosts].every((h) => h === "localhost" || h === "127.0.0.1");

    await ap.route(`${CONCORD}/**`, (r) => r.abort());
    await lookUp(L4_WIN);
    checks["L4 friendly is-it-running"] = (await ap.textContent("#compare")).includes("is it running");
    await ap.close();

    // ---- Lesson 5: app-map.html (Leaflet map; external requests EXPECTED — no offline assert) ----
    const mp = await browser.newPage();
    const showMap = async (ref) => {
      await mp.fill("#ref", ref);
      await mp.click("#go");
    };
    await mp.goto(APP_MAP_URL, { waitUntil: "load" });
    // The height gotcha: the map box must actually have height, or Leaflet draws nothing.
    checks["L5 map has height"] = (await mp.evaluate(() => document.getElementById("map").offsetHeight)) > 0;

    await showMap(L5_WIN);
    await mp.waitForFunction(() => document.querySelectorAll(".leaflet-marker-icon").length >= 2);
    checks["L5 located places become pins"] = (await mp.locator(".leaflet-marker-icon").count()) >= 2;

    await showMap(L5_LOST);
    await mp.waitForFunction(() => {
      const l = document.getElementById("lost");
      return !l.hidden && l.textContent.includes("lost to history");
    });
    checks["L5 lost places listed, not pinned"] =
      (await mp.locator(".leaflet-marker-icon").count()) === 0 &&
      (await mp.textContent("#lost")).includes("Eden");

    await showMap(L5_NOPLACES);
    await mp.waitForFunction(() => document.getElementById("msg").textContent.includes("No places to map"));
    checks["L5 no-places honest"] = true;

    await mp.route(`${CONCORD}/**`, (r) => r.abort());
    await showMap(L5_WIN);
    await mp.waitForFunction(() => document.getElementById("msg").textContent.includes("is it running"));
    checks["L5 friendly is-it-running"] = true;
    await mp.close();
  } finally {
    await browser.close();
  }
  return checks;
}

async function main() {
  const server = await startServer(LESSONS, PORT);
  // PW_CHANNEL (e.g. "chrome") routes the Chromium engine to a system browser when Playwright's
  // bundled builds aren't available for this OS; the other engines always use Playwright's builds.
  const chromeOpts = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};
  const engines = [[chromium, "Chromium", chromeOpts], [firefox, "Firefox", {}], [webkit, "WebKit", {}]];
  let allPass = true;
  for (const [launcher, name, opts] of engines) {
    const checks = await runEngine(launcher, name, opts);
    const pass = Object.values(checks).every(Boolean);
    allPass = allPass && pass;
    const detail = Object.entries(checks).map(([k, v]) => `${v ? "✅" : "❌"} ${k}`).join("  ");
    console.log(`${pass ? "PASS" : "FAIL"}  ${name.padEnd(9)} ${detail}`);
  }
  server.close();
  if (!allPass) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
