// Regenerate every lesson screenshot against a LIVE Concord. MAINTAINER tooling only.
// Usage: npm run shots   (needs: npm install, npx playwright install, Concord on :8000)
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { startServer } from "./server.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LESSONS = join(HERE, "..", "..", "lessons");
const CONCORD = "http://localhost:8000";
const PORT = 8099; // maintainer server port — unrelated to the learner's :5500
const WIDTH = 760;

const img1 = (name) => join(LESSONS, "01-is-it-on", "images", name);
const img2 = (name) => join(LESSONS, "02-show-me-a-verse", "images", name);
const img3 = (name) => join(LESSONS, "03-find-by-idea", "images", name);
const img4 = (name) => join(LESSONS, "04-compare-and-where", "images", name);
const img5 = (name) => join(LESSONS, "05-drop-the-pins", "images", name);

// Lesson 3 demo queries — must show a stark word-vs-meaning contrast in WEB (verified live).
const HEADLINE_Q = "feeling alone and forgotten";
const SECOND_Q = "being patient with difficult people";

// Lesson 4 references (verified live on v1.0.2): a lost-place win, a located case, a no-places case.
const L4_WIN = "Genesis 4:16";        // translations differ; Eden & Nod both honestly lost
const L4_LOCATED = "Acts 17:22";      // Athens & Areopagus — real coordinates
const L4_NOPLACES = "John 3:16";      // 0 places — about an idea

// Lesson 5 references: a striking located route for the win, a lost-places case for the honest list.
const L5_WIN = "Acts 17";             // 6 located places across Greece — pins trace a route
const L5_LOST = "Genesis 4:16";       // Eden & Nod — no pins; the honest off-map list

// Lesson 4's two sections have both settled.
const appSettled = () => {
  const c = document.getElementById("compare").textContent;
  const w = document.getElementById("where").textContent;
  return c && w && !c.includes("Looking up") && !w.includes("Looking up");
};

// Both panes have settled (not mid-"Searching…") and have content.
const panesSettled = () => {
  const k = document.getElementById("keyword").textContent;
  const m = document.getElementById("meaning").textContent;
  return k.length > 0 && m.length > 0 && !k.includes("Searching") && !m.includes("Searching");
};

async function main() {
  const server = await startServer(LESSONS, PORT);
  // PW_CHANNEL lets a maintainer use a system browser (e.g. PW_CHANNEL=chrome) on an OS that
  // lacks Playwright's bundled builds; default is Playwright's own Chromium.
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  const viewport = { width: WIDTH, height: 600 };

  // ---- Lesson 1: raw responses straight from Concord, as the browser shows them ----
  // Own context: navigating directly to a Concord URL caches it WITHOUT CORS headers, which would
  // otherwise poison Lesson 2's cross-origin fetch of the same URL. Separate contexts = separate caches.
  const ctx1 = await browser.newContext({ viewport });
  const p1 = await ctx1.newPage();
  await p1.goto(`${CONCORD}/healthz`, { waitUntil: "load" });
  await p1.screenshot({ path: img1("healthz.png") });

  await p1.goto(`${CONCORD}/v1/verses/${encodeURIComponent("John 3:16")}`, { waitUntil: "load" });
  await p1.screenshot({ path: img1("verse-json.png") });
  await ctx1.close();

  // ---- Lesson 2: drive the real verse.html through each checkpoint (fresh context, clean cache) ----
  const ctx = await browser.newContext({ viewport });
  const url = `http://localhost:${PORT}/02-show-me-a-verse/verse.html`;
  const p2 = await ctx.newPage();

  await p2.goto(url, { waitUntil: "load" });
  await p2.screenshot({ path: img2("on-load.png"), fullPage: true });

  await p2.click("#go");
  await p2.waitForSelector(".verse");
  await p2.screenshot({ path: img2("verse-shown.png"), fullPage: true });

  await p2.fill("#ref", "John 3:16-17");
  await p2.click("#go");
  await p2.waitForFunction(() => document.querySelectorAll(".verse").length === 2);
  await p2.screenshot({ path: img2("range.png"), fullPage: true });

  await p2.fill("#ref", "Hesitations 9:99");
  await p2.click("#go");
  await p2.waitForSelector(".message");
  await p2.screenshot({ path: img2("not-found.png"), fullPage: true });
  await p2.close();

  // Concord unreachable: block the calls (don't touch verse.html, don't stop the real server).
  const p3 = await ctx.newPage();
  await p3.route(`${CONCORD}/**`, (route) => route.abort());
  await p3.goto(url, { waitUntil: "load" });
  await p3.click("#go");
  await p3.waitForSelector(".message");
  await p3.screenshot({ path: img2("concord-unreachable.png"), fullPage: true });
  await p3.close();

  // ---- Lesson 3: drive the real search.html (own context, clean cache) ----
  const ctx3 = await browser.newContext({ viewport });
  const surl = `http://localhost:${PORT}/03-find-by-idea/search.html`;
  const p4 = await ctx3.newPage();

  await p4.goto(surl, { waitUntil: "load" });
  await p4.screenshot({ path: img3("on-load.png"), fullPage: true });

  await p4.click("#go"); // searches the pre-filled headline query
  await p4.waitForFunction(panesSettled);
  await p4.screenshot({ path: img3("contrast.png"), fullPage: true });

  await p4.fill("#q", SECOND_Q);
  await p4.click("#go");
  await p4.waitForFunction(panesSettled);
  await p4.screenshot({ path: img3("second-query.png"), fullPage: true });
  await ctx3.close();

  // ---- Lesson 4: drive the real app.html (own context, clean cache) ----
  const ctx4 = await browser.newContext({ viewport });
  const aurl = `http://localhost:${PORT}/04-compare-and-where/app.html`;
  const p5 = await ctx4.newPage();

  await p5.goto(aurl, { waitUntil: "load" });
  await p5.screenshot({ path: img4("on-load.png"), fullPage: true });

  await p5.click("#go"); // the pre-filled win (Genesis 4:16): translations + two lost places
  await p5.waitForFunction(appSettled);
  await p5.screenshot({ path: img4("win.png"), fullPage: true });

  await p5.fill("#ref", L4_LOCATED);
  await p5.click("#go");
  await p5.waitForFunction(appSettled);
  await p5.screenshot({ path: img4("located.png"), fullPage: true });

  await p5.fill("#ref", L4_NOPLACES);
  await p5.click("#go");
  await p5.waitForFunction(appSettled);
  await p5.screenshot({ path: img4("no-places.png"), fullPage: true });
  await ctx4.close();

  // ---- Lesson 5: drive the real app-map.html (own context; needs internet for tiles) ----
  const ctx5 = await browser.newContext({ viewport: { width: WIDTH, height: 720 } });
  const murl = `http://localhost:${PORT}/05-drop-the-pins/app-map.html`;
  const p6 = await ctx5.newPage();

  await p6.goto(murl, { waitUntil: "load" });
  await p6.waitForTimeout(2000); // let the initial tiles paint
  await p6.screenshot({ path: img5("on-load.png"), fullPage: true });

  await p6.click("#go"); // the pre-filled win (Acts 17): pins across Greece
  await p6.waitForFunction(() => document.querySelectorAll(".leaflet-marker-icon").length >= 2);
  await p6.waitForTimeout(2000); // let tiles for the fitted view paint
  await p6.screenshot({ path: img5("win.png"), fullPage: true });

  await p6.fill("#ref", L5_LOST);
  await p6.click("#go"); // Genesis 4:16 — no pins, the honest off-map list
  await p6.waitForFunction(() => {
    const lost = document.getElementById("lost");
    return !lost.hidden && lost.textContent.includes("lost to history");
  });
  await p6.waitForTimeout(1000);
  await p6.screenshot({ path: img5("lost-list.png"), fullPage: true });
  await ctx5.close();

  await browser.close();
  server.close();
  console.log("Saved screenshots to lessons/*/images/");
}

main().catch((e) => { console.error(e); process.exit(1); });
