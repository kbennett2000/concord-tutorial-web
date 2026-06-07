// Contract check: assert the /v1 response SHAPES the lessons parse, directly against a LIVE
// Concord (the pinned v1.0.2 image in CI). This complements smoke.mjs: the smoke checks rendered
// DOM, so a shape drift surfaces there as a cryptic "L2 verse shows = false"; this names the exact
// field that moved (e.g. "/v1/verses → verses[0].text should be a translation-keyed object").
// MAINTAINER tooling only. Usage: npm run contract   (needs Concord on :8000)
//
// Every check below mirrors a field a lesson actually reads — see the (Lesson N) tags. Refs are
// encoded with encodeURIComponent, exactly as the lessons do.

const CONCORD = "http://localhost:8000"; // change this only if Concord runs on another computer

let passed = 0;
const failures = [];

// Record one assertion. `where` is the endpoint, `what` names the field/shape expected.
function check(where, what, ok) {
  if (ok) passed++;
  else failures.push(`${where} → ${what}`);
}

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isNumber = (v) => typeof v === "number" && !Number.isNaN(v);

// GET a path and parse JSON. Returns { res, data }; data is null if the body wasn't JSON.
async function get(path) {
  const res = await fetch(`${CONCORD}${path}`);
  let data = null;
  try { data = await res.json(); } catch { /* leave null */ }
  return { res, data };
}

const ref = (r) => encodeURIComponent(r);

async function main() {
  // ---- /healthz: Concord is up and answers JSON (the front-door + troubleshooting check) ----
  {
    const { res, data } = await get("/healthz");
    check("/healthz", "responds 200", res.status === 200);
    check("/healthz", "returns a JSON object", isObject(data));
  }

  // ---- Lesson 2: GET /v1/verses/{ref} ----
  {
    const { res, data } = await get(`/v1/verses/${ref("John 3:16")}`);
    check("/v1/verses/{ref}", "responds 200", res.status === 200);
    const verses = data && data.verses;
    check("/v1/verses/{ref}", "verses is a non-empty array", Array.isArray(verses) && verses.length > 0);
    const v = Array.isArray(verses) ? verses[0] : null;
    check("/v1/verses/{ref}", "verses[0].reference is a string", v && typeof v.reference === "string");
    check("/v1/verses/{ref}", "verses[0].text is a translation-keyed object", v && isObject(v.text)); // (Lesson 2/4)
  }

  // ---- Lesson 2: a range returns multiple verses (the loop just works) ----
  {
    const { data } = await get(`/v1/verses/${ref("John 3:16-17")}`);
    const verses = data && data.verses;
    check("/v1/verses/{range}", "a 2-verse range returns verses.length === 2", Array.isArray(verses) && verses.length === 2);
  }

  // ---- Lesson 4: GET /v1/verses/{ref}?translations=KJV,WEB,ASV → text keyed per translation ----
  {
    const { data } = await get(`/v1/verses/${ref("John 3:16")}?translations=KJV,WEB,ASV`);
    const v = data && Array.isArray(data.verses) ? data.verses[0] : null;
    const text = v && v.text;
    check("/v1/verses?translations=", "verses[0].text has the requested translation keys (KJV/WEB/ASV)",
      isObject(text) && ["KJV", "WEB", "ASV"].every((t) => t in text));
  }

  // ---- Lesson 3: GET /v1/search (keyword / full-text) ----
  {
    const { res, data } = await get(`/v1/search?q=${ref("love")}&translation=WEB`);
    check("/v1/search", "responds 200", res.status === 200);
    check("/v1/search", "total is a number", data && isNumber(data.total));
    const hits = data && data.hits;
    check("/v1/search", "hits is a non-empty array", Array.isArray(hits) && hits.length > 0);
    const h = Array.isArray(hits) ? hits[0] : null;
    check("/v1/search", "hits[0].reference is a string", h && typeof h.reference === "string");
    check("/v1/search", "hits[0].snippet is a string", h && typeof h.snippet === "string");
  }

  // ---- Lesson 3: GET /v1/semantic-search (meaning) — note .count/.results, NOT .total/.hits ----
  {
    const { res, data } = await get(`/v1/semantic-search?q=${ref("feeling alone and forgotten")}&translation=WEB`);
    check("/v1/semantic-search", "responds 200", res.status === 200);
    check("/v1/semantic-search", "count is a number", data && isNumber(data.count));
    const results = data && data.results;
    check("/v1/semantic-search", "results is a non-empty array", Array.isArray(results) && results.length > 0);
    const r = Array.isArray(results) ? results[0] : null;
    check("/v1/semantic-search", "results[0].reference is a string", r && typeof r.reference === "string");
    check("/v1/semantic-search", "results[0].score is a number", r && isNumber(r.score));
    // text may be a string or absent (the lesson renders "(not in WEB)" when it's missing) — the
    // key shape we depend on is that, when present, it's a string.
    check("/v1/semantic-search", "results[0].text is a string when present",
      r && (r.text === null || r.text === undefined || typeof r.text === "string"));
  }

  // ---- Lessons 4 & 5: GET /v1/verses/{ref}/places — located places carry real coordinates ----
  {
    const { res, data } = await get(`/v1/verses/${ref("Acts 17:22")}/places`); // Athens & Areopagus
    check("/v1/verses/{ref}/places", "responds 200", res.status === 200);
    check("/v1/verses/{ref}/places", "total is a number", data && isNumber(data.total));
    const places = data && data.places;
    check("/v1/verses/{ref}/places", "places is a non-empty array", Array.isArray(places) && places.length > 0);
    const located = Array.isArray(places)
      ? places.find((p) => p.status === "identified" || p.status === "disputed")
      : null;
    check("/v1/verses/{ref}/places", "a located place has a status string", located && typeof located.status === "string");
    check("/v1/verses/{ref}/places", "a located place has a name string", located && typeof located.name === "string");
    check("/v1/verses/{ref}/places", "an identified/disputed place has numeric latitude & longitude",
      located && isNumber(located.latitude) && isNumber(located.longitude));
  }

  // ---- Lessons 4 & 5: the honesty model — places with no coordinates come back as null, never faked ----
  {
    const { data } = await get(`/v1/verses/${ref("Genesis 4:16")}/places`); // Eden & Nod — lost to history
    const places = data && Array.isArray(data.places) ? data.places : [];
    const lost = places.find((p) => p.status === "unknown" || p.status === "symbolic" || p.status === "multiple");
    check("/v1/verses/{ref}/places (lost)", "a place without a location is present", Boolean(lost));
    check("/v1/verses/{ref}/places (lost)", "an unknown/symbolic/multiple place has null latitude & longitude",
      lost && lost.latitude === null && lost.longitude === null);
  }

  // ---- Report ----
  const total = passed + failures.length;
  if (failures.length === 0) {
    console.log(`PASS  contract  (${passed}/${total} shape checks against ${CONCORD})`);
    return;
  }
  console.log(`FAIL  contract  (${passed}/${total} passed) — /v1 shapes drifted from what the lessons parse:`);
  for (const f of failures) console.log(`  ❌ ${f}`);
  process.exit(1);
}

main().catch((e) => {
  console.error("contract check could not run (is Concord on :8000?):", e.message);
  process.exit(1);
});
