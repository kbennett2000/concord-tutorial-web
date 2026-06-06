// Minimal static file server — a MAINTAINER detail for screenshot capture only.
// This is NOT the learner's run path (that's VS Code Live Server / python3, see SETUP.md).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, normalize, join } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

// Serve files under `root` on `port`. Returns the http.Server (await its 'listening').
export function startServer(root, port) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      // Keep requests inside root; default a trailing slash to index.html.
      const rel = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
      const file = join(root, rel.endsWith("/") ? rel + "index.html" : rel);
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("not found");
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}
